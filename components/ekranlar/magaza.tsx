'use client'

import { Carrot, Lock, Plus } from 'lucide-react'
import {
  JOKERLER,
  STOK_SINIRI,
  jokerAcikMi,
  jokerAl,
  jokerAlinabilirMi,
  jokerDoluMu,
  jokerSayisi,
  jokerToplami,
  type Joker,
  type JokerStogu,
} from '@/lib/magaza/jokerler'
import { seviyeUnvani, type SeviyeDurumu } from '@/lib/seviye'
import { Buton, Kart } from '@/components/ui'
import { cn } from '@/lib/utils'

/**
 * Havuç Mağazası.
 *
 * Satılan tek şey joker. Tavşan özelleştirmesi kaldırıldı: kozmetik eşyaların
 * oyuna hiçbir dokunuşu yoktu ve mağazanın yarısını kaplıyorlardı; geriye
 * gerçekten işe yarayan reyon kaldı.
 *
 * Havuç yalnızca seviye atlayarak kazanılıyor, o yüzden başlıkta bakiyenin
 * yanında seviye de duruyor: kullanıcı parayı nereden kazandığını burada
 * görmeli, yoksa bakiye gökten inmiş gibi durur.
 *
 * Kilitli jokerler **gizlenmiyor**, kilitli gösteriliyor. Görünmeyen bir ödül
 * hedef olmuyor; "8. seviyede açılıyor" yazan bir kutucuk oluyor.
 */
export function MagazaEkrani({
  havuc,
  setHavuc,
  seviye,
  stok,
  setStok,
}: {
  havuc: number
  setHavuc: (guncelleyici: number | ((onceki: number) => number)) => void
  seviye: SeviyeDurumu
  stok: JokerStogu
  setStok: (guncelleyici: JokerStogu | ((onceki: JokerStogu) => JokerStogu)) => void
}) {
  const cantadaki = jokerToplami(stok)

  const jokerAlindi = (joker: Joker) => {
    const sonuc = jokerAl(stok, havuc, joker, seviye.seviye)
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
            {cantadaki > 0 ? `Çantanda ${cantadaki} joker var` : 'Çantan henüz boş'}
          </p>
        </div>
        <HavucRozeti havuc={havuc} />
      </header>

      {/* Havucun nereden geldiği. Seviye çubuğu ana sayfada da var ama mağazada
          tekrar etmesi gerekiyor: harcama ile kazanç aynı ekranda görünsün. */}
      <SeviyeSeridi seviye={seviye} />

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
            <JokerSatiri
              joker={joker}
              stok={stok}
              havuc={havuc}
              seviye={seviye.seviye}
              onAl={() => jokerAlindi(joker)}
            />
          </li>
        ))}
      </ul>
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

/**
 * Seviye ve bir sonrakine kalan yol.
 *
 * Ana sayfadaki şeritle aynı bileşen değil: orada gün gün ilerlemenin yanında
 * duruyor, burada "havucun kaynağı" olarak. Ortak bir bileşene çıkarmak iki
 * ayrı bağlamı tek biçime zorlardı.
 */
function SeviyeSeridi({ seviye }: { seviye: SeviyeDurumu }) {
  return (
    <Kart className="py-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-display font-extrabold">
          <span className="rakam text-primary">{seviye.seviye}</span>
          <span className="ml-1.5 text-[13px] font-bold text-muted-foreground">
            {seviyeUnvani(seviye.seviye)}
          </span>
        </p>
        {seviye.sonrakiIcinXp > 0 ? (
          <p className="rakam text-[12.5px] font-bold text-muted-foreground">
            {seviye.buSeviyeXp} / {seviye.sonrakiIcinXp} XP
          </p>
        ) : (
          <p className="text-[12.5px] font-bold text-muted-foreground">Tavan seviye</p>
        )}
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${Math.round(seviye.oran * 100)}%` }}
        />
      </div>

      <p className="mt-2 text-[12.5px] font-medium text-muted-foreground">
        Havuç yalnızca seviye atlayınca kazanılır: çalış, soru gir, oyna.
      </p>
    </Kart>
  )
}

function JokerSatiri({
  joker,
  stok,
  havuc,
  seviye,
  onAl,
}: {
  joker: Joker
  stok: JokerStogu
  havuc: number
  seviye: number
  onAl: () => void
}) {
  const adet = jokerSayisi(stok, joker.id)
  const acik = jokerAcikMi(joker, seviye)
  const dolu = jokerDoluMu(stok, joker)
  const alinabilir = jokerAlinabilirMi(stok, havuc, joker, seviye)

  return (
    <Kart className={cn('flex items-center gap-3 py-3', !acik && 'opacity-70')}>
      <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-muted/70 text-xl">
        <span aria-hidden>{acik ? joker.simge : <Lock size={18} strokeWidth={2.6} />}</span>
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
          {acik ? (
            joker.aciklama
          ) : (
            <>
              <span className="rakam font-bold">{joker.enAzSeviye}</span>. seviyede açılır.
            </>
          )}
        </p>
      </div>

      <Buton
        boy="kucuk"
        onClick={onAl}
        disabled={!alinabilir}
        className="shrink-0"
        aria-label={
          !acik
            ? `${joker.ad}, ${joker.enAzSeviye}. seviyede açılır`
            : dolu
              ? `${joker.ad} çantan dolu`
              : `${joker.ad} satın al, ${joker.fiyat} havuç`
        }
      >
        {!acik ? (
          <>
            <Lock size={13} strokeWidth={3} aria-hidden />
            <span className="rakam">{joker.enAzSeviye}</span>
          </>
        ) : dolu ? (
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
