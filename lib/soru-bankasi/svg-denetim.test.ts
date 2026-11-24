import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { BANKA_DIZINLERI } from './dizin'
import { gorselHatasi } from './gorsel-denetim'
import { sekilYuksekligi } from './sayfa'
import { svgHatasi, svgOlcusu } from './svg-denetim'

const sar = (ic: string, ek = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200"${ek}>${ic}</svg>`

describe('svgHatasi', () => {
  it('düz çizimi ve iç başvuruyu kabul eder', () => {
    expect(svgHatasi(sar('<defs><marker id="ok"><path d="M0,0 L1,1"/></marker></defs><line x1="1" marker-end="url(#ok)"/><text x="3">H₂O &lt; 5</text>'))).toBeNull()
  })

  it.each([
    ['betik', sar('<script>alert(1)</script>')],
    ['olay niteliği', sar('<rect onload="x()"/>')],
    ['kökte olay niteliği', sar('', ' onload="x()"')],
    ['tek tırnaklı nitelik', sar("<rect onload='x()'/>")],
    ['bağlantı', sar('<a href="https://ornek.com"><text>a</text></a>')],
    ['xlink', sar('<g xlink:href="#a"/>')],
    ['gömülü görüntü', sar('<image x="1"/>')],
    ['foreignObject', sar('<foreignObject><p>a</p></foreignObject>')],
    ['dış url', sar('<rect fill="url(https://ornek.com/a)"/>')],
    ['kaçışlı url', sar('<rect style="fill:u\\72l(a)"/>')],
    ['varlıkla gizlenmiş değer', sar('<rect fill="&#106;avascript"/>')],
    ['stil etiketi', sar('<style>rect{}</style>')],
    ['belge bildirimi', `<!DOCTYPE svg>${sar('')}`],
    ['viewBox yok', '<svg xmlns="http://www.w3.org/2000/svg"><rect x="1"/></svg>'],
  ])('%s reddedilir', (_, metin) => {
    expect(svgHatasi(metin)).not.toBeNull()
  })

  it('ölçüyü viewBoxtan okur', () => {
    expect(svgOlcusu(sar(''))).toEqual({ en: 600, boy: 200 })
  })
})

describe('svg görsel türü', () => {
  const gecerli = { tur: 'svg', yol: 'soru-bankasi/kimya/9/kim9-vis-002.svg', aciklama: 'Üç eğik düzlem.', en: 600, boy: 290 }

  it('geçerli şekli kabul eder', () => expect(gorselHatasi(gecerli)).toBeNull())

  it.each([
    '/soru-bankasi/kimya/9/a.svg',
    'https://ornek.com/a.svg',
    'soru-bankasi/../gizli/9/a.svg',
    'soru-bankasi/kimya/9/../a.svg',
    'soru-bankasi/kimya/12/a.svg',
    'soru-bankasi/kimya/9/a.png',
    'soru-bankasi/kimya/9/a.svg?b',
    'soru-bankasi/kimya/9/a.svg\n',
  ])('yol reddedilir: %j', (yol) => expect(gorselHatasi({ ...gecerli, yol })).not.toBeNull())

  it('alt metin ve ölçü zorunlu', () => {
    expect(gorselHatasi({ ...gecerli, aciklama: ' ' })).not.toBeNull()
    expect(gorselHatasi({ ...gecerli, en: 0 })).not.toBeNull()
    expect(gorselHatasi({ ...gecerli, boy: 1.5 })).not.toBeNull()
  })

  it('sayfadaki yüksekliği en/boy oranından gelir', () => {
    expect(sekilYuksekligi({ ...gecerli, tur: 'svg' }, 300)).toBeCloseTo(300 * (290 / 600) + 30)
  })
})

describe('yayımlanan SVG dosyaları', () => {
  it('her başvurunun güvenli ve doğru ölçülü bir dosyası var; sahipsiz dosya yok', async () => {
    const kullanilan = new Set<string>()
    const konular = Object.values(BANKA_DIZINLERI).flat().flatMap((s) => s.temalar).flatMap((t) => t.konular)
    for (const konu of konular) {
      if (!konu.yukle) continue
      for (const { gorsel } of (await konu.yukle()).default) {
        if (gorsel?.tur !== 'svg') continue
        const metin = readFileSync(`public/${gorsel.yol}`, 'utf8')
        expect(svgHatasi(metin), gorsel.yol).toBeNull()
        expect(svgOlcusu(metin)).toEqual({ en: gorsel.en, boy: gorsel.boy })
        kullanilan.add(gorsel.yol)
      }
    }
    const dosyalar = readdirSync('public/soru-bankasi', { recursive: true }).map(String).filter((d) => d.includes('.'))
    expect(dosyalar.map((d) => `soru-bankasi/${d.replaceAll('\\', '/')}`).sort()).toEqual([...kullanilan].sort())
  })
})
