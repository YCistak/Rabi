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

import type { Zorluk } from './ritim'

export type SozTuru = 'deyim' | 'atasozu'

export type SozKonusu = 'duygu' | 'davranis' | 'calisma' | 'para' | 'iletisim' | 'akil'

export type SozSorusu = {
  soz: string
  anlam: string
  tur: SozTuru
  konu: SozKonusu
  /**
   * Zorluk.
   *
   * Burada zorluğu belirleyen konu değil, sözün **ne kadar bilindiği**:
   * "küplere binmek" ile "burnundan kıl aldırmamak" aynı konudan ama aynı
   * zorlukta değil. Bu yüzden grup tabanı `orta`, ayrılanlar tek tek işaretli.
   */
  zorluk: Zorluk
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
function grup(
  konu: SozKonusu,
  sozler: ([string, string, SozTuru] | [string, string, SozTuru, Zorluk])[],
): SozSorusu[] {
  return sozler.map(([soz, anlam, tur, zorluk]) => ({
    soz,
    anlam,
    tur,
    konu,
    zorluk: zorluk ?? 'orta',
  }))
}

export const SOZ_HAVUZU: readonly SozSorusu[] = [
  ...grup('duygu', [
    ['etekleri zil çalmak', 'Çok sevinmek', 'deyim', 'kolay'],
    ['ağzı kulaklarına varmak', 'Sevinci yüzünden okunmak', 'deyim', 'kolay'],
    ['içi içine sığmamak', 'Sevinçten yerinde duramamak', 'deyim'],
    ['yüreği ağzına gelmek', 'Ansızın çok korkmak', 'deyim'],
    ['ödü kopmak', 'Aşırı derecede korkmak', 'deyim', 'kolay'],
    ['burnunun direği sızlamak', 'Derin bir üzüntü duymak', 'deyim', 'zor'],
    ['içi kan ağlamak', 'Belli etmeden çok üzülmek', 'deyim'],
    ['tepesi atmak', 'Birdenbire çok öfkelenmek', 'deyim', 'kolay'],
    ['küplere binmek', 'Öfkeden kendini kaybetmek', 'deyim', 'kolay'],
    ['yüreği burkulmak', 'Acıma duygusuyla üzülmek', 'deyim'],
    ['gözü korkmak', 'Kötü deneyimden sonra çekinir olmak', 'deyim'],
    ['eli ayağı buz kesmek', 'Korkudan donup kalmak', 'deyim'],
    ['bağrı yanmak', 'Büyük bir acı çekmek', 'deyim', 'zor'],
    ['ağzının tadı kaçmak', 'Huzuru bozulmak', 'deyim'],
    ['yüzü gülmek', 'Sevinçli görünmek', 'deyim', 'kolay'],
    ['içi rahat etmek', 'Kaygısı geçip huzura kavuşmak', 'deyim'],
    ['kanı kaynamak', 'Birine karşı içten yakınlık duymak', 'deyim'],
    ['yüreği hop etmek', 'Ansızın telaşlanmak', 'deyim'],
    ['dünyalar onun olmak', 'Beklediğine kavuşup çok sevinmek', 'deyim', 'zor'],
    ['gönlü olmak', 'Bir şeye sonunda razı olmak', 'deyim'],
  ]),

  ...grup('davranis', [
    ['burnu havada olmak', 'Kibirli davranmak', 'deyim', 'kolay'],
    ['çam devirmek', 'Farkında olmadan kırıcı söz söylemek', 'deyim'],
    ['pireyi deve yapmak', 'Küçük bir olayı büyütmek', 'deyim', 'kolay'],
    ['kaş yaparken göz çıkarmak', 'İyilik yapayım derken zarar vermek', 'deyim'],
    ['burnundan kıl aldırmamak', 'Kimseye söz hakkı tanımayacak kadar aksi olmak', 'deyim', 'zor'],
    ['kabak tadı vermek', 'Tekrarlandığı için bıkkınlık vermek', 'deyim'],
    ['göze girmek', 'Davranışıyla beğeni kazanmak', 'deyim', 'kolay'],
    ['gözden düşmek', 'Eski değerini yitirmek', 'deyim', 'kolay'],
    ['el üstünde tutmak', 'Birine çok değer vermek', 'deyim'],
    ['yüzü tutmamak', 'Çekindiği için isteyememek', 'deyim', 'zor'],
    ['burnunu sokmak', 'Kendini ilgilendirmeyen işe karışmak', 'deyim', 'kolay'],
    ['yüz vermek', 'Yakınlık göstererek şımartmak', 'deyim'],
    ['Huylu huyundan vazgeçmez', 'İnsan alışkanlıklarından kolay kolay kurtulamaz', 'atasozu', 'kolay'],
    ['Ağaç yaş iken eğilir', 'Eğitim küçük yaşta verilir', 'atasozu', 'kolay'],
    ['Üzüm üzüme baka baka kararır', 'İnsan yakın olduğu kişiden etkilenir', 'atasozu'],
    ['Komşunun tavuğu komşuya kaz görünür', 'Başkasının malı insana büyük görünür', 'atasozu', 'zor'],
    ['Kendi düşen ağlamaz', 'Kendi hatasından zarar gören kimseyi suçlayamaz', 'atasozu', 'kolay'],
    ['Eşek hoşaftan ne anlar', 'Değer bilmeyene sunulan şey boşa gider', 'atasozu', 'zor'],
    ['kulak ardı etmek', 'Söyleneni önemsemeyip duymazdan gelmek', 'deyim'],
    ['burnu büyümek', 'Şımarıp kendini beğenmiş olmak', 'deyim'],
  ]),

  ...grup('calisma', [
    ['ipe un sermek', 'Bahane bulup işi savsaklamak', 'deyim', 'zor'],
    ['dirsek çürütmek', 'Uzun süre öğrenim görmek', 'deyim', 'zor'],
    ['kolları sıvamak', 'Bir işe girişmek', 'deyim', 'kolay'],
    ['göz nuru dökmek', 'Uzun ve yorucu emek harcamak', 'deyim', 'zor'],
    ['ekmeğini taştan çıkarmak', 'Zor koşullarda geçimini sağlamak', 'deyim'],
    ['alnının teriyle kazanmak', 'Kendi emeğiyle kazanç sağlamak', 'deyim'],
    ['canla başla çalışmak', 'Bütün gücüyle uğraşmak', 'deyim'],
    ['iş başa düşmek', 'İşi kendisi yapmak zorunda kalmak', 'deyim'],
    ['taşı sıksa suyunu çıkarmak', 'Çok güçlü ve becerikli olmak', 'deyim', 'zor'],
    ['ter dökmek', 'Bir iş için çok emek harcamak', 'deyim', 'kolay'],
    ['eli ekmek tutmak', 'Geçimini sağlayacak işe kavuşmak', 'deyim'],
    ['kan ter içinde kalmak', 'Çalışmaktan aşırı yorulmak', 'deyim'],
    ['iki eli kanda olsa', 'Ne kadar önemli işi olursa olsun', 'deyim', 'zor'],
    ['eli yatkın olmak', 'Bir işi yapmaya alışkın olmak', 'deyim', 'zor'],
    ['Bugünün işini yarına bırakma', 'İşi ertelemek zarar getirir', 'atasozu', 'kolay'],
    ['Zahmetsiz rahmet olmaz', 'Emek vermeden kazanç elde edilmez', 'atasozu', 'zor'],
    ['Ekmeden biçilmez', 'Emek harcamadan sonuç alınmaz', 'atasozu'],
    ['Bir elin nesi var, iki elin sesi var', 'Birlikte çalışmak daha verimlidir', 'atasozu', 'kolay'],
    ['Acele işe şeytan karışır', 'Aceleyle yapılan iş bozulur', 'atasozu', 'kolay'],
    ['El elin eşeğini türkü çağırarak arar', 'Başkasının işi özenle yapılmaz', 'atasozu', 'zor'],
  ]),

  ...grup('para', [
    ['eli açık olmak', 'Cömert davranmak', 'deyim', 'kolay'],
    ['eli sıkı olmak', 'Cimri davranmak', 'deyim', 'kolay'],
    ['ayağını yorganına göre uzatmak', 'Geliri kadar harcamak', 'deyim', 'kolay'],
    ['kesenin ağzını açmak', 'Bol bol para harcamak', 'deyim'],
    ['yükünü tutmak', 'Yeterince mal mülk edinmek', 'deyim', 'zor'],
    ['iki yakası bir araya gelmemek', 'Geçim sıkıntısından kurtulamamak', 'deyim'],
    ['para canlısı olmak', 'Parayı her şeyden üstün tutmak', 'deyim'],
    ['cebi delik olmak', 'Elinde hiç para durmamak', 'deyim'],
    ['beş parasız kalmak', 'Hiç parası kalmamak', 'deyim', 'kolay'],
    ['eli darda olmak', 'Parasızlık çekmek', 'deyim'],
    ['boğazından kesmek', 'Yeme içmeden kısarak biriktirmek', 'deyim', 'zor'],
    ['kazık atmak', 'Aşırı fiyat isteyerek zarara sokmak', 'deyim'],
    ['bir lokma bir hırka', 'Aza kanaat ederek yaşamak', 'deyim', 'zor'],
    ['babasının hayrına çalışmak', 'Bir karşılık almadan iş yapmak', 'deyim', 'zor'],
    ['Damlaya damlaya göl olur', 'Küçük birikimler zamanla büyür', 'atasozu', 'kolay'],
    ['Kaz gelecek yerden tavuk esirgenmez', 'Büyük kazanç için küçük fedakârlık yapılır', 'atasozu', 'zor'],
    ['Sakla samanı gelir zamanı', 'Değersiz görünen şey ileride işe yarar', 'atasozu', 'kolay'],
    ['Ucuz etin yahnisi yavan olur', 'Ucuza alınan malın kalitesi düşük çıkar', 'atasozu', 'zor'],
    ['Borç yiğidin kamçısıdır', 'Borç insanı çalışmaya iter', 'atasozu', 'zor'],
    ['Az veren candan, çok veren maldan', 'Az veren imkânı kadar verir, küçümsenmez', 'atasozu', 'zor'],
  ]),

  ...grup('iletisim', [
    ['ağzından baklayı çıkarmak', 'Sakladığı sözü sonunda söyleyivermek', 'deyim', 'kolay'],
    ['ağzı laf yapmak', 'Etkileyici biçimde konuşmak', 'deyim'],
    ['dilinin altında bir şey olmak', 'Söylemek istediğini gizlemek', 'deyim', 'zor'],
    ['kulağına çalınmak', 'Bir haberi rastlantıyla duymak', 'deyim'],
    ['laf taşımak', 'Duyduğunu başkasına yetiştirip dedikodu yaymak', 'deyim', 'kolay'],
    ['ağzını bıçak açmamak', 'Üzüntüden konuşamaz olmak', 'deyim'],
    ['sözünü esirgememek', 'Düşündüğünü çekinmeden söylemek', 'deyim'],
    ['dile düşmek', 'Herkesin dedikodusuna konu olmak', 'deyim'],
    ['iğneli söz söylemek', 'Dokundurmak amacıyla konuşmak', 'deyim', 'zor'],
    ['ağzı var dili yok', 'Sessiz, hakkını arayamayan', 'deyim', 'zor'],
    ['lafı ağzına tıkamak', 'Konuşmasını sert biçimde kesmek', 'deyim'],
    ['kulak kabartmak', 'Gizlice dinlemeye çalışmak', 'deyim', 'kolay'],
    ['sözünde durmak', 'Verdiği sözü yerine getirmek', 'deyim', 'kolay'],
    ['dilinin ucunda olmak', 'Hatırlamak üzere olup söyleyememek', 'deyim'],
    ['ağzından kaçırmak', 'Söylememesi gerekeni istemeden söylemek', 'deyim'],
    ['Bir ağızdan çıkan bin dile yayılır', 'Söylenen söz çabucak duyulur', 'atasozu', 'zor'],
    ['Söz gümüşse sükût altındır', 'Susmak kimi zaman konuşmaktan değerlidir', 'atasozu', 'kolay'],
    ['Tatlı dil yılanı deliğinden çıkarır', 'Güzel söz en katı kişiyi bile yumuşatır', 'atasozu', 'kolay'],
    ['Ateş olmayan yerden duman çıkmaz', 'Söylentinin bir dayanağı vardır', 'atasozu', 'kolay'],
    ['Bin bilsen de bir bilene danış', 'Ne kadar bilgili olsan da başkasına danışmalısın', 'atasozu', 'zor'],
  ]),

  ...grup('akil', [
    ['akıntıya kürek çekmek', 'Sonuç alınamayacak işle uğraşmak', 'deyim'],
    ['pusulayı şaşırmak', 'Ne yapacağını bilemez duruma düşmek', 'deyim', 'zor'],
    ['ipin ucunu kaçırmak', 'Bir işin denetimini elden bırakmak', 'deyim'],
    ['bir taşla iki kuş vurmak', 'Tek işle iki sonuç birden almak', 'deyim', 'kolay'],
    ['ateşle oynamak', 'Tehlikeli bir işe girişmek', 'deyim', 'kolay'],
    ['iki arada bir derede kalmak', 'İki güç durum arasında sıkışmak', 'deyim'],
    ['gözden kaçmak', 'Fark edilmeden geçmek', 'deyim', 'kolay'],
    ['şansı yaver gitmek', 'İşleri istediği gibi yolunda gitmek', 'deyim'],
    ['kestirip atmak', 'Kesin bir kararla işi bitirmek', 'deyim', 'zor'],
    ['pabucu dama atılmak', 'Yerini daha iyisine kaptırmak', 'deyim', 'zor'],
    ['Sütten ağzı yanan yoğurdu üfleyerek yer', 'Kötü deneyim yaşayan sonrasında çok dikkatli olur', 'atasozu', 'kolay'],
    ['Görünen köy kılavuz istemez', 'Apaçık olan şey açıklama gerektirmez', 'atasozu'],
    ['Sabreden derviş muradına ermiş', 'Sabreden sonunda istediğine kavuşur', 'atasozu', 'zor'],
    ['Sakınan göze çöp batar', 'Aşırı korunan şey yine de zarar görebilir', 'atasozu', 'zor'],
    ['Damdan düşen halden anlar', 'Aynı sıkıntıyı yaşayan başkasını anlar', 'atasozu', 'zor'],
    ['Denize düşen yılana sarılır', 'Sıkışan kişi her çareye başvurur', 'atasozu', 'kolay'],
    ['Gülü seven dikenine katlanır', 'İstediğine ulaşmak için sıkıntıya katlanılır', 'atasozu', 'kolay'],
    ['Her yiğidin bir yoğurt yiyişi vardır', 'Herkesin kendine göre bir yöntemi vardır', 'atasozu', 'zor'],
    ['Su testisi su yolunda kırılır', 'Kişi çoğunlukla işini yaptığı yerde zarar görür', 'atasozu', 'zor'],
    ['Talihsiz hacıyı deve üstünde yılan sokar', 'Şanssız kişinin başına gelmedik kalmaz', 'atasozu', 'zor'],
  ]),
] as const

export const SOZ_BOYUTU = SOZ_HAVUZU.length
