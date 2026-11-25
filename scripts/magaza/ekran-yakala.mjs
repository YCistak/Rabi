/**
 * Rabi — Mağaza için gerçek ekran görüntüsü yakalama betiği.
 *
 * Çalıştırma:
 *   node scripts/magaza/ekran-yakala.mjs [sunucuUrl]
 *   Örnek: node scripts/magaza/ekran-yakala.mjs http://localhost:3101
 *
 * Açık tema, 390×844 CSS px, deviceScaleFactor: 3 (çıktı 1170×2532).
 * Sayfa açılmadan önce localStorage'a gerçekçi demo veri yazar ve
 * sahte konuşma tanıma (SpeechRecognition) sınıfı enjekte eder.
 */

import { pathToFileURL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const PUPPETEER_YOLU =
  'C:/Users/ynser/AppData/Roaming/npm/node_modules/hyperframes/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'
const CHROME_YOLU = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const CIKTI_DIZINI = path.resolve('magaza-cikti/kaynak')
const SUNUCU_URL = process.argv[2] || 'http://localhost:3101'

const GENISLIK = 390
const YUKSEKLIK = 844
const OLCEK = 3

const SESLI_METIN =
  'Bugün TYT denemesi çözdük Türkçe 33 doğru 4 yanlış matematik 29 doğru 6 yanlış onun dışında 80 matematik 65 tane de kimya sorusu çözdüm'

/** Belirtilen milisaniye kadar bekler. */
const bekle = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** 'YYYY-AA-GG' biçiminde günün yerel tarihini verir. */
function bugunBul() {
  const simdi = new Date()
  const yil = simdi.getFullYear()
  const ay = String(simdi.getMonth() + 1).padStart(2, '0')
  const gun = String(simdi.getDate()).padStart(2, '0')
  return `${yil}-${ay}-${gun}`
}

/** ISO gün damgasını gün sayısı kadar kaydırır. */
function gunKaydir(isoTarih, fark) {
  const [yil, ay, gun] = isoTarih.split('-').map(Number)
  const tarih = new Date(Date.UTC(yil, ay - 1, gun + fark))
  const y = tarih.getUTCFullYear()
  const m = String(tarih.getUTCMonth() + 1).padStart(2, '0')
  const g = String(tarih.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${g}`
}

/** Demo veri sözlüğünü üretir. */
function demoVerisiUret() {
  const bugun = bugunBul()
  const [yil, aySayisi] = bugun.split('-').map(Number)
  const sinifYili = aySayisi >= 9 ? yil : yil - 1

  // 1. Ayarlar (rabi-ayarlar)
  const ayarlar = {
    varsayilanSablonId: 'tyt',
    ad: 'Elif',
    buYilSinif: 12,
    elleObp: null,
    sinifYili,
    puanTuru: 'say',
    gunlukHedef: 150,
    hatirlatmaSaati: 21,
    hatirlatmaDakikasi: 30,
    bildirimAcik: true,
    gorevHatirlatma: true,
    oyunSesi: true,
    oyunMuzigi: false,
    oyunMuzikTuru: 'mod',
    kurulumTamamlandi: true,
    tema: 'acik',
  }

  // 2. Hedef (rabi-hedef)
  const hedef = {
    universite: 'Boğaziçi Üniversitesi',
    bolum: 'Bilgisayar Mühendisliği',
    puanTuru: 'say',
    tabanPuan: 542.85,
    basariSirasi: 320,
  }

  // 3. Son 14 günün soru kayıtları (rabi-gunluk-kayitlar)
  // Bugün ve dün özellikle dolu: bugün toplam 200 soru (hedef 150 tuttu).
  const soruKaliplari = [
    // Bugün (indeks 0)
    [
      { ders: 'Matematik', toplam: 80, dogru: 72, yanlis: 5 },
      { ders: 'Türkçe', toplam: 40, dogru: 35, yanlis: 4 },
      { ders: 'Kimya', toplam: 50, dogru: 44, yanlis: 4 },
      { ders: 'Fizik', toplam: 30, dogru: 25, yanlis: 3 },
    ],
    // Dün (indeks 1)
    [
      { ders: 'Matematik', toplam: 75, dogru: 66, yanlis: 6 },
      { ders: 'Türkçe', toplam: 45, dogru: 39, yanlis: 4 },
      { ders: 'Biyoloji', toplam: 45, dogru: 40, yanlis: 3 },
    ],
    // 2 gün önce
    [
      { ders: 'Fizik', toplam: 50, dogru: 42, yanlis: 5 },
      { ders: 'Kimya', toplam: 40, dogru: 35, yanlis: 3 },
      { ders: 'Matematik', toplam: 60, dogru: 52, yanlis: 5 },
    ],
    // 3 gün önce
    [
      { ders: 'Matematik', toplam: 90, dogru: 80, yanlis: 7 },
      { ders: 'Türkçe', toplam: 50, dogru: 44, yanlis: 4 },
      { ders: 'Geometri', toplam: 40, dogru: 34, yanlis: 4 },
    ],
    // 4 gün önce
    [
      { ders: 'Biyoloji', toplam: 60, dogru: 54, yanlis: 4 },
      { ders: 'Kimya', toplam: 50, dogru: 43, yanlis: 5 },
      { ders: 'Türkçe', toplam: 35, dogru: 30, yanlis: 3 },
    ],
    // 5 gün önce
    [
      { ders: 'Matematik', toplam: 85, dogru: 75, yanlis: 6 },
      { ders: 'Fizik', toplam: 45, dogru: 38, yanlis: 4 },
      { ders: 'Biyoloji', toplam: 40, dogru: 35, yanlis: 3 },
    ],
    // 6 gün önce
    [
      { ders: 'Türkçe', toplam: 60, dogru: 52, yanlis: 5 },
      { ders: 'Matematik', toplam: 50, dogru: 44, yanlis: 4 },
      { ders: 'Kimya', toplam: 35, dogru: 30, yanlis: 3 },
    ],
    // 7 gün önce
    [
      { ders: 'Matematik', toplam: 80, dogru: 70, yanlis: 6 },
      { ders: 'Fizik', toplam: 55, dogru: 47, yanlis: 5 },
      { ders: 'Türkçe', toplam: 45, dogru: 39, yanlis: 4 },
    ],
    // 8 gün önce
    [
      { ders: 'Kimya', toplam: 60, dogru: 53, yanlis: 4 },
      { ders: 'Biyoloji', toplam: 50, dogru: 44, yanlis: 4 },
      { ders: 'Matematik', toplam: 50, dogru: 43, yanlis: 5 },
    ],
    // 9 gün önce
    [
      { ders: 'Türkçe', toplam: 50, dogru: 43, yanlis: 4 },
      { ders: 'Fizik', toplam: 40, dogru: 34, yanlis: 4 },
      { ders: 'Matematik', toplam: 45, dogru: 39, yanlis: 4 },
    ],
    // 10 gün önce
    [
      { ders: 'Matematik', toplam: 95, dogru: 84, yanlis: 7 },
      { ders: 'Kimya', toplam: 55, dogru: 48, yanlis: 4 },
      { ders: 'Biyoloji', toplam: 55, dogru: 48, yanlis: 4 },
    ],
    // 11 gün önce
    [
      { ders: 'Türkçe', toplam: 55, dogru: 48, yanlis: 5 },
      { ders: 'Fizik', toplam: 50, dogru: 43, yanlis: 4 },
      { ders: 'Matematik', toplam: 45, dogru: 39, yanlis: 4 },
    ],
    // 12 gün önce
    [
      { ders: 'Matematik', toplam: 80, dogru: 71, yanlis: 6 },
      { ders: 'Biyoloji', toplam: 50, dogru: 44, yanlis: 3 },
      { ders: 'Kimya', toplam: 40, dogru: 35, yanlis: 3 },
    ],
    // 13 gün önce
    [
      { ders: 'Türkçe', toplam: 60, dogru: 52, yanlis: 5 },
      { ders: 'Fizik', toplam: 60, dogru: 51, yanlis: 5 },
      { ders: 'Matematik', toplam: 65, dogru: 57, yanlis: 5 },
    ],
  ]

  const gunlukKayitlar = soruKaliplari.map((kayitlar, i) => ({
    tarih: gunKaydir(bugun, -i),
    kayitlar,
  }))

  // 4. Denemeler (rabi-denemeler)
  // Netleri yavaş yükselen 6 TYT ve AYT denemesi (tarafsız, uydurma adlar)
  const denemeler = [
    {
      id: 'deneme-1',
      sablonId: 'tyt',
      ad: 'Okul TYT Denemesi 1',
      tarih: gunKaydir(bugun, -38),
      sonuclar: [
        { dersId: 'turkce', dogru: 29, yanlis: 8 },
        { dersId: 'tarih', dogru: 3, yanlis: 1 },
        { dersId: 'cografya', dogru: 4, yanlis: 1 },
        { dersId: 'felsefe', dogru: 4, yanlis: 0 },
        { dersId: 'din', dogru: 4, yanlis: 1 },
        { dersId: 'matematik', dogru: 25, yanlis: 6 },
        { dersId: 'fizik', dogru: 4, yanlis: 2 },
        { dersId: 'kimya', dogru: 4, yanlis: 2 },
        { dersId: 'biyoloji', dogru: 4, yanlis: 1 },
      ],
      not: 'Süre yönetimini geliştirmeliyim.',
    },
    {
      id: 'deneme-2',
      sablonId: 'tyt',
      ad: 'TYT Genel Deneme 2',
      tarih: gunKaydir(bugun, -29),
      sonuclar: [
        { dersId: 'turkce', dogru: 31, yanlis: 6 },
        { dersId: 'tarih', dogru: 4, yanlis: 1 },
        { dersId: 'cografya', dogru: 4, yanlis: 1 },
        { dersId: 'felsefe', dogru: 4, yanlis: 1 },
        { dersId: 'din', dogru: 5, yanlis: 0 },
        { dersId: 'matematik', dogru: 28, yanlis: 5 },
        { dersId: 'fizik', dogru: 5, yanlis: 1 },
        { dersId: 'kimya', dogru: 5, yanlis: 1 },
        { dersId: 'biyoloji', dogru: 5, yanlis: 1 },
      ],
    },
    {
      id: 'deneme-3',
      sablonId: 'ayt-say',
      ad: 'AYT Sayısal Deneme 1',
      tarih: gunKaydir(bugun, -22),
      sonuclar: [
        { dersId: 'matematik', dogru: 26, yanlis: 4 },
        { dersId: 'fizik', dogru: 9, yanlis: 3 },
        { dersId: 'kimya', dogru: 9, yanlis: 2 },
        { dersId: 'biyoloji', dogru: 9, yanlis: 2 },
      ],
    },
    {
      id: 'deneme-4',
      sablonId: 'tyt',
      ad: 'Kurumsal TYT Denemesi 3',
      tarih: gunKaydir(bugun, -15),
      sonuclar: [
        { dersId: 'turkce', dogru: 33, yanlis: 5 },
        { dersId: 'tarih', dogru: 4, yanlis: 1 },
        { dersId: 'cografya', dogru: 4, yanlis: 0 },
        { dersId: 'felsefe', dogru: 4, yanlis: 1 },
        { dersId: 'din', dogru: 5, yanlis: 0 },
        { dersId: 'matematik', dogru: 31, yanlis: 4 },
        { dersId: 'fizik', dogru: 6, yanlis: 1 },
        { dersId: 'kimya', dogru: 6, yanlis: 1 },
        { dersId: 'biyoloji', dogru: 5, yanlis: 1 },
      ],
    },
    {
      id: 'deneme-5',
      sablonId: 'ayt-say',
      ad: 'AYT Sayısal Deneme 2',
      tarih: gunKaydir(bugun, -8),
      sonuclar: [
        { dersId: 'matematik', dogru: 30, yanlis: 3 },
        { dersId: 'fizik', dogru: 11, yanlis: 2 },
        { dersId: 'kimya', dogru: 11, yanlis: 1 },
        { dersId: 'biyoloji', dogru: 11, yanlis: 1 },
      ],
    },
    {
      id: 'deneme-6',
      sablonId: 'tyt',
      ad: 'TYT Genel Deneme 5',
      tarih: gunKaydir(bugun, -2),
      sonuclar: [
        { dersId: 'turkce', dogru: 35, yanlis: 3 },
        { dersId: 'tarih', dogru: 5, yanlis: 0 },
        { dersId: 'cografya', dogru: 4, yanlis: 1 },
        { dersId: 'felsefe', dogru: 5, yanlis: 0 },
        { dersId: 'din', dogru: 5, yanlis: 0 },
        { dersId: 'matematik', dogru: 34, yanlis: 3 },
        { dersId: 'fizik', dogru: 6, yanlis: 1 },
        { dersId: 'kimya', dogru: 6, yanlis: 1 },
        { dersId: 'biyoloji', dogru: 6, yanlis: 0 },
      ],
    },
  ]

  // 5. Yapılacaklar (rabi-notlar)
  const notlar = [
    {
      id: 'gorev-1',
      metin: 'Türev Geometrik Yorumu Test 4',
      gun: bugun,
      saat: '14:30',
      kategori: 'soru',
      renk: 'mavi',
      sure: 45,
      bitti: true,
      yildiz: true,
    },
    {
      id: 'gorev-2',
      metin: 'Organik Kimya Fonksiyonel Gruplar',
      gun: bugun,
      saat: '16:00',
      kategori: 'tekrar',
      renk: 'turuncu',
      sure: 40,
      bitti: true,
      yildiz: false,
    },
    {
      id: 'gorev-3',
      metin: 'Paragraf 30 Soru Hız Denemesi',
      gun: bugun,
      saat: '17:30',
      kategori: 'soru',
      renk: 'yesil',
      sure: 30,
      bitti: false,
      yildiz: true,
    },
    {
      id: 'gorev-4',
      metin: 'Modern Fizik Fotoelektrik Olay',
      gun: bugun,
      saat: '20:00',
      kategori: 'tekrar',
      renk: 'mor',
      sure: 50,
      bitti: false,
      yildiz: false,
    },
  ]

  // 6. Pomodoro ayarı ve geçmişi
  const pomodoroAyar = {
    calisma: 25,
    kisaMola: 5,
    uzunMola: 15,
    turSayisi: 4,
    ses: 'yok',
    sesSeviyesi: 0.8,
    ekraniAcikTut: true,
    odakKilidi: false,
    rahatsizEtme: false,
    kilitliUygulamalar: [],
    kilitTanitimiGoruldu: true,
    provaSuresi: 135,
  }

  const pomodoroGecmis = [
    {
      id: 'pomodoro-1',
      baslangic: `${bugun}T10:00:00.000Z`,
      dakika: 25,
      ders: 'Matematik',
    },
    {
      id: 'pomodoro-2',
      baslangic: `${bugun}T10:35:00.000Z`,
      dakika: 25,
      ders: 'Matematik',
    },
    {
      id: 'pomodoro-3',
      baslangic: `${gunKaydir(bugun, -1)}T14:00:00.000Z`,
      dakika: 25,
      ders: 'Fizik',
    },
    {
      id: 'pomodoro-4',
      baslangic: `${gunKaydir(bugun, -1)}T14:35:00.000Z`,
      dakika: 25,
      ders: 'Fizik',
    },
    {
      id: 'pomodoro-5',
      baslangic: `${gunKaydir(bugun, -2)}T16:00:00.000Z`,
      dakika: 50,
      ders: 'Kimya',
    },
  ]

  // 7. Okul yılları (rabi-okul-yillari)
  const okulYillari = [
    { id: 'okul-9', sinif: 9, ortalama: 94.2 },
    { id: 'okul-10', sinif: 10, ortalama: 95.8 },
    { id: 'okul-11', sinif: 11, ortalama: 96.5 },
  ]

  // 8. Oyun kayıtları (rabi-oyunlar)
  const oyunlar = {
    yazim: {
      enIyiDogru: 19,
      enIyiSeri: 15,
      oynananTur: 14,
      toplamDogru: 168,
      toplamYanlis: 22,
      hatasizTur: 5,
      sonTarih: bugun,
    },
    islem: {
      enIyiDogru: 24,
      enIyiSeri: 20,
      oynananTur: 18,
      toplamDogru: 240,
      toplamYanlis: 15,
      hatasizTur: 8,
      sonTarih: bugun,
    },
    periyodik: {
      enIyiDogru: 18,
      enIyiSeri: 14,
      oynananTur: 10,
      toplamDogru: 125,
      toplamYanlis: 18,
      hatasizTur: 3,
      sonTarih: gunKaydir(bugun, -1),
    },
  }

  // 9. Rozetler (rabi-rozetler) — kazanılan tüm rozetler eklenir ki açılışta yeni rozet bildirimi fırlamasın
  const rozetler = [
    { rozetId: 'seri-3', tarih: gunKaydir(bugun, -10) },
    { rozetId: 'seri-7', tarih: gunKaydir(bugun, -6) },
    { rozetId: 'seri-14', tarih: gunKaydir(bugun, -1) },
    { rozetId: 'diploma-85', tarih: gunKaydir(bugun, -40) },
    { rozetId: 'diploma-90', tarih: gunKaydir(bugun, -40) },
    { rozetId: 'diploma-95', tarih: gunKaydir(bugun, -40) },
    { rozetId: 'pomodoro-ilk', tarih: gunKaydir(bugun, -12) },
    { rozetId: 'pomodoro-10s', tarih: gunKaydir(bugun, -3) },
    { rozetId: 'oyun-hatasiz-5', tarih: gunKaydir(bugun, -5) },
    { rozetId: 'yukselis-3', tarih: gunKaydir(bugun, -2) },
    { rozetId: 'banka-1', tarih: gunKaydir(bugun, -4) },
  ]

  // 9b. Oyun Bankası (rabi-oyun-bankasi) — 16 gerçekçi kayıt (lib/oyunlar/banka.ts)
  const oyunBankasi = [
    {
      id: 'yazim:yanı sıra',
      soru: {
        oyun: 'yazim',
        dogru: 'yanı sıra',
        yanlis: 'yanısıra',
        kural: 'Ayrı yazılan birleşik kelimeler',
      },
      kacKez: 2,
      eklenme: gunKaydir(bugun, -18),
      sonYanlis: gunKaydir(bugun, -3),
    },
    {
      id: 'yazim:birtakım',
      soru: {
        oyun: 'yazim',
        dogru: 'birtakım',
        yanlis: 'bir takım',
        kural: 'Belgisiz sözcük olarak birtakım bitişik yazılır',
      },
      kacKez: 1,
      eklenme: gunKaydir(bugun, -14),
      sonYanlis: gunKaydir(bugun, -14),
    },
    {
      id: 'yazim:terk etmek',
      soru: {
        oyun: 'yazim',
        dogru: 'terk etmek',
        yanlis: 'terketmek',
        kural: 'Ses olayı olmayan birleşik fiiller ayrı yazılır',
      },
      kacKez: 3,
      eklenme: gunKaydir(bugun, -20),
      sonYanlis: gunKaydir(bugun, -1),
    },
    {
      id: 'yazim:pek çok',
      soru: {
        oyun: 'yazim',
        dogru: 'pek çok',
        yanlis: 'pekçok',
        kural: 'Ayrı yazılan sözcük öbekleri',
      },
      kacKez: 2,
      eklenme: gunKaydir(bugun, -11),
      sonYanlis: gunKaydir(bugun, -4),
    },
    {
      id: 'islem:17 × 12',
      soru: {
        oyun: 'islem',
        islemTuru: 'carpma',
        metin: '17 × 12',
        sonuc: 204,
      },
      kacKez: 2,
      eklenme: gunKaydir(bugun, -15),
      sonYanlis: gunKaydir(bugun, -5),
    },
    {
      id: 'islem:156 ÷ 12',
      soru: {
        oyun: 'islem',
        islemTuru: 'bolme',
        metin: '156 ÷ 12',
        sonuc: 13,
      },
      kacKez: 1,
      eklenme: gunKaydir(bugun, -9),
      sonYanlis: gunKaydir(bugun, -9),
    },
    {
      id: 'islem:84 − 39',
      soru: {
        oyun: 'islem',
        islemTuru: 'cikarma',
        metin: '84 − 39',
        sonuc: 45,
      },
      kacKez: 1,
      eklenme: gunKaydir(bugun, -7),
      sonYanlis: gunKaydir(bugun, -7),
    },
    {
      id: 'edebiyat:Mai ve Siyah',
      soru: {
        oyun: 'edebiyat',
        eser: 'Mai ve Siyah',
        yazar: 'Halit Ziya Uşaklıgil',
      },
      kacKez: 2,
      eklenme: gunKaydir(bugun, -16),
      sonYanlis: gunKaydir(bugun, -4),
    },
    {
      id: 'edebiyat:Kuyucaklı Yusuf',
      soru: {
        oyun: 'edebiyat',
        eser: 'Kuyucaklı Yusuf',
        yazar: 'Sabahattin Ali',
      },
      kacKez: 1,
      eklenme: gunKaydir(bugun, -12),
      sonYanlis: gunKaydir(bugun, -12),
    },
    {
      id: 'edebiyat:Çalıkuşu',
      soru: {
        oyun: 'edebiyat',
        eser: 'Çalıkuşu',
        yazar: 'Reşat Nuri Güntekin',
      },
      kacKez: 2,
      eklenme: gunKaydir(bugun, -10),
      sonYanlis: gunKaydir(bugun, -2),
    },
    {
      id: 'ses:kayboldu',
      soru: {
        oyun: 'ses',
        kelime: 'kayboldu',
        olusum: 'kayıp + oldu',
        olay: 'unlu-dusmesi',
      },
      kacKez: 1,
      eklenme: gunKaydir(bugun, -13),
      sonYanlis: gunKaydir(bugun, -13),
    },
    {
      id: 'ses:hissetti',
      soru: {
        oyun: 'ses',
        kelime: 'hissetti',
        olusum: 'his + etti',
        olay: 'unsuz-turemesi',
      },
      kacKez: 2,
      eklenme: gunKaydir(bugun, -8),
      sonYanlis: gunKaydir(bugun, -3),
    },
    {
      id: 'soz:Ağzı kulaklarına varmak',
      soru: {
        oyun: 'soz',
        soz: 'Ağzı kulaklarına varmak',
        anlam: 'Çok sevinmek',
        sozTuru: 'deyim',
        konu: 'duygu',
      },
      kacKez: 1,
      eklenme: gunKaydir(bugun, -14),
      sonYanlis: gunKaydir(bugun, -14),
    },
    {
      id: 'antlasma:Kars Antlaşması',
      soru: {
        oyun: 'antlasma',
        madde: 'Doğu sınırımız kesin olarak çizildi',
        antlasma: 'Kars Antlaşması',
      },
      kacKez: 2,
      eklenme: gunKaydir(bugun, -17),
      sonYanlis: gunKaydir(bugun, -6),
    },
    {
      id: 'kavram:Kuvay-ı Milliye',
      soru: {
        oyun: 'kavram',
        kavram: 'Kuvay-ı Milliye',
        tanim: 'Milli Mücadele döneminde kurulan bölgesel direniş örgütleri',
      },
      kacKez: 1,
      eklenme: gunKaydir(bugun, -6),
      sonYanlis: gunKaydir(bugun, -6),
    },
    {
      id: 'koklu:72',
      soru: {
        oyun: 'koklu',
        sayi: 72,
      },
      kacKez: 2,
      eklenme: gunKaydir(bugun, -9),
      sonYanlis: gunKaydir(bugun, -2),
    },
  ]

  // 10. Rabi Giydir (rabi-giydir)
  const giydir = {
    kafa: 'kep',
    yuz: 'gunes',
    boyun: 'papyon',
  }

  // 11. Konu seçimi ve ilerlemesi
  const konuSecimi = { ders: 'matematik', sinif: 12 }
  const konuIlerleme = {
    'mat12-dizi': {
      okunan: 9,
      dogru: 10,
      bitti: true,
      tarih: gunKaydir(bugun, -5),
      bitisTarihi: gunKaydir(bugun, -5),
    },
    'mat12-aritmetik': {
      okunan: 10,
      dogru: 9,
      bitti: true,
      tarih: gunKaydir(bugun, -3),
      bitisTarihi: gunKaydir(bugun, -3),
    },
    'mat12-geometrik': {
      okunan: 10,
      dogru: 8,
      bitti: true,
      tarih: gunKaydir(bugun, -1),
      bitisTarihi: gunKaydir(bugun, -1),
    },
  }

  // 12. Ana sayfa kısayolları
  const sonAraclar = ['soru', 'deneme', 'pomodoro', 'notlar']
  const sonOyunlar = ['islem', 'yazim', 'periyodik']

  // 13. Tanıtımı gizli tutulacak oyunlar
  const tanitimGizliOyunlar = [
    'yazim',
    'noktalama',
    'islem',
    'edebiyat',
    'ses',
    'oge',
    'soz',
    'bolunme',
    'aci',
    'ucgen',
    'harita',
    'iklim',
    'izohips',
    'antlasma',
    'kavram',
    'anlatim',
    'koklu',
    'ortak',
    'siniflandirma',
    'hucre',
    'sirala',
    'tuzak',
    'periyodik',
    'formul',
    'tepkime',
    'trigonometri',
  ]

  return {
    'rabi-ayarlar': JSON.stringify(ayarlar),
    'rabi-hedef': JSON.stringify(hedef),
    'rabi-gunluk-kayitlar': JSON.stringify(gunlukKayitlar),
    'rabi-denemeler': JSON.stringify(denemeler),
    'rabi-notlar': JSON.stringify(notlar),
    'rabi-pomodoro-ayar': JSON.stringify(pomodoroAyar),
    'rabi-pomodoro-gecmis': JSON.stringify(pomodoroGecmis),
    'rabi-okul-yillari': JSON.stringify(okulYillari),
    'rabi-oyunlar': JSON.stringify(oyunlar),
    'rabi-oyun-bankasi': JSON.stringify(oyunBankasi),
    'rabi-banka-dusen': '6',
    'rabi-rozetler': JSON.stringify(rozetler),
    'rabi-giydir': JSON.stringify(giydir),
    'rabi-konu-secimi': JSON.stringify(konuSecimi),
    'rabi-konu-ilerleme': JSON.stringify(konuIlerleme),
    'rabi-son-araclar': JSON.stringify(sonAraclar),
    'rabi-son-oyunlar': JSON.stringify(sonOyunlar),
    'rabi-tanitim-tercihi-v1': 'hayir',
    'rabi_ana_tur_tamamlandi': 'true',
    'rabi_ana_tur_surumu': '2',
    'rabi_tanitim_tamamlandi': 'true',
    'rabi_deneme_turu_tamamlandi': 'true',
    'rabi_harita_turu_tamamlandi': 'true',
    'rabi-mini-tur-pomodoro-v1': 'true',
    'rabi-mini-tur-yapilacaklar-v3': 'true',
    'rabi-mini-tur-istatistik-v1': 'true',
    'rabi-mini-tur-oyunlar-v1': 'true',
    'rabi-mini-tur-oyun-bankasi-v1': 'true',
    'rabi-tanitim-gizli': JSON.stringify(tanitimGizliOyunlar),
    'rabi-bildirim-izni': JSON.stringify('verildi'),
    'rabi-kurulum-tarihi': JSON.stringify(gunKaydir(bugun, -45)),
    'rabi-ozet-gorulen': JSON.stringify(['2026-09', '2026-10', '2026-11']),
  }
}

/** Metin ile buton veya tıklanabilir öğeyi bulup tıklar. */
async function metinleDugmeTikla(sayfa, hedefler, aciklama) {
  const metinler = Array.isArray(hedefler) ? hedefler : [hedefler]
  const basarili = await sayfa.evaluate((aramaListesi) => {
    const tumElemanlar = Array.from(
      document.querySelectorAll('button, [role="button"], a, input[type="button"], label'),
    )
    for (const hedef of aramaListesi) {
      const hedefKucuk = hedef.toLocaleLowerCase('tr-TR')
      // 1. Tam veya kısmi metin eşleşmesi
      let bulunan = tumElemanlar.find((el) => {
        const metin = (el.innerText || el.textContent || '').trim().toLocaleLowerCase('tr-TR')
        return metin === hedefKucuk || metin.includes(hedefKucuk)
      })
      // 2. aria-label eşleşmesi
      if (!bulunan) {
        bulunan = tumElemanlar.find((el) => {
          const aria = (el.getAttribute('aria-label') || '').trim().toLocaleLowerCase('tr-TR')
          return aria.includes(hedefKucuk)
        })
      }
      if (bulunan) {
        bulunan.scrollIntoView({ block: 'center', inline: 'center' })
        bulunan.click()
        return true
      }
    }
    return false
  }, metinler)

  if (basarili) {
    console.log(`  ✓ [Tıklandı] ${aciklama || metinler[0]}`)
  }
  return basarili
}

/** Alt menüdeki sekmeyi tıklar ('ana', 'daha', 'harita', 'oyunlar', 'ayarlar'). */
async function sekmeTikla(sayfa, sekmeId) {
  const basarili = await sayfa.evaluate((id) => {
    // 1. data-tanitim niteliği
    const tanitimButon = document.querySelector(`[data-tanitim="${id}-ac"]`)
    if (tanitimButon) {
      tanitimButon.click()
      return true
    }
    // 2. Metin bazlı eşleşme
    const isimHaritasi = {
      ana: 'Ana Sayfa',
      daha: 'Araçlar',
      harita: 'Harita',
      oyunlar: 'Oyunlar',
      ayarlar: 'Ayarlar',
    }
    const hedefMetin = (isimHaritasi[id] || id).toLocaleLowerCase('tr-TR')
    const altMenuButonlari = Array.from(document.querySelectorAll('nav button, nav a, footer button'))
    const bulunan = altMenuButonlari.find((b) => {
      const metin = (b.innerText || b.textContent || '').toLocaleLowerCase('tr-TR')
      return metin.includes(hedefMetin)
    })
    if (bulunan) {
      bulunan.click()
      return true
    }
    return false
  }, sekmeId)

  if (basarili) {
    console.log(`  ✓ [Sekme açıldı] ${sekmeId}`)
  }
  return basarili
}

/** Arayüzde geri düğmesi varsa basar. */
async function geriDugmesiTikla(sayfa) {
  return await sayfa.evaluate(() => {
    const geri = document.querySelector(
      '[aria-label="Geri"], button[aria-label="Geri"], [data-geri-sayfa] button, [data-geri-dugmesi], [aria-label="Ekrandan çık"]',
    )
    if (geri) {
      geri.click()
      return true
    }
    return false
  })
}

/** Açılış katmanını ve engelleri temizler. */
async function acilisiTemizle(sayfa) {
  await sayfa.evaluate(() => {
    document.querySelector('.acilis-katman')?.remove()
    document.querySelector('[data-acilis-katmani]')?.remove()
  })
}

async function anaIslem() {
  fs.mkdirSync(CIKTI_DIZINI, { recursive: true })
  console.log(`Rabi ekran yakalama betiği başlatılıyor...`)
  console.log(`Hedef sunucu: ${SUNUCU_URL}`)
  console.log(`Çıktı dizini: ${CIKTI_DIZINI}`)

  console.log(`Puppeteer yükleniyor...`)
  const puppeteerModulu = await import(pathToFileURL(PUPPETEER_YOLU).href)
  const puppeteer = puppeteerModulu.default || puppeteerModulu

  console.log(`Chrome başlatılıyor... (${CHROME_YOLU})`)
  const tarayici = await puppeteer.launch({
    executablePath: CHROME_YOLU,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
    ],
  })

  const sayfa = await tarayici.newPage()
  await sayfa.setViewport({
    width: GENISLIK,
    height: YUKSEKLIK,
    deviceScaleFactor: OLCEK,
    isMobile: true,
    hasTouch: true,
  })

  // Açık tema taklidi
  await sayfa.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])

  const demoVeri = demoVerisiUret()

  // Sayfa yüklenmeden önce localStorage ve sahte mikrofon API'lerini kur
  await sayfa.evaluateOnNewDocument(
    (veriler, sesMetni) => {
      // 1. localStorage demo verisini yaz
      try {
        for (const [anahtar, deger] of Object.entries(veriler)) {
          localStorage.setItem(anahtar, deger)
        }
      } catch (e) {
        console.error('localStorage yazma hatası:', e)
      }

      // 2. Sahte SpeechRecognition sınıfı
      class SahteKonusmaTanima extends EventTarget {
        constructor() {
          super()
          this.continuous = false
          this.interimResults = false
          this.lang = 'tr-TR'
          this.onresult = null
          this.onend = null
          this.onerror = null
          this.onstart = null
          this._calisiyor = false
        }

        start() {
          this._calisiyor = true
          if (typeof this.onstart === 'function') {
            this.onstart(new Event('start'))
          }
          // 300 ms sonra konuşma sonucunu fırlatır
          setTimeout(() => {
            if (!this._calisiyor) return
            const sonucSatiri = {
              transcript: sesMetni,
              confidence: 0.98,
            }
            const alternatifler = [sonucSatiri]
            alternatifler.isFinal = true
            const tumSonuclar = [alternatifler]
            const olay = {
              resultIndex: 0,
              results: tumSonuclar,
            }
            if (typeof this.onresult === 'function') {
              this.onresult(olay)
            }
            this.dispatchEvent(new CustomEvent('result', { detail: olay }))
          }, 300)
        }

        stop() {
          this._calisiyor = false
          if (typeof this.onend === 'function') {
            this.onend(new Event('end'))
          }
          this.dispatchEvent(new Event('end'))
        }

        abort() {
          this.stop()
        }
      }

      window.SpeechRecognition = SahteKonusmaTanima
      window.webkitSpeechRecognition = SahteKonusmaTanima

      // 3. Sahte getUserMedia (mikrofon)
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia = async () => {
          const sesBaglami = new (window.AudioContext || window.webkitAudioContext)()
          const osilator = sesBaglami.createOscillator()
          const hedef = osilator.connect(sesBaglami.createMediaStreamDestination())
          osilator.start()
          const sesIzi = hedef.stream.getAudioTracks()[0]
          return new MediaStream([sesIzi])
        }
      }

      // 4. Sahte mikrofon izni sorgusu (granted)
      if (navigator.permissions && navigator.permissions.query) {
        const eskiQuery = navigator.permissions.query.bind(navigator.permissions)
        navigator.permissions.query = async (param) => {
          if (param && param.name === 'microphone') {
            return {
              state: 'granted',
              status: 'granted',
              name: 'microphone',
              onchange: null,
              addEventListener: () => {},
              removeEventListener: () => {},
              dispatchEvent: () => false,
            }
          }
          return eskiQuery(param)
        }
      }
      // 5. Next.js geliştirme göstergesini ("N" yuvarlağı) gizle
      const stil = document.createElement('style')
      stil.textContent = `
        nextjs-portal,
        [data-nextjs-toast],
        [data-next-badge-root],
        #__next-build-watcher {
          display: none !important;
        }
      `
      if (document.head) {
        document.head.appendChild(stil)
      } else {
        document.addEventListener('DOMContentLoaded', () => document.head.appendChild(stil))
      }
    },
    demoVeri,
    SESLI_METIN,
  )

  console.log(`Sayfa açılıyor: ${SUNUCU_URL}`)
  await sayfa.goto(SUNUCU_URL, { waitUntil: 'networkidle0', timeout: 30000 })

  // Next.js portal/rozet öğelerini garanti gizle
  await sayfa.addStyleTag({
    content:
      'nextjs-portal, [data-nextjs-toast], [data-next-badge-root], #__next-build-watcher { display: none !important; }',
  }).catch(() => {})

  // Açılış animasyonunun bitmesini bekle
  console.log('Açılış animasyonu bekleniyor...')
  await sayfa.waitForSelector('.acilis-katman', { hidden: true, timeout: 5000 }).catch(() => {})
  await bekle(2200)
  await acilisiTemizle(sayfa)

  /** Ekran görüntüsü kaydeden yardımcı işlev. */
  async function ekranYakala(dosyaAdi) {
    const tamYol = path.join(CIKTI_DIZINI, `${dosyaAdi}.png`)

    // Next.js geliştirme göstergesini her ekran görüntüsünden önce gizle
    await sayfa.addStyleTag({
      content:
        'nextjs-portal, [data-nextjs-toast], [data-next-badge-root], #__next-build-watcher { display: none !important; }',
    }).catch(() => {})

    // Yakalamadan hemen önce: Next.js portalını DOM'dan sil, rozet/toast bildirimlerini temizle ve kaydırmayı en üste al
    await sayfa.evaluate(() => {
      document.querySelectorAll('nextjs-portal').forEach((e) => e.remove())
      document.querySelectorAll('[data-nextjs-toast]').forEach((e) => e.remove())
      document.querySelectorAll('[data-next-badge-root]').forEach((e) => e.remove())
      document.querySelectorAll('#__next-build-watcher').forEach((e) => e.remove())

      const bildirim = document.querySelector('.rozet-bildirimi')
      if (bildirim) bildirim.remove()
      const durumKutusu = document.querySelector('[role="status"]')
      if (durumKutusu && durumKutusu.querySelector('.rozet-bildirimi')) {
        durumKutusu.remove()
      }

      window.scrollTo(0, 0)
      if (document.documentElement) document.documentElement.scrollTop = 0
      if (document.body) document.body.scrollTop = 0
      const kaydirilabilirler = document.querySelectorAll(
        'main, [data-kaydirilabilir], .overflow-y-auto, .overflow-auto'
      )
      for (const el of kaydirilabilirler) {
        el.scrollTop = 0
      }
    })
    await bekle(300)
    await sayfa.screenshot({
      path: tamYol,
      type: 'png',
    })
    console.log(`📸 Ekran yakalandı: ${dosyaAdi}.png -> ${tamYol}`)
  }

  // =========================================================================
  // 1. Ekran: 1-ana-sayfa
  // =========================================================================
  try {
    console.log('\n[1/8] Ana sayfa yakalanıyor...')
    await sayfa.evaluate(() => {
      document.querySelectorAll('nextjs-portal').forEach((e) => e.remove())
      document.querySelectorAll('[data-nextjs-toast]').forEach((e) => e.remove())
      document.querySelectorAll('[data-next-badge-root]').forEach((e) => e.remove())
      document.querySelectorAll('#__next-build-watcher').forEach((e) => e.remove())

      const bildirim = document.querySelector('.rozet-bildirimi')
      if (bildirim) bildirim.remove()
      const durumKutusu = document.querySelector('[role="status"]')
      if (durumKutusu && durumKutusu.querySelector('.rozet-bildirimi')) {
        durumKutusu.remove()
      }

      window.scrollTo(0, 0)
      if (document.documentElement) document.documentElement.scrollTop = 0
      if (document.body) document.body.scrollTop = 0
      const kaydirilabilirler = document.querySelectorAll(
        'main, [data-kaydirilabilir], .overflow-y-auto, .overflow-auto'
      )
      for (const el of kaydirilabilirler) {
        el.scrollTop = 0
      }
    })
    await bekle(700)
    await ekranYakala('1-ana-sayfa')
  } catch (hata) {
    console.error('1-ana-sayfa yakalanırken hata oluştu:', hata.message)
  }

  // =========================================================================
  // 2. Ekran: 2-soru-takibi
  // =========================================================================
  try {
    console.log('\n[2/8] Soru Takibi ekranına gidiliyor...')
    let acildi = await metinleDugmeTikla(
      sayfa,
      ['Soru Takibi', 'Bugünkü soru hedefin'],
      'Ana sayfadan Soru Takibi',
    )
    if (!acildi) {
      await sekmeTikla(sayfa, 'daha')
      await bekle(700)
      acildi = await metinleDugmeTikla(sayfa, ['Soru Takibi'], 'Araçlar menüsünden Soru Takibi')
    }
    if (!acildi) {
      throw new Error('Soru Takibi bağlantısı bulunamadı')
    }
    await bekle(800)
    await ekranYakala('2-soru-takibi')
  } catch (hata) {
    console.error('2-soru-takibi yakalanırken hata oluştu:', hata.message)
  }

  // =========================================================================
  // 3. Ekran: 3-sesli-giris
  // =========================================================================
  try {
    console.log('\n[3/8] Sesli giriş ekranı deneniyor...')
    // "Sesle anlat" düğmesini ara
    const sesleAnlatBulundu = await metinleDugmeTikla(
      sayfa,
      ['Sesle anlat', 'Sesle Anlat', 'Sesli giriş', 'Sesli Giriş'],
      'Sesle anlat butonu',
    )

    if (sesleAnlatBulundu) {
      // Sahte konuşma tanıma 300 ms sonra sonucu iletir
      console.log('  Konuşma tanıma bekleniyor (600 ms)...')
      await bekle(700)

      // "Bitir" düğmesine bas
      const bitirBulundu = await metinleDugmeTikla(
        sayfa,
        ['Bitir', 'Durdur', 'Tamamla', 'Kaydet'],
        'Sesli giriş Bitir butonu',
      )
      if (!bitirBulundu) {
        console.warn('  "Bitir" butonu bulunamadı, onay ekranı doğrudan açılmış olabilir.')
      }

      await bekle(900)
      await ekranYakala('3-sesli-giris')

      // Onay ekranını kapat veya ana sayfaya dön
      await metinleDugmeTikla(sayfa, ['Vazgeç', 'Kapat', 'İptal'])
      await bekle(500)
    } else {
      console.warn('  Soru Takibi ekranında "Sesle anlat" düğmesi bulunamadı (sesli giriş dalı aktif mi?).')
    }
  } catch (hata) {
    console.error('3-sesli-giris yakalanırken hata oluştu:', hata.message)
  }

  // =========================================================================
  // 4. Ekran: 4-denemeler
  // =========================================================================
  try {
    console.log('\n[4/8] Denemeler ekranına gidiliyor...')
    // Temiz gezinme için Ana Sayfa veya Araçlar üzerinden Denemeler'e git
    await sekmeTikla(sayfa, 'daha')
    await bekle(700)
    let denemelerAcildi = await metinleDugmeTikla(sayfa, ['Denemeler', 'Deneme'], 'Araçlar içinden Denemeler')
    if (!denemelerAcildi) {
      await sekmeTikla(sayfa, 'ana')
      await bekle(700)
      denemelerAcildi = await metinleDugmeTikla(sayfa, ['Denemeler'], 'Ana sayfadan Denemeler')
    }
    if (!denemelerAcildi) {
      throw new Error('Denemeler ekranı açılamadı')
    }
    await bekle(800)
    await ekranYakala('4-denemeler')
    await geriDugmesiTikla(sayfa)
    await bekle(500)
  } catch (hata) {
    console.error('4-denemeler yakalanırken hata oluştu:', hata.message)
  }

  // =========================================================================
  // 5. Ekran: 5-harita
  // =========================================================================
  try {
    console.log('\n[5/8] Harita sekmesine gidiliyor...')
    const haritaAcildi = await sekmeTikla(sayfa, 'harita')
    if (!haritaAcildi) {
      throw new Error('Harita sekmesi bulunamadı')
    }
    await bekle(800)
    await ekranYakala('5-harita')
  } catch (hata) {
    console.error('5-harita yakalanırken hata oluştu:', hata.message)
  }

  // =========================================================================
  // 6. Ekran: 7-oyunlar (Pomodoro'dan önce çekiliyor)
  // =========================================================================
  try {
    console.log('\n[6/8] Oyunlar sekmesine gidiliyor...')
    const oyunlarAcildi = await sekmeTikla(sayfa, 'oyunlar')
    if (!oyunlarAcildi) {
      throw new Error('Oyunlar sekmesi açılamadı')
    }
    await bekle(800)
    await ekranYakala('7-oyunlar')
  } catch (hata) {
    console.error('7-oyunlar yakalanırken hata oluştu:', hata.message)
  }

  // =========================================================================
  // 7. Ekran: 8-giydir (Pomodoro'dan önce çekiliyor)
  // =========================================================================
  try {
    console.log('\n[7/8] Rabi\'yi Giydir ekranına gidiliyor...')
    await sekmeTikla(sayfa, 'ana')
    await bekle(700)

    // Ana sayfada "Rabi'yi Giydir" satırı
    const giydirAcildi = await metinleDugmeTikla(
      sayfa,
      ["Rabi'yi Giydir", 'Giydir'],
      'Ana sayfadan Rabi\'yi Giydir',
    )
    if (!giydirAcildi) {
      throw new Error("Rabi'yi Giydir satırı bulunamadı")
    }
    await bekle(800)
    await ekranYakala('8-giydir')
    await geriDugmesiTikla(sayfa)
    await bekle(500)
  } catch (hata) {
    console.error('8-giydir yakalanırken hata oluştu:', hata.message)
  }

  // =========================================================================
  // 8. Ekran: 6-pomodoro (En son çekiliyor, yüzen odak sayacı diğer ekranları etkilemez)
  // =========================================================================
  try {
    console.log('\n[8/8] Pomodoro ekranına gidiliyor...')
    await sekmeTikla(sayfa, 'daha')
    await bekle(700)
    let pomodoroAcildi = await metinleDugmeTikla(sayfa, ['Pomodoro'], 'Araçlar menüsünden Pomodoro')
    if (!pomodoroAcildi) {
      await sekmeTikla(sayfa, 'ana')
      await bekle(700)
      pomodoroAcildi = await metinleDugmeTikla(sayfa, ['Pomodoro'], 'Ana sayfadan Pomodoro')
    }
    if (!pomodoroAcildi) {
      throw new Error('Pomodoro ekranı açılamadı')
    }
    await bekle(800)

    // 1. Ders seç (Matematik)
    await metinleDugmeTikla(sayfa, ['Matematik'], 'Pomodoro ders seçimi: Matematik')
    await bekle(400)

    // 2. Canlı Pomodoro sahnesini başlat
    console.log('  Pomodoro turu başlatılıyor (canlı görünüm için)...')
    const baslatildi = await metinleDugmeTikla(sayfa, ['Başlat', 'Devam et'], 'Pomodoro Başlat')
    if (baslatildi) {
      await bekle(500)
    }

    // 3. Süreyi ilerlet: 18:42 kalacak şekilde Date.now kaydır
    await sayfa.evaluate(() => {
      const orijinalNow = Date.now.bind(Date)
      // 25 dk (1500s) çalışma süresinden 18 dk 42 sn (1122s) kalması için 378 saniye ilerlet
      const farkMs = 378 * 1000
      Date.now = () => orijinalNow() + farkMs
    })
    // Sayaç güncelleyicisinin (500 ms) yeni süreyi (18:42) ve orantılı halkayı çizmesini bekle
    await bekle(800)

    await ekranYakala('6-pomodoro')
    await geriDugmesiTikla(sayfa)
    await bekle(500)
  } catch (hata) {
    console.error('6-pomodoro yakalanırken hata oluştu:', hata.message)
  }

  console.log('\nTüm işlemler tamamlandı. Tarayıcı kapatılıyor.')
  await tarayici.close()
}

anaIslem().catch((hata) => {
  console.error('Kritik betik hatası:', hata)
  process.exit(1)
})
