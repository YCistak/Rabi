'use client'

import { ArrowLeft, BookOpen, Columns2, EllipsisVertical, Pause, Play, RotateCcw, Rows3, Star, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BildirimDugmesi, type BildirimKolu } from '@/components/hata-bildir'
import type { BildirilebilirSoru } from '@/lib/hata-bildirimi'
import type { SikDuzeniTercihi } from '@/lib/soru-bankasi/duzen'
import { sayacYazisi } from '@/lib/soru-bankasi/sure'

/**
 * Kronometre: dokununca duraklar/sürer. Kendi saniyesini kendisi tutar: her
 * saniye bütün test ekranını yeniden çizdirmek, çizim sırasında kare kaçırtırdı.
 */
function Kronometre({
  sureAl,
  gizli,
  duraklatildi,
  donuk,
  onDegistir,
}: {
  sureAl: () => number
  gizli: boolean
  duraklatildi: boolean
  donuk: boolean
  onDegistir: () => void
}) {
  const [, setTik] = useState(0)
  useEffect(() => {
    if (duraklatildi || donuk) return
    const kimlik = window.setInterval(() => setTik((t) => t + 1), 1000)
    return () => window.clearInterval(kimlik)
  }, [duraklatildi, donuk])
  const yazi = sayacYazisi(sureAl())
  if (donuk) {
    // Test bitti: süre artık yalnız bilgi, dokunulup yeniden başlatılamaz.
    return (
      <span className="flex h-8 shrink-0 items-center gap-1.5 px-2 text-[14px] font-extrabold text-muted-foreground" aria-label={`Toplam süre ${yazi}`}>
        <Timer size={15} aria-hidden />
        <span className="rakam">{yazi}</span>
      </span>
    )
  }
  return (
    <button
      type="button"
      onClick={onDegistir}
      aria-label={duraklatildi ? `Süre durdu (${yazi}). Sürdür` : `Geçen süre ${yazi}. Duraklat`}
      className="group grid h-11 shrink-0 place-items-center px-0.5"
    >
      <span
        className={`flex h-8 items-center gap-1.5 rounded-full pr-2.5 pl-2 text-[14px] font-extrabold transition group-active:scale-95 ${
          duraklatildi ? 'bg-primary-derin text-white' : 'bg-muted text-foreground'
        }`}
      >
        {duraklatildi ? <Play size={14} className="fill-current" aria-hidden /> : <Pause size={14} aria-hidden />}
        {!gizli && <span className="rakam min-w-[2.4rem] text-left">{yazi}</span>}
      </span>
    </button>
  )
}

export type GorunumMenusu = {
  sikDuzeni: SikDuzeniTercihi
  sureGizli: boolean
  onSikDuzeni: (deger: SikDuzeniTercihi) => void
  onSureGizli: () => void
  /** Yarım testi silip baştan başlat (yalnız bitmemiş, kaydedilen testte). */
  onBastan?: () => void
}

const DUZENLER: { deger: SikDuzeniTercihi; ad: string; simge: React.ReactNode }[] = [
  { deger: 'kitap', ad: 'Kitap', simge: <BookOpen size={17} aria-hidden /> },
  { deger: 'tek', ad: 'Tek sütun', simge: <Rows3 size={17} aria-hidden /> },
  { deger: 'iki', ad: 'İki sütun', simge: <Columns2 size={17} aria-hidden /> },
]

function MenuDugmesi({ menu }: { menu: GorunumMenusu }) {
  const [acik, setAcik] = useState(false)
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setAcik((a) => !a)}
        aria-label="Görünüm ayarları"
        aria-expanded={acik}
        aria-haspopup="dialog"
        className="grid size-11 place-items-center rounded-xl text-foreground active:bg-muted"
      >
        <EllipsisVertical size={20} />
      </button>
      {acik && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setAcik(false)} aria-hidden />
          <div
            role="dialog"
            aria-label="Görünüm ayarları"
            className="acilir-giris golge-kart absolute top-full right-0 z-40 mt-1 w-[17.5rem] rounded-2xl border border-border bg-card p-3"
          >
            <p className="px-1 text-[12px] font-extrabold tracking-[0.06em] text-muted-foreground uppercase">Şık düzeni</p>
            <div role="group" aria-label="Şık düzeni" className="mt-1.5 grid grid-cols-3 gap-1 rounded-[14px] bg-muted/70 p-1">
              {DUZENLER.map(({ deger, ad, simge }) => (
                <button
                  key={deger}
                  type="button"
                  onClick={() => menu.onSikDuzeni(deger)}
                  aria-pressed={menu.sikDuzeni === deger}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-[10px] text-[12px] font-extrabold transition ${
                    menu.sikDuzeni === deger
                      ? 'golge-kart bg-secili text-foreground ring-1 ring-secili-kenar'
                      : 'text-muted-foreground active:bg-card/60'
                  }`}
                >
                  {simge}
                  {ad}
                </button>
              ))}
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={!menu.sureGizli}
              onClick={menu.onSureGizli}
              className="mt-2 flex min-h-12 w-full items-center justify-between rounded-xl px-1 text-left text-[15px] font-bold active:bg-muted"
            >
              Süreyi göster
              <span
                className={`flex h-7 w-12 items-center rounded-full p-0.5 transition ${menu.sureGizli ? 'bg-muted' : 'bg-primary-parlak'}`}
                aria-hidden
              >
                <span className={`size-6 rounded-full bg-card shadow transition ${menu.sureGizli ? '' : 'translate-x-5'}`} />
              </span>
            </button>
            {menu.onBastan && (
              <button
                type="button"
                onClick={() => {
                  setAcik(false)
                  menu.onBastan?.()
                }}
                className="mt-1 flex min-h-12 w-full items-center gap-2 rounded-xl px-1 text-left text-[15px] font-bold text-danger active:bg-danger-soft"
              >
                <RotateCcw size={17} aria-hidden /> Testi baştan başlat
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Test ekranının üst çubuğu (sayfa ve soru görünümünde ortak): geri · başlık ·
 * kronometre · (soruda) sonra bak · görünüm menüsü · (soruda) hata bayrağı;
 * altında cevaplanan soruların ince ilerleme çizgisi.
 */
export function UstCubuk({
  baslik,
  altBaslik,
  geriEtiketi,
  ilerleme,
  sureAl,
  duraklatildi,
  sureBitti = false,
  menu,
  supheli,
  bildirimSorusu,
  hataBildirimi,
  onGeri,
  onSure,
  onSupheli,
}: {
  baslik: string
  altBaslik?: string
  geriEtiketi: string
  /** 0–1: cevaplanan / toplam. */
  ilerleme: number
  sureAl: () => number
  duraklatildi: boolean
  /** Test bitti: süre donuk gösterilir. */
  sureBitti?: boolean
  menu: GorunumMenusu
  /** Soru görünümünde: soru "sonra bak" işaretli mi. */
  supheli?: boolean
  bildirimSorusu?: BildirilebilirSoru
  hataBildirimi: BildirimKolu
  onGeri: () => void
  onSure: () => void
  onSupheli?: () => void
}) {
  return (
    <header className="relative z-20 shrink-0 bg-background pt-[var(--guvenli-ust)]">
      <div className="flex h-12 items-center gap-0.5 px-1">
        <button
          type="button"
          onClick={onGeri}
          aria-label={geriEtiketi}
          className="grid size-11 shrink-0 place-items-center rounded-xl text-primary active:bg-muted"
        >
          <ArrowLeft size={21} />
        </button>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-display text-[17px] font-extrabold">{baslik}</p>
          {altBaslik && <p className="truncate text-[12px] font-bold text-muted-foreground">{altBaslik}</p>}
        </div>
        <Kronometre
          sureAl={sureAl}
          gizli={menu.sureGizli}
          duraklatildi={duraklatildi}
          donuk={sureBitti}
          onDegistir={onSure}
        />
        {onSupheli && (
          <button
            type="button"
            onClick={onSupheli}
            aria-pressed={supheli}
            aria-label={supheli ? 'Sonra bak işaretini kaldır' : 'Sonra bakmak için işaretle (şüpheli)'}
            className="grid size-11 shrink-0 place-items-center rounded-xl active:bg-muted"
          >
            <Star size={21} className={supheli ? 'fill-warning-dolu text-warning-dolu' : 'text-muted-foreground'} />
          </button>
        )}
        <MenuDugmesi menu={menu} />
        {bildirimSorusu && <BildirimDugmesi soru={bildirimSorusu} kol={hataBildirimi} kompakt />}
      </div>
      <div
        className="h-[3px] bg-muted"
        role="progressbar"
        aria-label="Cevaplanan soru"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ilerleme * 100)}
      >
        <div
          className="h-full rounded-r-full bg-primary-parlak transition-[width] duration-300"
          style={{ width: `${ilerleme * 100}%` }}
        />
      </div>
    </header>
  )
}
