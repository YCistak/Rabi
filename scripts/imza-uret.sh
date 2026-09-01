#!/usr/bin/env bash
#
# Release imza anahtarı üretir.
#
# Neden gerekiyor: debug anahtarı bütün Android SDK kurulumlarında **aynı** ve
# Google onu tanıyor. Onunla imzalanmış, üstelik tanımadığı yerel kütüphaneler
# taşıyan bir APK'yı Play Protect "cihazınızı korumak için engellendi" diye
# reddediyor ve telefona hiç kurulmuyor. Kendi anahtarınla imzalanan APK'nın
# kimliği kararlı oluyor.
#
# Bu anahtar aynı zamanda Play'in **upload key**'i olacak (`reports/01-gap.md`
# BLOCKER-2). İlk AAB yüklemesinde Play App Signing'e kaydolurken Google'ın
# kendi app signing key'i üretmesini seç; kendi anahtarını yükleme seçeneği
# geri dönülemez ve yedek sorumluluğu sana kalır.
#
# Kullanım:  bash scripts/imza-uret.sh
#
# Betik parolayı **sormadan hiçbir şey yazmıyor** ve parolayı kendisi
# üretmiyor: anahtarı kaybetmek uygulamayı bir daha güncelleyememek demek.

set -euo pipefail

KLASOR="$HOME/rabi-imza"
ANAHTAR="$KLASOR/rabi-release.jks"
TAKMA_AD="rabi"
OZELLIKLER="$(cd "$(dirname "$0")/.." && pwd)/android/keystore.properties"

if [ -f "$ANAHTAR" ]; then
  echo "Anahtar zaten var: $ANAHTAR"
  echo "Üstüne yazmıyorum — eskisini kaybetmek uygulamayı güncelleyememek demek."
  echo "Yeniden üretmek istiyorsan önce onu elle taşı."
  exit 1
fi

mkdir -p "$KLASOR"
chmod 700 "$KLASOR"

echo "Anahtar üretilecek: $ANAHTAR"
echo "Parolayı iki kez soracak. En az 12 karakter kullan ve bir yere yaz —"
echo "kaybedersen uygulamayı bir daha güncelleyemezsin."
echo

# 10000 gün ≈ 27 yıl. Play, geçerliliği 2033'ten sonra biten anahtar istiyor.
# PKCS12: JKS biçimi Java 9'dan beri eskimiş sayılıyor ve keytool uyarı veriyor.
keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore "$ANAHTAR" \
  -alias "$TAKMA_AD" \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10000 \
  -dname "CN=Rabi, OU=Rabi, O=Rabi, L=Istanbul, C=TR"

chmod 600 "$ANAHTAR"

echo
echo "Şimdi aynı parolayı bir kez daha yaz; Gradle'ın okuyacağı dosyaya yazılacak."
read -rsp "Parola: " PAROLA
echo

# `keystore.properties` .gitignore'da (satır 31) — depoya girmiyor.
umask 077
cat > "$OZELLIKLER" <<DOSYA
storeFile=$ANAHTAR
storePassword=$PAROLA
keyAlias=$TAKMA_AD
keyPassword=$PAROLA
DOSYA

echo
echo "Bitti."
echo "  Anahtar : $ANAHTAR"
echo "  Ayar    : $OZELLIKLER  (depoya girmiyor)"
echo
echo "ŞİMDİ YAP: anahtarı ve parolayı iki ayrı yere yedekle."
echo "Kaybolursa Play'deki uygulamayı bir daha güncelleyemezsin."
echo
echo "İmzalı APK için:  npm run apk:imzali"
