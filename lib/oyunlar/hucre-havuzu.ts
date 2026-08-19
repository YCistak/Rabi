/**
 * Organel Kartı oyununun havuzu.
 *
 * Her satır bir organel ve onu tarif eden **üç ipucu**. İpuçlarının sırası
 * rastgele değil: birincisi birkaç organele birden uyar, ikincisi alanı
 * daraltır, üçüncüsü tek bir cevabı gösterir. Oyunun puanı da buna dayanıyor —
 * erken bilmek çok puan, geç bilmek az puan getiriyor. Sıra bozulursa oyunun
 * ölçtüğü şey bozulur.
 *
 * İpuçları organelin ağzından yazılıyor ("çift zarlıyım"): kart arkası dönük
 * duruyor ve ipuçlarını o veriyor.
 *
 * Kapsam 9. sınıf "Hücre" ünitesi. Hücre zarı ve hücre duvarı organel değil ama
 * havuzda: ünite onları da anlatıyor ve şıklarda birlikte geçiyorlar.
 */

import type { Zorluk } from './ritim'

export type OrganelSorusu = {
  /** Kartın arkasındaki cevap — şıklarda da bu ad görünüyor. */
  organel: string
  /** Üç ipucu; belirsizden belirgine sıralı. */
  ipuclari: [string, string, string]
  /** Tur sonunda yanlışın altında görünen kısa öğretici not. */
  aciklama: string
  zorluk: Zorluk
}

export const HUCRE_HAVUZU: readonly OrganelSorusu[] = [
  {
    organel: 'Mitokondri',
    ipuclari: [
      'Çift zarlıyım; kendi DNA’m ve kendi ribozomum var.',
      'İç zarım kıvrımlar yaparak yüzeyimi artırır.',
      'Oksijenli solunumun büyük kısmı bende olur, hücrenin ATP’sini ben üretirim.',
    ],
    aciklama:
      'Enerji ihtiyacı yüksek hücrelerde (kas, karaciğer) sayısı artar. Çift zarlı ve kendi DNA’sı olan iki organelden biridir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Ribozom',
    ipuclari: [
      'Zarsızım ve istisnasız bütün hücrelerde bulunurum.',
      'İki alt birimden oluşurum; ancak birleşince çalışırım.',
      'Protein sentezi bende yapılır.',
    ],
    aciklama:
      'Prokaryot hücrelerde bulunan tek organeldir. Alt birimleri çekirdekçikte üretilir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Kloroplast',
    ipuclari: [
      'Çift zarlıyım; kendi DNA’m ve ribozomum var.',
      'Yalnızca bitki ve alg hücrelerinde bulunurum.',
      'Klorofil taşırım, fotosentez bende gerçekleşir.',
    ],
    aciklama:
      'Plastitlerdendir. Işık enerjisini kimyasal enerjiye çevirerek besin üretir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Çekirdek',
    ipuclari: [
      'Çift zarlıyım ve zarımın üstünde porlar var.',
      'İçimde kalıtım maddesi bulunur.',
      'Hücrenin yönetim merkeziyim; prokaryot hücrelerde bulunmam.',
    ],
    aciklama:
      'Porları sayesinde sitoplazmayla madde alışverişi yapar. DNA’yı taşıdığı için bölünmeyi ve sentezi yönetir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Hücre zarı',
    ipuclari: [
      'Bütün hücrelerde bulunurum.',
      'Yapımda yağ ve protein var; akıcı mozaik modeliyle açıklanırım.',
      'Seçici geçirgenim: hücreye neyin girip çıkacağına ben karar veririm.',
    ],
    aciklama:
      'Canlı ve seçici geçirgendir. Hücreyi dış ortamdan ayırır, madde alışverişini ve iletişimi sağlar.',
    zorluk: 'kolay',
  },
  {
    organel: 'Koful',
    ipuclari: [
      'Tek zarlı bir keseyim.',
      'Madde depolar, atıkları ve fazla suyu içimde tutarım.',
      'Bitki hücrelerinde tek ve çok büyüğüm; tatlı su canlılarında kasılarak fazla suyu dışarı atarım.',
    ],
    aciklama:
      'Genç bitki hücrelerinde küçük ve çok sayıda, yaşlı hücrelerde birleşerek tek ve büyüktür.',
    zorluk: 'kolay',
  },
  {
    organel: 'Hücre duvarı',
    ipuclari: [
      'Cansızım ve tam geçirgenim.',
      'Hayvan hücrelerinde bulunmam.',
      'Bitkide selülozdan, mantarda kitinden yapılırım; hücreye şekil ve dayanıklılık veririm.',
    ],
    aciklama:
      'Hücre zarının dışındadır. Cansız olduğu için madde geçişini seçemez, gelen her şeyi geçirir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Lizozom',
    ipuclari: [
      'Tek zarlı bir keseyim.',
      'İçim sindirim enzimiyle dolu; beni golgi üretir.',
      'Zarım yırtılırsa hücreyi kendi kendine sindiririm; bu yüzden bana “intihar kesesi” denir.',
    ],
    aciklama:
      'Hücre içi sindirimden sorumludur. Yaşlanmış organelleri ve dışarıdan alınan büyük molekülleri parçalar.',
    zorluk: 'orta',
  },
  {
    organel: 'Golgi cisimciği',
    ipuclari: [
      'Üst üste dizilmiş yassı keselerden oluşuyorum.',
      'Bana gelen maddeleri işler, paketler ve gideceği yere gönderirim.',
      'Salgı yapan hücrelerde sayım artar; lizozomu da ben oluştururum.',
    ],
    aciklama:
      'Endoplazmik retikulumdan gelen protein ve yağları işler; salgı kesecikleri hâlinde hücre dışına gönderir.',
    zorluk: 'orta',
  },
  {
    organel: 'Granüllü endoplazmik retikulum',
    ipuclari: [
      'Hücre içinde kanal ve keselerden oluşan bir ağım.',
      'Yüzeyimde ribozomlar olduğu için pürtüklü görünürüm.',
      'Ribozomda üretilen proteinleri taşır ve golgiye gönderirim.',
    ],
    aciklama:
      'Protein sentezi ve taşınmasıyla ilgilidir; salgı üreten hücrelerde bol bulunur.',
    zorluk: 'orta',
  },
  {
    organel: 'Sentrozom',
    ipuclari: [
      'Zarsızım ve hücre bölünmesiyle ilgiliyim.',
      'Bitki hücrelerinde bulunmam, hayvan hücrelerinde varım.',
      'Bölünme sırasında iğ ipliklerini ben oluştururum.',
    ],
    aciklama:
      'Birbirine dik iki sentriyolden oluşur. Bölünmede kromozomların kutuplara çekilmesini sağlar.',
    zorluk: 'orta',
  },
  {
    organel: 'Çekirdekçik',
    ipuclari: [
      'Çekirdeğin içindeyim ve zarsızım.',
      'RNA ile protein bakımından zenginim.',
      'Ribozomun alt birimleri bende üretilir.',
    ],
    aciklama:
      'Bölünme başlarken kaybolur, bölünme bitince yeniden oluşur. Protein sentezi hızlı olan hücrelerde belirgindir.',
    zorluk: 'orta',
  },
  {
    organel: 'Granülsüz endoplazmik retikulum',
    ipuclari: [
      'Kanallardan oluşuyorum ama yüzeyim düzgün.',
      'Yağ ve karbonhidrat sentezi bende yapılır.',
      'Karaciğer hücrelerinde ilaç ve alkol gibi zararlı maddeleri etkisizleştiririm.',
    ],
    aciklama:
      'Üzerinde ribozom yoktur. Yağ sentezi, kalsiyum depolanması ve zehirlerin etkisizleştirilmesinde görevlidir.',
    zorluk: 'zor',
  },
  {
    organel: 'Peroksizom',
    ipuclari: [
      'Tek zarlı, küçük bir keseyim.',
      'Karaciğer ve böbrek hücrelerinde çok bulunurum.',
      'Katalaz enzimimle hidrojen peroksiti su ve oksijene parçalarım.',
    ],
    aciklama:
      'Hücrede biriken hidrojen peroksit zehirlidir; peroksizom onu zararsız hâle getirir.',
    zorluk: 'zor',
  },
  {
    organel: 'Kromoplast',
    ipuclari: [
      'Bitki hücrelerindeki plastitlerden biriyim.',
      'Renk veririm ama fotosentez yapmam.',
      'Havucun turuncusu, domatesin kırmızısı bendeki pigmentlerden gelir.',
    ],
    aciklama:
      'Karoten (turuncu), ksantofil (sarı) ve likopen (kırmızı) gibi pigmentleri taşır; böceklerin çiçeğe gelmesini sağlar.',
    zorluk: 'zor',
  },
  {
    organel: 'Lökoplast',
    ipuclari: [
      'Renksiz bir plastitim.',
      'Bitkinin ışık almayan kök, yumru ve tohum gibi yerlerinde bulunurum.',
      'Nişasta, yağ ve protein depolarım; patatesteki nişasta bende durur.',
    ],
    aciklama:
      'Işık aldığında kloroplasta dönüşebilir; patatesin yeşermesinin sebebi budur.',
    zorluk: 'zor',
  },
]

export const HUCRE_BOYUTU = HUCRE_HAVUZU.length
