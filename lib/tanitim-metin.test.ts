import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { TUR_ADIMLARI, type TanitimTuru } from './tanitim'

/*
  Balonun andığı düğme/sekme adı ekranda gerçekten öyle mi yazıyor.

  Balonlar ekran değiştikçe geride kalıyordu: "Başlat’a dokun" derken düğme
  "Başla" olmuştu, "Odak kilidi" derken satırın adı "Odak koruması"ydı. Bu
  test açıklamada kesme işaretiyle ek almış adları (`Kaydet’e`, `Soru
  Takibi’ne`, `Pomodoro ile çalış’ı`) çıkarıyor ve hedefin çizildiği
  dosyada yorum dışı metin olarak arıyor. Dosya, adımın `hedef`ine göre
  aşağıdaki tablodan geliyor; tabloda olmayan hedef testi düşürür (yeni adım
  eklenince buraya da eklensin).
*/
const KAYNAK: Record<string, readonly string[]> = {
  'araclar-ac': ['components/bottom-nav.tsx'],
  'harita-ac': ['components/bottom-nav.tsx'],
  'arac-soru': ['lib/gezinme.ts'],
  'arac-konu-takibi': ['lib/gezinme.ts'],
  'arac-deneme': ['lib/gezinme.ts'],
  'arac-istatistik': ['lib/gezinme.ts'],
  'soru-ekle': ['components/ekranlar/soru-takibi.tsx'],
  'soru-formu': ['components/ekranlar/soru-takibi.tsx'],
  'soru-listesi': ['components/ekranlar/soru-takibi.tsx'],
  'konu-takibi': ['components/ekranlar/konu-takibi.tsx'],
  'deneme-ekle': ['components/ekranlar/denemeler.tsx'],
  'deneme-listesi': ['components/ekranlar/denemeler.tsx'],
  'deneme-okut': ['components/deneme-okut.tsx'],
  'deneme-bos-ders': ['components/ekranlar/yeni-deneme.tsx'],
  'deneme-yanlis-ekle': ['components/ekranlar/yeni-deneme.tsx'],
  'deneme-kaydet': ['components/ekranlar/yeni-deneme.tsx'],
  'gorev-ekle': ['components/ekranlar/yapilacaklar.tsx'],
  'gorev-ad': ['components/ekranlar/yapilacaklar.tsx'],
  'gorev-saat': ['components/ekranlar/yapilacaklar.tsx'],
  'gorev-pomodoro': ['components/ekranlar/yapilacaklar.tsx'],
  'gorev-kaydet': ['components/ekranlar/yapilacaklar.tsx'],
  'gorev-listesi': ['components/ekranlar/yapilacaklar.tsx'],
  'demo-oyun': ['components/tanitim/demo-oyun.tsx'],
  'demo-baslat': ['components/oyun-tanitim.tsx'],
  'demo-zorluk': ['components/oyun-tanitim.tsx'],
  'demo-soru': ['components/oyun-tus-takimi.tsx'],
  'banka-ogrendim': ['components/ekranlar/oyun-bankasi.tsx'],
}

/** Ekrandaki düğme değil, uygulamadaki bir yerin adı: hedefte yazması beklenmez. */
const YER_ADLARI = new Set(['Oyun Bankası'])

/** Yorumlar ayıklanmış kaynak: yalnız yorumda geçen ad ekranda var sayılmasın. */
function kaynakMetni(dosya: string): string {
  return readFileSync(join(process.cwd(), dosya), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
}

/**
 * "Kaydet’e", "Soru Takibi’ne", "Pomodoro ile çalış’ı": kesme işaretinden
 * önceki en çok üç sözcük. Adın nerede başladığı metinden okunamıyor ("Alt
 * menüde Araçlar’a", "Eminsen Öğrendim’le"); büyük harfle başlayan her sondan
 * parça bir aday ve biri ekranda geçiyorsa ad bulunmuş sayılıyor. Sınır:
 * çok sözcüklü adın yalnız ilk sözcüğü değişirse ("Soru Takibi" → "Test
 * Takibi") son parça yine bulunur; bunu yakalamak için ad tablosu gerekirdi.
 */
function anilanAdlar(aciklama: string): string[][] {
  const adlar: string[][] = []
  for (const eslesme of aciklama.matchAll(/((?:\p{L}+ ){0,2}\p{L}+)’\p{Ll}+/gu)) {
    const sozcukler = eslesme[1].split(' ')
    const adaylar = sozcukler.map((_, i) => sozcukler.slice(i).join(' ')).filter((aday) => /^\p{Lu}/u.test(aday))
    if (adaylar.length) adlar.push(adaylar)
  }
  return adlar
}

describe('anilanAdlar', () => {
  it('kesme işaretli adları ve cümle başı adaylarını çıkarır', () => {
    expect(anilanAdlar('Soru Takibi’ne dokun; çözdüklerini burada kaydedersin.')).toEqual([['Soru Takibi', 'Takibi']])
    expect(anilanAdlar('Eminsen Öğrendim’le soruyu kaldırırsın.')).toEqual([['Eminsen Öğrendim', 'Öğrendim']])
    expect(anilanAdlar('Bitince işaretle. Pomodoro ile çalış’ı açtığın görevi satırdan başlat.')).toEqual([['Pomodoro ile çalış']])
    expect(anilanAdlar('Alt menüde Araçlar’a dokun.')).toEqual([['Alt menüde Araçlar', 'Araçlar']])
    expect(anilanAdlar('Ne yapacağını yaz.')).toEqual([])
  })
})

describe('balonun andığı adlar ekranda aynen yazıyor', () => {
  const turlar = Object.keys(TUR_ADIMLARI) as TanitimTuru[]
  const durumlar = turlar.flatMap((tur) => TUR_ADIMLARI[tur].map((adim) => [`${tur}/${adim.kimlik}`, adim] as const))
  it.each(durumlar)('%s', (_, adim) => {
    const metinler = [adim.aciklama, adim.tabletAciklama, adim.ipucu].filter((m): m is string => !!m)
    const adlar = metinler.flatMap(anilanAdlar).filter((adaylar) => !adaylar.some((aday) => YER_ADLARI.has(aday)))
    if (adlar.length === 0) return
    const dosyalar = KAYNAK[adim.hedef]
    expect(dosyalar, `"${adim.hedef}" hedefinin kaynağı tabloda yok`).toBeDefined()
    const kaynak = dosyalar.map(kaynakMetni).join('\n')
    for (const adaylar of adlar) {
      expect(adaylar.some((aday) => kaynak.includes(aday)), `${adaylar.at(-1)} — ${dosyalar.join(', ')}`).toBe(true)
    }
  })
})
