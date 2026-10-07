/**
 * Hücre ve Organeller oyununun havuzu.
 *
 * Her satır bir yapı ve onu soran **tek bir soru cümlesi**. Oyun Canlıları
 * Sınıflandırma ile aynı biçimde: soru okunur, dört şıktan doğrusu seçilir.
 * (Önceden arkası dönük bir kart üç ipucunu sırayla açıyordu; kullanıcı
 * ipuçlu kart yerine düz soru istedi.)
 *
 * Kapsam 9. sınıf "Hücre" ünitesi; hücrenin bütün yapı ve organelleri, ökaryot
 * ve prokaryot. Hücre zarı, hücre duvarı, sitoplazma ve kromozom organel değil
 * ama havuzda: ünite onları da anlatıyor ve şıklarda birlikte geçiyorlar.
 *
 * **Çeldiriciler elle seçiliyor** (`karistirilan`), havuzun tamamından
 * rastgele değil. İki sebep:
 *
 * - Bazı yapılar başka bir yapının parçası ya da aynı işi paylaşıyor
 *   (kloroplast–tilakoid, sentrozom–sentriyol, hücre iskeleti–mikrotübül).
 *   Rastgele çekilseydi "fotosentezin yapıldığı organel" sorusunda tilakoid de
 *   şık olur, iki doğru çıkardı. `hucre.test.ts` bu çiftleri tek tek denetliyor.
 * - Rastgele çeldirici çoğu soruda okumadan elenirdi ("kamçı" ile "stroma"
 *   aynı soruda). Elle seçilenler sorunun alanından: plastit sorusunda öteki
 *   plastitler, iskelet sorusunda öteki iplikler.
 *
 * Yeni satır eklerken sınır şu: **her satırın cevabı benzersiz bir yapı adı
 * olmalı** — banka kaydının kimliği bu ad (`hucre:<organel>`), iki satır aynı
 * adı taşısaydı kayıtları birbirine karışırdı. Aynı yapının iki adı da ayrı
 * satır olamaz ("hücre çeperi" ile "hücre duvarı"): biri ötekinin çeldiricisi
 * olup iki doğru şık doğururdu.
 */

import type { Zorluk } from './ritim'

export type OrganelSorusu = {
  /** Doğru cevap — şıklarda da bu ad görünüyor; banka kaydının kimliği. */
  organel: string
  /**
   * Ekranda okunan soru cümlesi.
   *
   * Yalnızca bu yapıya uymalı: bir özellik birkaç yapıda ortaksa (kendi DNA'sı
   * mitokondride de kloroplastta da var) o özellik tek başına sorulmuyor.
   */
  soru: string
  /**
   * Çeldirici adayları; her turda içlerinden üçü rastgele seçiliyor.
   *
   * En az üç tane, hepsi havuzda geçen bir ad ve hiçbiri soruya uymuyor —
   * üçünü de `hucre.test.ts` denetliyor.
   */
  karistirilan: readonly string[]
  /** Tur sonunda yanlışın altında görünen kısa öğretici not. */
  aciklama: string
  zorluk: Zorluk
}

/**
 * Bankada duran hücre kaydı.
 *
 * İpuçlu kart döneminin kayıtlarında `soru` ve `karistirilan` yok,
 * `ipuclari` var. Kayıtlar yeniden adlandırılmıyor ya da silinmiyor
 * (`AGENTS.md`); okurken havuzdan güncel hâli bulunuyor
 * (`hucre.ts` → `kayittanSoru`), eski alanlar yalnızca havuzda karşılığı
 * kalmamış bir kaydı listede göstermeye yarıyor.
 */
export type HucreKaydi = {
  organel: string
  soru?: string
  karistirilan?: readonly string[]
  /** Eski kayıtlar: kartın üç ipucu. */
  ipuclari?: readonly string[]
  aciklama?: string
  zorluk?: Zorluk
}

export const HUCRE_HAVUZU: readonly OrganelSorusu[] = [
  {
    organel: 'Mitokondri',
    soru: 'Oksijenli solunumla hücrenin ATP’sinin büyük kısmını üreten organel hangisidir?',
    karistirilan: ['Kloroplast', 'Ribozom', 'Golgi cisimciği', 'Peroksizom', 'Lizozom'],
    aciklama:
      'Enerji ihtiyacı yüksek hücrelerde (kas, karaciğer) sayısı artar. Çift zarlı ve kendi DNA’sı olan iki organelden biridir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Ribozom',
    soru: 'Hücrede protein sentezinin yapıldığı organel hangisidir?',
    karistirilan: ['Golgi cisimciği', 'Lizozom', 'Çekirdekçik', 'Granülsüz endoplazmik retikulum', 'Peroksizom'],
    aciklama:
      'Zarsızdır ve bütün hücrelerde bulunur; prokaryot hücrelerde bulunan tek organeldir. Alt birimleri çekirdekçikte üretilir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Kloroplast',
    soru: 'Bitki hücresinde klorofil taşıyan ve fotosentezin gerçekleştiği organel hangisidir?',
    karistirilan: ['Kromoplast', 'Lökoplast', 'Mitokondri', 'Koful'],
    aciklama:
      'Plastitlerdendir. Çift zarlıdır, kendi DNA’sı ve ribozomu vardır; ışık enerjisini kimyasal enerjiye çevirerek besin üretir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Çekirdek',
    soru: 'Ökaryot hücrede kalıtım maddesini taşıyan ve hücrenin yönetim merkezi olan yapı hangisidir?',
    karistirilan: ['Çekirdekçik', 'Ribozom', 'Sentrozom', 'Golgi cisimciği'],
    aciklama:
      'Çift zarlıdır; porları sayesinde sitoplazmayla madde alışverişi yapar. DNA’yı taşıdığı için bölünmeyi ve sentezi yönetir. Prokaryotlarda bulunmaz.',
    zorluk: 'kolay',
  },
  {
    organel: 'Hücre zarı',
    soru: 'Seçici geçirgen olup hücreye madde giriş çıkışını denetleyen yapı hangisidir?',
    karistirilan: ['Hücre duvarı', 'Kapsül', 'Hücre dışı matriks', 'Hücre iskeleti'],
    aciklama:
      'Canlı ve seçici geçirgendir; yağ ve proteinden oluşur (akıcı mozaik model). Hücreyi dış ortamdan ayırır, madde alışverişini ve iletişimi sağlar.',
    zorluk: 'kolay',
  },
  {
    organel: 'Koful',
    soru: 'Bitki hücrelerinde genellikle tek ve büyük olan, su ve madde depolayan organel hangisidir?',
    karistirilan: ['Lizozom', 'Vezikül', 'Peroksizom', 'Golgi cisimciği'],
    aciklama:
      'Genç bitki hücrelerinde küçük ve çok sayıda, yaşlı hücrelerde birleşerek tek ve büyüktür. Tatlı su canlılarında kasılarak fazla suyu dışarı atar.',
    zorluk: 'kolay',
  },
  {
    organel: 'Hücre duvarı',
    soru: 'Bitkide selülozdan, mantarda kitinden yapılan; cansız ve tam geçirgen yapı hangisidir?',
    karistirilan: ['Hücre zarı', 'Kapsül', 'Glikokaliks', 'Hücre dışı matriks'],
    aciklama:
      'Hücre zarının dışındadır ve hayvan hücrelerinde bulunmaz. Cansız olduğu için madde geçişini seçemez; hücreye şekil ve dayanıklılık verir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Lizozom',
    soru: 'İçinde sindirim enzimleri bulunan ve hücre içi sindirimi yapan organel hangisidir?',
    karistirilan: ['Peroksizom', 'Golgi cisimciği', 'Ribozom', 'Mitokondri'],
    aciklama:
      'Golgi tarafından üretilir. Yaşlanmış organelleri ve dışarıdan alınan büyük molekülleri parçalar; zarı yırtılırsa hücreyi sindirir.',
    zorluk: 'orta',
  },
  {
    organel: 'Golgi cisimciği',
    soru: 'Üst üste dizilmiş yassı keselerden oluşan, maddeleri işleyip paketleyerek salgılayan organel hangisidir?',
    karistirilan: ['Lizozom', 'Granüllü endoplazmik retikulum', 'Ribozom', 'Peroksizom'],
    aciklama:
      'Endoplazmik retikulumdan gelen protein ve yağları işler; salgı kesecikleri hâlinde hücre dışına gönderir. Lizozomu da o oluşturur.',
    zorluk: 'orta',
  },
  {
    organel: 'Granüllü endoplazmik retikulum',
    soru: 'Yüzeyinde ribozom bulunan, ribozomda üretilen proteinleri taşıyan kanal sistemi hangisidir?',
    karistirilan: ['Granülsüz endoplazmik retikulum', 'Golgi cisimciği', 'Hücre iskeleti', 'Lizozom'],
    aciklama:
      'Protein sentezi ve taşınmasıyla ilgilidir; proteinleri golgiye gönderir. Salgı üreten hücrelerde bol bulunur.',
    zorluk: 'orta',
  },
  {
    organel: 'Sentrozom',
    soru: 'Hayvan hücresinde birbirine dik duran iki sentriyolden oluşan yapı hangisidir?',
    karistirilan: ['Çekirdekçik', 'Ribozom', 'Golgi cisimciği', 'Kromatin', 'Lizozom'],
    aciklama:
      'Zarsızdır, bitki hücrelerinde bulunmaz. Bölünmede iğ ipliklerini oluşturarak kromozomların kutuplara çekilmesini sağlar.',
    zorluk: 'orta',
  },
  {
    organel: 'Çekirdekçik',
    soru: 'Çekirdeğin içinde bulunan, ribozom alt birimlerinin üretildiği zarsız yapı hangisidir?',
    karistirilan: ['Nükleoplazma', 'Kromatin', 'Sentrozom', 'Golgi cisimciği'],
    aciklama:
      'RNA ve protein bakımından zengindir. Bölünme başlarken kaybolur, bölünme bitince yeniden oluşur. Protein sentezi hızlı olan hücrelerde belirgindir.',
    zorluk: 'orta',
  },
  {
    organel: 'Granülsüz endoplazmik retikulum',
    soru: 'Yüzeyinde ribozom bulunmayan; yağ sentezinde ve karaciğerde zararlı maddelerin etkisizleştirilmesinde görev alan kanal sistemi hangisidir?',
    karistirilan: ['Granüllü endoplazmik retikulum', 'Golgi cisimciği', 'Lizozom', 'Vezikül'],
    aciklama:
      'Üzerinde ribozom yoktur. Yağ ve karbonhidrat sentezi, kalsiyum depolanması ve ilaç, alkol gibi zehirlerin etkisizleştirilmesinde görevlidir.',
    zorluk: 'zor',
  },
  {
    organel: 'Peroksizom',
    soru: 'Katalaz enzimiyle hidrojen peroksidi su ve oksijene parçalayan organel hangisidir?',
    karistirilan: ['Lizozom', 'Golgi cisimciği', 'Mitokondri', 'Koful', 'Granülsüz endoplazmik retikulum'],
    aciklama:
      'Hücrede biriken hidrojen peroksit zehirlidir; peroksizom onu zararsız hâle getirir. Karaciğer ve böbrek hücrelerinde çok bulunur.',
    zorluk: 'zor',
  },
  {
    organel: 'Kromoplast',
    soru: 'Havuca turuncu, domatese kırmızı rengini veren pigmentleri taşıyan plastit hangisidir?',
    karistirilan: ['Kloroplast', 'Lökoplast', 'Lizozom', 'Peroksizom'],
    aciklama:
      'Renk verir ama fotosentez yapmaz. Karoten (turuncu), ksantofil (sarı) ve likopen (kırmızı) gibi pigmentleri taşır; böceklerin çiçeğe gelmesini sağlar.',
    zorluk: 'zor',
  },
  {
    organel: 'Lökoplast',
    soru: 'Patates yumrusu gibi ışık almayan yerlerde nişasta depolayan renksiz plastit hangisidir?',
    karistirilan: ['Kloroplast', 'Kromoplast', 'Koful', 'Vezikül'],
    aciklama:
      'Kök, yumru ve tohumda nişasta, yağ ve protein depolar. Işık aldığında kloroplasta dönüşebilir; patatesin yeşermesinin sebebi budur.',
    zorluk: 'zor',
  },
  {
    organel: 'Sitoplazma',
    soru: 'Hücre zarı ile çekirdek arasını dolduran, organellerin içinde bulunduğu yarı akışkan yapı hangisidir?',
    karistirilan: ['Nükleoplazma', 'Stroma', 'Mitokondri matriksi', 'Hücre dışı matriks'],
    aciklama:
      'Organeller ile onları saran akışkan öz sudan (sitozol) oluşur. Prokaryot hücrelerde de bulunur; orada kalıtım maddesi doğrudan bunun içindedir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Çekirdek zarı',
    soru: 'Kalıtım maddesini sitoplazmadan ayıran, gözenekli ve çift katlı örtü hangisidir?',
    karistirilan: ['Hücre zarı', 'Hücre duvarı', 'Glikokaliks', 'Kapsül'],
    aciklama:
      'Dış katmanı granüllü endoplazmik retikulumla devam eder; gözeneklerinden RNA ve ribozom alt birimleri geçer. Bölünme başlarken erir, prokaryotlarda bulunmaz.',
    zorluk: 'kolay',
  },
  {
    organel: 'Nükleoplazma',
    soru: 'Çekirdeğin içini dolduran, kromatin ve çekirdekçiğin içinde bulunduğu sıvı hangisidir?',
    karistirilan: ['Sitoplazma', 'Stroma', 'Mitokondri matriksi', 'Hücre dışı matriks'],
    aciklama:
      'Çekirdek plazması da denir. Kromatini, çekirdekçiği ve çekirdek tepkimeleri için gereken enzimleri barındırır; DNA’nın eşlenmesi burada olur.',
    zorluk: 'zor',
  },
  {
    organel: 'Kromatin',
    soru: 'Bölünme yapmayan hücrenin çekirdeğinde ince ve dağınık iplikler hâlinde duran DNA-protein yapısı hangisidir?',
    karistirilan: ['Kromozom', 'Plazmit', 'Çekirdekçik', 'Nükleoid'],
    aciklama:
      'Kromatin ile kromozom aynı maddenin iki hâlidir: bölünme arası dönemde kromatin, bölünme sırasında kısalıp kalınlaşınca kromozom.',
    zorluk: 'orta',
  },
  {
    organel: 'Kromozom',
    soru: 'Bölünme sırasında kısalıp kalınlaşarak görünür hâle gelen, iki kardeş kromatidi sentromerle bağlı yapı hangisidir?',
    karistirilan: ['Kromatin', 'Sentriyol', 'Plazmit', 'Çekirdekçik'],
    aciklama:
      'Genleri taşır. İnsanın vücut hücrelerinde 46, üreme hücrelerinde 23 tanedir; sayı türü belirler, birey farkını değil.',
    zorluk: 'kolay',
  },
  {
    organel: 'Sentriyol',
    soru: 'Dokuzar üçlü mikrotübül demetinden oluşan, sil ve kamçının tabanında da bulunan silindir biçimli yapı hangisidir?',
    karistirilan: ['Ribozom', 'Mikrofilament', 'Ara filament', 'Çekirdekçik'],
    aciklama:
      'İkisi birbirine dik durup sentrozomu oluşturur. Bölünmede iğ ipliklerinin çıktığı merkezdir; sil ve kamçının temelini de kurar.',
    zorluk: 'orta',
  },
  {
    organel: 'Hücre iskeleti',
    soru: 'Mikrotübül, mikrofilament ve ara filamentlerin birlikte oluşturduğu, hücreye şekil veren protein ağı hangisidir?',
    karistirilan: ['Hücre dışı matriks', 'Hücre duvarı', 'Granülsüz endoplazmik retikulum', 'Golgi cisimciği'],
    aciklama:
      'Üç çeşit protein ipliğinden oluşur. Hücrenin şekli, organellerin yerinde durması, hücre içi taşıma ve hücrenin hareketi buna bağlıdır.',
    zorluk: 'kolay',
  },
  {
    organel: 'Mikrotübül',
    soru: 'Hücre iskeletinin tübülin proteininden yapılmış, içi boş boru biçimindeki en kalın ipliği hangisidir?',
    karistirilan: ['Mikrofilament', 'Ara filament', 'Kromatin', 'Plazmodesma'],
    aciklama:
      'Organeller onun üzerinde taşınır. Sentriyol, sil, kamçı ve bölünmedeki iğ ipliklerinin yapı taşıdır.',
    zorluk: 'orta',
  },
  {
    organel: 'Mikrofilament',
    soru: 'Aktin proteininden yapılan, kas kasılmasında görev alan, hücre iskeletinin en ince ipliği hangisidir?',
    karistirilan: ['Mikrotübül', 'Ara filament', 'Sil', 'Kromatin'],
    aciklama:
      'Hücre zarının hemen altında yoğunlaşır. Kas kasılması, hayvan hücresinin bölünme sonunda boğumlanması ve şekil değiştirmesi bununla olur.',
    zorluk: 'orta',
  },
  {
    organel: 'Ara filament',
    soru: 'Hücre iskeletinde keratin gibi dayanıklı proteinlerden yapılan, hücreye mekanik dayanıklılık veren iplik hangisidir?',
    karistirilan: ['Mikrotübül', 'Mikrofilament', 'Kromatin', 'Sil'],
    aciklama:
      'Kalınlığı mikrotübül ile mikrofilament arasındadır. Çekirdeği ve organelleri yerinde tutar; deri gibi baskıya uğrayan dokularda boldur.',
    zorluk: 'zor',
  },
  {
    organel: 'Sil',
    soru: 'Hücre yüzeyinde kısa ve çok sayıda bulunan, paramesyumun yüzmesini sağlayan yapı hangisidir?',
    karistirilan: ['Kamçı', 'Glikokaliks', 'Kapsül', 'Plazmodesma'],
    aciklama:
      'Kürek çeker gibi hareket eder; soluk borusunda tozu ve mukusu süpürür. İç yapısı kamçıyla aynıdır; sil kısa ve çok, kamçı uzun ve azdır.',
    zorluk: 'kolay',
  },
  {
    organel: 'Kamçı',
    soru: 'Uzun ve genellikle bir ya da iki tane olan, spermin hareketini sağlayan yapı hangisidir?',
    karistirilan: ['Sil', 'Kapsül', 'Glikokaliks'],
    aciklama:
      'Kırbaç gibi savrularak hücreyi yüzdürür. Sperm, öglena ve bazı bakterilerde bulunur; sile göre uzun ve az sayıdadır.',
    zorluk: 'kolay',
  },
  {
    organel: 'Glikokaliks',
    soru: 'Hücre zarının dış yüzeyinde bulunan, hücrelerin birbirini tanımasını sağlayan karbonhidrat örtüsü hangisidir?',
    karistirilan: ['Kapsül', 'Hücre duvarı', 'Hücre dışı matriks', 'Çekirdek zarı'],
    aciklama:
      'Zardaki protein ve yağlara bağlı karbonhidrat zincirlerinden oluşur. Hücre tanınmasında, doku oluşumunda ve bağışıklıkta görevlidir; kan grubu işaretleri buradadır.',
    zorluk: 'zor',
  },
  {
    organel: 'Plazmodesma',
    soru: 'Bitkide komşu hücrelerin sitoplazmasını, hücre duvarındaki geçitlerden birbirine bağlayan yapı hangisidir?',
    karistirilan: ['Hücre dışı matriks', 'Glikokaliks', 'Vezikül', 'Mikrotübül'],
    aciklama:
      'Bitki hücrelerini duvarlarındaki geçitler üzerinden birbirine bağlar; su, besin ve sinyal molekülleri buradan geçer.',
    zorluk: 'zor',
  },
  {
    organel: 'Tilakoid',
    soru: 'Kloroplastta zarında klorofil bulunan, fotosentezin ışığa bağlı tepkimelerinin geçtiği yassı kese hangisidir?',
    karistirilan: ['Stroma', 'Krista', 'Vezikül', 'Golgi cisimciği'],
    aciklama:
      'Işık enerjisinin tutulduğu zar sistemidir; ATP ve NADPH burada üretilir. Üst üste dizilenleri granumu oluşturur.',
    zorluk: 'orta',
  },
  {
    organel: 'Granum',
    soru: 'Kloroplastta tilakoidlerin bozuk para gibi üst üste dizilmesiyle oluşan yapı hangisidir?',
    karistirilan: ['Stroma', 'Krista', 'Golgi cisimciği', 'Mitokondri matriksi'],
    aciklama:
      'Klorofilin yoğunlaştığı yerdir; kloroplastta ışık tepkimelerinin geçtiği bölgedir.',
    zorluk: 'zor',
  },
  {
    organel: 'Stroma',
    soru: 'Kloroplastın içini dolduran, karbondioksidin şekere çevrildiği tepkimelerin geçtiği sıvı hangisidir?',
    karistirilan: ['Mitokondri matriksi', 'Nükleoplazma', 'Tilakoid', 'Granum'],
    aciklama:
      'Kloroplastın renksiz temel maddesidir. Fotosentezin ışıktan bağımsız tepkimeleri burada işler; kloroplastın DNA’sı ve ribozomları da buradadır.',
    zorluk: 'zor',
  },
  {
    organel: 'Krista',
    soru: 'Mitokondrinin iç zarının içe doğru kıvrılmasıyla oluşan ve yüzeyi artıran yapı hangisidir?',
    karistirilan: ['Mitokondri matriksi', 'Tilakoid', 'Granum', 'Mezozom'],
    aciklama:
      'Üzerinde elektron taşıma sistemi dizilidir. Sayısı arttıkça yüzey, yüzey arttıkça üretilen ATP artar; enerji ihtiyacı yüksek hücrelerde çoktur.',
    zorluk: 'orta',
  },
  {
    organel: 'Mitokondri matriksi',
    soru: 'Mitokondrinin en iç bölmesini dolduran, kendi DNA’sı ve ribozomlarının bulunduğu sıvı hangisidir?',
    karistirilan: ['Stroma', 'Krista', 'Sitoplazma', 'Nükleoplazma'],
    aciklama:
      'Mitokondrinin iç zarının kuşattığı sıvıdır. Krebs döngüsü burada geçer; mitokondrinin halkasal DNA’sı ve ribozomları da buradadır.',
    zorluk: 'zor',
  },
  {
    organel: 'Vezikül',
    soru: 'Zardan koparak oluşan, maddeleri golgiden hücre zarına taşıyan küçük ve kısa ömürlü kesecik hangisidir?',
    karistirilan: ['Koful', 'Lizozom', 'Peroksizom'],
    aciklama:
      'Zarla çevrili küçük taşıma kesesidir. Kofuldan farkı depolamak değil, madde taşımak için kısa süre var olmasıdır.',
    zorluk: 'orta',
  },
  {
    organel: 'Nükleoid',
    soru: 'Bakteride halkasal DNA’nın toplandığı, zarla çevrili olmayan bölge hangisidir?',
    karistirilan: ['Plazmit', 'Mezozom', 'Çekirdek', 'Kapsül'],
    aciklama:
      'Prokaryot hücrede kalıtım maddesinin toplandığı bölgedir; ökaryottaki çekirdeğin işini görür ama zarı yoktur.',
    zorluk: 'orta',
  },
  {
    organel: 'Plazmit',
    soru: 'Bakteride asıl kalıtım maddesinden bağımsız bulunan, antibiyotik direnci genleri taşıyabilen küçük halkasal DNA hangisidir?',
    karistirilan: ['Nükleoid', 'Mezozom', 'Kapsül'],
    aciklama:
      'Kendini tek başına eşleyebilir. Bakterinin yaşaması için zorunlu değildir ama ek özellikler kazandırır; gen mühendisliğinde taşıyıcı olarak kullanılır.',
    zorluk: 'orta',
  },
  {
    organel: 'Mezozom',
    soru: 'Bakteride hücre zarının içe kıvrılmasıyla oluşan, solunum enzimlerini taşıyan yapı hangisidir?',
    karistirilan: ['Nükleoid', 'Plazmit', 'Kapsül', 'Krista'],
    aciklama:
      'Ders kitaplarında bakterinin solunum ve bölünme yeri olarak anlatılır; bu yüzden “bakterinin mitokondrisi” de denir.',
    zorluk: 'zor',
  },
  {
    organel: 'Kapsül',
    soru: 'Bazı bakterilerde hücre duvarının dışını saran, bakteriyi akyuvarlara karşı koruyan yapışkan örtü hangisidir?',
    karistirilan: ['Hücre zarı', 'Glikokaliks', 'Mezozom', 'Nükleoid'],
    aciklama:
      'Polisakkarit yapılı koruyucu tabakadır; bakteriyi kurumaya karşı da korur. Kapsüllü bakteriler bağışıklık sisteminden daha kolay kaçar.',
    zorluk: 'zor',
  },
  {
    organel: 'Hücre dışı matriks',
    soru: 'Hayvan dokularında hücrelerin arasını dolduran, kollajen gibi proteinlerden oluşan ağ hangisidir?',
    karistirilan: ['Hücre duvarı', 'Glikokaliks', 'Hücre iskeleti', 'Sitoplazma'],
    aciklama:
      'Hayvan hücresinde duvar yoktur; hücreleri bir arada tutan ve kemiğe, kıkırdağa dayanıklılık veren yapı budur.',
    zorluk: 'zor',
  },
]

export const HUCRE_BOYUTU = HUCRE_HAVUZU.length
