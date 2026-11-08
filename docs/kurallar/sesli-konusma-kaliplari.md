# Sesli konuşma kalıpları kataloğu

Bu katalog, Soru Takibi'nde öğrencinin günlük çözümünü ve deneme sonucunu
anlatırken kullandığı dili tanımlar. Çözücü bu yuvaları birleştirir; tek bir
cümleyi ezberlemez. Yeni bir gerçek konuşma örneği geldiğinde önce buradaki
yuvası ve sırası belirlenir, sonra `lib/sesli-kalip.test.ts` üretecine, en son
çözücüye eklenir.

## Kip sınırı

Günlük soru yuvaları yalnız Soru Takibi'ndeki `soru` kipinde kaydedilir. Bu
kipte deneme/TYT/AYT/YDT çerçevesi ve çerçevenin devamındaki ders sonuçları
tamamen yok sayılır; öğrenci Denemeler'deki sohbete yönlendirilir. Denemeler'in
`deneme` kipinde öğrenci türü baştan seçer; ders doğru/yanlış yuvaları seçilen
sabit şablona yazılır ve metindeki başka tür adı şablonu değiştirmez. Günlük
`N soru çözdüm` ve `N tane ders çözdüm` yuvaları bu kipte yok sayılır; öğrenci
Soru Takibi'ne yönlendirilir.

## Yuvalar

### DERS

Kanonik hedef her zaman `CALISMA_DERSLERI`dir: Türkçe, Matematik, Fizik,
Kimya, Biyoloji, Tarih, Coğrafya, Yabancı Dil, Felsefe ve Din Kültürü.
Kullanılan adlar sırasıyla şunları da kapsar:

| Hedef | Konuşulan kökler |
| --- | --- |
| Türkçe | türkçe, türk, edebiyat, paragraf, dil bilgisi |
| Matematik | matematik, mat, geometri, geo, problem |
| Fizik | fizik, fiz, fzk |
| Kimya | kimya, kim, kmy |
| Biyoloji | biyoloji, biyo, bio, biy |
| Tarih | tarih, tar, trh, inkılap |
| Coğrafya | coğrafya, coğ, cog |
| Yabancı Dil | yabancı dil, ingilizce, ing, yds |
| Felsefe | felsefe, fel, sosyoloji, psikoloji, mantık |
| Din Kültürü | din, din kültürü, dkab |

Kökler yalın veya şu çekimlerle gelebilir: belirtme (`matematiği`,
`türkçeyi`), yönelme (`matematiğe`, `kimyaya`), bulunma (`matematikte`,
`türkçede`), ayrılma (`matematikten`, `fizikten`), birliktelik
(`fizikle`, `kimyayla`) ve iyelik (`matematiğim`, `türkçem`). Ünsüz
yumuşaması kökle birlikte tanınır. `matematik dersi`, `matematik dersinden`,
`matematik sorusu`, `matematik sorularının` ve bunların çoğulları da aynı köke bağlanır. Kısa adların
ekli biçimleri ancak yerleşik ve ayırt ediciyse kullanılır (`geodan`,
`coğdan`); belirsiz grup adları `fen` ve `sosyal` ders diye uydurulmaz.
Çok sözcüklü adlarda ek son sözcüktedir (`fen bilimlerinden`, `temel
matematikten`) ve çözücü aynı yerden başlayan en uzun adı önce seçer.

### SAYI

Sayı rakamla veya yazıyla gelir: `50`, `elli`, `yüz yirmi`, `iki yüz`.
Sonuç sayısında `20'si`, `20'sini`, `20'sinde`, `20 tanesi`, `20 tanesini`
gibi iyelik biçimleri tanınır. Yaklaşık belirteçler (`yaklaşık`, `civarı`,
`kadar`, `falan`, `küsur`, `gibi`) sayının dersle eşleşmesini bozmaz; Rabi
yaklaşık söylenen sayıyı öğrencinin verdiği tam sayı olarak yazar.

### SONUÇ

Sonuç etiketi `doğru`, `yanlış` veya `boş`tur. `20 doğru`, `20'si doğru`,
`20 doğrum`, `20 yanlışım var`, `3 boş bıraktım`, `boş kaldı` ve `10 tanesi
ise boş` aynı üç etikete açılır. `hepsi doğru`, `hepsini doğru yaptım`,
`tamamı doğru` ve `full` toplamı doğruya eşitler. `hiç yanlışım yok` ve
`yanlışım yok` yanlış sayısını sıfır yapar. Sonuçların sırası önemli değildir.

Geçmiş zamanlı `doğruydu`, `yanlıştı`, `boştu` da aynı sonuç etiketidir. Bir
ders adı ikinci kez yalnız `DERS sorularının` biçiminde geldiyse yeni soru
kaydı değildir; önceki dersin sonuçlarına bağlanır.

`geri kalanı/kalanı doğru-yanlış-boş` yalnız toplam ve öteki sonuçlar
tek anlamlıysa kalan sayıyı ifade eder; aksi durumda parça anlaşılmayana
gider. `boşum yok` boş sayısının sıfır olduğunu söyler ama tek başına doğru
veya yanlış uydurmaz.

### ÇÖZDÜM ve bağlaçlar

Çalışma eylemleri `çözdüm`, `yaptım`, `baktım`, `bitirdim`, `çözdük`,
`hallettim`/`halletim`, `soru çözdüm` ve `test çözdüm`dür. Test adedi soru
adedi değildir: `2 test çözdüm` sayı kaydı oluşturmaz ve ham parça
`anlasilmayan`a gider; çünkü soru sayısı bilinmez. Süre de aynı biçimde
işlenir: `2 saat` veya `30 dakika` soru sayısı değildir ve başka soru adedi
yoksa ham parça kullanıcıya sorulmak üzere `anlasilmayan`a gider. Buna karşılık
`N net` maskelenir ve ders adına sayı kaydı ya da anlaşılmayan parça eklemez.
`ve`, `ile`, `bir de`,
`ayrıca`, `sonra`, `ondan sonra`, `artı`, `ise`, `de/da`, `ama`, `fakat`,
`yani`, `şey`, `işte`, `ee` bağlamı bağlar veya ayırır. `bugün`, `sabah` ve
`akşam` dolgu/zaman bilgisidir; `dün` de kayıt gününü değiştirmez, anlatım
her zaman açık olan bugünün kaydına gider.

## Sıra kalıpları

| Sıra | Örnek | Beklenen |
| --- | --- | --- |
| `SAYI DERS (sorusu) ÇÖZDÜM` | `50 matematik sorusu çözdüm` | Matematik 50 |
| `DERS-den SAYI soru ÇÖZDÜM` | `matematikten elli soru yaptım` | Matematik 50 |
| `DERS SAYI` | `fizik 30` | Fizik 30 |
| toplam + üç sonuç | `50 matematik sorusu çözdüm 20'si doğru 20'si yanlış 10 tanesi ise boş` | Matematik 50, 20 doğru, 20 yanlış |
| toplamsız sonuç | `matematik 30 doğru 5 yanlış 2 boş` | Matematik 37, 30 doğru, 5 yanlış |
| toplam + yanlış | `30 soru çözdüm matematikten 5'ini yanlış yaptım` | Matematik 30, 25 doğru, 5 yanlış |
| toplam + tam doğru | `kimyadan 25 soru çözdüm hepsi doğru` | Kimya 25, 25 doğru |
| iyelikli sonuç | `matematikte 30 doğrum 5 yanlışım var` | Matematik 35, 30 doğru, 5 yanlış |
| ders içinde sonuç | `tarihte 15 doğru 3 yanlış` | Tarih 18, 15 doğru, 3 yanlış |
| karışık sonuç sırası | `biyoloji 5 yanlış 30 doğru 2 boş` | Biyoloji 37, 30 doğru, 5 yanlış |
| çok ders | `mat 20, sonra fizik 15, kimya 10 çözdüm` | Matematik 20; Fizik 15; Kimya 10 |
| deneme çerçevesi | `AYT sayısal denemesinde matematik 25 doğru 5 yanlış` | AYT sayısal; Matematik 25 doğru, 5 yanlış |
| toplam deneme neti | `TYT denemesinden 87 netim var` | TYT, toplam 87 net; derslere dağıtılmaz |

Deneme bağlamı `TYT/AYT/YDT denemesi`, `denemesine girdim`, `deneme çözdüm
TYT` veya sınav adı ardından ders + sonuçla kurulur. `Bugün 50 TYT matematik
sorusu çözdüm` soru kaydıdır, deneme değildir. Deneme çerçevesindeki `10 tane
Türkçe doğrusu` sonuç anlatımıdır; `tane` sözcüğü onu günlük soru geçişi yapmaz.

`N net` ve çekimli biçimleri (`netti`, `netim`, `net yaptım`, `net çıktı`)
asla soru adedi sayılmaz. Deneme bağlamı yoksa bu ifade deneme sonucu diye de
uydurulmaz; soru kaydı oluşturmaz ve anlaşılmayan ya da boş kalır.

## Kesinlik kuralları

- Doğru + yanlış + boş, söylenen toplamı aşarsa kayıt oluşturulmaz; ham parça
  `anlasilmayan`a gider.
- Toplamla yalnız doğru söylenirse yanlış sıfır yazılır; boşla mı yanlışla mı
  ayrıldığı uydurulmaz. Toplamla yalnız yanlış söylenirse kalan doğru kabul
  edilir. Yalnız boş sayı doğru/yanlış üretmez.
- Ders adı olmayan sonuç hiçbir derse eklenmez. Aynı cümledeki çözülemeyen
  ders, güvenle çözülen diğer dersleri veya deneme sonucunu düşürmez.
- Aynı ders için çelişen iki sonuç, kullanıcı doğrulayana dek kayda yazılmaz.

## BAĞLAM (kip verilmediğinde eski karma çözüm)

Deneme çerçevesi açıldıktan sonra gelen ders sonuçları denemeye aittir. Çerçeve
yalnız açık günlük geçişle (`ayrıca/bir de/onun dışında N soru çözdüm`,
`günlük`, `test çözdüm`, `deneme dışında`) veya yeni bir deneme çerçevesiyle
kapanır. Denemeden önceki sonuçlar günlük soru kaydıdır. `20 doğru 20 yanlış
Türkçe yaptım` biçiminde fiilden önce gelen sonuçlar da Türkçe deneme sonucudur.

Kipli sohbette bu eski geçiş kuralı uygulanmaz: sohbetin ekranı bağlamı baştan
belirler. Böylece deneme ile günlük çalışma aynı birikimde karışmaz.

## SOSYAL ve FEN (toplu)

Yalnız deneme bağlamında `sosyal`/`fen` ve `sosyalden`/`fenden` toplu sonuçtur: Sosyal; tarih,
coğrafya, felsefe, din ve AYT tarih/coğrafya varyantlarını; Fen ise fizik,
kimya ve biyolojiyi kapsar. Şablonda en az iki üye ders bulunmalı; doğru +
yanlış grup soru toplamını aşmamalıdır. `Sosyalden 15 doğru 2 yanlış` toplu olarak
kaydedilir; `Sosyalden 12 net` ise doğru/yanlış bilinmediği için açıklama ister.
Toplu sonuç ile aynı grupta ayrı ders sonucu birlikte söylenirse ikisi de
korunur ve Rabi bu çakışmayı belirtir. Günlük soru takibinde Sosyal/Fen ders
değildir; Rabi öğrenciden hangi dersi kastettiğini sorar.

## SOHBET

`merhaba/selam`, hâl sorma, teşekkür, veda, çalışmadım, moral ve yardım
niyetleri veri çözümünden bağımsız tanınır. Niyetin yanında veri varsa kısa
karşılama özetin başına gelir; veri yoksa yalnız samimi kısa cevap verilir,
"anlayamadım" denmez. `merhaba abi`, `bu arada`, `neyse` ve `işte` dolgu veya
sohbet sözüdür; çözülemeyen parça sayılmaz.
