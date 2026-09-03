'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Check, ScanLine, X } from 'lucide-react'
import { Alan, Buton, Cip, Etiket, Kart } from '@/components/ui'
import { katsayiYaz, net, netYaz, sonucGecerliMi, yuvarla } from '@/lib/hesap'
import { toplamSoru } from '@/lib/sablonlar'
import {
  ORNEK_YAZIM,
  ORNEK_YAZIM_BOS,
  denemeyiCoz,
  okumaPuani,
  sablonOnerisi,
} from '@/lib/deneme-okuma'
import { kagidiOku, okumaVarMi } from '@/lib/deneme-ocr'
import type { SatirOkuma } from '@/lib/kagit-oku'
import { bugun, cn, yeniId } from '@/lib/utils'
import type { Deneme, Sablon } from '@/lib/types'

type Giris = { dogru: string; yanlis: string }

function bosGirisler(sablon: Sablon): Record<string, Giris> {
  return Object.fromEntries(sablon.dersler.map((d) => [d.id, { dogru: '', yanlis: '' }]))
}

/**
 * Fotoğraftan okunan tek bir metin.
 *
 * `sayac` metnin yanında duruyor çünkü aynı kâğıt iki kez okutulabiliyor:
 * metin aynı kalır, kutuların yeniden dolması gerekir. Yalnızca metne bakan
 * bir bağımlılık listesi ikinci okumada hiçbir şey yapmazdı.
 */
type Okuma = { metin: string; satirlar: SatirOkuma[]; sayac: number }

/**
 * Kullanıcının kâğıt satırlarına verdiği dersler — satır sırası → ders kimliği.
 *
 * Kendi tanıyıcımız (`lib/karakter-tani.ts`) yalnızca rakamları ve D/Y/B'yi
 * biliyor, ders adını okumuyor. O yüzden okuduğu satırlar ders adı olmadan
 * geliyor ve dersi kullanıcı eşliyor. Tahmin edip doldurmak — sıraya bakıp
 * "birinci satır Türkçe olsun" demek — `AGENTS.md`'deki "şüphedeyken
 * doldurmuyor" kuralını çiğnerdi.
 */
type SatirDersleri = Record<number, string>

/**
 * Sayı satırlarını ders adlarıyla birleştirip okunabilir bir metne çevirir.
 *
 * Ayrı bir çözümleyici yazmak yerine metin kuruluyor: `denemeyiCoz`
 * içindeki bütün kurallar (D/Y/B, çıkarım, soru sayısını aşan satırı atlama)
 * o zaman burada da kendiliğinden geçerli oluyor.
 */
function eslesenMetin(sablon: Sablon, okuma: Okuma | null, dersler: SatirDersleri): string {
  if (okuma === null) return ''
  return okuma.satirlar
    .map((satir, sira) => {
      const ders = sablon.dersler.find((d) => d.id === dersler[sira])
      return ders === undefined ? null : `${ders.ad} ${satir.metin}`
    })
    .filter((satir): satir is string => satir !== null)
    .join('\n')
}

/** Okunan metni şablonun kutularına yazar; okunamayan kutular boş kalıyor. */
function okumadanGirisler(
  sablon: Sablon,
  okuma: Okuma | null,
  dersler: SatirDersleri,
): Record<string, Giris> {
  const girisler = bosGirisler(sablon)
  if (okuma === null) return girisler

  const yaz = (metin: string): void => {
    for (const okunan of denemeyiCoz(metin, sablon).okunanlar) {
      girisler[okunan.dersId] = { dogru: String(okunan.dogru), yanlis: String(okunan.yanlis) }
    }
  }

  // Önce ML Kit'in okuduğu metin, sonra kullanıcının elle eşlediği satırlar:
  // ikincisi bir tercih, birincisi bir tahmin — çakışırsa tercih kazanıyor.
  yaz(okuma.metin)
  yaz(eslesenMetin(sablon, okuma, dersler))
  return girisler
}

function sayi(metin: string): number {
  const deger = Number.parseInt(metin, 10)
  return Number.isFinite(deger) && deger > 0 ? deger : 0
}

export function YeniDenemeEkrani({
  sablonlar,
  varsayilanSablonId,
  duzenlenen,
  denemeSayisi,
  onKaydet,
  onVazgec,
}: {
  sablonlar: Sablon[]
  varsayilanSablonId: string
  duzenlenen: Deneme | null
  denemeSayisi: number
  onKaydet: (deneme: Deneme) => void
  onVazgec: () => void
}) {
  const ilkSablon =
    sablonlar.find((s) => s.id === (duzenlenen?.sablonId ?? varsayilanSablonId)) ??
    sablonlar[0]

  const [sablonId, setSablonId] = useState(ilkSablon.id)
  const [tarih, setTarih] = useState(duzenlenen?.tarih ?? bugun())
  const [ad, setAd] = useState(duzenlenen?.ad ?? '')
  const [girisler, setGirisler] = useState<Record<string, Giris>>(() => {
    if (!duzenlenen) return bosGirisler(ilkSablon)
    return Object.fromEntries(
      ilkSablon.dersler.map((d) => {
        const sonuc = duzenlenen.sonuclar.find((s) => s.dersId === d.id)
        return [
          d.id,
          {
            dogru: sonuc ? String(sonuc.dogru) : '',
            yanlis: sonuc ? String(sonuc.yanlis) : '',
          },
        ]
      }),
    )
  })

  /*
    Fotoğraftan okunan metin. Kutuların **kaynağı** bu: şablon değişince metin
    yeni şablona göre yeniden çözülüyor. İki ayrı yerde doldurma olsaydı
    (bir okurken, bir şablon değişince) ikisi zamanla ayrışırdı.
  */
  const [okuma, setOkuma] = useState<Okuma | null>(null)
  /** Örnek yazım kartı — "Okut"a basınca çıkıyor, kamera ondan sonra açılıyor. */
  const [ornekAcik, setOrnekAcik] = useState(false)
  const [okunuyor, setOkunuyor] = useState(false)
  const [okumaHatasi, setOkumaHatasi] = useState(false)
  /** Kâğıt satırlarına verilen dersler; her yeni okumada sıfırlanıyor. */
  const [satirDersleri, setSatirDersleri] = useState<SatirDersleri>({})

  const sablon = sablonlar.find((s) => s.id === sablonId) ?? sablonlar[0]

  // Şablon değişince ders listesi değişir, girişler sıfırlanır — fotoğraf
  // okunmuşsa yeni şablona göre yeniden dolar.
  useEffect(() => {
    if (duzenlenen) return
    setGirisler(okumadanGirisler(sablon, okuma, satirDersleri))
  }, [sablon, duzenlenen, okuma, satirDersleri])

  const satirlar = useMemo(
    () =>
      sablon.dersler.map((ders) => {
        const giris = girisler[ders.id] ?? { dogru: '', yanlis: '' }
        const dogru = sayi(giris.dogru)
        const yanlis = sayi(giris.yanlis)
        // Doğrulama tek yerden: hesap.ts. Ekranda ayrıca kural yazılmıyor ki
        // ikisi zamanla birbirinden ayrışmasın.
        const asim = !sonucGecerliMi({ dersId: ders.id, dogru, yanlis }, ders)
        return {
          ders,
          dogru,
          yanlis,
          bos: Math.max(0, ders.soruSayisi - dogru - yanlis),
          net: net(dogru, yanlis, sablon.yanlisKatsayi),
          asim,
        }
      }),
    [sablon, girisler],
  )

  /** Fotoğraf özeti: kaç ders okundu, hangileri okunamadı, başka şablon uyar mı. */
  const ozet = useMemo(() => {
    if (okuma === null) return null
    const sonuc = denemeyiCoz(
      [okuma.metin, eslesenMetin(sablon, okuma, satirDersleri)].join('\n'),
      sablon,
    )
    return {
      okunanSayisi: sonuc.okunanlar.length,
      atlananlar: sonuc.atlananlar,
      oneri: sablonOnerisi(okuma.metin, sablon, sablonlar),
    }
  }, [okuma, sablon, sablonlar, satirDersleri])

  const okut = async () => {
    setOrnekAcik(false)
    setOkumaHatasi(false)
    setOkunuyor(true)
    const ciktisi = await kagidiOku()
    setOkunuyor(false)
    // Vazgeçene hiçbir şey söylenmiyor: kullanıcı zaten bilerek kapattı.
    if (ciktisi.durum === 'metin') {
      // Eski eşleştirmeler yeni kâğıdın satırlarına ait değil; bırakılsaydı
      // ikinci okumada rastgele derslere yapışırlardı.
      setSatirDersleri({})
      setOkuma((onceki) => ({
        metin: ciktisi.metin,
        satirlar: ciktisi.satirlar,
        sayac: (onceki?.sayac ?? 0) + 1,
      }))
    } else if (ciktisi.durum !== 'vazgecildi') setOkumaHatasi(true)
  }

  /**
   * Kullanıcıya gösterilecek satırlar.
   *
   * İşaretli sayı taşımayanlar eleniyor (`okumaPuani`): ders adının harfleri de
   * tanıyıcıdan geçiyor ve arada bir rakam gibi okunabiliyor. Sayısı olmayan
   * bir satırı derse bağlatmak, kullanıcıdan anlamsız bir seçim istemek olurdu.
   */
  const okunanSatirlar = useMemo(
    () =>
      (okuma?.satirlar ?? [])
        .map((satir, sira) => ({ satir, sira }))
        .filter(({ satir }) => okumaPuani(satir.metin) > 0),
    [okuma],
  )

  const oneri = ozet?.oneri ?? null
  const [hamAcik, setHamAcik] = useState(false)

  const toplamNet = yuvarla(satirlar.reduce((acc, s) => acc + (s.asim ? 0 : s.net), 0))
  const hataliDers = satirlar.find((s) => s.asim)
  const bosMu = satirlar.every((s) => s.dogru === 0 && s.yanlis === 0)

  const girisDegistir = (dersId: string, alan: keyof Giris, deger: string) => {
    const temiz = deger.replace(/[^0-9]/g, '').slice(0, 3)
    setGirisler((onceki) => ({
      ...onceki,
      [dersId]: { ...(onceki[dersId] ?? { dogru: '', yanlis: '' }), [alan]: temiz },
    }))
  }

  const kaydet = () => {
    if (hataliDers || bosMu) return
    onKaydet({
      id: duzenlenen?.id ?? yeniId(),
      sablonId: sablon.id,
      ad: ad.trim() || `${sablon.ad} ${denemeSayisi + 1}`,
      tarih,
      sonuclar: satirlar.map((s) => ({
        dersId: s.ders.id,
        dogru: s.dogru,
        yanlis: s.yanlis,
      })),
    })
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {duzenlenen ? 'Denemeyi Düzenle' : 'Yeni Deneme'}
        </h1>
        <Buton bicim="hayalet" boy="simge" onClick={onVazgec} aria-label="Vazgeç">
          <X size={20} />
        </Buton>
      </div>

      {/* Toplam net — girişler değiştikçe canlı güncellenir */}
      <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-border bg-background/95 px-4 pb-3 backdrop-blur">
        <div className="flex items-baseline justify-between rounded-xl bg-primary-soft px-4 py-3">
          <span className="text-sm font-medium text-muted-foreground">Toplam net</span>
          <span className="font-display text-3xl font-semibold text-primary">
            {netYaz(toplamNet)}
          </span>
        </div>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          {sablon.ad} · {toplamSoru(sablon)} soru · {katsayiYaz(sablon.yanlisKatsayi)}
        </p>
      </div>

      {!duzenlenen && (
        <div className="mb-4">
          <Etiket>Deneme türü</Etiket>
          <div className="flex flex-wrap gap-2">
            {sablonlar.map((s) => (
              <Cip key={s.id} secili={s.id === sablonId} onClick={() => setSablonId(s.id)}>
                {s.ad}
              </Cip>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <Etiket htmlFor="deneme-ad">Deneme adı</Etiket>
          <Alan
            id="deneme-ad"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            placeholder={`${sablon.ad} ${denemeSayisi + 1}`}
          />
        </div>
        <div>
          <Etiket htmlFor="deneme-tarih">Tarih</Etiket>
          <Alan
            id="deneme-tarih"
            type="date"
            value={tarih}
            onChange={(e) => setTarih(e.target.value)}
          />
        </div>
      </div>

      {/*
        Kâğıdı okutma. Düğme yalnızca cihazda görünüyor -- eklentinin web
        karşılığı yok ve çalışmayan bir düğme bozuk bir uygulama demek.

        Basınca kamera **açılmıyor**, önce örnek çıkıyor: okuma "Matematik 38D
        2Y" düzenine göre ayarlandı ve o düzeni bilmeden çekilen fotoğraf
        okunmuyor. Örneği kameradan sonra göstermek, kullanıcıya kâğıdı
        yeniden yazdırmak olurdu.
      */}
      {okumaVarMi() && !duzenlenen && (
        <div className="mb-4">
          <Buton
            bicim="ikincil"
            className="w-full"
            onClick={() => setOrnekAcik((a) => !a)}
            disabled={okunuyor}
          >
            <ScanLine size={18} />
            {okunuyor ? 'Okunuyor…' : 'Kâğıdı okut'}
          </Buton>

          {ornekAcik && (
            <div className="mt-2 rounded-xl border border-border bg-card px-3 py-3">
              <p className="text-[13px] font-bold">Kâğıda şöyle yaz:</p>
              <p className="mt-1.5 rounded-lg bg-muted px-3 py-2 text-center text-[15px] font-extrabold rakam">
                {ORNEK_YAZIM}
              </p>
              <p className="mt-1.5 rounded-lg bg-muted px-3 py-2 text-center text-[15px] font-extrabold rakam">
                {ORNEK_YAZIM_BOS}
              </p>
              <p className="mt-2 text-[12px] leading-snug font-medium text-muted-foreground">
                Her ders ayrı satırda. <strong>D</strong> doğru, <strong>Y</strong> yanlış,
                <strong> B</strong> boş; üçünden ikisini yazman yeter. Ders adını
                kısaltabilirsin (&ldquo;Mat&rdquo;, &ldquo;Fiz&rdquo;) ama tek harf
                yazma &mdash; &ldquo;F&rdquo; hem Fizik hem Felsefe olabiliyor.
                Okunan sayılar kutulara yazılır,{' '}
                <strong>kaydetmeden önce sen kontrol edersin</strong>.
              </p>
              <div className="mt-2.5 flex gap-2">
                <Buton className="flex-1" onClick={okut}>
                  Kamerayı aç
                </Buton>
                <Buton bicim="hayalet" className="flex-1" onClick={() => setOrnekAcik(false)}>
                  Vazgeç
                </Buton>
              </div>
            </div>
          )}

          {okumaHatasi && (
            <p className="mt-2 text-[12px] font-semibold text-danger">
              Fotoğrafı okuyamadım. Işık iyi olsun, kâğıt düz dursun ve bir daha dene.
            </p>
          )}

          {/*
            Kâğıttan okunan sayı satırları ve dersleri.

            Ders adını tanıyıcı okumuyor (yalnızca 0-9 ve D/Y/B biliyor), o
            yüzden eşlemeyi kullanıcı yapıyor. Sıraya bakıp tahmin etmek —
            "birinci satır listenin ilk dersi" — kolay olurdu ama öğrenci
            kâğıda istediği sırayla yazıyor ve yanlış dolmuş bir kutu boş
            kutudan kötü.
          */}
          {okunanSatirlar.length > 0 && (
            <div className="mt-2 rounded-xl border border-border bg-card px-3 py-2.5">
              <p className="text-[12.5px] font-bold">Kâğıtta okunan satırlar</p>
              <p className="mt-0.5 text-[12px] leading-snug font-medium text-muted-foreground">
                Hangi satır hangi ders, sen söyle — kamera sayıları okuyor, ders
                adını okumuyor.
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                {okunanSatirlar.map(({ satir, sira }) => (
                  <div key={sira} className="flex items-center gap-2">
                    <span className="rakam min-w-[72px] rounded-lg bg-muted px-2 py-1.5 text-center text-[14px] font-extrabold">
                      {satir.metin}
                    </span>
                    <select
                      value={satirDersleri[sira] ?? ''}
                      onChange={(olay) =>
                        setSatirDersleri((onceki) => ({ ...onceki, [sira]: olay.target.value }))
                      }
                      className="flex-1 rounded-lg border border-border bg-background px-2 py-1.5 text-[13px] font-semibold"
                    >
                      <option value="">Ders seç…</option>
                      {sablon.dersler.map((ders) => (
                        <option key={ders.id} value={ders.id}>
                          {ders.ad}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ozet && (
            <div className="mt-2 rounded-xl bg-primary-soft px-3 py-2.5">
              <p className="text-[12.5px] font-bold text-primary">
                {ozet.okunanSayisi === 0
                  ? 'Fotoğraftan hiçbir ders okunamadı.'
                  : `Fotoğraftan ${ozet.okunanSayisi} ders okundu.`}
              </p>
              {ozet.atlananlar.length > 0 && (
                <p className="mt-0.5 text-[12px] leading-snug font-medium text-muted-foreground">
                  {ozet.atlananlar.join(', ')} okunamadı — onları sen yaz.
                </p>
              )}
              <p className="mt-0.5 text-[12px] leading-snug font-medium text-muted-foreground">
                Sayıları kontrol et; fotoğraftan okunanlar yanlış olabilir.
              </p>
              {/* Şablon önerisi: seçim kullanıcının, sessizce değiştirilmiyor. */}
              {oneri !== null && (
                <button
                  type="button"
                  onClick={() => setSablonId(oneri.id)}
                  className="mt-1.5 block text-[12.5px] font-extrabold text-ikincil underline underline-offset-2"
                >
                  Bu kâğıt {oneri.ad} gibi duruyor — ona geç
                </button>
              )}

              {/*
                Kameranın gerçekte ne okuduğu.

                Kutular boş kalınca sorunun tanımada mı ayrıştırmada mı olduğu
                anlaşılmıyordu: ikisi de dışarıdan aynı görünüyor. Ham metin
                görünürse kullanıcı "kâğıdımı hiç görmemiş" ile "görmüş ama
                ders adını tanımamış" arasındaki farkı kendi görüyor, ve
                düzeltilecek yer belli oluyor. Kapalı başlıyor: normal
                kullanımda kimsenin bakması gerekmiyor.
              */}
              <button
                type="button"
                onClick={() => setHamAcik((a) => !a)}
                className="mt-1.5 block text-[12px] font-bold text-muted-foreground underline underline-offset-2"
              >
                {hamAcik ? 'Okunan metni gizle' : 'Kameranın okuduğu metni göster'}
              </button>
              {hamAcik && (
                <pre className="mt-1.5 max-h-48 overflow-auto rounded-lg bg-card px-2.5 py-2 text-[11.5px] leading-snug whitespace-pre-wrap">
                  {okuma?.metin.trim() === '' ? '(hiçbir şey okunmadı)' : okuma?.metin}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      <Kart className="p-0">
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
          <span>Ders</span>
          <span className="w-14 text-center">Doğru</span>
          <span className="w-14 text-center">Yanlış</span>
          <span className="w-14 text-right">Net</span>
        </div>

        <ul>
          {satirlar.map((satir) => (
            <li
              key={satir.ders.id}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 border-b border-border px-3 py-2 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{satir.ders.ad}</p>
                <p className="text-xs text-muted-foreground">
                  {satir.ders.soruSayisi} soru · {satir.bos} boş
                </p>
              </div>

              <Alan
                inputMode="numeric"
                aria-label={`${satir.ders.ad} doğru sayısı`}
                value={girisler[satir.ders.id]?.dogru ?? ''}
                onChange={(e) => girisDegistir(satir.ders.id, 'dogru', e.target.value)}
                className={cn(
                  'h-10 w-14 px-0 text-center rakam',
                  satir.asim && 'border-danger text-danger',
                )}
              />
              <Alan
                inputMode="numeric"
                aria-label={`${satir.ders.ad} yanlış sayısı`}
                value={girisler[satir.ders.id]?.yanlis ?? ''}
                onChange={(e) => girisDegistir(satir.ders.id, 'yanlis', e.target.value)}
                className={cn(
                  'h-10 w-14 px-0 text-center rakam',
                  satir.asim && 'border-danger text-danger',
                )}
              />

              <span
                className={cn(
                  'w-14 text-right font-display text-[15px] font-semibold rakam',
                  satir.asim && 'text-danger',
                )}
              >
                {satir.asim ? '—' : netYaz(satir.net)}
              </span>
            </li>
          ))}
        </ul>
      </Kart>

      {hataliDers && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            <strong>{hataliDers.ders.ad}</strong>: doğru + yanlış toplamı{' '}
            {hataliDers.ders.soruSayisi} soruyu aşıyor.
          </span>
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <Buton bicim="ikincil" className="flex-1" onClick={onVazgec}>
          Vazgeç
        </Buton>
        <Buton className="flex-1" onClick={kaydet} disabled={!!hataliDers || bosMu}>
          <Check size={18} />
          Kaydet
        </Buton>
      </div>
      {bosMu && !hataliDers && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Kaydetmek için en az bir derse sonuç gir.
        </p>
      )}
    </div>
  )
}
