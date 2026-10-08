import { tema } from '../tip'
import { edebiyatKonusu } from './12-turkce-yardimci'

/** Giriş ve Hikâye üniteleri (2018 programı, 12. sınıf). */
export const girisHikayeTemalari = [
  tema('trk12-t1', 'Türk Dili ve Edebiyatına Giriş', [
    edebiyatKonusu({
      id: 'trk12-dil-sozluk', ad: 'Dilin Değişimi ve Türkçe Sözlükler',
      kartlar: [
        ['Dil canlıdır', 'Dil toplumla birlikte değişir.\n- Yeni nesne ve kavramlar yeni sözcük getirir.\n- Kullanılmayan sözcükler zamanla eskir.'],
        ['Değişimin nedenleri', '- **Toplumsal:** Yaşam biçimi değişince söz varlığı da değişir.\n- **Teknolojik:** Bilgisayar ve internet yeni terimler getirdi.\n- **Dillerarası:** Başka dillerle temas alıntı sözcük doğurur.'],
        ['Sosyal medya ve dil', 'Sosyal medya kısaltmayı ve gündelik konuşmanın yazıya geçmesini yaygınlaştırdı.\nHer yaygın kullanım yazım ölçüsü sayılmaz.'],
        ['Dîvânü Lugâti’t-Türk', 'Kaşgarlı Mahmud’un 11. yüzyılda yazdığı, bilinen ilk Türkçe sözlüktür.\nMadde başları Türkçe, karşılıkları Arapçadır.'],
        ['Osmanlı’da sözlükler', '- **Lehçe-i Osmanî:** Ahmed Vefik Paşa’nın sözlüğü.\n- **Kâmûs-ı Türkî:** Şemseddin Sami’nin 1900–1901 tarihli sözlüğü.'],
        ['Harf ve dil devrimi', '- **1928:** Latin esaslı Türk alfabesi kabul edildi.\n- **1932:** Türk Dil Kurumu (Türk Dili Tetkik Cemiyeti adıyla) kuruldu.'],
        ['Tarama ve Derleme', '- **Tarama Sözlüğü:** Eski yazılı eserlerdeki sözcükleri tanıklarıyla verir.\n- **Derleme Sözlüğü:** Halk ağzından derlenen sözcükleri toplar.'],
        ['Türkçe Sözlük ve Kılavuz', 'TDK’nın Türkçe Sözlük’ünün ilk baskısı 1945’te yayımlandı.\nYazım için başvurulacak ölçü Yazım Kılavuzu’dur.'],
      ],
      not: 'Yaygın kullanım dili değiştirir; yazımda ölçü ise Yazım Kılavuzu’dur.', notKarti: 3,
      kontrol: ['Halk ağzından derlenen sözcükler hangi sözlükte?', 'Derleme Sözlüğü', 'Tarama Sözlüğü', 'Tarama eski eserlerden, Derleme halk ağzından toplanır.', 4],
    }),
  ]),
  tema('trk12-t2', 'Hikâye', [
    edebiyatKonusu({
      id: 'trk12-hikaye-1923', ad: 'Cumhuriyet Dönemi Hikâyesi (1923–1960)',
      kartlar: [
        ['İki gelenek', 'Hikâye iki yolda ilerledi.\n- **Olay hikâyesi:** Maupassant geleneği; olay ve sürpriz son öne çıkar.\n- **Durum hikâyesi:** Çehov geleneği; bir an ve bir ruh hâli anlatılır.'],
        ['Olay hikâyesi', 'Ömer Seyfettin ve Refik Halit Karay bu çizgide anılır.\nOlayın düğümü ve çözümü hikâyeyi taşır.'],
        ['Durum hikâyesi', 'Belirgin bir olay örgüsü yoktur; sıradan bir kesit anlatılır.\nBu çizgide Memduh Şevket Esendal ve Sait Faik öne çıkar.'],
        ['Sait Faik Abasıyanık', '1906–1954 arasında yaşadı; durum hikâyesinin en güçlü adıdır.\nBurgaz Adası’nı, balıkçıları ve sıradan insanı anlattı.'],
        ['Sait Faik’in kitapları', '- **Semaver:** 1936\n- **Sarnıç:** 1939\n- **Lüzumsuz Adam:** 1948\n- **Alemdağ’da Var Bir Yılan:** 1954'],
        ['Memduh Şevket Esendal', 'Sade bir dille Anadolu insanını anlattı.\nAyaşlı ile Kirvelisi (1934) en bilinen hikâye kitabıdır.'],
        ['Sabahattin Ali', 'Değirmen (1935), Kağnı (1936), Ses (1937) ve Sırça Köşk (1947) kitaplarını yazdı.\nYoksul insanı ve toplumsal sorunları gerçekçi bir gözle işledi.'],
        ['Refik Halit Karay', 'Memleket Hikâyeleri (1919) Anadolu insanını ince bir mizahla anlatır.\nGurbet Hikâyeleri (1940) sürgün yıllarının ürünüdür.'],
      ],
      not: 'Olay hikâyesinde sonuç sürprizle gelir; durum hikâyesinde bir an ve ruh hâli anlatılır.', notKarti: 3,
      kontrol: ['Çehov geleneğini sürdüren hikâye türü hangisi?', 'Durum hikâyesi', 'Olay hikâyesi', 'Durum hikâyesinde bir kesit ve ruh hâli anlatılır.', 3],
    }),
    edebiyatKonusu({
      id: 'trk12-hikaye-1960', ad: '1960 Sonrası Hikâye',
      kartlar: [
        ['Yeni bir dönem', '1960 sonrasında hikâyede aranışlar çoğaldı.\nBirey, kent ve yabancılaşma temaları öne çıktı.'],
        ['Yabancılaşma ve yalnızlık', 'Kahraman çoğu kez çevresine ve kendine yabancıdır.\nDış olaydan çok iç dünya anlatılır.'],
        ['Anlatım teknikleri', '- **İç monolog:** Kahraman kendi kendine konuşur.\n- **Bilinç akışı:** Düşünceler sırayla ve kopuk akar.\n- **Geriye dönüş:** Geçmiş olay bugüne karışır.'],
        ['Oğuz Atay', 'Korkuyu Beklerken (1975) onun hikâye kitabıdır.\nYabancılaşma ve ironi bu hikâyelerde belirgindir.'],
        ['Sevgi Soysal', 'Tante Rosa (1968) kitabıyla dikkat çekti.\nBireyin yalnızlığı ve siyasal iklim hikâyelerine yansır.'],
        ['Füruzan', 'Parasız Yatılı (1971) yoksul, kente göçen insanı anlatır.\nÇocuk ve kadın gözlemi bu hikâyelerde önemlidir.'],
        ['Bilge Karasu', 'Göçmüş Kediler Bahçesi (1979) yoğun ve felsefi bir dille yazılmıştır.\nGerçek ile kurmaca arasındaki sınır burada sorgulanır.'],
        ['Adalet Ağaoğlu', 'Yüksek Gerilim (1974) kent yaşamındaki gerilimi anlatır.\nBireyin toplumsal değişim karşısındaki durumu işlenir.'],
      ],
      not: 'Teknik adını ezberleme; metinde ne yaptığına bak: iç monolog kahramanın kendi iç sesidir.', notKarti: 3,
      kontrol: ['Kahramanın kendi kendine konuşması hangi teknik?', 'İç monolog', 'Geriye dönüş', 'İç monologda düşünce kahramanın iç sesiyle verilir.', 3],
    }),
  ]),
]
