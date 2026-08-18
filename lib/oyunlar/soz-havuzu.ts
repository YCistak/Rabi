/**
 * Deyim ve Atasözü oyununun havuzu.
 *
 * Her satır bir söz, anlamı, türü (deyim mi atasözü mü) ve **konusu**.
 *
 * ## Konu neden var
 *
 * Şıklar sabit bir listeden değil, havuzun kendisinden geliyor: çeldiriciler
 * başka sözlerin anlamları. Ama iki deyim aynı anlama gelebiliyor — *etekleri
 * zil çalmak* ile *ağzı kulaklarına varmak* ikisi de "çok sevinmek" demek. Aynı
 * soruda karşılaşırlarsa iki şık birden doğru olur.
 *
 * Konu etiketi bunu engelliyor: çeldirici **farklı konudan** seçiliyor. Aynı
 * konudaki eşanlamlılar hiçbir zaman yan yana gelmiyor, dolayısıyla havuza
 * rahatça girebiliyorlar.
 *
 * Anlamlar TDK Atasözleri ve Deyimler Sözlüğü'ne dayanıyor ve bilerek kısa
 * tutuldu: dört şıkkın hepsi telefonda tek bakışta okunabilmeli.
 */

export type SozTuru = 'deyim' | 'atasozu'

export type SozKonusu = 'duygu' | 'davranis' | 'calisma' | 'para' | 'iletisim' | 'akil'

export type SozSorusu = {
  soz: string
  anlam: string
  tur: SozTuru
  konu: SozKonusu
}

export const TUR_ADI: Record<SozTuru, string> = {
  deyim: 'Deyim',
  atasozu: 'Atasözü',
}

export const KONU_ADI: Record<SozKonusu, string> = {
  duygu: 'Duygular',
  davranis: 'Davranış ve huy',
  calisma: 'Emek ve çalışma',
  para: 'Para ve geçim',
  iletisim: 'Söz ve iletişim',
  akil: 'Akıl, tedbir, talih',
}

/**
 * Deyim ile atasözünün farkı — tur sonunda yanlış bilinenin altında çıkıyor.
 * İkisinin ayrımı ÖSYM'nin ayrıca sorduğu bir konu.
 */
export const TUR_ACIKLAMASI: Record<SozTuru, string> = {
  deyim:
    'Deyim, anlatımı güçlendirmek için kullanılan kalıplaşmış söz öbeğidir; öğüt vermez, cümlenin içinde bir görev üstlenir.',
  atasozu:
    'Atasözü, uzun deneyimlerden çıkan bir yargıyı bildirir; öğüt verir ve tek başına bir cümle kurar.',
}

/** Havuzu okunur tutmak için: bir konuya ait bütün sözler tek yerde. */
function grup(konu: SozKonusu, sozler: [string, string, SozTuru][]): SozSorusu[] {
  return sozler.map(([soz, anlam, tur]) => ({ soz, anlam, tur, konu }))
}

export const SOZ_HAVUZU: readonly SozSorusu[] = [
  ...grup('duygu', [
    ['etekleri zil çalmak', 'Çok sevinmek', 'deyim'],
    ['ağzı kulaklarına varmak', 'Sevinci yüzünden okunmak', 'deyim'],
    ['içi içine sığmamak', 'Sevinçten yerinde duramamak', 'deyim'],
    ['yüreği ağzına gelmek', 'Ansızın çok korkmak', 'deyim'],
    ['ödü kopmak', 'Aşırı derecede korkmak', 'deyim'],
    ['burnunun direği sızlamak', 'Derin bir üzüntü duymak', 'deyim'],
    ['içi kan ağlamak', 'Belli etmeden çok üzülmek', 'deyim'],
    ['tepesi atmak', 'Birdenbire çok öfkelenmek', 'deyim'],
    ['küplere binmek', 'Öfkeden kendini kaybetmek', 'deyim'],
    ['yüreği burkulmak', 'Acıma duygusuyla üzülmek', 'deyim'],
    ['gözü korkmak', 'Kötü deneyimden sonra çekinir olmak', 'deyim'],
    ['eli ayağı buz kesmek', 'Korkudan donup kalmak', 'deyim'],
    ['bağrı yanmak', 'Büyük bir acı çekmek', 'deyim'],
    ['ağzının tadı kaçmak', 'Huzuru bozulmak', 'deyim'],
    ['yüzü gülmek', 'Sevinçli görünmek', 'deyim'],
    ['içi rahat etmek', 'Kaygısı geçip huzura kavuşmak', 'deyim'],
    ['kanı kaynamak', 'Birine karşı içten yakınlık duymak', 'deyim'],
    ['yüreği hop etmek', 'Ansızın telaşlanmak', 'deyim'],
    ['dünyalar onun olmak', 'Beklediğine kavuşup çok sevinmek', 'deyim'],
    ['gönlü olmak', 'Bir şeye sonunda razı olmak', 'deyim'],
  ]),

  ...grup('davranis', [
    ['burnu havada olmak', 'Kibirli davranmak', 'deyim'],
    ['çam devirmek', 'Farkında olmadan kırıcı söz söylemek', 'deyim'],
    ['pireyi deve yapmak', 'Küçük bir olayı büyütmek', 'deyim'],
    ['kaş yaparken göz çıkarmak', 'İyilik yapayım derken zarar vermek', 'deyim'],
    ['burnundan kıl aldırmamak', 'Kimseye söz hakkı tanımayacak kadar aksi olmak', 'deyim'],
    ['kabak tadı vermek', 'Tekrarlandığı için bıkkınlık vermek', 'deyim'],
    ['göze girmek', 'Davranışıyla beğeni kazanmak', 'deyim'],
    ['gözden düşmek', 'Eski değerini yitirmek', 'deyim'],
    ['el üstünde tutmak', 'Birine çok değer vermek', 'deyim'],
    ['yüzü tutmamak', 'Çekindiği için isteyememek', 'deyim'],
    ['burnunu sokmak', 'Kendini ilgilendirmeyen işe karışmak', 'deyim'],
    ['yüz vermek', 'Yakınlık göstererek şımartmak', 'deyim'],
    ['Huylu huyundan vazgeçmez', 'İnsan alışkanlıklarından kolay kolay kurtulamaz', 'atasozu'],
    ['Ağaç yaş iken eğilir', 'Eğitim küçük yaşta verilir', 'atasozu'],
    ['Üzüm üzüme baka baka kararır', 'İnsan yakın olduğu kişiden etkilenir', 'atasozu'],
    ['Komşunun tavuğu komşuya kaz görünür', 'Başkasının malı insana büyük görünür', 'atasozu'],
    ['Kendi düşen ağlamaz', 'Kendi hatasından zarar gören kimseyi suçlayamaz', 'atasozu'],
    ['Eşek hoşaftan ne anlar', 'Değer bilmeyene sunulan şey boşa gider', 'atasozu'],
    ['kulak ardı etmek', 'Söyleneni önemsemeyip duymazdan gelmek', 'deyim'],
    ['burnu büyümek', 'Şımarıp kendini beğenmiş olmak', 'deyim'],
  ]),

  ...grup('calisma', [
    ['ipe un sermek', 'Bahane bulup işi savsaklamak', 'deyim'],
    ['dirsek çürütmek', 'Uzun süre öğrenim görmek', 'deyim'],
    ['kolları sıvamak', 'Bir işe girişmek', 'deyim'],
    ['göz nuru dökmek', 'Uzun ve yorucu emek harcamak', 'deyim'],
    ['ekmeğini taştan çıkarmak', 'Zor koşullarda geçimini sağlamak', 'deyim'],
    ['alnının teriyle kazanmak', 'Kendi emeğiyle kazanç sağlamak', 'deyim'],
    ['canla başla çalışmak', 'Bütün gücüyle uğraşmak', 'deyim'],
    ['iş başa düşmek', 'İşi kendisi yapmak zorunda kalmak', 'deyim'],
    ['taşı sıksa suyunu çıkarmak', 'Çok güçlü ve becerikli olmak', 'deyim'],
    ['ter dökmek', 'Bir iş için çok emek harcamak', 'deyim'],
    ['eli ekmek tutmak', 'Geçimini sağlayacak işe kavuşmak', 'deyim'],
    ['kan ter içinde kalmak', 'Çalışmaktan aşırı yorulmak', 'deyim'],
    ['iki eli kanda olsa', 'Ne kadar önemli işi olursa olsun', 'deyim'],
    ['eli yatkın olmak', 'Bir işi yapmaya alışkın olmak', 'deyim'],
    ['Bugünün işini yarına bırakma', 'İşi ertelemek zarar getirir', 'atasozu'],
    ['Zahmetsiz rahmet olmaz', 'Emek vermeden kazanç elde edilmez', 'atasozu'],
    ['Ekmeden biçilmez', 'Emek harcamadan sonuç alınmaz', 'atasozu'],
    ['Bir elin nesi var, iki elin sesi var', 'Birlikte çalışmak daha verimlidir', 'atasozu'],
    ['Acele işe şeytan karışır', 'Aceleyle yapılan iş bozulur', 'atasozu'],
    ['El elin eşeğini türkü çağırarak arar', 'Başkasının işi özenle yapılmaz', 'atasozu'],
  ]),

  ...grup('para', [
    ['eli açık olmak', 'Cömert davranmak', 'deyim'],
    ['eli sıkı olmak', 'Cimri davranmak', 'deyim'],
    ['ayağını yorganına göre uzatmak', 'Geliri kadar harcamak', 'deyim'],
    ['kesenin ağzını açmak', 'Bol bol para harcamak', 'deyim'],
    ['yükünü tutmak', 'Yeterince mal mülk edinmek', 'deyim'],
    ['iki yakası bir araya gelmemek', 'Geçim sıkıntısından kurtulamamak', 'deyim'],
    ['para canlısı olmak', 'Parayı her şeyden üstün tutmak', 'deyim'],
    ['cebi delik olmak', 'Elinde hiç para durmamak', 'deyim'],
    ['beş parasız kalmak', 'Hiç parası kalmamak', 'deyim'],
    ['eli darda olmak', 'Parasızlık çekmek', 'deyim'],
    ['boğazından kesmek', 'Yeme içmeden kısarak biriktirmek', 'deyim'],
    ['kazık atmak', 'Aşırı fiyat isteyerek zarara sokmak', 'deyim'],
    ['bir lokma bir hırka', 'Aza kanaat ederek yaşamak', 'deyim'],
    ['babasının hayrına çalışmak', 'Bir karşılık almadan iş yapmak', 'deyim'],
    ['Damlaya damlaya göl olur', 'Küçük birikimler zamanla büyür', 'atasozu'],
    ['Kaz gelecek yerden tavuk esirgenmez', 'Büyük kazanç için küçük fedakârlık yapılır', 'atasozu'],
    ['Sakla samanı gelir zamanı', 'Değersiz görünen şey ileride işe yarar', 'atasozu'],
    ['Ucuz etin yahnisi yavan olur', 'Ucuza alınan malın kalitesi düşük çıkar', 'atasozu'],
    ['Borç yiğidin kamçısıdır', 'Borç insanı çalışmaya iter', 'atasozu'],
    ['Az veren candan, çok veren maldan', 'Az veren imkânı kadar verir, küçümsenmez', 'atasozu'],
  ]),

  ...grup('iletisim', [
    ['ağzından baklayı çıkarmak', 'Sakladığı sözü sonunda söyleyivermek', 'deyim'],
    ['ağzı laf yapmak', 'Etkileyici biçimde konuşmak', 'deyim'],
    ['dilinin altında bir şey olmak', 'Söylemek istediğini gizlemek', 'deyim'],
    ['kulağına çalınmak', 'Bir haberi rastlantıyla duymak', 'deyim'],
    ['laf taşımak', 'Duyduğunu başkasına yetiştirip dedikodu yaymak', 'deyim'],
    ['ağzını bıçak açmamak', 'Üzüntüden konuşamaz olmak', 'deyim'],
    ['sözünü esirgememek', 'Düşündüğünü çekinmeden söylemek', 'deyim'],
    ['dile düşmek', 'Herkesin dedikodusuna konu olmak', 'deyim'],
    ['iğneli söz söylemek', 'Dokundurmak amacıyla konuşmak', 'deyim'],
    ['ağzı var dili yok', 'Sessiz, hakkını arayamayan', 'deyim'],
    ['lafı ağzına tıkamak', 'Konuşmasını sert biçimde kesmek', 'deyim'],
    ['kulak kabartmak', 'Gizlice dinlemeye çalışmak', 'deyim'],
    ['sözünde durmak', 'Verdiği sözü yerine getirmek', 'deyim'],
    ['dilinin ucunda olmak', 'Hatırlamak üzere olup söyleyememek', 'deyim'],
    ['ağzından kaçırmak', 'Söylememesi gerekeni istemeden söylemek', 'deyim'],
    ['Bir ağızdan çıkan bin dile yayılır', 'Söylenen söz çabucak duyulur', 'atasozu'],
    ['Söz gümüşse sükût altındır', 'Susmak kimi zaman konuşmaktan değerlidir', 'atasozu'],
    ['Tatlı dil yılanı deliğinden çıkarır', 'Güzel söz en katı kişiyi bile yumuşatır', 'atasozu'],
    ['Ateş olmayan yerden duman çıkmaz', 'Söylentinin bir dayanağı vardır', 'atasozu'],
    ['Bin bilsen de bir bilene danış', 'Ne kadar bilgili olsan da başkasına danışmalısın', 'atasozu'],
  ]),

  ...grup('akil', [
    ['akıntıya kürek çekmek', 'Sonuç alınamayacak işle uğraşmak', 'deyim'],
    ['pusulayı şaşırmak', 'Ne yapacağını bilemez duruma düşmek', 'deyim'],
    ['ipin ucunu kaçırmak', 'Bir işin denetimini elden bırakmak', 'deyim'],
    ['bir taşla iki kuş vurmak', 'Tek işle iki sonuç birden almak', 'deyim'],
    ['ateşle oynamak', 'Tehlikeli bir işe girişmek', 'deyim'],
    ['iki arada bir derede kalmak', 'İki güç durum arasında sıkışmak', 'deyim'],
    ['gözden kaçmak', 'Fark edilmeden geçmek', 'deyim'],
    ['şansı yaver gitmek', 'İşleri istediği gibi yolunda gitmek', 'deyim'],
    ['kestirip atmak', 'Kesin bir kararla işi bitirmek', 'deyim'],
    ['pabucu dama atılmak', 'Yerini daha iyisine kaptırmak', 'deyim'],
    ['Sütten ağzı yanan yoğurdu üfleyerek yer', 'Kötü deneyim yaşayan sonrasında çok dikkatli olur', 'atasozu'],
    ['Görünen köy kılavuz istemez', 'Apaçık olan şey açıklama gerektirmez', 'atasozu'],
    ['Sabreden derviş muradına ermiş', 'Sabreden sonunda istediğine kavuşur', 'atasozu'],
    ['Sakınan göze çöp batar', 'Aşırı korunan şey yine de zarar görebilir', 'atasozu'],
    ['Damdan düşen halden anlar', 'Aynı sıkıntıyı yaşayan başkasını anlar', 'atasozu'],
    ['Denize düşen yılana sarılır', 'Sıkışan kişi her çareye başvurur', 'atasozu'],
    ['Gülü seven dikenine katlanır', 'İstediğine ulaşmak için sıkıntıya katlanılır', 'atasozu'],
    ['Her yiğidin bir yoğurt yiyişi vardır', 'Herkesin kendine göre bir yöntemi vardır', 'atasozu'],
    ['Su testisi su yolunda kırılır', 'Kişi çoğunlukla işini yaptığı yerde zarar görür', 'atasozu'],
    ['Talihsiz hacıyı deve üstünde yılan sokar', 'Şanssız kişinin başına gelmedik kalmaz', 'atasozu'],
  ]),
] as const

export const SOZ_BOYUTU = SOZ_HAVUZU.length
