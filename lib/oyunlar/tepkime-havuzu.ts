/**
 * Tepkime Türü oyununun denklem havuzu.
 *
 * Kaynak 10. sınıf Maarif programı: Etkileşim teması › Kimyasal Tepkime
 * Türleri (KİM.10.1.3). Programın anahtar kavramları asit-baz, çökelme ve
 * redoks; yanma, sentez, analiz ve yer değiştirme konu kartlarında
 * (`lib/konu/icerik/10-kimya.ts` → `kim10-tur`) aynı ünitede anlatılıyor.
 *
 * **Asıl tuzak şu: bir denklem birden çok türe girebilir.** Metan yanması
 * aynı zamanda redoks, Zn + HCl hem yer değiştirme hem redoks, karbonun
 * yanması üstüne bir de sentez. Oyun dört şık gösterip birini doğru sayıyor;
 * denklemin girdiği öteki türler şıklara düşseydi doğru bilen haksız yere
 * yanlış olurdu. Bu yüzden her kaydın bir asıl türü (`tur`) ve girdiği öteki
 * türlerin listesi (`ayrica`) var. `ayrica`daki türler **hiçbir zaman
 * çeldirici olmuyor**. Emin olunamayan durumda tür `ayrica`ya yazıldı: bu
 * yalnızca bir çeldiriciyi eliyor, yanlış bir şeyi öğretmiyor.
 *
 * `ayrica` elle yazılıyor ama `tepkime.test.ts` denklemin yapısından
 * çıkarılabilen kısmını denetliyor: serbest element giren ya da çıkan her
 * tepkime redoks, tek ürünlü her tepkime sentez kalıbında, oksijenle giren
 * her tepkime (azot dışında) yanma, çözeltiden katı çıkaran her tepkime
 * çökelme. Atom ve yük dengesi de testte.
 *
 * Hâl (k, s, g, suda) **her** denklemde yazılı. Çökelmeyi tanımanın yolu
 * gerçekten "(suda) + (suda) → (k)" ama hâl yalnızca çökelmede yazılsaydı
 * "(k)" kalıbın kendisi değil cevabın işareti olurdu.
 *
 * Yazım: `2H2O(s)` — baştaki sayı katsayı, formüldeki sayılar alt indis;
 * iyon yükü `^` ile (`Ba^2+`, `Cl^-`). Terimler ` + `, taraflar ` → ` ile
 * ayrılıyor; boşluksuz `+` yalnızca yükte geçiyor.
 *
 * Bilerek dışarıda kalanlar:
 * - *Pişirme sodası + sirke* ve benzeri gündelik tepkimeler adla yazılınca
 *   denklem okumak değil ürün tanımak oluyor.
 * - *2SO2 + O2 → 2SO3* dışında kükürt oksitlerinin yanma sayılıp
 *   sayılmadığı kitaptan kitaba değişiyor; tek örnek `ayrica`ya yanmayla
 *   alındı.
 * - *Eşlenik asit-baz* çiftleri ve Lewis tanımı 10. sınıfta yok.
 * - Azot yanmaz: `N2 + O2 → 2NO` havuzda duruyor ama `ayrica`sında yanma
 *   **yok**. Isı alan bu tepkime sınavın en bilinen tuzağı; yanma şıkkı
 *   orada bilerek çeldirici.
 */

import type { Zorluk } from './ritim'

export type TepkimeTuru =
  | 'yanma'
  | 'sentez'
  | 'analiz'
  | 'asitBaz'
  | 'cokelme'
  | 'yerDegistirme'
  | 'redoks'

/** Şıklarda görünen ad. */
export const TUR_ADI: Record<TepkimeTuru, string> = {
  yanma: 'Yanma',
  sentez: 'Sentez (oluşum)',
  analiz: 'Analiz (ayrışma)',
  asitBaz: 'Asit-baz (nötrleşme)',
  cokelme: 'Çökelme',
  yerDegistirme: 'Yer değiştirme',
  redoks: 'Redoks',
}

/** Türü tanıtan kural — yanlış cevaptan sonra ve tur sonunda çıkıyor. */
export const TUR_KURALI: Record<TepkimeTuru, string> = {
  yanma: 'Madde oksijenle birleşir; ısı ve ışık açığa çıkar.',
  sentez: 'Birden çok madde birleşip tek ürün verir.',
  analiz: 'Tek madde parçalanıp birden çok ürün verir.',
  asitBaz: 'Asit ile baz birleşip tuz ve su verir.',
  cokelme: 'İki çözelti karışır, suda çözünmeyen bir katı oluşur.',
  yerDegistirme: 'Aktif element, bileşikteki daha az aktif elementin yerini alır.',
  redoks: 'Elektron alışverişi var: biri yükseltgenir, öteki indirgenir.',
}

export type TepkimeSorusu = {
  /** Düz yazı denklem; katsayı, alt indis ve yük çizimde kuruluyor. */
  denklem: string
  /** Sorunun cevabı. */
  tur: TepkimeTuru
  /** Denklemin **ayrıca** girdiği türler — çeldirici olamazlar. */
  ayrica: TepkimeTuru[]
  /**
   * Zorluk.
   *
   * Kolay: ders kitabının ilk örneği (metan yanması, HCl + NaOH, AgCl).
   * Orta: aynı kalıp, daha az tanıdık madde. Zor: net iyon denklemi,
   * oksitlerin asit-baz tepkimesi, kalıba uymayan redoks ve iki türe birden
   * giren denklemler.
   */
  zorluk: Zorluk
  /**
   * Cevaptan sonra kuralın yerine çıkan cümle.
   *
   * Yalnızca denklemin kendisinde öğretecek bir şey varken yazılı (azot
   * yanmaz, net iyon denklemi, termit). Formül yazılmıyor — alt indisli çizim
   * yalnızca denklem kartında var (`formul.ts`teki gerekçe).
   */
  not?: string
}

type Satir = [denklem: string, zorluk: Zorluk, ekAyrica?: TepkimeTuru[], not?: string]

/** Bir türün satırlarını kayda çevirir; `ayrica` grubun ortak türleriyle birleşiyor. */
function grup(tur: TepkimeTuru, ortakAyrica: TepkimeTuru[], satirlar: Satir[]): TepkimeSorusu[] {
  return satirlar.map(([denklem, zorluk, ekAyrica = [], not]) => ({
    denklem,
    tur,
    ayrica: [...new Set([...ortakAyrica, ...ekAyrica])],
    zorluk,
    ...(not ? { not } : {}),
  }))
}

export const TEPKIME_HAVUZU: TepkimeSorusu[] = [
  // Yanmanın hepsi redoks: oksijen indirgeniyor.
  ...grup('yanma', ['redoks'], [
    ['CH4(g) + 2O2(g) → CO2(g) + 2H2O(s)', 'kolay'],
    ['C3H8(g) + 5O2(g) → 3CO2(g) + 4H2O(s)', 'kolay', [], 'Propan: tüpteki gaz.'],
    ['C(k) + O2(g) → CO2(g)', 'kolay', ['sentez']],
    ['2H2(g) + O2(g) → 2H2O(s)', 'kolay', ['sentez']],
    ['C2H5OH(s) + 3O2(g) → 2CO2(g) + 3H2O(s)', 'orta', [], 'Etil alkol de hidrokarbon gibi yanar.'],
    ['2C4H10(g) + 13O2(g) → 8CO2(g) + 10H2O(s)', 'orta'],
    ['C6H12O6(k) + 6O2(g) → 6CO2(g) + 6H2O(s)', 'orta', [], 'Glikozun yanması; hücrede aynı denklem solunumdur.'],
    ['2Mg(k) + O2(g) → 2MgO(k)', 'orta', ['sentez'], 'Magnezyum şerit göz alan bir ışıkla yanar.'],
    ['S(k) + O2(g) → SO2(g)', 'orta', ['sentez']],
    ['2CO(g) + O2(g) → 2CO2(g)', 'orta', ['sentez'], 'Karbon monoksit yanıcı bir gazdır.'],
    ['2C2H6(g) + 7O2(g) → 4CO2(g) + 6H2O(s)', 'orta'],
    ['C2H4(g) + 3O2(g) → 2CO2(g) + 2H2O(s)', 'orta'],
    ['2CH3OH(s) + 3O2(g) → 2CO2(g) + 4H2O(s)', 'orta'],
    ['2C(k) + O2(g) → 2CO(g)', 'zor', ['sentez'], 'Oksijen yetmeyince karbon monoksit çıkar: eksik yanma.'],
    ['2CH4(g) + 3O2(g) → 2CO(g) + 4H2O(s)', 'zor', [], 'Eksik yanma: ürün karbon monoksit.'],
    ['2C2H2(g) + 5O2(g) → 4CO2(g) + 2H2O(s)', 'zor', [], 'Asetilen: kaynakçının alevi.'],
    ['4P(k) + 5O2(g) → 2P2O5(k)', 'zor', ['sentez']],
    ['2H2S(g) + 3O2(g) → 2SO2(g) + 2H2O(s)', 'zor'],
    ['4Al(k) + 3O2(g) → 2Al2O3(k)', 'zor', ['sentez']],
  ]),

  ...grup('sentez', [], [
    ['CaO(k) + CO2(g) → CaCO3(k)', 'kolay', ['asitBaz']],
    ['CaO(k) + H2O(s) → Ca(OH)2(suda)', 'kolay', [], 'Sönmemiş kireç suyla sönmüş kirece döner.'],
    ['SO3(g) + H2O(s) → H2SO4(suda)', 'kolay', [], 'Asit yağmurunun kaynağı.'],
    ['N2(g) + 3H2(g) → 2NH3(g)', 'kolay', ['redoks'], 'Haber yöntemi: amonyak üretimi.'],
    ['H2(g) + Cl2(g) → 2HCl(g)', 'kolay', ['redoks']],
    ['2Na(k) + Cl2(g) → 2NaCl(k)', 'kolay', ['redoks']],
    ['CO2(g) + H2O(s) → H2CO3(suda)', 'orta', [], 'Gazozun ekşiliği bu asitten.'],
    ['Na2O(k) + H2O(s) → 2NaOH(suda)', 'orta'],
    ['Fe(k) + S(k) → FeS(k)', 'orta', ['redoks']],
    ['2Al(k) + 3Cl2(g) → 2AlCl3(k)', 'orta', ['redoks']],
    ['P2O5(k) + 3H2O(s) → 2H3PO4(suda)', 'orta'],
    ['H2(g) + Br2(s) → 2HBr(g)', 'orta', ['redoks']],
    ['Zn(k) + S(k) → ZnS(k)', 'orta', ['redoks']],
    ['C(k) + 2H2(g) → CH4(g)', 'orta', ['redoks']],
    ['N2(g) + O2(g) → 2NO(g)', 'zor', ['redoks'], 'Azot oksijenle birleşse de yanmaz: tepkime ısı alır.'],
    ['2SO2(g) + O2(g) → 2SO3(g)', 'zor', ['redoks', 'yanma']],
    ['2NO(g) + O2(g) → 2NO2(g)', 'zor', ['redoks', 'yanma']],
    ['2Fe(k) + 3Cl2(g) → 2FeCl3(k)', 'zor', ['redoks']],
    ['2Cu(k) + O2(g) → 2CuO(k)', 'zor', ['redoks', 'yanma']],
    ['BaO(k) + H2O(s) → Ba(OH)2(suda)', 'zor'],
    ['N2O5(g) + H2O(s) → 2HNO3(suda)', 'zor'],
    ['2K(k) + Br2(s) → 2KBr(k)', 'zor', ['redoks']],
    ['4Fe(k) + 3O2(g) → 2Fe2O3(k)', 'zor', ['redoks', 'yanma'], 'Paslanma: yavaş ama aynı birleşme.'],
  ]),

  ...grup('analiz', [], [
    ['CaCO3(k) → CaO(k) + CO2(g)', 'kolay', [], 'Kireç taşı ısıtılınca sönmemiş kireç kalır.'],
    ['2H2O(s) → 2H2(g) + O2(g)', 'kolay', ['redoks'], 'Suyun elektrolizi.'],
    ['2HgO(k) → 2Hg(s) + O2(g)', 'kolay', ['redoks']],
    ['2H2O2(s) → 2H2O(s) + O2(g)', 'kolay', ['redoks'], 'Oksijenli su yaraya dökülünce köpürür.'],
    ['2NaCl(s) → 2Na(s) + Cl2(g)', 'kolay', ['redoks'], 'Erimiş tuzun elektrolizi.'],
    ['2KClO3(k) → 2KCl(k) + 3O2(g)', 'orta', ['redoks']],
    ['NH4Cl(k) → NH3(g) + HCl(g)', 'orta'],
    ['2NaHCO3(k) → Na2CO3(k) + H2O(g) + CO2(g)', 'orta', [], 'Kabartma tozu ısınınca hamuru kabartan gaz çıkar.'],
    ['MgCO3(k) → MgO(k) + CO2(g)', 'orta'],
    ['Cu(OH)2(k) → CuO(k) + H2O(g)', 'orta'],
    ['H2CO3(suda) → H2O(s) + CO2(g)', 'orta', [], 'Açık kalan gazozun gazı böyle kaçar.'],
    ['Ca(OH)2(k) → CaO(k) + H2O(g)', 'orta'],
    ['2HI(g) → H2(g) + I2(g)', 'orta', ['redoks']],
    ['2NaN3(k) → 2Na(k) + 3N2(g)', 'zor', ['redoks'], 'Hava yastığını bir anda şişiren tepkime.'],
    ['PCl5(g) → PCl3(g) + Cl2(g)', 'zor', ['redoks']],
    ['2KNO3(k) → 2KNO2(k) + O2(g)', 'zor', ['redoks']],
    ['2Ag2O(k) → 4Ag(k) + O2(g)', 'zor', ['redoks']],
    ['NH4NO3(k) → N2O(g) + 2H2O(g)', 'zor', ['redoks'], 'Serbest element yok ama azotun yükseltgenme basamağı değişiyor.'],
    ['2NH3(g) → N2(g) + 3H2(g)', 'zor', ['redoks']],
    ['(NH4)2CO3(k) → 2NH3(g) + H2O(g) + CO2(g)', 'zor', [], 'Keskin kokulu "koku tuzu" böyle dağılır.'],
  ]),

  ...grup('asitBaz', [], [
    ['HCl(suda) + NaOH(suda) → NaCl(suda) + H2O(s)', 'kolay'],
    ['H2SO4(suda) + 2KOH(suda) → K2SO4(suda) + 2H2O(s)', 'kolay'],
    ['HNO3(suda) + KOH(suda) → KNO3(suda) + H2O(s)', 'kolay'],
    ['HBr(suda) + LiOH(suda) → LiBr(suda) + H2O(s)', 'kolay'],
    ['2HCl(suda) + Mg(OH)2(k) → MgCl2(suda) + 2H2O(s)', 'orta', [], 'Mide ilacı fazla asidi böyle nötrler.'],
    ['3HCl(suda) + Al(OH)3(k) → AlCl3(suda) + 3H2O(s)', 'orta'],
    ['CH3COOH(suda) + NaOH(suda) → CH3COONa(suda) + H2O(s)', 'orta', [], 'Sirkedeki asit de bazla tuz ve su verir.'],
    ['H3PO4(suda) + 3NaOH(suda) → Na3PO4(suda) + 3H2O(s)', 'orta'],
    ['2HNO3(suda) + Ca(OH)2(suda) → Ca(NO3)2(suda) + 2H2O(s)', 'orta'],
    ['NH3(g) + HCl(g) → NH4Cl(k)', 'orta', ['sentez'], 'Su çıkmıyor ama amonyak bir baz: iki gaz beyaz duman olur.'],
    ['HNO3(suda) + NH3(suda) → NH4NO3(suda)', 'orta', ['sentez'], 'Amonyum nitrat: gübre.'],
    ['H2SO4(suda) + 2NH3(suda) → (NH4)2SO4(suda)', 'orta', ['sentez']],
    ['HF(suda) + KOH(suda) → KF(suda) + H2O(s)', 'orta'],
    ['Zn(OH)2(k) + 2HCl(suda) → ZnCl2(suda) + 2H2O(s)', 'orta'],
    ['H2SO4(suda) + Ba(OH)2(suda) → BaSO4(k) + 2H2O(s)', 'zor', ['cokelme']],
    ['CaO(k) + 2HCl(suda) → CaCl2(suda) + H2O(s)', 'zor', [], 'Bazik oksit de asidi baz gibi nötrler.'],
    ['CO2(g) + 2NaOH(suda) → Na2CO3(suda) + H2O(s)', 'zor', [], 'Asidik oksit + baz → tuz + su.'],
    ['SO2(g) + 2KOH(suda) → K2SO3(suda) + H2O(s)', 'zor', [], 'Asidik oksit + baz → tuz + su.'],
    ['CaCO3(k) + 2HCl(suda) → CaCl2(suda) + H2O(s) + CO2(g)', 'zor', [], 'Karbonat baz gibi davranır; gaz çıkması türü değiştirmez.'],
    ['NaHCO3(k) + HCl(suda) → NaCl(suda) + H2O(s) + CO2(g)', 'zor', [], 'Karbonatlı mide ilacı asidi böyle nötrler.'],
  ]),

  ...grup('cokelme', [], [
    ['AgNO3(suda) + NaCl(suda) → AgCl(k) + NaNO3(suda)', 'kolay', [], 'Beyaz gümüş klorür çöker.'],
    ['Pb(NO3)2(suda) + 2KI(suda) → PbI2(k) + 2KNO3(suda)', 'kolay', [], 'Sarı kurşun iyodür çöker.'],
    ['BaCl2(suda) + Na2SO4(suda) → BaSO4(k) + 2NaCl(suda)', 'kolay'],
    ['CaCl2(suda) + Na2CO3(suda) → CaCO3(k) + 2NaCl(suda)', 'orta'],
    ['CuSO4(suda) + 2NaOH(suda) → Cu(OH)2(k) + Na2SO4(suda)', 'orta', [], 'Mavi bakır(II) hidroksit çöker.'],
    ['FeCl3(suda) + 3NaOH(suda) → Fe(OH)3(k) + 3NaCl(suda)', 'orta'],
    ['AgNO3(suda) + KBr(suda) → AgBr(k) + KNO3(suda)', 'orta'],
    ['MgCl2(suda) + 2KOH(suda) → Mg(OH)2(k) + 2KCl(suda)', 'orta'],
    ['Pb(NO3)2(suda) + Na2SO4(suda) → PbSO4(k) + 2NaNO3(suda)', 'orta'],
    ['BaCl2(suda) + K2CO3(suda) → BaCO3(k) + 2KCl(suda)', 'orta'],
    ['AgNO3(suda) + NaI(suda) → AgI(k) + NaNO3(suda)', 'orta'],
    ['Na2S(suda) + CuCl2(suda) → CuS(k) + 2NaCl(suda)', 'orta'],
    ['Pb(NO3)2(suda) + 2NaCl(suda) → PbCl2(k) + 2NaNO3(suda)', 'orta'],
    ['3CaCl2(suda) + 2Na3PO4(suda) → Ca3(PO4)2(k) + 6NaCl(suda)', 'zor'],
    ['Al2(SO4)3(suda) + 3BaCl2(suda) → 3BaSO4(k) + 2AlCl3(suda)', 'zor'],
    ['Ag^+(suda) + Cl^-(suda) → AgCl(k)', 'zor', ['sentez'], 'Net iyon denklemi: seyirci iyonlar yazılmaz.'],
    ['Ba^2+(suda) + SO4^2-(suda) → BaSO4(k)', 'zor', ['sentez'], 'Net iyon denklemi: seyirci iyonlar yazılmaz.'],
    ['Pb^2+(suda) + 2I^-(suda) → PbI2(k)', 'zor', ['sentez'], 'Net iyon denklemi: seyirci iyonlar yazılmaz.'],
    ['Ca^2+(suda) + CO3^2-(suda) → CaCO3(k)', 'zor', ['sentez'], 'Çaydanlığı kireçlendiren tepkime.'],
    ['CO2(g) + Ca(OH)2(suda) → CaCO3(k) + H2O(s)', 'zor', ['asitBaz'], 'Kireç suyunun bulanması: karbondioksit testi.'],
  ]),

  // Yer değiştirmenin hepsi redoks: serbest element bileşiğe girip çıkıyor.
  ...grup('yerDegistirme', ['redoks'], [
    ['Zn(k) + 2HCl(suda) → ZnCl2(suda) + H2(g)', 'kolay'],
    ['Fe(k) + CuSO4(suda) → FeSO4(suda) + Cu(k)', 'kolay', [], 'Çivinin üstü bakırla kaplanır.'],
    ['Mg(k) + 2HCl(suda) → MgCl2(suda) + H2(g)', 'kolay'],
    ['Cu(k) + 2AgNO3(suda) → Cu(NO3)2(suda) + 2Ag(k)', 'orta'],
    ['2Na(k) + 2H2O(s) → 2NaOH(suda) + H2(g)', 'orta', [], 'Aktif metal suyun hidrojeninin yerini alır.'],
    ['Cl2(g) + 2KBr(suda) → 2KCl(suda) + Br2(s)', 'orta', [], 'Klor, bromdan aktif bir halojen.'],
    ['Zn(k) + CuSO4(suda) → ZnSO4(suda) + Cu(k)', 'orta'],
    ['Br2(s) + 2NaI(suda) → 2NaBr(suda) + I2(k)', 'orta'],
    ['Fe(k) + 2HCl(suda) → FeCl2(suda) + H2(g)', 'orta'],
    ['Ca(k) + 2H2O(s) → Ca(OH)2(suda) + H2(g)', 'orta'],
    ['Mg(k) + CuSO4(suda) → MgSO4(suda) + Cu(k)', 'orta'],
    ['2Al(k) + Fe2O3(k) → Al2O3(k) + 2Fe(s)', 'zor', [], 'Termit: demir erimiş hâlde çıkar, ray kaynağı.'],
    ['2Al(k) + 3CuCl2(suda) → 2AlCl3(suda) + 3Cu(k)', 'zor'],
    ['Cu(k) + 2Ag^+(suda) → Cu^2+(suda) + 2Ag(k)', 'zor'],
    ['Zn(k) + Cu^2+(suda) → Zn^2+(suda) + Cu(k)', 'zor'],
    ['Cl2(g) + 2I^-(suda) → 2Cl^-(suda) + I2(k)', 'zor'],
    ['2K(k) + 2H2O(s) → 2KOH(suda) + H2(g)', 'zor'],
    ['Zn(k) + H2SO4(suda) → ZnSO4(suda) + H2(g)', 'zor'],
    ['Mg(k) + 2AgNO3(suda) → Mg(NO3)2(suda) + 2Ag(k)', 'zor'],
  ]),

  /*
    Asıl türü redoks olanlar: öteki altı kalıbın hiçbirine tam oturmayanlar.

    Kalıba uyan bir redoks (Zn + HCl) redoks diye sorulsaydı yer değiştirme
    şıklardan elenmek zorunda kalırdı ve soru "hangisi değil"e dönerdi.
    Burada ya serbest element hiç yok (Fe²⁺ + Cl₂) ya da metal oksidin
    indirgenmesi gibi kendi adıyla anılan bir süreç var.
  */
  ...grup('redoks', [], [
    ['Fe2O3(k) + 3CO(g) → 2Fe(k) + 3CO2(g)', 'orta', [], 'Yüksek fırın: karbon monoksit demir oksidi indirger.'],
    ['CuO(k) + CO(g) → Cu(k) + CO2(g)', 'orta'],
    ['CuO(k) + H2(g) → Cu(k) + H2O(g)', 'orta', ['yerDegistirme']],
    ['PbO(k) + CO(g) → Pb(k) + CO2(g)', 'orta'],
    ['2CuO(k) + C(k) → 2Cu(k) + CO2(g)', 'orta', ['yerDegistirme']],
    ['Fe3O4(k) + 4CO(g) → 3Fe(k) + 4CO2(g)', 'zor'],
    ['MnO2(k) + 4HCl(suda) → MnCl2(suda) + Cl2(g) + 2H2O(s)', 'zor', [], 'Asit var ama tuz ve suyun yanında klor gazı çıkıyor.'],
    ['Cu(k) + 4HNO3(suda) → Cu(NO3)2(suda) + 2NO2(g) + 2H2O(s)', 'zor', [], 'Bakır asitten hidrojen çıkaramaz; nitrik asidin azotu indirgenir.'],
    ['Cu(k) + 2H2SO4(suda) → CuSO4(suda) + SO2(g) + 2H2O(s)', 'zor', [], 'Hidrojen değil kükürt dioksit çıkıyor: sülfatın kükürdü indirgendi.'],
    ['Ag(k) + 2HNO3(suda) → AgNO3(suda) + NO2(g) + H2O(s)', 'zor'],
    ['2H2S(g) + SO2(g) → 3S(k) + 2H2O(s)', 'zor', [], 'Kükürt iki yönden gelip aynı basamakta buluşuyor.'],
    ['Cl2(g) + 2NaOH(suda) → NaCl(suda) + NaClO(suda) + H2O(s)', 'zor', [], 'Çamaşır suyu eldesi: klor hem yükseltgenir hem indirgenir.'],
    ['2FeCl3(suda) + SnCl2(suda) → 2FeCl2(suda) + SnCl4(suda)', 'zor'],
    ['4NH3(g) + 5O2(g) → 4NO(g) + 6H2O(g)', 'zor', ['yanma'], 'Nitrik asit üretiminin ilk adımı.'],
    ['ZnO(k) + C(k) → Zn(k) + CO(g)', 'zor', ['yerDegistirme']],
    ['2Mg(k) + CO2(g) → 2MgO(k) + C(k)', 'zor', ['yerDegistirme', 'yanma'], 'Magnezyum karbondioksit içinde bile yanar.'],
    ['2Fe^2+(suda) + Cl2(g) → 2Fe^3+(suda) + 2Cl^-(suda)', 'zor', [], 'Serbest element çıkmıyor; demir iyonu elektron veriyor.'],
    ['Zn(k) + 2Fe^3+(suda) → Zn^2+(suda) + 2Fe^2+(suda)', 'zor', [], 'Demir açığa çıkmıyor, yalnızca yükü azalıyor.'],
  ]),
]
