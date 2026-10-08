import { sikli, soru } from '../tip'

/**
 * 12. sınıf Fizik (2018 programı) konu sonu soruları.
 *
 * Kalıp `11-fizik-sorular.ts` ile aynı: doğru/yanlış iddialar ve iki şıklı
 * sorular sırayla dizilir, doğru şıkkın yeri konu ve sıraya göre dönüşür.
 * Program "hesaplamaya girilmez" dediği konularda (görelilik, Compton,
 * girişim) sorular kavramı yokluyor; hesap yalnız programın istediği yerde.
 */
type Iddia = [ifade: string, dogru: boolean, aciklama: string]
type Secim = [soru: string, dogru: string, yanlis: string, aciklama: string]
type Soru = ReturnType<typeof soru> | ReturnType<typeof sikli>

/** Doğru şıkkın yeri, konu ve soru sırasına göre dönüşümlü belirlenir. */
function derle(id: string, iddialar: Iddia[], secimler: Secim[]): Soru[] {
  const sonuc: Soru[] = []
  const enCok = Math.max(iddialar.length, secimler.length)
  for (let i = 0; i < enCok; i++) {
    if (i < iddialar.length) sonuc.push(soru(...iddialar[i]))
    if (i < secimler.length) {
      const [metin, dogru, yanlis, aciklama] = secimler[i]
      const konum = ((id.length + i) % 2) as 0 | 1
      sonuc.push(sikli(metin, konum === 0 ? [dogru, yanlis] : [yanlis, dogru], konum, aciklama))
    }
  }
  return sonuc
}

export const fizik12Sorulari: Record<string, Soru[]> = {
  'fzk12-donerek-oteleme': derle('fzk12-donerek-oteleme', [
    ['Kaymadan yuvarlanan tekerin yere değen noktası o an yere göre durgundur.', true, 'Dönme hızı ωr = v, ilerleme hızını o noktada tam karşılar; anlık hız sıfırdır.'],
    ['Eylemsizlik momenti yalnız cismin kütlesine bağlıdır.', false, 'Kütlenin dönme eksenine göre nasıl dağıldığına da bağlıdır; kenara toplanan kütle I’yı büyütür.'],
    ['Kütlesi ve yarıçapı aynı halkanın eylemsizlik momenti dolu diskinkinden büyüktür.', true, 'Halkada kütlenin tamamı kenarda: mr²; dolu diskte ½mr².'],
    ['Yuvarlanan cismin toplam kinetik enerjisi yalnız ½mv² ile bulunur.', false, 'Dönme enerjisi ½Iω² de eklenir.'],
    ['Kaymadan yuvarlanan teker bir turda yarıçapı kadar yol alır.', false, 'Bir turda çevresi kadar, yani 2πr yol alır.'],
  ], [
    ['Kaymadan yuvarlanan tekerin merkezi 4 m/s ile gidiyorsa en üst noktanın yere göre hızı?', '8 m/s', '4 m/s', 'Üst noktada dönme hızı ilerleme hızına eklenir: 2v = 8 m/s.'],
    ['Dönen patenci kollarını iki yana açarsa eylemsizlik momenti nasıl değişir?', 'Artar', 'Azalır', 'Kütle dönme ekseninden uzaklaşır; I büyür.'],
    ['Aynı yükseklikten kaymadan yuvarlanan dolu küre ve halkadan hangisi önce iner?', 'Dolu küre', 'Halka', 'Kürede kütle merkeze yakın; enerjinin daha büyük kısmı ötelemeye gider.'],
    ['Dönme kinetik enerjisi hangi niceliklere bağlıdır?', 'I ve ω', 'm ve h', 'E(dönme) = ½ · I · ω².'],
    ['Hangisi saf öteleme hareketidir?', 'Buzda kayan kutu', 'Dönen vantilatör pervanesi', 'Kayan kutunun bütün noktaları aynı yolu alır; pervane bir eksen çevresinde döner.'],
  ]),
  'fzk12-acisal-momentum': derle('fzk12-acisal-momentum', [
    ['Açısal momentum vektörel bir niceliktir.', true, 'Büyüklüğü ve yönü vardır; yönü sağ el kuralıyla bulunur.'],
    ['Dış tork sıfırsa cismin açısal hızı her durumda sabit kalır.', false, 'Sabit kalan L = Iω’dır; I değişirse ω da değişir.'],
    ['Dönerken kollarını açan patencinin dönme hızı azalır.', true, 'Kollar açılınca I büyür; L korunduğu için ω azalır.'],
    ['Güneş’e yaklaşan gezegenin yörünge hızı azalır.', false, 'mvr sabit; r küçülünce v artar.'],
    ['Tork, açısal momentumun birim zamandaki değişimine eşittir.', true, 'τ = ΔL / Δt; F = Δp / Δt’nin dönmedeki karşılığı.'],
    ['Açısal momentum yalnız gezegen gibi büyük cisimler için tanımlıdır.', false, 'Atom ölçeğinde de fiziksel bir niceliktir; Bohr modelinde elektronun L’si kesiklidir.'],
  ], [
    ['2 kg cisim 3 m yarıçaplı çemberde 4 m/s ile dolanıyor. L kaç kg·m²/s?', '24', '6', 'L = m · v · r = 2 · 4 · 3 = 24 kg·m²/s.'],
    ['I = 4 kg·m² ve ω = 5 rad/s olan diskin açısal momentumu kaçtır?', '20 kg·m²/s', '1,25 kg·m²/s', 'L = I · ω = 4 · 5 = 20 kg·m²/s.'],
    ['Dönme hareketinde kuvvetin karşılığı hangisidir?', 'Tork', 'Eylemsizlik momenti', 'F = ma’nın eşi τ = Iα; eylemsizlik momenti kütlenin karşılığıdır.'],
    ['Dönen sandalyedeki kişi ağırlıkları göğsüne çekerse ne olur?', 'Daha hızlı döner', 'Daha yavaş döner', 'Kütle eksene yaklaşır, I azalır; L korunduğu için ω artar.'],
    ['Üstten bakınca saatin tersine dönen diskin L’si hangi yöndedir?', 'Yukarı', 'Aşağı', 'Sağ elin parmakları saatin tersine kıvrılınca başparmak yukarıyı gösterir.'],
    ['Güneş’in çekimi gezegene neden tork uygulamaz?', 'Kuvvet r ile aynı doğrultuda', 'Çekim kuvveti çok zayıf olduğu için', 'Merkeze yönelen kuvvetin dönme noktasına göre torku sıfırdır; büyüklüğü önemli değil.'],
  ]),
  'fzk12-kutle-cekim': derle('fzk12-kutle-cekim', [
    ['Elmanın Dünya’yı çektiği kuvvet, Dünya’nın elmayı çektiği kuvvete eşittir.', true, 'Etki-tepki çiftidir; büyüklükleri eşit, yönleri zıttır.'],
    ['Yüzeydeki çekim ivmesi, düşen cismin kütlesi arttıkça artar.', false, 'g = GM/R²; düşen cismin kütlesi sadeleşir.'],
    ['Homojen kabul edilen Dünya’nın merkezinde çekim ivmesi sıfırdır.', true, 'Her yönden gelen çekimler birbirini dengeler.'],
    ['Yerden R kadar yükseklikte çekim ivmesi yüzeydekinin yarısıdır.', false, 'Merkeze uzaklık 2R olur; g dörtte birine iner.'],
    ['Sonsuzda sıfır alınırsa kütle çekim potansiyel enerjisi negatiftir.', true, 'Eₚ = −GMm/r; cisim yaklaştıkça daha negatif olur.'],
    ['Yörüngedeki uydunun hızı uydunun kütlesine bağlıdır.', false, 'v = √(GM/r); yalnız gezegenin kütlesine ve yörünge yarıçapına bağlı.'],
    ['Uzay istasyonundaki astronotlar orada kütle çekimi olmadığı için yüzer.', false, 'Çekim vardır; istasyonla birlikte sürekli serbest düşüştedirler.'],
  ], [
    ['Kütlesi Dünya’nın 2, yarıçapı 2 katı gezegende g kaçtır? (Dünya’da g = 10 m/s²)', '5 m/s²', '10 m/s²', 'g ∝ M/R² = 2/4 = ½; 10/2 = 5 m/s².'],
    ['Kütlelerden biri 3 katına, uzaklık 2 katına çıkarsa çekim kuvveti ne olur?', '¾ katına iner', '3/2 katına çıkar', 'F ∝ m/d²: 3/2² = 3/4.'],
    ['Homojen kürenin dışında çekim ivmesi merkeze uzaklıkla nasıl değişir?', 'r²’yle ters orantılı', 'r ile doğru orantılı', 'Dışarıda g = GM/r²; r ile doğru orantı kürenin içindeki durumdur.'],
    ['Yüzeydeki cismin kurtulma hızı neye bağlı değildir?', 'Cismin kütlesine', 'Gezegenin yarıçapına', 'v = √(2GM/R); cismin kütlesi sadeleşir.'],
    ['Uydunun yörünge yarıçapı büyürse yörünge hızı ne olur?', 'Azalır', 'Artar', 'v = √(GM/r); r büyüdükçe hız küçülür.'],
    ['Kütle çekim alan çizgileri hangi yöne bakar?', 'Kütlenin merkezine doğru', 'Kütleden dışarı doğru', 'Çekim alanı cismi kütleye doğru çeker; çizgiler merkeze yönelir.'],
  ]),
  'fzk12-kepler': derle('fzk12-kepler', [
    ['Kepler’e göre gezegen yörüngeleri merkezinde Güneş bulunan çemberlerdir.', false, 'Yörüngeler elipstir; Güneş odaklardan birindedir.'],
    ['Güneş’i gezegene birleştiren doğru eşit sürelerde eşit alanlar tarar.', true, 'Kepler’in ikinci yasası budur.'],
    ['Güneş’ten uzak gezegenlerin dolanma periyodu daha uzundur.', true, 'T² / r³ sabit; r büyüdükçe T büyür.'],
    ['T² / r³ oranı gezegenin kütlesi büyüdükçe artar.', false, 'Oran dolanılan cismin, yani Güneş’in kütlesine bağlıdır.'],
    ['Galileo teleskopla Jüpiter’in uydularını gözlemlemiştir.', true, 'Galileo 1610’da Jüpiter’in dört büyük uydusunu gözledi.'],
  ], [
    ['Güneş’e ortalama uzaklığı Dünya’nınkinin 4 katı olan gezegenin periyodu kaç yıl?', '8 yıl', '16 yıl', 'T² ∝ r³: T² = 4³ = 64, T = 8 yıl.'],
    ['Alanlar yasası hangi niceliğin korunumundan doğar?', 'Açısal momentum', 'Çizgisel momentum', 'Merkeze yönelik çekim tork yapmaz; L = mvr korunur.'],
    ['Güneş, gezegenin eliptik yörüngesinin neresindedir?', 'Odaklarından birinde', 'Tam merkezinde', 'Kepler’in birinci yasası: Güneş elipsin bir odağındadır.'],
    ['Kepler yasalarını bulurken kimin gözlem verilerini kullandı?', 'Tycho Brahe', 'Isaac Newton', 'Kepler, Tycho Brahe’nin Mars gözlemlerini çözümledi; Newton yasaları sonradan açıkladı.'],
    ['Semerkant’ta rasathane kurup yıldız kataloğu içeren zîci hazırlatan kimdir?', 'Uluğ Bey', 'Galileo', 'Uluğ Bey Semerkant’ta rasathane kurdu; Ali Kuşçu da bu çalışmada yer aldı.'],
  ]),
  'fzk12-bhh': derle('fzk12-bhh', [
    ['BHH’de geri çağırıcı kuvvet uzanımla doğru orantılı ve ona zıt yönlüdür.', true, 'F = −k · x.'],
    ['BHH yapan cismin ivmesi uç noktalarda sıfırdır.', false, 'a = −ω²x; ivme uçlarda en büyük, denge noktasında sıfırdır.'],
    ['Denge noktasından geçerken yay sarkacının kinetik enerjisi en büyüktür.', true, 'Orada yay potansiyel enerjisi sıfır, hız en büyüktür.'],
    ['Yay sarkacının periyodu genlik büyüdükçe artar.', false, 'T = 2π√(m/k); genliğe bağlı değildir.'],
    ['Aynı basit sarkacın periyodu Ay’da Dünya’dakinden uzundur.', true, 'Ay’da g küçük; T = 2π√(L/g) büyür.'],
    ['Özdeş iki yay seri bağlanınca eş değer yay sabiti iki katına çıkar.', false, 'Seride 1/k(eş) = 2/k, sabit k/2 olur; 2k paralel bağlamada.'],
    ['Düzgün çembersel hareketin bir çap üzerindeki izdüşümü BHH yapar.', true, 'Çemberin yarıçapı genlik, açısal hızı ω olur.'],
    ['Basit sarkacın kütlesi artırılırsa periyodu da artar.', false, 'T = 2π√(L/g); kütleye bağlı değildir.'],
  ], [
    ['Genliği 0,2 m, ω = 5 rad/s olan BHH’de en büyük hız kaçtır?', '1 m/s', '0,04 m/s', 'v(maks) = A · ω = 0,2 · 5 = 1 m/s.'],
    ['A = 10 cm, ω = 2 rad/s olan BHH’de x = 6 cm iken hız kaç cm/s’dir?', '16', '12', 'v = ω√(A² − x²) = 2 · √64 = 16 cm/s.'],
    ['Yay sarkacında kütle 4 katına çıkarsa periyot ne olur?', '2 katına çıkar', '4 katına çıkar', 'T ∝ √m; √4 = 2.'],
    ['k = 200 N/m olan yay 0,1 m genlikle salınıyor. Toplam enerji kaç J’dür?', '1 J', '20 J', 'E = ½kA² = ½ · 200 · 0,01 = 1 J.'],
    ['BHH’de ivmenin büyüklüğü nerede en büyüktür?', 'Uç noktalarda', 'Denge noktasında', 'a = ω²x; |x| en büyük uçlardadır.'],
    ['Yukarı doğru ivmelenen asansördeki sarkacın periyodu ne olur?', 'Kısalır', 'Uzar', 'Etkin çekim g + a olur; T = 2π√(L/g) küçülür.'],
    ['k sabitli yay iki eşit parçaya kesilip paralel bağlanırsa eş değer sabit kaçtır?', '4k', 'k', 'Her parçanın sabiti 2k; paralelde toplanır: 4k.'],
  ]),
  'fzk12-su-girisim': derle('fzk12-su-girisim', [
    ['Kırınıma uğrayan su dalgasının dalga boyu değişir.', false, 'Kırınımda hız, frekans ve dalga boyu değişmez; yalnız yayılma yönü genişler.'],
    ['Yarık dalga boyuna göre daraldıkça kırınım belirginleşir.', true, 'Dar yarık noktasal kaynak gibi davranır, dairesel dalgalar çıkar.'],
    ['Tepe ile çukurun karşılaştığı noktada yıkıcı girişim olur.', true, 'Zıt yönlü yer değiştirmeler birbirini söndürür.'],
    ['Düğüm çizgisi üzerindeki su en büyük genlikle titreşir.', false, 'Düğüm çizgisinde dalgalar birbirini söndürür; su titreşmez. En büyük genlik katarda.'],
    ['Kaynakların frekansı artırılırsa girişim desenindeki çizgiler sıklaşır.', true, 'Frekans artınca λ küçülür; katar ve düğüm çizgileri sıklaşır.'],
    ['Frekansları farklı iki kaynak kararlı bir girişim deseni oluşturur.', false, 'Kararlı desen için frekanslar eşit olmalı.'],
  ], [
    ['λ = 2 cm. P’nin kaynaklara uzaklıkları 9 ve 5 cm ise P nerededir?', '2. katarda', '2. düğümde', 'Fark 4 cm = 2λ; tam kat olduğu için 2. katar.'],
    ['λ = 2 cm. Kaynaklara uzaklık farkı 3 cm olan nokta nerededir?', '2. düğümde', '1. katarda', '3 = (2 − ½) · 2; yarım tek kat düğüm verir, n = 2.'],
    ['Dalga leğeninde yarıktaki kırınımı artırmak için ne yapılmalı?', 'Frekansı azaltmak', 'Frekansı artırmak', 'Frekans azalınca λ büyür; yarığa göre büyük dalga boyu daha çok bükülür.'],
    ['Eş fazlı kaynakların tam ortasından geçen dik çizgi nedir?', 'Merkez katar', 'Düğüm çizgisi', 'Bu çizgideki noktalar iki kaynağa eşit uzak; fark 0, yapıcı girişim.'],
    ['Girişim deseni bir hareketin hangi doğasını gösterir?', 'Dalga doğasını', 'Tanecik doğasını', 'Girişim ve kırınım dalgalara özgüdür.'],
    ['Frekans sabitken dalgalar daha derin bölgede yarıktan geçerse kırınım?', 'Artar', 'Azalır', 'Derinde hız ve dalga boyu büyür; yarığa göre λ büyüdükçe kırınım artar.'],
  ]),
  'fzk12-isik-girisim': derle('fzk12-isik-girisim', [
    ['Çift yarık deneyinde perdenin ortasındaki saçak aydınlıktır.', true, 'Merkezde yol farkı sıfırdır; yapıcı girişim olur.'],
    ['Kırmızı ışık yerine mor ışık kullanılırsa saçak aralığı artar.', false, 'Morun dalga boyu küçüktür; Δx = λL/d azalır.'],
    ['Yarıklarla perde arasındaki uzaklık artırılırsa saçaklar genişler.', true, 'Δx = λL/d; L büyüdükçe Δx büyür.'],
    ['Tek yarıkta kırınım deseninde bütün aydınlık saçaklar aynı genişliktedir.', false, 'Merkez saçak yan saçakların yaklaşık iki katı geniştir.'],
    ['Çift yarık düzeneği suya daldırılırsa saçak aralığı küçülür.', true, 'Suda dalga boyu λ/n olur; Δx de aynı oranda küçülür.'],
    ['Girişim deseni ışığın tanecik modeliyle kolayca açıklanır.', false, 'Saçaklar ancak dalga modeliyle açıklanır.'],
    ['Beyaz ışıkla yapılan çift yarık deneyinde merkezî saçak beyazdır.', true, 'Bütün renkler merkezde yapıcı girişim yapar.'],
  ], [
    ['Çift yarıkta yarıklar arası uzaklık yarıya inerse saçak aralığı ne olur?', 'İki katına çıkar', 'Yarıya iner', 'Δx = λL/d; d yarıya inince Δx iki katına çıkar.'],
    ['Perdede 2. karanlık saçakta yol farkı kaç λ’dır?', '1,5 λ', '2 λ', 'Karanlıkta yol farkı (n − ½)λ; n = 2 için 1,5λ.'],
    ['Perdede 3. aydınlık saçakta yol farkı kaç λ’dır?', '3 λ', '2,5 λ', 'Aydınlıkta yol farkı nλ; n = 3 için 3λ.'],
    ['Saçak aralığını büyütmek için hangi ışık seçilmeli?', 'Kırmızı', 'Mavi', 'Kırmızının dalga boyu büyüktür; Δx λ ile artar.'],
    ['Tek yarıkta merkez aydınlık saçak yan saçaklara göre nasıldır?', 'Yaklaşık iki kat geniş', 'Aynı genişlikte', 'Tek yarık deseninde merkez saçak en geniş ve en parlak olandır.'],
    ['Köşedeki kişinin sesi duyulur ama kendisi görünmez. Sebebi nedir?', 'Sesin dalga boyu çok daha büyük', 'Ses ışıktan hızlı yayılır', 'Kapı boyutundaki dalga boylu ses belirgin kırınır; ışığın dalga boyu çok küçük. Ses ışıktan yavaştır.'],
    ['Beyaz ışıkla çift yarıkta her saçağın merkeze en yakın rengi hangisidir?', 'Mor', 'Kırmızı', 'Δx λ ile orantılı; dalga boyu en küçük mor merkeze en yakın düşer.'],
  ]),
  'fzk12-doppler': derle('fzk12-doppler', [
    ['Yaklaşan ambulansın sireni duran gözlemciye daha tiz gelir.', true, 'Önündeki dalga tepeleri sıkışır; algılanan frekans yükselir.'],
    ['Doppler olayında kaynağın yaydığı frekans değişir.', false, 'Kaynağın frekansı aynıdır; değişen gözlemcinin algıladığı frekanstır.'],
    ['Ambulansın sürücüsü sirenin frekansını değişmiş duyar.', false, 'Sürücü kaynakla birlikte hareket eder; ikisi birbirine göre durgundur.'],
    ['Uzaklaşan galaksinin ışığı kırmızıya kayar.', true, 'Dalga boyu uzar; tayf çizgileri kırmızı yana kayar.'],
    ['Doppler olayı yalnız ses dalgalarında görülür.', false, 'Işık dahil bütün dalgalarda görülür; kırmızıya kayma buna örnektir.'],
  ], [
    ['Duran kaynağa doğru koşan gözlemci hangi frekansı algılar?', 'Daha yüksek', 'Daha düşük', 'Birim zamanda daha çok dalga tepesiyle karşılaşır.'],
    ['Uzaklaşan yıldızın tayf çizgileri hangi yöne kayar?', 'Kırmızıya', 'Maviye', 'Uzaklaşmada dalga boyu uzar; kırmızıya kayma olur.'],
    ['Trafik radarı aracın hızını neyle ölçer?', 'Yansıyan dalganın frekans kaymasıyla', 'Dalganın gidip gelme süresiyle', 'Hız Doppler kaymasından bulunur; gidip gelme süresi uzaklığı verir.'],
    ['Doppler ultrason hastanede neyi ölçmek için kullanılır?', 'Kan akışının hızını', 'Kemik yoğunluğunu', 'Kan hücrelerinden yansıyan sesin frekans kayması akış hızını gösterir.'],
    ['Geçen trenin düdüğü yanınızdan geçtikten sonra nasıl duyulur?', 'Daha kalın', 'Daha ince', 'Uzaklaşan kaynakta dalga boyu uzar, frekans düşer.'],
  ]),
  'fzk12-em-dalga': derle('fzk12-em-dalga', [
    ['Elektromanyetik dalgalar yayılmak için maddesel ortama ihtiyaç duyar.', false, 'Boşlukta da yayılırlar; Güneş ışığı bize boşluktan gelir.'],
    ['Boşlukta gama ışınları radyo dalgalarından daha hızlı yayılır.', false, 'Boşlukta bütün EM dalgalar c = 3 · 10⁸ m/s ile gider.'],
    ['EM dalgada elektrik ve manyetik alanlar yayılma doğrultusuna diktir.', true, 'Bu yüzden EM dalgalar enine dalgadır.'],
    ['Mor ışığın foton enerjisi kırmızı ışığınkinden büyüktür.', true, 'Morun frekansı büyüktür; E = h · f.'],
    ['Maxwell elektromanyetik teorinin kurucusudur.', true, 'Maxwell elektrik ve manyetizmayı tek teoride birleştirdi.'],
    ['Mikrodalga fırınlar morötesi ışınla çalışır.', false, 'Mikrodalga fırın, mikrodalgalarla yiyecekteki su moleküllerini titreştirir.'],
  ], [
    ['Frekansı 100 MHz olan radyo dalgasının dalga boyu kaç m’dir?', '3 m', '30 m', 'λ = c / f = 3 · 10⁸ / 10⁸ = 3 m.'],
    ['Hangisinin dalga boyu daha kısadır?', 'X ışını', 'Kızılötesi', 'Spektrumda X ışını kızılötesinden çok daha yüksek frekanslı, kısa dalga boyludur.'],
    ['Termal kameralar hangi ışımayı algılar?', 'Kızılötesi', 'Morötesi', 'Sıcak cisimler kızılötesi ışıma yayar.'],
    ['Antende elektromanyetik dalgayı ne üretir?', 'Titreşen elektronlar', 'Sabit hızla akan yükler', 'Dalga ivmeli yüklerden doğar; antende ileri geri titreşen elektronlar ivmelidir.'],
    ['Hangisi iyonlaştırıcı ışınımdır?', 'Gama', 'Radyo', 'Gama ışınlarının foton enerjisi atomdan elektron koparacak kadar büyüktür.'],
    ['Elektromanyetik dalgalar hangi dalga türündendir?', 'Enine', 'Boyuna', 'Alanlar yayılma yönüne dik titreşir.'],
  ]),
  'fzk12-atom-model': derle('fzk12-atom-model', [
    ['Thomson elektronun yükünün kütlesine oranını ölçmüştür.', true, 'Katot ışınlarını elektrik ve manyetik alanda saptırarak e/m oranını buldu.'],
    ['Rutherford deneyinde alfa parçacıklarının çoğu geri dönmüştür.', false, 'Çoğu doğrudan geçti; çok azı büyük açıyla saptı.'],
    ['Bohr modelinde elektron izinli yörüngede dolanırken ışıma yapmaz.', true, 'Işıma yalnız seviye değiştirirken olur.'],
    ['Hidrojende n büyüdükçe yörünge yarıçapı küçülür.', false, 'rₙ = n² · r₁; n büyüdükçe yarıçap büyür.'],
    ['Millikan elektronun yükünü yağ damlası deneyiyle ölçmüştür.', true, 'Damlaların yükleri 1,6 · 10⁻¹⁹ C’un tam katlarıydı.'],
    ['Bohr modeli çok elektronlu atomların tayfını başarıyla açıklar.', false, 'Model yalnız tek elektronlu atom ve iyonlarda başarılıdır.'],
    ['Belirsizlik ilkesine göre konum ve momentum aynı anda tam kesinlikle ölçülemez.', true, 'Heisenberg ilkesi doğanın özelliğidir, aletin kusuru değildir.'],
  ], [
    ['Hidrojende elektron n = 3’ten n = 1’e inerse ne olur?', 'Foton yayar', 'Foton soğurur', 'Yüksek enerjili seviyeden düşüğe geçen elektron aradaki farkı foton olarak salar.'],
    ['Rutherford deneyinde az sayıda parçacığın geri dönmesi neyi gösterir?', 'Kütle küçük bir çekirdekte', 'Elektronlar atoma eşit dağılmış', 'Geri dönüş, pozitif yükün ve kütlenin çok küçük bir çekirdekte toplandığını gösterir.'],
    ['Hidrojende n = 2 yörüngesinin yarıçapı r₁’in kaç katıdır?', '4', '2', 'rₙ = n² · r₁; n = 2 için 4r₁.'],
    ['E₂ = −3,4 eV, E₁ = −13,6 eV. 2’den 1’e inişte yayılan foton kaç eV’tur?', '10,2 eV', '17 eV', 'Foton enerjisi seviyelerin farkı: −3,4 − (−13,6) = 10,2 eV.'],
    ['“Üzümlü kek” atom modeli kime aittir?', 'Thomson', 'Rutherford', 'Thomson elektronları pozitif bir küreye gömülü düşündü.'],
    ['Elektronun bulunma olasılığını veren dalga denklemi kimindir?', 'Schrödinger', 'Dalton', 'Schrödinger dalga denklemi modern atom teorisinin temelidir.'],
    ['Rutherford modelinin açıklayamadığı nedir?', 'Atomun kararlı olması', 'Çekirdeğin varlığı', 'Klasik fiziğe göre dolanan elektron ışıyıp çekirdeğe düşmeliydi.'],
  ]),
  'fzk12-uyarilma': derle('fzk12-uyarilma', [
    ['Uyarılmış atom kısa sürede ışıma yaparak alt seviyeye döner.', true, 'Uyarılmış hâl kararsızdır; fazla enerji foton olarak verilir.'],
    ['İyonlaşma enerjisinden küçük foton, enerjisinin yalnız bir kısmını atoma bırakabilir.', false, 'Foton bölünmez; seviye farkına tam eşitse soğurulur, değilse hiç soğurulmaz.'],
    ['12 eV enerjili elektron temel hâldeki hidrojeni n = 2 seviyesine uyarabilir.', true, '10,2 eV’u verir, kalan 1,8 eV ile yoluna devam eder.'],
    ['n = 3’ten temel hâle inen elektron en çok iki farklı foton yayabilir.', false, '3 → 1, 3 → 2 ve 2 → 1 geçişleriyle üç farklı foton çıkabilir.'],
    ['Isıtılan gaz yalnız belirli dalga boylarında ışık yayar.', true, 'Kesikli seviyeler kesikli çizgi tayfı verir.'],
    ['Bütün elementlerin tayf çizgileri aynıdır.', false, 'Her elementin çizgileri kendine özgüdür; parmak izi gibi.'],
  ], [
    ['Temel hâldeki hidrojene 11 eV’luk foton gelirse ne olur?', 'Soğurulmaz', 'n = 2’ye uyarır', '11 eV hiçbir seviye farkına (10,2; 12,09…) eşit değil; foton soğurulmaz.'],
    ['Temel hâldeki hidrojene 11 eV’luk elektron çarpıp uyarırsa kaç eV ile çıkar?', '0,8 eV', '11 eV', 'Elektron 10,2 eV verip atomu n = 2’ye uyarır, 0,8 eV ile çıkar.'],
    ['Temel hâldeki hidrojeni iyonlaştırmak için en az kaç eV gerekir?', '13,6 eV', '3,4 eV', 'Elektron −13,6 eV’tan 0’a çıkarılmalı.'],
    ['n = 4’ten temel hâle inişlerde en çok kaç farklı foton çıkabilir?', '6', '4', 'n(n − 1)/2 = 4 · 3 / 2 = 6.'],
    ['Helyum ilk kez nerede fark edildi?', 'Güneş’in tayfında', 'Yer kabuğunda', 'Helyum 1868’de Güneş tayfındaki bir çizgiden fark edildi.'],
    ['Hangi fotonun dalga boyu daha kısadır?', '12,09 eV’luk', '1,89 eV’luk', 'E = hc/λ; enerjisi büyük fotonun dalga boyu kısadır.'],
  ]),
  'fzk12-buyuk-patlama': derle('fzk12-buyuk-patlama', [
    ['Uzak galaksilerin ışığındaki kırmızıya kayma evrenin genişlediğini gösterir.', true, 'Galaksiler bizden uzaklaştıkça ışıklarının dalga boyu uzar.'],
    ['Kozmik mikrodalga fon ışıması gökyüzünün yalnız bir yönünden gelir.', false, 'Her yönden neredeyse eşit gelir; evrenin ilk dönemlerinin kalıntısıdır.'],
    ['Proton ve nötron temel parçacıktır, iç yapıları yoktur.', false, 'İkisi de üçer kuarktan oluşur.'],
    ['Elektron bir lepton türüdür.', true, 'Leptonlar: elektron, müon, tau ve nötrinoları.'],
    ['Pozitron, elektronun antiparçacığıdır.', true, 'Kütlesi elektronunkine eşit, yükü pozitiftir.'],
    ['Madde ile antimadde karşılaşınca birleşip daha ağır bir parçacık oluşturur.', false, 'Yok olurlar; kütleleri gama fotonlarına dönüşür.'],
    ['Higgs bozonu CERN’deki deneylerde gözlenmiştir.', true, '2012’de Büyük Hadron Çarpıştırıcısı’nda gözlendi.'],
  ], [
    ['Nötronun kuark yapısı hangisidir?', 'udd', 'uud', 'Yük: ⅔ − ⅓ − ⅓ = 0; uud protondur.'],
    ['Elektromanyetik kuvvetle hangi kuvvetin birleşik olduğu gösterildi?', 'Zayıf nükleer kuvvet', 'Kütle çekim kuvveti', 'Salam, Glashow ve Weinberg elektrozayıf birleşmeyle 1979 Nobel’ini aldı.'],
    ['Evrende ilk atomlar ne zaman oluştu?', 'Yaklaşık 380 000 yıl sonra', 'İlk saniyede', 'İlk saniyede proton ve nötron oluştu; atomlar evren yeterince soğuyunca kuruldu.'],
    ['Kararlı durum teorisini zayıflatan bulgu hangisidir?', 'Kozmik fon ışıması', 'Güneş tutulması', 'Fon ışıması, evrenin sıcak ve yoğun bir başlangıcı olduğunu gösterdi.'],
    ['Hubble’a göre galaksilerin uzaklaşma hızı neyle artar?', 'Uzaklıklarıyla', 'Kütleleriyle', 'Hubble Yasası: uzak galaksi daha hızlı uzaklaşır.'],
    ['Temel parçacıklara kütle kazandıran alan hangisidir?', 'Higgs alanı', 'Elektrik alanı', 'Higgs alanıyla etkileşen parçacıklar kütle kazanır; parçacığı Higgs bozonudur.'],
    ['Evrenin yaşı yaklaşık kaç yıldır?', '13,8 milyar', '4,6 milyar', '4,6 milyar yıl Güneş Sistemi’nin yaşıdır; evren yaklaşık 13,8 milyar yaşında.'],
  ]),
  'fzk12-radyoaktivite': derle('fzk12-radyoaktivite', [
    ['Radyoaktif bozunma, madde ısıtılarak hızlandırılabilir.', false, 'Sıcaklık, basınç ve kimyasal tepkime bozunmayı etkilemez.'],
    ['Alfa parçacığı bir helyum çekirdeğidir.', true, 'İki proton ve iki nötrondan oluşur: ⁴₂He.'],
    ['Beta eksi bozunmasında kütle numarası 1 azalır.', false, 'Nötron protona dönüşür; A değişmez, Z 1 artar.'],
    ['Gama ışınları elektrik alanda sapmaz.', true, 'Gama yüksüz bir fotondur.'],
    ['Alfa ışınlarının giriciliği gama ışınlarınınkinden fazladır.', false, 'Alfayı bir kâğıt durdurur; en girici gamadır.'],
    ['Marie Curie polonyum ve radyumu keşfedenlerdendir.', true, 'Pierre Curie ile birlikte bu iki elementi buldu.'],
    ['Gama ışıması sonucu çekirdek başka bir elemente dönüşür.', false, 'Gamada A ve Z değişmez; element aynı kalır.'],
  ], [
    ['²³⁸₉₂U bir alfa parçacığı yayarsa hangi çekirdek oluşur?', '²³⁴₉₀Th', '²³⁴₉₂U', 'A 4, Z 2 azalır: 238 − 4 = 234, 92 − 2 = 90 (toryum).'],
    ['¹⁴₆C beta eksi bozunmasıyla hangi çekirdeğe dönüşür?', '¹⁴₇N', '¹⁴₅B', 'Nötron protona dönüşür, Z bir artar: 6 → 7 (azot).'],
    ['Çekirdek 2 alfa ve 2 beta eksi yayarsa atom numarası nasıl değişir?', '2 azalır', '6 azalır', '2α: −4; 2β⁻: +2; toplam −2.'],
    ['Bir kâğıt yaprağıyla durdurulabilen ışıma hangisidir?', 'Alfa', 'Gama', 'Alfa en az girici ışımadır; gama için kalın kurşun gerekir.'],
    ['X ışınlarını kim keşfetti?', 'Röntgen', 'Becquerel', 'Röntgen 1895’te X ışınlarını, Becquerel 1896’da uranyumun ışımasını buldu.'],
    ['Hangi bozunmada çekirdekteki bir proton nötrona dönüşür?', 'Beta artı', 'Beta eksi', 'Beta artıda pozitron çıkar ve Z bir azalır.'],
  ]),
  'fzk12-nukleer': derle('fzk12-nukleer', [
    ['Fisyonda ağır bir çekirdek iki orta büyüklükte çekirdeğe bölünür.', true, 'U-235 nötron soğurup bölünür; nötronlar ve enerji açığa çıkar.'],
    ['Nükleer reaktörde yavaşlatıcı madde nötronları hızlandırır.', false, 'Su ya da grafit nötronları yavaşlatır; yavaş nötron fisyonu kolaylaştırır.'],
    ['Füzyon için çok yüksek sıcaklık gerekir.', true, 'Çekirdekler arasındaki elektriksel itmeyi yenmek için milyonlarca derece gerekir.'],
    ['Fisyon ve füzyonda ürünlerin toplam kütlesi tepkimeye girenlerden büyüktür.', false, 'İkisinde de kütle azalır; fark enerjiye dönüşür.'],
    ['Radon gazı doğal bir radyasyon kaynağıdır.', true, 'Topraktaki uranyumun bozunmasıyla oluşur, kapalı alanda birikir.'],
    ['Mikrodalga iyonlaştırıcı bir radyasyondur.', false, 'Mikrodalga fotonlarının enerjisi atomdan elektron koparmaya yetmez.'],
    ['Radyasyon kaynağından uzaklaşmak alınan dozu azaltır.', true, 'Işıma şiddeti uzaklıkla hızla azalır.'],
  ], [
    ['Kontrolsüz zincirleme fisyon tepkimesi hangisinde görülür?', 'Atom bombası', 'Nükleer santral', 'Santralde kontrol çubukları tepkimeyi denetler; bombada zincir kontrolsüzdür.'],
    ['Hangisi bir füzyon tepkimesidir?', 'Döteryumla trityumun birleşmesi', 'Uranyum-235’in bölünmesi', 'Hafif çekirdeklerin birleşmesi füzyondur; uranyumun bölünmesi fisyon.'],
    ['Türkiye’nin ilk nükleer santrali nerede kuruluyor?', 'Mersin Akkuyu', 'Sinop', 'Akkuyu Nükleer Güç Santrali Mersin’dedir; Sinop için ayrı bir proje planlandı.'],
    ['Gama kaynağına karşı en etkili zırh hangisidir?', 'Kalın kurşun', 'Kâğıt', 'Kâğıt yalnız alfayı durdurur; gama için kalın kurşun ya da beton gerekir.'],
    ['Gıda ışınlamanın amacı nedir?', 'Mikropları öldürmek', 'Gıdayı radyoaktif yapmak', 'Işınlanan gıda radyoaktif olmaz; gama mikropları öldürüp raf ömrünü uzatır.'],
    ['Fisyonda açığa çıkan enerjinin kaynağı nedir?', 'Kütle kaybı', 'Elektronların kopması', 'E = mc²: ürünlerin kütlesi azalır, fark enerjiye dönüşür.'],
  ]),
  'fzk12-gorelilik': derle('fzk12-gorelilik', [
    ['Michelson–Morley deneyinde girişim saçaklarında beklenen kayma gözlenmedi.', true, 'Işık hızı her yönde aynı ölçüldü; esir bulunamadı.'],
    ['Işığın boşluktaki hızı, kaynağın hızına göre farklı ölçülür.', false, 'İkinci postüla: ışık hızı herkes için c’dir.'],
    ['Fizik yasaları bütün eylemsiz gözlem çerçevelerinde aynıdır.', true, 'Einstein’ın birinci postülası.'],
    ['Hareket eden saat, duran gözlemciye daha hızlı işliyormuş gibi görünür.', false, 'Zaman genişlemesi: hareketli saat daha yavaş işler.'],
    ['Uzunluk kısalması yalnız hareket doğrultusundaki boyutta olur.', true, 'Harekete dik boyutlar değişmez.'],
    ['Günlük hızlarda zaman genişlemesi kolayca fark edilir.', false, 'Etki ancak ışık hızına yakın hızlarda belirgindir.'],
    ['Nükleer tepkimelerde açığa çıkan enerji kütle kaybından gelir.', true, 'E = mc²; ürünlerin kütlesi azalır.'],
  ], [
    ['0,6c ile giden uzay gemisinin farından çıkan ışık yerden kaç c ölçülür?', 'c', '1,6c', 'İkinci postüla: ışığın boşluktaki hızı herkes için c’dir.'],
    ['Öz zamanı kim ölçer?', 'Saatle birlikte hareket eden', 'Saati hareketli gören', 'Öz zaman saatle aynı çerçevedeki gözlemcinin ölçtüğü, en kısa süredir.'],
    ['1 g kütle tamamen enerjiye dönüşse kaç J açığa çıkar?', '9 · 10¹³ J', '3 · 10⁵ J', 'E = mc² = 10⁻³ · (3 · 10⁸)² = 9 · 10¹³ J.'],
    ['Michelson–Morley deneyi neyi bulmak için yapıldı?', 'Esirin varlığını', 'Işığın kütlesini', 'Deney, Dünya’nın esire göre hareketini saçak kaymasıyla ölçmeyi amaçladı.'],
    ['Atmosferde oluşan müonların yere ulaşmasını hangi olay açıklar?', 'Zaman genişlemesi', 'Doppler olayı', 'Işığa yakın hızdaki müonların zamanı Dünya’dan bakınca yavaşlar.'],
    ['Görelilik düzeltmesi hangi teknolojide şarttır?', 'GPS uyduları', 'Elektrikli ocak', 'Uydu saatlerinin göreli farkı düzeltilmezse konum hatası her gün büyür.'],
  ]),
  'fzk12-siyah-cisim': derle('fzk12-siyah-cisim', [
    ['Siyah cisim üzerine düşen ışımanın tamamını soğurur.', true, 'İdeal soğurucudur; ışıması yalnız sıcaklığına bağlıdır.'],
    ['Sıcaklık artınca siyah cismin en çok ışıdığı dalga boyu uzar.', false, 'Tepe kısa dalga boyuna kayar.'],
    ['Planck’a göre ışıma enerjisi kesikli paketler hâlinde yayılır.', true, 'Her paketin enerjisi E = h · f.'],
    ['Klasik fizik kısa dalga boylarındaki siyah cisim eğrisini doğru öngörmüştür.', false, 'Klasik fizik sınırsız şiddet öngördü (morötesi felaketi); deney tersini gösterdi.'],
    ['Mavi yıldızın yüzey sıcaklığı kırmızı yıldızınkinden düşüktür.', false, 'Mavi yıldız daha kısa dalga boyunda en çok ışır; daha sıcaktır.'],
  ], [
    ['Frekansı 10¹⁵ Hz olan kuantumun enerjisi kaç J’dür? (h = 6,6 · 10⁻³⁴ J·s)', '6,6 · 10⁻¹⁹ J', '6,6 · 10⁻⁴⁹ J', 'E = h · f = 6,6 · 10⁻³⁴ · 10¹⁵ = 6,6 · 10⁻¹⁹ J.'],
    ['Isıtılan demir ilk önce hangi renkte parlar?', 'Kırmızı', 'Mavi', 'Düşük sıcaklıkta tepe uzun dalga boyundadır; görünür ışıkta önce kırmızı belirir.'],
    ['Siyah cismin ışıma dağılımı neye bağlıdır?', 'Yalnız sıcaklığına', 'Yüzeyinin rengine', 'İdeal siyah cismin ışıması maddesinden ve renginden bağımsızdır.'],
    ['Morötesi felaketi hangisinin başarısızlığıdır?', 'Klasik fiziğin', 'Planck hipotezinin', 'Klasik öngörü deneyle çelişti; Planck’ın kuantum varsayımı eğriyi açıkladı.'],
    ['Planck sabitinin birimi hangisidir?', 'J · s', 'J / s', 'h = E / f; joule bölü 1/s = J · s.'],
  ]),
  'fzk12-fotoelektrik': derle('fzk12-fotoelektrik', [
    ['Fotonun kütlesi yoktur.', true, 'Foton kütlesiz ve yüksüzdür; boşlukta c ile gider.'],
    ['Eşik frekansının altındaki ışığın şiddeti artırılırsa fotoelektron sökülür.', false, 'Şiddet foton sayısını artırır; her fotonun enerjisi yine eşikten küçüktür.'],
    ['Fotoelektronların en büyük kinetik enerjisi ışığın frekansıyla artar.', true, 'Eₖ(maks) = hf − E₀.'],
    ['Işık şiddeti iki katına çıkarsa fotoelektronların en büyük kinetik enerjisi de iki katına çıkar.', false, 'Şiddet elektron sayısını değiştirir; Eₖ(maks) değişmez.'],
    ['Farklı metallerin Eₖ(maks) – frekans doğruları birbirine paraleldir.', true, 'Hepsinin eğimi Planck sabitidir.'],
    ['Durdurma gerilimi ışık şiddetine bağlıdır.', false, 'eVₖ = Eₖ(maks); yalnız frekansa ve metale bağlıdır.'],
    ['Fotoelektrik olay ışığın tanecik modeliyle açıklanır.', true, 'Einstein olayı foton kavramıyla açıkladı.'],
    ['Dalga boyu eşik dalga boyundan büyük olan ışık metalden elektron söker.', false, 'Uzun dalga boylu fotonun enerjisi eşikten küçüktür; elektron sökmek için λ < λ₀ olmalı.'],
  ], [
    ['Eşik enerjisi 2 eV olan metale 5 eV’luk foton düşerse Eₖ(maks) kaçtır?', '3 eV', '7 eV', 'Eₖ(maks) = 5 − 2 = 3 eV.'],
    ['Eₖ(maks) = 4 eV olan fotoelektronların durdurma gerilimi kaç V’tur?', '4 V', '2 V', 'eVₖ = Eₖ(maks); 4 eV için 4 V.'],
    ['Eₖ(maks) – frekans grafiğinde doğrunun eğimi neyi verir?', 'Planck sabitini', 'Eşik enerjisini', 'Eₖ = hf − hf₀; eğim h, yatay kesişim eşik frekansıdır.'],
    ['Dalga boyu 400 nm olan fotonun enerjisi kaç eV’tur? (hc = 1240 eV·nm)', '3,1 eV', '2,48 eV', 'E = 1240 / 400 = 3,1 eV.'],
    ['Eşik enerjisi 2,48 eV olan metalden hangi ışık elektron söker?', 'Mor', 'Kırmızı', 'Eşik dalga boyu 1240 / 2,48 = 500 nm; ondan kısa dalga boylu mor söker.'],
    ['Fotoselde doyma akımını artırmak için ne yapılmalı?', 'Işık şiddetini artırmak', 'Ters gerilimi artırmak', 'Şiddetli ışık daha çok elektron söker; ters gerilim akımı azaltır.'],
    ['Otomatik musluklarda hangi olaydan yararlanılır?', 'Fotoelektrik olay', 'Compton saçılması', 'El, algılayıcıya gelen ışığı kesince fotosel akımı değişir ve musluk açılır.'],
  ]),
  'fzk12-compton': derle('fzk12-compton', [
    ['Compton saçılmasında saçılan fotonun dalga boyu gelen fotonunkinden büyüktür.', true, 'Foton enerjisinin bir kısmını elektrona verir; λ artar.'],
    ['Compton saçılmasından sonra foton ışık hızından daha yavaş hareket eder.', false, 'Foton hep c ile gider; azalan enerjisi dalga boyunun artmasında görülür.'],
    ['Compton olayında enerji ve momentum korunur.', true, 'Foton ile elektron bilardo topları gibi çarpışır.'],
    ['Fotoelektrik olayda foton saçılır, Compton olayında tamamen soğurulur.', false, 'Tersi doğru: fotoelektrikte foton soğurulur, Compton’da saçılır.'],
    ['Girişim ve kırınım ışığın dalga doğasıyla açıklanır.', true, 'Bu iki olay yalnız dalga modeliyle açıklanır.'],
    ['De Broglie’ye göre yalnız yüklü parçacıkların dalga boyu vardır.', false, 'Hareketli her parçacığın dalga boyu vardır: λ = h/(mv).'],
    ['Elektron kırınımı deneyi de Broglie hipotezini doğrulamıştır.', true, 'Davisson ve Germer elektronların kristalden kırındığını gözledi.'],
  ], [
    ['Hangisi ışığın tanecik doğasını gösterir?', 'Compton saçılması', 'Çift yarıkta girişim', 'Compton’da foton elektronla tanecik gibi çarpışır; girişim dalga doğasını gösterir.'],
    ['Saçılma açısı büyürse fotonun dalga boyundaki artış ne olur?', 'Büyür', 'Küçülür', 'Artış açıyla büyür; en büyük değer geri saçılmadadır.'],
    ['Aynı hızdaki elektron ve protondan hangisinin de Broglie dalga boyu büyüktür?', 'Elektron', 'Proton', 'λ = h/(mv); kütlesi küçük elektronun dalga boyu büyüktür.'],
    ['50 keV’luk foton elektrona 10 keV aktarırsa saçılan foton kaç keV olur?', '40 keV', '60 keV', 'Enerji korunur: 50 − 10 = 40 keV.'],
    ['Elektron mikroskobu neden çok küçük ayrıntıları gösterir?', 'Elektronun dalga boyu kısa', 'Elektronun yükü negatif', 'Ayırt edilebilen ayrıntı dalga boyuyla küçülür; elektronun dalga boyu ışığınkinden çok kısadır.'],
    ['Parçacığın hızı iki katına çıkarsa de Broglie dalga boyu ne olur?', 'Yarıya iner', 'İki katına çıkar', 'λ = h/(mv); hız iki katına çıkınca λ yarıya iner.'],
  ]),
  'fzk12-goruntuleme': derle('fzk12-goruntuleme', [
    ['Röntgende kemikler X ışınlarını yumuşak dokudan daha çok soğurur.', true, 'Bu yüzden filmde kemik açık, yumuşak doku koyu görünür.'],
    ['MR görüntülemede hastaya X ışını verilir.', false, 'MR manyetik alan ve radyo dalgasıyla çalışır.'],
    ['Ultrason görüntülemede dokulardan yansıyan ses dalgaları kullanılır.', true, 'Yankıların süresinden görüntü kurulur.'],
    ['PET’te pozitron-elektron yok oluşundan çıkan gama fotonları algılanır.', true, 'Zıt yönlü iki gama fotonu maddenin toplandığı yeri gösterir.'],
    ['Termal kamera yalnız aydınlık ortamda görüntü alabilir.', false, 'Cisimlerin kendi kızılötesi ışımasını algılar; karanlıkta da çalışır.'],
    ['LCD ekrandaki sıvı kristaller kendiliğinden ışık üretir.', false, 'Sıvı kristaller ışığın geçişini ayarlar; arkadan aydınlatma gerekir.'],
    ['Bilgisayarlı tomografi X ışınlarıyla vücudun kesit görüntüsünü oluşturur.', true, 'Farklı açılardan alınan X ışını görüntüleri bilgisayarda birleştirilir.'],
  ], [
    ['Gebelik takibinde hangi görüntüleme yöntemi tercih edilir?', 'Ultrason', 'Bilgisayarlı tomografi', 'Ultrason iyonlaştırıcı radyasyon kullanmaz; tomografi X ışınıyla çalışır.'],
    ['Suda ses 1500 m/s. Sonar yankısı 4 s sonra dönerse derinlik kaç m?', '3000 m', '6000 m', 'Ses gidip döner: d = v · t / 2 = 1500 · 4 / 2 = 3000 m.'],
    ['Radar dalgası 2 · 10⁻⁴ s sonra dönüyor. Uçak kaç km uzakta?', '30 km', '60 km', 'd = c · t / 2 = 3 · 10⁸ · 2 · 10⁻⁴ / 2 = 3 · 10⁴ m.'],
    ['MR’da sinyali hangi çekirdekler üretir?', 'Hidrojen çekirdekleri', 'Kemikteki kalsiyum çekirdekleri', 'Vücuttaki sudan gelen bol hidrojen çekirdekleri manyetik alanda hizalanıp sinyal verir.'],
    ['Plazma ekranda fosforu ne uyarır?', 'Morötesi ışık', 'X ışını', 'Plazmaya dönüşen gaz morötesi yayar; fosfor onu renkli ışığa çevirir.'],
    ['Hangi cihaz iyonlaştırıcı radyasyon kullanır?', 'Bilgisayarlı tomografi', 'MR', 'Tomografi X ışınıyla çalışır; MR’da iyonlaştırıcı radyasyon yoktur.'],
    ['Hücrelerin şeker tüketimini gösteren tarama hangisidir?', 'PET', 'Ultrason', 'PET’te şekere bağlı pozitron yayıcı madde, çok çalışan hücrelerde toplanır.'],
  ]),
  'fzk12-yari-iletken': derle('fzk12-yari-iletken', [
    ['Yarı iletkenlerin iletkenliği sıcaklık artınca artar.', true, 'Isı daha çok elektronu iletim bandına çıkarır.'],
    ['p tipi yarı iletkende çoğunluk yük taşıyıcıları elektronlardır.', false, 'p tipinde boşluklar çoğunluktadır; elektron fazlası n tipindedir.'],
    ['Diyot akımı yalnız bir yönde geçirir.', true, 'İleri yönde geçirir, ters yönde geçirmez.'],
    ['Transistör küçük bir akımla büyük bir akımı denetleyebilir.', true, 'Yükselteç ve anahtar olarak kullanılır.'],
    ['LED’de ışık, elektronlar boşluklarla birleşirken açığa çıkar.', true, 'Aradaki enerji farkı foton olarak salınır.'],
    ['Güneş pilleri gece de gündüzkü güçle elektrik üretir.', false, 'Işık olmadan elektron-boşluk çifti oluşmaz; gece üretim yoktur.'],
    ['Saf yarı iletkene çok az katkı eklemek iletkenliği değiştirmez.', false, 'Çok az katkı bile iletkenliği büyük ölçüde artırır.'],
  ], [
    ['Alternatif akımı doğru akıma çevirmede hangi eleman kullanılır?', 'Diyot', 'Transformatör', 'Diyot akımı tek yönde geçirir; transformatör yalnız gerilimi değiştirir.'],
    ['Bor eklenmiş silisyum hangi tip yarı iletkendir?', 'p tipi', 'n tipi', 'Bor 3 değerliklidir; boşluk fazlası oluşturur.'],
    ['Hangi renkteki LED’in yasak enerji aralığı daha büyüktür?', 'Mavi', 'Kırmızı', 'Mavi fotonun enerjisi kırmızınınkinden büyüktür; aralık da büyük olmalı.'],
    ['Güneş pilinde düşen ışık neyi oluşturur?', 'Elektron-boşluk çifti', 'Proton-nötron çifti', 'Foton bir elektronu iletim bandına çıkarır, geride boşluk kalır.'],
    ['Güneş panelinin akımını ev aletine uygun hâle ne getirir?', 'Evirici', 'Diyot', 'Panel doğru akım verir; evirici (inverter) onu alternatif akıma çevirir.'],
    ['İşlemcilerde 0 ve 1’leri işleyen eleman hangisidir?', 'Transistör', 'Direnç', 'Milyarlarca transistör anahtar gibi açılıp kapanarak veriyi işler.'],
    ['LED’in akkor ampule üstünlüğü nedir?', 'Daha az ısıyla daha çok ışık', 'Daha yüksek gerilim istemesi', 'LED enerjinin çoğunu ışığa çevirir; akkor ampul çoğunu ısı olarak harcar.'],
  ]),
  'fzk12-super-iletken': derle('fzk12-super-iletken', [
    ['Süper iletken, kritik sıcaklığın altında sıfır dirençle akım iletir.', true, 'Direnç kritik sıcaklıkta birden sıfıra düşer.'],
    ['Süper iletkenlik ilk kez oda sıcaklığında gözlenmiştir.', false, 'Onnes 1911’de cıvada yaklaşık 4 K’de gözledi.'],
    ['Süper iletken manyetik alanı içinden dışarı iter.', true, 'Bu Meissner etkisidir.'],
    ['Süper iletken bobinden akım geçerken ısı kaybı olur.', false, 'Direnç sıfır olduğu için ısı kaybı yoktur.'],
    ['Bazı seramikler sıvı azot sıcaklığında süper iletken olabilir.', true, '1986 sonrası bulunan seramik oksitler 77 K’nin üstünde süper iletkendir.'],
  ], [
    ['Süper iletkenliği ilk gözleyen bilim insanı kimdir?', 'Kamerlingh Onnes', 'Albert Einstein', 'Onnes 1911’de cıvanın direncinin çok düşük sıcaklıkta yok olduğunu buldu.'],
    ['Maglev trenleri neden çok hızlı gidebilir?', 'Rayla sürtünme yok', 'Daha ağır oldukları için', 'Süper iletken mıknatıslar treni raydan kaldırır; sürtünme ortadan kalkar.'],
    ['Süper iletken mıknatıslar hangi tıbbi cihazda kullanılır?', 'MR', 'Röntgen', 'MR’ın güçlü manyetik alanı süper iletken bobinlerle üretilir.'],
    ['Süper iletkenlerin yaygınlaşmasının önündeki engel nedir?', 'Soğutma maliyeti', 'Dirençlerinin yüksek olması', 'Direnç sıfırdır; sorun, maddeyi kritik sıcaklığın altında tutmanın maliyetidir.'],
  ]),
  'fzk12-nano': derle('fzk12-nano', [
    ['1 nanometre, metrenin milyarda biridir.', true, '1 nm = 10⁻⁹ m.'],
    ['Bir madde nano boyuta indirildiğinde özellikleri hiç değişmez.', false, 'Renk, erime noktası, iletkenlik ve etkinlik değişebilir.'],
    ['Nilüfer yaprağının suyu itmesi yüzeyindeki nanoyapılarla ilgilidir.', true, 'Nano çıkıntılar suyun yüzeye tutunmasını engeller.'],
    ['Grafen tek atom kalınlığında bir karbon tabakasıdır.', true, 'Çok sağlamdır, elektriği ve ısıyı çok iyi iletir.'],
    ['Kelebek kanatlarının bütün renkleri yalnız boyar maddeden gelir.', false, 'Bazı renkler nanoyapıların ışığı yansıtmasından doğar.'],
  ], [
    ['Nanobilim hangi boyut aralığındaki yapıları inceler?', '1–100 nm', '1–100 mm', 'Nano ölçek 1 ile 100 nanometre arasıdır.'],
    ['Gekoların duvara tutunmasını ne sağlar?', 'Ayaklarındaki nano tüyler', 'Ayaklarındaki yapışkan sıvı', 'Milyonlarca nano tüy yüzeyle çok sayıda zayıf bağ kurar; yapışkan yoktur.'],
    ['Leke tutmayan kumaşlar hangi alanın ürünüdür?', 'Nanoteknoloji', 'Süper iletkenlik', 'Kumaş liflerindeki nano kaplamalar suyu ve kiri iter.'],
    ['Atomları tek tek düzenleme fikrini 1959’da ortaya atan fizikçi kimdir?', 'Richard Feynman', 'Max Planck', 'Feynman’ın 1959 konuşması nanoteknolojinin başlangıcı sayılır.'],
    ['Nanoparçacıklar neden kimyasal olarak daha etkindir?', 'Yüzeyleri hacme göre büyük', 'Kütleleri daha büyük', 'Atomların çoğu yüzeyde olduğu için tepkimeye girebilen yüzey büyüktür.'],
  ]),
  'fzk12-laser': derle('fzk12-laser', [
    ['Uyarılmış ışımada çıkan foton gelen fotonla aynı enerjide ve aynı yöndedir.', true, 'Aynı fazda, ikiz bir foton doğar.'],
    ['Laser ışığı birçok farklı dalga boyundan oluşur.', false, 'Laser ışığı tek renkli, yani tek dalga boyludur.'],
    ['Laser için üst seviyedeki atom sayısı alttakinden fazla olmalıdır.', true, 'Bu nüfus terslenmesidir; pompalamayla sağlanır.'],
    ['Laser demeti uzaklara giderken ampul ışığı kadar dağılır.', false, 'Laser paraleldir, çok az dağılır.'],
    ['Laser işaretçiyi göze tutmak retinaya kalıcı zarar verebilir.', true, 'Göz merceği demeti retinada küçük bir noktaya odaklar.'],
    ['İlk laseri 1900’lerin başında Einstein yapmıştır.', false, 'Einstein uyarılmış ışımayı 1917’de öngördü; ilk laseri 1960’ta Maiman yaptı.'],
  ], [
    ['Laser ışığında dalgaların aynı fazda olmasına ne denir?', 'Eş fazlılık', 'Kırınım', 'Uyarılmış ışımada doğan fotonlar aynı fazdadır; ışık eş fazlıdır.'],
    ['Laserde pompalamanın amacı nedir?', 'Nüfus terslenmesi sağlamak', 'Işığı soğutmak', 'Dışarıdan verilen enerji atomların çoğunu üst seviyeye çıkarır.'],
    ['Laserin iki ucundaki aynaların görevi nedir?', 'Işığı ileri geri yansıtıp yükseltmek', 'Işığı renklerine ayırmak', 'Aynalar arasında gidip gelen fotonlar yeni uyarılmış ışımalar doğurur.'],
    ['Dünya–Ay uzaklığının laserle ölçülmesini hangi özellik sağlar?', 'Çok az dağılması', 'Çok renkli olması', 'Paralel demet yüz binlerce kilometre sonra bile dar kalır.'],
    ['Hangisi laserin tıbbi kullanımıdır?', 'Göz ameliyatı', 'Röntgen çekimi', 'Röntgen X ışını tüpüyle çekilir; laser göz cerrahisinde kullanılır.'],
  ]),
}
