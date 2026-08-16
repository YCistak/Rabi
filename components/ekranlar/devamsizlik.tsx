'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import type { Devamsizlik, DevamsizlikTuru } from '@/lib/types'
import {
  DEVAMSIZLIK_UYARI_ORANI,
  OZURLU_SINIR,
  OZURSUZ_SINIR,
  devamsizlikOzeti,
  egitimYili,
  netYaz,
  tarihYaz,
} from '@/lib/hesap'
import { bugun, cn, tariheCevir, tariheYaz, yeniId } from '@/lib/utils'
import { Alan, BaslikSatiri, Buton, Cip, Kart, Not, Onay } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { Takvim, type GunIsareti } from '@/components/takvim'

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
  const [tur, setTur] = useState<DevamsizlikTuru>('ozursuz')
  const [yarimGun, setYarimGun] = useState(false)
  const [not, setNot] = useState('')
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

  const seciliGunun = kayitlar.filter((k) => k.tarih === secili)

  const ekle = () => {
    setKayitlar((onceki) => [
      ...onceki,
      { id: yeniId(), tarih: secili, tur, yarimGun, not: not.trim() || undefined },
    ])
    setNot('')
    setYarimGun(false)
  }

  const siraliKayitlar = useMemo(
    () => [...kayitlar].sort((a, b) => b.tarih.localeCompare(a.tarih)),
    [kayitlar],
  )

  return (
    <div>
      <BaslikSatiri
        baslik="Devamsızlık"
        aciklama={`${dersYili}-${dersYili + 1} ders yılı`}
      />

      {(ozet.asildi || ozet.uyari) && (
        <Not tur={ozet.asildi ? 'tehlike' : 'uyari'} className="mb-3">
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

      <div className="mb-4 grid grid-cols-2 gap-3">
        <SayacKarti
          baslik="Özürsüz"
          kullanilan={ozet.ozursuz}
          sinir={OZURSUZ_SINIR}
          kalan={ozet.ozursuzKalan}
        />
        <SayacKarti
          baslik="Özürlü"
          kullanilan={ozet.ozurlu}
          sinir={OZURLU_SINIR}
          kalan={ozet.ozurluKalan}
        />
      </div>

      {kayitlar.length === 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-dashed border-border p-4">
          <Rabi durum="mutlu" boyut={56} />
          <p className="text-sm text-muted-foreground">
            Hiç devamsızlığın yok. Takvimden gün seçip aşağıdan ekleyebilirsin.
          </p>
        </div>
      )}

      <Kart className="mb-4">
        <Takvim
          ay={ay}
          onAyDegis={setAy}
          secili={secili}
          onSec={setSecili}
          isaretler={isaretler}
          bugunIso={bugunIso}
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
      </Kart>

      <Kart className="mb-4">
        <p className="mb-2 font-medium">{tarihYaz(secili)}</p>

        {seciliGunun.length > 0 && (
          <ul className="mb-3 space-y-1.5">
            {seciliGunun.map((kayit) => (
              <li
                key={kayit.id}
                className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm"
              >
                <span className="flex-1">
                  {kayit.tur === 'ozursuz' ? 'Özürsüz' : 'Özürlü'}
                  {kayit.yarimGun ? ' · yarım gün' : ''}
                  {kayit.not ? ` · ${kayit.not}` : ''}
                </span>
                <button
                  type="button"
                  aria-label="Kaydı sil"
                  onClick={() => setSilinecek(kayit)}
                  className="text-muted-foreground active:text-danger"
                >
                  <Trash2 size={15} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mb-2 flex flex-wrap gap-2">
          <Cip secili={tur === 'ozursuz'} onClick={() => setTur('ozursuz')}>
            Özürsüz
          </Cip>
          <Cip secili={tur === 'ozurlu'} onClick={() => setTur('ozurlu')}>
            Özürlü (raporlu)
          </Cip>
          <Cip secili={yarimGun} onClick={() => setYarimGun((y) => !y)}>
            Yarım gün
          </Cip>
        </div>

        <div className="flex gap-2">
          <Alan
            value={not}
            onChange={(e) => setNot(e.target.value)}
            placeholder="Not (isteğe bağlı)"
            aria-label="Devamsızlık notu"
            className="flex-1"
          />
          <Buton onClick={ekle}>Ekle</Buton>
        </div>
      </Kart>

      {siraliKayitlar.length > 0 && (
        <Kart className="p-0">
          <p className="px-4 py-3 font-medium">Tüm kayıtlar</p>
          <ul>
            {siraliKayitlar.map((kayit) => (
              <li
                key={kayit.id}
                className="flex items-center gap-2 border-t border-border px-4 py-2.5 text-sm"
              >
                <span
                  aria-hidden
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    kayit.tur === 'ozursuz' ? 'bg-danger' : 'bg-warning',
                  )}
                />
                <span className="flex-1 truncate">
                  {tarihYaz(kayit.tarih)}
                  {kayit.not ? ` · ${kayit.not}` : ''}
                </span>
                <span className="rakam shrink-0 text-xs text-muted-foreground">
                  {kayit.yarimGun ? '0,5' : '1'} gün
                </span>
                <button
                  type="button"
                  aria-label="Kaydı sil"
                  onClick={() => setSilinecek(kayit)}
                  className="shrink-0 text-muted-foreground active:text-danger"
                >
                  <Trash2 size={15} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </Kart>
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

function SayacKarti({
  baslik,
  kullanilan,
  sinir,
  kalan,
}: {
  baslik: string
  kullanilan: number
  sinir: number
  kalan: number
}) {
  const oran = Math.min(1, kullanilan / sinir)
  const asildi = kalan < 0
  const uyari = !asildi && oran >= DEVAMSIZLIK_UYARI_ORANI

  return (
    <Kart>
      <p className="text-xs text-muted-foreground">{baslik}</p>
      <p className="font-display text-2xl font-semibold">
        <span className={cn('rakam', asildi && 'text-danger', uyari && 'text-warning')}>
          {netYaz(kullanilan, kullanilan % 1 === 0 ? 0 : 1)}
        </span>
        <span className="rakam text-sm font-normal text-muted-foreground"> / {sinir}</span>
      </p>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            asildi ? 'bg-danger' : uyari ? 'bg-warning' : 'bg-primary',
          )}
          style={{ width: `${oran * 100}%` }}
        />
      </div>

      <p className="mt-1.5 text-xs text-muted-foreground">
        {asildi
          ? `${netYaz(Math.abs(kalan), Math.abs(kalan) % 1 === 0 ? 0 : 1)} gün aşıldı`
          : `${netYaz(kalan, kalan % 1 === 0 ? 0 : 1)} gün hakkın kaldı`}
      </p>
    </Kart>
  )
}
