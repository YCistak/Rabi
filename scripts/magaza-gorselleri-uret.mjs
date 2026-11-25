/**
 * Rabi — App Store & Google Play Mağaza Görselleri Üretim Betiği
 * 
 * Bu betik, tasarım onaylandığında hem App Store (1290x2796)
 * hem de Google Play Store (1080x2400 + 1024x500 Feature Graphic)
 * için yüksek çözünürlüklü vitrin görsellerini otomatik olarak üretir.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const CIKTI_KOK = path.resolve('magaza-cikti');
const CIKTI_APP_STORE = path.join(CIKTI_KOK, 'app-store');
const CIKTI_PLAY_STORE = path.join(CIKTI_KOK, 'play-store');

// Klasörleri hazırla
[CIKTI_KOK, CIKTI_APP_STORE, CIKTI_PLAY_STORE].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

export const SLAYTLAR = [
  {
    no: 1,
    ad: '1-hedef-ve-sayac',
    rozet: '✨ YKS 2027 • TYT - AYT - YDT',
    rozetRenk: '#FFEADF',
    rozetMetinRenk: '#B3491F',
    baslik1: 'Sınava Değil,',
    baslik2: 'Hedefine',
    baslik2Renk: '#D9622F',
    baslik3: 'Odaklan',
    aciklama: 'Geri sayım, günlük soru hedefi ve tahmini sıralaman tek ekranda.',
    zeminUst: '#FFFFFF',
    zeminOrta: '#FFF7F2',
    zeminAlt: '#FFDDCF',
    ekranResmi: 'docs/ekranlar/ana-sayfa.webp',
    maskotResmi: 'public/tavsan-kucak-acan.png',
    maskotTaraf: 'sag',
    ucanRozetIkon: '🎯',
    ucanRozetMetin: 'Geri Sayım & Hedefim'
  },
  {
    no: 2,
    ad: '2-konu-haritasi',
    rozet: '🗺️ MEB MAARİF MÜFREDATI',
    rozetRenk: '#E0EDFF',
    rozetMetinRenk: '#1D4ED8',
    baslik1: 'Adım Adım',
    baslik2: 'Zirveye',
    baslik2Renk: '#2563EB',
    baslik3: 'İlerle',
    aciklama: 'Bölüm bölüm açılan konu kartları, yoklama biletleri ve eğlenceli patika.',
    zeminUst: '#FFFFFF',
    zeminOrta: '#F2F7FF',
    zeminAlt: '#D6E6FF',
    ekranResmi: 'docs/ekranlar/konu-haritasi.webp',
    maskotResmi: 'public/tavsan-kitapli.png',
    maskotTaraf: 'sol',
    ucanRozetIkon: '📖',
    ucanRozetMetin: 'Özet Konu Kartları'
  },
  {
    no: 3,
    ad: '3-deneme-analizi',
    rozet: '📊 AKILLI DENEME RAPORU',
    rozetRenk: '#DCFCE7',
    rozetMetinRenk: '#15803D',
    baslik1: 'Netlerini Gör,',
    baslik2: 'Farkı',
    baslik2Renk: '#059669',
    baslik3: 'Yakala',
    aciklama: 'TYT ve AYT denemelerini kaydet, güçlü ve zayıf konularını anında keşfet.',
    zeminUst: '#FFFFFF',
    zeminOrta: '#F0FDF4',
    zeminAlt: '#D1FAE5',
    ekranResmi: 'docs/ekran/istatistik.png',
    maskotResmi: 'public/tavsan-fotografci.png',
    maskotTaraf: 'sag',
    ucanRozetIkon: '📸',
    ucanRozetMetin: 'Fotoğrafla Optik Okut'
  },
  {
    no: 4,
    ad: '4-pomodoro-odak',
    rozet: '⏱️ DİKKAT DAĞILMASINA SON',
    rozetRenk: '#F3E8FF',
    rozetMetinRenk: '#6B21A8',
    baslik1: 'Masada Kal,',
    baslik2: 'Zamanı',
    baslik2Renk: '#7C3AED',
    baslik3: 'Yönet',
    aciklama: 'Uygulama engelleyici odak kilidi ve canlı kilit ekranı ile kesintisiz çalışma.',
    zeminUst: '#FFFFFF',
    zeminOrta: '#FAF5FF',
    zeminAlt: '#E9D5FF',
    ekranResmi: 'docs/ekranlar/pomodoro.webp',
    maskotResmi: 'public/tavsan-saatli.png',
    maskotTaraf: 'sag',
    ucanRozetIkon: '🔒',
    ucanRozetMetin: 'Odak Kilidi Koruması'
  },
  {
    no: 5,
    ad: '5-soru-takibi',
    rozet: '📚 GÜNLÜK HEDEF & KAYNAK',
    rozetRenk: '#FEF3C7',
    rozetMetinRenk: '#B45309',
    baslik1: 'Kitaplarını',
    baslik2: 'Eksiksiz',
    baslik2Renk: '#D97706',
    baslik3: 'Bitir',
    aciklama: 'Test kitaplarını ekle, günlük hedefini doldur, konu bazlı bitirme oranını gör.',
    zeminUst: '#FFFFFF',
    zeminOrta: '#FFFBEB',
    zeminAlt: '#FDE68A',
    ekranResmi: 'docs/ekranlar/soru-takibi.webp',
    maskotResmi: 'public/tavsan-basparmak.png',
    maskotTaraf: 'sol',
    ucanRozetIkon: '👍',
    ucanRozetMetin: 'Kaynak Takibi & Çetele'
  },
  {
    no: 6,
    ad: '6-mini-oyunlar',
    rozet: '🧠 HIZLI BEYİN EGZERSİZİ',
    rozetRenk: '#FFEADF',
    rozetMetinRenk: '#B3491F',
    baslik1: 'Öğrenmeyi',
    baslik2: 'Oyuna',
    baslik2Renk: '#D9622F',
    baslik3: 'Çevir',
    aciklama: 'Hızlı işlem ve eşleştirme oyunları. Yanlış sorularından özel testler üret.',
    zeminUst: '#FFFFFF',
    zeminOrta: '#FFF8F4',
    zeminAlt: '#FFDFD0',
    ekranResmi: 'docs/ekranlar/oyunlar.webp',
    maskotResmi: 'public/tavsan-yapboz.png',
    maskotTaraf: 'sag',
    ucanRozetIkon: '🧩',
    ucanRozetMetin: 'Oyun & Yanlış Bankası'
  }
];

function escapeXml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * App Store için tek görsel üret (1290 x 2796 px)
 */
async function appStoreGorseliUret(slayt) {
  const G = 1290;
  const Y = 2796;

  // 1. Zemin ve Metin SVG'si
  const svgArkaplan = `
  <svg width="${G}" height="${Y}" viewBox="0 0 ${G} ${Y}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="zeminGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${slayt.zeminUst}"/>
        <stop offset="45%" stop-color="${slayt.zeminOrta}"/>
        <stop offset="100%" stop-color="${slayt.zeminAlt}"/>
      </linearGradient>
      <filter id="golge" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="25" stdDeviation="30" flood-opacity="0.35" flood-color="#000000"/>
      </filter>
    </defs>

    <!-- Gradyan Zemin -->
    <rect width="${G}" height="${Y}" fill="url(#zeminGrad)"/>

    <!-- Üst Rozet -->
    <g transform="translate(${G / 2}, 160)">
      <rect x="-240" y="-32" width="480" height="64" rx="32" fill="${slayt.rozetRenk}" stroke="${slayt.rozetMetinRenk}" stroke-opacity="0.25" stroke-width="2"/>
      <text x="0" y="10" font-family="'Nunito', sans-serif" font-size="28" font-weight="800" fill="${slayt.rozetMetinRenk}" text-anchor="middle" letter-spacing="1">${escapeXml(slayt.rozet)}</text>
    </g>

    <!-- Ana Başlık (2 Satır) -->
    <text x="${G / 2}" y="320" font-family="'Nunito', sans-serif" font-size="78" font-weight="900" fill="#1F1E1D" text-anchor="middle" letter-spacing="-1">
      ${escapeXml(slayt.baslik1)} <tspan fill="${slayt.baslik2Renk}">${escapeXml(slayt.baslik2)}</tspan> ${escapeXml(slayt.baslik3)}
    </text>

    <!-- Alt Açıklama -->
    <text x="${G / 2}" y="405" font-family="'Nunito', sans-serif" font-size="36" font-weight="600" fill="#635F59" text-anchor="middle">
      ${escapeXml(slayt.aciklama)}
    </text>

    <!-- Uçan Rozet (Sol veya Sağ) -->
    <g transform="translate(${slayt.maskotTaraf === 'sag' ? 160 : G - 480}, 690)">
      <rect width="360" height="76" rx="22" fill="#FFFFFF" fill-opacity="0.94" stroke="#FFFFFF" stroke-width="2" filter="url(#golge)"/>
      <text x="35" y="48" font-size="34">${escapeXml(slayt.ucanRozetIkon)}</text>
      <text x="90" y="48" font-family="'Nunito', sans-serif" font-size="28" font-weight="800" fill="#1F1E1D">${escapeXml(slayt.ucanRozetMetin)}</text>
    </g>
  </svg>
  `;

  // 2. Telefon Cihaz Çerçevesi ve Ekran Görüntüsü
  // Telefon genişliği: 1000px, yüksekliği: 2060px (Gövde aşağı taşıyor)
  const telGenislik = 1000;
  const telYukseklik = 2060;
  const ekranGenislik = 936;
  const ekranYukseklik = 1996;

  // Ekran görüntüsünü kırp ve ölçekle
  const ekranBuffer = await sharp(slayt.ekranResmi)
    .resize(ekranGenislik, ekranYukseklik, { fit: 'cover', position: 'top' })
    .toBuffer();

  // Telefon çerçevesi SVG'si
  const telCerceveSvg = `
  <svg width="${telGenislik}" height="${telYukseklik}" viewBox="0 0 ${telGenislik} ${telYukseklik}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="ekranKlip">
        <rect x="32" y="32" width="${ekranGenislik}" height="${ekranYukseklik}" rx="100"/>
      </clipPath>
      <filter id="telGolge" x="-15%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="50" stdDeviation="40" flood-opacity="0.45" flood-color="#000000"/>
      </filter>
    </defs>

    <!-- Telefon Dış Titanyum Gövde -->
    <rect x="10" y="10" width="${telGenislik - 20}" height="${telYukseklik - 20}" rx="120" fill="#171719" stroke="#3A3840" stroke-width="12" filter="url(#telGolge)"/>

    <!-- Dynamic Island -->
    <rect x="${(telGenislik - 260) / 2}" y="56" width="260" height="72" rx="36" fill="#000000"/>
    <circle cx="${(telGenislik + 180) / 2}" cy="92" r="14" fill="#0B101D" stroke="#1D253B" stroke-width="2"/>
  </svg>
  `;

  // Telefon bileşimini hazırla (Ekran + Dynamic Island ve Titanyum Çerçeve)
  const telefonComposite = await sharp(Buffer.from(telCerceveSvg))
    .composite([
      {
        input: ekranBuffer,
        top: 32,
        left: 32,
        blend: 'over'
      },
      // Dynamic Island tekrar üstte kalsın
      {
        input: Buffer.from(`
          <svg width="${telGenislik}" height="${telYukseklik}" xmlns="http://www.w3.org/2000/svg">
            <rect x="${(telGenislik - 260) / 2}" y="56" width="260" height="72" rx="36" fill="#000000"/>
            <circle cx="${(telGenislik + 180) / 2}" cy="92" r="14" fill="#0B101D" stroke="#1D253B" stroke-width="2"/>
          </svg>
        `),
        top: 0,
        left: 0
      }
    ])
    .png()
    .toBuffer();

  // 3. Maskot Görseli
  const maskotBoyut = 480;
  const maskotBuffer = await sharp(slayt.maskotResmi)
    .resize(maskotBoyut, maskotBoyut, { fit: 'inside' })
    .toBuffer();

  const maskotSol = slayt.maskotTaraf === 'sag' ? G - maskotBoyut - 20 : 20;
  const maskotUst = Y - maskotBoyut - 180;

  // 4. Nihai Birleştirme
  const ciktiDosyasi = path.join(CIKTI_APP_STORE, `${slayt.ad}.png`);
  await sharp(Buffer.from(svgArkaplan))
    .composite([
      {
        input: telefonComposite,
        left: Math.round((G - telGenislik) / 2),
        top: 560
      },
      {
        input: maskotBuffer,
        left: maskotSol,
        top: maskotUst
      }
    ])
    .png({ quality: 100 })
    .toFile(ciktiDosyasi);

  console.log(`✓ App Store Slayt ${slayt.no} üretildi: ${ciktiDosyasi}`);
}

/**
 * Google Play Store için tek görsel üret (1080 x 2400 px)
 */
async function playStoreGorseliUret(slayt) {
  const G = 1080;
  const Y = 2400;

  const svgArkaplan = `
  <svg width="${G}" height="${Y}" viewBox="0 0 ${G} ${Y}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="zeminGradPlay" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${slayt.zeminUst}"/>
        <stop offset="45%" stop-color="${slayt.zeminOrta}"/>
        <stop offset="100%" stop-color="${slayt.zeminAlt}"/>
      </linearGradient>
      <filter id="golgePlay" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="20" stdDeviation="25" flood-opacity="0.3" flood-color="#000000"/>
      </filter>
    </defs>

    <rect width="${G}" height="${Y}" fill="url(#zeminGradPlay)"/>

    <!-- Rozet -->
    <g transform="translate(${G / 2}, 140)">
      <rect x="-210" y="-28" width="420" height="56" rx="28" fill="${slayt.rozetRenk}" stroke="${slayt.rozetMetinRenk}" stroke-opacity="0.25" stroke-width="2"/>
      <text x="0" y="9" font-family="'Nunito', sans-serif" font-size="25" font-weight="800" fill="${slayt.rozetMetinRenk}" text-anchor="middle" letter-spacing="1">${escapeXml(slayt.rozet)}</text>
    </g>

    <!-- Başlık -->
    <text x="${G / 2}" y="280" font-family="'Nunito', sans-serif" font-size="66" font-weight="900" fill="#1F1E1D" text-anchor="middle" letter-spacing="-1">
      ${escapeXml(slayt.baslik1)} <tspan fill="${slayt.baslik2Renk}">${escapeXml(slayt.baslik2)}</tspan> ${escapeXml(slayt.baslik3)}
    </text>

    <!-- Açıklama -->
    <text x="${G / 2}" y="350" font-family="'Nunito', sans-serif" font-size="30" font-weight="600" fill="#635F59" text-anchor="middle">
      ${escapeXml(slayt.aciklama)}
    </text>

    <!-- Uçan Rozet -->
    <g transform="translate(${slayt.maskotTaraf === 'sag' ? 120 : G - 440}, 590)">
      <rect width="320" height="66" rx="20" fill="#FFFFFF" fill-opacity="0.94" stroke="#FFFFFF" stroke-width="2" filter="url(#golgePlay)"/>
      <text x="30" y="42" font-size="30">${escapeXml(slayt.ucanRozetIkon)}</text>
      <text x="80" y="43" font-family="'Nunito', sans-serif" font-size="25" font-weight="800" fill="#1F1E1D">${escapeXml(slayt.ucanRozetMetin)}</text>
    </g>
  </svg>
  `;

  const telGenislik = 860;
  const telYukseklik = 1800;
  const ekranGenislik = 806;
  const ekranYukseklik = 1746;

  const ekranBuffer = await sharp(slayt.ekranResmi)
    .resize(ekranGenislik, ekranYukseklik, { fit: 'cover', position: 'top' })
    .toBuffer();

  const telCerceveSvg = `
  <svg width="${telGenislik}" height="${telYukseklik}" viewBox="0 0 ${telGenislik} ${telYukseklik}" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="${telGenislik - 16}" height="${telYukseklik - 16}" rx="90" fill="#171719" stroke="#3A3840" stroke-width="10"/>
  </svg>
  `;

  const telefonComposite = await sharp(Buffer.from(telCerceveSvg))
    .composite([
      { input: ekranBuffer, top: 27, left: 27, blend: 'over' }
    ])
    .png()
    .toBuffer();

  const maskotBoyut = 400;
  const maskotBuffer = await sharp(slayt.maskotResmi)
    .resize(maskotBoyut, maskotBoyut, { fit: 'inside' })
    .toBuffer();

  const maskotSol = slayt.maskotTaraf === 'sag' ? G - maskotBoyut - 15 : 15;
  const maskotUst = Y - maskotBoyut - 140;

  const ciktiDosyasi = path.join(CIKTI_PLAY_STORE, `${slayt.ad}.png`);
  await sharp(Buffer.from(svgArkaplan))
    .composite([
      { input: telefonComposite, left: Math.round((G - telGenislik) / 2), top: 480 },
      { input: maskotBuffer, left: maskotSol, top: maskotUst }
    ])
    .png({ quality: 100 })
    .toFile(ciktiDosyasi);

  console.log(`✓ Play Store Slayt ${slayt.no} üretildi: ${ciktiDosyasi}`);
}

/**
 * Google Play Store Öne Çıkan Görseli (1024 x 500 px Banner)
 */
async function featureGraphicUret() {
  const G = 1024;
  const Y = 500;

  const svgArkaplan = `
  <svg width="${G}" height="${Y}" viewBox="0 0 ${G} ${Y}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#A23E15"/>
        <stop offset="45%" stop-color="#D9622F"/>
        <stop offset="100%" stop-color="#E27344"/>
      </linearGradient>
    </defs>

    <rect width="${G}" height="${Y}" fill="url(#bannerGrad)"/>

    <!-- Dekoratif Daireler -->
    <circle cx="850" cy="180" r="280" fill="none" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="2"/>
    <circle cx="920" cy="140" r="420" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1.5"/>

    <!-- Logo & Başlık -->
    <text x="60" y="165" font-family="'Rubik', sans-serif" font-size="44" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">Rabi</text>
    
    <text x="60" y="235" font-family="'Nunito', sans-serif" font-size="34" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">
      YKS Hazırlığında <tspan fill="#FFE6D6">Tek Yol Arkadaşın</tspan>
    </text>

    <text x="60" y="280" font-family="'Nunito', sans-serif" font-size="16" font-weight="600" fill="#FFDEC9">
      Konu haritası, deneme analizi, odak koruyucu Pomodoro ve mini oyunlar.
    </text>

    <!-- Haplar -->
    <g transform="translate(60, 320)">
      <rect x="0" y="0" width="155" height="36" rx="18" fill="#FFFFFF" fill-opacity="0.2" stroke="#FFFFFF" stroke-opacity="0.3"/>
      <text x="77" y="23" font-family="'Nunito', sans-serif" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle">🗺️ Maarif Müfredatı</text>

      <rect x="165" y="0" width="125" height="36" rx="18" fill="#FFFFFF" fill-opacity="0.2" stroke="#FFFFFF" stroke-opacity="0.3"/>
      <text x="227" y="23" font-family="'Nunito', sans-serif" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle">⏱️ Odak Kilidi</text>

      <rect x="300" y="0" width="145" height="36" rx="18" fill="#FFFFFF" fill-opacity="0.2" stroke="#FFFFFF" stroke-opacity="0.3"/>
      <text x="372" y="23" font-family="'Nunito', sans-serif" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle">📊 Deneme Analizi</text>
    </g>

    <text x="60" y="440" font-family="'Nunito', sans-serif" font-size="14" font-weight="700" fill="#FFFFFF" fill-opacity="0.8">
      ✨ Reklamsız • Tamamen Ücretsiz • Çevrimdışı Çalışır
    </text>
  </svg>
  `;

  // App icon (58x58)
  const iconBuffer = await sharp('public/icon-512.png')
    .resize(60, 60)
    .toBuffer();

  // Telefon 1 & 2
  const tel1Buffer = await sharp('docs/ekranlar/ana-sayfa.webp')
    .resize(220, 460, { fit: 'cover' })
    .toBuffer();

  const tel2Buffer = await sharp('docs/ekranlar/konu-haritasi.webp')
    .resize(200, 420, { fit: 'cover' })
    .toBuffer();

  // Maskot
  const maskotBuffer = await sharp('public/tavsan-kucak-acan.png')
    .resize(190, 190, { fit: 'inside' })
    .toBuffer();

  const ciktiDosyasi = path.join(CIKTI_PLAY_STORE, 'one-cikan-gorsel-1024x500.png');
  await sharp(Buffer.from(svgArkaplan))
    .composite([
      { input: iconBuffer, left: 60, top: 70 },
      { input: tel2Buffer, left: 660, top: 120 },
      { input: tel1Buffer, left: 760, top: 90 },
      { input: maskotBuffer, left: 810, top: 290 }
    ])
    .png({ quality: 100 })
    .toFile(ciktiDosyasi);

  console.log(`✓ Google Play Öne Çıkan Görsel üretildi: ${ciktiDosyasi}`);
}

/**
 * Tüm paketi üret
 */
export async function hepsiniUret() {
  console.log('--- Rabi Mağaza Görselleri Üretimi Başlıyor ---');
  for (const slayt of SLAYTLAR) {
    await appStoreGorseliUret(slayt);
    await playStoreGorseliUret(slayt);
  }
  await featureGraphicUret();
  console.log('--- Tüm görseller başarıyla magaza-cikti/ klasörüne üretildi! ---');
}

// Doğrudan çalıştırıldıysa üretimi başlat
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  hepsiniUret().catch(err => {
    console.error('Hata:', err);
    process.exit(1);
  });
}
