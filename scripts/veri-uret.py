"""ÖSYM PDF metinlerinden Rabi'nin veri dosyasını üretir.

Çıktı: lib/veri/yks-veri.json
  - her yıl için test ortalama/standart sapmaları (son sınıf adayları)
  - sınav ve yerleştirme puanlarının yığınsal dağılımı
"""

import json
import re
import sys

# PDF'teki test adı → uygulamadaki ÖSYM test kodu
TEST_ADLARI = {
    "Türkçe": "tyt-turkce",
    "Sosyal Bilimler": "tyt-sosyal",
    "Temel Matematik": "tyt-mat",
    "Fen Bilimleri": "tyt-fen",
    "Türk Dili ve Edebiyatı": "ayt-edebiyat",
    "Tarih-1": "ayt-tarih1",
    "Coğrafya-1": "ayt-cografya1",
    "Tarih-2": "ayt-tarih2",
    "Coğrafya-2": "ayt-cografya2",
    "Felsefe Grubu": "ayt-felsefe",
    "DKAB/Ek Felsefe Grubu": "ayt-din",
    "Matematik": "ayt-mat",
    "Fizik": "ayt-fizik",
    "Kimya": "ayt-kimya",
    "Biyoloji": "ayt-biyoloji",
    "İngilizce": "ydt",
}

TURLER = ["tyt", "say", "soz", "ea", "dil"]

DAGILIM_SATIRI = re.compile(
    r"^\s*(\d+)(?:\s+ve\s+üstü)?\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\d{4})?\s*$"
)

# "20,5" / "8,115" gibi ondalıklar; binlik ayırıcılı aday sayıları elenmeli
ONDALIK = re.compile(r"\d+,\d+")

# "Matematik" kalıbı "Temel Matematik" satırıyla da eşleşiyordu; AYT Matematik'in
# TYT değerlerini kapmasını önlemek için ön ek dışlanıyor.
ONEK_DISLA = {"Matematik": r"(?<!Temel )"}


def ad_kalibi(pdf_adi):
    onek = ONEK_DISLA.get(pdf_adi, "")
    return (
        rf"{onek}(?<![\wçğıöşüÇĞİÖŞÜ-]){re.escape(pdf_adi)}(?![\wçğıöşüÇĞİÖŞÜ-])"
    )


def dagilim_oku(satirlar, baslangic):
    noktalar = {t: [] for t in TURLER}
    bos = 0
    for satir in satirlar[baslangic:]:
        m = DAGILIM_SATIRI.match(satir)
        if not m:
            if noktalar["tyt"]:
                bos += 1
                if bos > 6:
                    break
            continue
        bos = 0
        puan = int(m.group(1))
        for i, tur in enumerate(TURLER):
            noktalar[tur].append([puan, int(m.group(i + 2).replace(".", ""))])
    for tur in TURLER:
        noktalar[tur].sort(key=lambda x: x[0])
    return noktalar


def istatistik_oku(satirlar):
    """Her testin son sınıf ortalaması ve standart sapması.

    Satırda ilk iki ondalık sayı son sınıf (ortalama, ss); sonraki ikisi tüm
    adaylar. ÖSYM standartlaştırmada son sınıf istatistiklerini kullanıyor
    (2026-YKS Kılavuzu 3.10.1), o yüzden ilk çift alınıyor.
    """
    baslik = next(i for i, s in enumerate(satirlar) if "ORTALAMA VE STANDART SAPMA" in s)
    istatistik = {}

    pencere = satirlar[baslik : baslik + 40]

    for indeks, satir in enumerate(pencere):
        for pdf_adi, kod in TEST_ADLARI.items():
            if kod in istatistik:
                continue
            # Test adı tam sözcük olarak geçmeli; "Matematik" ile "Temel Matematik"
            # karışmasın diye sınır kontrolü var.
            if not re.search(ad_kalibi(pdf_adi), satir):
                continue

            # Bazı yıllarda (2024, 2026) "Temel Matematik" satırında sayı yok;
            # aday sayısı ve istatistikler sonraki satırlara taşmış. O yüzden
            # bu satırdan başlayarak ilk uygun sayı satırı aranıyor.
            for ileri in range(indeks, min(indeks + 4, len(pencere))):
                if ileri != indeks and baska_test_var(pencere[ileri]):
                    break
                sayilar = [float(x.replace(",", ".")) for x in ONDALIK.findall(pencere[ileri])]
                if len(sayilar) >= 2:
                    istatistik[kod] = [sayilar[0], sayilar[1]]
                    break

    return istatistik


def baska_test_var(satir):
    return any(re.search(ad_kalibi(ad), satir) for ad in TEST_ADLARI)


def main():
    cikti = {"kaynak": "ÖSYM YKS Sayısal Bilgiler yayınları", "yillar": {}}

    for yil in (2024, 2025, 2026):
        satirlar = open(f"sb{yil}.txt", encoding="utf-8").read().splitlines()

        sinav_bas = next(i for i, s in enumerate(satirlar) if "SINAV PUANLARININ" in s)
        yer_bas = next(i for i, s in enumerate(satirlar) if "YERLEŞTİRME PUANLARININ" in s)

        istatistik = istatistik_oku(satirlar)
        eksik = set(TEST_ADLARI.values()) - set(istatistik)
        if eksik:
            print(f"{yil}: EKSİK test istatistiği: {sorted(eksik)}", file=sys.stderr)
            sys.exit(1)

        cikti["yillar"][str(yil)] = {
            "istatistik": istatistik,
            "sinav": dagilim_oku(satirlar, sinav_bas),
            "yerlestirme": dagilim_oku(satirlar, yer_bas),
        }
        print(f"{yil}: {len(istatistik)} test, "
              f"{len(cikti['yillar'][str(yil)]['sinav']['ea'])} sınav eşiği, "
              f"{len(cikti['yillar'][str(yil)]['yerlestirme']['ea'])} yerleştirme eşiği")

    yol = sys.argv[1]
    with open(yol, "w", encoding="utf-8") as dosya:
        json.dump(cikti, dosya, ensure_ascii=False, separators=(",", ":"))
    print("yazıldı:", yol)


if __name__ == "__main__":
    main()
