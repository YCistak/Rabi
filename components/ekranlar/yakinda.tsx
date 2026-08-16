'use client'

import { ArrowLeft } from 'lucide-react'
import { Buton, BosDurum } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

/**
 * Henüz yazılmamış ekranların yer tutucusu. Faz ilerledikçe buradan tek tek
 * gerçek ekranlara geçilecek; bu bileşen sonunda silinecek.
 */
const BASLIKLAR: Record<string, string> = {
  pomodoro: 'Pomodoro',
  soru: 'Soru Takibi',
  deneme: 'Denemeler',
  siralama: 'Sıralama Hesapla',
  'yanlis-banka': 'Yanlış Soru Bankası',
  devamsizlik: 'Devamsızlık',
  okul: 'Okul Notları',
  hedef: 'Hedefim',
  rozetler: 'Rozetler',
  istatistik: 'İstatistik',
  ayarlar: 'Ayarlar',
}

export function Yakinda({ ekran, onGeri }: { ekran: string; onGeri?: () => void }) {
  const baslik = BASLIKLAR[ekran] ?? 'Bu bölüm'

  return (
    <div>
      {onGeri && (
        <Buton bicim="hayalet" boy="kucuk" onClick={onGeri} className="-ml-2 mb-3">
          <ArrowLeft size={16} aria-hidden /> Geri
        </Buton>
      )}
      <h1 className="mb-4 font-display text-2xl font-semibold tracking-tight">{baslik}</h1>
      <BosDurum
        simge={<Rabi durum="uykulu" boyut={104} />}
        baslik="Rabi bu bölümü henüz kazmadı"
        aciklama="Bu ekran sonraki adımda gelecek."
      />
    </div>
  )
}
