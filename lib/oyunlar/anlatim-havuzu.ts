/**
 * Anlatım Bozukluğu oyununun cümle havuzu.
 *
 * Her satır **bozuk** bir cümle ve içindeki tek bozukluk. Tek olması şart: oyun
 * dört sebep gösterip birini doğru sayıyor, cümlede iki bozukluk birden olsaydı
 * ikinci sebebi işaretleyen haksız yere yanlış olurdu.
 *
 * Bu yüzden bilerek dışarıda bırakılan kalıplar var:
 * - "Aşağı yukarı tam üç saat çalıştım" (hem gereksiz sözcük hem çelişme),
 * - "Genç adamın elini sıktı" (bozukluk değil, virgül eksikliği).
 *
 * **Çatı uyuşmazlığı** ayrı bir şık değil: bir yüklemin edilgen, ötekinin etken
 * olduğu cümlelerde ortak öznenin uymaması zaten özne eksikliği sayılıyor ve
 * ayrı şık yapılsaydı bu cümlelerin çoğunda iki cevap birden doğru olurdu.
 * Bu tür cümleler `ozne` altında duruyor.
 */

import type { Zorluk } from './ritim'

export type BozuklukTuru =
  | 'gereksizSozcuk'
  | 'yanlisAnlam'
  | 'yanlisYer'
  | 'belirsizlik'
  | 'mantik'
  | 'deyim'
  | 'ozne'
  | 'nesne'
  | 'tumlec'
  | 'yuklem'
  | 'tamlama'
  | 'ek'
  | 'uyum'

export type AnlatimSorusu = {
  /** Ekranda büyük yazılan bozuk cümle. */
  cumle: string
  /**
   * Cümlenin düzeltilmiş hâli.
   *
   * Soruda **gösterilmiyor**: yan yana konsa fark okunur ve sebebi düşünmeden
   * bulmak mümkün olurdu. Cevaptan sonra geri bildirimde ve tur sonu listesinde
   * çıkıyor.
   */
  duzeltme: string
  tur: BozuklukTuru
  zorluk: Zorluk
}

/** Şıklarda görünen ad. */
export const BOZUKLUK_ADI: Record<BozuklukTuru, string> = {
  gereksizSozcuk: 'Gereksiz sözcük kullanımı',
  yanlisAnlam: 'Sözcüğün yanlış anlamda kullanılması',
  yanlisYer: 'Sözcüğün yanlış yerde kullanılması',
  belirsizlik: 'Anlam belirsizliği',
  mantik: 'Mantık hatası',
  deyim: 'Deyimin yanlış kullanılması',
  ozne: 'Özne eksikliği',
  nesne: 'Nesne eksikliği',
  tumlec: 'Dolaylı tümleç eksikliği',
  yuklem: 'Yüklem eksikliği',
  tamlama: 'Tamlama yanlışlığı',
  ek: 'Ek yanlışlığı',
  uyum: 'Özne–yüklem uyumsuzluğu',
}

/** Tur sonunda, yanlış bilinen cümlenin altında görünen kural. */
export const BOZUKLUK_ACIKLAMASI: Record<BozuklukTuru, string> = {
  gereksizSozcuk:
    'Anlamı zaten karşılanmış bir sözcük cümlede ikinci kez yer alıyor; çıkarıldığında anlamdan hiçbir şey eksilmiyor.',
  yanlisAnlam:
    'Sözcük, anlamca yakın olduğu başka bir sözcüğün yerine kullanılmış; cümlenin istediği anlamı vermiyor.',
  yanlisYer:
    'Sözcük yanlış yerde durduğu için başka bir sözcüğü niteliyor; yeri değişince cümle düzeliyor.',
  belirsizlik: 'Cümledeki işin kime ya da neye ait olduğu anlaşılmıyor; birden çok okuması var.',
  mantik:
    'Cümledeki yargılar birbiriyle çelişiyor ya da olaylar gerçekte olabilecek sıranın tersinde veriliyor.',
  deyim: 'Deyim, taşıdığı anlamın dışında kullanılmış; cümlenin geri kalanıyla çelişiyor.',
  ozne: 'Yüklemlerden birinin öznesi cümlede yok; ortak sanılan özne o yükleme uymuyor.',
  nesne: 'Yüklemlerden biri nesne istiyor ama cümlede yok; ortak sanılan öge o yükleme uymuyor.',
  tumlec:
    'Yüklemlerden biri dolaylı tümleç istiyor ama cümlede yok; ortak sanılan öge o yükleme uymuyor.',
  yuklem: 'İkinci yargının yüklemi cümlede yok; ortak sanılan yüklem o yargıya uymuyor.',
  tamlama:
    'Tamlamada ortak kullanılan sözcük tamlayanların ikisine birden uymuyor; tamlama eksik ya da yanlış kurulmuş.',
  ek: 'Sözcüğün alması gereken ek eksik ya da yanlış; ögeler birbirine bağlanamıyor.',
  uyum:
    'Yüklem, öznenin tekilliğine/çoğulluğuna ya da kişisine uymuyor. Cansız varlıklar ve hayvanlar özne olduğunda yüklem tekil kalır.',
}

/**
 * Havuzu okunur tutmak için: bir bozukluğa ait bütün örnekler tek yerde.
 *
 * `taban` grubun zorluğu; bir örnek üçüncü eleman verirse onunki geçerli.
 * Böylece her satıra zorluk yazmak gerekmiyor, yalnızca gruptan ayrılanlar
 * işaretleniyor — ve ayrıldıkları göze çarpıyor.
 */
function grup(
  tur: BozuklukTuru,
  taban: Zorluk,
  ornekler: ([string, string] | [string, string, Zorluk])[],
): AnlatimSorusu[] {
  return ornekler.map(([cumle, duzeltme, zorluk]) => ({
    cumle,
    duzeltme,
    tur,
    zorluk: zorluk ?? taban,
  }))
}

export const ANLATIM_HAVUZU: readonly AnlatimSorusu[] = [
  ...grup('gereksizSozcuk', 'kolay', [
    ['Yaklaşık iki saat kadar yolda bekledik.', 'İki saat kadar yolda bekledik.'],
    ['Arkadaşımla karşılıklı anlaştık.', 'Arkadaşımla anlaştık.'],
    ['Akşam olunca eve geri döndük.', 'Akşam olunca eve döndük.'],
    ['Bu işi yalnızca sadece sen yapabilirsin.', 'Bu işi yalnızca sen yapabilirsin.'],
    ['Aşağı yukarı beş yıla yakın orada çalıştım.', 'Beş yıla yakın orada çalıştım.', 'orta'],
    ['Az kalsın neredeyse düşüyordum.', 'Az kalsın düşüyordum.'],
    [
      'Ucuz olduğu için bu ceketi tercih ederek seçtim.',
      'Ucuz olduğu için bu ceketi seçtim.',
      'orta',
    ],
    ['Onunla ilk tanışmamız beş yıl önce olmuştu.', 'Onunla tanışmamız beş yıl önce olmuştu.', 'orta'],
    ['Konuyu kendi aramızda birbirimizle konuştuk.', 'Konuyu kendi aramızda konuştuk.'],
  ]),

  ...grup('yanlisAnlam', 'zor', [
    [
      'Öğretimini yurt dışında tamamlayan ablam yeni döndü.',
      'Öğrenimini yurt dışında tamamlayan ablam yeni döndü.',
    ],
    ['Bu okulda hiçbir öğrenciye ayrıcalık yapılmaz.', 'Bu okulda hiçbir öğrenciye ayrım yapılmaz.'],
    ['Toplantıda çekingen kaldı, oy kullanmadı.', 'Toplantıda çekimser kaldı, oy kullanmadı.'],
    ['Okuduğu kitaplar onun yaşantısını değiştirdi.', 'Okuduğu kitaplar onun yaşamını değiştirdi.'],
    [
      'Verilen ücreti küçümsedi, daha fazlasını istedi.',
      'Verilen ücreti azımsadı, daha fazlasını istedi.',
    ],
    [
      'Sınav sonuçları bir hafta sonra öğrencilere tebliğ edildi.',
      'Sınav sonuçları bir hafta sonra öğrencilere duyuruldu.',
    ],
  ]),

  ...grup('yanlisYer', 'orta', [
    ['Adam, kirli çocuğun elini yıkadı.', 'Adam, çocuğun kirli elini yıkadı.'],
    ['Yırtık çocuğun pantolonunu diktim.', 'Çocuğun yırtık pantolonunu diktim.'],
    ['Uzun adamın saçlarını kestiler.', 'Adamın uzun saçlarını kestiler.'],
    ['Hızlı arabayı sürdüğü için ceza aldı.', 'Arabayı hızlı sürdüğü için ceza aldı.'],
    ['Sıcak çayın bardağını eline aldı.', 'Çayın sıcak bardağını eline aldı.', 'zor'],
  ]),

  ...grup('belirsizlik', 'zor', [
    ['Kardeşiyle babasının arkadaşını ziyaret etti.', 'Kardeşi, babasının arkadaşını ziyaret etti.'],
    [
      'Ayşe, annesine onu çok özlediğini söyledi.',
      'Ayşe, annesine kardeşini çok özlediğini söyledi.',
    ],
    ['Öğretmen, öğrenciyi odasına çağırdı.', 'Öğretmen, öğrenciyi kendi odasına çağırdı.'],
    ['Beni her gördüğünde kitabını sorardı.', 'Beni her gördüğünde kendi kitabını sorardı.'],
    ['Onunla dün konuştuğunu bana söyledi.', 'Onunla dün kendisinin konuştuğunu bana söyledi.'],
  ]),

  ...grup('mantik', 'orta', [
    [
      'Yaralılar, ilk tedavileri yapıldıktan sonra hastaneye kaldırıldı.',
      'Yaralılar hastaneye kaldırıldı, ilk tedavileri orada yapıldı.',
    ],
    ['Kesinlikle sanırım yarın gelir.', 'Sanırım yarın gelir.', 'kolay'],
    ['Hiç kuşkusuz belki de en iyi çözüm budur.', 'Belki de en iyi çözüm budur.', 'kolay'],
    ['Kitabı okuyup kütüphaneden aldı.', 'Kitabı kütüphaneden alıp okudu.'],
    ['Ödevini yazdıktan sonra defterini açtı.', 'Defterini açtıktan sonra ödevini yazdı.'],
    ['Eminim ki galiba treni kaçırdılar.', 'Galiba treni kaçırdılar.', 'kolay'],
  ]),

  ...grup('deyim', 'orta', [
    [
      'Arkadaşının kazandığını duyunca burnu havaya kalktı, çok sevindi.',
      'Arkadaşının kazandığını duyunca etekleri zil çaldı.',
    ],
    ['Söylediklerime kulak asmadı, hemen yerine getirdi.', 'Söylediklerime kulak verdi, hemen yerine getirdi.'],
    ['Kaza haberini alınca ağzı kulaklarına vardı.', 'Kaza haberini alınca eli ayağı buz kesti.'],
    [
      'İşleri yolunda gitmeyince pes etti, daha çok çalıştı.',
      'İşleri yolunda gitmeyince işine dört elle sarıldı.',
    ],
    ['Kardeşine çok kızdı, ona kol kanat gerdi.', 'Kardeşine çok kızdı, ona ateş püskürdü.', 'zor'],
  ]),

  ...grup('ozne', 'zor', [
    ['Herkes tarafından sevilir ve sayardı.', 'Herkes tarafından sevilir, herkes onu sayardı.'],
    ['Bu iş için çok uğraştı ama başarılı olunamadı.', 'Bu iş için çok uğraştı ama başarılı olamadı.'],
    [
      'Sınıfa girildi ve hemen ders anlatmaya başladı.',
      'Öğretmen sınıfa girdi ve hemen ders anlatmaya başladı.',
    ],
    ['Ödevini bitirdi, sonra da oyun oynandı.', 'Ödevini bitirdi, sonra da oyun oynadı.'],
    [
      'Toplantıda uzun uzun konuşuldu ama bir karara varamadı.',
      'Toplantıda uzun uzun konuşuldu ama bir karara varılamadı.',
    ],
  ]),

  ...grup('nesne', 'orta', [
    ['Ondan hoşlanmıyorum, hiç sevmiyorum.', 'Ondan hoşlanmıyorum, onu hiç sevmiyorum.'],
    ['Bu soruna herkes üzüldü ama kimse çözemedi.', 'Bu soruna herkes üzüldü ama kimse sorunu çözemedi.'],
    ['Arkadaşıma çok güvenirdim, asla kırmazdım.', 'Arkadaşıma çok güvenirdim, onu asla kırmazdım.'],
    [
      'Kitaptan çok etkilendim, hemen arkadaşıma önerdim.',
      'Kitaptan çok etkilendim, kitabı hemen arkadaşıma önerdim.',
    ],
    ['Çocuğa bağırdı ama sonra teselli etti.', 'Çocuğa bağırdı ama sonra onu teselli etti.'],
  ]),

  ...grup('tumlec', 'zor', [
    ['Sanatı çok sever, büyük değer verirdi.', 'Sanatı çok sever, sanata büyük değer verirdi.'],
    [
      'Kardeşimi çok özlüyorum, sürekli mektup yazıyorum.',
      'Kardeşimi çok özlüyorum, ona sürekli mektup yazıyorum.',
    ],
    [
      'Bu şehri çok seviyorum, yıllardır yaşıyorum.',
      'Bu şehri çok seviyorum, burada yıllardır yaşıyorum.',
    ],
    ['Onu çok özledim, günlerdir haber alamıyorum.', 'Onu çok özledim, ondan günlerdir haber alamıyorum.'],
    [
      'Bu filmi çok beğendim, herkese bahsettim.',
      'Bu filmi çok beğendim, herkese bu filmden bahsettim.',
    ],
  ]),

  ...grup('yuklem', 'zor', [
    ['Sen bu konuda çok çalıştın ama ben hiç.', 'Sen bu konuda çok çalıştın ama ben hiç çalışmadım.'],
    ['Onlar dün geldi, biz de yarın.', 'Onlar dün geldi, biz de yarın geleceğiz.'],
    ['Ben bu filmi izledim ama kardeşim henüz.', 'Ben bu filmi izledim ama kardeşim henüz izlemedi.'],
    ['Herkes sorulara cevap verdi, yalnız o hiç.', 'Herkes sorulara cevap verdi, yalnız o hiç vermedi.'],
  ]),

  ...grup('tamlama', 'orta', [
    [
      'Ekonomik ve siyaset ilişkileri son yıllarda gelişti.',
      'Ekonomik ve siyasi ilişkiler son yıllarda gelişti.',
    ],
    [
      'Okulda sosyal ve kültür etkinlikleri düzenleniyor.',
      'Okulda sosyal ve kültürel etkinlikler düzenleniyor.',
    ],
    [
      'Bilimsel ve teknoloji gelişmeler hayatı kolaylaştırdı.',
      'Bilimsel ve teknolojik gelişmeler hayatı kolaylaştırdı.',
    ],
    [
      'Öğrencilerin başarı ve davranışları değerlendirildi.',
      'Öğrencilerin başarıları ve davranışları değerlendirildi.',
      'zor',
    ],
    ['Bu konuda hiçbir bilgi ve deneyimim yok.', 'Bu konuda hiçbir bilgim ve deneyimim yok.', 'zor'],
  ]),

  ...grup('ek', 'zor', [
    ['Bu davranışı hepimizi çok üzdü.', 'Bu davranış hepimizi çok üzdü.'],
    [
      'Onun ne kadar çalıştığı ve ne kadar yorulduğu hepimiz biliyoruz.',
      'Onun ne kadar çalıştığını ve ne kadar yorulduğunu hepimiz biliyoruz.',
    ],
    ['Onun bu konuda haklı olduğu kabul ediyorum.', 'Onun bu konuda haklı olduğunu kabul ediyorum.'],
    ['Sizin bu kadar erken geleceğiniz bilmiyordum.', 'Sizin bu kadar erken geleceğinizi bilmiyordum.'],
  ]),

  ...grup('uyum', 'kolay', [
    ['Ağaçlar sonbaharda yapraklarını döktüler.', 'Ağaçlar sonbaharda yapraklarını döktü.'],
    ['Ben ve kardeşim sinemaya gittiler.', 'Ben ve kardeşim sinemaya gittik.'],
    ['Sen ve arkadaşın yarın erken gelecekler.', 'Sen ve arkadaşın yarın erken geleceksiniz.'],
    ['Kuşlar gökyüzünde uçuyorlar.', 'Kuşlar gökyüzünde uçuyor.'],
    ['Öğrencilerin hepsi sınava girdiler.', 'Öğrencilerin hepsi sınava girdi.', 'orta'],
    ['Masalar salona taşındılar.', 'Masalar salona taşındı.'],
  ]),
]

export const ANLATIM_BOYUTU = ANLATIM_HAVUZU.length
