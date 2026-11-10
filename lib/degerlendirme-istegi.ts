import { registerPlugin } from '@capacitor/core'
import { ANAHTARLAR } from './depo'
import { acilisiSay, kaydiOku, pencereIstenmeliMi } from './degerlendirme'
import { androidMu, iosMu } from './platform'

type DegerlendirmeEklentisi = {
  iste(): Promise<void>
}

/** Tarayıcıda mağaza penceresi olmadığı için çağrı sessizce tamamlanır. */
const sahte: DegerlendirmeEklentisi = {
  iste: async () => {},
}

const eklenti = registerPlugin<DegerlendirmeEklentisi>('Degerlendirme', { web: () => sahte })

// StrictMode aynı efekti iki kez çalıştırsa da tek açılış sayılmalı.
let acilistaYoklandi = false

/** Yerli kabukta açılışı sayar ve gerekiyorsa mağaza penceresini çağırır. */
export async function acilistaDegerlendirmeyiYokla(): Promise<void> {
  if ((!androidMu() && !iosMu()) || acilistaYoklandi) return
  acilistaYoklandi = true

  try {
    const kayit = acilisiSay(kaydiOku(localStorage.getItem(ANAHTARLAR.degerlendirme)))
    localStorage.setItem(ANAHTARLAR.degerlendirme, JSON.stringify(kayit))
    if (!pencereIstenmeliMi(kayit)) return

    // Mağaza kota nedeniyle pencereyi göstermese bile bu cihazda tekrar sormuyoruz.
    localStorage.setItem(ANAHTARLAR.degerlendirme, JSON.stringify({ ...kayit, istendi: true }))
    try {
      await eklenti.iste()
    } catch {
      // Mağaza hizmeti uygulamanın açılmasını etkilemez.
    }
  } catch {
    // Depo erişimi engelliyse değerlendirme isteği uygulamayı etkilemez.
  }
}
