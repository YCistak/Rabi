'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronRight, Info, Pencil, Trash2 } from 'lucide-react'
import type { Hedef, PuanTuru } from '@/lib/types'
import { siraYaz } from '@/lib/siralama'
import {
  bolumAra,
  bolumBul,
  bolumleriGetir,
  tahminEt,
  turAdi,
  universiteAra,
  universiteBul,
  type Bolum,
  type Universite,
} from '@/lib/hedef-katalog'
import { Alan, Buton, Etiket, Kart, Onay } from '@/components/ui'
import { AramaAlani, Liste, SecilenSatir, SecimSatiri } from '@/components/hedef-secici'
import { cn } from '@/lib/utils'

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
  /**
   * Kaydettikten sonra ekranı kapatır.
   *
   * Kaydedince ekranda kalmak, kaydın işlenip işlenmediğini belirsiz
   * bırakıyordu: aynı form aynı değerlerle duruyor ve tek fark bir yerdeki
   * özet. Hedef ana sayfada zaten görünüyor — kullanıcıyı oraya bırakmak
   * kaydın karşılığını gösteriyor. Silme burada değil: silen kullanıcı yeni
   * bir hedef girmek için ekranda kalıyor.
   */
  onKaydedildi,
}: {
  hedef: Hedef | null
  setHedef: (hedef: Hedef | null) => void
  /** Öğrencinin kendi alanı; bölüm listesini süzüyor. `null` = karar vermedi. */
  varsayilanTur: PuanTuru | null
  guncelSiralama: number | null
  onKaydedildi: () => void
}) {
  const [universite, setUniversite] = useState(hedef?.universite ?? '')
  const [bolum, setBolum] = useState(hedef?.bolum ?? '')
  /*
    Hedefin puan türü. Kayıtlı hedef varsa onunki, yoksa öğrencinin kendi alanı;
    ikisi de yoksa 'ea' -- yalnızca elle giriş kipindeki çiplerin bir başlangıcı
    olsun diye. Katalogdan bölüm seçilir seçilmez `yaz` bunu bölümün gerçek
    türüyle değiştiriyor.
  */
  const [puanTuru, setPuanTuru] = useState<PuanTuru>(hedef?.puanTuru ?? varsayilanTur ?? 'ea')
  /*
    Bölüm listesi öğrencinin alanına göre süzülüyor; bu anahtar süzgeci
    kaldırıyor. Süzgeç olmadan sözel öğrenciye Bilgisayar Mühendisliği
    çıkıyordu -- giremeyeceği bir bölüm hedef olarak kaydedilince "hedefine ne
    kadar kaldı" cümlesi ölçtüğü şeyi kaybediyor. Anahtar da şart: alan
    değiştirmeyi düşünen öğrenci aradığını hiç bulamazdı.
  */
  const [alanDisiniGoster, setAlanDisiniGoster] = useState(false)
  const [tabanPuan, setTabanPuan] = useState(hedef?.tabanPuan?.toString() ?? '')
  const [basariSirasi, setBasariSirasi] = useState(hedef?.basariSirasi?.toString() ?? '')
  const [silmeAcik, setSilmeAcik] = useState(false)
  const [hedefDuzenleniyor, setHedefDuzenleniyor] = useState(false)
  const formAcik = hedef === null || hedefDuzenleniyor

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
  const secilenBolum = useMemo(() => bolumBul(secilenUni, bolum), [secilenUni, bolum])
  const tahmin = useMemo(
    () => (secilenUni && secilenBolum ? tahminEt(secilenUni, secilenBolum) : null),
    [secilenUni, secilenBolum],
  )

  const uniSonuclari = useMemo(
    () => uniArama.trim() ? universiteAra(uniArama) : [],
    [uniArama],
  )
  /*
    Süzgeç `varsayilanTur`dan geliyor, `puanTuru` state'inden değil: biri
    öğrencinin **kendi** alanı, öteki seçilen **bölümün** türü. İkincisine
    bakan bir süzgeç kendi kuyruğunu kovalardı -- seçilen bölüm süzgeci
    değiştirir, süzgeç de listeyi.
  */
  const alanSuzgeci = alanDisiniGoster ? null : varsayilanTur
  const bolumSonuclari = useMemo(
    () => (secilenUni ? bolumAra(secilenUni, bolumArama, alanSuzgeci) : []),
    [secilenUni, bolumArama, alanSuzgeci],
  )

  const universiteSec = (secilen: Universite) => {
    setUniversite(secilen.ad)
    setUniArama('')
    // Yeni üniversitenin açmadığı bir bölüm seçili kalırsa ekran, o
    // üniversitede olmayan bir hedefi kaydedilebilir gösterirdi.
    // Denetim süzgeçsiz listeye bakıyor: alan dışındaki bir seçim geçerli,
    // yalnızca listede gizli.
    if (secilenBolum && !bolumleriGetir(secilen).some((b) => b.id === secilenBolum.id)) {
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

  const duzenlemeyiAc = () => {
    if (!hedef) return
    setUniversite(hedef.universite)
    setBolum(hedef.bolum)
    setPuanTuru(hedef.puanTuru)
    setTabanPuan(hedef.tabanPuan?.toString().replace('.', ',') ?? '')
    setBasariSirasi(hedef.basariSirasi?.toString() ?? '')
    setElleMod(universiteBul(hedef.universite) === null)
    setDuzenleAcik(false)
    setUniArama('')
    setBolumArama('')
    setAlanDisiniGoster(false)
    setHedefDuzenleniyor(true)
  }

  const kaydet = () => {
    setHedef({
      universite: universite.trim(),
      bolum: bolum.trim(),
      puanTuru,
      tabanPuan: sayiVeyaNull(tabanPuan),
      basariSirasi: sayiVeyaNull(basariSirasi),
    })
    onKaydedildi()
  }

  const fark =
    hedef?.basariSirasi != null && guncelSiralama != null
      ? guncelSiralama - hedef.basariSirasi
      : null

  return (
    <div
      className="flex flex-col"
      style={!formAcik ? {
        minHeight: 'calc(100dvh / var(--olcek) - 11rem - var(--guvenli-ust) - var(--guvenli-alt))',
      } : undefined}
    >
      <h1 className="mb-4 font-display text-xl font-extrabold">Hedefim</h1>

      {hedef && !formAcik && (
        <Kart className="relative mb-5 overflow-hidden rounded-[24px] border border-border/70 p-5 transition-colors active:bg-primary-soft/30">
          <button
            type="button"
            onClick={duzenlemeyiAc}
            aria-label="Hedefimi düzenle"
            className="absolute inset-0 z-10 rounded-[24px] active:bg-primary/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          />
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-extrabold tracking-wide text-muted-foreground">HEDEFİMDEKİ BÖLÜM</p>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
                {PUAN_TURU_ADI[hedef.puanTuru]}
              </span>
              <ChevronRight size={18} className="text-muted-foreground" aria-hidden />
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-display text-xl font-extrabold leading-snug">{hedef.bolum}</p>
            {hedef.universite && (
              <p className="mt-1 text-sm text-muted-foreground">{hedef.universite}</p>
            )}
            {fark === null ? (
              <p className="mt-4 rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                {hedef.basariSirasi == null
                  ? 'Gereken başarı sırasını girersen ne kadar kaldığını takip ederim.'
                  : 'Deneme ekleyince buraya ne kadar kaldığını yazarım.'}
              </p>
            ) : fark <= 0 ? (
              <p className="mt-4 rounded-xl bg-success-soft p-3 text-sm font-bold text-success">
                Tahmini sıralaman hedefin içinde — {siraYaz(Math.abs(fark))} sıra öndesin.
              </p>
            ) : (
              <p className="mt-4 rounded-xl bg-primary-soft p-3 text-sm font-bold text-primary">
                Tahmini sıralamanla hedefin arasında {siraYaz(fark)} sıra var.
              </p>
            )}
          </div>
        </Kart>
      )}

      {hedef && !formAcik && (
        <section className="mb-5" aria-label="Hedef sıralama karşılaştırması">
          <h2 className="mb-3 font-display text-base font-extrabold">Sıralama karşılaştırması</h2>
          <div className="grid grid-cols-2 gap-3">
            <Kart className="rounded-[20px] p-4">
              <p className="text-xs font-semibold text-muted-foreground">Hedef sırası</p>
              <p className="rakam mt-2 font-display text-2xl font-extrabold leading-none text-primary">
                {hedef.basariSirasi == null ? '—' : siraYaz(hedef.basariSirasi)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{hedef.basariSirasi == null ? 'Henüz girilmedi' : 'Kaydedilen hedef sırası'}</p>
            </Kart>
            <Kart className="rounded-[20px] p-4">
              <p className="text-xs font-semibold text-muted-foreground">Tahmini sıram</p>
              <p className="rakam mt-2 font-display text-2xl font-extrabold leading-none">
                {guncelSiralama == null ? '—' : siraYaz(guncelSiralama)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{guncelSiralama == null ? 'Deneme sonuçlarınla oluşur' : 'Deneme sonuçlarına göre'}</p>
            </Kart>
          </div>
        </section>
      )}

      {formAcik && <>
      <div className="mb-3 flex rounded-[14px] bg-muted p-1" role="group" aria-label="Hedef giriş yöntemi">
        {[{ elle: false, ad: 'Listeden seç' }, { elle: true, ad: 'Kendin yaz' }].map((kip) => (
          <button
            key={kip.ad}
            type="button"
            aria-pressed={elleMod === kip.elle}
            onClick={() => { setElleMod(kip.elle); setDuzenleAcik(false) }}
            className={cn(
              'h-9 flex-1 rounded-[10px] text-[13px] font-extrabold transition focus-visible:outline-2 focus-visible:outline-ring',
              elleMod === kip.elle ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground',
            )}
          >
            {kip.ad}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {elleMod ? (
          <Kart className="rounded-[20px] p-4">
            <ElleGiris
              universite={universite}
              bolum={bolum}
              onUniversite={setUniversite}
              onBolum={setBolum}
            />
          </Kart>
        ) : (
          <>
            <section className="rounded-[20px] bg-card p-4 golge-kart">
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
                    vurgulu={!uniArama.trim()}
                  />
                  {uniArama.trim() ? (
                    <Liste bos="Bu adla üniversite bulamadım." className="max-h-[min(50dvh,22rem)]">
                      {uniSonuclari.map((u) => (
                        <SecimSatiri
                          key={u.id}
                          baslik={u.ad}
                          alt={`${u.sehir} · ${turAdi(u)}`}
                          onSec={() => universiteSec(u)}
                        />
                      ))}
                    </Liste>
                  ) : null}
                </>
              )}
            </section>

            {secilenUni && (
              <section className="rounded-[20px] bg-card p-4 golge-kart">
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
                    <Liste
                      className="max-h-[min(50dvh,22rem)]"
                      bos={
                        alanSuzgeci
                          ? 'Alanına uyan böyle bir bölüm bulamadım.'
                          : 'Bu üniversitede böyle bir bölüm bulamadım.'
                      }
                    >
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
                    {/* Anahtar yalnızca süzgeç varken görünüyor: alanını
                        seçmemiş öğrenciye zaten bütün liste açık. */}
                    {varsayilanTur !== null && (
                      <button
                        type="button"
                        onClick={() => setAlanDisiniGoster((a) => !a)}
                        className="mt-2 w-full rounded-lg py-1 text-center text-[13px] font-bold text-ikincil transition active:opacity-70"
                      >
                        {alanDisiniGoster
                          ? 'Yalnızca alanımdaki bölümler'
                          : 'Alanım dışındaki bölümleri de göster'}
                      </button>
                    )}
                  </>
                )}
              </section>
            )}
          </>
        )}

        {/* Sayı kutuları katalog kipinde kapalı duruyor: seçim zaten dolduruyor
            ve dört kutuyu birden göstermek ekranı eski hâline döndürürdü. */}
        {(elleMod || duzenleAcik) && (
          <Kart className="space-y-3 rounded-[20px] p-4">
            <div>
              <Etiket>Puan türü</Etiket>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(PUAN_TURU_ADI) as PuanTuru[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={puanTuru === t}
                    onClick={() => setPuanTuru(t)}
                    className={cn(
                      'h-11 rounded-xl border text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-ring',
                      puanTuru === t ? 'border-primary-parlak bg-primary-soft text-primary' : 'border-border text-muted-foreground active:bg-muted',
                    )}
                  >
                    {PUAN_TURU_ADI[t]}
                  </button>
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
                  className="rakam h-12 text-center text-lg font-extrabold placeholder:text-sm placeholder:font-bold"
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
                  className="rakam h-12 text-center text-lg font-extrabold placeholder:text-sm placeholder:font-bold"
                />
              </div>
            </div>
          </Kart>
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
          {kaydedilebilir ? (
            <Buton className="h-12 flex-1 rounded-[14px]" onClick={kaydet}>
              <Check size={18} aria-hidden />
              {hedef ? 'Değişiklikleri kaydet' : 'Hedefimi kaydet'}
            </Buton>
          ) : hedef ? (
            <p className="flex flex-1 items-center justify-center rounded-xl bg-muted/70 px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
              {elleMod ? 'Kaydetmek için bölüm adını yaz.' : secilenUni ? 'Kaydetmek için bölümünü seç.' : 'Önce üniversiteni seç.'}
            </p>
          ) : null}
        </div>
        {hedef && (
          <Buton bicim="hayalet" className="w-full" onClick={() => setHedefDuzenleniyor(false)}>
            Vazgeç
          </Buton>
        )}

      </div>
      </>}

      <div className={cn('rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground', formAcik ? 'mt-5' : 'mt-auto')}>
        <div className="flex gap-3">
          <Info size={17} className="mt-0.5 shrink-0 text-primary" aria-hidden />
          <div className="space-y-3">
            <p><strong className="text-foreground">Taban puan ve kişisel sıralama tahminidir.</strong> Hedef sırası katalogdan seçilir ya da elle girilir.</p>
            <p className="border-t border-border pt-3">Veriler ÖSYM’nin herkese açık yayınlarından derlenmiştir. Rabi, ÖSYM’ye bağlı değildir.</p>
          </div>
        </div>
      </div>

      <Onay
        acik={silmeAcik}
        baslik="Hedef silinsin mi?"
        aciklama="Kaydettiğin bölüm ve sıralama bilgisi silinecek."
        onOnayla={() => {
          setHedef(null)
          setUniversite('')
          setBolum('')
          setTabanPuan('')
          setBasariSirasi('')
          setUniArama('')
          setBolumArama('')
          setDuzenleAcik(false)
          setSilmeAcik(false)
          setHedefDuzenleniyor(false)
        }}
        onIptal={() => setSilmeAcik(false)}
      />
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
    <Kart className="rounded-[20px] border border-border/70 p-4">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <span className="text-sm font-extrabold">Hedef ölçütleri</span>
        <button
          type="button"
          onClick={onDuzenle}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-extrabold text-primary transition active:bg-primary-soft focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Pencil size={13} aria-hidden />
          Elle düzelt
        </button>
      </div>
      <p className="mt-3 text-xs font-semibold text-muted-foreground">{PUAN_TURU_ADI[puanTuru]}</p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Tahmini taban puan</p>
          <p className="rakam mt-1 font-display text-2xl font-extrabold text-primary">
            {puan === null ? '—' : puanYaz(puan)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Hedef başarı sırası</p>
          <p className="rakam mt-1 font-display text-2xl font-extrabold">
            {sira === null ? '—' : siraYaz(sira)}
          </p>
        </div>
      </div>
    </Kart>
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
