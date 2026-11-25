// Bu script, AI‑slop içermeyen yüksek çözünürlüklü JPG görselleri PNG'ye dönüştürür ve Rabi'nin
// beklenen dizinlerine kopyalar: `magaza-cikti/app-store/` ve `magaza-cikti/play-store/`.
// Node ortamında `sharp` paketi yüklü olduğu varsayılır (projede zaten bağımlılık).

import sharp from "sharp";
import { join } from "path";
import { mkdirSync } from "fs";

const artifactBase = "C:/Users/ynser/.gemini/antigravity/brain/7c11b0fa-21c0-4f62-a401-19a244d18c04";
const destBase = "C:/Users/ynser/Rabi/magaza-cikti";

// Kaynak‑hedef eşlemeleri (dosya adı bazında)
const mappings = [
  // iOS App Store
  { src: "ios_screen1_anasayfa_1793805525585.jpg", dest: "app-store/screen1.png" },
  { src: "ios_screen2_konuharitasi_1793805556495.jpg", dest: "app-store/screen2.png" },
  { src: "ios_screen3_pomodoro_1793805577734.jpg", dest: "app-store/screen3.png" },
  { src: "ios_screen4_denemetakibi_1793805599290.jpg", dest: "app-store/screen4.png" },
  { src: "ios_screen5_yanlissorubankasi_1793805621367.jpg", dest: "app-store/screen5.png" },
  { src: "ios_screen6_rabiyigiydir_1793805648878.jpg", dest: "app-store/screen6.png" },
  // Android Play Store
  { src: "android_screen1_anasayfa_1793805672572.jpg", dest: "play-store/screen1.png" },
  { src: "android_screen2_konuharitasi_1793805695619.jpg", dest: "play-store/screen2.png" },
  { src: "android_screen3_pomodoro_1793805719195.jpg", dest: "play-store/screen3.png" },
  { src: "android_screen4_denemetakibi_1793805740995.jpg", dest: "play-store/screen4.png" },
  { src: "android_screen5_yanlissorubankasi_1793805765196.jpg", dest: "play-store/screen5.png" },
  { src: "android_screen6_rabiyigiydir_1793805799806.jpg", dest: "play-store/screen6.png" },
  // Feature graphic
  { src: "play_feature_graphic_1793805833699.jpg", dest: "play-store/feature.png" },
];

async function convertAll() {
  for (const { src, dest } of mappings) {
    const srcPath = join(artifactBase, src);
    const destPath = join(destBase, dest);
    // hedef klasörün varlığını sağla
    mkdirSync(join(destBase, dest.split("/")[0]), { recursive: true });
    console.log(`Dönüştürülüyor: ${srcPath} -> ${destPath}`);
    await sharp(srcPath)
      .png({ quality: 100 })
      .toFile(destPath);
  }
  console.log("Tüm görseller PNG olarak kopyalandı.");
}

convertAll().catch(err => {
  console.error("Dönüştürme hatası:", err);
  process.exit(1);
});
