'use client'

import { ChevronRight, School, Search } from 'lucide-react'
import { Alan, Etiket } from '@/components/ui'
import { cn } from '@/lib/utils'
import {
  EN_DUSUK_TABAN_PUAN,
  EN_YUKSEK_TABAN_PUAN,
  KATALOG_VERI_YILI,
  basariSirasiGecerli,
  sayiOku,
  tabanPuanGecerli,
} from '@/lib/hedef-katalog'

/**
 * Üniversite/bölüm seçiminin ortak parçaları.
 *
 * İki yerde birden çiziliyorlar: Araçlar'daki Hedefim ekranı ve kurulumun
 * bölüm adımı. Parçalar bir süre `ekranlar/hedef.tsx` içinde yerel duruyordu;
 * kurulum aynı listeyi göstermeye başlayınca buraya alındılar — ikinci bir
 * kopya, iki listenin zamanla birbirinden ayrılması demekti.
 */

/** Arama kutusu — solunda büyüteç, listeyi süzen tek alan. */
export function AramaAlani({
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
 * altındaki düğme ekrandan çıkardı.
 */
export function Liste({ bos, children }: { bos: string; children: React.ReactNode }) {
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

export function SecimSatiri({
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
export function SecilenSatir({
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

/** Üniversite listesinin boş hâli: arama kutusu boşken ipucu, doluyken "bulamadım". */
export function uniListesiBos(arama: string): string {
  return arama.trim() === '' ? 'Üniversite adını yazmaya başla.' : 'Bu adla üniversite bulamadım.'
}

/**
 * Elle kontrol: katalogdan seçilen bölümün sırası ve taban puanı, kaydetmeden
 * önce düzenlenebilir kutularda.
 *
 * Kutular katalog değeriyle dolu geliyor; kullanıcı yalnızca yanlışsa
 * dokunuyor. Sıra ÖSYM'nin yayımladığı değer ama ETL bir satırı yanlış okumuş
 * olabilir; puan zaten sıradan hesaplanan bir tahmin. Kaydedilen hedef kutudaki
 * değeri tutuyor, ana sayfa ve Hedefim de onu okuyor.
 *
 * Geçersiz değerin kaydını engellemek çağıranın işi (`hedefSayilariGecerli`);
 * burada yalnızca hangi kutunun neden kırmızı olduğu yazıyor — pasif bir
 * düğmenin yanında sebebi yazmayan ekran kullanıcıyı kilitler.
 */
export function HedefKontrolu({
  idOneki,
  tabanPuan,
  basariSirasi,
  onTabanPuan,
  onBasariSirasi,
}: {
  idOneki: string
  tabanPuan: string
  basariSirasi: string
  onTabanPuan: (deger: string) => void
  onBasariSirasi: (deger: string) => void
}) {
  const puanHatali = !tabanPuanGecerli(sayiOku(tabanPuan))
  const siraHatali = !basariSirasiGecerli(sayiOku(basariSirasi))
  return (
    <div className="rounded-xl bg-muted/70 px-3.5 py-3">
      <p className="text-sm font-extrabold">Kaydetmeden önce kontrol et</p>
      <div className="mt-2.5 grid grid-cols-2 gap-3">
        <div>
          <Etiket htmlFor={`${idOneki}-sira`}>{KATALOG_VERI_YILI} başarı sırası</Etiket>
          <Alan
            id={`${idOneki}-sira`}
            inputMode="numeric"
            value={basariSirasi}
            onChange={(e) => onBasariSirasi(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
            aria-invalid={siraHatali}
            className={cn('rakam', siraHatali && 'border-danger focus-visible:border-danger')}
          />
        </div>
        <div>
          <Etiket htmlFor={`${idOneki}-taban`}>Taban puan (tahmini)</Etiket>
          <Alan
            id={`${idOneki}-taban`}
            inputMode="decimal"
            value={tabanPuan}
            onChange={(e) => onTabanPuan(e.target.value.replace(/[^0-9,.]/g, '').slice(0, 7))}
            aria-invalid={puanHatali}
            className={cn('rakam', puanHatali && 'border-danger focus-visible:border-danger')}
          />
        </div>
      </div>
      {(siraHatali || puanHatali) && (
        <p role="alert" className="mt-2 text-xs font-medium text-danger">
          {siraHatali && 'Başarı sırası 1 ya da daha büyük bir tam sayı olmalı. '}
          {puanHatali &&
            `Taban puan ${EN_DUSUK_TABAN_PUAN} ile ${EN_YUKSEK_TABAN_PUAN} arasında olmalı.`}
        </p>
      )}
    </div>
  )
}
