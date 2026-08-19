/**
 * Geri sayımın altındaki cümle — kalan güne göre değişir.
 *
 * Amaç tek bir motivasyon lafı değil, kalan süreye **uygun** olanı söylemek:
 * 300 gün kala "planını kur", 3 gün kala "yeni konuya girme" demek gerekiyor.
 * Sınava iki gün kala "yol uzun, sabırlı ol" demek işe yaramaz.
 *
 * Havuzlar kalan güne göre kademelendi; içinden seçim tarihle tohumlanıyor, yani
 * cümle gün boyu sabit kalıp ertesi gün değişiyor (bkz. `tohumlaSec`).
 */

import { tohumlaSec } from './utils'

export type SinavSozu = {
  /** Kalan süreyi tek kelimeyle adlandıran başlık — geri sayımın yanında. */
  baslik: string
  metin: string
}

/** Bir kademe: `enCok` güne kadar olan geri sayımlarda bu havuz kullanılır. */
type Kademe = {
  /** Kalan gün bu sayıdan küçük ya da eşitse kademe seçilir. */
  enCok: number
  baslik: string
  sozler: string[]
}

/**
 * Kademeler artan sırada; ilk uyan kazanır. Sınav günü ve son üç gün ayrı
 * tutuldu, çünkü orada söylenecek şey motivasyon değil, pratik tarif.
 */
const KADEMELER: Kademe[] = [
  {
    enCok: 0,
    baslik: 'Bugün',
    sozler: [
      'Bugün o gün. Yeni bir şey öğrenmeye çalışma, bildiğini sakin sakin yaz.',
      'Bir yıl bugün için çalıştın. Salonda tek işin var: soruyu oku, cevabı işaretle.',
      'Heyecan normal, hatta faydalı. Ellerin titrerse iki derin nefes, sonra devam.',
      'Kimliğin ve belgen yanında mı? Gerisi zaten kafanın içinde.',
      'İlk soruyu yapamazsan panik yok — sırayı sen belirliyorsun, atla geç.',
    ],
  },
  {
    enCok: 1,
    baslik: 'Yarın',
    sozler: [
      'Yarın. Bugün yeni konu yok: çantanı hazırla, erken yat.',
      'Son gün formül ezberlemenin değil, kafayı dinlendirmenin günü.',
      'Bugün yapacağın en verimli şey uyumak. Cidden.',
      'Belgen, kimliğin, suyun, kalemin hazır mı? Bir kez daha bak, sonra kapat.',
      'Bu akşam bir deneme daha çözmek netini artırmaz, uykunu kaçırır.',
    ],
  },
  {
    enCok: 3,
    baslik: 'Son günler',
    sozler: [
      'Yeni konuya girme. Bildiğin konuların formüllerine göz gezdir, yeter.',
      'Uyku düzenini sınav saatine çek: sabah beynin uyanık olmalı.',
      'Bu birkaç günde yapılacak en iyi iş, çok bilinen soruları hızlı çözmek.',
      'Sınav yerini gidip gör. Bilinmeyen yol, sınav sabahı stresin yarısıdır.',
      'Panikleyip her şeyi tekrar etmeye çalışma; hiçbirini tam edemezsin.',
    ],
  },
  {
    enCok: 7,
    baslik: 'Son hafta',
    sozler: [
      'Son hafta yeni bilgi haftası değil, hatırlatma haftası. Özet defterine dön.',
      'Bu hafta her gün bir deneme, ama sınav saatinde. Beden de alışsın.',
      'Yanlış bankandaki soruları bir kez daha çöz — en garantili puan orada.',
      'Kafeini artırma, uykuyu azaltma. Düzeni bozmanın tam sırası değil.',
      'Bu hafta öğrendiğin şey sınavda çıkarsa şanstır; unuttuğun şey ise kayıptır.',
    ],
  },
  {
    enCok: 14,
    baslik: 'İki hafta',
    sozler: [
      'İki hafta bir konuyu kapatmaya yeter, üç konuyu birden kurtarmaya yetmez.',
      'Artık eksik avlamak yok; en çok soru çıkan konuları döndür.',
      'Deneme çözerken süreyi gerçek sınav gibi tut. Süre de bir konudur.',
      'Sabah kalkma saatini sınav saatine yaklaştırmaya bugün başla.',
      'Kalan iki haftada hedefin net artırmak değil, bildiğini kaybetmemek.',
    ],
  },
  {
    enCok: 30,
    baslik: 'Son ay',
    sozler: [
      'Son ay: yeni kaynak açma. Elindekini bitir, tekrar et.',
      'Bir ay günde iki deneme demek değil. Analiz etmediğin denemeyi çözme.',
      'Hangi konuda hep aynı hatayı yapıyorsun? Bu ay onun ayı.',
      'Bu ay dikkat, bilgiden çok puan kazandırır. İşaretleme hatalarına bak.',
      'Otuz günde her konu bitmez — en çok soru getiren beşini seç, onları bitir.',
    ],
  },
  {
    enCok: 60,
    baslik: 'İki ay',
    sozler: [
      'İki ay, eksik konu kapatmak için son gerçek fırsat. Listeyi bugün çıkar.',
      'Şu an konu bitirme ile deneme çözme dengesi yarı yarıya olmalı.',
      'Bu iki ayda kaç deneme çözeceğini yaz, sonra takvime dağıt.',
      'Yaz sıcağı bahane olmaya başlar. Saatini erkene al, serinde çalış.',
      'İki ay sonrasının seni, bugün ertelediğin konuyu çözmek zorunda kalacak.',
    ],
  },
  {
    enCok: 100,
    baslik: 'Üç ay',
    sozler: [
      'Üç haneli günler bitiyor. Plan yapma dönemi kapandı, uygulama dönemi.',
      'Şu an her gün bir deneme çözen, sınava kadar yüz deneme çözer.',
      'Bu aralıkta net artışı en hızlıdır: eksikler belli, süre hâlâ var.',
      'Konu bitirmeyi hâlâ erteliyorsan, o konuyu boş bırakmayı kabul ediyorsun.',
      'Yüz gün bir dersi baştan kurtarmaya yeter. Hangi ders olduğunu biliyorsun.',
    ],
  },
  {
    enCok: 180,
    baslik: 'Altı ay',
    sozler: [
      'Yarım yıl var: konuları bitirmek için bol, boşa geçirmek için kısa.',
      'Bu dönem eksik kapatma dönemi. Denemeler eksiği gösterir, kapatmaz.',
      'Haftada bir deneme yeterli; asıl iş konu ve soru çözümünde.',
      'Altı ay sonra "keşke daha erken başlasaydım" dememek elinde.',
      'Bugün zor gelen konu, altı ay sonra ezberden çözdüğün konu olabilir.',
    ],
  },
  {
    enCok: 270,
    baslik: 'Dokuz ay',
    sozler: [
      'Uzun yol. Hız değil düzen kazandırır: her gün az ama her gün.',
      'Şimdi atılan temel, mayısta net olarak geri döner.',
      'Bu aralıkta en değerli alışkanlık: çözdüğün soruyu kaydetmek.',
      'Kimse bu kadar erken hazır değildir. Erken olan tek şey başlamaktır.',
      'Yavaş ilerlediğini sanıyorsun; asıl kıyas, hiç başlamamış hâlinle.',
    ],
  },
  {
    enCok: Number.POSITIVE_INFINITY,
    baslik: 'Uzun yol',
    sozler: [
      'Sayı büyük görünüyor ama gün gün eriyecek. Bugünü boşa harcama, o kadar.',
      'Bu kadar uzaktan kazanılan tek şey alışkanlık. Onu kur, gerisi gelir.',
      'Bugün 20 soru çözersen, sınava kadar binlerce soru eder.',
      'Bir yıldan fazla var; yani telafi hakkın da var. Yine de bugünü kullan.',
      'Şimdi başlayanın son ay paniği olmaz.',
    ],
  },
]

/**
 * Yuvarlak sayılarda kademe havuzu yerine o güne özel cümle çıkar — geri sayımın
 * "100 gün kaldı" gibi anları diğer günlerle aynı görünmesin diye.
 */
const DONUM_NOKTALARI: Record<number, string> = {
  365: 'Tam bir yıl. Bugün başlarsan, sınava girenlerin çoğundan bir yıl öndesin.',
  300: 'Üç yüz gün. Günde 30 soru = 9000 soru. Hesap bu kadar basit.',
  250: 'İki yüz elli gün. Konu listeni çıkarmak için hâlâ en iyi zaman.',
  200: 'İki yüz gün. Buradan sonrası artık "ileride" değil, "bu sene".',
  150: 'Yüz elli gün. Eksik konu kapatmanın son rahat dönemi burası.',
  100: 'Yüz gün! Yarından itibaren geri sayım üç haneden ikiye düşüyor.',
  50: 'Elli gün. Artık yeni kaynak değil, elindekini bitirme zamanı.',
  30: 'Son otuz gün. Bundan sonrası tekrar, deneme ve uyku düzeni.',
  20: 'Yirmi gün. Yeni konuya başlama; bildiklerini sağlamlaştır.',
  10: 'On gün. Bugünden itibaren tek işin hatırlamak ve dinlenmek.',
  5: 'Beş gün. Sınav saatinde deneme çöz, uykunu erkene al.',
}

/**
 * Kalan güne uygun sözü seçer.
 *
 * `oturum` AYT ise TYT günü geçmiş demektir; o gün söylenecek şey ayrı, çünkü
 * kullanıcı zaten bir sınavdan çıkmış oluyor.
 */
export function sinavSozu(kalanGun: number, oturum: 'tyt' | 'ayt', tohum: string): SinavSozu {
  if (oturum === 'ayt') {
    return kalanGun <= 0
      ? {
          baslik: 'Bugün',
          metin: 'Sıra AYT’de. Sabahki oturumu kafandan çıkar, bu ayrı bir sınav.',
        }
      : {
          baslik: 'Yarın',
          metin: 'TYT bitti, yarın AYT var. Bugün soruları tartışma; dünü değiştirmez, yarını etkiler.',
        }
  }

  const kademe = KADEMELER.find((k) => kalanGun <= k.enCok) ?? KADEMELER[KADEMELER.length - 1]
  const donum = DONUM_NOKTALARI[kalanGun]
  return { baslik: kademe.baslik, metin: donum ?? tohumlaSec(kademe.sozler, tohum) }
}
