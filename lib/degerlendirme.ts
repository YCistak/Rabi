/** Mağaza değerlendirme isteğinin bu cihazdaki kalıcı durumu. */
export type DegerlendirmeKaydi = {
  acilisSayisi: number
  istendi: boolean
}

export const DEGERLENDIRME_ACILIS_ESIGI = 3

export const VARSAYILAN_DEGERLENDIRME_KAYDI: DegerlendirmeKaydi = {
  acilisSayisi: 0,
  istendi: false,
}

/** Bozuk ya da eski kaydı güvenle varsayılana döndürür. */
export function kaydiOku(ham: string | null): DegerlendirmeKaydi {
  if (ham === null) return VARSAYILAN_DEGERLENDIRME_KAYDI
  try {
    const aday: unknown = JSON.parse(ham)
    if (
      typeof aday !== 'object' ||
      aday === null ||
      Array.isArray(aday) ||
      typeof (aday as DegerlendirmeKaydi).acilisSayisi !== 'number' ||
      !Number.isInteger((aday as DegerlendirmeKaydi).acilisSayisi) ||
      (aday as DegerlendirmeKaydi).acilisSayisi < 0 ||
      typeof (aday as DegerlendirmeKaydi).istendi !== 'boolean'
    ) {
      return VARSAYILAN_DEGERLENDIRME_KAYDI
    }
    return aday as DegerlendirmeKaydi
  } catch {
    return VARSAYILAN_DEGERLENDIRME_KAYDI
  }
}

/** Açılış sayısını, kayıt nesnesini değiştirmeden bir artırır. */
export function acilisiSay(kayit: DegerlendirmeKaydi): DegerlendirmeKaydi {
  return { ...kayit, acilisSayisi: kayit.acilisSayisi + 1 }
}

/** Mağazanın kendi penceresinin çağrılacağı açılışa gelindi mi. */
export function pencereIstenmeliMi(kayit: DegerlendirmeKaydi): boolean {
  return kayit.acilisSayisi >= DEGERLENDIRME_ACILIS_ESIGI && !kayit.istendi
}
