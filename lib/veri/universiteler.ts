/**
 * Türkiye'deki üniversiteler — hedef seçiminin sol yarısı.
 *
 * Kullanıcı önce buradan üniversitesini arıyor, sonra o üniversitenin açtığı
 * bölümlerden birini seçiyor. Eskiden taban puanı da başarı sırasını da elle
 * yazıyordu; ikisini de bilmeyen kullanıcı hedefi boş bırakıyordu ve hedef
 * kartı hiçbir şey söyleyemiyordu.
 *
 * ## Kademe nedir
 *
 * Her üniversitenin 1 (en yüksek taban) – 5 arası bir **kademesi** var. Aynı
 * bölümün tabanı üniversiteden üniversiteye değişiyor ve bu değişim büyük
 * ölçüde tek boyutlu: Tıp'ta önde olan üniversite Hukuk'ta da genelde önde.
 * Kademe o tek boyutun sayıya dökülmüş hâli; `hedef-katalog.ts` bölümün
 * sıralamasını kademeye göre iç değerliyor.
 *
 * Sonuç bir **tahmin** ve arayüzde öyle sunuluyor. Gerçek tabanlar program
 * program ÖSYM'nin yerleştirme sonuçlarından çıkıyor; 200 üniversite × 60
 * bölümlük o tabloyu uygulamanın içinde taşımak hem devasa hem her yıl
 * bayatlayan bir veri olurdu. Kullanıcı sayıları elle düzeltebiliyor.
 *
 * ## Vakıf üniversitelerinde kademe neyi anlatıyor
 *
 * Vakıf üniversitelerinde aynı bölümün burslu ve ücretli kontenjanı arasında
 * uçurum var. Buradaki kademe **tam burslu** kontenjanı anlatıyor: hedef
 * koyan öğrencinin kovaladığı sayı o.
 *
 * ## Alanlar
 *
 * Her üniversite her bölümü açmıyor. `alanlar`, üniversitenin hangi fakülte
 * gruplarına sahip olduğunu söylüyor; bölüm listesi buna göre süzülüyor. Tıp
 * fakültesi olmayan bir üniversitede Tıp'ı seçtirmek, tahminden çok daha kaba
 * bir yanlış olurdu.
 */

export type UniversiteTuru = 'devlet' | 'vakif' | 'kktc'

/** Fakülte grupları — bölümler bu koda göre süzülüyor. */
export type AlanKodu =
  | 'tip'
  | 'dis'
  | 'ecz'
  | 'vet'
  | 'sag'
  | 'muh'
  | 'mim'
  | 'fen'
  | 'sos'
  | 'huk'
  | 'egt'
  | 'dil'
  | 'ilh'
  | 'iln'

export type Universite = {
  /** Addan türetiliyor; elle yazılan kimlik 200 satırlık listede er geç çakışır. */
  id: string
  ad: string
  sehir: string
  tur: UniversiteTuru
  /** 1 (en yüksek taban) – 5 (en düşük). */
  kademe: number
  alanlar: readonly AlanKodu[]
}

/** [ad, şehir, tür, kademe, alanlar] — veri satırı, okunurluk için demet. */
type Satir = [string, string, UniversiteTuru, number, string]

const SATIRLAR: readonly Satir[] = [
  ['Abdullah Gül Üniversitesi', 'Kayseri', 'devlet', 3, 'muh mim fen sos'],
  ['Acıbadem Mehmet Ali Aydınlar Üniversitesi', 'İstanbul', 'vakif', 2, 'tip dis ecz sag muh fen sos'],
  ['Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi', 'Adana', 'devlet', 4, 'muh mim fen sos'],
  ['Adıyaman Üniversitesi', 'Adıyaman', 'devlet', 5, 'tip dis ecz sag fen sos egt ilh muh'],
  ['Afyon Kocatepe Üniversitesi', 'Afyonkarahisar', 'devlet', 4, 'tip dis vet ecz sag muh mim fen sos egt ilh huk'],
  ['Afyonkarahisar Sağlık Bilimleri Üniversitesi', 'Afyonkarahisar', 'devlet', 4, 'tip dis ecz sag'],
  ['Ağrı İbrahim Çeçen Üniversitesi', 'Ağrı', 'devlet', 5, 'sag fen sos egt ilh muh'],
  ['Akdeniz Üniversitesi', 'Antalya', 'devlet', 3, 'tip dis ecz vet sag muh mim fen sos huk egt ilh iln dil'],
  ['Aksaray Üniversitesi', 'Aksaray', 'devlet', 5, 'tip vet sag muh mim fen sos egt ilh'],
  ['Alanya Alaaddin Keykubat Üniversitesi', 'Antalya', 'devlet', 5, 'tip sag muh fen sos egt'],
  ['Altınbaş Üniversitesi', 'İstanbul', 'vakif', 3, 'tip dis ecz sag muh sos huk'],
  ['Amasya Üniversitesi', 'Amasya', 'devlet', 5, 'tip sag fen sos egt ilh muh mim'],
  ['Anadolu Üniversitesi', 'Eskişehir', 'devlet', 3, 'ecz sag muh mim fen sos huk egt dil iln'],
  ['Ankara Bilim Üniversitesi', 'Ankara', 'vakif', 5, 'muh mim sos sag'],
  ['Ankara Hacı Bayram Veli Üniversitesi', 'Ankara', 'devlet', 2, 'sos huk iln ilh dil fen egt'],
  ['Ankara Medipol Üniversitesi', 'Ankara', 'vakif', 4, 'tip dis sag muh sos huk'],
  ['Ankara Müzik ve Güzel Sanatlar Üniversitesi', 'Ankara', 'devlet', 4, 'sos egt'],
  ['Ankara Sosyal Bilimler Üniversitesi', 'Ankara', 'devlet', 2, 'sos huk dil ilh iln'],
  ['Ankara Üniversitesi', 'Ankara', 'devlet', 1, 'tip dis ecz vet sag muh mim fen sos huk egt ilh iln dil'],
  ['Ankara Yıldırım Beyazıt Üniversitesi', 'Ankara', 'devlet', 2, 'tip dis sag muh fen sos huk ilh dil iln'],
  ['Antalya Belek Üniversitesi', 'Antalya', 'vakif', 5, 'sos muh sag'],
  ['Antalya Bilim Üniversitesi', 'Antalya', 'vakif', 4, 'muh mim fen sos huk sag'],
  ['Ardahan Üniversitesi', 'Ardahan', 'devlet', 5, 'sag fen sos egt muh ilh'],
  ['Artvin Çoruh Üniversitesi', 'Artvin', 'devlet', 5, 'sag fen sos egt muh'],
  ['Atatürk Üniversitesi', 'Erzurum', 'devlet', 3, 'tip dis ecz vet sag muh mim fen sos huk egt ilh iln dil'],
  ['Atılım Üniversitesi', 'Ankara', 'vakif', 3, 'tip sag muh mim fen sos huk dil'],
  ['Avrasya Üniversitesi', 'Trabzon', 'vakif', 5, 'sag muh sos'],
  ['Aydın Adnan Menderes Üniversitesi', 'Aydın', 'devlet', 4, 'tip dis vet sag muh fen sos egt ilh iln dil'],
  ['Bahçeşehir Kıbrıs Üniversitesi', 'Lefkoşa', 'kktc', 5, 'sag muh sos huk iln'],
  ['Bahçeşehir Üniversitesi', 'İstanbul', 'vakif', 2, 'tip dis sag muh mim fen sos huk egt dil iln'],
  ['Balıkesir Üniversitesi', 'Balıkesir', 'devlet', 4, 'tip vet sag muh mim fen sos egt ilh iln'],
  ['Bandırma Onyedi Eylül Üniversitesi', 'Balıkesir', 'devlet', 5, 'sag muh fen sos huk egt ilh'],
  ['Bartın Üniversitesi', 'Bartın', 'devlet', 5, 'sag muh fen sos egt ilh'],
  ['Başkent Üniversitesi', 'Ankara', 'vakif', 3, 'tip dis ecz sag muh fen sos huk egt dil iln'],
  ['Batman Üniversitesi', 'Batman', 'devlet', 5, 'tip sag muh fen sos egt ilh'],
  ['Bayburt Üniversitesi', 'Bayburt', 'devlet', 5, 'sag fen sos egt ilh muh'],
  ['Beykent Üniversitesi', 'İstanbul', 'vakif', 5, 'sag muh mim sos huk egt dil iln'],
  ['Beykoz Üniversitesi', 'İstanbul', 'vakif', 5, 'sag muh sos dil iln'],
  ['Bezmiâlem Vakıf Üniversitesi', 'İstanbul', 'vakif', 2, 'tip dis ecz sag'],
  ['Bilecik Şeyh Edebali Üniversitesi', 'Bilecik', 'devlet', 5, 'sag muh fen sos egt ilh'],
  ['Bingöl Üniversitesi', 'Bingöl', 'devlet', 5, 'sag vet fen sos egt ilh muh'],
  ['Biruni Üniversitesi', 'İstanbul', 'vakif', 3, 'tip dis ecz sag muh fen'],
  ['Bitlis Eren Üniversitesi', 'Bitlis', 'devlet', 5, 'sag fen sos egt ilh muh'],
  ['Boğaziçi Üniversitesi', 'İstanbul', 'devlet', 1, 'muh fen sos egt dil iln'],
  ['Bolu Abant İzzet Baysal Üniversitesi', 'Bolu', 'devlet', 4, 'tip dis sag muh fen sos egt ilh'],
  ['Burdur Mehmet Akif Ersoy Üniversitesi', 'Burdur', 'devlet', 5, 'tip vet sag fen sos egt ilh muh'],
  ['Bursa Teknik Üniversitesi', 'Bursa', 'devlet', 3, 'muh mim fen'],
  ['Bursa Uludağ Üniversitesi', 'Bursa', 'devlet', 3, 'tip dis ecz vet sag muh mim fen sos huk egt ilh'],
  ['Çağ Üniversitesi', 'Mersin', 'vakif', 5, 'sos huk egt dil'],
  ['Çanakkale Onsekiz Mart Üniversitesi', 'Çanakkale', 'devlet', 4, 'tip sag muh mim fen sos egt ilh iln dil'],
  ['Çankaya Üniversitesi', 'Ankara', 'vakif', 3, 'muh mim fen sos huk'],
  ['Çankırı Karatekin Üniversitesi', 'Çankırı', 'devlet', 5, 'sag fen sos egt ilh muh'],
  ['Çukurova Üniversitesi', 'Adana', 'devlet', 3, 'tip dis ecz vet sag muh mim fen sos huk egt ilh iln'],
  ['Demiroğlu Bilim Üniversitesi', 'İstanbul', 'vakif', 3, 'tip sag fen'],
  ['Dicle Üniversitesi', 'Diyarbakır', 'devlet', 4, 'tip dis ecz vet sag muh mim fen sos huk egt ilh'],
  ['Doğu Akdeniz Üniversitesi', 'Gazimağusa', 'kktc', 4, 'tip ecz sag muh mim fen sos huk egt dil iln'],
  ['Doğuş Üniversitesi', 'İstanbul', 'vakif', 4, 'sag muh mim sos huk dil iln'],
  ['Dokuz Eylül Üniversitesi', 'İzmir', 'devlet', 2, 'tip dis sag muh mim fen sos huk egt ilh dil iln'],
  ['Düzce Üniversitesi', 'Düzce', 'devlet', 4, 'tip dis sag muh mim fen sos egt ilh'],
  ['Ege Üniversitesi', 'İzmir', 'devlet', 2, 'tip dis ecz sag muh fen sos egt ilh dil iln'],
  ['Erciyes Üniversitesi', 'Kayseri', 'devlet', 3, 'tip dis ecz vet sag muh mim fen sos huk egt ilh iln'],
  ['Erzincan Binali Yıldırım Üniversitesi', 'Erzincan', 'devlet', 5, 'tip dis ecz sag fen sos huk egt ilh muh'],
  ['Erzurum Teknik Üniversitesi', 'Erzurum', 'devlet', 4, 'muh fen sos'],
  ['Eskişehir Osmangazi Üniversitesi', 'Eskişehir', 'devlet', 3, 'tip dis ecz vet sag muh mim fen sos egt ilh'],
  ['Eskişehir Teknik Üniversitesi', 'Eskişehir', 'devlet', 3, 'muh mim fen'],
  ['Fatih Sultan Mehmet Vakıf Üniversitesi', 'İstanbul', 'vakif', 4, 'muh mim sos egt ilh dil'],
  ['Fenerbahçe Üniversitesi', 'İstanbul', 'vakif', 4, 'sag muh sos dil iln'],
  ['Fırat Üniversitesi', 'Elazığ', 'devlet', 4, 'tip dis vet sag muh mim fen sos egt ilh iln'],
  ['Galatasaray Üniversitesi', 'İstanbul', 'devlet', 1, 'muh sos huk dil iln'],
  ['Gazi Üniversitesi', 'Ankara', 'devlet', 2, 'tip dis ecz sag muh mim fen sos huk egt ilh dil iln'],
  ['Gaziantep İslam Bilim ve Teknoloji Üniversitesi', 'Gaziantep', 'devlet', 5, 'tip dis sag muh ilh'],
  ['Gaziantep Üniversitesi', 'Gaziantep', 'devlet', 3, 'tip dis ecz sag muh mim fen sos huk egt ilh iln'],
  ['Gebze Teknik Üniversitesi', 'Kocaeli', 'devlet', 2, 'muh mim fen sos'],
  ['Girne Amerikan Üniversitesi', 'Girne', 'kktc', 5, 'sag muh mim sos huk dil iln'],
  ['Giresun Üniversitesi', 'Giresun', 'devlet', 5, 'tip dis sag fen sos egt ilh muh'],
  ['Gümüşhane Üniversitesi', 'Gümüşhane', 'devlet', 5, 'sag muh fen sos egt ilh'],
  ['Hacettepe Üniversitesi', 'Ankara', 'devlet', 1, 'tip dis ecz sag muh fen sos huk egt dil iln'],
  ['Hakkari Üniversitesi', 'Hakkari', 'devlet', 5, 'sag fen sos egt ilh'],
  ['Haliç Üniversitesi', 'İstanbul', 'vakif', 5, 'sag muh mim fen sos iln'],
  ['Harran Üniversitesi', 'Şanlıurfa', 'devlet', 5, 'tip vet sag muh mim fen sos egt ilh'],
  ['Hasan Kalyoncu Üniversitesi', 'Gaziantep', 'vakif', 4, 'sag muh mim sos huk egt'],
  ['Hatay Mustafa Kemal Üniversitesi', 'Hatay', 'devlet', 5, 'tip vet sag muh mim fen sos egt ilh'],
  ['Hitit Üniversitesi', 'Çorum', 'devlet', 5, 'tip sag muh fen sos egt ilh'],
  ['Iğdır Üniversitesi', 'Iğdır', 'devlet', 5, 'sag vet fen sos egt ilh muh'],
  ['Isparta Uygulamalı Bilimler Üniversitesi', 'Isparta', 'devlet', 5, 'sag muh fen sos'],
  ['Işık Üniversitesi', 'İstanbul', 'vakif', 4, 'muh mim fen sos huk dil iln'],
  ['İbn Haldun Üniversitesi', 'İstanbul', 'vakif', 3, 'sos huk ilh dil iln'],
  ['İhsan Doğramacı Bilkent Üniversitesi', 'Ankara', 'vakif', 1, 'muh mim fen sos huk egt dil iln'],
  ['İnönü Üniversitesi', 'Malatya', 'devlet', 4, 'tip dis ecz sag muh mim fen sos huk egt ilh iln'],
  ['İskenderun Teknik Üniversitesi', 'Hatay', 'devlet', 5, 'muh mim fen sos'],
  ['İstanbul 29 Mayıs Üniversitesi', 'İstanbul', 'vakif', 4, 'sos egt ilh dil'],
  ['İstanbul Arel Üniversitesi', 'İstanbul', 'vakif', 5, 'sag muh mim fen sos huk iln'],
  ['İstanbul Atlas Üniversitesi', 'İstanbul', 'vakif', 4, 'tip dis ecz sag muh sos'],
  ['İstanbul Aydın Üniversitesi', 'İstanbul', 'vakif', 4, 'tip dis ecz sag muh mim fen sos huk egt dil iln'],
  ['İstanbul Bilgi Üniversitesi', 'İstanbul', 'vakif', 3, 'sag muh mim sos huk dil iln'],
  ['İstanbul Esenyurt Üniversitesi', 'İstanbul', 'vakif', 5, 'sag muh sos iln'],
  ['İstanbul Galata Üniversitesi', 'İstanbul', 'vakif', 5, 'sag muh sos dil'],
  ['İstanbul Gelişim Üniversitesi', 'İstanbul', 'vakif', 5, 'sag muh mim fen sos dil iln'],
  ['İstanbul Kent Üniversitesi', 'İstanbul', 'vakif', 5, 'sag sos huk'],
  ['İstanbul Kültür Üniversitesi', 'İstanbul', 'vakif', 4, 'muh mim fen sos huk egt iln'],
  ['İstanbul Medeniyet Üniversitesi', 'İstanbul', 'devlet', 2, 'tip dis ecz sag muh fen sos huk egt ilh dil'],
  ['İstanbul Medipol Üniversitesi', 'İstanbul', 'vakif', 3, 'tip dis ecz sag muh mim fen sos huk egt dil iln'],
  ['İstanbul Okan Üniversitesi', 'İstanbul', 'vakif', 4, 'tip dis sag muh mim sos huk dil iln'],
  ['İstanbul Rumeli Üniversitesi', 'İstanbul', 'vakif', 5, 'sag muh sos iln'],
  ['İstanbul Sabahattin Zaim Üniversitesi', 'İstanbul', 'vakif', 4, 'sag muh mim sos huk egt ilh'],
  ['İstanbul Sağlık ve Teknoloji Üniversitesi', 'İstanbul', 'vakif', 4, 'tip dis ecz sag muh'],
  ['İstanbul Teknik Üniversitesi', 'İstanbul', 'devlet', 1, 'muh mim fen sos'],
  ['İstanbul Ticaret Üniversitesi', 'İstanbul', 'vakif', 4, 'muh fen sos huk iln'],
  ['İstanbul Topkapı Üniversitesi', 'İstanbul', 'vakif', 5, 'sag muh mim sos iln'],
  ['İstanbul Üniversitesi', 'İstanbul', 'devlet', 1, 'tip dis ecz vet sag muh fen sos huk egt ilh dil iln'],
  ['İstanbul Üniversitesi-Cerrahpaşa', 'İstanbul', 'devlet', 2, 'tip dis vet sag muh fen egt'],
  ['İstanbul Yeni Yüzyıl Üniversitesi', 'İstanbul', 'vakif', 4, 'tip dis ecz sag muh sos huk iln'],
  ['İstinye Üniversitesi', 'İstanbul', 'vakif', 3, 'tip dis ecz sag muh sos huk dil iln'],
  ['İzmir Bakırçay Üniversitesi', 'İzmir', 'devlet', 4, 'tip dis sag muh fen sos huk'],
  ['İzmir Demokrasi Üniversitesi', 'İzmir', 'devlet', 4, 'tip dis sag muh fen sos egt'],
  ['İzmir Ekonomi Üniversitesi', 'İzmir', 'vakif', 3, 'tip sag muh mim fen sos huk dil iln'],
  ['İzmir Katip Çelebi Üniversitesi', 'İzmir', 'devlet', 3, 'tip dis ecz sag muh mim fen sos ilh'],
  ['İzmir Tınaztepe Üniversitesi', 'İzmir', 'vakif', 5, 'tip dis ecz sag'],
  ['İzmir Yüksek Teknoloji Enstitüsü', 'İzmir', 'devlet', 2, 'muh mim fen'],
  ['Kadir Has Üniversitesi', 'İstanbul', 'vakif', 3, 'muh mim sos huk dil iln'],
  ['Kafkas Üniversitesi', 'Kars', 'devlet', 5, 'tip vet sag muh fen sos egt ilh'],
  ['Kahramanmaraş İstiklal Üniversitesi', 'Kahramanmaraş', 'devlet', 5, 'sag muh fen sos ilh'],
  ['Kahramanmaraş Sütçü İmam Üniversitesi', 'Kahramanmaraş', 'devlet', 5, 'tip dis vet sag muh mim fen sos egt ilh'],
  ['Kapadokya Üniversitesi', 'Nevşehir', 'vakif', 5, 'sag sos dil iln'],
  ['Karabük Üniversitesi', 'Karabük', 'devlet', 4, 'tip dis sag muh mim fen sos egt ilh iln'],
  ['Karadeniz Teknik Üniversitesi', 'Trabzon', 'devlet', 3, 'tip dis ecz sag muh mim fen sos huk ilh iln'],
  ['Karamanoğlu Mehmetbey Üniversitesi', 'Karaman', 'devlet', 5, 'sag muh fen sos egt ilh'],
  ['Kastamonu Üniversitesi', 'Kastamonu', 'devlet', 5, 'tip sag muh mim fen sos egt ilh iln'],
  ['Kayseri Üniversitesi', 'Kayseri', 'devlet', 5, 'sag muh fen sos'],
  ['Kırıkkale Üniversitesi', 'Kırıkkale', 'devlet', 4, 'tip dis ecz vet sag muh fen sos huk egt ilh'],
  ['Kırklareli Üniversitesi', 'Kırklareli', 'devlet', 5, 'tip sag muh mim fen sos egt ilh'],
  ['Kırşehir Ahi Evran Üniversitesi', 'Kırşehir', 'devlet', 5, 'tip sag muh fen sos egt ilh'],
  ['Kilis 7 Aralık Üniversitesi', 'Kilis', 'devlet', 5, 'sag fen sos egt ilh muh'],
  ['Kocaeli Sağlık ve Teknoloji Üniversitesi', 'Kocaeli', 'vakif', 5, 'sag muh'],
  ['Kocaeli Üniversitesi', 'Kocaeli', 'devlet', 3, 'tip dis sag muh mim fen sos huk egt ilh iln'],
  ['Koç Üniversitesi', 'İstanbul', 'vakif', 1, 'tip sag muh fen sos huk iln'],
  ['Konya Gıda ve Tarım Üniversitesi', 'Konya', 'vakif', 5, 'muh fen sos'],
  ['Konya Teknik Üniversitesi', 'Konya', 'devlet', 3, 'muh mim'],
  ['KTO Karatay Üniversitesi', 'Konya', 'vakif', 4, 'tip dis sag muh mim sos huk'],
  ['Kütahya Dumlupınar Üniversitesi', 'Kütahya', 'devlet', 5, 'sag muh mim fen sos egt ilh iln'],
  ['Kütahya Sağlık Bilimleri Üniversitesi', 'Kütahya', 'devlet', 5, 'tip dis ecz sag'],
  ['Lefke Avrupa Üniversitesi', 'Lefke', 'kktc', 5, 'sag muh mim sos huk egt'],
  ['Lokman Hekim Üniversitesi', 'Ankara', 'vakif', 4, 'tip dis ecz sag'],
  ['Malatya Turgut Özal Üniversitesi', 'Malatya', 'devlet', 5, 'sag muh fen sos ilh'],
  ['Maltepe Üniversitesi', 'İstanbul', 'vakif', 4, 'tip sag muh mim sos huk egt dil iln'],
  ['Manisa Celâl Bayar Üniversitesi', 'Manisa', 'devlet', 4, 'tip dis sag muh mim fen sos egt ilh'],
  ['Mardin Artuklu Üniversitesi', 'Mardin', 'devlet', 5, 'tip sag muh mim fen sos egt ilh'],
  ['Marmara Üniversitesi', 'İstanbul', 'devlet', 2, 'tip dis ecz sag muh mim fen sos huk egt ilh dil iln'],
  ['MEF Üniversitesi', 'İstanbul', 'vakif', 3, 'muh mim sos huk egt dil'],
  ['Mersin Üniversitesi', 'Mersin', 'devlet', 4, 'tip dis ecz sag muh mim fen sos huk egt ilh iln'],
  ['Mimar Sinan Güzel Sanatlar Üniversitesi', 'İstanbul', 'devlet', 2, 'muh mim fen sos'],
  ['Milli Savunma Üniversitesi', 'İstanbul', 'devlet', 2, 'muh fen sos'],
  ['Muğla Sıtkı Koçman Üniversitesi', 'Muğla', 'devlet', 4, 'tip dis sag muh mim fen sos egt ilh iln'],
  ['Munzur Üniversitesi', 'Tunceli', 'devlet', 5, 'sag muh fen sos egt'],
  ['Muş Alparslan Üniversitesi', 'Muş', 'devlet', 5, 'sag fen sos egt ilh muh'],
  ['Necmettin Erbakan Üniversitesi', 'Konya', 'devlet', 4, 'tip dis ecz sag muh mim fen sos huk egt ilh dil iln'],
  ['Nevşehir Hacı Bektaş Veli Üniversitesi', 'Nevşehir', 'devlet', 5, 'sag muh fen sos egt ilh'],
  ['Niğde Ömer Halisdemir Üniversitesi', 'Niğde', 'devlet', 5, 'sag muh mim fen sos egt ilh'],
  ['Nişantaşı Üniversitesi', 'İstanbul', 'vakif', 5, 'sag muh mim sos egt iln'],
  ['Nuh Naci Yazgan Üniversitesi', 'Kayseri', 'vakif', 5, 'sag muh mim sos'],
  ['Ondokuz Mayıs Üniversitesi', 'Samsun', 'devlet', 3, 'tip dis vet sag muh mim fen sos egt ilh iln'],
  ['Ordu Üniversitesi', 'Ordu', 'devlet', 5, 'tip dis vet sag muh fen sos egt ilh'],
  ['Orta Doğu Teknik Üniversitesi', 'Ankara', 'devlet', 1, 'muh mim fen sos egt dil'],
  ['Osmaniye Korkut Ata Üniversitesi', 'Osmaniye', 'devlet', 5, 'sag muh fen sos egt ilh'],
  ['Ostim Teknik Üniversitesi', 'Ankara', 'vakif', 4, 'muh sos'],
  ['Özyeğin Üniversitesi', 'İstanbul', 'vakif', 2, 'muh mim sos huk dil iln'],
  ['Pamukkale Üniversitesi', 'Denizli', 'devlet', 4, 'tip dis sag muh mim fen sos egt ilh iln'],
  ['Piri Reis Üniversitesi', 'İstanbul', 'vakif', 4, 'muh sos huk dil'],
  ['Recep Tayyip Erdoğan Üniversitesi', 'Rize', 'devlet', 5, 'tip dis sag muh fen sos egt ilh'],
  ['Sabancı Üniversitesi', 'İstanbul', 'vakif', 1, 'muh fen sos'],
  ['Sağlık Bilimleri Üniversitesi', 'İstanbul', 'devlet', 2, 'tip dis ecz vet sag'],
  ['Sakarya Uygulamalı Bilimler Üniversitesi', 'Sakarya', 'devlet', 5, 'sag muh fen sos'],
  ['Sakarya Üniversitesi', 'Sakarya', 'devlet', 3, 'tip dis sag muh mim fen sos huk egt ilh iln'],
  ['Samsun Üniversitesi', 'Samsun', 'devlet', 5, 'sag muh sos ilh'],
  ['SANKO Üniversitesi', 'Gaziantep', 'vakif', 4, 'tip dis sag'],
  ['Selçuk Üniversitesi', 'Konya', 'devlet', 3, 'tip dis ecz vet sag muh mim fen sos huk egt ilh iln'],
  ['Siirt Üniversitesi', 'Siirt', 'devlet', 5, 'sag vet fen sos egt ilh muh'],
  ['Sinop Üniversitesi', 'Sinop', 'devlet', 5, 'sag fen sos egt ilh muh'],
  ['Sivas Bilim ve Teknoloji Üniversitesi', 'Sivas', 'devlet', 5, 'muh fen sos'],
  ['Sivas Cumhuriyet Üniversitesi', 'Sivas', 'devlet', 4, 'tip dis ecz vet sag muh mim fen sos huk egt ilh iln'],
  ['Süleyman Demirel Üniversitesi', 'Isparta', 'devlet', 4, 'tip dis ecz sag muh mim fen sos huk egt ilh iln'],
  ['Şırnak Üniversitesi', 'Şırnak', 'devlet', 5, 'sag fen sos egt ilh'],
  ['Tarsus Üniversitesi', 'Mersin', 'devlet', 5, 'sag muh fen sos'],
  ['TED Üniversitesi', 'Ankara', 'vakif', 3, 'muh mim sos egt dil iln'],
  ['Tekirdağ Namık Kemal Üniversitesi', 'Tekirdağ', 'devlet', 4, 'tip vet sag muh mim fen sos huk egt ilh iln'],
  ['TOBB Ekonomi ve Teknoloji Üniversitesi', 'Ankara', 'vakif', 2, 'tip muh mim fen sos huk'],
  ['Tokat Gaziosmanpaşa Üniversitesi', 'Tokat', 'devlet', 5, 'tip dis vet sag muh fen sos egt ilh'],
  ['Toros Üniversitesi', 'Mersin', 'vakif', 5, 'sag muh mim sos huk'],
  ['Trabzon Üniversitesi', 'Trabzon', 'devlet', 5, 'sag fen sos egt ilh iln'],
  ['Trakya Üniversitesi', 'Edirne', 'devlet', 4, 'tip dis ecz sag muh mim fen sos huk egt ilh iln'],
  ['Türk Hava Kurumu Üniversitesi', 'Ankara', 'vakif', 4, 'muh sos'],
  ['Türk-Alman Üniversitesi', 'İstanbul', 'devlet', 2, 'muh fen sos huk dil'],
  ['Ufuk Üniversitesi', 'Ankara', 'vakif', 4, 'tip sag sos huk iln'],
  ['Uluslararası Kıbrıs Üniversitesi', 'Lefkoşa', 'kktc', 5, 'tip ecz sag muh mim sos huk egt dil iln'],
  ['Uşak Üniversitesi', 'Uşak', 'devlet', 5, 'tip dis sag muh mim fen sos egt ilh'],
  ['Üsküdar Üniversitesi', 'İstanbul', 'vakif', 4, 'tip dis ecz sag muh sos iln'],
  ['Van Yüzüncü Yıl Üniversitesi', 'Van', 'devlet', 5, 'tip dis ecz vet sag muh mim fen sos egt ilh'],
  ['Yakın Doğu Üniversitesi', 'Lefkoşa', 'kktc', 4, 'tip dis ecz vet sag muh mim fen sos huk egt dil iln'],
  ['Yalova Üniversitesi', 'Yalova', 'devlet', 5, 'sag muh fen sos huk egt ilh'],
  ['Yaşar Üniversitesi', 'İzmir', 'vakif', 3, 'muh mim sos huk dil iln'],
  ['Yeditepe Üniversitesi', 'İstanbul', 'vakif', 2, 'tip dis ecz sag muh mim fen sos huk egt dil iln'],
  ['Yıldız Teknik Üniversitesi', 'İstanbul', 'devlet', 2, 'muh mim fen sos egt dil'],
  ['Yozgat Bozok Üniversitesi', 'Yozgat', 'devlet', 5, 'tip sag muh mim fen sos egt ilh'],
  ['Yüksek İhtisas Üniversitesi', 'Ankara', 'vakif', 4, 'tip sag'],
  ['Zonguldak Bülent Ecevit Üniversitesi', 'Zonguldak', 'devlet', 5, 'tip dis sag muh mim fen sos egt ilh'],
]

/**
 * Arama için sadeleştirme: küçük harf + Türkçe harflerin ASCII karşılığı.
 *
 * Klavyede "ğ" yazmadan "bogazici" arayan kullanıcı sonuç görmeli. Sıralama
 * "İ" ve "I" ile başlıyor çünkü `toLowerCase` tek başına yetmiyor: "İSTANBUL"
 * küçüldüğünde noktalı i + birleştirici nokta oluyor ve düz "istanbul" ile
 * eşleşmiyor.
 */
export function sadelestir(metin: string): string {
  return metin
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u')
}

/** Addan kimlik — ayrı bir kimlik alanı elle yazılınca er geç çakışıyor. */
export function kimlige(ad: string): string {
  return sadelestir(ad)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const UNIVERSITELER: readonly Universite[] = SATIRLAR.map(
  ([ad, sehir, tur, kademe, alanlar]) => ({
    id: kimlige(ad),
    ad,
    sehir,
    tur,
    kademe,
    alanlar: alanlar.split(' ') as AlanKodu[],
  }),
)

/** En düşük kademe — bölüm iç değerlemesinin alt ucu buraya dayanıyor. */
export const EN_DUSUK_KADEME = 5
