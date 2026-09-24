'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Pencil,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { BaslikSatiri, BosDurum, Buton, Kart, Onay, SuzgecKutusu } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { netYaz, tarihYaz } from '@/lib/hesap'
import {
  denemeSatirlari,
  mevcutTurler,
  suzVeSirala,
  SIRALAMA_ADLARI,
  SIRALAMA_SIRASI,
  TUR_ADLARI,
  type DenemeSatiri,
  type DenemeSiralamasi,
  type DenemeSuzgeci,
} from '@/lib/deneme-liste'
import { cn } from '@/lib/utils'
import type { Deneme, Sablon, SablonTuru } from '@/lib/types'

export function DenemelerEkrani({
  denemeler,
  sablonlar,
  hazir,
  onSil,
  onDuzenle,
  onYeniyeGit,
}: {
  denemeler: Deneme[]
  sablonlar: Sablon[]
  hazir: boolean
  onSil: (id: string) => void
  onDuzenle: (deneme: Deneme) => void
  onYeniyeGit: () => void
}) {
  const [acikId, setAcikId] = useState<string | null>(null)
  const [silinecek, setSilinecek] = useState<Deneme | null>(null)
  const [suzgec, setSuzgec] = useState<DenemeSuzgeci>('hepsi')
  const [sira, setSira] = useState<DenemeSiralamasi>('yeni')

  // Değişim tarih sırasına göre çıkar; süzme ve sıralama bunun üstüne uygulanır.
  const satirlar = useMemo(() => denemeSatirlari(denemeler, sablonlar), [denemeler, sablonlar])
  const turler = useMemo(() => mevcutTurler(satirlar), [satirlar])
  const kartlar = useMemo(() => suzVeSirala(satirlar, suzgec, sira), [satirlar, suzgec, sira])

  // Kayıtlı tek tür varsa çipler seçim sunmuyor; boş yere yer kaplamasın.
  const suzgecGorunsun = turler.length > 1

  if (!hazir) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />
  }

  return (
    <div>
      <BaslikSatiri arac="deneme" baslik="Denemeler" />

      {/* İlk kayıtta düğme boş durumun içinde, ekranın ortasında duruyor; liste
          doluyken oraya ulaşmak kaydırmak demek, o yüzden başlığın altına geçiyor. */}
      {satirlar.length > 0 && (
        <Buton onClick={onYeniyeGit} className="mb-3 w-full">
          <Plus size={18} />
          Deneme ekle
        </Buton>
      )}

      {satirlar.length > 0 && (
        <SuzgecCubugu
          turler={turler}
          turlerGorunsun={suzgecGorunsun}
          suzgec={suzgec}
          sira={sira}
          sayilar={satirlar}
          onSuzgec={setSuzgec}
          onSira={setSira}
        />
      )}

      {suzgec !== 'hepsi' && satirlar.length > 0 && kartlar.length === 0 ? (
        <BosDurum
          simge={<Rabi durum="normal" poz="tam" boyut={96} />}
          baslik="Bu türde deneme yok"
          aciklama={`${TUR_ADLARI[suzgec]} denemesi kaydetmemişsin. Süzgeci kaldırıp hepsine bakabilirsin.`}
          eylem={<Buton onClick={() => setSuzgec('hepsi')}>Tümünü göster</Buton>}
        />
      ) : kartlar.length === 0 ? (
        <BosDurum
          simge={<Rabi durum="uykulu" poz="kahveli" boyut={96} />}
          baslik="Kayıtlı deneme yok"
          aciklama="İlk denemeni ekle. Girdiğin doğru ve yanlışlardan netini hesaplar, sonrakilerle karşılaştırır."
          eylem={
            <Buton onClick={onYeniyeGit}>
              <Plus size={18} />
              Deneme ekle
            </Buton>
          }
        />
      ) : (
        <ul className="space-y-3">
          {kartlar.map(({ deneme, sablon, ozet, degisim }) => {
            const acik = acikId === deneme.id

            return (
              <li key={deneme.id}>
                <Kart className="p-0">
                  <button
                    type="button"
                    onClick={() => setAcikId(acik ? null : deneme.id)}
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    {/* Tür ile tarih ayrı iki vurgu (`tasarim/denemeler-etiket.dc.html`,
                        3a). Bir süre ikisi tek gri satırda "7 Eylül 2026 · TYT"
                        diye duruyordu; listede bir denemeyi ararken bakılan iki
                        şey tam bunlar ve soluk bir satırın içinde kayboluyorlardı.
                        Tür önde ve büyük harfle: sıralama tarihe göre olsa da
                        göz önce hangi sınav olduğunu arıyor. */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[17px] font-extrabold leading-6 tracking-[-0.01em]">
                        {deneme.ad}
                      </p>
                      <p className="mt-[3px] flex items-baseline gap-2 text-[13px] leading-[18px]">
                        <span
                          className={cn(
                            'truncate text-xs font-black tracking-[0.08em]',
                            sablon ? 'text-primary' : 'text-muted-foreground',
                          )}
                        >
                          {(sablon ? sablon.ad : 'Şablon silinmiş').toLocaleUpperCase('tr-TR')}
                        </span>
                        <span className="shrink-0 font-bold text-foreground">
                          {tarihYaz(deneme.tarih)}
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="rakam text-xl font-semibold">
                        {ozet ? netYaz(ozet.toplamNet) : '—'}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          net
                        </span>
                      </p>
                      {degisim !== null && degisim !== 0 && (
                        <p
                          className={cn(
                            'flex items-center justify-end gap-0.5 text-xs font-medium',
                            degisim > 0 ? 'text-success' : 'text-danger',
                          )}
                        >
                          {degisim > 0 ? (
                            <TrendingUp size={13} />
                          ) : (
                            <TrendingDown size={13} />
                          )}
                          {degisim > 0 ? '+' : '−'}
                          {netYaz(Math.abs(degisim))}
                        </p>
                      )}
                    </div>

                    <ChevronDown
                      size={18}
                      className={cn(
                        'shrink-0 text-muted-foreground transition-transform',
                        acik && 'rotate-180',
                      )}
                    />
                  </button>

                  {acik && ozet && sablon && (
                    <>
                      <div className="mx-4 border-t-[1.5px] border-dashed border-border" />
                      <div className="px-4 pb-4 pt-3.5">
                        {/* Tablo değil ızgara: başlık ve Toplam satırları
                            köşeleri yuvarlatılmış birer şerit ve `<tr>`ye köşe
                            yuvarlatması verilemiyor. D yeşil, Y kırmızı — sütun
                            başlığı tek harf olduğu için renk okumayı hızlandırıyor. */}
                        <div
                          role="table"
                          className="rakam grid grid-cols-[minmax(0,1fr)_40px_40px_44px_60px] text-sm leading-5"
                        >
                          <div role="row" className="contents">
                            {['Ders', 'D', 'Y', 'Boş', 'Net'].map((ad, i, hepsi) => (
                              <div
                                key={ad}
                                role="columnheader"
                                className={cn(
                                  'bg-background py-[7px] text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground',
                                  i === 0 ? 'rounded-l-[10px] pl-2.5 text-left' : 'text-right',
                                  i === hepsi.length - 1 && 'rounded-r-[10px] pr-2.5',
                                )}
                              >
                                {ad}
                              </div>
                            ))}
                          </div>
                          {sablon.dersler.map((ders) => {
                            const sonuc = deneme.sonuclar.find((s) => s.dersId === ders.id)
                            const dogru = sonuc?.dogru ?? 0
                            const yanlis = sonuc?.yanlis ?? 0
                            const hucre = 'border-t border-border/70 py-[9px]'
                            return (
                              <div key={ders.id} role="row" className="contents">
                                <div role="cell" className={cn(hucre, 'truncate pl-2.5 font-bold')}>
                                  {ders.ad}
                                </div>
                                <div role="cell" className={cn(hucre, 'text-right font-extrabold text-success')}>
                                  {dogru}
                                </div>
                                <div role="cell" className={cn(hucre, 'text-right font-extrabold text-danger')}>
                                  {yanlis}
                                </div>
                                <div role="cell" className={cn(hucre, 'text-right font-semibold text-muted-foreground')}>
                                  {ders.soruSayisi - dogru - yanlis}
                                </div>
                                <div role="cell" className={cn(hucre, 'pr-2.5 text-right font-extrabold')}>
                                  {netYaz(ozet.dersNetleri[ders.id] ?? 0)}
                                </div>
                              </div>
                            )
                          })}
                          <div role="row" className="contents">
                            {[
                              'Toplam',
                              String(ozet.toplamDogru),
                              String(ozet.toplamYanlis),
                              String(ozet.toplamBos),
                              netYaz(ozet.toplamNet),
                            ].map((deger, i, hepsi) => (
                              <div
                                key={i}
                                role="cell"
                                className={cn(
                                  'mt-1 bg-primary-soft py-[9px] font-black text-primary',
                                  i === 0 ? 'rounded-l-[10px] pl-2.5' : 'text-right',
                                  i === hepsi.length - 1 && 'rounded-r-[10px] pr-2.5',
                                )}
                              >
                                {deger}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Düzenle dolu, Sil açık kırmızı zeminli: ikisi yan yana
                            ama ağırlıkları ayrı — hangisinin sık kullanıldığı ve
                            hangisinin geri alınamadığı düğmenin kendisinde okunuyor. */}
                        <div className="mt-3.5 flex gap-2.5">
                          <Buton
                            className="h-[42px] flex-1 rounded-xl text-sm font-extrabold"
                            onClick={() => onDuzenle(deneme)}
                          >
                            <Pencil size={15} />
                            Düzenle
                          </Buton>
                          <Buton
                            bicim="tehlike"
                            className="h-[42px] flex-1 rounded-xl bg-danger-soft text-sm font-extrabold active:brightness-95"
                            onClick={() => setSilinecek(deneme)}
                          >
                            <Trash2 size={15} />
                            Sil
                          </Buton>
                        </div>
                      </div>
                    </>
                  )}
                </Kart>
              </li>
            )
          })}
        </ul>
      )}

      <Onay
        acik={silinecek !== null}
        baslik="Deneme silinsin mi?"
        aciklama={`"${silinecek?.ad}" kaydı ve netleri kalıcı olarak silinecek.`}
        onOnayla={() => silinecek && onSil(silinecek.id)}
        onIptal={() => setSilinecek(null)}
      />
    </div>
  )
}

/**
 * Liste başındaki süzgeç ve sıralama çubuğu.
 *
 * Süzgeç çip olarak duruyor (tek dokunuş, hep görünür), sıralama ise açılır bir
 * listede: dört seçeneğin dördü de çip olsaydı satır iki kat yer kaplar ve
 * hangisinin açık olduğu kalabalıkta kaybolurdu.
 */
function SuzgecCubugu({
  turler,
  turlerGorunsun,
  suzgec,
  sira,
  sayilar,
  onSuzgec,
  onSira,
}: {
  turler: SablonTuru[]
  turlerGorunsun: boolean
  suzgec: DenemeSuzgeci
  sira: DenemeSiralamasi
  /** Çiplerin yanındaki sayıyı çıkarmak için tüm satırlar. */
  sayilar: DenemeSatiri[]
  onSuzgec: (suzgec: DenemeSuzgeci) => void
  onSira: (sira: DenemeSiralamasi) => void
}) {
  const [menuAcik, setMenuAcik] = useState(false)

  return (
    <div className="mb-3 space-y-2">
      {turlerGorunsun && (
        // Tür sayısı arttıkça çipler taşabilir; alt alta sarmak yerine yatay
        // kaydırma tercih edildi — sıralama düğmesi hep aynı hizada kalsın.
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
          <SuzgecKutusu secili={suzgec === 'hepsi'} onClick={() => onSuzgec('hepsi')}>
            Tümü
            <span className="rakam ml-1 opacity-70">{sayilar.length}</span>
          </SuzgecKutusu>
          {turler.map((tur) => (
            <SuzgecKutusu key={tur} secili={suzgec === tur} onClick={() => onSuzgec(tur)}>
              {TUR_ADLARI[tur]}
              <span className="rakam ml-1 opacity-70">
                {sayilar.filter((s) => s.sablon?.tur === tur).length}
              </span>
            </SuzgecKutusu>
          ))}
        </div>
      )}

      <div className="relative flex items-center gap-2">
        {/* Düğmenin üstünde yalnızca seçili sıra yazıyor; ne işe yaradığını
            söyleyen tek yer bu etiket. */}
        <span className="shrink-0 text-sm text-muted-foreground">Filtrele</span>
        <button
          type="button"
          onClick={() => setMenuAcik((a) => !a)}
          aria-expanded={menuAcik}
          className={cn(
            'flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-left text-sm font-bold transition',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-muted',
          )}
        >
          <ArrowUpDown size={16} className="shrink-0 text-muted-foreground" aria-hidden />
          <span className="min-w-0 flex-1 truncate">{SIRALAMA_ADLARI[sira]}</span>
          <ChevronDown
            size={16}
            aria-hidden
            className={cn('shrink-0 text-muted-foreground transition-transform', menuAcik && 'rotate-180')}
          />
        </button>

        {menuAcik && (
          <>
            {/* Dışarı dokunuş menüyü kapatsın; mobilde "başka yere bas" beklenen davranış. */}
            <button
              type="button"
              aria-hidden
              tabIndex={-1}
              onClick={() => setMenuAcik(false)}
              className="fixed inset-0 z-20 cursor-default"
            />
            <ul className="absolute inset-x-0 top-[calc(100%+4px)] z-30 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg">
              {SIRALAMA_SIRASI.map((secenek) => (
                <li key={secenek}>
                  <button
                    type="button"
                    onClick={() => {
                      onSira(secenek)
                      setMenuAcik(false)
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm active:bg-muted',
                      secenek === sira ? 'font-bold text-primary' : 'font-medium',
                    )}
                  >
                    <Check
                      size={16}
                      aria-hidden
                      className={cn('shrink-0', secenek === sira ? 'opacity-100' : 'opacity-0')}
                    />
                    {SIRALAMA_ADLARI[secenek]}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

