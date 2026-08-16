#!/usr/bin/env bash
#
# Rabi'nin Android uygulama ikonlarını üretir.
#
#   ./scripts/ikon-uret.sh
#
# Kaynak SVG'ler `assets/` altında; buradan üretilen PNG'ler
# `android/app/src/main/res/` altına yazılır. Üretilen dosyalar depoya
# giriyor (Capacitor onları `cap sync` sırasında silmiyor), ama elle
# düzenlenmemeli — ikon değişecekse SVG düzenlenip bu betik yeniden
# çalıştırılmalı.
#
# Gereken: rsvg-convert (librsvg) ve ImageMagick.

set -euo pipefail

kok="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
res="$kok/android/app/src/main/res"
for arac in rsvg-convert magick; do
  command -v "$arac" >/dev/null || { echo "eksik araç: $arac" >&2; exit 1; }
done

# Not: açılış ekranı burada üretilmiyor. Sistem açılış ekranı (Android 12+ ve
# androidx uyumluluk katmanı) tam ekran görsel değil, zemin rengi + vektör ikon
# istiyor: `values/colors.xml` içindeki `acilis_zemin` ve
# `drawable/acilis_maskot.xml`. İkisi de elle tutuluyor.

echo "» Uyarlanabilir ikon ön planı"
# Yoğunluklar: mdpi 108 birim taban, her kademe katsayısıyla çarpılıyor.
for kademe in "mdpi 108" "hdpi 162" "xhdpi 216" "xxhdpi 324" "xxxhdpi 432"; do
  set -- $kademe
  rsvg-convert -w "$2" -h "$2" "$kok/assets/ikon-onplan.svg" \
    -o "$res/mipmap-$1/ic_launcher_foreground.png"
done

echo "» Eski sürüm ikonları (kare ve yuvarlak)"
# Android 8 öncesi uyarlanabilir ikonu tanımıyor; arka planı basılmış hazır
# görsel gerekiyor. Yuvarlak olan da ayrı: maskeyi sistem uygulamıyor.
for kademe in "mdpi 48" "hdpi 72" "xhdpi 96" "xxhdpi 144" "xxxhdpi 192"; do
  set -- $kademe
  boy="$2"
  rsvg-convert -w "$boy" -h "$boy" "$kok/assets/icon-kare.svg" \
    -o "$res/mipmap-$1/ic_launcher.png"

  # Yuvarlak sürüm: aynı görsel daire maskesinden geçiriliyor.
  rsvg-convert -w "$boy" -h "$boy" "$kok/assets/icon-yuvarlak.svg" \
    -o "$res/mipmap-$1/ic_launcher_round.png"
done

echo "» Web ikonları"
rsvg-convert -w 512 -h 512 "$kok/assets/icon-kare.svg" -o "$kok/public/icon-512.png"
rsvg-convert -w 192 -h 192 "$kok/assets/icon-kare.svg" -o "$kok/public/icon-192.png"

echo "bitti"
