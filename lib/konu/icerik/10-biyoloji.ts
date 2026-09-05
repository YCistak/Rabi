import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Biyoloji — Maarif Modeli.
 *
 * İki tema: **Enerji** (fotosentez, solunum, sindirim) ve **Ekoloji**.
 * Hücre bölünmeleri ve kalıtım eski programda 10. sınıftaydı; Maarif'te bu
 * sınıfta **yok**, o yüzden burada da yok.
 */
export const biyoloji10 = program('biyoloji', 10, 'Enerjiden ekolojiye', [
  tema('byl10-t1', 'Enerji', [
    konu('byl10-atp', 'Canlılarda Enerji Dönüşümü', [
      kart(
        'Enerji dönüşür, yaratılmaz',
        'Canlı enerji üretmez, biçim değiştirir: ışık enerjisi kimyasal enerjiye, o da iş yapan enerjiye dönüşür.',
      ),
      kart(
        'ATP döngüsü',
        'ATP kullanılınca ADP + fosfata ayrılır; solunumla yeniden ATP’ye bağlanır. Depolanmaz, sürekli üretilip harcanır.',
      ),
      kart(
        'Ototrof ve heterotrof',
        'Ototrof kendi besinini üretir (bitki, bazı bakteriler). Heterotrof dışarıdan hazır alır. İkisi de solunum yapar.',
      ),
      kart(
        'Enzim burada da baş rolde',
        'Fotosentez ve solunumun her basamağı ayrı bir enzimle yürür; bir enzim eksikse zincirin tamamı durur.',
      ),
    ]),
    konu('byl10-sindirim', 'Besinlerin Sindirimi', [
      kart(
        'Neden sindirim?',
        'Büyük moleküller hücre zarından geçemez. Sindirim, besini geçebilecek büyüklüğe küçültmektir.',
      ),
      kart(
        'Mekanik ve kimyasal',
        'Mekanik sindirim yalnız küçültür, molekülü değiştirmez (çiğneme). Kimyasal sindirim enzimle yapı taşlarına ayırır.',
      ),
      kart(
        'Hidroliz',
        'Kimyasal sindirimde araya su girer ve bağ kopar. Yapım tepkimesinin (dehidrasyon) tam tersi.',
      ),
      kart(
        'Son ürünler',
        'Karbonhidrat → monosakkarit, protein → amino asit, yağ → yağ asidi + gliserol. Kana bu hâlde geçerler.',
      ),
    ]),
    konu('byl10-fotosentez', 'Fotosentez', [
      kart(
        'Genel denklem',
        'Su + karbondioksit, ışık ve klorofil varlığında glikoz ve oksijene dönüşür. Işık enerjisi kimyasal enerjiye çevrilir.',
      ),
      kart(
        'İki evre',
        'Işığa bağlı evrede su parçalanır, oksijen çıkar, ATP ve NADPH üretilir. Işıktan bağımsız evrede CO₂ bağlanıp glikoz kurulur.',
      ),
      kart(
        'Çıkan oksijen sudan gelir',
        'Karbondioksitten değil. İşaretli oksijen deneyleriyle gösterilmiştir.',
      ),
      kart(
        'Hızını etkileyenler',
        'Işık şiddeti, CO₂ miktarı ve sıcaklık. Biri sınırlıysa ötekileri artırmak hızı değiştirmez — sınırlayıcı faktör kuralı.',
      ),
      kart(
        'Kemosentez',
        'Bazı bakteriler ışık yerine kimyasal tepkimelerden enerji alır. Işıksız derin deniz ortamlarında üretici olabilmelerinin sebebi.',
      ),
    ]),
    konu('byl10-solunum', 'Hücresel Solunum', [
      kart(
        'Amaç ATP üretmek',
        'Besindeki kimyasal enerji ATP’ye aktarılır. Oksijenli solunumun denklemi fotosentezin tersi gibidir.',
      ),
      kart(
        'Üç aşama',
        'Glikoliz sitoplazmada, Krebs çemberi ve elektron taşıma sistemi mitokondride gerçekleşir.',
      ),
      kart(
        'Glikoliz her canlıda var',
        'Oksijen gerektirmez ve sitoplazmada olur; bu yüzden prokaryot-ökaryot ayrımı olmadan bütün canlılarda görülür.',
      ),
      kart(
        'Verim farkı',
        'Oksijenli solunumda bir glikozdan çok sayıda ATP çıkar; fermantasyonda yalnızca 2 ATP. Fark elektron taşıma sisteminden gelir.',
      ),
    ]),
    konu('byl10-fermantasyon', 'Fermantasyon', [
      kart(
        'Oksijensiz yol',
        'Oksijen yokken glikoliz sürebilsin diye yapılan tepkimeler. Enerji verimi düşüktür ama hiç yoktan iyidir.',
      ),
      kart(
        'Laktik asit fermantasyonu',
        'Kas hücrelerinde oksijen yetmediğinde ve yoğurt yapımında görülür. Son ürün laktik asittir.',
      ),
      kart(
        'Etil alkol fermantasyonu',
        'Mayalarda görülür; etil alkol ve karbondioksit çıkar. Hamurun kabarmasının sebebi çıkan CO₂’dir.',
      ),
      kart(
        'ATP nerede üretiliyor?',
        'Fermantasyonda ATP yalnızca glikoliz basamağında üretilir; sonraki tepkimeler ATP vermez, glikolizin sürmesini sağlar.',
      ),
    ]),
  ]),
  tema('byl10-t2', 'Ekoloji', [
    konu('byl10-ekosistem', 'Ekosistemin Bileşenleri', [
      kart(
        'Cansız ve canlı bileşenler',
        'Cansız: ışık, su, sıcaklık, toprak, mineral. Canlı: üreticiler, tüketiciler ve ayrıştırıcılar.',
      ),
      kart(
        'Basamaklar',
        'Birey → popülasyon → komünite → ekosistem → biyom → biyosfer. Her basamak bir öncekini kapsar.',
      ),
      kart(
        'Habitat ve niş',
        'Habitat canlının adresi, niş ise mesleğidir: ne yediği, neyle etkileştiği, ekosistemde ne yaptığı.',
      ),
      kart(
        'Ayrıştırıcılar olmadan olmaz',
        'Ölü canlıları inorganik maddeye çevirirler. Olmasalardı madde döngüleri durur, üreticiler ham madde bulamazdı.',
      ),
    ]),
    konu('byl10-etkilesim', 'Popülasyon ve Etkileşimler', [
      kart(
        'Popülasyon dinamiği',
        'Popülasyonun büyüklüğünü doğum, ölüm, göç ve çevrenin taşıma kapasitesi belirler.',
      ),
      kart(
        'Tür içi rekabet',
        'Aynı türün bireyleri aynı kaynağı istediği için rekabet en şiddetli tür içindedir.',
      ),
      kart(
        'Simbiyoz türleri',
        'Mutualizmde iki taraf da kazanır, kommensalizmde biri kazanır öteki etkilenmez, parazitlikte biri kazanır öteki zarar görür.',
      ),
      kart(
        'Süksesyon',
        'Bir alandaki canlı topluluğunun zamanla değişip yerini başkasına bırakması. Çıplak kayadan başlarsa birincil, bozulan bir alanda başlarsa ikincil süksesyondur.',
      ),
    ]),
    konu('byl10-enerji-akisi', 'Madde ve Enerji Akışı', [
      kart(
        'Besin zinciri',
        'Enerji üreticiden tüketiciye tek yönde akar. Madde döngüseldir, enerji **döngüsel değildir**.',
      ),
      kart(
        'Besin ağı',
        'Gerçek ekosistemde zincirler birbirine bağlıdır. Bir türün yok olması ağın başka kollarını da etkiler.',
      ),
      kart(
        'Enerji piramidi',
        'Her basamakta enerjinin yaklaşık %10’u bir üste geçer, gerisi ısı olarak kaybolur. Zincirin uzunluğunu sınırlayan şey budur.',
      ),
      kart(
        'Biyolojik birikim',
        'Parçalanmayan zehirli maddeler basamaklar boyunca yoğunlaşır. En çok zararı en üstteki tüketici görür.',
      ),
    ]),
    konu('byl10-donguler', 'Madde Döngüleri', [
      kart(
        'Su döngüsü',
        'Buharlaşma, yoğunlaşma, yağış ve yer altı suyu hareketi. Güneş enerjisiyle işler.',
      ),
      kart(
        'Karbon döngüsü',
        'Fotosentez karbonu havadan alır, solunum ve yanma geri verir. Fosil yakıtlar döngünün dışına çıkmış karbonu geri sokar.',
      ),
      kart(
        'Azot döngüsü',
        'Havadaki azot doğrudan kullanılamaz; bakteriler bağlar (azot fiksasyonu), nitrifikasyonla bitkiye uygun hâle gelir, denitrifikasyonla havaya döner.',
      ),
      kart(
        'İnsanın etkisi',
        'Aşırı gübre azot döngüsünü, fosil yakıt karbon döngüsünü bozar. Sonuç ötrofikasyon ve küresel ısınmadır.',
      ),
    ]),
  ]),
])
