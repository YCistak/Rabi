import { tema } from '../tip'
import { edebiyatKonusu } from './12-turkce-yardimci'

/** Deneme ve Söylev üniteleri (2018 programı, 12. sınıf). */
export const denemeSoylevTemalari = [
  tema('trk12-t6', 'Deneme', [
    edebiyatKonusu({
      id: 'trk12-deneme', ad: 'Deneme: Dünyada ve Türkçede',
      kartlar: [
        ['Deneme nedir?', 'Yazarın bir konudaki kişisel görüşünü kesin hüküm vermeden anlattığı yazıdır.\nAdı Fransızca essai’den gelir; “denemek, sınamak” demektir.'],
        ['Montaigne', 'Fransız yazar Montaigne, Denemeler (1580) ile türün ilk büyük örneğini verdi.\n“Ben ne bilirim?” sorusu düşüncesini özetler.'],
        ['Bacon', 'İngiliz Francis Bacon’ın Denemeler’i (1597) daha kısa ve öğüt vericidir.\nMontaigne kişisel, Bacon düşünce yoğun yazar.'],
        ['Nurullah Ataç', '1898–1957 arasında yaşadı; sade Türkçeyi savundu.\nGünlerin Getirdiği (1946) ve Karalama (1952) kitaplarında kişisel bir üslup kurdu.'],
        ['Sabahattin Eyüboğlu', 'Mavi ve Kara kitabıyla tanınır.\nAnadolu halk kültürünü ve Mavi Anadolu görüşünü savundu.'],
        ['Azra Erhat', 'Mavi Anadolu (1960) kitabında Anadolu’nun eski uygarlıklarını ve Ege kültürünü anlattı.\nHümanist bir bakışla yazdı.'],
        ['Cemil Meriç', 'Bu Ülke (1974) kitabında kültür ve toplum üzerine düşüncelerini yazdı.\nÜslubu bilgi yüklü ve tartışmacıdır.'],
        ['Deneme ve makale', 'Makale kanıta ve sisteme dayanır.\nDenemede yazarın kişisel sesi ve özgür kuruluş öne çıkar.'],
      ],
      not: 'Montaigne kendini anlatarak, Bacon öğüt vererek yazar; ikisi de türün öncüsüdür.', notKarti: 3,
      kontrol: ['Denemeler (1580) kimin eseridir?', 'Montaigne', 'Bacon', 'Bacon’ın Denemeler’i 1597’de çıktı.', 2],
    }),
  ]),
  tema('trk12-t7', 'Söylev', [
    edebiyatKonusu({
      id: 'trk12-soylev', ad: 'Söylev (Nutuk)',
      kartlar: [
        ['Söylev nedir?', 'Topluluğa seslenerek bir düşünceyi savunan konuşma türüdür.\nNutuk ve hitabe adlarıyla da anılır.'],
        ['Özellikleri', '- **Seslenme:** Dinleyiciye doğrudan hitap edilir.\n- **İkna:** Düşünce mantık ve duyguyla savunulur.\n- **Dil:** Açık, vurgulu ve coşkulu olur.'],
        ['Orhun söylevi', 'Orhun yazıtlarında Bilge Kağan halka seslenir.\nGeçmişten ders çıkarıp birlik ve bağımsızlık öğütler.'],
        ['Eski dünya söylevi', 'Antik Yunan’da Perikles ve Demosthenes, Roma’da Cicero ünlü hatiplerdir.\nHitabet kamusal yaşamla birlikte gelişti.'],
        ['Nutuk', 'Atatürk, Nutuk’u 15–20 Ekim 1927’de Cumhuriyet Halk Fırkası’nın II. Büyük Kongresi’nde okudu.\n1919–1927 arasındaki olayları anlatır.'],
        ['Gençliğe Hitabe', 'Gençliğe Hitabe, Nutuk’un sonunda yer alır.\nGençliği Türk istikbalini ve cumhuriyeti korumaya çağırır.'],
        ['10. Yıl Nutku', 'Atatürk 29 Ekim 1933’te Cumhuriyet’in 10. yıl nutkunu okudu.\n“Ne mutlu Türk’üm diyene” sözü bu nutukta geçer.'],
        ['Dinî söylev', 'İslam kültür çevresinde hutbe ve vaaz, topluluğa seslenen söylev örnekleridir.\nBunlar dinî öğüt ve çağrı amacıyla yapılır.'],
      ],
      not: 'İslamiyet öncesi Türk söylevinin örneği, halka seslenen Orhun yazıtlarıdır.', notKarti: 3,
      kontrol: ['Nutuk hangi yıl okundu?', '1927', '1933', '1933, Atatürk’ün 10. Yıl Nutku’nun yılıdır.', 5],
    }),
  ]),
]
