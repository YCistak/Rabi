'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, CalendarDays, Plus, X } from 'lucide-react'
import type { Devamsizlik, DevamsizlikTuru } from '@/lib/types'
import {
  OZURLU_SINIR,
  OZURSUZ_SINIR,
  devamsizlikOzeti,
  egitimYili,
  netYaz,
  tarihYaz,
} from '@/lib/hesap'
import { bugun, cn, tariheCevir, tariheYaz, yeniId } from '@/lib/utils'
import { Alan, BaslikSatiri, Buton, Kart, Not, Onay, SecimSatiri } from '@/components/ui'
import { Takvim, type GunIsareti } from '@/components/takvim'
import { useGeriKatmani } from '@/lib/geri'

const GUN_ADLARI = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz']

const AY_ADLARI = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

/** Notun tavanı: liste satırında tek satıra sığması gereken bir hatırlatma. */
const NOT_SINIRI = 32

/** "12 Eylül" — başlıkta ve düğme metninde yıl gereksiz, takvim zaten söylüyor. */
function kisaYaz(iso: string): string {
  const d = tariheCevir(iso)
  return `${d.getDate()} ${AY_ADLARI[d.getMonth()]}`
}

/** Yarım günler yüzünden sayı ondalıklı olabiliyor; tam sayıda basamak yazılmıyor. */
function gunYaz(deger: number): string {
  return netYaz(deger, deger % 1 === 0 ? 0 : 1)
}

/**
 * Devamsızlık (`tasarim/devamsizlik.dc.html` → 1b).
 *
 * Omurga Soru Takibi'nin ritmi: tek bir "kalan hakkın" kartı, seçili günün
 * hafta şeridi (altında katlanabilir ay takvimi) ve tek bir ekleme düğmesi.
 * Ay takvimi eskiden ekranın ortasında sürekli açıktı ve altındaki giriş
 * kartını ekranın dışına itiyordu; hafta şeridi son yedi güne bakmaya yetiyor,
 * daha eskisi için takvim açılıyor.
 *
 * İki sayaç kartı da tek karta indi: ikisi yan yana aynı cümleyi iki kez
 * kuruyordu ("kullanılan / sınır" + "kalan"), oysa sorulan tek şey kaç gün
 * hakkın kaldığı.
 */
export function DevamsizlikEkrani({
  kayitlar,
  setKayitlar,
}: {
  kayitlar: Devamsizlik[]
  setKayitlar: (guncelleyici: Devamsizlik[] | ((onceki: Devamsizlik[]) => Devamsizlik[])) => void
}) {
  const bugunIso = bugun()
  const [secili, setSecili] = useState(bugunIso)
  const [ay, setAy] = useState(() => tariheCevir(bugunIso))
  const [takvimAcik, setTakvimAcik] = useState(false)
  const [panelAcik, setPanelAcik] = useState(false)
  const [silinecek, setSilinecek] = useState<Devamsizlik | null>(null)

  // Devamsızlık hakkı her ders yılında sıfırlanır; geçmiş yılların kaydı
  // listede durur ama sayaca girmez.
  const dersYili = egitimYili()
  const buYilinKayitlari = useMemo(
    () => kayitlar.filter((k) => egitimYili(tariheCevir(k.tarih)) === dersYili),
    [kayitlar, dersYili],
  )
  const ozet = useMemo(() => devamsizlikOzeti(buYilinKayitlari), [buYilinKayitlari])

  const isaretler = useMemo(() => {
    const harita = new Map<string, GunIsareti>()
    for (const kayit of kayitlar) {
      harita.set(kayit.tarih, { doluluk: 0, nokta: kayit.tur })
    }
    return harita
  }, [kayitlar])

  // Seçili günün haftası, pazartesiden başlayarak.
  const hafta = useMemo(() => {
    const gun = tariheCevir(secili)
    const pazartesi = new Date(
      gun.getFullYear(),
      gun.getMonth(),
      gun.getDate() - ((gun.getDay() + 6) % 7),
    )
    return Array.from({ length: 7 }, (_, i) => {
      const tarih = new Date(pazartesi.getFullYear(), pazartesi.getMonth(), pazartesi.getDate() + i)
      const iso = tariheYaz(tarih)
      return {
        iso,
        ad: GUN_ADLARI[i],
        sayi: tarih.getDate(),
        etiket: `${tarih.getDate()} ${AY_ADLARI[tarih.getMonth()]}`,
        kayit: kayitlar.find((k) => k.tarih === iso),
      }
    })
  }, [secili, kayitlar])

  const haftaToplami = useMemo(() => {
    const haftaninGunleri = new Set(hafta.map((g) => g.iso))
    const h = devamsizlikOzeti(kayitlar.filter((k) => haftaninGunleri.has(k.tarih)))
    return h.ozursuz + h.ozurlu
  }, [hafta, kayitlar])

  /**
   * Gelecek güne devamsızlık girilemez.
   *
   * Takvim o günleri zaten kapatıyor; buradaki ikinci kontrol, ekran açıkken
   * gece yarısının geçtiği (seçili gün bugünken yarına dönüştüğü) durum için.
   */
  const gelecekGun = secili > bugunIso

  /**
   * Bir güne yalnızca bir kayıt.
   *
   * İkincisi eklenebiliyordu ve sayaç aynı günü iki kez düşüyordu: yarım gün +
   * yarım gün "bir gün" değil, aynı günün iki kaydı. Değiştirmek isteyen
   * mevcut kaydı siliyor — kaydın kendi çöp kutusu listedeki satırın yanında.
   */
  const seciliGununKaydi = kayitlar.find((k) => k.tarih === secili)

  const gunSec = (iso: string) => {
    setSecili(iso)
    setAy(tariheCevir(iso))
  }

  const ekle = (tur: DevamsizlikTuru, yarimGun: boolean, not: string) => {
    if (gelecekGun || seciliGununKaydi) return
    setKayitlar((onceki) => [
      ...onceki,
      { id: yeniId(), tarih: secili, tur, yarimGun, not: not.trim() || undefined },
    ])
    setPanelAcik(false)
  }

  const siraliKayitlar = useMemo(
    () => [...kayitlar].sort((a, b) => b.tarih.localeCompare(a.tarih)),
    [kayitlar],
  )

  return (
    <div>
      <BaslikSatiri baslik="Devamsızlık" aciklama={`${dersYili}-${dersYili + 1} ders yılı`} />

      <div className="flex flex-col gap-3.5">
        {(ozet.asildi || ozet.uyari) && (
          <Not tur={ozet.asildi ? 'tehlike' : 'uyari'} className="rounded-[18px]">
            <span className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                {ozet.asildi
                  ? 'Devamsızlık hakkını aştın. Okul rehberliğiyle görüşmeni öneririm — rapor veya izin belgesiyle düzeltilebilen durumlar olabilir.'
                  : 'Sınıra yaklaştın. Kalan günlerini dikkatli kullan.'}
              </span>
            </span>
          </Not>
        )}

        {/* Kalan hak: iki çubuk, tek kart. */}
        <Kart className="rounded-3xl">
          <div className="mb-3 flex items-baseline gap-2">
            <p className="font-display text-[17px] font-extrabold tracking-tight">Kalan hakkın</p>
            <p className="rakam ml-auto text-[12.5px] font-bold text-muted-foreground">
              {gunYaz(ozet.ozursuz + ozet.ozurlu)} / {OZURSUZ_SINIR + OZURLU_SINIR} gün kullanıldı
            </p>
          </div>

          <HakCubugu
            baslik="Özürsüz"
            kullanilan={ozet.ozursuz}
            sinir={OZURSUZ_SINIR}
            asildi={ozet.ozursuzKalan < 0}
          />
          <div className="mt-3">
            <HakCubugu
              baslik="Özürlü"
              kullanilan={ozet.ozurlu}
              sinir={OZURLU_SINIR}
              asildi={ozet.ozurluKalan < 0}
            />
          </div>
        </Kart>

        {/* Hafta şeridi; takvim altında katlanıyor. */}
        <Kart className="rounded-3xl px-3 pb-3 pt-3.5">
          <div className="flex items-baseline gap-2 px-1 pb-2.5">
            <p className="font-display text-[15px] font-extrabold tracking-tight">Bu hafta</p>
            <p className="rakam text-[12.5px] font-bold text-muted-foreground/70">
              {haftaToplami === 0 ? 'devamsızlık yok' : `${gunYaz(haftaToplami)} gün`}
            </p>
            <button
              type="button"
              onClick={() => {
                setTakvimAcik((o) => !o)
                setAy(tariheCevir(secili))
              }}
              aria-expanded={takvimAcik}
              aria-label={takvimAcik ? 'Takvimi kapat' : 'Takvimi aç'}
              className={cn(
                'ml-auto inline-flex h-8 w-8 items-center justify-center self-center rounded-[11px] transition-colors',
                takvimAcik
                  ? 'bg-primary-soft text-primary'
                  : 'bg-muted/60 text-muted-foreground active:bg-muted',
              )}
            >
              <CalendarDays size={17} aria-hidden />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {hafta.map((g) => {
              const kapali = g.iso > bugunIso
              const seciliMi = g.iso === secili
              return (
                <button
                  key={g.iso}
                  type="button"
                  onClick={() => gunSec(g.iso)}
                  disabled={kapali}
                  aria-pressed={seciliMi}
                  aria-label={`${g.etiket}${kapali ? ' — henüz gelmedi' : ''}`}
                  className={cn(
                    'relative flex flex-col items-center gap-1.5 rounded-2xl pb-3.5 pt-2 transition-colors',
                    seciliMi && 'bg-primary-soft',
                  )}
                >
                  <span
                    className={cn(
                      'text-[10px] font-bold tracking-wide',
                      seciliMi
                        ? 'text-primary'
                        : kapali
                          ? 'text-muted-foreground/45'
                          : 'text-muted-foreground/80',
                    )}
                  >
                    {g.ad}
                  </span>
                  <span
                    className={cn(
                      'rakam text-[15px] font-extrabold leading-none',
                      seciliMi
                        ? 'text-primary'
                        : kapali
                          ? 'text-muted-foreground/45'
                          : 'text-foreground',
                    )}
                  >
                    {g.sayi}
                  </span>
                  {g.kayit && (
                    <span
                      aria-hidden
                      className={cn(
                        'absolute bottom-1.5 size-[5px] rounded-full',
                        g.kayit.tur === 'ozursuz' ? 'bg-danger' : 'bg-warning',
                      )}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {takvimAcik && (
            <div className="acilir-giris mt-3.5 border-t border-border/70 pt-3">
              <Takvim
                ay={ay}
                onAyDegis={setAy}
                secili={secili}
                onSec={gunSec}
                isaretler={isaretler}
                bugunIso={bugunIso}
                enGecIso={bugunIso}
              />
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-danger" aria-hidden />
                  özürsüz
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden />
                  özürlü
                </span>
              </div>
            </div>
          )}
        </Kart>

        {gelecekGun ? (
          <Not tur="uyari" className="rounded-2xl text-center text-[13px] font-extrabold">
            Bu gün henüz gelmedi
          </Not>
        ) : seciliGununKaydi ? (
          // Dolu günde düğme yerine şerit: pasif bir düğme neden basılamadığını
          // söylemiyor, kaydı değiştirmenin yolu da aşağıdaki listede.
          <Not tur="bilgi" className="rounded-2xl text-center text-[13px] font-extrabold">
            {kisaYaz(secili)} zaten kayıtlı
          </Not>
        ) : (
          <Buton
            onClick={() => setPanelAcik(true)}
            className="h-[54px] w-full rounded-[18px] text-base shadow-[0_8px_18px_rgba(217,98,47,0.24)]"
          >
            <Plus size={19} strokeWidth={2.8} aria-hidden />
            {kisaYaz(secili)} için devamsızlık ekle
          </Buton>
        )}

        <Kart className="overflow-hidden rounded-3xl p-0">
          <div className="flex items-baseline gap-2 px-4 pb-3 pt-3.5">
            <p className="font-display text-[15px] font-extrabold tracking-tight">Tüm kayıtlar</p>
            <p className="rakam ml-auto text-[12.5px] font-bold text-muted-foreground">
              {siraliKayitlar.length} kayıt
            </p>
          </div>

          {siraliKayitlar.length === 0 ? (
            <p className="px-4 pb-4 text-[13px] leading-relaxed text-muted-foreground">
              Bu ders yılında hiç devamsızlığın yok. Takvimden bir gün seçip ekleyebilirsin.
            </p>
          ) : (
            <ul>
              {siraliKayitlar.map((kayit) => {
                const ozursuz = kayit.tur === 'ozursuz'
                return (
                  <li
                    key={kayit.id}
                    className={cn(
                      'flex items-center gap-2.5 border-t border-border px-4 py-2.5',
                      ozursuz ? 'bg-danger-soft/40' : 'bg-warning-soft/40',
                    )}
                  >
                    <span
                      className={cn(
                        'w-[62px] shrink-0 rounded-full py-1 text-center text-[11px] font-extrabold',
                        ozursuz
                          ? 'bg-danger/12 text-danger'
                          : 'bg-warning/14 text-warning',
                      )}
                    >
                      {ozursuz ? 'Özürsüz' : 'Özürlü'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block truncate text-[13.5px] font-extrabold',
                          ozursuz ? 'text-danger' : 'text-warning',
                        )}
                      >
                        {tarihYaz(kayit.tarih)}
                      </span>
                      {kayit.not && (
                        <span className="mt-px block truncate text-[11.5px] font-bold text-muted-foreground">
                          {kayit.not}
                        </span>
                      )}
                    </span>
                    <span className="rakam shrink-0 text-xs font-bold text-muted-foreground">
                      {kayit.yarimGun ? '0,5' : '1'} gün
                    </span>
                    <button
                      type="button"
                      aria-label="Kaydı sil"
                      onClick={() => setSilinecek(kayit)}
                      className="-mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-[10px] text-muted-foreground/70 active:bg-danger-soft active:text-danger"
                    >
                      <X size={16} aria-hidden />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Kart>
      </div>

      {panelAcik && (
        <DevamsizlikEkleSayfasi
          tarih={secili}
          onKapat={() => setPanelAcik(false)}
          onKaydet={ekle}
        />
      )}

      <Onay
        acik={silinecek !== null}
        baslik="Kayıt silinsin mi?"
        aciklama={
          silinecek
            ? `${tarihYaz(silinecek.tarih)} tarihli ${
                silinecek.tur === 'ozursuz' ? 'özürsüz' : 'özürlü'
              } devamsızlık kaydı silinecek.`
            : ''
        }
        onOnayla={() =>
          silinecek && setKayitlar((onceki) => onceki.filter((k) => k.id !== silinecek.id))
        }
        onIptal={() => setSilinecek(null)}
      />
    </div>
  )
}

/**
 * Bir hakkın çubuğu: ad, çubuk, "kullanılan / sınır".
 *
 * Dolgu normalde markanın dolgu tonunda; yalnızca hak aşıldığında kırmızıya
 * dönüyor. Uyarı eşiği çubuğa yazılmıyor — onu kartın üstündeki şerit zaten
 * cümleyle söylüyor ve iki ayrı yerde sarıya dönen bir ekran, hangisinin
 * uyardığını belirsiz bırakıyordu.
 */
function HakCubugu({
  baslik,
  kullanilan,
  sinir,
  asildi,
}: {
  baslik: string
  kullanilan: number
  sinir: number
  asildi: boolean
}) {
  const oran = Math.min(1, kullanilan / sinir)

  return (
    <div className="flex items-center gap-2.5">
      <p className="w-16 shrink-0 text-[12.5px] font-bold text-muted-foreground">{baslik}</p>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-400',
            asildi ? 'bg-danger' : 'bg-primary-parlak',
          )}
          style={{ width: `${Math.round(oran * 100)}%` }}
        />
      </div>
      <p className="rakam shrink-0 text-[15px] font-black text-primary">
        {gunYaz(kullanilan)}
        <span className="rakam text-xs font-bold text-muted-foreground"> / {sinir}</span>
      </p>
    </div>
  )
}

/** Ekleme alt sayfası: tür, yarım gün ve not. */
function DevamsizlikEkleSayfasi({
  tarih,
  onKapat,
  onKaydet,
}: {
  tarih: string
  onKapat: () => void
  onKaydet: (tur: DevamsizlikTuru, yarimGun: boolean, not: string) => void
}) {
  useGeriKatmani(true, onKapat)
  const [tur, setTur] = useState<DevamsizlikTuru>('ozursuz')
  const [yarimGun, setYarimGun] = useState(false)
  const [not, setNot] = useState('')

  return (
    <div
      className="katman-zemin fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onKapat}
    >
      <div
        className="alt-pencere-girisi max-h-[76%] w-full max-w-md overflow-y-auto rounded-t-[26px] bg-card px-4 pt-3 pb-[calc(1.5rem+var(--guvenli-alt))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-[42px] rounded-full bg-border" />
        <div className="mb-3.5 flex items-center gap-2.5">
          <p className="font-display text-lg font-extrabold tracking-tight">Devamsızlık ekle</p>
          <p className="ml-auto text-[12.5px] font-bold text-muted-foreground/70">
            {kisaYaz(tarih)}
          </p>
          <button
            type="button"
            onClick={onKapat}
            aria-label="Kapat"
            className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground active:bg-muted"
          >
            <X size={16} strokeWidth={2.4} aria-hidden />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <SecimSatiri
            ad="Özürsüz"
            ornek={`Kalan ${OZURSUZ_SINIR} günden düşer`}
            secili={tur === 'ozursuz'}
            onClick={() => setTur('ozursuz')}
          />
          <SecimSatiri
            ad="Özürlü (raporlu)"
            ornek={`Kalan ${OZURLU_SINIR} günden düşer`}
            secili={tur === 'ozurlu'}
            onClick={() => setTur('ozurlu')}
          />
        </div>

        <label className="mt-3 flex cursor-pointer items-center gap-3 px-1 py-2.5">
          <input
            type="checkbox"
            checked={yarimGun}
            onChange={(e) => setYarimGun(e.target.checked)}
            className="size-5 shrink-0 accent-[var(--primary)]"
          />
          <span className="text-sm font-bold">Yarım gün</span>
        </label>

        <div className="relative">
          <Alan
            value={not}
            onChange={(e) => setNot(e.target.value.slice(0, NOT_SINIRI))}
            maxLength={NOT_SINIRI}
            placeholder="Not (isteğe bağlı)"
            aria-label="Devamsızlık notu"
            className="h-12 rounded-[18px] pr-[58px]"
          />
          <span
            aria-hidden
            className={cn(
              'rakam pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[11.5px] font-bold',
              not.length >= NOT_SINIRI ? 'text-primary' : 'text-muted-foreground/65',
            )}
          >
            {not.length}/{NOT_SINIRI}
          </span>
        </div>

        <Buton
          onClick={() => onKaydet(tur, yarimGun, not)}
          className="mt-3.5 h-[52px] w-full rounded-[17px] text-base"
        >
          Kaydet
        </Buton>
      </div>
    </div>
  )
}
