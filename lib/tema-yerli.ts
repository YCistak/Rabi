import { Capacitor, registerPlugin } from '@capacitor/core'
import type { TemaTercihi } from './tema'

/*
  Tema tercihini yerli tarafa taşır (Android `tema/TemaEklentisi.kt`, iOS
  `AnaDenetleyici.swift` → `TemaEklentisi`).

  Yerli açılış ekranı, sistem çubukları, iOS klavyesi ve Android'in odak engel
  katmanı web yüklenmeden ya da web'in dışında çiziliyor; `localStorage`ı
  okuyamıyorlar. Tercih her değiştiğinde ve her açılışta bir kez yazılıyor
  (yerli kayıt boşsa ya da yedekten dönülmüşse eşitlensin).
*/

type TemaEklentisi = { ayarla(secenek: { tercih: TemaTercihi }): Promise<void> }

const eklenti = registerPlugin<TemaEklentisi>('Tema', { web: () => ({ ayarla: async () => {} }) })

export function yerliTemayaYaz(tercih: TemaTercihi) {
  if (!Capacitor.isNativePlatform()) return
  // Eski bir yerli derlemede eklenti yok; yan iş uygulamayı düşüremez.
  eklenti.ayarla({ tercih }).catch(() => {})
}
