'use client'

import { useMemo, useState } from 'react'
import { Carrot, Check, Lock } from 'lucide-react'
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
import { KADRAJ } from '@/components/maskot/olculer'
import { TavsanBoy } from '@/components/maskot/tavsan-boy'
import { Buton, Cip, Kart } from '@/components/ui'
import { cn } from '@/lib/utils'

/**
 * Havuç Mağazası.
 *
 * Üstte tavşanın kendisi, altta eşyalar. Sıra bilerek böyle: satın alınan şey
 * bir liste öğesi değil, yukarıdaki tavşanın görünüşü. Bir eşyaya dokunmak
 * **satın almıyor**, yalnızca tavşanın üstünde gösteriyor; alma kararı
 * aşağıdaki düğmede ve fiyat orada yazıyor. Tek dokunuşla havuç harcatan bir
 * ekran, ilk yanlış dokunuşta güveni bitirirdi.
 *
 * Havuç kazanma mekaniği henüz yok — bakiye şimdilik yalnızca burada
 * eksiliyor.
 */
export function MagazaEkrani({
  havuc,
  setHavuc,
  durum,
  setDurum,
}: {
  havuc: number
  setHavuc: (guncelleyici: number | ((onceki: number) => number)) => void
  durum: MagazaDurumu
  setDurum: (guncelleyici: MagazaDurumu | ((onceki: MagazaDurumu) => MagazaDurumu)) => void
}) {
  const [kategori, setKategori] = useState<EsyaKategorisi>('sapka')
  /** Vitrinde denenen eşya. Kategori değişince sıfırlanıyor. */
  const [secili, setSecili] = useState<Esya | null>(null)

  const esyalar = useMemo(() => kategorininEsyalari(kategori), [kategori])
  const koleksiyon = koleksiyonOrani(durum)

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

  return (
    <div className="space-y-3.5">
      <header className="flex items-center justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-extrabold tracking-tight">Havuç Mağazası</h1>
          <p className="mt-0.5 text-[13px] font-medium text-muted-foreground">
            {koleksiyon.sahip}/{koleksiyon.toplam} eşya senin
          </p>
        </div>
        <HavucRozeti havuc={havuc} />
      </header>

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
    </div>
  )
}

/** Havuç bakiyesi rozeti — ana sayfadaki ile aynı biçim. */
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
