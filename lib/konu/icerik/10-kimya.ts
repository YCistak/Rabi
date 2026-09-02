import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Kimya — Maarif Modeli.
 *
 * Tema adları 9. sınıfla aynı (**Etkileşim**, **Çeşitlilik**,
 * **Sürdürülebilirlik**); değişen içerik. 9'daki atom ve bağ temeli burada
 * nicel boyuta taşınıyor: tepkime hesapları, gazlar, çözeltiler.
 */
export const kimya10 = program('kimya', 10, [
  tema('kim10-t1', 'Etkileşim', [
    konu('kim10-tepkime', 'Kimyasal Tepkimeler', [
      kart(
        'Denkleştirmenin mantığı',
        'Kütle korunur: girenlerdeki her element atomu, ürünlerde de aynı sayıda olmalı. Katsayı değişir, **alt indis değişmez**.',
      ),
      kart(
        'Alt indise dokunma',
        'H₂O’yu H₂O₂ yaparak denkleştirmek maddeyi değiştirmektir. Denkleştirme yalnız katsayılarla yapılır.',
      ),
      kart(
        'Yanma tepkimeleri',
        'Yakıt oksijenle birleşir. Tam yanmada CO₂ ve H₂O, eksik yanmada zehirli CO ve is çıkar.',
      ),
      kart(
        'Asit-baz (nötrleşme)',
        'Asit ve baz tepkimeye girer, tuz ve su oluşur. HCl + NaOH → NaCl + H₂O.',
      ),
      kart(
        'Çözünme-çökelme',
        'İki çözelti karışınca suda çözünmeyen bir ürün oluşuyorsa çökelek görülür; denklemde (k) ile gösterilir.',
      ),
    ]),
    konu('kim10-mol', 'Mol Kavramı', [
      kart(
        'Mol bir sayıdır',
        '1 mol = 6,02 × 10²³ tanecik (Avogadro sayısı). "Düzine" gibi bir sayma birimi, ama çok daha büyüğü.',
      ),
      kart(
        'Mol kütlesi',
        'Bir molün gram cinsinden kütlesi, maddenin atom/molekül kütlesine sayıca eşittir. Su için 18 g/mol.',
      ),
      kart(
        'Üç köprü',
        'Kütle ↔ mol (mol kütlesiyle), mol ↔ tanecik (Avogadro ile), mol ↔ hacim (normal koşullarda 22,4 L ile).',
      ),
      kart(
        'Normal koşullar',
        '0 °C ve 1 atm. Bu koşullarda **her** gazın 1 molü 22,4 litre yer kaplar; gazın cinsi fark etmez.',
      ),
    ]),
    konu('kim10-stokiyometri', 'Tepkime Hesapları', [
      kart(
        'Katsayılar mol oranıdır',
        'Denklemdeki katsayılar kütle değil mol oranını verir. Hesaba geçmeden önce her şeyi mole çevir.',
      ),
      kart(
        'Sınırlayıcı bileşen',
        'Tepkime, önce biten maddeye göre durur. Ürün miktarını hesaplarken bakılacak madde odur; öteki artar.',
      ),
      kart(
        'Verim',
        'Gerçekte elde edilen ürünün, teorik ürüne oranı. %100 verim laboratuvarda neredeyse hiç görülmez.',
      ),
      kart(
        'Sıralı çözüm',
        'Denklemi denkleştir → verileni mole çevir → katsayı oranıyla aranan maddenin molünü bul → istenen birime dön.',
      ),
    ]),
    konu('kim10-gaz', 'Gazlar', [
      kart(
        'Gazların özellikleri',
        'Tanecikleri arasındaki uzaklık büyüktür: sıkıştırılabilirler, bulundukları kabın hacmini alırlar ve kolayca yayılırlar.',
      ),
      kart(
        'Boyle: P ile V ters',
        'Sıcaklık sabitken basınç artarsa hacim azalır. Şırıngayı bastırınca havanın sıkışması.',
      ),
      kart(
        'Charles: V ile T doğru',
        'Basınç sabitken sıcaklık artarsa hacim artar. Sıcaklık **Kelvin** olmalı, yoksa oran bozulur.',
      ),
      kart(
        'İdeal gaz denklemi',
        'PV = nRT. Dört niceliği tek denklemde birleştirir; üçünü bilmek dördüncüsünü verir.',
      ),
      kart(
        'Difüzyon hızı',
        'Hafif gaz daha hızlı yayılır. Aynı ortamda parfüm kokusunun ağır moleküllerden önce ulaşmasının sebebi.',
      ),
    ]),
  ]),
  tema('kim10-t2', 'Çeşitlilik', [
    konu('kim10-cozelti', 'Çözeltiler ve Çözünme', [
      kart(
        'Çözelti nedir?',
        'Homojen karışım. Az olan çözünen, çok olan çözücüdür; en yaygın çözücü sudur.',
      ),
      kart(
        'Çözünme tanecik düzeyinde',
        'Çözücü tanecikleri çözüneni sarar ve ayırır. İyonik katılar suda iyonlarına ayrıldığı için çözelti elektriği iletir.',
      ),
      kart(
        'Elektrolit',
        'Suda iyon veren maddelerin çözeltisi iletkendir (tuz). Şeker çözünür ama iyon vermez, iletken değildir.',
      ),
      kart(
        'Çözünme hızını artıranlar',
        'Karıştırmak, ısıtmak ve çözüneni toz hâline getirmek. Bunlar hızı artırır, **çözünürlüğü** değil.',
      ),
    ]),
    konu('kim10-derisim', 'Derişim', [
      kart(
        'Kütlece yüzde',
        'Çözünenin kütlesinin çözelti kütlesine oranı × 100. Paydada çözücü değil **çözelti** var.',
      ),
      kart(
        'Molarite',
        'Litre başına düşen mol sayısı: M = n/V. Kimyada en çok kullanılan derişim birimi.',
      ),
      kart(
        'Seyreltme',
        'Su eklenince çözünenin mol sayısı değişmez, hacim büyür. Bu yüzden M₁V₁ = M₂V₂.',
      ),
      kart(
        'Derişik ve seyreltik',
        'Görecelidir: aynı çözelti bir ötekine göre derişik, bir başkasına göre seyreltik olabilir.',
      ),
    ]),
    konu('kim10-cozunurluk', 'Çözünürlük ve Koligatif Özellikler', [
      kart(
        'Çözünürlük',
        'Belirli sıcaklıkta 100 g çözücüde çözünebilen en fazla madde miktarı. Maddeye ve sıcaklığa bağlıdır.',
      ),
      kart(
        'Sıcaklığın etkisi',
        'Katıların çözünürlüğü genellikle sıcaklıkla artar; gazların çözünürlüğü **azalır**. Sıcak gazoz bu yüzden daha çok köpürür.',
      ),
      kart(
        'Kaynama noktası yükselmesi',
        'Çözünen eklenince çözeltinin kaynama noktası saf çözücüden yüksek olur. Tuzlu su 100 °C’nin üstünde kaynar.',
      ),
      kart(
        'Donma noktası alçalması',
        'Çözelti saf çözücüden daha geç donar. Kışın yollara tuz atılmasının ve antifrizin sebebi.',
      ),
    ]),
  ]),
  tema('kim10-t3', 'Sürdürülebilirlik', [
    konu('kim10-yesil', 'Yeşil Kimya ve Ayak İzi', [
      kart(
        'Atom ekonomisi',
        'Girenlerin ne kadarının ürüne dönüştüğü. Yüksek atom ekonomisi, aynı ürün için daha az atık demek.',
      ),
      kart(
        'Mikro ölçekli deney',
        'Aynı sonucu çok daha az kimyasalla almak. Hem atığı hem riski küçültür.',
      ),
      kart(
        'Su ayak izi',
        'Bir ürünün üretiminde harcanan toplam su. Bir tişörtün ayak izi binlerce litredir; tüketim kararı bir su kararıdır.',
      ),
      kart(
        'Geri dönüşüm ve döngüsel üretim',
        'Atığı ham maddeye çevirmek enerji ve ham madde tasarrufu sağlar; camda ve alüminyumda kayıp neredeyse sıfırdır.',
      ),
    ]),
    konu('kim10-atmosfer', 'Atmosfer Kimyası', [
      kart(
        'Asit yağmuru',
        'Kükürt ve azot oksitleri suyla birleşip asit oluşturur. Toprağı, suyu ve taş yapıları bozar.',
      ),
      kart(
        'Ozon incelmesi',
        'Kloroflorokarbonlar (CFC) ozonu parçalar. Montreal Protokolü’yle kullanımları sınırlandı ve tabaka onarılmaya başladı.',
      ),
      kart(
        'Sera gazları',
        'CO₂, metan ve su buharı ısıyı tutar. Doğal sera etkisi olmasa Dünya yaşanmaz derecede soğuk olurdu; sorun aşırılığı.',
      ),
      kart(
        'Hava kirleticileri',
        'Partikül madde, karbon monoksit ve azot oksitleri. Çoğu yanma kaynaklıdır; verimli yakma kirliliği doğrudan azaltır.',
      ),
    ]),
  ]),
])
