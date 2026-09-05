'use client'

import { useEffect, useMemo, useState } from 'react'
import type {
  OyunId,
  OyunKayitlari,
  OyunTurKaydi,
} from '@/lib/types'
import {
  bolumBul,
  bolumsuzOyunlar,
  bolumunOyunlari,
  dersBul,
  dersinBolumleri,
  dersinOyunlari,
  doluDersler,
  istatistikAl,
  type BolumId,
  type BolumTanimi,
  type DersId,
  type DersTanimi,
  type OyunTanimi,
} from '@/lib/oyunlar/tanim'
import {
  istatistigiGuncelle,
  type TurSayilari,
} from '@/lib/oyunlar/tur'
import {
  bankaDagilimi,
  bankayiGuncelle,
  dusenSayisi,
  type BankaCevabi,
  type BankaKaydi,
  type BankaTuru,
} from '@/lib/oyunlar/banka'
import { sesleriHazirla } from '@/lib/oyunlar/oyun-sesi'
import { ANAHTARLAR, OYUN_GECMIS_SINIRI, TUR_EN_UZUN, useYerelDepo } from '@/lib/depo'
import {
  VARSAYILAN_MOD,
  etkinMod,
  modKayitliMi,
  moduNormalize,
  type OyunModu,
} from '@/lib/oyunlar/mod'
import { dogruKimlikler } from '@/lib/oyunlar/genel-test'
import { muzikBaslat, muzikDuraklat, muzikDurdur } from '@/lib/oyunlar/mod-muzigi'
import { useGeriKatmani } from '@/lib/geri'
import { useUygulamaGorunur } from '@/lib/gorunurluk'
import { bugun } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { BildirimKolu } from '@/components/hata-bildir'
import { GenelTestSaglayici } from '@/components/genel-test-baglami'
import { YazimOyunuEkrani } from '@/components/ekranlar/oyun-yazim'
import { SesOyunuEkrani } from '@/components/ekranlar/oyun-ses'
import { OgeOyunuEkrani } from '@/components/ekranlar/oyun-oge'
import { SozOyunuEkrani } from '@/components/ekranlar/oyun-soz'
import { IslemOyunuEkrani } from '@/components/ekranlar/oyun-islem'
import { BolunmeOyunuEkrani } from '@/components/ekranlar/oyun-bolunme'
import { EdebiyatOyunuEkrani } from '@/components/ekranlar/oyun-edebiyat'
import { PeriyodikOyunuEkrani } from '@/components/ekranlar/oyun-periyodik'
import { FormulOyunuEkrani } from '@/components/ekranlar/oyun-formul'
import { HaritaOyunuEkrani } from '@/components/ekranlar/oyun-harita'
import { IklimOyunuEkrani } from '@/components/ekranlar/oyun-iklim'
import { IzohipsOyunuEkrani } from '@/components/ekranlar/oyun-izohips'
import { AciOyunuEkrani } from '@/components/ekranlar/oyun-aci'
import { UcgenOyunuEkrani } from '@/components/ekranlar/oyun-ucgen'
import { AntlasmaOyunuEkrani } from '@/components/ekranlar/oyun-antlasma'
import { KavramOyunuEkrani } from '@/components/ekranlar/oyun-kavram'
import { AnlatimOyunuEkrani } from '@/components/ekranlar/oyun-anlatim'
import { KokluOyunuEkrani } from '@/components/ekranlar/oyun-koklu'
import { BiyolojiOyunuEkrani } from '@/components/ekranlar/oyun-biyoloji'
import { HucreOyunuEkrani } from '@/components/ekranlar/oyun-hucre'
import { SiralaOyunuEkrani } from '@/components/ekranlar/oyun-sirala'
import { TuzakOyunuEkrani } from '@/components/ekranlar/oyun-tuzak'

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
/**
 * Burada `-kart` yüzeyi kullanılıyor, oyun ekranının zemini değil: bunlar
 * sayfanın üstünde duran kartlar ve koyu temada zeminden **açık** olmaları
 * gerekiyor (bkz. `globals.css`, aile renkleri).
 */
const AILE: Record<DersTanimi['aile'], { zemin: string; yazi: string; ok: string }> = {
  yzm: { zemin: 'bg-yzm-kart', yazi: 'text-yzm-koyu', ok: 'bg-yzm-ok' },
  isl: { zemin: 'bg-isl-kart', yazi: 'text-isl-koyu', ok: 'bg-isl-ok' },
  // `edb` artık hiçbir derste yok (Türkçe ile Edebiyat birleşti); tablo tam
  // kalıyor çünkü anahtarları renk ailesi listesinden geliyor.
  edb: { zemin: 'bg-edb-kart', yazi: 'text-edb-koyu', ok: 'bg-edb-ok' },
  cog: { zemin: 'bg-cog-kart', yazi: 'text-cog-koyu', ok: 'bg-cog-ok' },
  trh: { zemin: 'bg-trh-kart', yazi: 'text-trh-koyu', ok: 'bg-trh-ok' },
  byl: { zemin: 'bg-byl-kart', yazi: 'text-byl-koyu', ok: 'bg-byl-ok' },
}

/** Ders ızgarasındaki tek hücre: ya bir oyun ya da bir bölüm kapağı. */
type Kart = { tip: 'oyun'; oyun: OyunTanimi } | { tip: 'bolum'; bolum: BolumTanimi }

type Aile = { zemin: string; yazi: string; ok: string }

/** Kart başlığındaki satır kırma — iki kelimelik adlar iki satıra iniyor. */
const BASLIK_SATIRLARI: Record<OyunId, [string, string]> = {
  yazim: ['Yazım', 'Ustası'],
  ses: ['Ses', 'Olayları'],
  oge: ['Cümlenin', 'Ögeleri'],
  soz: ['Deyim ve', 'Atasözü'],
  islem: ['Zihinden', 'İşlem'],
  bolunme: ['Bölünebilme', 'Kuralları'],
  aci: ['Açı', 'Tamamlama'],
  ucgen: ['Özel', 'Üçgenler'],
  edebiyat: ['Edebiyat', 'Eşleştirme'],
  harita: ['Harita', 'Avı'],
  iklim: ['İklim', 'Kuşakları'],
  izohips: ['İzohips', 'Okuma'],
  antlasma: ['Antlaşma', 'Eşleştirme'],
  kavram: ['Kavram', 'Eşleştirme'],
  anlatim: ['Anlatım', 'Bozukluğu'],
  koklu: ['Köklü Sayı', 'Aralığı'],
  ortak: ['Ortak', 'Özellikler'],
  siniflandirma: ['Canlıları', 'Sınıflandır'],
  hucre: ['Organel', 'Kartı'],
  sirala: ['Zaman', 'Şeridi'],
  tuzak: ['Kural', 'Tuzağı'],
  periyodik: ['Periyodik', 'Tablo Avı'],
  formul: ['Formül', 'Eşleştirme'],
}

export function OyunlarEkrani({
  kayitlar,
  setKayitlar,
  setGecmis,
  banka,
  setBanka,
  sesAcik,
  muzikAcik,
  onBankayaGit,
  onBankadanDustu,
  /** Genel testin o anki oyunu; test yoksa null. */
  bankaTuru,
  onBankaTuruBitti,
  onGenelTestTuruBitti,
  acilacakDers,
  onDersAcildi,
  onOyunAcildi,
  bildir,
}: {
  kayitlar: OyunKayitlari
  setKayitlar: (guncelleyici: OyunKayitlari | ((onceki: OyunKayitlari) => OyunKayitlari)) => void
  setGecmis: (guncelleyici: (onceki: OyunTurKaydi[]) => OyunTurKaydi[]) => void
  banka: BankaKaydi[]
  setBanka: (guncelleyici: (onceki: BankaKaydi[]) => BankaKaydi[]) => void
  sesAcik: boolean
  muzikAcik: boolean
  onBankayaGit: () => void
  /** Turda bankadan düşen soru sayısı — rozet sayacını besliyor. */
  onBankadanDustu: (adet: number) => void
  bankaTuru: BankaTuru | null
  /** Test yarıda kapatıldı ya da hiç soru cevaplanmadan çıkıldı. */
  onBankaTuruBitti: () => void
  /**
   * Genel testin bir turu bitti: doğru bilinen kayıtların kimlikleri ve turun
   * yarıda bırakılıp bırakılmadığı. Sıradaki oyuna geçiren yer `AppShell`.
   */
  onGenelTestTuruBitti: (dogrular: string[], yarim: boolean) => void
  /** Ana sayfadaki ders kutucuğundan gelen ders; sekme onunla açılıyor. */
  acilacakDers: DersId | null
  /** Ders açıldı — istek tüketildi, ikinci çizimde yeniden açılmasın. */
  onDersAcildi: () => void
  /** Bir oyun açıldı — ana sayfadaki kısayol sırası bunu izliyor. */
  onOyunAcildi: (oyun: OyunId) => void
  bildir: BildirimKolu
}) {
  /**
   * Tur modu — bütün oyunlarda ortak, kayıtta saklanıyor.
   *
   * Sahibi burası çünkü hem oyun ekranlarına geçiyor hem de biten turun
   * kaydedilip kaydedilmeyeceğini belirliyor; iki yerde ayrı okunsaydı bir
   * ekranın gördüğü mod ötekinin gördüğünden farklı olabilirdi.
   */
  const [modHam, setMod] = useYerelDepo<OyunModu>(ANAHTARLAR.oyunModu, VARSAYILAN_MOD)
  const mod = moduNormalize(modHam)
  const [secilenOyun, setSecilenOyun] = useState<OyunId | null>(null)
  /** Açık kategori; null ise ders ızgarası görünüyor. */
  const [secilenDers, setSecilenDers] = useState<DersId | null>(null)
  /** Açık bölüm; null ise dersin kendi ızgarası görünüyor. */
  const [secilenBolum, setSecilenBolum] = useState<BolumId | null>(null)
  const acikOyun = bankaTuru?.oyun ?? secilenOyun

  /*
    Ana sayfadan gelen ders isteği bir kez tüketiliyor.

    Prop doğrudan okunsaydı kullanıcı dersten çıkamazdı: geri tuşu `secilenDers`i
    boşaltır, bir sonraki çizim aynı dersi yeniden açardı.
  */
  useEffect(() => {
    if (acilacakDers === null) return
    setSecilenDers(acilacakDers)
    setSecilenBolum(null)
    onDersAcildi()
  }, [acilacakDers, onDersAcildi])

  // Kısayol sırası açılışta işaretleniyor, tur bitince değil: yarıda bırakılan
  // oyun da "en son oynadığın" oluyor ve kullanıcı ona dönmek isteyecek.
  useEffect(() => {
    if (acikOyun) onOyunAcildi(acikOyun)
  }, [acikOyun, onOyunAcildi])

  const dagilim = useMemo(() => bankaDagilimi(banka), [banka])

  // --- Arka plan müziği ---
  // Yalnızca bir oyun açıkken ve uygulama öndeyken çalıyor. Liste ekranında
  // müzik başlaması menüde gezinen kullanıcıyı şaşırtırdı; ana tuşa basıldıktan
  // sonra çalmaya devam etmesi ise uygulama görev listesinden silinene kadar
  // sürüyordu.
  // Turda çalan parça artık seçilmiyor: lo-fi listesi ayarlardan kaldırıldı ve
  // her turda modun kendi müziği çalıyor. Parça bir zevk meselesi olarak
  // sunulduğu sürece tempo da öyle okunuyordu; oysa tempo turun kuralının
  // parçası (`mod-muzigi.ts`), arkada çalan bir liste değil.
  const gorunur = useUygulamaGorunur()

  const muzikCalsin = acikOyun !== null && muzikAcik

  /*
    Mod müziği: parçayı tur modu seçiyor (`lib/oyunlar/mod-muzigi.ts`).

    Seviye dengesi orada tek yerde duruyor (`MUZIK_SEVIYESI`): müzik, efektlerin
    (`oyun-sesi.ts`) hizasında duyulmalı ama onları bastırmamalı — oyunun tek
    sesli geri bildirimi doğru/yanlış efektleri. Efekt seviyesine dokunursan
    oraya da bak; ikisi tek bir dengenin iki ucu.

    Banka turu modu dinlemiyor (`etkinMod`); müzik de onu izliyor, yoksa
    süresiz bir turda süre daraltan bir parça çalardı.
  */
  useEffect(() => {
    if (!muzikCalsin) {
      muzikDurdur()
      return
    }
    if (gorunur) muzikBaslat(etkinMod(mod, bankaTuru !== null))
    else muzikDuraklat()
  }, [muzikCalsin, gorunur, mod, bankaTuru])

  // Ekrandan çıkarken bağlam da kapanmalı; yukarıdaki efekt duraklatmakla yetiniyor.
  useEffect(() => () => muzikDurdur(), [])

  /**
   * Biten tur.
   *
   * Banka turları **rekora ve istatistiğe sayılmıyor**: sorular zaten bir kez
   * yanlış bilinip kenara ayrılmış, tekrar edilen sorular. Sayılsaydı bankayı
   * birkaç kez oynayan herkesin rekoru şişerdi ve rekor "ne kadar biliyorum"
   * ölçüsü olmaktan çıkardı. Bankaya işleme ise her iki turda da yapılıyor —
   * asıl istenen o: soruyu nerede bilirsen bil, öğrenmiş sayılırsın.
   */
  const turBitti = (
    id: OyunId,
    ozet: TurSayilari,
    cevaplar: BankaCevabi[],
    gecenSaniye: number,
    /** Tur bitmeden çıkıldı mı. */
    yarim: boolean,
  ) => {
    /*
      Genel test bankaya **yazmıyor**: doğru bilinenler testin sonunda bir
      kerede düşüyor (`AppShell`), yanlış bilinenler olduğu gibi kalıyor —
      sayacı artmıyor, ikinci kez eklenmiyor. Test yeni bir hata üretmiyor,
      hâlâ öğrenilmemiş olanı gösteriyor.
    */
    if (bankaTuru !== null) {
      onGenelTestTuruBitti(dogruKimlikler(cevaplar), yarim)
      return
    }

    const yeniBanka = bankayiGuncelle(banka, cevaplar, bugun())
    const dusen = dusenSayisi(banka, yeniBanka)
    setBanka(() => yeniBanka)
    if (dusen > 0) onBankadanDustu(dusen)

    /*
      Rahat tur ile **yarıda bırakılan** tur aynı yerde eleniyor: yanlışlar
      bankaya düşüyor ama rekora, istatistiğe ve oyun geçmişine yazılmıyor.
      (Genel test yukarıda çıktı; onun turları da hiçbirine yazılmıyor.)

      Rahat turda sebep süre: süresiz bir turda "kaç doğru yaptın" sorusunun
      cevabı sabrı ölçer, bilgiyi değil (`lib/oyunlar/mod.ts`). Yarım turda
      sebep başka: tur kendi kuralıyla bitmedi, oyuncu kapattı. Yarısında
      çıkılan turları saymak "oynanan tur" sayısını da ortalama süreyi de
      bozardı.
    */
    if (!modKayitliMi(mod) || yarim) return

    setKayitlar((onceki) => ({
      ...onceki,
      [id]: istatistigiGuncelle(onceki[id], ozet, bugun()),
    }))

    /*
      Turun gerçek süresi.

      Eskiden formülle türetiliyordu (sabit tur süresi eksi yanlış cezası); tur
      artık sınırsız ve boss'ta bittiği için o formülün karşılığı kalmadı. Süreyi
      oyun ekranı ölçüp gönderiyor. Üst sınır bozuk kayda karşı: tek bir saçma
      değer haftalık özette "oyunda 9 saat geçirdin" yazdırırdı.
      (Tur bitmeden çıkılırsa hiç kayıt düşmüyor — o süre sayılmıyor.)
    */
    const saniye = Math.min(TUR_EN_UZUN, Math.max(0, gecenSaniye))
    setGecmis((onceki) =>
      [
        ...onceki,
        // Yanlış ve hatasız da yazılıyor: haftalık özetin oyun kartı isabet
        // oranı ve hatasız tur sayısı gösteriyor, ikisi de doğru sayısından
        // türetilemiyor.
        { tarih: bugun(), oyun: id, saniye, dogru: ozet.dogru, yanlis: ozet.yanlis, hatasiz: ozet.hatasiz },
      ].slice(
        -OYUN_GECMIS_SINIRI,
      ),
    )
  }

  // Donanım geri tuşu. Oyun katmanı bunu kaydetmiyordu: oyunun içindeyken geri
  // basmak arkadaki sekmeyi değiştiriyor, oyun açık kalıyordu.
  useGeriKatmani(secilenOyun !== null && bankaTuru === null, () => setSecilenOyun(null))
  useGeriKatmani(secilenDers !== null, () => dersiKapat())
  // Bölüm katmanı sonra açıldığı için yığında üstte kalıyor: geri tuşu önce
  // bölümü kapatıp dersin ızgarasına dönüyor.
  useGeriKatmani(secilenBolum !== null, () => setSecilenBolum(null))

  const oyunuKapat = () => {
    if (bankaTuru !== null) onBankaTuruBitti()
    else setSecilenOyun(null)
  }

  /** Banka turunda oyunun havuzu bankadaki sorularla sınırlanıyor. */
  /** Ders kapanırken bölüm de kapanmalı; yoksa ders yeniden açıldığında eski
   *  bölümün içinde açılırdı. */
  const dersiKapat = () => {
    setSecilenBolum(null)
    setSecilenDers(null)
  }

  /**
   * Açık dersin ızgarasındaki kartlar.
   *
   * Bölüm kartı oyun kartıyla aynı ızgarada duruyor: ayrı bir başlık altına
   * alınsaydı iki oyunluk bir bölüm için ekranın yarısı başlığa giderdi.
   * Bölümün içindeyken yalnızca o bölümün oyunları listeleniyor.
   */
  const kartlar: Kart[] =
    secilenDers === null
      ? []
      : secilenBolum !== null
        ? bolumunOyunlari(secilenBolum).map((oyun) => ({ tip: 'oyun' as const, oyun }))
        : [
            ...bolumsuzOyunlar(secilenDers).map((oyun) => ({ tip: 'oyun' as const, oyun })),
            ...dersinBolumleri(secilenDers).map((bolum) => ({ tip: 'bolum' as const, bolum })),
          ]

  /*
    Genel testin o anki turunun havuzu: sıradaki oyunun bankadaki bütün
    soruları.

    Banka test sürerken değişmiyor — doğru bilinenler testin sonunda bir kerede
    düşüyor. Tur tur düşseydi sıradaki oyunun havuzu test sürerken küçülür,
    aynı testin ortasında bir oyun sorusuz kalabilirdi.
  */
  const bankaSorulari =
    bankaTuru === null ? [] : banka.filter((k) => k.soru.oyun === bankaTuru.oyun)

  /** Açık dersin ailesi — başlıktaki geri tuşu bu renkte duruyor. */
  const acikAile = secilenDers === null ? AILE.yzm : AILE[dersBul(secilenDers).aile]

  return (
    /*
      Genel testte oyunun tanıtım penceresi hiç açılmıyor, tur kendiliğinden
      başlıyor. Bilgi bağlamla iniyor: pencereyi on sekiz oyun dosyasının her
      biri kendi çiziyor ve prop olsaydı aynı satır on sekiz kez yazılacaktı.
    */
    <GenelTestSaglayici value={bankaTuru !== null}>
    <div>
      <header className="flex items-start gap-3 px-0.5 pt-1">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold tracking-[0.2em] text-muted-foreground">RABİ</p>
          <h1 className="mt-1 font-display text-[27px] font-extrabold tracking-tight">Oyunlar</h1>
        </div>

        {/* Araçlar'daki 🧰 ile aynı kutu ve aynı hiza; başlığın sonuna yapışan
            emoji sekme değiştikçe kayıyordu, sağ üstteki kutu sabit duruyor. */}
        <span
          className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-yzm-kart text-[21px] leading-none"
          aria-hidden
        >
          🎮
        </span>
      </header>

      <BankaSatiri
        toplam={banka.length}
        dagilim={dagilim}
        onAc={onBankayaGit}
        className="mt-4"
      />

      {secilenDers === null ? (
        <>
          <h2 className="mt-5 mb-3 px-0.5 font-display text-lg font-extrabold tracking-tight text-primary">
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
                  /*
                    Kart bilerek basık: altı ders yan yana dizildiğinde uzun
                    kartlar listeyi üç ekran boyuna çıkarıyordu. Açıklama satırı
                    ve sağ alttaki ok daire de bu yüzden yok — ders adı ile
                    "kaç oyun · kaç tur" sayacı zaten kartın söylediği her şey.
                  */
                  className={cn(
                    'rounded-2xl p-3.5 text-left transition active:brightness-[0.97]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    aile.zemin,
                    genis ? 'col-span-2 flex items-center gap-3.5' : 'flex flex-col',
                  )}
                >
                  <span
                    className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[14px] bg-white/80 text-[21px] leading-none"
                    aria-hidden
                  >
                    {ders.ikon}
                  </span>

                  <span className={cn('min-w-0', genis ? 'flex-1' : 'mt-2.5')}>
                    <span className="block font-display text-[16px] font-extrabold leading-[1.15] tracking-tight text-foreground">
                      {ders.ad}
                    </span>
                    <span className={cn('mt-1.5 block text-[11.5px] font-bold', aile.yazi)}>
                      {oyunlar.length} oyun
                      {oynanan > 0 && <> · {oynanan} tur</>}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <>
          <div className="mt-5 mb-3 flex items-center gap-2.5 px-0.5">
            {/* Geri tuşu, dersin kendi renginde dolu bir daire.
                Önce çıplak bir oktu ve fark edilmiyordu: gri, çerçevesiz ve
                başlığın yanında kaybolan bir işaretti. Dolu daire hem dokunma
                hedefini (36 px) görünür kılıyor hem de hangi dersten
                çıkılacağını renkten söylüyor. */}
            <button
              type="button"
              onClick={() => (secilenBolum === null ? dersiKapat() : setSecilenBolum(null))}
              aria-label={secilenBolum === null ? 'Derslere dön' : 'Derse dön'}
              className={cn(
                'golge-kart grid h-9 w-9 shrink-0 place-items-center rounded-full transition active:scale-95',
                acikAile.zemin,
                acikAile.yazi,
              )}
            >
              <GeriSimgesi />
            </button>
            <h2 className="font-display text-lg font-extrabold tracking-tight">
              {secilenBolum === null ? dersBul(secilenDers).ad : bolumBul(secilenBolum).ad}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {kartlar.map((kart, sira, liste) => {
              // Tek sayıda kart varsa sonuncusu iki sütunu birden kaplıyor;
              // yoksa ızgarada boş bir hücre kalırdı. Yatay düzen aynı kartın
              // geniş hâli.
              const genis = liste.length % 2 === 1 && sira === liste.length - 1

              if (kart.tip === 'bolum') {
                const bolumOyunlari = bolumunOyunlari(kart.bolum.id)
                return (
                  <BolumKarti
                    key={kart.bolum.id}
                    bolum={kart.bolum}
                    aile={AILE[dersBul(kart.bolum.ders).aile]}
                    oyunSayisi={bolumOyunlari.length}
                    oynananTur={bolumOyunlari.reduce(
                      (toplam, o) => toplam + istatistikAl(kayitlar, o.id).oynananTur,
                      0,
                    )}
                    genis={genis}
                    onAc={() => setSecilenBolum(kart.bolum.id)}
                  />
                )
              }

              return (
                <OyunKarti
                  key={kart.oyun.id}
                  oyun={kart.oyun}
                  aile={AILE[dersBul(kart.oyun.ders).aile]}
                  rekor={istatistikAl(kayitlar, kart.oyun.id).enIyiDogru}
                  genis={genis}
                  onAc={() => {
                    // Ses dosyaları tanıtım açılırken çözülüyor; oyun başlayınca
                    // yüklenseydi ilk cevabın sesi geç gelirdi. Dokunma aynı
                    // zamanda AudioContext'i açan kullanıcı etkileşimi oluyor.
                    sesleriHazirla(sesAcik)
                    setSecilenOyun(kart.oyun.id)
                  }}
                />
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
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('yazim', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'ses' && (
        <SesOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'ses')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('ses', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'oge' && (
        <OgeOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'oge')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('oge', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'soz' && (
        <SozOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'soz')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('soz', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'islem' && (
        <IslemOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'islem')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('islem', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'bolunme' && (
        <BolunmeOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'bolunme')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('bolunme', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'aci' && (
        <AciOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'aci')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('aci', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'ucgen' && (
        <UcgenOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'ucgen')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('ucgen', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'harita' && (
        <HaritaOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'harita')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('harita', ozet, cevaplar, saniye, yarim)}
          onCik={oyunuKapat}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
        />
      )}
      {acikOyun === 'iklim' && (
        <IklimOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'iklim')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('iklim', ozet, cevaplar, saniye, yarim)}
          onCik={oyunuKapat}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
        />
      )}
      {acikOyun === 'izohips' && (
        <IzohipsOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'izohips')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('izohips', ozet, cevaplar, saniye, yarim)}
          onCik={oyunuKapat}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
        />
      )}
      {acikOyun === 'antlasma' && (
        <AntlasmaOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'antlasma')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('antlasma', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'kavram' && (
        <KavramOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'kavram')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('kavram', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'anlatim' && (
        <AnlatimOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'anlatim')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('anlatim', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'koklu' && (
        <KokluOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'koklu')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('koklu', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {/* İki biyoloji çoktan seçmelisi aynı ekranı paylaşıyor; farkları havuz. */}
      {(acikOyun === 'ortak' || acikOyun === 'siniflandirma') && (
        <BiyolojiOyunuEkrani
          oyunId={acikOyun}
          istatistik={istatistikAl(kayitlar, acikOyun)}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti(acikOyun, ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'hucre' && (
        <HucreOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'hucre')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('hucre', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'sirala' && (
        <SiralaOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'sirala')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('sirala', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'tuzak' && (
        <TuzakOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'tuzak')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('tuzak', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'edebiyat' && (
        <EdebiyatOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'edebiyat')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('edebiyat', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'periyodik' && (
        <PeriyodikOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'periyodik')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('periyodik', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
      {acikOyun === 'formul' && (
        <FormulOyunuEkrani
          istatistik={istatistikAl(kayitlar, 'formul')}
          sesAcik={sesAcik}
          bankaSorulari={bankaSorulari}
          onTurBitti={(ozet, cevaplar, saniye, yarim) => turBitti('formul', ozet, cevaplar, saniye, yarim)}
          mod={mod}
          setMod={setMod}
          bildir={bildir}
          onCik={oyunuKapat}
        />
      )}
    </div>
    </GenelTestSaglayici>
  )
}

/**
 * Oyun Bankası girişi — tek satır.
 *
 * Önce arkadan sırıtan iki katmanla bir kart destesiydi; tasarım düz yüzeylere
 * geçince eğik katmanlar sayfadaki tek eğri parça olarak kaldı ve süs gibi
 * durdu. Şimdi tasarımın kendi deseni: solda sayının rozeti, ortada ad, sağda
 * eylem. Sayı kırmızı bir rozet değil, kartın en büyük yazısı — rozet uyarı
 * gibi duruyordu, buradaki bilgi.
 *
 * Dokunma hedefi "Oyna" düğmesi değil kartın tamamı; düğme onun içinde bir
 * yüzey, çünkü iç içe iki düğme olmaz.
 */
function BankaSatiri({
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
    { id: 'yazim' as const, ikon: '✍️', ad: 'yazım', zemin: 'bg-yzm-kart', yazi: 'text-yzm-koyu' },
    { id: 'islem' as const, ikon: '🧮', ad: 'işlem', zemin: 'bg-isl-kart', yazi: 'text-isl-koyu' },
    { id: 'edebiyat' as const, ikon: '📚', ad: 'edebiyat', zemin: 'bg-yzm-kart', yazi: 'text-yzm-koyu' },
  ].filter((c) => dagilim[c.id] > 0)

  return (
    <button
      type="button"
      onClick={onAc}
      className={cn(
        'golge-kart w-full rounded-[22px] bg-card p-3.5 text-left transition',
        'active:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
    >
      <span className="flex items-center gap-3">
        <span className="min-w-[58px] shrink-0 rounded-[16px] bg-primary-soft px-2.5 py-2 text-center">
          <span className="rakam block font-display text-[22px] leading-none font-extrabold text-primary">
            {toplam}
          </span>
          <span className="mt-1 block text-[9.5px] font-extrabold uppercase tracking-[0.12em] text-primary">
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

        {/* Ok daire yerine yazılı düğme: bankaya girmek "ileri gitmek" değil,
            biriken soruları **oynamak** — dokunulduğunda ne olacağı okunsun. */}
        <span
          className="shrink-0 rounded-full bg-ikincil px-4 py-2 text-[13px] font-extrabold text-white"
          aria-hidden
        >
          Oyna
        </span>
      </span>

      {cipler.length > 0 && (
        <span className="mt-3 flex gap-1.5">
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
  )
}

/**
 * Oyun kartı.
 *
 * Rekor hapı yalnızca oynanmış oyunlarda çıkıyor: "Rekor 0" yazan bir hap, hiç
 * denememiş oyuncuya geride kaldığını söylerdi.
 */
function OyunKarti({
  oyun,
  aile,
  rekor,
  genis,
  onAc,
}: {
  oyun: OyunTanimi
  aile: Aile
  rekor: number
  /** İki sütunu birden kaplayan yatay hâl. */
  genis: boolean
  onAc: () => void
}) {
  const [ustSatir, altSatir] = BASLIK_SATIRLARI[oyun.id]

  return (
    <button
      type="button"
      onClick={onAc}
      className={cn(
        'relative rounded-[22px] p-4 text-left transition active:brightness-[0.97]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        aile.zemin,
        genis ? 'col-span-2 flex items-center gap-3.5' : 'flex min-h-[186px] flex-col',
      )}
    >
      {rekor > 0 && (
        <span
          className={cn(
            // Zemin `bg-card`: koyu temada aile rengi açılıyor, beyaz hapın
            // üstünde okunmuyordu. Kart zemini iki temada da yazının karşıt
            // tarafında kalıyor.
            'rakam rounded-full bg-card/85 px-2.5 py-1 text-[10.5px] font-extrabold',
            aile.yazi,
            genis ? 'order-3 shrink-0' : 'absolute right-3.5 top-3.5',
          )}
        >
          Rekor {rekor}
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
}

/**
 * Bölüm kartı — açılınca içindeki oyunlar geliyor.
 *
 * Oyun kartıyla aynı ölçüde ama rekor yerine kaç oyun taşıdığını yazıyor:
 * dokunmadan önce ekranın değişeceği anlaşılmalı, yoksa tur başlıyor sanılır.
 */
function BolumKarti({
  bolum,
  aile,
  oyunSayisi,
  oynananTur,
  genis,
  onAc,
}: {
  bolum: BolumTanimi
  aile: Aile
  oyunSayisi: number
  oynananTur: number
  genis: boolean
  onAc: () => void
}) {
  return (
    <button
      type="button"
      onClick={onAc}
      className={cn(
        'relative rounded-[22px] p-4 text-left transition active:brightness-[0.97]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        aile.zemin,
        genis ? 'col-span-2 flex items-center gap-3.5' : 'flex min-h-[186px] flex-col',
      )}
    >
      <span
        className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[15px] bg-white/80 text-[23px] leading-none"
        aria-hidden
      >
        {bolum.ikon}
      </span>

      <span className={cn('min-w-0', genis ? 'flex-1' : 'mt-2.5')}>
        <span className="block font-display text-[16.5px] font-extrabold leading-[1.15] tracking-tight text-foreground">
          {bolum.ad}
        </span>
        <span className="mt-1.5 block text-[12.5px] font-medium leading-snug text-foreground/60">
          {bolum.aciklama}
        </span>
        <span className={cn('mt-1.5 block text-[11.5px] font-bold', aile.yazi)}>
          {oyunSayisi} oyun
          {oynananTur > 0 && <> · {oynananTur} tur</>}
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
