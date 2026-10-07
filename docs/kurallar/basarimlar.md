# Başarımlar

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

- Arayüzde ad **Başarımlar**; kod, `Ekran` kimliği `rozetler`, depo anahtarı
  `rabi-rozetler`, yedek alanı `rozetler` kalır.
- Ekran: tek sayaç, süzgeç (Tümü · Kazanılan · Kilitli), tam genişlik satırlar; türe
  göre gruplama ve istatistik ızgarası yok. İstatistik eklemeden sor: bu sayı hangi
  rozete ne kadar kaldığını mı söylüyor? `kademeSayimi`, `KADEME_SIRASI` testler ve
  bildirim için duruyor. Tarih kısa ("9 May"), yıl yalnız bu yıl değilse.
- Kutlama pencere değil yukarıdan inen şerit (`components/rozet-bildirimi.tsx`,
  tasarım `tasarim/basarim-bildirim.html`); dokunuşu geçirir. Kilit sarsılıp kalkar,
  renk ayrı katman (`rozet-yuz`; renkler `rozet-renk.ts`ten, keyframe'e yazılmaz). `BILDIRIM_SURESI` (4820 ms) `globals.css`teki
  gecikmelerle **eşleşmeli**.
- `bildirilecekler` her türden yalnız en değerlisini bildirir; kayda hepsi girer
  (`yeniRozetler`). Kuyruk `AppShell`de, ekranda tek bildirim, `key` = rozet kimliği.

## Seviye, havuç, mağaza yok

Üçü silindi; eski anahtarlar `ESKI_ANAHTARLAR`ta. Geri getirme: veriler elle
giriliyor ve harcanabilir ödül, veriyi şişirmeye sebep olur. Yeni ödül sistemi
düşünüyorsan sor: kullanıcı ödülü veriyi uydurarak alabiliyor mu?
