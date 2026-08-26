'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { KeepAwake } from '@capacitor-community/keep-awake'
import { Capacitor } from '@capacitor/core'
import { Music, Pause, Play, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react'
import type { PomodoroAyar, PomodoroSeans, SesSecimi } from '@/lib/types'
import {
  ASAMA_ADI,
  asamaSuresi,
  ilerlemeOrani,
  kalanSaniye,
  sonrakiAsama,
  sureYaz,
  type Asama,
} from '@/lib/pomodoro'
import { SesCalar } from '@/lib/ses'
import { LOFI_PARCALAR } from '@/lib/lofi'
import { CALISMA_DERSLERI } from '@/lib/dersler'
import { pomodoroIptal, pomodoroPlanla } from '@/lib/bildirim'
import {
  odakKilidiDesteklenir,
  odakKilidiKapatilinca,
  odakKilidiniBaslat,
  odakKilidiniBitir,
} from '@/lib/odak-kilidi'
import { OdakKurulum } from '@/components/ekranlar/odak-kurulum'
import { ODAK_CEZASI } from '@/lib/havuc'
import { cn, yeniId } from '@/lib/utils'
import { BaslikSatiri, Buton, Cip, Kart, Not } from '@/components/ui'

/** Ders çipleri baştan bu kadar gösteriliyor; gerisi "+N ders" ile açılıyor. */
const KISA_DERS_SAYISI = 8

export function PomodoroEkrani({
  ayar,
  setAyar,
  onSeansBitti,
  onKilitKirildi,
}: {
  ayar: PomodoroAyar
  setAyar: (guncelleyici: PomodoroAyar | ((onceki: PomodoroAyar) => PomodoroAyar)) => void
  onSeansBitti: (seans: PomodoroSeans) => void
  /**
   * Odak kilidi çalışma turu sürerken kırıldı. Havuç cezasını üst katman
   * kesiyor; gerçekten düşen miktarı döndürüyor, bakiye yetmemiş olabilir.
   */
  onKilitKirildi: () => number
}) {
  const [asama, setAsama] = useState<Asama>('calisma')
  const [tur, setTur] = useState(1)
  const [ders, setDers] = useState<string | null>(null)
  const [hepsiAcik, setHepsiAcik] = useState(false)
  const kisaListe = CALISMA_DERSLERI.slice(0, KISA_DERS_SAYISI)
  // Seçili ders kısa listede yoksa liste tamamen açılıyor; yoksa kullanıcı
  // az önce seçtiği dersin nereye gittiğini göremezdi.
  const gorunenDersler =
    hepsiAcik || (ders !== null && !kisaListe.includes(ders)) ? CALISMA_DERSLERI : kisaListe
  const [bitisZamani, setBitisZamani] = useState<number | null>(null)
  const [kalan, setKalan] = useState(ayar.calisma * 60)
  /**
   * Bu aşama hiç başlatılmadı mı. Süre ayarı değiştiğinde sayacın yeni süreye
   * atlaması gerekiyor — ama yalnızca dokunulmamış aşamada: duraklatılmış bir
   * sayaç sıfırdan başlatılırsa kullanıcı çalıştığı süreyi kaybeder.
   */
  const [dokunulmadi, setDokunulmadi] = useState(true)
  const [sesPaneli, setSesPaneli] = useState(false)
  /**
   * Odak kilidi tanıtımı pomodoroya ilk girişte bir kez çıkıyor. Tarayıcıda
   * özellik hiç yok; orada tanıtım da gösterilmiyor.
   */
  const [kurulumAcik, setKurulumAcik] = useState(false)
  useEffect(() => {
    if (odakKilidiDesteklenir() && !ayar.kilitTanitimiGoruldu) setKurulumAcik(true)
  }, [ayar.kilitTanitimiGoruldu])

  /**
   * Kırılan kilidin bedeli — bir sonraki başlatmaya kadar ekranda duruyor.
   *
   * Ceza sessizce kesilseydi kullanıcı havucunun neden azaldığını hiç
   * öğrenemezdi; caydırıcılığın tamamı bunun görülmesinden geliyor.
   */
  const [kirilanKilit, setKirilanKilit] = useState<number | null>(null)

  const calarRef = useRef<SesCalar | null>(null)
  const baslangicRef = useRef<string | null>(null)

  const toplamDakika = asamaSuresi(asama, ayar)
  const calisiyor = bitisZamani !== null

  const calarAl = useCallback(() => {
    if (!calarRef.current) calarRef.current = new SesCalar()
    return calarRef.current
  }, [])

  // Bileşen sökülürken ses ve ekran kilidi bırakılmalı, yoksa arka planda kalır.
  useEffect(() => {
    return () => {
      calarRef.current?.kapat()
      calarRef.current = null
      if (Capacitor.isNativePlatform()) void KeepAwake.allowSleep().catch(() => {})
      void pomodoroIptal()
      void odakKilidiniBitir()
    }
  }, [])

  const asamayiBitir = useCallback(() => {
    const calar = calarAl()
    calar.durdur()
    calar.zilCal()
    void pomodoroIptal()
    void odakKilidiniBitir()

    if (asama === 'calisma') {
      onSeansBitti({
        id: yeniId(),
        baslangic: baslangicRef.current ?? new Date().toISOString(),
        dakika: ayar.calisma,
        ders: ders ?? undefined,
      })
      const yeniAsama = sonrakiAsama('calisma', tur, ayar)
      setAsama(yeniAsama)
      setKalan(asamaSuresi(yeniAsama, ayar) * 60)
    } else {
      setTur((t) => t + 1)
      setAsama('calisma')
      setKalan(ayar.calisma * 60)
    }

    setBitisZamani(null)
    setDokunulmadi(true)
    baslangicRef.current = null
  }, [asama, ayar, calarAl, ders, onSeansBitti, tur])

  // Ayarlardan süre değiştirildiğinde ekrandaki sayaç da değişmeli. Bu olmadan
  // "60 dakika" seçilip Başlat'a basılınca sayaç eski süreyle çalışıyordu.
  useEffect(() => {
    if (calisiyor || !dokunulmadi) return
    setKalan(toplamDakika * 60)
  }, [toplamDakika, calisiyor, dokunulmadi])

  // Sayaç: hedef zaman damgasından okunuyor, saniye saymıyor.
  useEffect(() => {
    if (bitisZamani === null) return

    const guncelle = () => {
      const yeni = kalanSaniye(bitisZamani)
      setKalan(yeni)
      if (yeni <= 0) asamayiBitir()
    }

    guncelle()
    const zamanlayici = window.setInterval(guncelle, 500)

    // Uygulama arka plandan dönünce sayaç anında doğru değere sıçrasın.
    const gorunurluk = () => document.visibilityState === 'visible' && guncelle()
    document.addEventListener('visibilitychange', gorunurluk)

    return () => {
      window.clearInterval(zamanlayici)
      document.removeEventListener('visibilitychange', gorunurluk)
    }
  }, [bitisZamani, asamayiBitir])

  const baslat = () => {
    setKirilanKilit(null)
    const bitis = Date.now() + kalan * 1000
    setBitisZamani(bitis)
    setDokunulmadi(false)
    baslangicRef.current = new Date().toISOString()

    const calar = calarAl()
    calar.sesSeviyesi(ayar.sesSeviyesi)
    calar.cal(ayar.ses)

    void pomodoroPlanla(bitis, asama !== 'calisma')
    // Kilit yalnızca çalışma turunda; molada kendiliğinden açılıyor. İzin yoksa
    // yerli taraf sessizce "başlamadı" diyor, sayaç normal çalışmaya devam ediyor.
    if (asama === 'calisma' && ayar.odakKilidi) {
      void odakKilidiniBaslat(ayar.kilitliUygulamalar, bitis, ders ?? undefined)
    }
    if (ayar.ekraniAcikTut && Capacitor.isNativePlatform()) {
      void KeepAwake.keepAwake().catch(() => {})
    }
  }

  const duraklat = () => {
    setBitisZamani(null)
    calarRef.current?.durdur()
    void pomodoroIptal()
    void odakKilidiniBitir()
    if (Capacitor.isNativePlatform()) void KeepAwake.allowSleep().catch(() => {})
  }

  const sifirla = () => {
    duraklat()
    setKalan(toplamDakika * 60)
    setDokunulmadi(true)
    baslangicRef.current = null
  }

  const atla = () => {
    duraklat()
    // Atlanan çalışma turu seans olarak sayılmaz — sayacı doldurmadan geçildi.
    const yeniAsama =
      asama === 'calisma' ? sonrakiAsama('calisma', tur, ayar) : ('calisma' as Asama)
    if (asama !== 'calisma') setTur((t) => t + 1)
    setAsama(yeniAsama)
    setKalan(asamaSuresi(yeniAsama, ayar) * 60)
    setDokunulmadi(true)
  }

  /**
   * Engel katmanındaki "kilidi kapat" hem turu iptal ediyor hem havuç
   * götürüyor — bedeli olmayan engel, engel değil. Kilit kırılabilir olmak
   * zorunda (kırılamasaydı telefonun sahibi kendi telefonunda mahsur kalırdı),
   * o yüzden caydırıcılığı bedelin taşıması gerekiyor.
   *
   * Geri çağrı ref üzerinden okunuyor: dinleyici bir kez kuruluyor ama iptalin
   * güncel aşamayı ve güncel bakiyeyi görmesi gerekiyor.
   */
  const kilidiKir = () => {
    setKirilanKilit(onKilitKirildi())
    sifirla()
  }
  const iptalRef = useRef<() => void>(() => {})
  useEffect(() => {
    iptalRef.current = kilidiKir
  })
  useEffect(() => {
    let birak: () => void = () => {}
    void odakKilidiKapatilinca(() => iptalRef.current()).then((kaldir) => {
      birak = kaldir
    })
    return () => birak()
  }, [])

  const sesSec = (secim: SesSecimi) => {
    setAyar((o) => ({ ...o, ses: secim }))
    const calar = calarAl()
    calar.sesSeviyesi(ayar.sesSeviyesi)
    // Ses seçimi çalışırken değişirse anında geçilir; duraklatılmışsa sessiz kalır.
    if (calisiyor) calar.cal(secim)
  }

  const oran = bitisZamani !== null ? ilerlemeOrani(bitisZamani, toplamDakika) : 0
  const molaMi = asama !== 'calisma'

  if (kurulumAcik) {
    return (
      <div>
        <BaslikSatiri baslik="Pomodoro" aciklama="Odak kilidi" />
        <OdakKurulum ayar={ayar} setAyar={setAyar} onBitir={() => setKurulumAcik(false)} />
      </div>
    )
  }

  return (
    <div>
      <BaslikSatiri baslik="Pomodoro" aciklama={`${tur}. tur · ${ASAMA_ADI[asama]}`} />

      {kirilanKilit !== null && (
        <Not tur="uyari" className="mb-4">
          {kirilanKilit > 0
            ? `Odak kilidini kırdın: ${kirilanKilit} havuç gitti ve tur baştan başlıyor.`
            : 'Odak kilidini kırdın, tur baştan başlıyor. Havucun zaten boştu.'}
        </Not>
      )}

      <Kart className="mb-4 flex flex-col items-center py-6">
        <Sayac kalan={kalan} oran={oran} mola={molaMi} />

        <div className="mt-4 flex items-center gap-2">
          <Buton bicim="ikincil" boy="simge" onClick={sifirla} aria-label="Sıfırla">
            <RotateCcw size={18} aria-hidden />
          </Buton>
          <Buton className="min-w-36" onClick={calisiyor ? duraklat : baslat}>
            {calisiyor ? (
              <>
                <Pause size={18} aria-hidden /> Duraklat
              </>
            ) : (
              <>
                <Play size={18} aria-hidden /> Başlat
              </>
            )}
          </Buton>
          <Buton bicim="ikincil" boy="simge" onClick={atla} aria-label="Bu aşamayı atla">
            <SkipForward size={18} aria-hidden />
          </Buton>
        </div>
      </Kart>

      {!calisiyor && asama === 'calisma' && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium">Hangi derse çalışıyorsun?</p>
          <div className="flex flex-wrap gap-2">
            {gorunenDersler.map((d) => (
              <Cip key={d} secili={ders === d} onClick={() => setDers(ders === d ? null : d)}>
                {d}
              </Cip>
            ))}

            {/*
              Liste baştan açık gelmiyor: yirmi çip sayacın üstünde beş satır
              kaplıyor ve asıl işi (başlat düğmesini) aşağı itiyordu. Seçili
              ders zaten görünen sekizin dışındaysa liste açık başlıyor, yoksa
              kullanıcı seçtiği dersi göremezdi.
            */}
            {!hepsiAcik && CALISMA_DERSLERI.length > KISA_DERS_SAYISI && (
              <Cip onClick={() => setHepsiAcik(true)}>
                +{CALISMA_DERSLERI.length - KISA_DERS_SAYISI} ders
              </Cip>
            )}
          </div>
        </div>
      )}

      <Kart className="mb-4 p-0">
        <button
          type="button"
          onClick={() => setSesPaneli((a) => !a)}
          className="flex w-full items-center gap-3 p-4 text-left"
        >
          {ayar.ses === 'yok' ? (
            <VolumeX size={18} className="shrink-0 text-muted-foreground" aria-hidden />
          ) : (
            <Volume2 size={18} className="shrink-0 text-primary" aria-hidden />
          )}
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">Ses</span>
            <span className="block truncate text-xs text-muted-foreground">
              {sesAdi(ayar.ses)}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">{sesPaneli ? 'Kapat' : 'Değiştir'}</span>
        </button>

        {sesPaneli && (
          <div className="border-t border-border p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Music size={13} aria-hidden />
              Lo-fi
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              <Cip secili={ayar.ses === 'yok'} onClick={() => sesSec('yok')}>
                Sessiz
              </Cip>
              {LOFI_PARCALAR.map((p) => (
                <Cip
                  key={p.dosya}
                  secili={ayar.ses === `lofi:${p.dosya}`}
                  onClick={() => sesSec(`lofi:${p.dosya}`)}
                >
                  {p.ad}
                </Cip>
              ))}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Ses seviyesi
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(ayar.sesSeviyesi * 100)}
                onChange={(e) => {
                  const deger = Number(e.target.value) / 100
                  setAyar((o) => ({ ...o, sesSeviyesi: deger }))
                  calarRef.current?.sesSeviyesi(deger)
                }}
                className="w-full accent-[var(--primary)]"
              />
            </label>

            <p className="mt-3 text-xs text-muted-foreground">
              Parçalar kamu malı (CC0), uygulamanın içinde — internet gerekmiyor. Biri
              bitince sıradaki başlar.
            </p>
          </div>
        )}
      </Kart>

      <SureAyarlari ayar={ayar} setAyar={setAyar} kilitli={calisiyor} />

      <Not className="mt-4">
        Sayaç bitiş saatine göre çalışıyor — telefonu kilitlesen de doğru zamanda biter ve
        bildirim gelir.
      </Not>
    </div>
  )
}

function Sayac({ kalan, oran, mola }: { kalan: number; oran: number; mola: boolean }) {
  const boyut = 220
  const kalinlik = 12
  const yaricap = (boyut - kalinlik) / 2
  const cevre = 2 * Math.PI * yaricap

  return (
    <div className="relative" style={{ width: boyut, height: boyut }}>
      <svg width={boyut} height={boyut} className="-rotate-90">
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={yaricap}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={kalinlik}
        />
        <circle
          cx={boyut / 2}
          cy={boyut / 2}
          r={yaricap}
          fill="none"
          stroke={mola ? 'var(--ikincil)' : 'var(--primary)'}
          strokeWidth={kalinlik}
          strokeLinecap="round"
          strokeDasharray={cevre}
          strokeDashoffset={cevre * (1 - oran)}
          className="transition-[stroke-dashoffset] duration-500 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rakam font-display text-5xl font-semibold tabular-nums">
          {sureYaz(kalan)}
        </span>
      </div>
    </div>
  )
}

function SureAyarlari({
  ayar,
  setAyar,
  kilitli,
}: {
  ayar: PomodoroAyar
  setAyar: (guncelleyici: PomodoroAyar | ((onceki: PomodoroAyar) => PomodoroAyar)) => void
  kilitli: boolean
}) {
  const alanlar: {
    anahtar: keyof PomodoroAyar
    etiket: string
    secenekler: number[]
    /** Serbest giriş sınırı; yoksa yalnızca hazır seçenekler kullanılır. */
    sinir?: { enAz: number; enCok: number }
  }[] = [
    {
      anahtar: 'calisma',
      etiket: 'Çalışma',
      secenekler: [15, 25, 30, 45, 50, 60],
      sinir: { enAz: 1, enCok: 180 },
    },
    { anahtar: 'kisaMola', etiket: 'Kısa mola', secenekler: [3, 5, 10], sinir: { enAz: 1, enCok: 60 } },
    { anahtar: 'uzunMola', etiket: 'Uzun mola', secenekler: [15, 20, 30], sinir: { enAz: 1, enCok: 120 } },
    { anahtar: 'turSayisi', etiket: 'Uzun moladan önce', secenekler: [2, 3, 4, 5] },
  ]

  return (
    <Kart>
      <p className="mb-3 font-display text-base font-extrabold tracking-tight">Süreler</p>
      <div className={cn('space-y-3', kilitli && 'pointer-events-none opacity-50')}>
        {alanlar.map(({ anahtar, etiket, secenekler, sinir }) => (
          <div key={anahtar}>
            {/* Etiket küçük ve büyük harf: dört grup alt alta dizildiğinde
                normal yazıyla çipler ile etiketler aynı ağırlıkta okunuyordu. */}
            <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
              {etiket}
              {anahtar === 'turSayisi' ? ' (tur)' : ' (dk)'}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {secenekler.map((deger) => (
                <Cip
                  key={deger}
                  secili={ayar[anahtar] === deger}
                  onClick={() => setAyar((o) => ({ ...o, [anahtar]: deger }))}
                >
                  {deger}
                </Cip>
              ))}
              {sinir && (
                <SerbestSure
                  deger={ayar[anahtar] as number}
                  hazirlar={secenekler}
                  sinir={sinir}
                  onDegis={(deger) => setAyar((o) => ({ ...o, [anahtar]: deger }))}
                />
              )}
            </div>
          </div>
        ))}

        <label className="flex items-center justify-between gap-3 pt-1">
          <span className="text-sm">
            Çalışırken ekran açık kalsın
            <span className="block text-xs text-muted-foreground">
              Pili daha hızlı tüketir
            </span>
          </span>
          <input
            type="checkbox"
            checked={ayar.ekraniAcikTut}
            onChange={(e) => setAyar((o) => ({ ...o, ekraniAcikTut: e.target.checked }))}
            className="h-5 w-5 shrink-0 accent-[var(--primary)]"
          />
        </label>
      </div>

      {kilitli && (
        <p className="mt-3 text-xs text-muted-foreground">
          Süreleri değiştirmek için sayacı duraklat.
        </p>
      )}
    </Kart>
  )
}

/**
 * Hazır seçeneklerin dışında bir süre yazmak için.
 *
 * Kutu, yalnızca hazır seçeneklerden biri **seçili değilken** dolu görünüyor;
 * böylece hangi değerin geçerli olduğu tek bakışta anlaşılıyor (çip mi, kutu mu).
 * Yazarken anında uygulanmıyor: "6" yazıp "60" yapmaya giderken sayaç 6 dakikaya
 * düşerdi. Değer odaktan çıkınca ya da Enter'a basınca işleniyor.
 */
function SerbestSure({
  deger,
  hazirlar,
  sinir,
  onDegis,
}: {
  deger: number
  hazirlar: number[]
  sinir: { enAz: number; enCok: number }
  onDegis: (deger: number) => void
}) {
  const ozel = !hazirlar.includes(deger)
  const [metin, setMetin] = useState(ozel ? String(deger) : '')

  // Çipe basıldığında kutu boşalmalı; dışarıdan gelen değer değişimini izliyor.
  useEffect(() => {
    setMetin(ozel ? String(deger) : '')
  }, [deger, ozel])

  const uygula = () => {
    const sayi = Number(metin)
    if (!Number.isFinite(sayi) || sayi <= 0) {
      setMetin(ozel ? String(deger) : '')
      return
    }
    onDegis(Math.min(sinir.enCok, Math.max(sinir.enAz, Math.round(sayi))))
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      value={metin}
      onChange={(e) => setMetin(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
      onBlur={uygula}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.currentTarget.blur()
        }
      }}
      placeholder="Diğer"
      aria-label={`Serbest süre (${sinir.enAz}–${sinir.enCok} dakika)`}
      className={cn(
        'rakam h-[34px] w-[68px] rounded-full border bg-card px-3 text-center text-sm font-medium',
        'placeholder:font-normal placeholder:text-muted-foreground/70',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ozel ? 'border-primary text-primary' : 'border-border text-muted-foreground',
      )}
    />
  )
}

function sesAdi(secim: SesSecimi): string {
  const parca = LOFI_PARCALAR.find((p) => `lofi:${p.dosya}` === secim)
  // Eski kayıtlarda kaldırılmış ortam sesleri (yağmur, kafe…) olabilir;
  // tanınmayan her seçim sessize düşer.
  return parca ? `Lo-fi · ${parca.ad}` : 'Sessiz'
}
