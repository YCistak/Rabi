/**
 * Cümlenin Ögeleri oyununun cümle havuzu.
 *
 * Her satır bir cümle, üçe bölünmüş hâlde: sorulan ögeden **önce** gelen kısım,
 * ögenin kendisi, **sonra** gelen kısım. Vurgulanacak yeri metin içinde arayıp
 * bulmak yerine baştan ayırmak, aynı sözcük cümlede iki kez geçtiğinde yanlış
 * yeri işaretleme riskini tamamen kaldırıyor.
 *
 * Aynı cümle birden fazla kez, farklı ögesi sorularak geçebilir — istenen de
 * bu: "Çocuklar bahçede oynuyor" cümlesinde hem özneyi hem dolaylı tümleci
 * sorabilmek, ögeleri cümleden bağımsız ezberlemeyi engelliyor.
 *
 * ## Kapsam dışı bırakılanlar
 *
 * **Edat tümleci** ayrı bir şık değil: güncel MEB müfredatı onu ayrı öge
 * saymıyor, birçok kaynak zarf tümlecine katıyor. Şık yapılsaydı "onunla",
 * "senin için" gibi öbeklerde iki cevap birden doğru olurdu. Bu tür öbeklerin
 * sorulduğu cümle havuza hiç alınmadı.
 *
 * Zaman bildiren "-de/-da" ekli sözcükler (*saat beşte*) kaynaklar arasında
 * zarf tümleci / dolaylı tümleç diye ayrıştığı için alınmadı; havuzdaki bütün
 * dolaylı tümleçler yer-yön bildiriyor.
 */

export type OgeTuru =
  | 'yuklem'
  | 'ozne'
  | 'belirtiliNesne'
  | 'belirtisizNesne'
  | 'dolayliTumlec'
  | 'zarfTumleci'

export type OgeSorusu = {
  /** Vurgulanan ögeden önceki kısım; cümle ögeyle başlıyorsa boş. */
  once: string
  /** Sorulan öge — ekranda vurgulu görünen kısım. */
  oge: string
  /** Ögeden sonraki kısım, noktalama dahil. */
  sonra: string
  tur: OgeTuru
}

/** Şıklarda görünen ad. */
export const OGE_ADI: Record<OgeTuru, string> = {
  yuklem: 'Yüklem',
  ozne: 'Özne',
  belirtiliNesne: 'Belirtili nesne',
  belirtisizNesne: 'Belirtisiz nesne',
  dolayliTumlec: 'Dolaylı tümleç',
  zarfTumleci: 'Zarf tümleci',
}

/** Tur sonunda, yanlış bilinen cümlenin altında görünen kural. */
export const OGE_ACIKLAMASI: Record<OgeTuru, string> = {
  yuklem:
    'Cümlede iş, oluş ya da yargıyı bildiren ögedir. Önce yüklem bulunur, diğer ögeler ona sorulan sorularla çıkar.',
  ozne: 'Yükleme “kim, ne” diye sorulunca çıkan, işi yapan ya da olan ögedir.',
  belirtiliNesne:
    'Yükleme “neyi, kimi” sorusunun cevabıdır; belirtme eki (-ı, -i, -u, -ü) alır.',
  belirtisizNesne:
    'Yükleme “ne” sorusunun cevabıdır; belirtme eki almaz, yalın hâlde durur.',
  dolayliTumlec:
    'Yükleme “nereye, nerede, nereden” diye sorulunca çıkar; yönelme (-e), bulunma (-de) ya da çıkma (-den) eki alır.',
  zarfTumleci:
    'Yüklemi “nasıl, ne zaman, ne kadar, niçin” yönüyle tamamlar; hâl eki almaz.',
}

/** Havuzu okunur tutmak için: bir ögeye ait bütün cümleler tek yerde. */
function grup(tur: OgeTuru, cumleler: [string, string, string][]): OgeSorusu[] {
  return cumleler.map(([once, oge, sonra]) => ({ once, oge, sonra, tur }))
}

export const OGE_HAVUZU: readonly OgeSorusu[] = [
  ...grup('yuklem', [
    ['Çocuklar bahçede ', 'oynuyor', '.'],
    ['Yarın sınava ', 'gireceğim', '.'],
    ['Bu kitabı geçen yaz ', 'okumuştum', '.'],
    ['Hava birden ', 'soğudu', '.'],
    ['Kapı yavaşça ', 'açıldı', '.'],
    ['Annem bize kek ', 'yaptı', '.'],
    ['En sevdiğim ders ', 'matematiktir', '.'],
    ['O gün herkes çok ', 'mutluydu', '.'],
    ['Trenler bugün ', 'kalkmadı', '.'],
    ['Bütün gece ders ', 'çalıştım', '.'],
    ['Köyde büyük bir yangın ', 'çıktı', '.'],
    ['Sonunda doğruyu ', 'söyledi', '.'],
    ['Bu soruyu kimse ', 'çözemedi', '.'],
    ['Rüzgâr sabaha kadar ', 'esti', '.'],
    ['Öğretmen tahtaya bir soru ', 'yazdı', '.'],
    ['Yolcular otobüse ', 'bindi', '.'],
    ['Bu haber hepimizi ', 'şaşırttı', '.'],
    ['Dedem her sabah gazete ', 'okur', '.'],
    ['Sınav sonuçları bugün ', 'açıklandı', '.'],
    ['Bahçedeki ağaçlar çiçek ', 'açtı', '.'],
  ]),

  ...grup('ozne', [
    ['', 'Ali', ' ödevini bitirdi.'],
    ['', 'Küçük çocuk', ' parkta koşuyordu.'],
    ['', 'Kapı', ' rüzgârdan açıldı.'],
    ['Dün akşam ', 'misafirler', ' geldi.'],
    ['', 'Bu roman', ' bana çok şey öğretti.'],
    ['Sabahleyin ', 'kuşlar', ' ötmeye başladı.'],
    ['', 'Öğretmenimiz', ' bize masal anlattı.'],
    ['Bahçedeki ', 'ağaçlar', ' çiçek açtı.'],
    ['', 'Camlar', ' baştan sona temizlendi.'],
    ['Yarın ', 'sınav sonuçları', ' açıklanacak.'],
    ['', 'Herkes', ' bu haberi duydu.'],
    ['Uzun yoldan gelen ', 'yolcular', ' çok yorulmuştu.'],
    ['', 'Babam', ' akşamları kitap okur.'],
    ['Az önce ', 'telefonum', ' çaldı.'],
    ['', 'Rüzgâr', ' bütün gece esti.'],
    ['Sokaktaki ', 'kediler', ' acıkmış.'],
    ['', 'Arkadaşlarım', ' beni kapıda bekledi.'],
    ['Bu şiiri ', 'Orhan Veli', ' yazmış.'],
    ['', 'Kar', ' sabaha kadar yağdı.'],
    ['', 'Bütün sınıf', ' sessizce dinliyordu.'],
  ]),

  ...grup('belirtiliNesne', [
    ['Ali ', 'ödevini', ' bitirdi.'],
    ['Annem ', 'camları', ' sildi.'],
    ['Çocuk ', 'topu', ' uzağa fırlattı.'],
    ['Öğretmen ', 'defterleri', ' topladı.'],
    ['Kardeşim ', 'bisikletini', ' tamir etti.'],
    ['Herkes ', 'bu haberi', ' merakla bekliyordu.'],
    ['Dedem ', 'gazeteyi', ' okudu.'],
    ['Ben ', 'seni', ' çok özledim.'],
    ['Rüzgâr ', 'şapkamı', ' uçurdu.'],
    ['Aşçı ', 'çorbayı', ' tuzladı.'],
    ['Babam ', 'arabayı', ' garaja çekti.'],
    ['Kimse ', 'doğruyu', ' söylemedi.'],
    ['Yağmur ', 'sokakları', ' yıkadı.'],
    ['Ressam ', 'tabloyu', ' yeni bitirdi.'],
    ['Öğrenciler ', 'sınavı', ' kolay buldu.'],
    ['Hakem ', 'maçı', ' erken bitirdi.'],
    ['Ninem ', 'hikâyeyi', ' bize tekrar anlattı.'],
    ['Çiftçi ', 'tarlayı', ' sürdü.'],
    ['Anne ', 'bebeği', ' kucağına aldı.'],
    ['Biz ', 'onu', ' çok sevdik.'],
  ]),

  ...grup('belirtisizNesne', [
    ['Annem bize ', 'kek', ' yaptı.'],
    ['Dedem her sabah ', 'gazete', ' okur.'],
    ['Çocuklar bahçede ', 'top', ' oynuyor.'],
    ['Kardeşim odasına ', 'poster', ' astı.'],
    ['Öğretmen tahtaya ', 'soru', ' yazdı.'],
    ['Yolda ', 'para', ' bulmuş.'],
    ['Akşamları ', 'kitap', ' okurum.'],
    ['Bize uzun uzun ', 'masal', ' anlattı.'],
    ['Marketten ', 'ekmek', ' aldık.'],
    ['Duvara ', 'resim', ' çizdiler.'],
    ['Bahçeye ', 'fidan', ' diktik.'],
    ['Kışın ', 'kazak', ' örer.'],
    ['Sabahları ', 'süt', ' içerim.'],
    ['Ustadan ', 'iş', ' öğrendi.'],
    ['Herkese ', 'davetiye', ' gönderdik.'],
    ['Odaya ', 'halı', ' serdiler.'],
    ['Bize ', 'şarkı', ' söyledi.'],
    ['Çantasına ', 'defter', ' koydu.'],
    ['Balkonda ', 'çiçek', ' yetiştiriyor.'],
    ['Öğlen ', 'çorba', ' içtik.'],
  ]),

  ...grup('dolayliTumlec', [
    ['Çocuklar ', 'bahçede', ' oynuyor.'],
    ['Yolcular ', 'otobüse', ' bindi.'],
    ['Kitabı ', 'çantama', ' koydum.'],
    ['Dün ', 'İstanbul’dan', ' döndük.'],
    ['Öğretmen ', 'tahtaya', ' bir soru yazdı.'],
    ['Anahtarı ', 'kapının altına', ' bıraktım.'],
    ['Kuşlar ', 'dallara', ' kondu.'],
    ['Bu haberi ', 'arkadaşımdan', ' duydum.'],
    ['Yarın ', 'okula', ' gitmeyeceğim.'],
    ['Çiçekleri ', 'vazoya', ' koydu.'],
    ['Herkes ', 'salonda', ' toplandı.'],
    ['Mektubu ', 'postaneye', ' verdim.'],
    ['Balıklar ', 'gölde', ' yüzüyor.'],
    ['Misafirler ', 'salona', ' geçti.'],
    ['Parayı ', 'cebinden', ' çıkardı.'],
    ['Köpek ', 'kapının önünde', ' yatıyordu.'],
    ['Bize ', 'köyden', ' haber geldi.'],
    ['Eşyaları ', 'dolaba', ' yerleştirdim.'],
    ['Uçak ', 'havaalanına', ' indi.'],
    ['Çocuk ', 'annesine', ' sarıldı.'],
  ]),

  ...grup('zarfTumleci', [
    ['Çocuk ', 'hızlıca', ' koştu.'],
    ['', 'Dün', ' sinemaya gittik.'],
    ['Bu soruyu ', 'kolayca', ' çözdü.'],
    ['Kar ', 'sabaha kadar', ' yağdı.'],
    ['Beni ', 'çok', ' sevindirdin.'],
    ['Kapı ', 'yavaşça', ' açıldı.'],
    ['', 'Yarın', ' sınava gireceğim.'],
    ['Toplantı ', 'geç', ' başladı.'],
    ['Yemeği ', 'aceleyle', ' yedi.'],
    ['Bu filmi ', 'iki kez', ' izledim.'],
    ['', 'Sabahleyin', ' kuşlar ötüyordu.'],
    ['Hava ', 'birden', ' soğudu.'],
    ['Ödevini ', 'dikkatle', ' yaptı.'],
    ['Bizi ', 'sessizce', ' dinledi.'],
    ['Otobüs ', 'erken', ' kalktı.'],
    ['', 'Her akşam', ' yürüyüşe çıkarım.'],
    ['Sınava ', 'iyi', ' hazırlandım.'],
    ['Bu işi ', 'yarın', ' bitiririm.'],
    ['Rüzgâr ', 'şiddetle', ' esiyordu.'],
    ['Konuyu ', 'tekrar', ' anlattı.'],
  ]),
] as const

export const OGE_BOYUTU = OGE_HAVUZU.length
