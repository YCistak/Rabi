import type { SoruKarti } from '../tip'
import { sorular } from './12-turkce-yardimci'

/**
 * 12. sınıf Edebiyat (2018 programı) — Giriş ve Hikâye yoklamaları.
 * Yanlış şık, kartlarda yan yana duran iki eser ya da iki yılın karıştırılmasıdır.
 */
export const girisHikayeSorulari: Record<string, Omit<SoruKarti, 'id'>[]> = {
  'trk12-dil-sozluk': sorular([
    ['Dil, toplumdan bağımsız ve hiç değişmeyen bir yapıdır.', false, 'Toplum, teknoloji ve başka dillerle ilişki dili zamanla değiştirir.'],
    ['Teknolojik gelişmeler dile yeni terimler kazandırabilir.', true, 'Bilgisayar ve internet birçok yeni sözcük getirdi.'],
    ['Dîvânü Lugâti’t-Türk’te madde başları Arapça, karşılıkları Türkçedir.', false, 'Madde başları Türkçe, karşılıkları Arapçadır.'],
    ['Tarama Sözlüğü eski yazılı eserlerdeki sözcükleri tanıklarıyla verir.', true, 'Eski metinlerden taranan sözcükler kaynaklarıyla gösterilir.'],
    ['Latin esaslı Türk alfabesi 1928’de kabul edildi.', true, 'Harf Devrimi 1928’dedir; TDK’nın kuruluşu 1932’dir.'],
  ], [
    ['Halk ağzından derlenen sözcükler hangi sözlükte toplanır?', 'Derleme Sözlüğü', 'Tarama Sözlüğü', 'Derleme halk ağzından, Tarama eski eserlerden sözcük toplar.'],
    ['Ahmed Vefik Paşa’nın sözlüğü hangisidir?', 'Lehçe-i Osmanî', 'Kâmûs-ı Türkî', 'Kâmûs-ı Türkî Şemseddin Sami’nindir.'],
    ['Kâmûs-ı Türkî’nin yazarı kimdir?', 'Şemseddin Sami', 'Kaşgarlı Mahmud', 'Kaşgarlı Mahmud Dîvânü Lugâti’t-Türk’ü yazdı.'],
    ['TDK’nın Türkçe Sözlük’ünün ilk baskı yılı hangisidir?', '1945', '1932', '1932 TDK’nın kuruluş yılıdır; ilk Türkçe Sözlük 1945’te çıktı.'],
    ['Türk Dil Kurumu hangi yıl kuruldu?', '1932', '1928', '1928 Harf Devrimi’nin yılıdır; TDK 1932’de kuruldu.'],
  ]),
  'trk12-hikaye-1923': sorular([
    ['Durum hikâyesinde belirgin bir olay örgüsü aranmaz.', true, 'Sıradan bir kesit ve ruh hâli anlatılır.'],
    ['Maupassant geleneği durum hikâyesi olarak bilinir.', false, 'Maupassant olay hikâyesini, Çehov durum hikâyesini temsil eder.'],
    ['Sait Faik’in hikâyelerinde Burgaz Adası ve balıkçılar sık yer alır.', true, 'Adada yaşadı; balıkçıları ve sıradan insanı anlattı.'],
    ['Sabahattin Ali’nin Değirmen kitabı 1947’de çıktı.', false, 'Değirmen 1935’tedir; 1947’de Sırça Köşk yayımlandı.'],
    ['Ayaşlı ile Kiracıları, Memduh Şevket Esendal’ın 1934 tarihli romanıdır.', true, 'Esendal sade bir dille Anadolu insanını anlatır.'],
  ], [
    ['Sait Faik’in Semaver kitabı hangi yıl çıktı?', '1936', '1939', '1939 Sarnıç’ın yılıdır.'],
    ['Sürpriz sonla biten, olay öne çıkan hikâye türü?', 'Olay hikâyesi', 'Durum hikâyesi', 'Durum hikâyesi sonucu değil ruh hâlini öne çıkarır.'],
    ['Sırça Köşk kimin hikâye kitabıdır?', 'Sabahattin Ali', 'Sait Faik', 'Sait Faik’in kitapları Semaver, Sarnıç, Lüzumsuz Adam’dır.'],
    ['Memleket Hikâyeleri kimin kitabıdır?', 'Refik Halit Karay', 'Ömer Seyfettin', 'Refik Halit Karay 1919’da Anadolu’yu anlattı.'],
    ['Lüzumsuz Adam kimin kitabıdır?', 'Sait Faik', 'Memduh Şevket Esendal', 'Lüzumsuz Adam Sait Faik’in 1948 tarihli kitabıdır.'],
  ]),
  'trk12-hikaye-1960': sorular([
    ['Yabancılaşma 1960 sonrası hikâyede sık işlenen temalardandır.', true, 'Birey çevresine ve kendine yabancılaşmış olarak anlatılır.'],
    ['İç monologda olaylar yalnızca dışarıdan, üçüncü kişiyle aktarılır.', false, 'İç monologda kahramanın iç sesi verilir.'],
    ['Korkuyu Beklerken Oğuz Atay’ın hikâye kitabıdır.', true, '1975’te yayımlandı.'],
    ['Tante Rosa Füruzan’ın hikâye kitabıdır.', false, 'Tante Rosa Sevgi Soysal’ındır; Füruzan’ın kitabı Parasız Yatılı’dır.'],
    ['Parasız Yatılı’da kente göçen yoksul insan anlatılır.', true, 'Füruzan çocuk ve kadın gözlemini öne çıkarır.'],
  ], [
    ['Parasız Yatılı kimin kitabıdır?', 'Füruzan', 'Sevgi Soysal', 'Tante Rosa Sevgi Soysal’ındır.'],
    ['Göçmüş Kediler Bahçesi kimin kitabıdır?', 'Bilge Karasu', 'Adalet Ağaoğlu', 'Adalet Ağaoğlu’nun hikâye kitabı Yüksek Gerilim’dir.'],
    ['Yüksek Gerilim kimin hikâye kitabıdır?', 'Adalet Ağaoğlu', 'Oğuz Atay', 'Oğuz Atay’ın hikâye kitabı Korkuyu Beklerken’dir.'],
    ['Düşüncelerin kopuk ve sırasız akışına ne denir?', 'Bilinç akışı', 'Geriye dönüş', 'Geriye dönüş geçmiş olayın bugüne karışmasıdır.'],
    ['Tante Rosa hangi yıl yayımlandı?', '1968', '1975', '1975 Korkuyu Beklerken’in yılıdır.'],
  ]),
}
