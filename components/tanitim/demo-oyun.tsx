'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IslemOyunuEkrani } from '@/components/ekranlar/oyun-islem'
import { TurAyariSaglayici } from '@/components/tur-ayari-baglami'
import { DEMO_SORULAR } from '@/lib/tanitim'
import type { OyunModu } from '@/lib/oyunlar/mod'
import type { IslemSorusu } from '@/lib/oyunlar/islem'
import type { BildirimKolu } from '@/components/hata-bildir'
import { useTanitim } from './tanitim-baglami'
import type { BankaKaydi } from '@/lib/oyunlar/banka'

/*
  Tanıtım oyununun bankası hep boş. Modül sabiti: her çizimde yeni bir `[]`
  oyunun başlatma işlevini yeniliyordu, o da geri sayımın zamanlayıcısını
  baştan kuruyordu (sayım her yeniden çizimde uzuyordu).
*/
const BOS_BANKA: BankaKaydi[] = []

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
  /*
    Geri sayımda rehber gizleniyor ve sayım bitince soruyla geri geliyor
    (eskiden araya "Süre ve skor" adımı giriyordu). Gizlilik adıma bağlı
    (`tanitim-baglami.tsx`): adım değişince kendiliğinden kalkıyor.
  */
  const [oyunNo, setOyunNo] = useState(0)
  const oncekiAdim = useRef(adim?.kimlik)
  useEffect(() => {
    // Hazırlığa dönülünce oyun ekranı baştan kuruluyor: sonuçtan dönüşte yeni
    // deneme için; Başlat adımından dönüşte (sayım koruması dahil) yarım kalmış
    // bir sayım ya da başlamış bir tur Hazırlık adımında açık kalmasın.
    if (adim?.kimlik === 'zorluk' && (oncekiAdim.current === 'sonuc' || oncekiAdim.current === 'oyun-baslat')) setOyunNo((sira) => sira + 1)
    oncekiAdim.current = adim?.kimlik
  }, [adim?.kimlik])
  const [mod, setMod] = useState<OyunModu>('siradan')
  // Zorluk seçimi kalktı (oyunlardaki gibi); demo hep orta soruyla açılıyor.
  const sorular = useMemo<IslemSorusu[]>(() => {
    const soru = DEMO_SORULAR.orta[0]
    return [{ tur: 'carpma', metin: soru.metin.replace(' = ?', ''), sonuc: soru.cevap }]
  }, [])
  const basladi = useCallback(() => { gonder({ tur: 'hedefe-dokun', hedef: 'demo-baslat' }) }, [gonder])
  const adimKimligi = adim?.kimlik
  // Rehber yalnız Başlat adımında gizlenir: sayım başka bir adımda başlarsa
  // (olmamalı) gizlenen rehberi geri getirecek bir olay gelmez.
  const sayimBasladi = useCallback(() => { if (adimKimligi === 'oyun-baslat') setRehberGizli(true) }, [adimKimligi, setRehberGizli])
  return <TurAyariSaglayici value={{ mod, setMod, secilebilir: true }}>
    <IslemOyunuEkrani key={oyunNo}
      istatistik={{ enIyiDogru: 0, enIyiSeri: 0, oynananTur: 0, hatasizTur: 0, sonTarih: '', toplamDogru: 0, toplamYanlis: 0 }}
      sesAcik={false} bankaSorulari={BOS_BANKA} demoSorulari={sorular} onBasladi={basladi} onSayimBasladi={sayimBasladi} demoDuraklatildi={adim?.kimlik !== "soru-bir"}
      onTurBitti={(ozet) => gonder({ tur: 'oyun-bitti', dogru: ozet.dogru, yanlis: ozet.yanlis })}
      onCik={() => { if (adim?.kimlik === 'sonuc') gonder({ tur: 'ileri' }) }} bildir={bildir}
    />
  </TurAyariSaglayici>
}
