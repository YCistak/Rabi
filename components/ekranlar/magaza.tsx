'use client'

import { useMemo, useState } from 'react'
import { Carrot, Check, Lock, Plus } from 'lucide-react'
import {
  KATEGORILER,
  KATEGORI_ADI,
  KATEGORI_SIMGESI,
  kategorininEsyalari,
  type Esya,
  type EsyaKategorisi,
} from '@/lib/magaza/esyalar'
import {
  giyiliMi,
  giydir,
  hepsiniCikar,
  koleksiyonOrani,
  sahipMi,
  satinAl,
  type MagazaDurumu,
} from '@/lib/magaza/magaza'
import {
  JOKERLER,
  STOK_SINIRI,
  jokerAl,
  jokerAlinabilirMi,
  jokerDoluMu,
  jokerSayisi,
  jokerToplami,
  type Joker,
  type JokerStogu,
} from '@/lib/magaza/jokerler'
import { KADRAJ } from '@/components/maskot/olculer'
import { TavsanBoy } from '@/components/maskot/tavsan-boy'
import { Buton, Cip, Kart } from '@/components/ui'
import { cn } from '@/lib/utils'

/**
 * Havuç Mağazası.
 *
 * İki reyon var ve bilerek ayrılar: **Görünüş** kozmetik (kalıcı, giyilir,
 * oyuna dokunmaz), **Jokerler** sarf malzemesi (tükenir, tur içinde işe yarar).
 * Tek listede toplansaydı "aldığım şey üstümde mi duruyor, yoksa harcanacak
 * mı" sorusu her kutucukta yeniden sorulurdu.
 *
 * Görünüş reyonunda üstte tavşanın kendisi duruyor: satın alınan şey bir liste
 * öğesi değil, yukarıdaki tavşanın görünüşü. Bir eşyaya dokunmak **satın
 * almıyor**, yalnızca tavşanın üstünde gösteriyor; alma kararı aşağıdaki
 * düğmede ve fiyat orada yazıyor. Tek dokunuşla havuç harcatan bir ekran, ilk
 * yanlış dokunuşta güveni bitirirdi.
 *
 * Havuç bakiyesi bu ekranın başlığında duruyor — ana sayfada yalnızca mağaza
 * düğmesi var, sayı burada.
 *
 * Ne havuç kazanma ne de jokerlerin tur içinde kullanılması yazıldı; bakiye
 * şimdilik yalnızca burada eksiliyor.
 */

type BolumId = 'gorunus' | 'joker'

export function MagazaEkrani({
  havuc,
  setHavuc,
  durum,
  setDurum,
  stok,
  setStok,
}: {
  havuc: number
  setHavuc: (guncelleyici: number | ((onceki: number) => number)) => void
  durum: MagazaDurumu
  setDurum: (guncelleyici: MagazaDurumu | ((onceki: MagazaDurumu) => MagazaDurumu)) => void
  stok: JokerStogu
  setStok: (guncelleyici: JokerStogu | ((onceki: JokerStogu) => JokerStogu)) => void
}) {
  const [bolum, setBolum] = useState<BolumId>('gorunus')
  const [kategori, setKategori] = useState<EsyaKategorisi>('sapka')
  /** Vitrinde denenen eşya. Kategori değişince sıfırlanıyor. */
  const [secili, setSecili] = useState<Esya | null>(null)

  const esyalar = useMemo(() => kategorininEsyalari(kategori), [kategori])
  const koleksiyon = koleksiyonOrani(durum)
  const cantadaki = jokerToplami(stok)

  const kategoriSec = (yeni: EsyaKategorisi) => {
    setKategori(yeni)
    setSecili(null)
  }

  const dokun = (esya: Esya) => {
    setSecili((onceki) => (onceki?.id === esya.id ? null : esya))
  }

  const uygula = (esya: Esya) => {
    if (sahipMi(durum, esya)) {
      setDurum((onceki) => giydir(onceki, esya))
      return
    }
    const sonuc = satinAl(durum, havuc, esya)
    if (!sonuc) return
    setDurum(sonuc.durum)
    setHavuc(sonuc.havuc)
  }

  const jokerAlindi = (joker: Joker) => {
    const sonuc = jokerAl(stok, havuc, joker)
    if (!sonuc) return
    setStok(sonuc.stok)
    setHavuc(sonuc.havuc)
  }

  return (
    <div className="space-y-3.5">
      <header className="flex items-center justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-extrabold tracking-tight">Havuç Mağazası</h1>
          <p className="mt-0.5 text-[13px] font-medium text-muted-foreground">
            {bolum === 'gorunus'
              ? `${koleksiyon.sahip}/${koleksiyon.toplam} eşya senin`
              : cantadaki > 0
                ? `Çantanda ${cantadaki} joker var`
                : 'Çantan henüz boş'}
          </p>
        </div>
        <HavucRozeti havuc={havuc} />
      </header>

      {/* Reyonlar. İki taneler ve ikisi de her zaman görünür duruyor:
          açılır menüye gizlenselerdi joker reyonunun varlığı keşfedilmezdi. */}
      <div className="grid grid-cols-2 gap-2">
        <ReyonDugmesi secili={bolum === 'gorunus'} onClick={() => setBolum('gorunus')}>
          🐰 Görünüş
        </ReyonDugmesi>
        <ReyonDugmesi secili={bolum === 'joker'} onClick={() => setBolum('joker')}>
          🃏 Jokerler
        </ReyonDugmesi>
      </div>

      {bolum === 'gorunus' ? (
        <>
          {/* Vitrin: tavşanın tamamı, denenen eşya üstünde. */}
          <Kart className="relative overflow-hidden bg-primary-soft p-0">
            <div className="flex justify-center pt-3 pb-1">
              <TavsanBoy durum={durum} onizleme={secili} boyut={196} />
            </div>
            {koleksiyon.sahip > 0 && (
              <Buton
                bicim="hayalet"
                boy="kucuk"
                onClick={() => {
                  setDurum(hepsiniCikar)
                  setSecili(null)
                }}
                className="absolute top-2 right-2 text-primary"
              >
                Hepsini çıkar
              </Buton>
            )}
          </Kart>

          {/* Seçili eşyanın eylem çubuğu — fiyat ve karar burada. */}
          <EylemCubugu esya={secili} durum={durum} havuc={havuc} onUygula={uygula} />

          {/* Kategoriler */}
          <div className="-mx-4 overflow-x-auto px-4">
            <div className="flex w-max gap-2 pb-1">
              {KATEGORILER.map((k) => (
                <Cip key={k} secili={k === kategori} onClick={() => kategoriSec(k)}>
                  <span aria-hidden>{KATEGORI_SIMGESI[k]}</span> {KATEGORI_ADI[k]}
                </Cip>
              ))}
            </div>
          </div>

          <ul className="grid grid-cols-3 gap-2.5">
            {esyalar.map((esya) => (
              <li key={esya.id}>
                <EsyaKutucugu
                  esya={esya}
                  durum={durum}
                  havuc={havuc}
                  secili={secili?.id === esya.id}
                  onDokun={() => dokun(esya)}
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <JokerReyonu stok={stok} havuc={havuc} onAl={jokerAlindi} />
      )}
    </div>
  )
}

/** Havuç bakiyesi rozeti. */
export function HavucRozeti({ havuc, className }: { havuc: number; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full bg-isl-kart px-2.5 py-1.5',
        'text-sm font-extrabold text-isl-koyu',
        className,
      )}
      aria-label={`${havuc} havuç`}
    >
      <Carrot size={16} strokeWidth={2.6} aria-hidden />
      <span className="rakam">{havuc}</span>
    </span>
  )
}

function ReyonDugmesi({
  secili,
  onClick,
  children,
}: {
  secili: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={secili}
      className={cn(
        'h-10 rounded-xl text-sm font-extrabold transition active:brightness-95',
        secili ? 'bg-primary text-primary-foreground' : 'golge-kart bg-card text-muted-foreground',
      )}
    >
      {children}
    </button>
  )
}

/**
 * Joker reyonu.
 *
 * Kozmetik ızgarasının aksine tek sütun: jokerin ne yaptığını bir cümle
 * anlatıyor ve o cümle okunmadan alınması doğru olmaz. Üç sütunluk kutucuğa
 * sığmazdı.
 */
function JokerReyonu({
  stok,
  havuc,
  onAl,
}: {
  stok: JokerStogu
  havuc: number
  onAl: (joker: Joker) => void
}) {
  return (
    <div className="space-y-2.5">
      <p className="rounded-xl bg-muted/70 px-3 py-2.5 text-[13px] font-medium text-muted-foreground">
        Jokerler tur içinde harcanır ve hiçbiri doğru cevabı söylemez. Aynı jokerden en fazla{' '}
        <span className="rakam font-bold">{STOK_SINIRI}</span> tane taşıyabilirsin.
        <span className="mt-1 block font-bold">
          Turda kullanma henüz eklenmedi — şimdilik yalnızca çantana giriyorlar.
        </span>
      </p>

      <ul className="space-y-2.5">
        {JOKERLER.map((joker) => (
          <li key={joker.id}>
            <JokerSatiri joker={joker} stok={stok} havuc={havuc} onAl={() => onAl(joker)} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function JokerSatiri({
  joker,
  stok,
  havuc,
  onAl,
}: {
  joker: Joker
  stok: JokerStogu
  havuc: number
  onAl: () => void
}) {
  const adet = jokerSayisi(stok, joker.id)
  const dolu = jokerDoluMu(stok, joker)
  const alinabilir = jokerAlinabilirMi(stok, havuc, joker)

  return (
    <Kart className="flex items-center gap-3 py-3">
      <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-muted/70 text-xl">
        <span aria-hidden>{joker.simge}</span>
        {adet > 0 && (
          <span
            className="rakam absolute -top-1.5 -right-1.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-extrabold text-primary-foreground"
            aria-label={`Çantanda ${adet} tane`}
          >
            {adet}
          </span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-display font-extrabold">{joker.ad}</p>
        <p className="mt-0.5 text-[12.5px] leading-snug font-medium text-muted-foreground text-balance">
          {joker.aciklama}
        </p>
      </div>

      <Buton
        boy="kucuk"
        onClick={onAl}
        disabled={!alinabilir}
        className="shrink-0"
        aria-label={dolu ? `${joker.ad} çantan dolu` : `${joker.ad} satın al, ${joker.fiyat} havuç`}
      >
        {dolu ? (
          'Dolu'
        ) : (
          <>
            <Plus size={14} strokeWidth={3} aria-hidden />
            <Carrot size={14} aria-hidden />
            <span className="rakam">{joker.fiyat}</span>
          </>
        )}
      </Buton>
    </Kart>
  )
}

function EylemCubugu({
  esya,
  durum,
  havuc,
  onUygula,
}: {
  esya: Esya | null
  durum: MagazaDurumu
  havuc: number
  onUygula: (esya: Esya) => void
}) {
  if (!esya) {
    return (
      <p className="rounded-xl bg-muted/70 px-3 py-2.5 text-center text-sm font-medium text-muted-foreground">
        Bir eşyaya dokun, tavşanın üstünde dene.
      </p>
    )
  }

  const sahip = sahipMi(durum, esya)
  const giyili = giyiliMi(durum, esya)
  const yetiyor = havuc >= esya.fiyat

  return (
    <Kart className="flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-display font-extrabold">{esya.ad}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[13px] font-bold text-muted-foreground">
          {sahip ? (
            giyili ? (
              'Şu an üstünde'
            ) : (
              'Koleksiyonunda'
            )
          ) : (
            <>
              <Carrot size={14} aria-hidden />
              <span className="rakam">{esya.fiyat}</span>
              {!yetiyor && <span className="text-danger">· havucun yetmiyor</span>}
            </>
          )}
        </p>
      </div>
      <Buton
        bicim={sahip && giyili ? 'ikincil' : 'birincil'}
        onClick={() => onUygula(esya)}
        disabled={!sahip && !yetiyor}
        className="shrink-0"
      >
        {sahip ? (giyili ? 'Çıkar' : 'Giy') : 'Satın Al'}
      </Buton>
    </Kart>
  )
}

function EsyaKutucugu({
  esya,
  durum,
  havuc,
  secili,
  onDokun,
}: {
  esya: Esya
  durum: MagazaDurumu
  havuc: number
  secili: boolean
  onDokun: () => void
}) {
  const sahip = sahipMi(durum, esya)
  const giyili = giyiliMi(durum, esya)
  const yetiyor = havuc >= esya.fiyat

  /*
    Kutucuktaki çizim tavşanın kendisi, kategorinin durduğu bölgeye kırpılmış
    (`KADRAJ`). Ayrı bir vitrin çizimi yapılsaydı her eşya iki kez çizilmek
    zorunda kalır ve ikisi zamanla birbirini tutmazdı.
  */
  const onizleme: MagazaDurumu = {
    sahipOlunan: [esya.id],
    giyilen: { [esya.kategori]: esya.id, ...(durum.giyilen.kurk ? { kurk: durum.giyilen.kurk } : {}) },
  }

  return (
    <button
      type="button"
      onClick={onDokun}
      aria-pressed={secili}
      className={cn(
        'golge-kart flex w-full flex-col items-center gap-1 rounded-2xl bg-card p-1.5 transition',
        'active:brightness-95',
        secili && 'ring-2 ring-primary',
      )}
    >
      <span className="relative block w-full overflow-hidden rounded-xl bg-muted/60">
        <TavsanBoy durum={onizleme} kadraj={KADRAJ[esya.kategori]} className="w-full" />
        {giyili && (
          <span className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check size={13} strokeWidth={3.4} aria-hidden />
          </span>
        )}
      </span>

      <span className="line-clamp-2 min-h-[2.1rem] px-0.5 text-[11px] leading-tight font-bold text-balance">
        {esya.ad}
      </span>

      {sahip ? (
        <span className="text-[11px] font-extrabold text-success">Senin</span>
      ) : (
        <span
          className={cn(
            'flex items-center gap-0.5 text-[11px] font-extrabold',
            yetiyor ? 'text-isl-koyu' : 'text-muted-foreground/70',
          )}
        >
          {yetiyor ? <Carrot size={11} aria-hidden /> : <Lock size={10} aria-hidden />}
          <span className="rakam">{esya.fiyat}</span>
        </span>
      )}
    </button>
  )
}
