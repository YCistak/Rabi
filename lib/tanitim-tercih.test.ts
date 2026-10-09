import { describe, expect, it } from 'vitest'
import { ANA_TUR_SURUM_ANAHTARI, ESKI_ANA_TUR_ANAHTARI, TUR_ANAHTARLARI } from './tanitim'
import { eskiTurKaydiVar, tanitimBaslangici, tanitimiSifirlaKayitlari, tercihOku, turlarAcik, TANITIM_TERCIH_ANAHTARI } from './tanitim-tercih'

const depo = (kayitlar: Record<string, string>) => (anahtar: string) => kayitlar[anahtar] ?? null

describe('tercihOku', () => {
  it('yalnız evet ve hayır tanınıyor', () => {
    expect(tercihOku('evet')).toBe('evet')
    expect(tercihOku('hayir')).toBe('hayir')
    expect(tercihOku(null)).toBeNull()
    expect(tercihOku('true')).toBeNull()
    expect(tercihOku('')).toBeNull()
  })
})

describe('eskiTurKaydiVar', () => {
  it('boş cihazda kayıt yok', () => {
    expect(eskiTurKaydiVar(depo({}))).toBe(false)
  })
  it('ana turun sürümü ya da eski anahtarları kayıt sayılıyor', () => {
    expect(eskiTurKaydiVar(depo({ [ANA_TUR_SURUM_ANAHTARI]: '2' }))).toBe(true)
    expect(eskiTurKaydiVar(depo({ [ANA_TUR_SURUM_ANAHTARI]: '1' }))).toBe(true)
    expect(eskiTurKaydiVar(depo({ [TUR_ANAHTARLARI.ana_tur]: 'true' }))).toBe(true)
    expect(eskiTurKaydiVar(depo({ [ESKI_ANA_TUR_ANAHTARI]: 'true' }))).toBe(true)
  })
  it('bir mini turun bayrağı da kayıt sayılıyor', () => {
    expect(eskiTurKaydiVar(depo({ [TUR_ANAHTARLARI.pomodoro]: 'true' }))).toBe(true)
    expect(eskiTurKaydiVar(depo({ [TUR_ANAHTARLARI.pomodoro]: 'false' }))).toBe(false)
  })
})

describe('tanitimBaslangici', () => {
  it('yeni kullanıcıya soruluyor', () => {
    expect(tanitimBaslangici({ tercih: null, anaTurGoruldu: false, eskiKayitVar: false })).toBe('sor')
  })
  it('Evet → ana tur; tur bitince yalnız mini turlar', () => {
    expect(tanitimBaslangici({ tercih: 'evet', anaTurGoruldu: false, eskiKayitVar: false })).toBe('ana-tur')
    expect(tanitimBaslangici({ tercih: 'evet', anaTurGoruldu: true, eskiKayitVar: true })).toBe('bitti')
  })
  it('Hayır → her şey kapalı, ana tur görülmüş olsa da', () => {
    expect(tanitimBaslangici({ tercih: 'hayir', anaTurGoruldu: false, eskiKayitVar: false })).toBe('kapali')
    expect(tanitimBaslangici({ tercih: 'hayir', anaTurGoruldu: true, eskiKayitVar: true })).toBe('kapali')
    expect(turlarAcik('hayir')).toBe(false)
    expect(turlarAcik('evet')).toBe(true)
    expect(turlarAcik(null)).toBe(true)
  })
  it('eski turu bitirmiş kullanıcıya sorulmuyor; davranışı aynı kalıyor', () => {
    // Eski sürümü bitirmiş: yeni ana turu bir kez görüyor (sürüm kuralı).
    expect(tanitimBaslangici({ tercih: null, anaTurGoruldu: false, eskiKayitVar: true })).toBe('ana-tur')
    // Güncel turu bitirmiş: hiçbir şey değişmiyor.
    expect(tanitimBaslangici({ tercih: null, anaTurGoruldu: true, eskiKayitVar: true })).toBe('bitti')
  })
})

describe('tanitimiSifirlaKayitlari', () => {
  const { sil, yaz } = tanitimiSifirlaKayitlari()
  it('ana tur ve bütün mini tur kayıtlarını siliyor', () => {
    for (const anahtar of Object.values(TUR_ANAHTARLARI)) expect(sil).toContain(anahtar)
    expect(sil).toContain(ANA_TUR_SURUM_ANAHTARI)
    expect(sil).toContain(ESKI_ANA_TUR_ANAHTARI)
  })
  it('tercihi evet yapıyor ve silmiyor', () => {
    expect(yaz).toEqual([[TANITIM_TERCIH_ANAHTARI, 'evet']])
    expect(sil).not.toContain(TANITIM_TERCIH_ANAHTARI)
  })
  it('sıfırlanınca ana tur görülmedi, mini turlar görülmedi, Hayır kalkmış olur', () => {
    const kayit: Record<string, string> = { [TANITIM_TERCIH_ANAHTARI]: 'hayir', [ANA_TUR_SURUM_ANAHTARI]: '2', [TUR_ANAHTARLARI.pomodoro]: 'true', rabi_gorevler: 'x' }
    for (const a of sil) delete kayit[a]
    for (const [a, d] of yaz) kayit[a] = d
    const oku = (a: string) => kayit[a] ?? null
    expect(eskiTurKaydiVar(oku)).toBe(false)
    expect(tanitimBaslangici({ tercih: tercihOku(oku(TANITIM_TERCIH_ANAHTARI)), anaTurGoruldu: false, eskiKayitVar: false })).toBe('ana-tur')
    expect(kayit.rabi_gorevler).toBe('x')
  })
})
