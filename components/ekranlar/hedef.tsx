'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import type { Hedef, PuanTuru } from '@/lib/types'
import { siraYaz } from '@/lib/siralama'
import {
  basariSirasiGecerli,
  bolumAra,
  bolumBul,
  hedefSayilariGecerli,
  puanMetni,
  sayiOku,
  tabanPuanGecerli,
  tahminEt,
  turAdi,
  universiteAra,
  universiteBul,
  type Bolum,
  type Universite,
} from '@/lib/hedef-katalog'
import { Alan, BaslikSatiri, Buton, Cip, Etiket, Kart, Not, Onay } from '@/components/ui'
import {
  AramaAlani,
  HedefKontrolu,
  Liste,
  SecilenSatir,
  SecimSatiri,
  uniListesiBos,
} from '@/components/hedef-secici'
import { Rabi } from '@/components/maskot/rabi'

const PUAN_TURU_ADI: Record<PuanTuru, string> = {
  say: 'Sayısal',
  ea: 'Eşit Ağırlık',
  soz: 'Sözel',
  dil: 'Dil',
}

/** Kayıt bildirimi ekranda ne kadar duruyor — Yapılacaklar'daki toast'la aynı. */
const BILDIRIM_SURESI = 2400

/** Elle giriş kipinde kutular boş kalabilir; yazılmışsa geçerli olmalı. */
function bosVeyaGecerli(metin: string, gecerli: (sayi: number | null) => boolean): boolean {
  return metin.trim() === '' || gecerli(sayiOku(metin))
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
  /** Öğrencinin kendi alanı; bölüm listesini süzüyor. `null` = karar vermedi. */
  varsayilanTur: PuanTuru | null
  guncelSiralama: number | null
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
  const [tabanPuan, setTabanPuan] = useState(
    hedef?.tabanPuan != null ? puanMetni(hedef.tabanPuan) : '',
  )
  const [basariSirasi, setBasariSirasi] = useState(hedef?.basariSirasi?.toString() ?? '')
  const [silmeAcik, setSilmeAcik] = useState(false)
  /*
    Kayıt bildirimi. Kaydet ekranı kapatmıyor (kullanıcı kaldırttı: araç
    menüsüne atılmak, kaydettiği değeri görmeden ekrandan çıkarıyordu); kaydın
    işlendiğini bu kısa şerit söylüyor. Değer bir sayaç: art arda iki kayıtta
    şerit yeniden başlasın.
  */
  const [kayitBildirimi, setKayitBildirimi] = useState(0)
  useEffect(() => {
    if (kayitBildirimi === 0) return
    const zamanlayici = window.setTimeout(() => setKayitBildirimi(0), BILDIRIM_SURESI)
    return () => window.clearTimeout(zamanlayici)
  }, [kayitBildirimi])

  // Katalog dışı bir hedef kayıtlıysa ekran elle giriş kipinde açılıyor: eski
  // sürümde herkes iki adı serbest metin yazıyordu ve o kayıtlar duruyor.
  const [elleMod, setElleMod] = useState(
    () => hedef !== null && universiteBul(hedef.universite) === null,
  )
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

  /*
    Süzgeç `varsayilanTur`dan geliyor, `puanTuru` state'inden değil: biri
    öğrencinin **kendi** alanı, öteki seçilen **bölümün** türü. İkincisine
    bakan bir süzgeç kendi kuyruğunu kovalardı -- seçilen bölüm süzgeci
    değiştirir, süzgeç de listeyi.
  */
  const alanSuzgeci = alanDisiniGoster ? null : varsayilanTur
  const uniSonuclari = useMemo(() => universiteAra(uniArama, alanSuzgeci), [uniArama, alanSuzgeci])
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
    if (secilenBolum) {
      // Aynı adlı bölüm yeni üniversitede de varsa sırası başka: kutular eski
      // üniversitenin kaydıyla değil yeni programınkiyle dolmalı.
      const ayni = bolumBul(secilen, secilenBolum.ad)
      if (ayni) {
        yaz(secilen, ayni)
      } else {
        setBolum('')
        setTabanPuan('')
        setBasariSirasi('')
      }
    }
  }

  const bolumSec = (secilen: Bolum) => {
    setBolum(secilen.ad)
    setBolumArama('')
    if (secilenUni) yaz(secilenUni, secilen)
  }

  /** Seçimden çıkan sayıları kontrol kutularına yazar; kullanıcı sonra düzeltebiliyor. */
  const yaz = (secilenUniversite: Universite, secilenBolumu: Bolum) => {
    const yeni = tahminEt(secilenUniversite, secilenBolumu)
    setPuanTuru(secilenBolumu.puanTuru)
    // Ondalık ayraç virgül: kutuya nokta yazan bir arayüz, sayfanın geri
    // kalanında virgül gördüğü için kullanıcıya yabancı geliyor.
    setTabanPuan(puanMetni(yeni.tabanPuan))
    setBasariSirasi(yeni.siralama.toString())
  }

  /*
    Katalogdan seçilmiş hedefte iki sayı da geçerli olmadan kayıt yok: kontrol
    adımı onları dolu getiriyor, boşaltılmış ya da saçma bir sayı "hedefine ne
    kadar kaldı" cümlesini bozardı. Elle giriş kipinde sayılar eskisi gibi
    isteğe bağlı, ama yazılmışsa geçerli olmalı.
  */
  const kaydedilebilir =
    tahmin && !elleMod
      ? hedefSayilariGecerli(tabanPuan, basariSirasi)
      : bolum.trim() !== '' &&
        bosVeyaGecerli(tabanPuan, tabanPuanGecerli) &&
        bosVeyaGecerli(basariSirasi, basariSirasiGecerli)

  const kaydet = () => {
    if (!kaydedilebilir) return
    setHedef({
      universite: universite.trim(),
      bolum: bolum.trim(),
      puanTuru,
      tabanPuan: sayiOku(tabanPuan),
      basariSirasi: sayiOku(basariSirasi),
    })
    setKayitBildirimi((n) => n + 1)
  }

  const fark =
    hedef?.basariSirasi != null && guncelSiralama != null
      ? guncelSiralama - hedef.basariSirasi
      : null

  return (
    <div>
      <BaslikSatiri arac="hedef" baslik="Hedefim" />

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
                  <Liste bos={uniListesiBos(uniArama)}>
                    {uniSonuclari.map((u) => (
                      <SecimSatiri
                        key={u.id}
                        baslik={u.ad}
                        alt={`${u.sehir} · ${turAdi(u)}`}
                        onSec={() => universiteSec(u)}
                      />
                    ))}
                  </Liste>
                  {/* Üniversite listesi de alana göre süzülü; anahtar burada da
                      duruyor, yoksa yalnızca alan dışı programı olan üniversiteye
                      hiç ulaşılamazdı. */}
                  {varsayilanTur !== null && (
                    <button
                      type="button"
                      onClick={() => setAlanDisiniGoster((a) => !a)}
                      className="mt-2 w-full rounded-lg py-1 text-center text-[13px] font-bold text-ikincil transition active:opacity-70"
                    >
                      {alanDisiniGoster
                        ? 'Yalnızca alanımdaki üniversiteler'
                        : 'Alanım dışındaki üniversiteleri de göster'}
                    </button>
                  )}
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

        {/* Elle giriş kipinin sayı kutuları. Katalog kipinde puan türü
            bölümden geliyor, iki sayı da aşağıdaki kontrol kutusunda. */}
        {elleMod && (
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

        {tahmin && !elleMod && (
          <HedefKontrolu
            idOneki="hedef-kontrol"
            tabanPuan={tabanPuan}
            basariSirasi={basariSirasi}
            onTabanPuan={setTabanPuan}
            onBasariSirasi={setBasariSirasi}
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
          onClick={() => setElleMod((a) => !a)}
          className="w-full rounded-lg py-1 text-center text-[13px] font-bold text-ikincil transition active:opacity-70"
        >
          {elleMod ? 'Listeden seçeyim' : 'Bölümüm listede yok, kendim yazayım'}
        </button>
      </Kart>

      {/* Uzun açıklamalar kısaltıldı; ekranın altı bir paragraf duvarıydı.
          İki cümle kalıyor ve ikisi de süs değil: taban puan gerçekten bir
          tahmin, ÖSYM ile bağlantısızlık da adı kaynak olarak geçtiği için
          söylenmesi gereken bir şey. */}
      <Not className="mt-4">
        Taban puan <strong>tahmindir</strong>.
      </Not>

      <Not className="mt-2">
        Rabi ÖSYM ile bağlantılı değildir; sayılar ÖSYM'nin herkese açık
        yayınlarından derlenmiştir.
      </Not>

      {/* Kayıt bildirimi — Yapılacaklar'daki toast'ın kalıbı, alt menünün üstünde. */}
      {kayitBildirimi > 0 && (
        <div
          key={kayitBildirimi}
          className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+var(--guvenli-alt))] z-40 flex justify-center px-6 tablet:right-[var(--ray)] tablet:bottom-[calc(1.5rem+var(--guvenli-alt))]"
        >
          <p
            role="status"
            className="acilir-giris max-w-md rounded-2xl bg-foreground px-4 py-3 text-center text-[13.5px] font-bold text-background shadow-kart"
          >
            Hedefin kaydedildi.
          </p>
        </div>
      )}

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
