'use client'

import { useMemo, useState } from 'react'
import { Check, Pencil, Trash2 } from 'lucide-react'
import type { Hedef, PuanTuru } from '@/lib/types'
import { siraYaz } from '@/lib/siralama'
import {
  KATALOG_VERI_YILI,
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
import { SON_VERI_YILI } from '@/lib/puan'
import { Alan, BaslikSatiri, Buton, Cip, Etiket, Kart, Not, Onay } from '@/components/ui'
import { AramaAlani, Liste, SecilenSatir, SecimSatiri } from '@/components/hedef-secici'
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

  const uniSonuclari = useMemo(() => universiteAra(uniArama), [uniArama])
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
                    <Liste
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

      {/* Sıra artık kestirilmiyor: kılavuzdaki gerçek değer. Metin bunu
          söylemek zorunda -- "tahmin" demek sayıyı olduğundan güvensiz
          gösterirdi, taban puan içinse tahmin demek şart. Kaynağın ÖSYM
          olduğu da yazıyor: veriyi nereden aldığını söylememek onu Rabi
          üretmiş gibi gösterirdi. Bağlantısızlık cümlesi bunun karşılığı --
          ÖSYM adı burada kaynak olarak geçiyor, marka olarak değil. */}
      <Not className="mt-4">
        Bölümün sırası, ÖSYM'nin yayımladığı {KATALOG_VERI_YILI} yerleştirme
        sonuçlarındaki gerçek değer. Taban puan <strong>tahmindir</strong>: o
        sıranın {SON_VERI_YILI} puan dağılımındaki karşılığı hesaplanıyor.
        Sıralamalar her yıl oynuyor — hedefinin biraz üstünü tutturmak daha
        güvenli. Yanlış geldiyse sayıları elle düzeltebilirsin.
      </Not>

      <Not className="mt-2">
        Rabi ÖSYM ile bağlantılı değildir; sayılar ÖSYM'nin herkese açık
        yayınlarından derlenmiştir.
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
