import { KesirYazisi } from '@/components/kesir-yazisi'
import { simgeleriParcala } from '@/lib/soru-bankasi/metin'

function Satir({ metin }: { metin: string }) {
  return <>{simgeleriParcala(metin).map((parca, sira) => {
    if (parca.tur === 'ust') return <sup key={sira} className="text-[0.72em]">{parca.metin}</sup>
    if (parca.tur === 'alt') return <sub key={sira} className="text-[0.72em]">{parca.metin}</sub>
    return <KesirYazisi key={sira} metin={parca.metin} />
  })}</>
}

/** Satır sonunu korur; soru metni dar ekranda asla küçültülmez. */
export function SoruMetni({ metin, className }: { metin: string; className?: string }) {
  return <span className={className}>{metin.split('\n').map((satir, sira) => <span key={sira} className="block">{sira > 0 && <br />}<Satir metin={satir} /></span>)}</span>
}
