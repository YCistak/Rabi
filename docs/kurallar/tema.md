# Tema (açık / koyu)

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).
Yol haritası ve kalan işler: [koyu-tema-plani.md](../koyu-tema-plani.md).

- **Tercih üç, tema iki.** `Ayarlar.tema`: `'sistem'` (Telefona uy) · `'acik'` · `'koyu'`;
  `<html data-tema>`da her zaman çözülmüş `acik`/`koyu`. Kural tek yerde: `temaCoz`
  (`lib/tema.ts`). Kurulumda **sorulmaz** (kullanıcı kararı, 2026-10-28); varsayılan ve
  alanı olmayan eski kayıt `'sistem'` — eski kullanıcı da (kullanıcı kararı).
- **`KOYU_TEMA_ACIK`** (`lib/tema.ts`) kapalıyken "Telefona uy" açık çizer; koyu
  ekranlar bitince açılır (plan PR 5). Kapalıyken yalnız elle yazılmış `tema: 'koyu'`
  koyu çizer — geliştirici denemesi için.
- **İlk kare:** `layout.tsx`teki satır içi betik (`ilkKareTemaBetigi`) React'ten önce
  `data-tema` ve `theme-color` yazar; `useTema` (`lib/tema-kancasi.ts`) yedeği ve
  çalışırken telefon modu değişikliğini (`matchMedia` + öne gelişte yeniden okuma)
  izler. Tema değişirken `tema-degisiyor` sınıfı geçişleri bir iki kare kapatır.
- Viewport `colorScheme: 'light dark'`: Android WebView gece modunda sayfayı kendi
  kendine karartmasın. Hangi temanın çizildiğini CSS'teki `color-scheme` söyler.
- **Renk yalnız değişkenden.** Koyu takım `globals.css` → `:root[data-tema='koyu']`.
  Yeni değişkene **iki takıma birden** değer yaz. `dark:` kullanma.
- **Yazı tonu dolgu olmaz:** koyuda yazı tonları açılıyor. Dolgu için
  `--primary-derin`, `--ikincil-dolu`, `--success-dolu`, `--danger-dolu`,
  `--warning-dolu`, `--konu-<ders>-dolgu`; turuncu dolgu `--primary-parlak`/`-dolu`.
  Rabi balonu ve kısa bildirim `--ters`/`--ters-yazi`; perde `--perde`, tanıtım
  karartması `--karartma`; kart `bg-card`.
- Dolgu üstündeki `text-white` ve yarı saydam beyazlar (`bg-white/20`), siyah perdeler
  ve gölgeler serbest: iki temada da doğru.
- **Denetim:** `lib/renk-denetimi.test.ts` bileşende onaltılık renk, düz `bg-white`,
  dolgu olarak yazı tonu, `bg-foreground` yakalar (muaf/izinli satırlar gerekçeli).
  `lib/tema-kontrast.test.ts` iki takımda yazı/zemin çiftlerini ölçer (4,5; büyük
  yazı/ikon/dolgu 3).
- **Ders zemininin içi:** koyuda `.bg-konu-<ders>` içindeki `--card`, `--muted`,
  `--border` o dersin tonuna döner (`--konu-<ders>-kart`, `-kenar`; yalnız koyu
  takımda). Oyun tuşları, şıklar, soru kartı bu yüzden ayrıca boyanmaz; ders zeminli
  yeni ekran da kendiliğinden uyar.
- **Henüz koyu değeri olmayanlar** (plan PR 3–6): `.sahne`, `.kapanis`, `.deste-*`,
  cam menü (`--cam-*`), açılış (`acilis.tsx` → `ZEMIN`, yerli açılış), durum çubuğu,
  odak engel katmanı. Bunlara dokunan iş koyu karşılığını da yazar.
