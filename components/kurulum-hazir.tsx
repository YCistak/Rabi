'use client'

import { useEffect, useMemo, useRef } from 'react'
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardList,
  ListChecks,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { Rabi } from '@/components/maskot/rabi'
import { hazirKutulari, type HazirGirdisi, type HazirKutuKimligi } from '@/lib/kurulum-hazir'
import { bugun } from '@/lib/utils'

/**
 * Kutucukların ikonu ve rengi.
 *
 * Renkler ders paletinden ama kutucuklar ders değil: altısı yan yana durunca
 * birbirinden ayrılsın diye her biri başka bir aileden. Sınıf adları tam
 * yazılıyor; Tailwind birleştirilmiş adı (`bg-konu-${x}`) görmez.
 */
const KUTU_GORUNUSU: Record<HazirKutuKimligi, { ikon: LucideIcon; zemin: string; yazi: string }> = {
  konu: { ikon: BookOpen, zemin: 'bg-konu-matematik ring-konu-matematik-kenar', yazi: 'text-konu-matematik-koyu' },
  denemeler: { ikon: ClipboardList, zemin: 'bg-konu-kimya ring-konu-kimya-kenar', yazi: 'text-konu-kimya-koyu' },
  hedef: { ikon: Target, zemin: 'bg-konu-tarih ring-konu-tarih-kenar', yazi: 'text-konu-tarih-koyu' },
  hatirlatma: { ikon: Bell, zemin: 'bg-konu-cografya ring-konu-cografya-kenar', yazi: 'text-konu-cografya-koyu' },
  'geri-sayim': { ikon: CalendarDays, zemin: 'bg-konu-fizik ring-konu-fizik-kenar', yazi: 'text-konu-fizik-koyu' },
  gunluk: { ikon: ListChecks, zemin: 'bg-konu-biyoloji ring-konu-biyoloji-kenar', yazi: 'text-konu-biyoloji-koyu' },
}

/** Konfetinin renkleri: ders ailelerinin dolgu ve kenar tonları + marka dolgusu. */
const KONFETI_RENKLERI = [
  'matematik-ok', 'matematik-kenar', 'turkce-kenar', 'turkce-ok', 'fizik-ok', 'fizik-kenar',
  'kimya-ok', 'kimya-kenar', 'biyoloji-ok', 'biyoloji-kenar', 'cografya-ok', 'cografya-kenar',
].map((ton) => `var(--konu-${ton})`).concat('var(--primary-parlak)')

const KONFETI_ADEDI = 40
/** px/s². Parçalar yukarı fışkırıp bu ivmeyle ekranın altına düşüyor. */
const YERCEKIMI = 1100
/** Tavşanın girişi 700 ms; patlama yaylanmanın tepesinde, yerine oturduğu an. */
const KONFETI_GECIKMESI = 480

/**
 * Tavşanın ortasından bir kez patlayan konfeti.
 *
 * Kareler önceden hesaplanıp Web Animations'a veriliyor: CSS keyframe'iyle
 * her parçaya ayrı yön, hız ve dönüş vermek kırk ayrı keyframe demekti.
 * Hava direnci yatay hızı söndürüyor, yerçekimi düşüşü hızlandırıyor.
 */
function konfetiPatlat(katman: HTMLElement, kaynak: HTMLElement) {
  const katmanKutu = katman.getBoundingClientRect()
  const kaynakKutu = kaynak.getBoundingClientRect()
  const ox = kaynakKutu.left - katmanKutu.left + kaynakKutu.width / 2
  const oy = kaynakKutu.top - katmanKutu.top + kaynakKutu.height / 2

  for (let i = 0; i < KONFETI_ADEDI; i++) {
    const parca = document.createElement('span')
    const bicim = i % 3
    parca.className = 'hazir-konfeti'
    parca.style.width = `${(bicim === 2 ? 7 : 6 + Math.random() * 3).toFixed(1)}px`
    parca.style.height = `${(bicim === 0 ? 10 + Math.random() * 5 : bicim === 1 ? 4 : 7).toFixed(1)}px`
    parca.style.borderRadius = bicim === 2 ? '50%' : '2px'
    parca.style.background = KONFETI_RENKLERI[i % KONFETI_RENKLERI.length]
    katman.appendChild(parca)

    // Yukarı doğru geniş bir yelpaze: -165° ile -15° arası.
    const aci = ((-165 + Math.random() * 150) * Math.PI) / 180
    const hiz = 380 + Math.random() * 420
    const vx = Math.cos(aci) * hiz * 0.85
    const vy = Math.sin(aci) * hiz
    const sure = 2.1 + Math.random() * 0.9
    const donus = (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 540)
    const salinim = 8 + Math.random() * 14
    const evre = Math.random() * Math.PI * 2

    const ADIM = 18
    const kareler: Keyframe[] = []
    for (let k = 0; k <= ADIM; k++) {
      const oran = k / ADIM
      const t = oran * sure
      const x = ox + (vx * (1 - Math.exp(-1.6 * t))) / 1.6 + Math.sin(evre + t * 6) * salinim * oran
      const y = oy + vy * t + 0.5 * YERCEKIMI * t * t
      kareler.push({
        transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(donus * oran).toFixed(0)}deg) rotateX(${(donus * 0.6 * oran).toFixed(0)}deg)`,
        // Son çeyrekte sönüyor: ekranın altına çarpıp kesilmesin.
        opacity: oran < 0.75 ? 1 : Math.max(0, 1 - (oran - 0.75) / 0.25),
      })
    }
    parca.animate(kareler, { duration: sure * 1000, easing: 'linear', fill: 'forwards' }).onfinish = () =>
      parca.remove()
  }
}

/**
 * Kurulum bittikten sonra gelen "uygulaman hazır" ekranı.
 *
 * Yerinde dokuz saniyelik bir hazırlık çubuğu vardı; kullanıcı dolan bir
 * çubuk yerine cevaplarının yerine oturduğunu gören, kutlamalı bir ekran
 * istedi (tasarım: "Seni Bekleyenler"). Ekran kendiliğinden kalkmıyor:
 * kutucuklar okunsun diye geçiş "Başlayalım"a bağlı.
 */
export function KurulumHazir({
  ad,
  girdi,
  onBasla,
}: {
  ad: string
  girdi: HazirGirdisi
  onBasla: () => void
}) {
  const kutular = useMemo(() => hazirKutulari(girdi, bugun()), [girdi])
  const katmanRef = useRef<HTMLDivElement>(null)
  const maskotRef = useRef<HTMLDivElement>(null)
  // Çift dokunuş `onBitir`i iki kez çağırmasın.
  const basladi = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const sayac = setTimeout(() => {
      const katman = katmanRef.current
      const maskot = maskotRef.current
      if (katman && maskot && typeof katman.animate === 'function') konfetiPatlat(katman, maskot)
    }, KONFETI_GECIKMESI)
    return () => clearTimeout(sayac)
  }, [])

  return (
    <div className="relative mx-auto flex en-az-ekran max-w-md flex-col overflow-hidden px-5 pt-[calc(1.5rem+var(--guvenli-ust))] pb-[calc(1.5rem+var(--guvenli-alt))]">
      {/* Tavşanın arkasındaki sıcak hale: kutlama hissi ama sakin. */}
      <div className="hazir-hale pointer-events-none absolute left-1/2 top-[calc(-70px+var(--guvenli-ust))] -ml-[170px] h-[300px] w-[340px] rounded-full" aria-hidden />

      <div className="relative flex flex-col items-center text-center">
        <div ref={maskotRef} className="hazir-maskot">
          <Rabi durum="mutlu" poz="kucak-acan" boyut={120} etiket="kucak açıyor, uygulama hazır" />
        </div>
        <h1 className="hazir-yukari mt-2 font-display text-[26px] font-black leading-tight tracking-tight" style={{ animationDelay: '450ms' }}>
          {/* Ad boş bırakılamıyor ama yine de korunuyor: adsızken virgül kalırdı. */}
          {ad ? (
            <>
              Hoş geldin, <span className="text-primary">{ad}</span>
            </>
          ) : (
            'Hoş geldin'
          )}
        </h1>
        <p className="hazir-yukari mt-1 text-[14.5px] font-semibold text-muted-foreground" style={{ animationDelay: '580ms' }}>
          Uygulaman sana göre kuruldu.
        </p>
      </div>

      <ul className="relative mt-5 grid grid-cols-2 gap-2.5">
        {kutular.map((kutu, sira) => {
          const { ikon: Ikon, zemin, yazi } = KUTU_GORUNUSU[kutu.kimlik]
          return (
            <li
              key={kutu.kimlik}
              className="hazir-kutu golge-kart relative flex min-h-[112px] flex-col rounded-2xl bg-card p-3"
              style={{ '--sira': sira } as React.CSSProperties}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-[11px] ring-1 ring-inset ${zemin} ${yazi}`}>
                <Ikon className="h-[19px] w-[19px]" strokeWidth={2} aria-hidden />
              </span>
              <span className="mt-2 text-[14.5px] font-extrabold leading-tight">{kutu.ad}</span>
              <span className={`mt-0.5 line-clamp-2 text-xs font-bold leading-snug ${yazi}`}>{kutu.satir}</span>
              <span className="hazir-tik absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-success text-white" aria-hidden>
                <Check className="h-3 w-3" strokeWidth={3.2} />
              </span>
            </li>
          )
        })}
      </ul>

      <div className="hazir-yukari mt-auto pt-4" style={{ animationDelay: '2250ms' }}>
        <button
          type="button"
          onClick={() => {
            if (basladi.current) return
            basladi.current = true
            onBasla()
          }}
          className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-primary-dolu text-[17px] font-extrabold text-white shadow-[0_8px_18px_rgba(217,98,47,0.28)] transition-transform active:scale-[0.97]"
        >
          Başlayalım
          <ArrowRight className="h-[19px] w-[19px]" strokeWidth={2.4} aria-hidden />
        </button>
      </div>

      {/* Konfeti en üstte ama dokunuşu geçiriyor: patlarken de düğmeye basılabilsin. */}
      <div ref={katmanRef} className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden />
    </div>
  )
}
