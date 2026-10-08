import type { SoruKarti } from '../tip'
import { sorular } from './12-turkce-yardimci'

/**
 * 12. sınıf Edebiyat (2018 programı) — Şiir yoklamaları. Yanlış şık, kartlarda
 * yan yana duran iki şairin ya da iki yılın karıştırılmasıdır.
 */
export const siirSorulari: Record<string, Omit<SoruKarti, 'id'>[]> = {
  'trk12-siir-hece': sorular([
    ['Faruk Nafiz Çamlıbel, Beş Hececiler arasında yer alır.', true, 'Beş Hececilerden biridir.'],
    ['On birli hece ölçüsü yalnızca 4+4+3 duraklıdır.', false, '6+5 duraklı kalıp da vardır.'],
    ['Garip akımı hece ölçüsünü sürdürmeyi savunur.', false, 'Garip ölçüyü ve uyağı bıraktı.'],
    ['Orhan Seyfi Orhon, Beş Hececilerden değildir.', false, 'Orhan Seyfi Orhon Beş Hececilerdendir.'],
    ['Hececiler halk edebiyatının biçimlerinden yararlanır.', true, 'Hece ölçüsü ve sade Türkçe bu şiirin ayırt edici yanıdır.'],
  ], [
    ['Çoban Çeşmesi kimin kitabıdır?', 'Faruk Nafiz Çamlıbel', 'Yusuf Ziya Ortaç', 'Çoban Çeşmesi (1926) Faruk Nafiz’in kitabıdır.'],
    ['“Bayrak şairi” diye anılan hececi kimdir?', 'Arif Nihat Asya', 'Orhan Şaik Gökyay', 'Arif Nihat Asya bayrak ve vatan sevgisini işledi.'],
    ['Hececilere karşıt çizgide 1941’de çıkan akım?', 'Garip', 'İkinci Yeni', 'İkinci Yeni 1950’lerde ortaya çıktı.'],
    ['Beş Hececilerden biri hangisidir?', 'Enis Behiç Koryürek', 'Nâzım Hikmet', 'Nâzım Hikmet serbest nazımla yazdı.'],
  ]),
  'trk12-siir-saf': sorular([
    ['Yedi Meşale topluluğu 1941’de yayımlandı.', false, 'Yedi Meşale 1928’de çıktı; 1941 Garip’in yılıdır.'],
    ['Saf şiirde anlamdan çok ses ve ahenk önemlidir.', true, 'Çağrışım ve ses ön plandadır.'],
    ['Otuz Beş Yaş şiiri Ahmet Muhip Dıranas’a aittir.', false, 'Otuz Beş Yaş Cahit Sıtkı Tarancı’nın şiiridir.'],
    ['Ziya Osman Saba, Yedi Meşale topluluğunda yer aldı.', true, 'Topluluğun üyelerindendir.'],
    ['Saf şiir anlayışı toplumsal yarar amacını öne çıkarır.', false, 'Saf şiirde toplumsal ileti değil, ses ve ahenk öndedir.'],
  ], [
    ['Ömrümde Sükût kimin ilk kitabıdır?', 'Cahit Sıtkı Tarancı', 'Ahmet Hamdi Tanpınar', 'Ömrümde Sükût 1933’te çıktı.'],
    ['Sebil ve Güvercinler kimin kitabıdır?', 'Ziya Osman Saba', 'Behçet Necatigil', 'Sebil ve Güvercinler Ziya Osman Saba’nındır.'],
    ['Ne İçindeyim Zamanın şiirinin şairi kimdir?', 'Ahmet Hamdi Tanpınar', 'Cahit Sıtkı Tarancı', 'Tanpınar’da zaman duygusu öne çıkar.'],
    ['Saf şiir anlayışı hangi Fransız şairle anılır?', 'Paul Valéry', 'Victor Hugo', 'Saf şiir Valéry ile özdeşleşmiştir.'],
  ]),
  'trk12-siir-toplumcu': sorular([
    ['835 Satır, Nâzım Hikmet’in 1929 tarihli kitabıdır.', true, 'Nâzım’ın ilk kitaplarındandır.'],
    ['Hasretinden Prangalar Eskittim, Attila İlhan’ın kitabıdır.', false, 'Bu kitap Ahmed Arif’indir; Attila İlhan’ın kitabı Sisler Bulvarı’dır.'],
    ['Toplumcu gerçekçi şiir, sanatı toplumsal sorunlardan bağımsız sayar.', false, 'Bu anlayışta sanat toplumsal yarar gözetir.'],
    ['Kuvâyi Milliye, Millî Mücadele’yi anlatan bir destandır.', true, 'Kahramanı halktır.'],
    ['Nâzım Hikmet şiirlerinde yalnızca aruz ölçüsünü kullandı.', false, 'Serbest nazmı yerleştirdi.'],
  ], [
    ['Sisler Bulvarı kimin kitabıdır?', 'Attila İlhan', 'Ahmed Arif', 'Sisler Bulvarı 1954’te çıktı.'],
    ['Memleketimden İnsan Manzaraları kimin eseridir?', 'Nâzım Hikmet', 'Ahmed Arif', 'Ahmed Arif’in tek kitabı Hasretinden Prangalar Eskittim’dir.'],
    ['Şeyh Bedreddin Destanı hangi yıl yayımlandı?', '1936', '1929', '1929, 835 Satır’ın yılıdır.'],
    ['Ahmed Arif’in şiir kitabı hangisidir?', 'Hasretinden Prangalar Eskittim', 'Sisler Bulvarı', 'Sisler Bulvarı Attila İlhan’ındır.'],
  ]),
  'trk12-siir-garip': sorular([
    ['Garip akımı şiirde uyağı ve ölçüyü kullanmaz.', true, 'Serbest, düzyazıya yakın dizeler yazılır.'],
    ['Garip, 1950’de yayımlanan ortak bir şiir kitabıdır.', false, 'Garip 1941’de çıktı; Orhan Veli 1950’de öldü.'],
    ['Garip şairleri konuşma dilini şiire taşıdı.', true, 'Dil gündelik ve yalındır.'],
    ['Perçemli Sokak, Melih Cevdet Anday’ın kitabıdır.', false, 'Perçemli Sokak Oktay Rifat’ındır.'],
    ['Garip akımı şiirde süslü ve ağır bir dili savunur.', false, 'Garipçiler şiiri süsten arındırmak ister.'],
  ], [
    ['Vazgeçemediğim kimin kitabıdır?', 'Orhan Veli', 'Oktay Rifat', 'Vazgeçemediğim 1945’te çıktı.'],
    ['Rahatı Kaçan Ağaç kimin kitabıdır?', 'Melih Cevdet Anday', 'Oktay Rifat', 'Oktay Rifat’ın kitabı Perçemli Sokak’tır.'],
    ['Garipçilerin şiire yöneldiği kesim?', 'Sokaktaki insan', 'Saray çevresi', 'Şiir sıradan insanın yaşamını anlatır.'],
    ['Orhan Veli hangi yıl öldü?', '1950', '1941', '1941 Garip’in yayım yılıdır.'],
  ]),
  'trk12-siir-ikinci-yeni': sorular([
    ['İkinci Yeni, Garip’e tepki olarak doğmuştur.', true, 'Yalın ve açık şiire karşı çağrışımlı şiir savunuldu.'],
    ['İkinci Yeni şiiri anlamı tek ve açık biçimde verir.', false, 'Anlam kapalı ve çok katmanlıdır.'],
    ['Dünyanın En Güzel Arabistanı Turgut Uyar’ın 1959 tarihli kitabıdır.', true, 'Uyar’ın tanınmış kitabıdır.'],
    ['Kınar Hanımın Denizleri Cemal Süreya’nın kitabıdır.', false, 'Bu kitap Ece Ayhan’ındır.'],
    ['İkinci Yeni’de sözcüklerin alışılmış sırası kesinlikle korunur.', false, 'Sözcük sırası sıkça bozulur.'],
  ], [
    ['Üvercinka kimin kitabıdır?', 'Cemal Süreya', 'Turgut Uyar', 'Üvercinka 1958’de çıktı.'],
    ['Yerçekimli Karanfil kimin kitabıdır?', 'Edip Cansever', 'İlhan Berk', 'İlhan Berk’in kitabı Galile Denizi’dir.'],
    ['Galile Denizi kimin kitabıdır?', 'İlhan Berk', 'Ece Ayhan', 'Ece Ayhan’ın kitabı Kınar Hanımın Denizleri’dir.'],
    ['Hızırla Kırk Saat kimin kitabıdır?', 'Sezai Karakoç', 'Cemal Süreya', 'Cemal Süreya’nın kitabı Üvercinka’dır.'],
  ]),
  'trk12-siir-dini': sorular([
    ['Kaldırımlar, Necip Fazıl’ın 1928 tarihli kitabıdır.', true, 'Necip Fazıl’ın ilk kitaplarındandır.'],
    ['Diriliş dergisi 1943’te Sezai Karakoç tarafından çıkarıldı.', false, 'Diriliş 1960’tadır; 1943 Büyük Doğu’nun yılıdır.'],
    ['Cahit Zarifoğlu, Mavera dergisinin kurucuları arasındadır.', true, 'Mavera 1976’da çıktı.'],
    ['Hızırla Kırk Saat, Cahit Zarifoğlu’nun kitabıdır.', false, 'Hızırla Kırk Saat Sezai Karakoç’undur.'],
    ['Bu çizgide şiir, inanç ve metafizikten uzak durur.', false, 'İnanç, gelenek ve metafizik bu şiirin temel konularıdır.'],
  ], [
    ['Çile kimin şiir kitabıdır?', 'Necip Fazıl', 'Sezai Karakoç', 'Çile (1962) Necip Fazıl’ın şiirlerini toplar.'],
    ['Büyük Doğu dergisi hangi yıl çıktı?', '1943', '1960', '1960 Diriliş’in yılıdır.'],
    ['Monna Rosa kimin şiiridir?', 'Sezai Karakoç', 'Necip Fazıl', 'Monna Rosa Sezai Karakoç’un şiiridir.'],
    ['Mavera dergisi hangi yıl çıkmaya başladı?', '1976', '1960', 'Mavera 1976, Diriliş 1960’tadır.'],
  ]),
  'trk12-siir-1960-sonrasi': sorular([
    ['1980 sonrasında şiirde tek bir egemen akım yoktur.', true, 'Bireysel sesler ve çok seslilik öne çıkar.'],
    ['Evet, İsyan Gülten Akın’ın kitabıdır.', false, 'Evet, İsyan (1969) İsmet Özel’indir.'],
    ['İsmet Özel’in ilk kitabı Geceleyin Bir Koşu 1980’de çıktı.', false, 'Geceleyin Bir Koşu 1966’dadır.'],
    ['Kırmızı Karanfil 1971 tarihlidir.', true, 'Gülten Akın’ın kitabıdır.'],
  ], [
    ['Geceleyin Bir Koşu kimin kitabıdır?', 'İsmet Özel', 'Gülten Akın', 'Gülten Akın’ın tanınmış kitabı Kırmızı Karanfil’dir.'],
    ['Kırmızı Karanfil kimin kitabıdır?', 'Gülten Akın', 'İsmet Özel', 'İsmet Özel’in kitapları Geceleyin Bir Koşu ve Evet, İsyan’dır.'],
    ['Hangisi 1980 sonrası şiirin özelliğidir?', 'Bireysel seslerin çokluğu', 'Tek akımın egemenliği', 'Bu dönemde tek bir egemen akım yoktur.'],
  ]),
  'trk12-siir-halk': sorular([
    ['Âşık Veysel, Sivas’ın Sivrialan köyünde doğdu.', true, '1894’te doğdu, 1973’te öldü.'],
    ['Mihriban, Âşık Veysel’in şiiridir.', false, 'Mihriban Abdurrahim Karakoç’un şiiridir.'],
    ['Halkevleri 1950’de açıldı.', false, 'Halkevleri 1932’de açıldı.'],
    ['Âşık Mahzuni Şerif, toplumsal eleştiri şiirleriyle bilinir.', true, 'Protesto içerikli şiirleri öne çıkar.'],
    ['Âşık Veysel çocukken gözlerini kaybetti.', true, 'Saz çalmayı bu dönemden sonra öğrendi.'],
  ], [
    ['Mihriban kimin şiiridir?', 'Abdurrahim Karakoç', 'Âşık Mahzuni Şerif', 'Mihriban Abdurrahim Karakoç’un tanınmış şiiridir.'],
    ['Kara Toprak kimin şiiridir?', 'Âşık Veysel', 'Abdurrahim Karakoç', 'Kara Toprak Âşık Veysel’in şiiridir.'],
    ['Halkevleri hangi yıl açıldı?', '1932', '1928', '1928 Harf Devrimi’nin yılıdır.'],
    ['Âşık Veysel hangi yıl öldü?', '1973', '1983', 'Veysel 1894–1973 yıllarında yaşadı.'],
  ]),
}
