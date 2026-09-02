'use client'

import { useRef, useState } from 'react'
import { Check, GripHorizontal, Plus, Trash2 } from 'lucide-react'
import {
  EN_COK_NOT,
  EN_UZUN_NOT,
  kalanIs,
  notEkle,
  notSil,
  notTasi,
  notYaz,
  notuIsaretle,
  oneAl,
  yerVarMi,
  type NotKagidi,
  type NotRengi,
} from '@/lib/yapilacaklar'
import { bugun, cn, yeniId } from '@/lib/utils'
import { BaslikSatiri, Buton, Not } from '@/components/ui'

/**
 * Yapılacaklar — sürüklenebilir not kâğıtlarından oluşan bir tahta.
 *
 * Listeler sıra dayatır; günün kendisinde öyle bir sıra yok. Kâğıtları istediği
 * yere koyabilmek kullanıcıya listede olmayan bir şey veriyor: gruplama. "Bunlar
 * okul, şunlar ev" ayrımı kâğıtların konumunda duruyor ve o bilgiyi bir listeye
 * düzleştirmek onu atmak olurdu.
 *
 * Kâğıtlar yalnızca bu ekranda; uygulamanın üstünde yüzen bir katman değiller.
 * Her ekranda görünen bir yapılacak listesi, kaygıyı hiç bırakmayan bir arayüz
 * olurdu — buraya girmek de bir karar.
 */

/**
 * Tahtanın yüksekliği ve kâğıdın genişliği (piksel / yüzde).
 *
 * Sabit, çünkü konumlar orana çevrilirken tahtanın kendisi ölçü birimi:
 * içeriğe göre büyüyen bir tahtada kâğıt eklemek eskilerinin yerini kaydırırdı.
 * Yükseklik on kâğıdın **sığmasına** göre seçildi: `yeniKonum` beş satır
 * açıyor ve satır aralığı kâğıdın boyundan kısa kalırsa kâğıtlar daha ilk
 * eklendikleri anda üst üste biner. Elle taşınan kâğıtlar binebiliyor ama
 * birbirini tümüyle kapatamıyor — kural `ayrikKonum` içinde.
 *
 * Sınıf değil satır içi ölçü: bu iki sayı olmadan özellik ekranda **yok** —
 * tahta sıfır yükseklikte, kâğıt sıfır genişlikte kalıyor. Tailwind sınıfları
 * kaynak dosyası tarandığı sürece üretiliyor ve bu dosya bir kez taramadan
 * düşmüştü (bkz. AGENTS.md, "Yapılacaklar tahtası"). Görünüşe ait bir sınıfın
 * kaçması eksik bir gölge demek; ölçüye ait olanınki boş bir ekran.
 */
const TAHTA_YUKSEKLIGI = 700
const KAGIT_GENISLIGI = '46%'
const KAGIT_EN_COK = 168

/**
 * Kâğıt renkleri — uygulamanın tek paletinden geliyor.
 *
 * Ders renkleri burada ders anlatmıyor, yalnızca kâğıtları birbirinden ayırıyor;
 * ikinci bir palet uydurmaktansa var olanı kullanmak doğru. (`AGENTS.md`
 * "Tasarım": tek palet.)
 */
const RENK_SINIFI: Record<NotRengi, string> = {
  sari: 'bg-isl-kart text-isl-koyu',
  pembe: 'bg-yzm-kart text-yzm-koyu',
  mavi: 'bg-cog-kart text-cog-koyu',
  yesil: 'bg-byl-kart text-byl-koyu',
  mor: 'bg-edb-kart text-edb-koyu',
}

/** Klavyeyle taşımada her tuş vuruşunun kaydırdığı oran. */
const TUS_ADIMI = 0.08

export function YapilacaklarEkrani({
  notlar,
  setNotlar,
}: {
  notlar: NotKagidi[]
  setNotlar: (guncelleyici: NotKagidi[] | ((onceki: NotKagidi[]) => NotKagidi[])) => void
}) {
  const tahtaRef = useRef<HTMLDivElement | null>(null)
  const bekleyen = kalanIs(notlar)
  const doluMu = !yerVarMi(notlar)

  const kagitEkle = () => {
    setNotlar((onceki) => notEkle(onceki, yeniId(), bugun()) ?? onceki)
  }

  return (
    <div>
      <BaslikSatiri
        baslik="Yapılacaklar"
        aciklama={
          notlar.length === 0
            ? 'Bugünün tahtası boş'
            : bekleyen === 0
              ? `${notlar.length} kâğıt · hepsi bitti`
              : `Bugün ${bekleyen} iş bekliyor`
        }
      />

      <div className="mb-3 flex items-center gap-2">
        <Buton onClick={kagitEkle} disabled={doluMu} className="flex-1">
          <Plus size={18} aria-hidden /> Yeni kâğıt
        </Buton>
        <span className="rakam shrink-0 rounded-full bg-muted px-3 py-1.5 text-xs font-extrabold text-muted-foreground">
          {notlar.length}/{EN_COK_NOT}
        </span>
      </div>

      {doluMu && (
        <Not tur="uyari" className="mb-3">
          Tahta dolu ({EN_COK_NOT} kâğıt). Yeni kâğıt için bitenlerden birini sil.
        </Not>
      )}

      <div
        ref={tahtaRef}
        className="golge-kart relative w-full overflow-hidden rounded-[22px] bg-card"
        style={{ height: TAHTA_YUKSEKLIGI }}
      >
        {/* Çizgili zemin: alan "yazılabilir bir yüzey" gibi dursun diye. Kâğıt
            yokken boş bir dikdörtgen, kırık bir ekran gibi görünüyordu. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(transparent 0 27px, var(--border) 27px 28px)',
          }}
        />

        {notlar.length === 0 && (
          <p className="absolute inset-0 grid place-items-center px-8 text-center text-[13px] font-semibold leading-snug text-muted-foreground">
            Bugününü kâğıt kâğıt yaz. Kâğıdı üst şeridinden tutup istediğin yere
            sürükleyebilirsin.
          </p>
        )}

        {/* Dizideki sıra aynı zamanda yığın sırası: son eleman en üstte. */}
        {notlar.map((not) => (
          <Kagit
            key={not.id}
            not={not}
            tahtaRef={tahtaRef}
            onOneAl={() => setNotlar((o) => oneAl(o, not.id))}
            onTasi={(x, y) => setNotlar((o) => notTasi(o, not.id, x, y))}
            onYaz={(metin) => setNotlar((o) => notYaz(o, not.id, metin))}
            onIsaretle={() => setNotlar((o) => notuIsaretle(o, not.id))}
            onSil={() => setNotlar((o) => notSil(o, not.id))}
          />
        ))}
      </div>
    </div>
  )
}

function Kagit({
  not,
  tahtaRef,
  onOneAl,
  onTasi,
  onYaz,
  onIsaretle,
  onSil,
}: {
  not: NotKagidi
  tahtaRef: React.RefObject<HTMLDivElement | null>
  onOneAl: () => void
  onTasi: (x: number, y: number) => void
  onYaz: (metin: string) => void
  onIsaretle: () => void
  onSil: () => void
}) {
  const kagitRef = useRef<HTMLDivElement | null>(null)
  /**
   * Sürüklenirken konum yerelde tutuluyor.
   *
   * Her parmak hareketinde üst state'e yazmak on kâğıdı birden yeniden çizer ve
   * her hareketi `localStorage`'a yazardı. Kayıt parmak kalkınca bir kez
   * güncelleniyor.
   */
  const [suruklenen, setSuruklenen] = useState<{ x: number; y: number } | null>(null)
  /**
   * Sürüklemenin açık olup olmadığı ayrıca ref'te.
   *
   * State'e bakılamaz: `pointerdown` ile `pointermove` aynı iş parçasında
   * gelebiliyor ve o arada React state'i henüz uygulamamış oluyor. O durumda
   * hareket yok sayılır, `pointerup` de erken döner ve kâğıt kalkmış hâlde
   * takılı kalırdı.
   */
  const aktifRef = useRef(false)
  /** Parmağın kâğıdın neresinden tuttuğu — kâğıt köşesinden değil, tutulan yerden taşınıyor. */
  const kavramaRef = useRef({ x: 0, y: 0 })
  /** En son hesaplanan konum; parmak kalkınca kayda bu yazılıyor. */
  const sonKonumRef = useRef({ x: not.x, y: not.y })

  const konum = suruklenen ?? { x: not.x, y: not.y }

  /** Ekran koordinatını tahtadaki orana çevirir. */
  const orana = (istemciX: number, istemciY: number) => {
    const tahta = tahtaRef.current
    const kagit = kagitRef.current
    if (!tahta || !kagit) return null
    const t = tahta.getBoundingClientRect()
    const bosX = t.width - kagit.offsetWidth
    const bosY = t.height - kagit.offsetHeight
    return {
      x: bosX > 0 ? (istemciX - t.left - kavramaRef.current.x) / bosX : 0,
      y: bosY > 0 ? (istemciY - t.top - kavramaRef.current.y) / bosY : 0,
    }
  }

  const tutmayaBasla = (olay: React.PointerEvent<HTMLDivElement>) => {
    const kagit = kagitRef.current
    if (!kagit) return
    const k = kagit.getBoundingClientRect()
    kavramaRef.current = { x: olay.clientX - k.left, y: olay.clientY - k.top }
    // Yakalama başarısız olabilir (sentetik olay, iptal edilmiş işaretçi);
    // sürükleme ondan bağımsız çalışmalı.
    try {
      olay.currentTarget.setPointerCapture(olay.pointerId)
    } catch {
      // yakalama yoksa da olayları bu öğe alıyor
    }
    aktifRef.current = true
    sonKonumRef.current = { x: not.x, y: not.y }
    onOneAl()
    setSuruklenen({ x: not.x, y: not.y })
  }

  const tasi = (olay: React.PointerEvent<HTMLDivElement>) => {
    if (!aktifRef.current) return
    const yeni = orana(olay.clientX, olay.clientY)
    if (!yeni) return
    sonKonumRef.current = { x: sinirla(yeni.x), y: sinirla(yeni.y) }
    setSuruklenen(sonKonumRef.current)
  }

  const birak = () => {
    if (!aktifRef.current) return
    aktifRef.current = false
    onTasi(sonKonumRef.current.x, sonKonumRef.current.y)
    setSuruklenen(null)
  }

  /** Dokunmatikte sürüklenemeyen kâğıt için klavye yolu. */
  const tusla = (olay: React.KeyboardEvent<HTMLDivElement>) => {
    const yon: Record<string, [number, number]> = {
      ArrowLeft: [-TUS_ADIMI, 0],
      ArrowRight: [TUS_ADIMI, 0],
      ArrowUp: [0, -TUS_ADIMI],
      ArrowDown: [0, TUS_ADIMI],
    }
    const adim = yon[olay.key]
    if (!adim) return
    olay.preventDefault()
    onOneAl()
    onTasi(sinirla(not.x + adim[0]), sinirla(not.y + adim[1]))
  }

  return (
    <div
      ref={kagitRef}
      className={cn(
        'absolute rounded-[14px] shadow-[0_5px_14px_rgba(38,58,110,0.16)]',
        RENK_SINIFI[not.renk],
        suruklenen !== null ? 'cursor-grabbing' : 'transition-transform',
        not.bitti && 'opacity-60',
      )}
      style={{
        width: KAGIT_GENISLIGI,
        maxWidth: KAGIT_EN_COK,
        left: `${konum.x * 100}%`,
        top: `${konum.y * 100}%`,
        /*
          Konum oranı kâğıdın **sığdığı boşluğa** göre: `translate` ile eşleşen
          yüzde, 0'da sola, 1'de sağa yaslıyor ve kâğıt hiçbir zaman taşmıyor.

          Kalkma etkisi de burada, sınıfta değil: satır içi `transform` sınıftan
          gelen `scale`i her hâlükârda ezerdi.
        */
        transform: `translate(-${konum.x * 100}%, -${konum.y * 100}%)${
          suruklenen !== null ? ' scale(1.04)' : ''
        }`,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Kâğıdı taşı${not.metin ? `: ${not.metin.slice(0, 30)}` : ''}`}
        onPointerDown={tutmayaBasla}
        onPointerMove={tasi}
        onPointerUp={birak}
        onPointerCancel={birak}
        onKeyDown={tusla}
        // Sürükleme sırasında sayfanın kaymaması için: dokunmatikte varsayılan
        // hareket kaydırma, kâğıdı hiç taşıyamazdık.
        className="flex touch-none cursor-grab items-center gap-1 rounded-t-[14px] bg-black/[0.06] px-1.5 py-1"
      >
        <GripHorizontal size={15} className="shrink-0 opacity-60" aria-hidden />
        <span className="flex-1" />
        <button
          type="button"
          onClick={onIsaretle}
          aria-label={not.bitti ? 'Bitmedi olarak işaretle' : 'Bitti olarak işaretle'}
          aria-pressed={not.bitti}
          className={cn(
            'grid size-6 place-items-center rounded-full transition active:brightness-95',
            not.bitti ? 'bg-success text-white' : 'bg-white/60',
          )}
        >
          <Check size={13} strokeWidth={3} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onSil}
          aria-label="Kâğıdı sil"
          className="grid size-6 place-items-center rounded-full bg-white/60 transition active:brightness-95"
        >
          <Trash2 size={12} aria-hidden />
        </button>
      </div>

      <textarea
        value={not.metin}
        onChange={(olay) => onYaz(olay.target.value)}
        maxLength={EN_UZUN_NOT}
        rows={5}
        placeholder="Ne yapacaksın?"
        className={cn(
          'block w-full resize-none rounded-b-[14px] bg-transparent px-2 py-1.5 text-[12.5px] font-semibold leading-snug outline-none placeholder:opacity-50',
          not.bitti && 'line-through',
        )}
      />
    </div>
  )
}

function sinirla(deger: number): number {
  return Math.min(1, Math.max(0, deger))
}
