'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FileSpreadsheet, Mic, RotateCcw, X } from 'lucide-react'
import type { Ayarlar, Sablon, SoruKaydi } from '@/lib/types'
import { dersRengi } from '@/lib/banka'
import { sadelestir } from '@/lib/dersler'
import type { KonuDersId } from '@/lib/konu/tip'
import { secilebilirSablonlar } from '@/lib/sablonlar'
import { seviyeSablonu, varsayilanSeviyeSinifi } from '@/lib/seviye-tespit'
import { dinle, sesIzniIste, sesTanimaDurumu } from '@/lib/ses-tanima'
import { sesliMetniCoz, type SesliDeneme, type SesliSoru } from '@/lib/sesli-giris'
import { useGeriKatmani } from '@/lib/geri'
import { useAsagiKaydirKapat } from '@/lib/asagi-kaydir'
import { cn } from '@/lib/utils'
import { Buton, Not, useKapatmaOnayi } from '@/components/ui'
import { BosKutusu, HataNotu, SayiKutusu, sayiya } from '@/components/ekranlar/soru-takibi'

export type DenemeBaslangici = {
  sablonId: string
  girisler: Record<string, { dogru: string; yanlis: string }>
}

type Durum =
  | { ad: 'hazirlaniyor' }
  | { ad: 'izin-yok' }
  | { ad: 'dinliyor'; araMetin: string; bitiriliyor: boolean }
  | { ad: 'hata'; mesaj: string }
  | {
      ad: 'onay'
      sorular: SesliSoru[]
      deneme: SesliDeneme | null
      anlasilmayan: string[]
      /** Çözümleyiciden ilk çıktığında da boş muydu, yoksa kullanıcı satırları ✕ ile mi sildi. */
      baslangictaBos: boolean
    }

function soruDersAilesi(ders: string): KonuDersId | null {
  const bankaAilesi = dersRengi(ders)
  if (bankaAilesi) return bankaAilesi
  const sade = sadelestir(ders)
  if (sade === 'yabanci dil' || sade === 'ingilizce') return 'ingilizce'
  return null
}

/** Ders rozeti tonları (`--konu-<ders>`); haritada rengi olmayan dersler nötr kalır. */
function dersTonlari(ders: string) {
  const aile = soruDersAilesi(ders)
  if (!aile) {
    return {
      zemin: 'var(--muted)',
      kenar: 'var(--border)',
      koyu: 'var(--foreground)',
    }
  }
  return {
    zemin: `var(--konu-${aile})`,
    kenar: `var(--konu-${aile}-kenar)`,
    koyu: `var(--konu-${aile}-koyu)`,
  }
}

function netMetniYaz(deger: number): string {
  return String(deger).replace('.', ',')
}

function denemedenBaslangic(deneme: SesliDeneme): DenemeBaslangici {
  const girisler: Record<string, { dogru: string; yanlis: string }> = {}
  for (const d of deneme.dersler) {
    girisler[d.dersId] = { dogru: String(d.dogru), yanlis: String(d.yanlis) }
  }
  return { sablonId: deneme.sablonId, girisler }
}

/**
 * Soru Takibi'nin "Sesle anlat" alt sayfası.
 *
 * Mikrofon açılıp konuşma metne çevrilir, `sesliMetniCoz` ile ayrıştırılır ve
 * kullanıcı onaylamadan yerel depoya hiçbir kayıt yazılmaz (`docs/kurallar/sesli-giris.md`).
 */
export function SesliGirisSayfasi({
  sablonlar,
  ayarlar,
  gunEtiketi,
  onKapat,
  onSorulariKaydet,
  onDenemeAc,
}: {
  sablonlar: Sablon[]
  ayarlar: Ayarlar
  gunEtiketi: string
  onKapat: () => void
  onSorulariKaydet: (sorular: SoruKaydi[]) => void
  onDenemeAc?: (baslangic: DenemeBaslangici) => void
}) {
  const [durum, setDurum] = useState<Durum>({ ad: 'hazirlaniyor' })
  /** Onay ekranında sayılarını düzeltmek için açılmış ders satırı. */
  const [acikDers, setAcikDers] = useState<string | null>(null)

  const etkinRef = useRef(true)
  const oturumSurumuRef = useRef(0)
  const oturumRef = useRef<{ durdur: () => void } | null>(null)
  const sonAraMetinRef = useRef('')

  /*
    Seviye tespit tür satırında tek kimlik (`okul`) taşıyor ama Yeni Deneme
    ekranında öğrencinin sınıfına/alanına ait ders listesini açıyor. Burada da
    aynı ders listesini veriyoruz ki 10–12. sınıf dersleri doğru eşleşsin ve
    aktarılan `dersId`ler Yeni Deneme'deki şablonla bire bir örtüşsün.
  */
  const cozucuSablonlari = useMemo(() => {
    const liste = secilebilirSablonlar(sablonlar, ayarlar.buYilSinif, ayarlar.puanTuru)
    const sinif = varsayilanSeviyeSinifi(ayarlar.buYilSinif)
    const alan = ayarlar.puanTuru ?? 'say'
    const guncelSeviye = seviyeSablonu(sablonlar, sinif, alan)
    return liste.map((s) => (s.id === 'okul' ? { ...guncelSeviye, id: 'okul' } : s))
  }, [sablonlar, ayarlar.buYilSinif, ayarlar.puanTuru])

  const cozucuRef = useRef({
    sablonlar: cozucuSablonlari,
    varsayilanSablonId: ayarlar.varsayilanSablonId,
  })
  cozucuRef.current = {
    sablonlar: cozucuSablonlari,
    varsayilanSablonId: ayarlar.varsayilanSablonId,
  }

  const oturumuTemizle = useCallback(() => {
    oturumSurumuRef.current += 1
    oturumRef.current?.durdur()
    oturumRef.current = null
  }, [])

  const kapat = useCallback(() => {
    oturumuTemizle()
    onKapat()
  }, [oturumuTemizle, onKapat])

  useGeriKatmani(true, kapat)
  const kaydir = useAsagiKaydirKapat(kapat)

  const dinlemeyiBaslat = useCallback(async () => {
    oturumuTemizle()
    const buSurum = oturumSurumuRef.current
    sonAraMetinRef.current = ''
    setAcikDers(null)
    setDurum({ ad: 'hazirlaniyor' })

    const uygunluk = await sesTanimaDurumu()
    if (!etkinRef.current || oturumSurumuRef.current !== buSurum) return

    if (uygunluk === 'yok') {
      setDurum({ ad: 'hata', mesaj: 'Cihazda ses tanıma hizmeti bulunamadı.' })
      return
    }

    if (uygunluk === 'izin-yok') {
      const verildi = await sesIzniIste()
      if (!etkinRef.current || oturumSurumuRef.current !== buSurum) return
      if (!verildi) {
        setDurum({ ad: 'izin-yok' })
        return
      }
    }

    setDurum({ ad: 'dinliyor', araMetin: '', bitiriliyor: false })

    const oturum = dinle({
      onKismi: (metin) => {
        if (!etkinRef.current || oturumSurumuRef.current !== buSurum) return
        sonAraMetinRef.current = metin
        setDurum((onceki) =>
          onceki.ad === 'dinliyor' ? { ...onceki, araMetin: metin } : onceki,
        )
      },
    })
    oturumRef.current = oturum

    try {
      const bitenMetin = await oturum.bitti
      if (!etkinRef.current || oturumSurumuRef.current !== buSurum) return
      oturumRef.current = null
      const birlesik = bitenMetin.trim() || sonAraMetinRef.current.trim()
      const cozum = sesliMetniCoz(birlesik, cozucuRef.current)
      setDurum({
        ad: 'onay',
        sorular: cozum.sorular,
        deneme: cozum.deneme,
        anlasilmayan: cozum.anlasilmayan,
        baslangictaBos: cozum.sorular.length === 0 && cozum.deneme === null,
      })
    } catch (yakalanan) {
      if (!etkinRef.current || oturumSurumuRef.current !== buSurum) return
      oturumRef.current = null
      const mesaj = yakalanan instanceof Error ? yakalanan.message : 'Ses anlaşılamadı, tekrar dene.'
      if (mesaj.toLocaleLowerCase('tr-TR').includes('izin')) {
        setDurum({ ad: 'izin-yok' })
        return
      }
      if (mesaj.toLocaleLowerCase('tr-TR').includes('anlaşılamadı')) {
        setDurum({
          ad: 'onay',
          sorular: [],
          deneme: null,
          anlasilmayan: [],
          baslangictaBos: true,
        })
        return
      }
      setDurum({ ad: 'hata', mesaj })
    }
  }, [oturumuTemizle])

  useEffect(() => {
    etkinRef.current = true
    void dinlemeyiBaslat()
    return () => {
      etkinRef.current = false
      oturumuTemizle()
    }
  }, [dinlemeyiBaslat, oturumuTemizle])

  const dinlemeyiBitir = () => {
    if (durum.ad !== 'dinliyor' || durum.bitiriliyor) return
    setDurum({ ...durum, bitiriliyor: true })
    oturumRef.current?.durdur()
  }

  const soruKaldir = (ders: string) => {
    setDurum((onceki) =>
      onceki.ad === 'onay'
        ? { ...onceki, sorular: onceki.sorular.filter((s) => s.ders !== ders) }
        : onceki,
    )
    if (acikDers === ders) setAcikDers(null)
  }

  const soruSayisiGuncelle = (
    ders: string,
    alan: 'toplam' | 'dogru' | 'yanlis',
    ham: string,
  ) => {
    const deger = Number(sayiya(ham)) || 0
    setDurum((onceki) =>
      onceki.ad === 'onay'
        ? {
            ...onceki,
            sorular: onceki.sorular.map((s) => (s.ders === ders ? { ...s, [alan]: deger } : s)),
          }
        : onceki,
    )
  }

  const denemeKaldir = () => {
    setDurum((onceki) => (onceki.ad === 'onay' ? { ...onceki, deneme: null } : onceki))
  }

  // Onay ekranında okunan satır varken ✕ ile çıkmak emeği sileceği için sorar.
  const kapatmaOnayi = useKapatmaOnayi({
    aciklama: 'Anlatılan sorular ve deneme bilgileri kaydedilmeden pencere kapanır.',
  })
  const kaydedilecekVar =
    durum.ad === 'onay' && (durum.sorular.length > 0 || durum.deneme !== null)

  const soruHatasiVar =
    durum.ad === 'onay' &&
    durum.sorular.some((s) => s.toplam <= 0 || s.dogru + s.yanlis > s.toplam)

  const onaylaVeIlerle = () => {
    if (durum.ad !== 'onay' || soruHatasiVar) return
    const { sorular, deneme } = durum
    if (sorular.length === 0 && deneme === null) return

    if (sorular.length > 0) {
      onSorulariKaydet(sorular)
    }
    kapat()
    if (deneme !== null && onDenemeAc) {
      onDenemeAc(denemedenBaslangic(deneme))
    }
  }

  const denemeSablonu =
    durum.ad === 'onay' && durum.deneme
      ? (cozucuSablonlari.find((s) => s.id === durum.deneme!.sablonId) ??
        sablonlar.find((s) => s.id === durum.deneme!.sablonId) ??
        null)
      : null

  const anaButonMetni =
    durum.ad === 'onay'
      ? durum.sorular.length > 0 && durum.deneme !== null
        ? 'Kaydet ve denemeye geç'
        : durum.sorular.length > 0
          ? 'Kaydet'
          : 'Denemeye geç'
      : ''

  return (
    <div
      className="katman-zemin tablet-orta-zemin fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={kapat}
    >
      {kapatmaOnayi.pencere}
      <div
        ref={kaydir}
        role="dialog"
        aria-modal="true"
        aria-label={durum.ad === 'onay' ? 'Bugün yaptıkların' : 'Sesle anlat'}
        className="alt-pencere-girisi tablet-orta-pencere max-h-[82%] w-full max-w-md overflow-y-auto rounded-t-[26px] bg-card px-4 pt-3 pb-[calc(1.5rem+var(--guvenli-alt))] tablet:px-6 tablet:pt-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tablet-orta-tutamac mx-auto mb-3 h-1 w-[42px] rounded-full bg-border" />
        <div className="mb-3.5 flex items-center gap-2.5">
          <p className="font-display text-lg font-extrabold tracking-tight">
            {durum.ad === 'onay' ? 'Bugün yaptıkların' : 'Sesle anlat'}
          </p>
          <p className="ml-auto text-[12.5px] font-bold text-muted-foreground/70">{gunEtiketi}</p>
          <button
            type="button"
            onClick={() => (kaydedilecekVar ? kapatmaOnayi.sor(kapat) : kapat())}
            aria-label="Kapat"
            className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground active:bg-muted"
          >
            <X size={16} strokeWidth={2.4} aria-hidden />
          </button>
        </div>

        {(durum.ad === 'hazirlaniyor' || durum.ad === 'dinliyor') && (
          <div>
            <p className="text-[13.5px] leading-relaxed text-muted-foreground">
              <strong className="font-bold text-foreground">Bugün ne çözdün?</strong> Ör: 80
              matematik, 65 kimya sorusu çözdüm, TYT denemesinde Türkçe 32 doğru 6 yanlış
            </p>

            <div className="my-6 flex flex-col items-center justify-center">
              <div className="relative flex size-24 items-center justify-center">
                {durum.ad === 'dinliyor' && !durum.bitiriliyor && (
                  <span
                    aria-hidden
                    className="ses-nabiz pointer-events-none absolute inset-1 rounded-full bg-primary-parlak"
                  />
                )}
                <button
                  type="button"
                  onClick={dinlemeyiBitir}
                  disabled={durum.ad !== 'dinliyor' || durum.bitiriliyor}
                  aria-label="Dinlemeyi bitir"
                  className="relative inline-flex size-20 items-center justify-center rounded-full bg-primary-parlak text-white shadow-[0_8px_20px_rgba(217,98,47,0.3)] transition active:scale-95 disabled:opacity-75"
                >
                  <Mic size={32} strokeWidth={2.3} aria-hidden />
                </button>
              </div>

              <div
                aria-live="polite"
                className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-muted/60 px-3.5 py-2.5 text-center"
              >
                {durum.ad === 'dinliyor' && durum.araMetin.trim() !== '' ? (
                  <p className="text-sm font-semibold leading-relaxed text-foreground">
                    {durum.araMetin}
                  </p>
                ) : (
                  <p className="text-[13px] font-medium text-muted-foreground">
                    {durum.ad === 'hazirlaniyor'
                      ? 'Mikrofon hazırlanıyor…'
                      : durum.bitiriliyor
                        ? 'Söylediklerin çözümleniyor…'
                        : 'Dinleniyor, konuşmaya başlayabilirsin…'}
                  </p>
                )}
              </div>
            </div>

            <Buton
              onClick={dinlemeyiBitir}
              disabled={durum.ad !== 'dinliyor' || durum.bitiriliyor}
              className="h-[52px] w-full rounded-[17px] text-base"
            >
              Bitir
            </Buton>
          </div>
        )}

        {durum.ad === 'izin-yok' && (
          <div>
            <Not tur="uyari">
              Mikrofon izni verilmedi. Telefonun ayarlarından Rabi&apos;ye mikrofon izni
              verebilirsin.
            </Not>
            <Buton
              bicim="ikincil"
              onClick={() => void dinlemeyiBaslat()}
              className="mt-4 h-[50px] w-full rounded-[16px]"
            >
              <RotateCcw size={17} aria-hidden />
              Tekrar dene
            </Buton>
          </div>
        )}

        {durum.ad === 'hata' && (
          <div>
            <Not tur="tehlike">{durum.mesaj}</Not>
            <Buton
              bicim="ikincil"
              onClick={() => void dinlemeyiBaslat()}
              className="mt-4 h-[50px] w-full rounded-[16px]"
            >
              <RotateCcw size={17} aria-hidden />
              Tekrar konuş
            </Buton>
          </div>
        )}

        {durum.ad === 'onay' && (
          <div>
            {durum.sorular.length === 0 && durum.deneme === null ? (
              <div>
                <Not>
                  {durum.baslangictaBos
                    ? 'Bir şey anlayamadım. Ders adıyla ve sayıyla tekrar dene.'
                    : 'Kaydedilecek satır kalmadı. Yeniden anlatabilirsin.'}
                </Not>
                {durum.anlasilmayan.length > 0 && (
                  <p className="mt-2.5 px-0.5 text-xs leading-relaxed text-muted-foreground/80">
                    Şunları anlayamadım: {durum.anlasilmayan.join(', ')}
                  </p>
                )}
                <Buton
                  bicim="ikincil"
                  onClick={() => void dinlemeyiBaslat()}
                  className="mt-4 h-[50px] w-full rounded-[16px]"
                >
                  <RotateCcw size={17} aria-hidden />
                  Tekrar konuş
                </Buton>
              </div>
            ) : (
              <div>
                {durum.sorular.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between px-0.5">
                      <span className="text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Sorular
                      </span>
                      <span className="text-[11.5px] font-semibold text-muted-foreground/75">
                        Düzeltmek için satıra dokun
                      </span>
                    </div>

                    {durum.sorular.map((satir) => {
                      const ton = dersTonlari(satir.ders)
                      const acik = acikDers === satir.ders
                      const asim = satir.dogru + satir.yanlis > satir.toplam
                      const sifir = satir.toplam <= 0
                      const bos = Math.max(0, satir.toplam - satir.dogru - satir.yanlis)

                      return (
                        <div
                          key={satir.ders}
                          className={cn(
                            'rounded-[18px] border border-border bg-muted/35 p-2.5 transition-colors',
                            (asim || sifir) && 'border-danger/50',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-expanded={acik}
                              onClick={() => setAcikDers(acik ? null : satir.ders)}
                              className="flex min-w-0 flex-1 items-center gap-2 text-left"
                            >
                              <span
                                className="truncate rounded-[10px] border px-2.5 py-1 font-display text-[13px] font-extrabold tracking-tight"
                                style={{
                                  backgroundColor: ton.zemin,
                                  borderColor: ton.kenar,
                                  color: ton.koyu,
                                }}
                              >
                                {satir.ders}
                              </span>
                              <span className="rakam ml-auto flex shrink-0 items-baseline gap-2 pr-1">
                                <span className="font-display text-[14.5px] font-extrabold text-foreground">
                                  {satir.toplam} soru
                                </span>
                                <span
                                  className={cn(
                                    'text-xs font-extrabold',
                                    satir.dogru > 0 ? 'text-success' : 'text-muted-foreground/60',
                                  )}
                                >
                                  {satir.dogru}D
                                </span>
                                <span
                                  className={cn(
                                    'text-xs font-extrabold',
                                    satir.yanlis > 0 ? 'text-danger' : 'text-muted-foreground/60',
                                  )}
                                >
                                  {satir.yanlis}Y
                                </span>
                              </span>
                            </button>

                            <button
                              type="button"
                              aria-label={`${satir.ders} satırını kaldır`}
                              onClick={() => soruKaldir(satir.ders)}
                              className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[10px] text-muted-foreground/70 active:bg-danger-soft active:text-danger"
                            >
                              <X size={15} aria-hidden />
                            </button>
                          </div>

                          {acik && (
                            <div className="acilir-giris mt-2.5 border-t border-border pt-2.5">
                              <div className="grid grid-cols-4 gap-2">
                                <SayiKutusu
                                  etiket="Toplam"
                                  deger={satir.toplam === 0 ? '' : String(satir.toplam)}
                                  onDegis={(ham) => soruSayisiGuncelle(satir.ders, 'toplam', ham)}
                                  ariaEtiket={`${satir.ders} toplam soru`}
                                />
                                <SayiKutusu
                                  etiket="Doğru"
                                  ton="dogru"
                                  deger={satir.dogru === 0 ? '' : String(satir.dogru)}
                                  onDegis={(ham) => soruSayisiGuncelle(satir.ders, 'dogru', ham)}
                                  ariaEtiket={`${satir.ders} doğru`}
                                />
                                <SayiKutusu
                                  etiket="Yanlış"
                                  ton="yanlis"
                                  deger={satir.yanlis === 0 ? '' : String(satir.yanlis)}
                                  onDegis={(ham) => soruSayisiGuncelle(satir.ders, 'yanlis', ham)}
                                  ariaEtiket={`${satir.ders} yanlış`}
                                />
                                <BosKutusu deger={bos} hata={asim} />
                              </div>
                            </div>
                          )}

                          {asim && <HataNotu />}
                          {!asim && sifir && (
                            <p className="mt-2 text-xs font-bold leading-snug text-danger">
                              Toplam soru sayısını gir ya da satırı kaldır.
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {durum.deneme !== null && (
                  <div className={cn(durum.sorular.length > 0 && 'mt-3.5')}>
                    <span className="mb-1.5 block px-0.5 text-[11.5px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Deneme
                    </span>
                    <div className="rounded-[18px] border border-primary/25 bg-primary-soft/45 p-3">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet size={17} className="shrink-0 text-primary" aria-hidden />
                        <p className="min-w-0 flex-1 truncate font-display text-[15px] font-extrabold tracking-tight text-foreground">
                          {denemeSablonu?.ad ?? 'Deneme'}
                        </p>
                        <button
                          type="button"
                          aria-label="Denemeyi kaldır"
                          onClick={denemeKaldir}
                          className="-mr-1 inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[10px] text-muted-foreground/70 active:bg-danger-soft active:text-danger"
                        >
                          <X size={15} aria-hidden />
                        </button>
                      </div>

                      {durum.deneme.dersler.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {durum.deneme.dersler.map((okunan) => {
                            const dersAdi =
                              denemeSablonu?.dersler.find((d) => d.id === okunan.dersId)?.ad ??
                              okunan.dersId
                            return (
                              <span
                                key={okunan.dersId}
                                className="rakam inline-flex items-center gap-1 rounded-[10px] border border-border bg-card px-2.5 py-1 text-xs font-bold text-foreground"
                              >
                                <span>{dersAdi}</span>
                                <span className="text-success">{okunan.dogru}D</span>
                                <span className="text-danger">{okunan.yanlis}Y</span>
                              </span>
                            )
                          })}
                        </div>
                      ) : durum.deneme.toplamNet !== null ? (
                        <p className="rakam mt-1.5 text-[13px] font-semibold text-muted-foreground">
                          {netMetniYaz(durum.deneme.toplamNet)} net — ders ders girmen gerek
                        </p>
                      ) : (
                        <p className="mt-1.5 text-[13px] font-semibold text-muted-foreground">
                          Ders ders girmen gerek
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {durum.anlasilmayan.length > 0 && (
                  <p className="mt-3 px-0.5 text-xs leading-relaxed text-muted-foreground/80">
                    Şunları anlayamadım: {durum.anlasilmayan.join(', ')}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <Buton
                    bicim="ikincil"
                    onClick={() => void dinlemeyiBaslat()}
                    className="h-[52px] shrink-0 rounded-[16px] px-3.5 text-sm"
                  >
                    <RotateCcw size={16} aria-hidden />
                    Tekrar konuş
                  </Buton>
                  <Buton
                    onClick={onaylaVeIlerle}
                    disabled={soruHatasiVar}
                    className="h-[52px] min-w-0 flex-1 rounded-[16px] px-3 text-[14.5px] leading-tight"
                  >
                    {anaButonMetni}
                  </Buton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
