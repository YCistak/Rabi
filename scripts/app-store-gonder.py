# TestFlight'a yüklenen derlemeyi App Store incelemesine gönderiyor
# (`app-store-gonder.yml`). Hepsi App Store Connect API'siyle, derlemenin
# kullandığı aynı anahtarla:
#
# 1. Derleme App Store Connect'te işlenip VALID olana kadar bekle.
# 2. App Store sürümünü (SURUM) bul; yoksa düzenlenebilir sürümü bu numaraya
#    çevir, o da yoksa oluştur. Yayın türüne (elle / otomatik) dokunulmuyor.
# 3. Mevcut her dildeki "Bu sürümdeki yenilikler" alanına Play'in sürüm notunu
#    (android/surum-notlari/whatsnew-tr-TR) yaz — iki mağaza aynı metni söylesin.
# 4. Derlemeyi sürüme bağla ve incelemeye gönder (reviewSubmissions API'si).
#
# Ortam: SURUM (ör. 1.0.3), DERLEME (ör. 106.42; boşsa o sürümün en yeni
# derlemesi), ANAHTAR (.p8 içeriği), ANAHTAR_KIMLIGI, YAYINCI.
# Herhangi bir adım düşerse Apple'ın hata metni olduğu gibi yazılıp çıkılıyor.
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

import jwt

KOK = 'https://api.appstoreconnect.apple.com/v1'
PAKET = 'com.fluxifyinteractive.rabi'
NOT_DOSYASI = 'android/surum-notlari/whatsnew-tr-TR'
BEKLEME_SINIRI = 90 * 60  # işleme genelde 5-20 dk; bir saati aşarsa bir sorun var
ARALIK = 60

SURUM = os.environ['SURUM'].strip().lstrip('v')
DERLEME = os.environ.get('DERLEME', '').strip()
# İncelemeyi bekleyen eski bir sürüm varsa Apple yeni sürüm açtırmıyor (409).
# Bu bayrakla o gönderim iptal edilir; sürüm düzenlenebilir hâle düşer ve
# aşağıda yeni sürüm numarasına çevrilir. Yayındaki sürüm etkilenmez.
GERI_CEK = os.environ.get('GERI_CEK', '').strip().lower() in ('1', 'true', 'evet')
OZET = os.environ.get('GITHUB_STEP_SUMMARY')


def belirtec():
    # Belirteç en çok 20 dk geçerli; bekleme daha uzun sürebildiği için her
    # istekte yenisi üretiliyor.
    simdi = int(time.time())
    return jwt.encode(
        {'iss': os.environ['YAYINCI'], 'iat': simdi, 'exp': simdi + 900,
         'aud': 'appstoreconnect-v1'},
        os.environ['ANAHTAR'], algorithm='ES256',
        headers={'kid': os.environ['ANAHTAR_KIMLIGI'], 'typ': 'JWT'})


def istek(yol, govde=None, yontem=None):
    veri = json.dumps(govde).encode() if govde is not None else None
    r = urllib.request.Request(
        KOK + yol, data=veri, method=yontem,
        headers={'Authorization': 'Bearer ' + belirtec(),
                 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(r) as yanit:
            govde = yanit.read()
            return yanit.status, json.loads(govde) if govde else {}
    except urllib.error.HTTPError as h:
        return h.code, h.read().decode()


def ozet(satir):
    print(satir)
    if OZET:
        with open(OZET, 'a') as f:
            f.write(satir + '\n\n')


def dur(adim, kod, yanit):
    print(f'::error::{adim} başarısız ({kod})')
    print(yanit if isinstance(yanit, str) else json.dumps(yanit, indent=2, ensure_ascii=False))
    ozet(f'**{adim} başarısız ({kod})**\n\n```\n{yanit}\n```')
    sys.exit(1)


def al(yol, adim):
    kod, yanit = istek(yol)
    if kod != 200:
        dur(adim, kod, yanit)
    return yanit


def sorgu(**p):
    return urllib.parse.urlencode({k.replace('__', '.'): v for k, v in p.items()})


# --- Uygulama -------------------------------------------------------------
uygulama = al('/apps?' + urllib.parse.urlencode({'filter[bundleId]': PAKET}),
              'Uygulamayı bulma')['data']
uygulama = next((u for u in uygulama if u['attributes']['bundleId'] == PAKET), None)
if uygulama is None:
    dur('Uygulamayı bulma', 404, f'{PAKET} App Store Connect\'te yok')
uygulama_id = uygulama['id']
print(f'Uygulama: {uygulama["attributes"]["name"]} ({uygulama_id}) · sürüm {SURUM} · derleme {DERLEME or "en yeni"}')

# --- 1. Derlemeyi bekle -----------------------------------------------------
# Yüklemeden hemen sonra derleme listede hiç görünmeyebiliyor; önce belirmesi,
# sonra işlenmesi bekleniyor.
filtre = {'filter[app]': uygulama_id, 'filter[preReleaseVersion.version]': SURUM,
          'sort': '-uploadedDate', 'limit': '1'}
if DERLEME:
    filtre['filter[version]'] = DERLEME
baslangic = time.time()
while True:
    liste = al('/builds?' + urllib.parse.urlencode(filtre), 'Derlemeyi okuma')['data']
    durum = liste[0]['attributes']['processingState'] if liste else 'YOK'
    print(f'Derleme durumu: {durum} ({int(time.time() - baslangic)} sn)')
    if durum == 'VALID':
        break
    if durum in ('FAILED', 'INVALID'):
        dur('Derleme işleme', 0, f'Apple derlemeyi işleyemedi: {durum}')
    if time.time() - baslangic > BEKLEME_SINIRI:
        dur('Derleme bekleme', 0, f'{BEKLEME_SINIRI // 60} dk içinde VALID olmadı (son durum: {durum})')
    time.sleep(ARALIK)
derleme = liste[0]
derleme_no = derleme['attributes']['version']
print(f'Derleme hazır: {SURUM} ({derleme_no})')

# Info.plist'te ITSAppUsesNonExemptEncryption=false var, Apple alanı ondan
# dolduruyor. Boş kalmışsa (eski derleme) burada yanıtla, gönderim takılmasın.
if derleme['attributes'].get('usesNonExemptEncryption') is None:
    kod, yanit = istek('/builds/' + derleme['id'], {'data': {
        'type': 'builds', 'id': derleme['id'],
        'attributes': {'usesNonExemptEncryption': False}}}, 'PATCH')
    print('İhracat uyumu yanıtlandı' if kod == 200 else f'::warning::İhracat uyumu yazılamadı: {kod} {yanit}')

# --- 2. App Store sürümü ----------------------------------------------------
surumler = al(f'/apps/{uygulama_id}/appStoreVersions?' + urllib.parse.urlencode(
    {'filter[platform]': 'IOS', 'limit': '200'}), 'Sürümleri okuma')['data']
# Apple aynı anda tek düzenlenebilir sürüme izin veriyor.
DUZENLENEBILIR = {'PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED',
                  'METADATA_REJECTED', 'INVALID_BINARY'}
INCELEMEDE = {'WAITING_FOR_REVIEW', 'IN_REVIEW', 'PENDING_DEVELOPER_RELEASE',
              'PENDING_APPLE_RELEASE', 'PROCESSING_FOR_APP_STORE',
              'READY_FOR_SALE', 'READY_FOR_DISTRIBUTION', 'ACCEPTED'}


def durum_of(s):
    a = s['attributes']
    return a.get('appStoreState') or a.get('appVersionState') or '?'


def surumleri_oku():
    return al(f'/apps/{uygulama_id}/appStoreVersions?' + urllib.parse.urlencode(
        {'filter[platform]': 'IOS', 'limit': '200'}), 'Sürümleri okuma')['data']


bekleyen = [s for s in surumler if durum_of(s) == 'WAITING_FOR_REVIEW'
            and s['attributes']['versionString'] != SURUM]
if GERI_CEK and bekleyen:
    gonderimler = al('/reviewSubmissions?' + urllib.parse.urlencode({
        'filter[app]': uygulama_id, 'filter[platform]': 'IOS',
        'filter[state]': 'WAITING_FOR_REVIEW', 'limit': '10'}), 'Bekleyen gönderimleri okuma')['data']
    for g in gonderimler:
        kod, yanit = istek('/reviewSubmissions/' + g['id'], {'data': {
            'type': 'reviewSubmissions', 'id': g['id'],
            'attributes': {'canceled': True}}}, 'PATCH')
        if kod != 200:
            dur('Bekleyen gönderimi geri çekme', kod, yanit)
        print(f'Bekleyen gönderim geri çekildi: {g["id"]}')
    # İptal eşzamansız; sürüm düzenlenebilir hâle düşene kadar bekle.
    baslangic = time.time()
    while True:
        surumler = surumleri_oku()
        hala = [s['attributes']['versionString'] for s in surumler
                if durum_of(s) in ('WAITING_FOR_REVIEW', 'IN_REVIEW')]
        if not hala:
            break
        if time.time() - baslangic > 15 * 60:
            dur('Geri çekmeyi bekleme', 0, f'15 dk içinde düşmedi: {hala}')
        time.sleep(20)


for s in surumler:
    print(f'  mevcut sürüm {s["attributes"]["versionString"]}: {durum_of(s)}')
ilk_surum = not any(durum_of(s) in INCELEMEDE - {'WAITING_FOR_REVIEW', 'IN_REVIEW'}
                    for s in surumler)

surum = next((s for s in surumler if s['attributes']['versionString'] == SURUM), None)
if surum is not None and durum_of(surum) in INCELEMEDE:
    ozet(f'Sürüm {SURUM} zaten gönderilmiş: **{durum_of(surum)}**. Yapılacak bir şey yok.')
    sys.exit(0)
if surum is None:
    acik = next((s for s in surumler if durum_of(s) in DUZENLENEBILIR), None)
    if acik is not None:
        eski = acik['attributes']['versionString']
        kod, yanit = istek('/appStoreVersions/' + acik['id'], {'data': {
            'type': 'appStoreVersions', 'id': acik['id'],
            'attributes': {'versionString': SURUM}}}, 'PATCH')
        if kod != 200:
            dur(f'Düzenlenebilir sürümü {eski} → {SURUM} yapma', kod, yanit)
        surum = yanit['data']
        print(f'Düzenlenebilir sürüm {eski} → {SURUM} olarak güncellendi')
    else:
        kod, yanit = istek('/appStoreVersions', {'data': {
            'type': 'appStoreVersions',
            'attributes': {'platform': 'IOS', 'versionString': SURUM},
            'relationships': {'app': {'data': {'type': 'apps', 'id': uygulama_id}}}}})
        if kod != 201:
            dur('Sürüm oluşturma', kod, yanit)
        surum = yanit['data']
        print(f'Sürüm {SURUM} oluşturuldu')
surum_id = surum['id']

# --- 3. Sürüm notu ----------------------------------------------------------
notu = open(NOT_DOSYASI, encoding='utf-8').read().strip()
# App Store 2.3.10: metinde başka platform/mağaza adı geçerse inceleme reddeder.
yasak = [k for k in ('Android', 'Google Play', 'Play Store') if k.lower() in notu.lower()]
if yasak:
    dur('Sürüm notu denetimi', 0, f'{NOT_DOSYASI} şunları içeriyor: {", ".join(yasak)} (App Store 2.3.10)')
yerellerin = al(f'/appStoreVersions/{surum_id}/appStoreVersionLocalizations?limit=50',
                'Dilleri okuma')['data']
if not yerellerin:
    kod, yanit = istek('/appStoreVersionLocalizations', {'data': {
        'type': 'appStoreVersionLocalizations', 'attributes': {'locale': 'tr'},
        'relationships': {'appStoreVersion': {'data': {
            'type': 'appStoreVersions', 'id': surum_id}}}}})
    if kod != 201:
        dur('Türkçe dil kaydı oluşturma', kod, yanit)
    yerellerin = [yanit['data']]
for y in yerellerin:
    dil = y['attributes']['locale']
    if ilk_surum:
        # Mağazadaki ilk sürümde "yenilikler" alanı yok; Apple yazmayı reddediyor.
        print(f'  {dil}: ilk sürüm, yenilikler alanı atlandı')
        continue
    kod, yanit = istek('/appStoreVersionLocalizations/' + y['id'], {'data': {
        'type': 'appStoreVersionLocalizations', 'id': y['id'],
        'attributes': {'whatsNew': notu}}}, 'PATCH')
    if kod != 200:
        dur(f'{dil} yenilikler metni', kod, yanit)
    print(f'  {dil}: yenilikler yazıldı')

# --- 4. Derlemeyi bağla -----------------------------------------------------
kod, yanit = istek(f'/appStoreVersions/{surum_id}/relationships/build', {'data': {
    'type': 'builds', 'id': derleme['id']}}, 'PATCH')
if kod != 204:
    dur('Derlemeyi sürüme bağlama', kod, yanit)
print(f'Derleme {derleme_no} sürüm {SURUM}\'e bağlandı')

# --- 5. İncelemeye gönder ---------------------------------------------------
# Yarım kalmış bir gönderim (READY_FOR_REVIEW) varsa onu kullan; Apple aynı
# platformda ikinci bir taslak açmaya izin vermiyor.
gonderimler = al('/reviewSubmissions?' + urllib.parse.urlencode({
    'filter[app]': uygulama_id, 'filter[platform]': 'IOS',
    'filter[state]': 'READY_FOR_REVIEW,UNRESOLVED_ISSUES',
    'include': 'items', 'limit': '10'}), 'Gönderimleri okuma')
gonderim = next((g for g in gonderimler['data']
                 if g['attributes']['state'] == 'READY_FOR_REVIEW'), None)
if gonderim is None:
    kod, yanit = istek('/reviewSubmissions', {'data': {
        'type': 'reviewSubmissions', 'attributes': {'platform': 'IOS'},
        'relationships': {'app': {'data': {'type': 'apps', 'id': uygulama_id}}}}})
    if kod != 201:
        dur('Gönderim oluşturma', kod, yanit)
    gonderim = yanit['data']
gonderim_id = gonderim['id']

kod, yanit = istek('/reviewSubmissionItems', {'data': {
    'type': 'reviewSubmissionItems',
    'relationships': {
        'reviewSubmission': {'data': {'type': 'reviewSubmissions', 'id': gonderim_id}},
        'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': surum_id}}}}})
if kod == 409 and 'already' in str(yanit).lower():
    print('Sürüm zaten gönderimin içinde')
elif kod != 201:
    dur('Sürümü gönderime ekleme', kod, yanit)

kod, yanit = istek('/reviewSubmissions/' + gonderim_id, {'data': {
    'type': 'reviewSubmissions', 'id': gonderim_id,
    'attributes': {'submitted': True}}}, 'PATCH')
if kod != 200:
    dur('İncelemeye gönderme', kod, yanit)
print(f'Gönderim durumu: {yanit["data"]["attributes"].get("state")}')

son = al('/appStoreVersions/' + surum_id, 'Son durumu okuma')['data']
ozet(f'Sürüm {SURUM} ({derleme_no}) incelemeye gönderildi: **{durum_of(son)}**')
