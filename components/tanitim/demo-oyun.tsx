'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IslemOyunuEkrani } from '@/components/ekranlar/oyun-islem'
import { TurAyariSaglayici } from '@/components/tur-ayari-baglami'
import { DEMO_SORULAR, type TanitimZorlugu } from '@/lib/tanitim'
import type { OyunModu } from '@/lib/oyunlar/mod'
import type { IslemSorusu } from '@/lib/oyunlar/islem'
import type { BildirimKolu } from '@/components/hata-bildir'
import { useTanitim } from './tanitim-baglami'

export function DemoOyunKarti() {
  const { gonder } = useTanitim()
  return <button type="button" data-tanitim="demo-oyun" onClick={() => gonder({ tur: 'hedefe-dokun', hedef: 'demo-oyun' })}
    className="flex flex-col rounded-2xl bg-konu-matematik p-3.5 text-left transition active:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-ring">
    <span className="mb-3 grid size-11 place-items-center rounded-[14px] bg-konu-matematik-ok text-[25px]" aria-hidden>🎮</span>
    <span className="font-display text-[16px] font-extrabold leading-tight">Tanıtım oyunu</span>
    <span className="mt-1.5 text-[11.5px] font-bold text-konu-matematik-koyu">Geçici deneme · 1 soru</span>
  </button>
}

/** Gerçek oyunun ekranlarını kullanır; seçimler ve sonuç sadece bellekte kalır. */
export function DemoOyun({ bildir }: { bildir: BildirimKolu }) {
  const { gonder, adim, setRehberGizli } = useTanitim()
  // Geri sayımda gizlenen rehber, tur başlayınca soruyla geri geliyor (eskiden araya "Süre ve skor" adımı giriyordu).
  useEffect(() => { if (adim?.kimlik === "soru-bir") setRehberGizli(false) }, [adim?.kimlik, setRehberGizli])
  const [oyunNo, setOyunNo] = useState(0)
  const oncekiAdim = useRef(adim?.kimlik)
  useEffect(() => {
    if (adim?.kimlik === 'zorluk' && oncekiAdim.current === 'sonuc') setOyunNo((sira) => sira + 1)
    oncekiAdim.current = adim?.kimlik
  }, [adim?.kimlik])
  const [mod, setMod] = useState<OyunModu>('siradan')
  const [zorluk, setZorluk] = useState<TanitimZorlugu>('orta')
  const sorular = useMemo<IslemSorusu[]>(() => {
    const soru = DEMO_SORULAR[zorluk][0]
    return [{ tur: zorluk === 'kolay' ? 'toplama' : 'carpma', metin: soru.metin.replace(' = ?', ''), sonuc: soru.cevap }]
  }, [zorluk])
  const basladi = useCallback(() => { gonder({ tur: 'hedefe-dokun', hedef: 'demo-baslat' }) }, [gonder, setRehberGizli])
  return <TurAyariSaglayici value={{ mod, setMod, zorluk, setZorluk, secilebilir: true }}>
    <IslemOyunuEkrani key={oyunNo}
      istatistik={{ enIyiDogru: 0, enIyiSeri: 0, oynananTur: 0, hatasizTur: 0, sonTarih: '', toplamDogru: 0, toplamYanlis: 0 }}
      sesAcik={false} bankaSorulari={[]} demoSorulari={sorular} onBasladi={basladi} onSayimBasladi={() => setRehberGizli(true)} demoDuraklatildi={adim?.kimlik !== "soru-bir"}
      onTurBitti={(ozet) => gonder({ tur: 'oyun-bitti', dogru: ozet.dogru, yanlis: ozet.yanlis })}
      onCik={() => { if (adim?.kimlik === 'sonuc') gonder({ tur: 'ileri' }) }} bildir={bildir}
    />
  </TurAyariSaglayici>
}
