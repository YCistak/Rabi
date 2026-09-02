import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Fizik — Maarif Modeli.
 *
 * Dört tema: **Kuvvet ve Hareket**, **Enerji**, **Elektrik**, **Dalgalar**.
 * Eski programın "Basınç ve Kaldırma Kuvveti" ünitesi 9. sınıfa (Akışkanlar)
 * taşındı; Optik 10. sınıfta yok.
 */
export const fizik10 = program('fizik', 10, [
  tema('fzk10-t1', 'Kuvvet ve Hareket', [
    konu('fzk10-ivme', 'Sabit İvmeli Hareket', [
      kart(
        'İvme nedir?',
        'Hızdaki değişimin zamana oranı. Birimi m/s². Hızla aynı yöndeyse cisim hızlanır, zıtsa yavaşlar.',
      ),
      kart(
        'Temel bağıntılar',
        'v = v₀ + a·t ve x = v₀·t + ½·a·t². İlk hız sıfırsa ikinci bağıntı x = ½·a·t² olur.',
      ),
      kart(
        'Ortalama hız',
        'Sabit ivmeli harekette ortalama hız, ilk ve son hızın aritmetik ortalamasıdır. Yalnız ivme sabitse geçerli.',
      ),
      kart(
        'Grafiklerin dili',
        'Konum-zaman grafiğinin eğimi hızı, hız-zaman grafiğinin eğimi ivmeyi, altındaki alan yer değiştirmeyi verir.',
      ),
    ]),
    konu('fzk10-dusme', 'Serbest Düşme ve Atışlar', [
      kart(
        'Serbest düşme',
        'Yalnız yer çekimi etkisinde, ilk hızsız düşme. İvme yaklaşık 10 m/s²; **kütleden bağımsızdır**.',
      ),
      kart(
        'Tüy ve çekiç',
        'Hava direnci olmayan ortamda ikisi aynı anda düşer. Farkı yaratan yer çekimi değil hava direncidir.',
      ),
      kart(
        'Yatay atış',
        'Yatayda hız sabit, düşeyde serbest düşme. İki hareket birbirini etkilemez; havada kalma süresini yalnız yükseklik belirler.',
      ),
      kart(
        'Eğik atış',
        'Vektör yatay ve düşey bileşenlerine ayrılır. En yüksek noktada düşey hız sıfırdır, yatay hız sıfır değildir.',
      ),
    ]),
    konu('fzk10-newton', 'Newton’un Hareket Yasaları', [
      kart(
        'Birinci yasa (eylemsizlik)',
        'Net kuvvet sıfırsa cisim durumunu korur: duruyorsa durur, gidiyorsa sabit hızla gider.',
      ),
      kart(
        'İkinci yasa',
        'F = m·a. Aynı kuvvet, kütlesi büyük cisme daha küçük ivme kazandırır.',
      ),
      kart(
        'Üçüncü yasa',
        'Her etkiye eşit ve zıt bir tepki vardır. İkisi **farklı cisimlere** etki ettiği için birbirini götürmez.',
      ),
      kart(
        'Kütle ve ağırlık',
        'Kütle madde miktarıdır, her yerde aynıdır. Ağırlık yer çekimi kuvvetidir, G = m·g ile bulunur ve gezegene göre değişir.',
      ),
    ]),
  ]),
  tema('fzk10-t2', 'Enerji', [
    konu('fzk10-is', 'İş, Enerji ve Güç', [
      kart(
        'İş yapılmış sayılır mı?',
        'Kuvvet yönünde yer değiştirme varsa evet. Yer değiştirme sıfırsa ya da kuvvet harekete dikse iş sıfırdır.',
      ),
      kart(
        'İş-enerji teoremi',
        'Net kuvvetin yaptığı iş, kinetik enerjideki değişime eşittir. Cismi hızlandıran şey bu iştir.',
      ),
      kart(
        'Güç',
        'P = W/t. Aynı işi yarı sürede yapan makine iki kat güçlüdür; harcadığı toplam enerji aynıdır.',
      ),
      kart(
        'Verim',
        'Alınan enerjinin işe dönüşen kısmı. Kalan bölüm çoğunlukla ısıya gider; verim hiçbir makinede %100 olamaz.',
      ),
    ]),
    konu('fzk10-korunum', 'Mekanik Enerjinin Korunumu', [
      kart(
        'Korunum ilkesi',
        'Sürtünmesiz ortamda kinetik + potansiyel enerji toplamı sabittir. Biri azalırken öteki aynı kadar artar.',
      ),
      kart(
        'Sarkaç',
        'En yüksek noktada potansiyel en büyük, kinetik sıfır; en alçak noktada tam tersi.',
      ),
      kart(
        'Sürtünme varsa',
        'Mekanik enerji korunmaz ama toplam enerji korunur: kaybolan kısım ısıya ve sese dönüşür.',
      ),
      kart(
        'Yol değil yükseklik',
        'Çekim potansiyel enerjisi izlenen yola değil yalnız yükseklik farkına bağlıdır.',
      ),
    ]),
    konu('fzk10-kaynak', 'Enerji Kaynakları', [
      kart(
        'Yenilenebilir kaynaklar',
        'Güneş, rüzgâr, jeotermal, hidroelektrik, biyokütle. Tükenmezler ama kurulum yeri ve maliyeti sınırlayıcıdır.',
      ),
      kart(
        'Yenilenemez kaynaklar',
        'Kömür, petrol, doğal gaz ve nükleer yakıt. Yoğun enerji verirler ama sınırlıdırlar ve atık üretirler.',
      ),
      kart(
        'Enerji tasarrufu',
        'Yalıtım, verimli aygıt ve gereksiz tüketimi kesmek. Üretilmeyen enerji, en temiz enerjidir.',
      ),
      kart(
        'Enerji dönüşüm zinciri',
        'Her dönüşümde bir miktar enerji ısıya kaçar; zincir uzadıkça toplam verim düşer.',
      ),
    ]),
  ]),
  tema('fzk10-t3', 'Elektrik', [
    konu('fzk10-akim', 'Elektrik Akımı ve Potansiyel Fark', [
      kart(
        'Akım nedir?',
        'Birim zamanda bir kesitten geçen yük miktarı: I = q/t. Birimi amper (A).',
      ),
      kart(
        'Potansiyel fark',
        'İki nokta arasındaki enerji farkı, yani "itici güç". Birimi volt. Fark yoksa akım da olmaz.',
      ),
      kart(
        'Akım yönü',
        'Gerçekte elektronlar eksiden artıya gider; geleneksel akım yönü ise artıdan eksiye kabul edilir.',
      ),
      kart(
        'Devre elemanları',
        'Üreteç enerji verir, iletken taşır, direnç sınırlar, anahtar yolu açıp kapatır.',
      ),
    ]),
    konu('fzk10-direnc', 'Direnç ve Ohm Yasası', [
      kart(
        'Ohm yasası',
        'V = I·R. Gerilim sabitken direnç artarsa akım azalır.',
      ),
      kart(
        'Direnci belirleyenler',
        'İletkenin cinsi, uzunluğu (doğru orantı), kesit alanı (ters orantı) ve sıcaklığı.',
      ),
      kart(
        'Seri bağlama',
        'Dirençler toplanır, eşdeğer direnç büyür. Akım her elemandan **aynı** geçer, gerilim paylaşılır.',
      ),
      kart(
        'Paralel bağlama',
        'Eşdeğer direnç en küçük dirençten de küçüktür. Gerilim her kolda aynı, akım paylaşılır. Ev tesisatı paraleldir.',
      ),
    ]),
    konu('fzk10-guvenlik', 'Kısa Devre ve Topraklama', [
      kart(
        'Kısa devre',
        'Akımın dirençsiz bir yol bulması. Direnç düşünce akım aşırı büyür, kablo ısınır ve yangın çıkabilir.',
      ),
      kart(
        'Sigorta',
        'Akım güvenli sınırı aşınca devreyi kesen eleman. Devreye **seri** bağlanır.',
      ),
      kart(
        'Topraklama',
        'Kaçak akımı toprağa aktaran güvenlik yolu. Metal gövdeli aygıtlarda çarpılmayı önler.',
      ),
      kart(
        'Elektriksel güç',
        'P = V·I. Elektrik faturasındaki kilovatsaat, güç × süre yani enerjidir; güç değil.',
      ),
    ]),
  ]),
  tema('fzk10-t4', 'Dalgalar', [
    konu('fzk10-dalga', 'Dalgaların Temel Kavramları', [
      kart(
        'Dalga enerji taşır',
        'Dalgada ilerleyen şey madde değil enerjidir. Denizdeki şamandıra ileri gitmez, yerinde salınır.',
      ),
      kart(
        'Temel nicelikler',
        'Genlik, dalga boyu, frekans ve periyot. Frekans ile periyot birbirinin tersidir.',
      ),
      kart(
        'Hız bağıntısı',
        'v = λ·f. Ortam değişmedikçe hız sabittir; frekans artarsa dalga boyu azalır.',
      ),
      kart(
        'Enine ve boyuna dalga',
        'Enine dalgada titreşim ilerleme yönüne dik (ip dalgası), boyuna dalgada aynı yöndedir (ses).',
      ),
    ]),
    konu('fzk10-yansima', 'Yansıma ve Kırılma', [
      kart(
        'Yansıma yasası',
        'Gelme açısı yansıma açısına eşittir. Yansımada dalganın hızı, frekansı ve dalga boyu değişmez.',
      ),
      kart(
        'Kırılma',
        'Dalga ortam değiştirince hızı ve dalga boyu değişir. **Frekans değişmez** — onu kaynak belirler.',
      ),
      kart(
        'Su dalgalarında derinlik',
        'Derin ortamda hız büyük, sığ ortamda küçüktür. Sığa geçen dalga yavaşlar ve normale yaklaşır.',
      ),
      kart(
        'Girişim',
        'İki dalga üst üste binince tepe-tepe karşılaşırsa güçlenir, tepe-çukur karşılaşırsa sönümlenir.',
      ),
    ]),
  ]),
])
