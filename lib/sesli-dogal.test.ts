import { describe, expect, it } from 'vitest'
import { HAZIR_SABLONLAR, secilebilirSablonlar } from './sablonlar'
import { sesliMetniCoz, type SesliCozum } from './sesli-giris'
import type { Sablon } from './types'

const sablonlar: Sablon[] = secilebilirSablonlar(HAZIR_SABLONLAR, 12, null)
const bos: SesliCozum = { sorular: [], deneme: null, anlasilmayan: [] }
const soru = (ders: string, toplam: number, dogru = 0, yanlis = 0) => ({ ders, toplam, dogru, yanlis })
const deneme = (dersler: { dersId: string; dogru: number; yanlis: number }[] = [], toplamNet: number | null = null) => ({ sablonId: 'tyt', dersler, toplamNet })

function coz(metin: string): SesliCozum {
  return sesliMetniCoz(metin, { sablonlar, varsayilanSablonId: 'tyt' })
}

type Ornek = readonly [string, SesliCozum]

describe('sesliMetniCoz — doğal öğrenci konuşması', () => {
  const ornekler: Ornek[] = [
    ['şey bugün mat 40 çözdüm', { ...bos, sorular: [soru('Matematik', 40)] }],
    ['yani matematikten yaklaşık 50 soru çözdüm', { ...bos, sorular: [soru('Matematik', 50)] }],
    ['işte 50 civarı kimya çözdüm', { ...bos, sorular: [soru('Kimya', 50)] }],
    ['ee fizikten 50 kadar soru baktım', { ...bos, sorular: [soru('Fizik', 50)] }],
    ['hocam biyo 50 tane falan çözdüm', { ...bos, sorular: [soru('Biyoloji', 50)] }],
    ['bugün türkçede elli küsur soru çözdüm', { ...bos, sorular: [soru('Türkçe', 50)] }],
    ['sabah yüz yirmi paragraf çözdüm', { ...bos, sorular: [soru('Türkçe', 120)] }],
    ['akşam iki yüz problem çözdüm', { ...bos, sorular: [soru('Matematik', 200)] }],
    ['bir de mat 30 çözdüm ondan sonra fizik 20', { ...bos, sorular: [soru('Matematik', 30), soru('Fizik', 20)] }],
    ['sonra da kimyaya 25 ayrıca biyoya 15 baktım', { ...bos, sorular: [soru('Kimya', 25), soru('Biyoloji', 15)] }],
    ['mat ile geo toplam 40 değil ayrı ayrı 20 soru', { ...bos, sorular: [soru('Matematik', 40)] }],
    ['türkçe ve edebiyattan 30ar soru çözdüm', { ...bos, sorular: [soru('Türkçe', 60)] }],
    ['80 tane matematik çözdüm', { ...bos, sorular: [soru('Matematik', 80)] }],
    ['matematik 80', { ...bos, sorular: [soru('Matematik', 80)] }],
    ['matematikten bugün bayağı çözdüm 80 tane', { ...bos, sorular: [soru('Matematik', 80)] }],
    ['geometriden 35 soru çözdüm', { ...bos, sorular: [soru('Matematik', 35)] }],
    ['fizikle 25 soru uğraştım', { ...bos, sorular: [soru('Fizik', 25)] }],
    ['kimyaya 30 soru baktım', { ...bos, sorular: [soru('Kimya', 30)] }],
    ['bio 20 soru çözdüm', { ...bos, sorular: [soru('Biyoloji', 20)] }],
    ['türkçede 40 soru çözdüm', { ...bos, sorular: [soru('Türkçe', 40)] }],
    ['edebiyattan 25 soru', { ...bos, sorular: [soru('Türkçe', 25)] }],
    ['paragraf 30 çözdüm', { ...bos, sorular: [soru('Türkçe', 30)] }],
    ['problem 40 çözdüm', { ...bos, sorular: [soru('Matematik', 40)] }],
    ['tarih 20 coğ 15 çözdüm', { ...bos, sorular: [soru('Tarih', 20), soru('Coğrafya', 15)] }],
    ['felsefeden 18 din 12 soru çözdüm', { ...bos, sorular: [soru('Felsefe', 18), soru('Din Kültürü', 12)] }],
    ['ingilizce 45 soru çözdüm', { ...bos, sorular: [soru('Yabancı Dil', 45)] }],
    ['40 soru çözdüm 30u doğru', { ...bos, anlasilmayan: ['40 soru çözdüm 30u doğru'] }],
    ['30 doğrum 5 yanlışım var', { ...bos, anlasilmayan: ['30 doğrum 5 yanlışım var'] }],
    ['matematikte 5 tane yanlışım var', { ...bos, anlasilmayan: ['matematikte 5 tane yanlışım'] }],
    ['fizikten 20 soru çözdüm yanlışım yok', { ...bos, sorular: [soru('Fizik', 20, 20)] }],
    ['kimyadan 30 çözdüm hepsini doğru yaptım', { ...bos, sorular: [soru('Kimya', 30, 30)] }],
    ['türkçeden 40 çözdüm üç boş bıraktım', { ...bos, sorular: [soru('Türkçe', 40, 0, 0)] }],
    ['toplam 120 soru çözdüm', { ...bos, anlasilmayan: ['toplam 120 soru çözdüm'] }],
    ['matematikten 2 test çözdüm', { ...bos, anlasilmayan: ['matematikten 2 test çözdüm'] }],
    ['sosyal 20 çözdüm tarih 10', { ...bos, sorular: [soru('Tarih', 10)], anlasilmayan: ['sosyal 20'] }],
    ['fen 30 çözdüm kimya 10', { ...bos, sorular: [soru('Kimya', 10)], anlasilmayan: ['fen 30'] }],
    ['TYT denemesine girdim', { ...bos, deneme: deneme() }],
    ['deneme çözdüm TYT', { ...bos, deneme: deneme() }],
    ['AYT sayısal denemesinde matematik 25 doğru 5 yanlış', { ...bos, deneme: { sablonId: 'ayt-say', dersler: [{ dersId: 'matematik', dogru: 25, yanlis: 5 }], toplamNet: null } }],
    ['denemede türkçem 30 doğru 6 yanlış', { ...bos, deneme: deneme([{ dersId: 'turkce', dogru: 30, yanlis: 6 }]) }],
    ['matematiğim 25 netti', { ...bos }],
    ['toplam 85 net yaptım', { ...bos, deneme: null }],
    ["TYT'den 90 net", { ...bos, deneme: deneme([], 90) }],
    ['te ye te denemesinde türkçe 30 doğru 5 yanlış', { ...bos, deneme: deneme([{ dersId: 'turkce', dogru: 30, yanlis: 5 }]) }],
    ['tete denemesinde matematik 25 doğru 4 yanlış', { ...bos, deneme: deneme([{ dersId: 'matematik', dogru: 25, yanlis: 4 }]) }],
    ['ayt sayısal matematik 20 doğru 3 yanlış', { ...bos, deneme: { sablonId: 'ayt-say', dersler: [{ dersId: 'matematik', dogru: 20, yanlis: 3 }], toplamNet: null } }],
    ['rabbi bugün 60 mat çözdüm', { ...bos, sorular: [soru('Matematik', 60)] }],
    ['arabi fizik 20 soru', { ...bos, sorular: [soru('Fizik', 20)] }],
    ['bugün matematikte 50 soru çözdüm 40 doğru 5 yanlış 5 boş', { ...bos, sorular: [soru('Matematik', 50, 40, 5)] }],
    ['mat 50 soru çözdüm 40 doğru 5 yanlış 5 boş', { ...bos, sorular: [soru('Matematik', 50, 40, 5)] }],
    ['matematikten 30 soru 5 yanlış', { ...bos, sorular: [soru('Matematik', 30, 25, 5)] }],
    ['coğrafyadan 20 soru 15 doğru', { ...bos, sorular: [soru('Coğrafya', 20, 15)] }],
    ['bugün 12. sınıf fizik 40 soru', { ...bos, sorular: [soru('Fizik', 40)] }],
    ['dün akşam 2 saat kimya çalıştım 30 soru çözdüm', { ...bos, sorular: [soru('Kimya', 30)] }],
    ['mat 25 soru ve fizik 15 soru çözdüm', { ...bos, sorular: [soru('Matematik', 25), soru('Fizik', 15)] }],
    ['mat 25 fizik 15', { ...bos, sorular: [soru('Matematik', 25), soru('Fizik', 15)] }],
    ['türkçe 20, tarih 15, coğrafya 10 çözdüm', { ...bos, sorular: [soru('Türkçe', 20), soru('Tarih', 15), soru('Coğrafya', 10)] }],
    ['matematikte 10, kimyada 20, biyolojide 30 soru', { ...bos, sorular: [soru('Matematik', 10), soru('Kimya', 20), soru('Biyoloji', 30)] }],
    ['matematik 50 tane çözdüm işte', { ...bos, sorular: [soru('Matematik', 50)] }],
    ['yaklaşık yüz soru paragraf', { ...bos, sorular: [soru('Türkçe', 100)] }],
    ['elli tane falan geo', { ...bos, sorular: [soru('Matematik', 50)] }],
    ['sabah mat 30 akşam mat 20', { ...bos, sorular: [soru('Matematik', 50)] }],
    ['denemede sosyal 15 doğru türkçe 30 doğru 5 yanlış', { ...bos, deneme: deneme([{ dersId: 'turkce', dogru: 30, yanlis: 5 }]), anlasilmayan: ['sosyal 15 doğru'] }],
    ['TYT türkçe 30 doğru 6 yanlış sonra da mat 40 soru çözdüm', { sorular: [soru('Matematik', 40)], deneme: deneme([{ dersId: 'turkce', dogru: 30, yanlis: 6 }]), anlasilmayan: [] }],
    ['TYT denemesinde türkçe 30 doğru 5 yanlış ayrıca fizik 20 soru çözdüm', { sorular: [soru('Fizik', 20)], deneme: deneme([{ dersId: 'turkce', dogru: 30, yanlis: 5 }]), anlasilmayan: [] }],
    ['bugün tyt denemesinde türkçe 30 doğru 5 yanlış matematik 25 doğru 4 yanlış sonra da biyo 40 soru ve coğ 20 soru çözdüm', { sorular: [soru('Biyoloji', 40), soru('Coğrafya', 20)], deneme: deneme([{ dersId: 'turkce', dogru: 30, yanlis: 5 }, { dersId: 'matematik', dogru: 25, yanlis: 4 }]), anlasilmayan: [] }],
    ['matematiğe 75 soru çözdüm', { ...bos, sorular: [soru('Matematik', 75)] }],
    ['geodan 15 soru çözdüm', { ...bos, sorular: [soru('Matematik', 15)] }],
    ['fizik 30 tane kimya 25 tane', { ...bos, sorular: [soru('Fizik', 30), soru('Kimya', 25)] }],
    ['din kültüründen 10 soru çözdüm', { ...bos, sorular: [soru('Din Kültürü', 10)] }],
    ['yabancı dil 60 soru', { ...bos, sorular: [soru('Yabancı Dil', 60)] }],
    ['felsefe grubu 20 soru', { ...bos, sorular: [soru('Felsefe', 20)] }],
    ['bugün yani mat 40 sonra fizik 20 sonra da kimya 10', { ...bos, sorular: [soru('Matematik', 40), soru('Fizik', 20), soru('Kimya', 10)] }],
    ['mat 40 soru çözdüm artı biyo 20', { ...bos, sorular: [soru('Matematik', 40), soru('Biyoloji', 20)] }],
    ['coğdan 12 soru', { ...bos, sorular: [soru('Coğrafya', 12)] }],
    ['edebiyat 30 paragraf 20 çözdüm', { ...bos, sorular: [soru('Türkçe', 50)] }],
    ['mat 10 soru çözdüm', { ...bos, sorular: [soru('Matematik', 10)] }],
    ['geometri 10 doğru 2 yanlış', { ...bos, sorular: [soru('Matematik', 12, 10, 2)] }],
    ['fizikten on beş soru çözdüm', { ...bos, sorular: [soru('Fizik', 15)] }],
    ['kimyada yirmi soru ve biyoda on soru', { ...bos, sorular: [soru('Kimya', 20), soru('Biyoloji', 10)] }],
    ['tarihten 25 soru çözdüm yanlışım yok', { ...bos, sorular: [soru('Tarih', 25, 25)] }],
    ['bugün coğrafya 10 sonra felsefe 15 çözdüm', { ...bos, sorular: [soru('Coğrafya', 10), soru('Felsefe', 15)] }],
    ['rabbi yani ingilizce 30 soru çözdüm', { ...bos, sorular: [soru('Yabancı Dil', 30)] }],
  ]

  it.each(ornekler)('%s', (metin, beklenen) => {
    expect(coz(metin)).toEqual(beklenen)
  })
})
