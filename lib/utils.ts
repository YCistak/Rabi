import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Çakışmayan basit kimlik — kayıtlar tek cihazda üretildiği için bu yeterli. */
export function yeniId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** Bugünün tarihi, 'YYYY-AA-GG' (yerel saat; toISOString UTC'ye kaydırıyor). */
export function bugun(): string {
  return tariheYaz(new Date())
}

/** Date → 'YYYY-AA-GG' (yerel saat). */
export function tariheYaz(t: Date): string {
  const ay = String(t.getMonth() + 1).padStart(2, '0')
  const gun = String(t.getDate()).padStart(2, '0')
  return `${t.getFullYear()}-${ay}-${gun}`
}

/** 'YYYY-AA-GG' → Date (yerel gece yarısı). Bozuk girdide bugünü döndürür. */
export function tariheCevir(iso: string): Date {
  const [yil, ay, gun] = iso.split('-').map(Number)
  if (!yil || !ay || !gun) return new Date()
  return new Date(yil, ay - 1, gun)
}

/** 'YYYY-AA-GG' → "16 Ağustos Pazar" — yıl yazılmaz, takvimde zaten görünüyor. */
export function tarihYaziKisa(iso: string): string {
  return tariheCevir(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  })
}

/**
 * Tarihin ait olduğu haftanın pazartesi günü, 'YYYY-AA-GG'.
 * Haftalık soru rozetleri bu anahtarla gruplanır (Türkiye'de hafta pazartesi başlar).
 */
export function haftaBasi(iso: string): string {
  const t = tariheCevir(iso)
  // getDay(): 0 = pazar. Pazartesiyi 0 kabul edecek şekilde kaydırılır.
  const gunSirasi = (t.getDay() + 6) % 7
  t.setDate(t.getDate() - gunSirasi)
  return tariheYaz(t)
}

/**
 * Bir listeden tohuma göre kararlı seçim yapar: aynı tohum aynı öğeyi verir.
 * Günün sözü gibi "gün boyu sabit, ertesi gün başka" olması istenen yerlerde
 * tarih tohum olarak veriliyor — yoksa her yeniden çizimde metin zıplardı.
 */
export function tohumlaSec<T>(liste: readonly T[], tohum: string): T {
  // Basit ve kararlı bir karma (djb2) — kriptografik değil, dağılım için yeterli.
  let karma = 5381
  for (let i = 0; i < tohum.length; i++) {
    karma = (karma * 33) ^ tohum.charCodeAt(i)
  }
  return liste[Math.abs(karma) % liste.length]
}
