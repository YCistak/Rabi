#!/usr/bin/env bash
#
# Rabi'nin Android ikonlarını ve açılış ekranını üretir.
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
gecici="$(mktemp -d)"
trap 'rm -rf "$gecici"' EXIT

for arac in rsvg-convert magick; do
  command -v "$arac" >/dev/null || { echo "eksik araç: $arac" >&2; exit 1; }
done

# Havuç turuncusu — uygulama temasının vurgu rengi. Uyarlanabilir ikonun arka
# planı ve açılış ekranının zemini bununla aynı olmalı.
VURGU="#c2622a"

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

echo "» Açılış ekranı"
# Capacitor'ın şablonu dikey/yatay ve yoğunluk başına ayrı dosya bekliyor.
# Görsel ortalanıp zemin renkle dolduruluyor; oranı bozulmasın diye tavşan
# sabit boyda kalıp tuval büyütülüyor.
acilis() {
  local en="$1" boy="$2" hedef="$3"
  local kucuk=$(( en < boy ? en : boy ))
  local maskot=$(( kucuk * 40 / 100 ))
  rsvg-convert -w "$maskot" -h "$maskot" "$kok/assets/acilis-maskot.svg" -o "$gecici/m.png"
  # PNG8 + 64 renk: görsel düz zemin üstünde tek bir maskot, 24 bit renk gereksiz.
  # Kayıpsız 24 bit bırakılınca dosyalar üç katına çıkıyor ve APK'yı boşuna şişiriyor.
  magick -size "${en}x${boy}" "xc:$VURGU" "$gecici/m.png" -gravity center -composite \
    -colors 128 "PNG8:$hedef"
}

# Yoğunluk × yön. Ölçüler Capacitor şablonundaki dosyalarla aynı.
for kademe in "mdpi 320 480" "hdpi 480 800" "xhdpi 720 1280" "xxhdpi 960 1600" "xxxhdpi 1280 1920"; do
  set -- $kademe
  acilis "$2" "$3" "$res/drawable-port-$1/splash.png"
  acilis "$3" "$2" "$res/drawable-land-$1/splash.png"
done

# Yönü olmayan yedek (eski cihazlar bunu kullanıyor).
acilis 480 320 "$res/drawable/splash.png"

echo "» Web ikonları"
rsvg-convert -w 512 -h 512 "$kok/assets/icon-kare.svg" -o "$kok/public/icon-512.png"
rsvg-convert -w 192 -h 192 "$kok/assets/icon-kare.svg" -o "$kok/public/icon-192.png"

echo "bitti"
