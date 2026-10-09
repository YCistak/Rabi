import { describe, expect, it } from 'vitest'
import { ANA_TUR_SURUM_ANAHTARI, ESKI_ANA_TUR_ANAHTARI, TUR_ANAHTARLARI } from './tanitim'
import { eskiTurKaydiVar, tanitimBaslangici, tercihOku, turlarAcik } from './tanitim-tercih'

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
