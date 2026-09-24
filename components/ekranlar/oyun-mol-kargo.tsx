'use client'

import type { OyunIstatistigi } from '@/lib/types'
import { MOL_HAVUZU, dogruMu, dogruYuk, kargoAciklamasi, kargoSorusuMetni, uretim, type MolSorusu, type MolYuku } from '@/lib/oyunlar/mol-kargo'
import { molKargodanBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import type { TurOzeti } from '@/lib/oyunlar/tur'
import type { BildirimKolu } from '@/components/hata-bildir'
import { BulmacaOyunuEkrani } from './oyun-bulmaca'

const bankadanCoz = (kayit: BankaKaydi): MolSorusu | null => kayit.soru.oyun === 'mol-kargo' ? kayit.soru.mol : null
const ilkSecim = (): MolYuku => [0, 0]
const secimHazirMi = (yuk: MolYuku) => yuk[0] > 0 && yuk[1] > 0
const molSayisi = (miktar: number) => `${Number.isInteger(miktar) ? '' : '≈'}${miktar.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}`

export function MolKargoOyunuEkrani({ istatistik, sesAcik, bankaSorulari, onTurBitti, onCik, bildir, gorulenler }: {
  istatistik: OyunIstatistigi
  sesAcik: boolean
  bankaSorulari: BankaKaydi[]
  onTurBitti: (ozet: TurOzeti<MolSorusu>, cevaplar: BankaCevabi[], saniye: number, yarim: boolean) => void
  onCik: () => void
  bildir: BildirimKolu
  gorulenler: readonly string[]
}) {
  return <BulmacaOyunuEkrani<MolSorusu, MolYuku>
    oyunId="mol-kargo"
    havuz={MOL_HAVUZU}
    istatistik={istatistik}
    sesAcik={sesAcik}
    bankaSorulari={bankaSorulari}
    bankadanCoz={bankadanCoz}
    bankayaCevir={molKargodanBanka}
    ilkSecim={ilkSecim}
    secimHazirMi={secimHazirMi}
    dogruMu={dogruMu}
    aciklama={kargoAciklamasi}
    soruMetni={kargoSorusuMetni}
    ciz={(soru, yuk, setYuk, kilitli, sonuc) => {
      const uretilecek = uretim(soru, yuk)
      const hedefYuk = dogruYuk(soru)
      const ustSinir = Math.max(...hedefYuk) + 3
      return <>
        <div className="golge-kart rounded-[20px] bg-card px-4 py-4 text-center">
          <p className="text-xs font-extrabold uppercase tracking-wide text-edb-koyu">{soru.ad}</p>
          <p className="mt-2 font-display text-lg font-black leading-relaxed">
            {soru.tepkenler[0].katsayi > 1 ? soru.tepkenler[0].katsayi : ''}{soru.tepkenler[0].formul}
            {' + '}
            {soru.tepkenler[1].katsayi > 1 ? soru.tepkenler[1].katsayi : ''}{soru.tepkenler[1].formul}
            {' → '}
            {soru.urun.katsayi > 1 ? soru.urun.katsayi : ''}{soru.urun.formul}
          </p>
          <p className="mt-2 text-sm font-bold">Hedef: <span className="rakam text-edb-koyu">{soru.hedef} mol {soru.urun.formul}</span></p>
        </div>
        <p className="text-center text-sm font-bold text-muted-foreground">Tepkenleri mol cinsinden yükle</p>
        <div className="grid grid-cols-2 gap-3">
          {soru.tepkenler.map((madde, i) => <div key={`${madde.formul}-${i}`} className="golge-kart rounded-[18px] bg-card p-3 text-center">
            <p className="font-display text-lg font-black text-edb-koyu">{madde.formul}</p>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Tepken {i + 1}</p>
            <div className="flex items-center justify-between gap-1">
              <button type="button" aria-label={`${madde.formul} yükünü azalt`} disabled={kilitli || yuk[i] <= 0} onClick={() => setYuk(i === 0 ? [yuk[0] - 1, yuk[1]] : [yuk[0], yuk[1] - 1])} className="grid size-11 place-items-center rounded-xl bg-edb-kart text-2xl font-bold text-edb-koyu disabled:opacity-35 active:brightness-95">−</button>
              <span className="rakam min-w-7 font-display text-2xl font-black">{yuk[i]}</span>
              <button type="button" aria-label={`${madde.formul} yükünü artır`} disabled={kilitli || yuk[i] >= ustSinir} onClick={() => setYuk(i === 0 ? [yuk[0] + 1, yuk[1]] : [yuk[0], yuk[1] + 1])} className="grid size-11 place-items-center rounded-xl bg-edb-kart text-2xl font-bold text-edb-koyu disabled:opacity-35 active:brightness-95">+</button>
            </div>
            <p className="mt-1 text-xs font-bold text-muted-foreground">mol</p>
          </div>)}
        </div>
        <div className="golge-kart rounded-[18px] bg-card px-4 py-3" aria-live="polite">
          <div className="flex items-center justify-between text-sm font-bold"><span>Üretim</span><span className="rakam text-edb-koyu">{molSayisi(uretilecek.urun)} / {soru.hedef} mol</span></div>
          <div className="mt-1 flex items-center justify-between text-xs font-semibold text-muted-foreground"><span>Artan tepken</span><span className="rakam">{molSayisi(uretilecek.kalan[0])} mol {soru.tepkenler[0].formul} · {molSayisi(uretilecek.kalan[1])} mol {soru.tepkenler[1].formul}</span></div>
          {sonuc === false && <p className="mt-2 border-t border-border pt-2 text-xs font-bold text-edb-koyu">Hedefi tutturup tepken bırakmamalısın.</p>}
        </div>
      </>
    }}
    onTurBitti={onTurBitti}
    onCik={onCik}
    bildir={bildir}
    gorulenler={gorulenler}
  />
}
