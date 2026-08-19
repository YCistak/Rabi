'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  OyunId,
  OyunKayitlari,
  OyunMuzikTuru,
  OyunTurKaydi,
} from '@/lib/types'
import {
  dersBul,
  dersinOyunlari,
  doluDersler,
  istatistikAl,
  type DersId,
} from '@/lib/oyunlar/tanim'
import {
  TUR_SURESI,
  YANLIS_CEZASI,
  istatistigiGuncelle,
  type TurSayilari,
} from '@/lib/oyunlar/tur'
import {
  bankaDagilimi,
  bankayiGuncelle,
  dusenSayisi,
  type BankaCevabi,
  type BankaKaydi,
} from '@/lib/oyunlar/banka'
import { sesleriHazirla } from '@/lib/oyunlar/oyun-sesi'
import { OYUN_GECMIS_SINIRI } from '@/lib/depo'
import { OyunMuzigi } from '@/lib/oyunlar/oyun-muzigi'
import { LOFI_PARCALAR } from '@/lib/lofi'
import { SesCalar } from '@/lib/ses'
import { useGeriKatmani } from '@/lib/geri'
import { useUygulamaGorunur } from '@/lib/gorunurluk'
import { bugun } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { BildirimKolu } from '@/components/hata-bildir'
import { YazimOyunuEkrani } from '@/components/ekranlar/oyun-yazim'
import { SesOyunuEkrani } from '@/components/ekranlar/oyun-ses'
import { OgeOyunuEkrani } from '@/components/ekranlar/oyun-oge'
import { SozOyunuEkrani } from '@/components/ekranlar/oyun-soz'
import { IslemOyunuEkrani } from '@/components/ekranlar/oyun-islem'
import { BolunmeOyunuEkrani } from '@/components/ekranlar/oyun-bolunme'
import { EdebiyatOyunuEkrani } from '@/components/ekranlar/oyun-edebiyat'

/**
 * Oyunlar sekmesi.
 *
 * Alt menüde kendi sekmesi var (eskiden kart menüsünden açılan bir ekrandı).
 * Sebebi tasarımda: oyunlar günlük kullanımda en sık açılan yer ve iki dokunuş
 * uzaktaydı.
 *
 * Oyun seçilince tam ekran bir katman açılıyor; bu ekran arkada duruyor ve
 * çıkışta olduğu gibi geri geliyor.
 */

/**
 * Kart renkleri — artık oyuna değil **derse** bağlı.
 *
 * Aynı derse çalışan bütün oyunlar aynı rengi paylaşıyor; renk böylece süs
 * değil, "bu ne dersi" bilgisini taşıyor. Aile adlarını `DERSLER` veriyor.
 */
const AILE: Record<'yzm' | 'isl' | 'edb', { zemin: string; yazi: string; ok: string }> = {
  yzm: { zemin: 'bg-yzm', yazi: 'text-yzm-koyu', ok: 'bg-yzm-ok' },
  isl: { zemin: 'bg-isl', yazi: 'text-isl-koyu', ok: 'bg-isl-ok' },
  edb: { zemin: 'bg-edb', yazi: 'text-edb-koyu', ok: 'bg-edb-ok' },
}

/** Kart başlığındaki satır kırma — iki kelimelik adlar iki satıra iniyor. */
const BASLIK_SATIRLARI: Record<OyunId, [string, string]> = {
  yazim: ['Yazım', 'Ustası'],
  ses: ['Ses', 'Olayları'],
  oge: ['Cümlenin', 'Ögeleri'],
  soz: ['Deyim ve', 'Atasözü'],
  islem: ['Zihinden', 'İşlem'],
  bolunme: ['Bölünebilme', 'Kuralları'],
  edebiyat: ['Edebiyat', 'Eşleştirme'],
}

export function OyunlarEkrani({
  kayitlar,
  setKayitlar,
  setGecmis,
  banka,
  setBanka,
  sesAcik,
  muzikAcik,
  muzikTuru,
  onBankayaGit,
  onBankadanDustu,
  /** Bankadan "sadece bunlardan bir tur" ile açılan oyun; yoksa null. */
  bankaTuru,
  onBankaTuruBitti,
  bildir,
}: {
  kayitlar: OyunKayitlari
  setKayitlar: (guncelleyici: OyunKayitlari | ((onceki: OyunKayitlari) => OyunKayitlari)) => void
  setGecmis: (guncelleyici: (onceki: OyunTurKaydi[]) => OyunTurKaydi[]) => void
  banka: BankaKaydi[]
  setBanka: (guncelleyici: (onceki: BankaKaydi[]) => BankaKaydi[]) => void
  sesAcik: boolean
  muzikAcik: boolean
  muzikTuru: OyunMuzikTuru
  onBankayaGit: () => void
  /** Turda bankadan düşen soru sayısı — rozet sayacını besliyor. */
  onBankadanDustu: (adet: number) => void
  bankaTuru: OyunId | null
  onBankaTuruBitti: () => void
  bildir: BildirimKolu
}) {
  const [secilenOyun, setSecilenOyun] = useState<OyunId | null>(null)
  /** Açık kategori; null ise ders ızgarası görünüyor. */
  const [secilenDers, setSecilenDers] = useState<DersId | null>(null)
  const acikOyun = bankaTuru ?? secilenOyun
  const dagilim = useMemo(() => bankaDagilimi(banka), [banka])

  // --- Arka plan müziği ---
  // Yalnızca bir oyun açıkken ve uygulama öndeyken çalıyor. Liste ekranında
  // müzik başlaması menüde gezinen kullanıcıyı şaşırtırdı; ana tuşa basıldıktan
  // sonra çalmaya devam etmesi ise uygulama görev listesinden silinene kadar
  // sürüyordu.
  const gorunur = useUygulamaGorunur()
  const arcadeRef = useRef<OyunMuzigi | null>(null)
  const lofiRef = useRef<SesCalar | null>(null)

  const muzikCalsin = acikOyun !== null && muzikAcik

  useEffect(() => {
    if (!muzikCalsin || muzikTuru !== 'arcade') {
      arcadeRef.current?.kapat()
      arcadeRef.current = null
      return
    }
    const muzik = arcadeRef.current ?? new OyunMuzigi()
    arcadeRef.current = muzik
    // Ses efektlerinin altında kalmalı: müzik yüksek olursa doğru/yanlış
    // geri bildirimi duyulmuyor ve oyunun tek geri bildirimi kayboluyor.
    muzik.sesSeviyesi(0.42)
    if (gorunur) muzik.basla()
    else muzik.duraklat()
  }, [muzikCalsin, muzikTuru, gorunur])

  useEffect(() => {
    if (!muzikCalsin || muzikTuru !== 'lofi') {
      lofiRef.current?.kapat()
      lofiRef.current = null
      return
    }
    if (!lofiRef.current) {
      const calar = new SesCalar()
      calar.sesSeviyesi(0.22)
      calar.cal(`lofi:${LOFI_PARCALAR[5].dosya}`)
      lofiRef.current = calar
    }
    if (gorunur) lofiRef.current.devam()
    else lofiRef.current.duraklat()
  }, [muzikCalsin, muzikTuru, gorunur])

  // Ekrandan çıkarken bağlamlar da kapanmalı; yukarıdaki efektler duraklatmakla yetiniyor.
  useEffect(
    () => () => {
      arcadeRef.current?.kapat()
      arcadeRef.current = null
      lofiRef.current?.kapat()
      lofiRef.current = null
    },
    [],
  )

  /**
   * Biten tur.
   *
   * Banka turları **rekora ve istatistiğe sayılmıyor**: sorular zaten bir kez
   * yanlış bilinip kenara ayrılmış, tekrar edilen sorular. Sayılsaydı bankayı
   * birkaç kez oynayan herkesin rekoru şişerdi ve rekor "ne kadar biliyorum"
   * ölçüsü olmaktan çıkardı. Bankaya işleme ise her iki turda da yapılıyor —
   * asıl istenen o: soruyu nerede bilirsen bil, öğrenmiş sayılırsın.
   */
  const turBitti = (id: OyunId, ozet: TurSayilari, cevaplar: BankaCevabi[]) => {
    const yeniBanka = bankayiGuncelle(banka, cevaplar, bugun())
    const dusen = dusenSayisi(banka, yeniBanka)
    setBanka(() => yeniBanka)
    if (dusen > 0) onBankadanDustu(dusen)

    if (bankaTuru !== null) return

    setKayitlar((onceki) => ({
      ...onceki,
      [id]: istatistigiGuncelle(onceki[id], ozet, bugun()),
    }))

    /*
      Turun gerçek süresi.

      Ayrı bir kronometre tutulmuyor çünkü gerekmiyor: tur `TUR_SURESI` saniyelik
      bir hedef zaman damgasıyla başlıyor ve her yanlış cevap bu damgadan
      `YANLIS_CEZASI` saniye düşüyor. Turun duvar saatindeki uzunluğu tam olarak
      bu fark. (Tur bitmeden çıkılırsa hiç kayıt düşmüyor — o süre sayılmıyor.)
    */
    const saniye = Math.max(0, TUR_SURESI - YANLIS_CEZASI * ozet.yanlis)
    setGecmis((onceki) =>
      [...onceki, { tarih: bugun(), oyun: id, saniye, dogru: ozet.dogru }].slice(
        -OYUN_GECMIS_SINIRI,
      ),
    )
  }

  // Donanım geri tuşu. Oyun katmanı bunu kaydetmiyordu: oyunun içindeyken geri
  // basmak arkadaki sekmeyi değiştiriyor, oyun açık kalıyordu.
  useGeriKatmani(secilenOyun !== null && bankaTuru === null, () => setSecilenOyun(null))
  useGeriKatmani(secilenDers !== null, () => setSecilenDers(null))

  const oyunuKapat = () => {
    if (bankaTuru !== null) onBankaTuruBitti()
    else setSecilenOyun(null)
  }

  /** Banka turunda oyunun havuzu bankadaki sorularla sınırlanıyor. */
  const bankaSorulari = bankaTuru === null ? [] : banka.filter((k) => k.soru.oyun === bankaTuru)

  return (
    <div>
      <header className="px-0.5 pt-1">
        <p className="text-[11px] font-black tracking-[0.2em] text-ikincil">RABİ</p>
        <h1 className="mt-1 font-display text-[27px] font-extrabold tracking-tight">
          Oyunlar 🎮
        </h1>
        <p className="mt-1 text-[13.5px] font-medium text-muted-foreground">
          Bir dakikalık turlarla bilgi tazele.
        </p>
      </header>

      <BankaDestesi
        toplam={banka.length}
        dagilim={dagilim}
        onAc={onBankayaGit}
        className="mt-4"
      />

      {secilenDers === null ? (
        <>
          <h2 className="mt-5 mb-3 px-0.5 font-display text-lg font-extrabold tracking-tight">
            Dersler
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {doluDersler().map((ders, sira, liste) => {
              const aile = AILE[ders.aile]
              const oyunlar = dersinOyunlari(ders.id)
              const oynanan = oyunlar.reduce(
                (t, o) => t + istatistikAl(kayitlar, o.id).oynananTur,
                0,
              )
              // Tek sayıda ders varsa sonuncusu iki sütunu kaplıyor; yoksa
              // ızgarada yanı boş bir kart kalıyordu.
              const genis = liste.length % 2 === 1 && sira === liste.length - 1

              return (
                <button
                  key={ders.id}
                  type="button"
                  onClick={() => setSecilenDers(ders.id)}
                  className={cn(
                    'rounded-2xl p-4 text-left transition active:brightness-[0.97]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    aile.zemin,
                    genis
                      ? 'col-span-2 flex items-center gap-3.5'
                      : 'flex min-h-[150px] flex-col',
                  )}
                >
                  <span
                    className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[15px] bg-white/80 text-[23px] leading-none"
                    aria-hidden
                  >
                    {ders.ikon}
                  </span>

                  <span className={cn('min-w-0', genis ? 'flex-1' : 'mt-2.5')}>
                    <span className="block font-display text-[16.5px] font-extrabold leading-[1.15] tracking-tight text-foreground">
                      {ders.ad}
                    </span>
                    <span className="mt-1.5 block text-[12.5px] font-medium leading-snug text-foreground/60">
                      {ders.aciklama}
                    </span>
                    <span className={cn('mt-1.5 block text-[11.5px] font-bold', aile.yazi)}>
                      {oyunlar.length} oyun
                      {oynanan > 0 && <> · {oynanan} tur</>}
                    </span>
                  </span>

                  <span
                    className={cn(
                      'grid h-8 w-8 shrink-0 place-items-center rounded-full text-white',
                      aile.ok,
                      genis ? '' : 'mt-auto self-end',
                    )}
                    aria-hidden
                  >
                    <OkSimgesi />
                  </span>
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <>
          <div className="mt-5 mb-3 flex items-center gap-2 px-0.5">
            <button
              type="button"
              onClick={() => setSecilenDers(null)}
              aria-label="Derslere dön"
              className="-ml-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground transition active:bg-muted"
            >
              <GeriSimgesi />
            </button>
            <h2 className="font-display text-lg font-extrabold tracking-tight">
              {dersBul(secilenDers).ad}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {dersinOyunlari(secilenDers).map((oyun, sira, liste) => {
              const istatistik = istatistikAl(kayitlar, oyun.id)
              const aile = AILE[dersBul(oyun.ders).aile]
              const [ustSatir, altSatir] = BASLIK_SATIRLARI[oyun.id]
              // Tek sayıda oyun varsa sonuncusu iki sütunu birden kaplıyor;
              // yoksa ızgarada boş bir hücre kalırdı. Yatay düzen aynı kartın
              // geniş hâli.
              const genis = liste.length % 2 === 1 && sira === liste.length - 1

              return (
                <button
                  key={oyun.id}
                  type="button"
                  onClick={() => {
                    // Ses dosyaları tanıtım açılırken çözülüyor; oyun başlayınca
                    // yüklenseydi ilk cevabın sesi geç gelirdi. Dokunma aynı
                    // zamanda AudioContext'i açan kullanıcı etkileşimi oluyor.
                    sesleriHazirla(sesAcik)
                    setSecilenOyun(oyun.id)
                  }}
                  className={cn(
                    'relative rounded-2xl p-4 text-left transition active:brightness-[0.97]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    aile.zemin,
                    genis ? 'col-span-2 flex items-center gap-3.5' : 'flex min-h-[186px] flex-col',
                  )}
                >
                  {istatistik.enIyiDogru > 0 && (
                    <span
                      className={cn(
                        // Zemin `bg-card`: koyu temada aile rengi açılıyor, beyaz
                        // hapın üstünde okunmuyordu. Kart zemini iki temada da
                        // yazının karşıt tarafında kalıyor.
                        'rakam rounded-full bg-card/85 px-2.5 py-1 text-[10.5px] font-extrabold',
                        aile.yazi,
                        genis ? 'order-3 shrink-0' : 'absolute right-3.5 top-3.5',
                      )}
                    >
                      Rekor {istatistik.enIyiDogru}
                    </span>
                  )}

                  <span
                    className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[15px] bg-white/80 text-[23px] leading-none"
                    aria-hidden
                  >
                    {oyun.ikon}
                  </span>

                  <span className={cn('min-w-0', genis ? 'flex-1' : 'mt-2.5')}>
                    <span className="block font-display text-[16.5px] font-extrabold leading-[1.15] tracking-tight text-foreground">
                      {ustSatir}
                      {genis ? ' ' : <br />}
                      {altSatir}
                    </span>
                    <span className="mt-1.5 block text-[12.5px] font-medium leading-snug text-foreground/60">
                      {oyun.kisaAciklama}
                    </span>
                  </span>

                  <span
                    className={cn(
                      'grid h-8 w-8 shrink-0 place-items-center rounded-full text-white',
                      aile.ok,
                      genis ? 'order-4' : 'mt-auto self-end',
                    )}
                    aria-hidden
                  >
                    <OkSimgesi />
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {acikOyun === 'yazim' && (
        <YazimOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'yazim')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar) => turBitti('yazim', ozet, cevaplar)}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'ses' && (
        <SesOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'ses')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar) => turBitti('ses', ozet, cevaplar)}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'oge' && (
        <OgeOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'oge')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar) => turBitti('oge', ozet, cevaplar)}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'soz' && (
        <SozOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'soz')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar) => turBitti('soz', ozet, cevaplar)}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'islem' && (
        <IslemOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'islem')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar) => turBitti('islem', ozet, cevaplar)}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'bolunme' && (
        <BolunmeOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'bolunme')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar) => turBitti('bolunme', ozet, cevaplar)}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'edebiyat' && (
        <EdebiyatOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'edebiyat')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar) => turBitti('edebiyat', ozet, cevaplar)}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
    </div>
  )
}

/**
 * Oyun Bankası girişi — bir kart destesi.
 *
 * Liste satırı değil: arkadan sırıtan iki katman üç oyunun kendi renkleri,
 * yani deste onların sorularından oluşuyor. Sayı kırmızı bir rozet değil,
 * kartın en büyük yazısı — rozet uyarı gibi duruyordu, buradaki bilgi.
 */
function BankaDestesi({
  toplam,
  dagilim,
  onAc,
  className,
}: {
  toplam: number
  dagilim: Record<OyunId, number>
  onAc: () => void
  className?: string
}) {
  const cipler = [
    { id: 'yazim' as const, ikon: '✍️', ad: 'yazım', zemin: 'bg-yzm', yazi: 'text-yzm-koyu' },
    { id: 'islem' as const, ikon: '🧮', ad: 'işlem', zemin: 'bg-isl', yazi: 'text-isl-koyu' },
    { id: 'edebiyat' as const, ikon: '📚', ad: 'edebiyat', zemin: 'bg-edb', yazi: 'text-edb-koyu' },
  ].filter((c) => dagilim[c.id] > 0)

  return (
    <div className={cn('relative pb-4', className)}>
      {/* Destenin altındaki iki kart. Yalnızca dolu bankada çiziliyor: boş
          bankada arkadan sırıtan katmanlar "içinde bir şey var" der, yalan olur. */}
      {toplam > 0 && (
        <>
          <span
            aria-hidden
            className="absolute inset-x-2.5 bottom-0 top-4 -rotate-[1.4deg] rounded-2xl bg-edb"
          />
          <span
            aria-hidden
            className="absolute inset-x-1.5 bottom-2 top-2 rounded-2xl bg-isl"
          />
        </>
      )}

      <button
        type="button"
        onClick={onAc}
        className={cn(
          'golge-kart relative flex w-full flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-left transition',
          'active:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        )}
      >
        <span className="flex items-center gap-3">
          <span className="min-w-[56px] rounded-2xl bg-ikincil-soft px-2.5 py-2 text-center">
            <span className="rakam block font-display text-2xl font-black leading-none tracking-tight text-ikincil">
              {toplam}
            </span>
            <span className="mt-1 block text-[9.5px] font-extrabold uppercase tracking-wider text-ikincil">
              soru
            </span>
          </span>

          <span className="min-w-0 flex-1">
            <span className="block font-display text-base font-extrabold tracking-tight">
              Oyun Bankası
            </span>
            <span className="mt-0.5 block text-[12.5px] font-medium leading-snug text-muted-foreground">
              {toplam > 0 ? 'Karıştırdıklarını tekrar oyna' : 'Karıştırdığın sorular burada birikir'}
            </span>
          </span>

          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ikincil text-white"
            aria-hidden
          >
            <OkSimgesi />
          </span>
        </span>

        {cipler.length > 0 && (
          <span className="flex gap-1.5">
            {cipler.map((cip) => (
              <span
                key={cip.id}
                className={cn(
                  'rakam flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold',
                  cip.zemin,
                  cip.yazi,
                )}
              >
                <span aria-hidden>{cip.ikon}</span>
                {dagilim[cip.id]} <em className="not-italic font-semibold">{cip.ad}</em>
              </span>
            ))}
          </span>
        )}
      </button>
    </div>
  )
}

function GeriSimgesi() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 5-7 7 7 7" />
    </svg>
  )
}

function OkSimgesi() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={17}
      height={17}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}
