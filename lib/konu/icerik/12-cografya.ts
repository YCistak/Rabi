import { program, tema } from '../tip'
import { cografya12Dogal, cografya12BeseriA } from './12-cografya-t1'
import { cografya12BeseriB } from './12-cografya-t2'
import { cografya12Kuresel } from './12-cografya-t3'
import { cografya12Cevre } from './12-cografya-t4'

/**
 * 12. sınıf Coğrafya — **2018 programı** (MEB Ortaöğretim Coğrafya, 12. sınıf).
 *
 * Maarif Modeli'nin 12. sınıfı yayımlanmadı; bugünün 12. sınıfları ve
 * mezunlar 2018 programını görüyor (bkz. `docs/kurallar/konu-takibi.md`).
 * Tema adları 2018 programının dört ünitesinden: Doğal Sistemler, Beşerî
 * Sistemler, Küresel Ortam: Bölgeler ve Ülkeler, Çevre ve Toplum. Kazanım
 * kodları (12.1.1 … 12.4.4) MEB ölçme-değerlendirme tablolarından
 * doğrulandı. `maarif.test.ts` bu programı denetlemiyor.
 */
export const cografya12 = program('cografya', 12, 'Doğal sistemlerden küresel ortama', [
  tema('cog12-t1', 'Doğal Sistemler', cografya12Dogal),
  tema('cog12-t2', 'Beşerî Sistemler', [...cografya12BeseriA, ...cografya12BeseriB]),
  tema('cog12-t3', 'Küresel Ortam: Bölgeler ve Ülkeler', cografya12Kuresel),
  tema('cog12-t4', 'Çevre ve Toplum', cografya12Cevre),
])
