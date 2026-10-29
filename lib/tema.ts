/*
  Tema: Telefona uy · Açık · Koyu (plan: docs/koyu-tema-plani.md).

  Kayıtta **tercih** durur (`Ayarlar.tema`), `<html data-tema>`'da her zaman
  **çözülmüş** tema: CSS yalnız `acik`/`koyu` bilir. "Telefona uy" telefonun
  gece modunu izler ve telefon değişince Rabi de anında değişir.

  İlk kare `app/layout.tsx`teki satır içi betikte çözülür (React'i beklemek
  açılışta bir kare yanlış renk demek); bu dosyadaki kanca o betiğin yedeği ve
  çalışırken değişiklikleri izler (`lib/tema-kancasi.ts`). İkisi aynı kuralı
  uygular: `temaCoz`. Bu dosya React'e bağlı değil; `layout.tsx` (sunucu
  bileşeni) betiği buradan alıyor.
*/

export type TemaTercihi = 'sistem' | 'acik' | 'koyu'
export type Tema = 'acik' | 'koyu'

/** Yeni kurulum, alanı olmayan eski kayıt ve bozuk değer "Telefona uy"a düşer (kullanıcı kararı, 2026-10-28). */
export const VARSAYILAN_TEMA: TemaTercihi = 'sistem'

/**
 * Koyu tema kullanıcıya açık mı.
 *
 * Kapalıyken "Telefona uy" açık çizer: koyu ekranlar bitmeden (plan PR 3–6)
 * telefonu koyu moddaki kullanıcı yarım bir koyu tema görmesin. Açıkça
 * `'koyu'` tercihi yine koyu çizer — ayar arayüzde yokken bu yalnız
 * geliştiricinin elle yazdığı kayıtta olur. PR 5'te açılır.
 */
export const KOYU_TEMA_ACIK = false

/** Tema geçerken bütün `transition-colors`ın aynı anda oynamaması için `<html>`e konan sınıf. */
export const TEMA_DEGISIYOR = 'tema-degisiyor'

/** Tarayıcı çubuğu / durum çubuğu zemini; `--background` ile aynı. */
export const TEMA_ZEMINI: Record<Tema, string> = { acik: '#f8f8f7', koyu: '#1a1612' }

export function temaTercihiNormalize(ham: unknown): TemaTercihi {
  return ham === 'acik' || ham === 'koyu' || ham === 'sistem' ? ham : VARSAYILAN_TEMA
}

export function temaCoz(tercih: TemaTercihi, telefonKoyu: boolean, koyuAcik: boolean = KOYU_TEMA_ACIK): Tema {
  if (tercih === 'koyu') return 'koyu'
  if (tercih === 'sistem' && koyuAcik && telefonKoyu) return 'koyu'
  return 'acik'
}

export const KOYU_SORGU = '(prefers-color-scheme: dark)'

/**
 * `layout.tsx`teki satır içi betiğin tema parçası. `temaCoz`un aynısı, düz
 * JavaScript; kayıt yoksa ya da bozuksa "Telefona uy".
 */
export function ilkKareTemaBetigi(): string {
  return `try {
    var t = 'sistem';
    try { var a = JSON.parse(localStorage.getItem('rabi-ayarlar') || 'null'); if (a && (a.tema === 'acik' || a.tema === 'koyu' || a.tema === 'sistem')) t = a.tema; } catch (e) {}
    var koyu = t === 'koyu' || (t === 'sistem' && ${KOYU_TEMA_ACIK} && window.matchMedia && window.matchMedia('${KOYU_SORGU}').matches);
    document.documentElement.setAttribute('data-tema', koyu ? 'koyu' : 'acik');
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', koyu ? '${TEMA_ZEMINI.koyu}' : '${TEMA_ZEMINI.acik}');
  } catch (e) {}`
}
