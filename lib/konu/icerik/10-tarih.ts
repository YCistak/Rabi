import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Tarih — Maarif Modeli.
 *
 * Üç tema, üçü de tarih aralığıyla adlandırılıyor: **Türkistan'dan
 * Türkiye'ye (1040-1299)**, **Beylikten Devlete Osmanlı (1299-1453)**,
 * **Cihan Devleti Osmanlı (1453-1683)**.
 */
export const tarih10 = program('tarih', 10, [
  tema('trh10-t1', 'Türkistan’dan Türkiye’ye (1040-1299)', [
    konu('trh10-anadolu', 'Anadolu’nun Türkleşmesi', [
      kart(
        'Dandanakan (1040)',
        'Selçuklular Gaznelileri yendi ve Büyük Selçuklu Devleti kuruldu. Türklerin batıya yönelmesi burada başlar.',
      ),
      kart(
        'Malazgirt (1071)',
        'Bizans yenildi, Anadolu’nun kapıları açıldı. Fetih değil, **yerleşmenin** başlangıcı olduğu için dönüm noktasıdır.',
      ),
      kart(
        'Miryokefalon (1176)',
        'Anadolu’nun Türk yurdu olduğunun kesinleştiği savaş. Bizans, Anadolu’yu geri alma umudunu yitirdi.',
      ),
      kart(
        'İskân siyaseti',
        'Fethedilen yerlere Türkmen boyları yerleştirildi. Anadolu’nun kalıcı olarak Türkleşmesini sağlayan şey savaş değil bu yerleşmedir.',
      ),
    ]),
    konu('trh10-selcuklu', 'Türkiye Selçuklu Devleti', [
      kart(
        'Kuruluş',
        'Süleyman Şah tarafından İznik merkezli kuruldu; başkent sonra Konya’ya taşındı.',
      ),
      kart(
        'Ticaretin devlet politikası olması',
        'Kervansaraylar, limanların alınması (Sinop, Antalya) ve tüccarın zararını karşılayan uygulamalar ticareti devlet güvencesine aldı.',
      ),
      kart(
        'Kösedağ (1243)',
        'Moğollara yenilgi. Devlet dağılmadı ama Moğol egemenliğine girdi ve merkezî otorite zayıfladı.',
      ),
      kart(
        'Kültür ve mimari',
        'Medrese, darüşşifa, han ve kümbetler bu dönemin eserleridir; taş işçiliği Selçuklu sanatının imzasıdır.',
      ),
    ]),
    konu('trh10-ahilik', 'Ahilik ve Toplum Düzeni', [
      kart(
        'Ahilik nedir?',
        'Esnaf ve zanaatkârların meslek örgütü. Hem üretimi düzenler hem ahlak eğitimi verirdi.',
      ),
      kart(
        'Fütüvvet',
        'Ahiliğin dayandığı ahlak anlayışı: cömertlik, dürüstlik ve yardımlaşma. Meslek ile ahlak birlikte öğretilirdi.',
      ),
      kart(
        'Kalite denetimi',
        'Fiyat ve kalite ahi birliklerince belirlenirdi; kuralı çiğneyen esnaf meslekten men edilirdi (yolsuzluk cezası).',
      ),
      kart(
        'Çırak-kalfa-usta',
        'Meslek uzun bir eğitimle kazanılırdı. Bu düzen, Osmanlı’nın esnaf teşkilatının da temeli oldu.',
      ),
    ]),
    konu('trh10-beylikler', 'Moğol İstilası ve Beylikler', [
      kart(
        'Moğol istilası',
        'Cengiz Han ve haleflerinin batıya ilerleyişi, Türkistan’dan Anadolu’ya büyük bir göç dalgası yarattı.',
      ),
      kart(
        'İlk Türk beylikleri',
        'Danişmentliler, Saltuklular, Mengücekliler, Artuklular. Anadolu’da ilk Türk-İslam eserlerini bunlar bıraktı.',
      ),
      kart(
        'İkinci beylikler dönemi',
        'Selçuklu zayıflayınca Karamanoğulları, Germiyanoğulları, Osmanoğulları gibi beylikler kuruldu.',
      ),
      kart(
        'Türkçenin resmî dil olması',
        'Karamanoğlu Mehmet Bey’in fermanı, Türkçenin devlet dili olarak öne çıkışının simgesidir.',
      ),
    ]),
  ]),
  tema('trh10-t2', 'Beylikten Devlete Osmanlı (1299-1453)', [
    konu('trh10-kurulus', 'Osmanlı’nın Kuruluşu', [
      kart(
        'Coğrafi konumun avantajı',
        'Osmanlı Beyliği, Bizans sınırında kuruldu. Gaza için insan gücü buldu, öteki Türk beylikleriyle doğrudan çatışmak zorunda kalmadı.',
      ),
      kart(
        'Büyümenin sebepleri',
        'Merkezî otoritenin güçlü olması, hoşgörülü yönetim, düzenli ordu ve doğru zamanlama.',
      ),
      kart(
        'İstimalet',
        'Fethedilen halkın gönlünü kazanma siyaseti: din ve mülk güvencesi, vergi kolaylığı. Fetihleri kalıcı kılan yöntem.',
      ),
      kart(
        'Rumeli’ye geçiş',
        'Çimpe Kalesi’nin alınmasıyla Balkanlara geçildi. Osmanlı böylece bir Avrupa devleti hâline geldi.',
      ),
    ]),
    konu('trh10-kurumlar', 'İskân, Tımar ve Devşirme', [
      kart(
        'İskân siyaseti',
        'Fethedilen bölgelere Anadolu’dan Türk nüfus yerleştirildi. Amaç kalıcılık ve güvenlikti.',
      ),
      kart(
        'Tımar sistemi',
        'Toprağın geliri, asker yetiştirmesi karşılığında sipahiye bırakılırdı. Devlet hem toprağı işletir hem hazineden para çıkmadan ordu beslerdi.',
      ),
      kart(
        'Devşirme',
        'Hristiyan ailelerden alınan çocukların eğitilip devlet ve ordu kadrolarına yerleştirilmesi. Kapıkulu ordusunun kaynağıydı.',
      ),
      kart(
        'Merkezî ordunun anlamı',
        'Padişaha bağlı, maaşlı ve sürekli bir ordu, beyliklerden devlete geçişin en somut göstergesidir.',
      ),
    ]),
    konu('trh10-fetret', 'Fetret Devri ve Toparlanma', [
      kart(
        'Ankara Savaşı (1402)',
        'Timur, Yıldırım Bayezid’i yendi. Anadolu birliği bozuldu, beylikler yeniden kuruldu.',
      ),
      kart(
        'Fetret Devri',
        'Şehzadeler arası taht mücadelesiyle geçen yaklaşık on bir yıl. Devlet padişahsız kaldı ama yıkılmadı.',
      ),
      kart(
        'Neden yıkılmadı?',
        'Balkanlardaki iskân ve istimalet politikası tutmuştu; Rumeli toprakları elde kaldı ve devlet oradan toparlandı.',
      ),
      kart(
        'Toparlanma',
        'Çelebi Mehmet birliği yeniden kurdu, II. Murat merkezî otoriteyi güçlendirdi; Fetih için zemin böyle hazırlandı.',
      ),
    ]),
  ]),
  tema('trh10-t3', 'Cihan Devleti Osmanlı (1453-1683)', [
    konu('trh10-fetih', 'İstanbul’un Fethi', [
      kart(
        'Fethin sebepleri',
        'Toprak bütünlüğünü sağlamak, boğazların denetimini almak, ticaret yollarına hâkim olmak ve Bizans’ın kışkırtmalarını bitirmek.',
      ),
      kart(
        'Hazırlıklar',
        'Rumeli Hisarı yapıldı, büyük toplar döküldü, donanma güçlendirildi ve gemiler karadan yürütüldü.',
      ),
      kart(
        'Sonuçları',
        'Bizans yıkıldı, Orta Çağ kapandı, Yeni Çağ başladı. Osmanlı imparatorluğa dönüştü ve İstanbul başkent oldu.',
      ),
      kart(
        'Fetih ve Avrupa',
        'Kaçan bilginlerin İtalya’ya gitmesi Rönesans’ı hızlandırdı; surların topla yıkılması feodal kaleyi savunmasız bıraktı.',
      ),
    ]),
    konu('trh10-cihansumul', 'Cihanşümul Devlet Anlayışı', [
      kart(
        'Cihanşümul ne demek?',
        'Evrensel devlet iddiası: farklı din ve milletleri tek bir düzen altında yönetme anlayışı.',
      ),
      kart(
        'Millet sistemi',
        'Gayrimüslimler kendi dinî hukuklarına göre örgütlenirdi. İnanç serbestliği, imparatorluğu bir arada tutan bağdı.',
      ),
      kart(
        'Halifeliğin geçişi',
        'Yavuz’un Mısır seferiyle halifelik Osmanlı’ya geçti; devlet İslam dünyasının siyasi merkezi hâline geldi.',
      ),
      kart(
        'Kanun ve örf',
        'Şer’i hukukun yanında padişahın koyduğu örfi hukuk vardı. Kanunnameler bu ikili yapının ürünüdür.',
      ),
    ]),
    konu('trh10-kesifler', 'Coğrafi Keşifler ve Osmanlı', [
      kart(
        'Keşiflerin sebepleri',
        'Pusula ve gemicilikteki gelişme, doğu mallarına duyulan istek ve Osmanlı’nın ticaret yollarını denetlemesi.',
      ),
      kart(
        'Ticaret yollarının değişmesi',
        'İpek ve Baharat yolları önemini yitirdi, Atlas Okyanusu limanları öne çıktı. Osmanlı gümrük gelirlerinden kaybetti.',
      ),
      kart(
        'Fiyat devrimi',
        'Amerika’dan gelen altın ve gümüş Avrupa’da enflasyona yol açtı; ucuzlayan gümüş Osmanlı akçesini de değersizleştirdi.',
      ),
      kart(
        'Osmanlı’nın karşılığı',
        'Hint deniz seferleri ve Süveyş kanalı projesi denendi ama okyanus ticaretine dönük bir donanma kurulamadı.',
      ),
    ]),
    konu('trh10-islahat', 'Duraklama ve Islahatlar', [
      kart(
        'Duraklamanın işaretleri',
        'Fetihlerin durması, tımar sisteminin bozulması, kapıkulu sayısının kontrolsüz artması ve merkezî otoritenin zayıflaması.',
      ),
      kart(
        'Ekonomik sebepler',
        'Savaş gelirlerinin kesilmesi, iltizam usulünün yaygınlaşması ve dış ticarette gerileme hazineyi zorladı.',
      ),
      kart(
        'XVII. yüzyıl ıslahatları',
        'Genellikle **eski düzene dönme** amacı taşıdı ve baskıya dayandı; kalıcı olamamalarının sebebi budur.',
      ),
      kart(
        'Köprülüler dönemi',
        'Geniş yetkiyle göreve gelen Köprülü sadrazamları maliyeyi ve orduyu düzeltti; devlet kısa süreli bir toparlanma yaşadı.',
      ),
      kart(
        'II. Viyana Kuşatması (1683)',
        'Başarısızlıkla bitti ve gerileme dönemini başlattı. Osmanlı bundan sonra savunmada kalır.',
      ),
    ]),
  ]),
])
