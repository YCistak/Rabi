# TestFlight derlemesinden önce Apple hesabını App Store Connect API'siyle
# hazırlıyor (`ios-testflight.yml`). Portala giren herkesin Identifiers ve
# Devices sayfalarına yetkisi yok; derlemenin Admin anahtarının var.
#
# İki iş:
# - CIHAZ_UDID verildiyse cihazı kaydetmek. Arşivin geliştirme imzası hesapta
#   kayıtlı bir iPhone istiyor.
# - Üç kimlikte Family Controls yeteneğini açık tutmak. Kapalıysa App Store
#   profili yetkiyi taşımıyor ve dışa aktarma imzalamayı reddediyor.
#
# Hata derlemeyi durdurmuyor, ekrana yazılıyor: asıl hakem dışa aktarma ve
# arkasındaki yetki denetimi.
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request

import jwt

KOK = 'https://api.appstoreconnect.apple.com/v1'
KIMLIKLER = [
    'com.fluxifyinteractive.rabi',
    'com.fluxifyinteractive.rabi.OdakIzleyici',
    'com.fluxifyinteractive.rabi.KalkanGorunumu',
]

anahtar = open(os.path.join(os.environ['RUNNER_TEMP'], 'AuthKey.p8')).read()
simdi = int(time.time())
belirtec = jwt.encode(
    {'iss': os.environ['YAYINCI'], 'iat': simdi, 'exp': simdi + 600,
     'aud': 'appstoreconnect-v1'},
    anahtar, algorithm='ES256',
    headers={'kid': os.environ['ANAHTAR_KIMLIGI'], 'typ': 'JWT'})


def istek(yol, govde=None):
    veri = json.dumps(govde).encode() if govde is not None else None
    r = urllib.request.Request(
        KOK + yol, data=veri,
        headers={'Authorization': 'Bearer ' + belirtec,
                 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(r) as yanit:
            return yanit.status, json.loads(yanit.read() or b'{}')
    except urllib.error.HTTPError as h:
        return h.code, h.read().decode()


udid = os.environ.get('CIHAZ_UDID', '').strip()
if udid:
    kod, yanit = istek('/devices', {'data': {'type': 'devices', 'attributes': {
        'name': os.environ.get('CIHAZ_ADI') or 'Test iPhone',
        'platform': 'IOS', 'udid': udid}}})
    print('Cihaz:', kod, '' if kod == 201 else yanit)

for kimlik in KIMLIKLER:
    sorgu = urllib.parse.urlencode({
        'filter[identifier]': kimlik, 'include': 'bundleIdCapabilities'})
    kod, yanit = istek('/bundleIds?' + sorgu)
    if kod != 200:
        print(f'::warning::{kimlik} okunamadı: {kod} {yanit}')
        continue
    kayit = next((d for d in yanit['data']
                  if d['attributes']['identifier'] == kimlik), None)
    if kayit is None:
        print(f'::warning::{kimlik} hesapta yok')
        continue
    yetenekler = sorted(
        y['attributes'].get('capabilityType') or '?'
        for y in yanit.get('included', []) if y['type'] == 'bundleIdCapabilities')
    print(f'{kimlik}: {", ".join(yetenekler) or "yetenek yok"}')
    if 'FAMILY_CONTROLS' in yetenekler:
        continue
    kod, yanit = istek('/bundleIdCapabilities', {'data': {
        'type': 'bundleIdCapabilities',
        'attributes': {'capabilityType': 'FAMILY_CONTROLS'},
        'relationships': {'bundleId': {'data': {
            'type': 'bundleIds', 'id': kayit['id']}}}}})
    if kod == 201:
        print(f'  Family Controls açıldı')
    else:
        print(f'::warning::{kimlik} Family Controls açılamadı: {kod} {yanit}')
