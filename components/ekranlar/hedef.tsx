'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronRight, Pencil, School, Search, Trash2 } from 'lucide-react'
import type { Hedef, PuanTuru } from '@/lib/types'
import { siraYaz } from '@/lib/siralama'
import {
  bolumAra,
  bolumBul,
  tahminEt,
  turAdi,
  universiteAra,
  universiteBul,
  type Bolum,
  type Universite,
} from '@/lib/hedef-katalog'
import { SON_VERI_YILI } from '@/lib/puan'
import { Alan, BaslikSatiri, Buton, Cip, Etiket, Kart, Not, Onay } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

const PUAN_TURU_ADI: Record<PuanTuru, string> = {
  say: 'Sayısal',
  ea: 'Eşit Ağırlık',
  soz: 'Sözel',
  dil: 'Dil',
}

export function HedefEkrani({
  hedef,
  setHedef,
  varsayilanTur,
  /** Sıralama ekranından gelen güncel tahmin; yoksa karşılaştırma gösterilmez. */
  guncelSiralama,
}: {
  hedef: Hedef | null
  setHedef: (hedef: Hedef | null) => void
  varsayilanTur: PuanTuru
  guncelSiralama: number | null
}) {
  const [universite, setUniversite] = useState(hedef?.universite ?? '')
  const [bolum, setBolum] = useState(hedef?.bolum ?? '')
  const [puanTuru, setPuanTuru] = useState<PuanTuru>(hedef?.puanTuru ?? varsayilanTur)
  const [tabanPuan, setTabanPuan] = useState(hedef?.tabanPuan?.toString() ?? '')
  const [basariSirasi, setBasariSirasi] = useState(hedef?.basariSirasi?.toString() ?? '')
  const [silmeAcik, setSilmeAcik] = useState(false)

  // Katalog dışı bir hedef kayıtlıysa ekran elle giriş kipinde açılıyor: eski
  // sürümde herkes iki adı serbest metin yazıyordu ve o kayıtlar duruyor.
  const [elleMod, setElleMod] = useState(
    () => hedef !== null && universiteBul(hedef.universite) === null,
  )
  const [duzenleAcik, setDuzenleAcik] = useState(false)
  const [uniArama, setUniArama] = useState('')
  const [bolumArama, setBolumArama] = useState('')

  // Seçim ayrı bir state'te değil, adlardan **türetiliyor**: iki kaynak olsaydı
  // elle yazılan ad ile seçili kayıt birbiriyle çelişebilirdi.
  const secilenUni = useMemo(() => universiteBul(universite), [universite])
  const secilenBolum = useMemo(() => bolumBul(bolum), [bolum])
  const tahmin = useMemo(
    () => (secilenUni && secilenBolum ? tahminEt(secilenUni, secilenBolum) : null),
    [secilenUni, secilenBolum],
  )

  const uniSonuclari = useMemo(() => universiteAra(uniArama), [uniArama])
  const bolumSonuclari = useMemo(
    () => (secilenUni ? bolumAra(secilenUni, bolumArama) : []),
    [secilenUni, bolumArama],
  )

  const universiteSec = (secilen: Universite) => {
    setUniversite(secilen.ad)
    setUniArama('')
    // Yeni üniversitenin açmadığı bir bölüm seçili kalırsa ekran, o
    // üniversitede olmayan bir hedefi kaydedilebilir gösterirdi.
    if (secilenBolum && !bolumAra(secilen, '').some((b) => b.id === secilenBolum.id)) {
      setBolum('')
      setTabanPuan('')
      setBasariSirasi('')
    } else if (secilenBolum) {
      yaz(secilen, secilenBolum)
    }
  }

  const bolumSec = (secilen: Bolum) => {
    setBolum(secilen.ad)
    setBolumArama('')
    if (secilenUni) yaz(secilenUni, secilen)
  }

  /** Seçimden çıkan tahmini kutulara yazar; kullanıcı sonra elle düzeltebiliyor. */
  const yaz = (secilenUniversite: Universite, secilenBolumu: Bolum) => {
    const yeni = tahminEt(secilenUniversite, secilenBolumu)
    setPuanTuru(secilenBolumu.puanTuru)
    // Ondalık ayraç virgül: kutuya nokta yazan bir arayüz, sayfanın geri
    // kalanında virgül gördüğü için kullanıcıya yabancı geliyor.
    setTabanPuan(yeni.tabanPuan.toString().replace('.', ','))
    setBasariSirasi(yeni.siralama.toString())
  }

  const kaydedilebilir = bolum.trim() !== ''

  const kaydet = () => {
    setHedef({
      universite: universite.trim(),
      bolum: bolum.trim(),
      puanTuru,
      tabanPuan: sayiVeyaNull(tabanPuan),
      basariSirasi: sayiVeyaNull(basariSirasi),
    })
  }

  const fark =
    hedef?.basariSirasi != null && guncelSiralama != null
      ? guncelSiralama - hedef.basariSirasi
      : null

  return (
    <div>
      <BaslikSatiri
        baslik="Hedefim"
        aciklama={
          elleMod
            ? 'Bölümünü ve gereken sıralamayı kendin yazıyorsun'
            : 'Üniversiteni ara, bölümünü seç — taban puanı ve sıralamayı Rabi dolduruyor'
        }
      />

      {hedef && (
        <Kart className="mb-4 flex items-center gap-3">
          <Rabi durum={fark !== null && fark <= 0 ? 'kutlama' : 'normal'} boyut={64} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold leading-tight">{hedef.bolum}</p>
            {hedef.universite && (
              <p className="text-sm text-muted-foreground">{hedef.universite}</p>
            )}
            {fark === null ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {hedef.basariSirasi == null
                  ? 'Gereken başarı sırasını girersen ne kadar kaldığını takip ederim.'
                  : 'Deneme ekleyince buraya ne kadar kaldığını yazarım.'}
              </p>
            ) : fark <= 0 ? (
              <p className="mt-1 text-sm font-medium text-success">
                Hedefin içindesin — {siraYaz(Math.abs(fark))} sıra fazlan var.
              </p>
            ) : (
              <p className="mt-1 text-sm font-medium text-primary">
                {siraYaz(fark)} sıra uzaktasın.
              </p>
            )}
          </div>
        </Kart>
      )}

      <Kart className="space-y-4">
        {elleMod ? (
          <ElleGiris
            universite={universite}
            bolum={bolum}
            onUniversite={setUniversite}
            onBolum={setBolum}
          />
        ) : (
          <>
            <div>
              <Etiket htmlFor="hedef-universite-ara">Üniversite</Etiket>
              {secilenUni ? (
                <SecilenSatir
                  baslik={secilenUni.ad}
                  alt={`${secilenUni.sehir} · ${turAdi(secilenUni)}`}
                  onDegistir={() => {
                    setUniversite('')
                    setUniArama('')
                  }}
                />
              ) : (
                <>
                  <AramaAlani
                    id="hedef-universite-ara"
                    deger={uniArama}
                    onDegis={setUniArama}
                    ipucu="Üniversite ya da şehir ara"
                  />
                  <Liste bos="Bu adla üniversite bulamadım.">
                    {uniSonuclari.map((u) => (
                      <SecimSatiri
                        key={u.id}
                        baslik={u.ad}
                        alt={`${u.sehir} · ${turAdi(u)}`}
                        onSec={() => universiteSec(u)}
                      />
                    ))}
                  </Liste>
                </>
              )}
            </div>

            {secilenUni && (
              <div>
                <Etiket htmlFor="hedef-bolum-ara">Bölüm</Etiket>
                {secilenBolum ? (
                  <SecilenSatir
                    baslik={secilenBolum.ad}
                    alt={`${PUAN_TURU_ADI[secilenBolum.puanTuru]} · ${secilenBolum.sure} yıl`}
                    onDegistir={() => setBolum('')}
                  />
                ) : (
                  <>
                    <AramaAlani
                      id="hedef-bolum-ara"
                      deger={bolumArama}
                      onDegis={setBolumArama}
                      ipucu="Bölüm ara"
                    />
                    <Liste bos="Bu üniversitede böyle bir bölüm bulamadım.">
                      {bolumSonuclari.map((b) => {
                        const t = tahminEt(secilenUni, b)
                        return (
                          <SecimSatiri
                            key={b.id}
                            baslik={b.ad}
                            alt={`${PUAN_TURU_ADI[b.puanTuru]} · ${b.sure} yıl`}
                            sag={
                              <span className="rakam shrink-0 text-right text-[11px] leading-tight font-bold text-muted-foreground">
                                ~{puanYaz(t.tabanPuan)}
                                <span className="block font-medium text-muted-foreground/80">
                                  {siraYaz(t.siralama)}.
                                </span>
                              </span>
                            }
                            onSec={() => bolumSec(b)}
                          />
                        )
                      })}
                    </Liste>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* Sayı kutuları katalog kipinde kapalı duruyor: seçim zaten dolduruyor
            ve dört kutuyu birden göstermek ekranı eski hâline döndürürdü. */}
        {(elleMod || duzenleAcik) && (
          <div className="space-y-3">
            <div>
              <Etiket>Puan türü</Etiket>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PUAN_TURU_ADI) as PuanTuru[]).map((t) => (
                  <Cip key={t} secili={puanTuru === t} onClick={() => setPuanTuru(t)}>
                    {PUAN_TURU_ADI[t]}
                  </Cip>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Etiket htmlFor="hedef-taban">Taban puan</Etiket>
                <Alan
                  id="hedef-taban"
                  inputMode="decimal"
                  value={tabanPuan}
                  onChange={(e) =>
                    setTabanPuan(e.target.value.replace(/[^0-9,.]/g, '').slice(0, 7))
                  }
                  placeholder="örn. 470"
                  className="rakam"
                />
              </div>
              <div>
                <Etiket htmlFor="hedef-sira">Başarı sırası</Etiket>
                <Alan
                  id="hedef-sira"
                  inputMode="numeric"
                  value={basariSirasi}
                  onChange={(e) =>
                    setBasariSirasi(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))
                  }
                  placeholder="örn. 25000"
                  className="rakam"
                />
              </div>
            </div>
          </div>
        )}

        {tahmin && !elleMod && !duzenleAcik && (
          <TahminOzeti
            tabanPuan={tabanPuan}
            basariSirasi={basariSirasi}
            puanTuru={puanTuru}
            onDuzenle={() => setDuzenleAcik(true)}
          />
        )}

        <div className="flex gap-2 pt-1">
          {hedef && (
            <Buton
              bicim="tehlike"
              boy="simge"
              onClick={() => setSilmeAcik(true)}
              aria-label="Hedefi sil"
            >
              <Trash2 size={18} aria-hidden />
            </Buton>
          )}
          <Buton className="flex-1" onClick={kaydet} disabled={!kaydedilebilir}>
            <Check size={18} aria-hidden />
            Kaydet
          </Buton>
        </div>

        <button
          type="button"
          onClick={() => {
            setElleMod((a) => !a)
            setDuzenleAcik(false)
          }}
          className="w-full rounded-lg py-1 text-center text-[13px] font-bold text-ikincil transition active:opacity-70"
        >
          {elleMod ? 'Listeden seçeyim' : 'Bölümüm listede yok, kendim yazayım'}
        </button>
      </Kart>

      <Not className="mt-4">
        Taban puan ve sıralama <strong>tahmindir</strong>: bölümün sırası
        üniversitenin genel düzeyine göre kestiriliyor, puan da ÖSYM'nin{' '}
        {SON_VERI_YILI} yerleştirme dağılımından çevriliyor. Sıralamalar her yıl
        oynuyor — hedefinin biraz üstünü tutturmak daha güvenli. Yanlış geldiyse
        sayıları elle düzeltebilirsin.
      </Not>

      <Onay
        acik={silmeAcik}
        baslik="Hedef silinsin mi?"
        aciklama="Kaydettiğin bölüm ve sıralama bilgisi silinecek."
        onOnayla={() => setHedef(null)}
        onIptal={() => setSilmeAcik(false)}
      />
    </div>
  )
}

/** Arama kutusu — solunda büyüteç, listeyi süzen tek alan. */
function AramaAlani({
  id,
  deger,
  onDegis,
  ipucu,
}: {
  id: string
  deger: string
  onDegis: (deger: string) => void
  ipucu: string
}) {
  return (
    <div className="relative">
      <Search
        size={17}
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <Alan
        id={id}
        value={deger}
        onChange={(e) => onDegis(e.target.value)}
        placeholder={ipucu}
        autoComplete="off"
        className="pl-9"
      />
    </div>
  )
}

/**
 * Seçenek listesi.
 *
 * Yüksekliği sınırlı ve kendi içinde kayıyor: 200 üniversite sayfayı uzatsaydı
 * altındaki "Kaydet" düğmesi ekrandan çıkardı.
 */
function Liste({ bos, children }: { bos: string; children: React.ReactNode }) {
  const doluMu = Array.isArray(children) ? children.length > 0 : Boolean(children)
  return (
    <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-border">
      {doluMu ? (
        <ul className="divide-y divide-border">{children}</ul>
      ) : (
        <p className="px-3 py-4 text-center text-sm text-muted-foreground">{bos}</p>
      )}
    </div>
  )
}

function SecimSatiri({
  baslik,
  alt,
  sag,
  onSec,
}: {
  baslik: string
  alt: string
  sag?: React.ReactNode
  onSec: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSec}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition active:bg-muted"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm leading-tight font-bold">{baslik}</span>
          <span className="block text-xs font-medium text-muted-foreground">{alt}</span>
        </span>
        {sag}
        <ChevronRight size={16} className="shrink-0 text-muted-foreground/70" aria-hidden />
      </button>
    </li>
  )
}

/** Seçim yapıldıktan sonra kutunun yerini alan satır. */
function SecilenSatir({
  baslik,
  alt,
  onDegistir,
}: {
  baslik: string
  alt: string
  onDegistir: () => void
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-primary-soft px-3 py-2.5">
      <School size={18} className="shrink-0 text-primary" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-sm leading-tight font-extrabold">{baslik}</span>
        <span className="block text-xs font-medium text-muted-foreground">{alt}</span>
      </span>
      <button
        type="button"
        onClick={onDegistir}
        className="shrink-0 rounded-lg px-2 py-1 text-[13px] font-extrabold text-primary transition active:opacity-70"
      >
        Değiştir
      </button>
    </div>
  )
}

/** Seçimden çıkan iki sayı ve "elle düzelt" kapısı. */
function TahminOzeti({
  tabanPuan,
  basariSirasi,
  puanTuru,
  onDuzenle,
}: {
  tabanPuan: string
  basariSirasi: string
  puanTuru: PuanTuru
  onDuzenle: () => void
}) {
  // Kutulardaki metin virgüllü olabiliyor; `Number` onu NaN yapıp özeti
  // boşaltıyordu. Kaydedilen değerle aynı ayrıştırıcı kullanılıyor.
  const puan = sayiVeyaNull(tabanPuan)
  const sira = sayiVeyaNull(basariSirasi)
  return (
    <div className="rounded-xl bg-muted/70 px-3.5 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-bold text-muted-foreground">
          Tahmini taban · {PUAN_TURU_ADI[puanTuru]}
        </span>
        <button
          type="button"
          onClick={onDuzenle}
          className="inline-flex shrink-0 items-center gap-1 text-[13px] font-extrabold text-ikincil transition active:opacity-70"
        >
          <Pencil size={13} aria-hidden />
          Elle düzelt
        </button>
      </div>
      <div className="mt-1.5 flex items-baseline gap-4">
        <span className="rakam font-display text-xl font-extrabold text-primary">
          {puan === null ? '—' : puanYaz(puan)}
        </span>
        <span className="rakam text-sm font-bold text-muted-foreground">
          {sira === null ? '—' : `${siraYaz(sira)}. sıra`}
        </span>
      </div>
    </div>
  )
}

/** Katalogda olmayan hedefler için serbest metin — eski ekranın iki kutusu. */
function ElleGiris({
  universite,
  bolum,
  onUniversite,
  onBolum,
}: {
  universite: string
  bolum: string
  onUniversite: (deger: string) => void
  onBolum: (deger: string) => void
}) {
  return (
    <div className="space-y-3">
      <div>
        <Etiket htmlFor="hedef-bolum">Bölüm</Etiket>
        <Alan
          id="hedef-bolum"
          value={bolum}
          onChange={(e) => onBolum(e.target.value)}
          placeholder="örn. Hukuk"
        />
      </div>
      <div>
        <Etiket htmlFor="hedef-universite">Üniversite</Etiket>
        <Alan
          id="hedef-universite"
          value={universite}
          onChange={(e) => onUniversite(e.target.value)}
          placeholder="örn. Ankara Üniversitesi"
        />
      </div>
    </div>
  )
}

/** "543,9" — ondalık ayraç virgül, sıfır ondalık gösterilmiyor. */
function puanYaz(puan: number): string {
  if (!Number.isFinite(puan)) return '—'
  return puan.toLocaleString('tr-TR', { maximumFractionDigits: 1 })
}

function sayiVeyaNull(metin: string): number | null {
  const temiz = metin.replace(',', '.').trim()
  if (temiz === '') return null
  const sayi = Number(temiz)
  return Number.isFinite(sayi) ? sayi : null
}
