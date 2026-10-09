# Devamsızlık kuralları

Kaynak: MEB Ortaöğretim Kurumları Yönetmeliği, Madde 36.

## Sınırlar (`lib/hesap.ts`)

- `OZURSUZ_SINIR = 10`: özürsüz devamsızlık en fazla 10 gün.
- `TOPLAM_SINIR = 30`: özürlü + özürsüz toplam en fazla 30 gün.
- Özürlünün ayrı sabit sınırı yok. Özürlü çubuğunun sınırı
  `TOPLAM_SINIR - kullanılan özürsüz gün`; yani her özürsüz gün özürlü hakkını da
  düşürür. Özürlüden kalan = toplamdan kalan.
- Yarım gün 0,5 sayılır; sayılar `yuvarla(…, 1)` ile tutulur.
- Hak her ders yılında sıfırlanır (`dersYilininKayitlari`).

## Durumlar

- `asildi`: özürsüz > 10 veya toplam > 30.
- `uyari`: aşılmadı ve (özürsüz >= 7 veya toplam >= 21) — sınırın %70'i
  (`DEVAMSIZLIK_UYARI_ORANI`).

## Ekranlar

- Devamsızlık ekranı: "Kalan hakkın" kartında özürlü çubuğu üstte, özürsüz altta.
  Başlık `kullanılan / 30 gün`.
- Ekleme penceresi: "Kalan X günden düşer" metinleri o türün güncel kalanını
  gösterir (özürsüz için `ozursuzKalan`, özürlü için `ozurluKalan`).
- Ana sayfa uyarısı: "özürlü {ozurluKalan}, özürsüz {ozursuzKalan} gün hakkın kaldı".
