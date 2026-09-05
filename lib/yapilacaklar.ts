/**
 * Yapılacaklar tahtası — not kâğıtlarının saf mantığı.
 *
 * Ekranda duran şey bir liste değil, üstüne kâğıt yapıştırılan bir tahta:
 * kâğıtlar istenen yere sürükleniyor. Sıralı bir liste yerine bunu seçmenin
 * sebebi günün kendisinin sıralı olmaması — "akşam etüt" ile "kitap götür"
 * arasında bir sıra yok, ama kullanıcının kafasındaki yerleşim var. Konum
 * kullanıcının verdiği bilgi; onu bir listeye düzleştirmek bilgiyi atmak olurdu.
 *
 * ## Konum neden oran olarak duruyor
 *
 * `x` ve `y` piksel değil, 0–1 arası **oran**. Telefon ekranları farklı
 * genişlikte; piksel yazılsaydı yedeğini başka telefona taşıyan kullanıcının
 * kâğıtları tahtanın dışına kaçardı. Oran, kâğıdın sığdığı boşluğa göre
 * ölçülüyor: 0 sola/üste yaslı, 1 sağa/alta yaslı. Kâğıdın kendi boyutu
 * hesaba girmiyor, o yüzden burada ekran ölçüsü bilinmek zorunda değil.
 */

export type NotRengi = 'sari' | 'pembe' | 'mavi' | 'yesil' | 'mor'

export type NotKagidi = {
  id: string
  metin: string
  renk: NotRengi
  /** Yatay konum, 0 (sola yaslı) – 1 (sağa yaslı). */
  x: number
  /** Dikey konum, 0 (üste yaslı) – 1 (alta yaslı). */
  y: number
  /** Üstü çizili mi — kâğıdı silmeden "bitti" demenin yolu. */
  bitti: boolean
  /**
   * Kâğıdın ait olduğu gün ('YYYY-AA-GG', **yerel** saat).
   *
   * Tahta günlük: gün dönünce kâğıtlar temizleniyor (`gununNotlari`). Tarih
   * ISO damgası değil yerel gün, çünkü "bugün" kullanıcının takvimindeki gün;
   * `toISOString` UTC'ye kaydırdığı için gece yarısına yakın yazılan kâğıt
   * daha yazıldığı anda dünün kâğıdı sayılırdı.
   */
  gun: string
}

/**
 * Tahtaya sığan en fazla kâğıt.
 *
 * Sınır tahtanın kendisinden geliyor: kâğıtlar üst üste binmeye başladıktan
 * sonra tahta okunmaz oluyor ve "her şeyi buraya yaz" diyen bir araç,
 * yapılacaklar listesi olmaktan çıkıp ikinci bir kaygı kaynağına dönüşüyor.
 */
export const EN_COK_NOT = 10

/**
 * Bir kâğıda yazılabilecek en fazla karakter.
 *
 * Kâğıt sabit boyutta duruyor; uzun metin ya taşar ya da okunmayacak kadar
 * küçülür. Sınır, kâğıdın kendi boyutunun sözle söylenmiş hâli.
 */
export const EN_UZUN_NOT = 280

/** Renk sırası — yeni kâğıt sıradaki rengi alıyor, hepsi aynı olmasın diye. */
export const NOT_RENKLERI: readonly NotRengi[] = ['sari', 'pembe', 'mavi', 'yesil', 'mor']

/** Kâğıtların ilk yerleştiği ızgara — iki sütun, beş satır. */
const SUTUN_SAYISI = 2
const SATIR_SAYISI = EN_COK_NOT / SUTUN_SAYISI

/**
 * Yeni kâğıdın konumu.
 *
 * Önce köşegen bir basamaktı ve beşte bir başa dönüyordu: altıncı kâğıt
 * birincinin üstüne oturuyor, tahta dolduğunda kâğıtlar okunmuyordu. Izgara
 * `EN_COK_NOT` kadar ayrı yer tanımlıyor, yani sınıra kadar hiçbir kâğıt
 * bir başkasının üstüne düşmüyor. Kullanıcı hepsini yine istediği yere
 * taşıyabiliyor; burası yalnızca **ilk** yer.
 */
export function yeniKonum(sira: number): { x: number; y: number } {
  const yer = ((sira % EN_COK_NOT) + EN_COK_NOT) % EN_COK_NOT
  return {
    // Kenar payı: 0 ile 1 tahtaya yapışık demek ve kâğıt yuvarlak köşeye
    // dayanıyordu. Pay yatayda daha büyük, çünkü iki sütun yan yana sığıyor.
    x: serit(yer % SUTUN_SAYISI, SUTUN_SAYISI, 0.06),
    y: serit(Math.floor(yer / SUTUN_SAYISI), SATIR_SAYISI, 0.03),
  }
}

/** `adet` yeri kenar payını koruyarak 0–1 aralığına eşit dağıtır. */
function serit(indeks: number, adet: number, kenar: number): number {
  if (adet <= 1) return 0.5
  return kenar + (indeks * (1 - 2 * kenar)) / (adet - 1)
}

/** Sıradaki renk — art arda eklenen kâğıtlar farklı renk alıyor. */
export function siradakiRenk(sira: number): NotRengi {
  return NOT_RENKLERI[sira % NOT_RENKLERI.length]
}

/** Konumu tahtanın içinde tutar. */
export function konumuSinirla(deger: number): number {
  if (!Number.isFinite(deger)) return 0
  return Math.min(1, Math.max(0, deger))
}

/**
 * İki kâğıdın arasında kalması gereken en az pay (oran).
 *
 * Üst üste binmek serbest: tahtadaki yerleşim kullanıcının kurduğu gruplama ve
 * iki kâğıdın köşe köşe değmesi de o bilginin parçası. Yasak olan **tam
 * örtüşme** — altta kalan kâğıt hiç görünmüyorsa okunamıyor, tutulamıyor ve
 * kullanıcı onu kaybettiğini sanıyor.
 *
 * Ölçü tahtanın kendi oran uzayında: `EN_AZ_PAY_X` bir kâğıdın yanından,
 * `EN_AZ_PAY_Y` üstünden görünecek şeridin genişliği. Dikey pay tesadüfi değil,
 * kâğıdın **tutma şeridi** kadar (700 piksellik tahtada ~45 piksel): altta
 * kalan kâğıt yalnızca görünür değil, aynı zamanda tutulup çekilebilir kalıyor.
 * Yatay pay daha büyük, çünkü kâğıt yatayda tahtanın yarısı kadar yer kaplıyor.
 */
export const EN_AZ_PAY_X = 0.12
export const EN_AZ_PAY_Y = 0.08

/**
 * Aday konumların tarandığı ızgaranın yarıçapı (adım sayısı).
 *
 * Adım payın kendisi kadar, yani `1 / EN_AZ_PAY_Y` ≈ 13 adım tahtanın bir
 * ucundan ötekine yetiyor. Kâğıt sayısı ondan fazla olamadığı için tarama her
 * zaman boş bir yer buluyor.
 */
const ARAMA_YARICAPI = 13

/** İki konum birbirini tümüyle kapatıyor mu — çakışma **iki eksende birden**. */
function cakisirMi(ax: number, ay: number, bx: number, by: number): boolean {
  return Math.abs(ax - bx) < EN_AZ_PAY_X && Math.abs(ay - by) < EN_AZ_PAY_Y
}

/**
 * Konumu, hiçbir kâğıdı tümüyle kapatmayacak **en yakın** yere çeker.
 *
 * Bırakılan yer boşsa hiç dokunulmuyor: kullanıcı kâğıdı nereye koyduysa oraya
 * oturuyor ve tek eksende yaklaşmak serbest — kâğıdın öbür kenarı açıkta
 * kalıyor. Yalnızca iki eksende birden payın altına inen konum taşınıyor.
 *
 * Çakışan kâğıdın karşı yönüne itmek yerine ızgara taranıyor: itme, ikinci bir
 * kâğıda çarpıp geri dönebiliyor ve kalabalık bir tahtada hiç durulmuyordu.
 * Tarama bırakılan noktanın çevresinden dışa doğru gidiyor, yani bulunan yer
 * hep parmağın kalktığı yere en yakın boşluk oluyor.
 */
export function ayrikKonum(
  notlar: readonly NotKagidi[],
  id: string,
  x: number,
  y: number,
): { x: number; y: number } {
  const hedefX = konumuSinirla(x)
  const hedefY = konumuSinirla(y)
  const otekiler = notlar.filter((n) => n.id !== id)
  const bosMu = (px: number, py: number) =>
    !otekiler.some((n) => cakisirMi(px, py, n.x, n.y))

  if (bosMu(hedefX, hedefY)) return { x: hedefX, y: hedefY }

  const adaylar: { x: number; y: number; uzaklik: number }[] = []
  for (let i = -ARAMA_YARICAPI; i <= ARAMA_YARICAPI; i++) {
    for (let j = -ARAMA_YARICAPI; j <= ARAMA_YARICAPI; j++) {
      if (i === 0 && j === 0) continue
      const ax = konumuSinirla(hedefX + i * EN_AZ_PAY_X)
      const ay = konumuSinirla(hedefY + j * EN_AZ_PAY_Y)
      adaylar.push({ x: ax, y: ay, uzaklik: (ax - hedefX) ** 2 + (ay - hedefY) ** 2 })
    }
  }
  adaylar.sort((a, b) => a.uzaklik - b.uzaklik)

  const uygun = adaylar.find((a) => bosMu(a.x, a.y))
  // Boş yer yoksa kâğıt bırakıldığı yerde kalıyor: dokunuşu yok saymak,
  // kâğıdı bir başkasının altına gizlemekten daha kötü.
  return uygun ? { x: uygun.x, y: uygun.y } : { x: hedefX, y: hedefY }
}

/**
 * Kayıttan okunan tahtayı güncel şemaya uydurur.
 *
 * `localStorage` elle kurcalanabiliyor ve eski sürümde olmayan bir alan
 * (`bitti` gibi) eski kayıtlarda yok. Eksik alan `undefined` kalsaydı kâğıt
 * çizilirken çökerdi; taşan konum ise kâğıdı tahtanın dışına atardı. Sınırı
 * aşan kâğıtlar da burada eleniyor — kayıt şişse bile tahta okunur kalıyor.
 */
export function notlariNormalize(ham: unknown): NotKagidi[] {
  if (!Array.isArray(ham)) return []
  const notlar: NotKagidi[] = []
  for (const kayit of ham) {
    if (typeof kayit !== 'object' || kayit === null) continue
    const n = kayit as Partial<NotKagidi>
    if (typeof n.id !== 'string' || n.id === '') continue
    notlar.push({
      id: n.id,
      metin: typeof n.metin === 'string' ? n.metin.slice(0, EN_UZUN_NOT) : '',
      renk: NOT_RENKLERI.includes(n.renk as NotRengi)
        ? (n.renk as NotRengi)
        : siradakiRenk(notlar.length),
      x: konumuSinirla(typeof n.x === 'number' ? n.x : 0),
      y: konumuSinirla(typeof n.y === 'number' ? n.y : 0),
      bitti: n.bitti === true,
      // Günü olmayan kayıt eski sürümden kalmış demek; `gununNotlari` onu
      // bugüne ait saymayıp temizliyor. Tahta zaten günlük, doğru davranış bu.
      gun: typeof n.gun === 'string' ? n.gun : '',
    })
    if (notlar.length >= EN_COK_NOT) break
  }
  return notlar
}

/** Tahtada yer var mı. */
export function yerVarMi(notlar: readonly NotKagidi[]): boolean {
  return notlar.length < EN_COK_NOT
}

/**
 * Yeni kâğıt.
 *
 * Tahta doluysa `null`: çağıran taraf "olmadı" durumunu tek yerden okusun,
 * sessizce en eski kâğıt silinmesin. Kâğıdı silmek kullanıcının kararı.
 */
export function notEkle(
  notlar: readonly NotKagidi[],
  id: string,
  gun: string,
): NotKagidi[] | null {
  if (!yerVarMi(notlar)) return null
  // Izgara yeri kâğıtlar taşınmışsa dolu olabiliyor; yeni kâğıt hiçbirini
  // kapatmayacak en yakın boşluğa oturuyor.
  const ilk = yeniKonum(notlar.length)
  const { x, y } = ayrikKonum(notlar, id, ilk.x, ilk.y)
  return [
    ...notlar,
    { id, metin: '', renk: siradakiRenk(notlar.length), x, y, bitti: false, gun },
  ]
}

/**
 * Tahtayı güne indirger — dünün kâğıtları kalmıyor.
 *
 * Yapılacaklar günlük bir şey: dün yazdığı "kimya tekrarı"nı bugün de tahtada
 * gören kullanıcı, biriken ve hiç bitmeyen bir listeye bakıyor demektir. Kâğıt
 * silmek zaten kullanıcının kararı, ama **günün sonu** ayrı bir karar değil;
 * tahtanın kendisi o gün için kuruluyor.
 *
 * Saf tutuldu ve "bugün"ü dışarıdan alıyor: takvim saatine bakan bir mantık
 * test edilemezdi ve gece yarısını beklemek gerekirdi.
 */
export function gununNotlari(notlar: readonly NotKagidi[], bugun: string): NotKagidi[] {
  return notlar.filter((n) => n.gun === bugun)
}

export function notSil(notlar: readonly NotKagidi[], id: string): NotKagidi[] {
  return notlar.filter((n) => n.id !== id)
}

/** Tek kâğıdı günceller; kimlik tutmuyorsa liste olduğu gibi dönüyor. */
function notuDegistir(
  notlar: readonly NotKagidi[],
  id: string,
  degisiklik: (not: NotKagidi) => NotKagidi,
): NotKagidi[] {
  return notlar.map((n) => (n.id === id ? degisiklik(n) : n))
}

export function notYaz(notlar: readonly NotKagidi[], id: string, metin: string): NotKagidi[] {
  return notuDegistir(notlar, id, (n) => ({ ...n, metin: metin.slice(0, EN_UZUN_NOT) }))
}

export function notTasi(
  notlar: readonly NotKagidi[],
  id: string,
  x: number,
  y: number,
): NotKagidi[] {
  const konum = ayrikKonum(notlar, id, x, y)
  return notuDegistir(notlar, id, (n) => ({ ...n, ...konum }))
}

export function notuIsaretle(notlar: readonly NotKagidi[], id: string): NotKagidi[] {
  return notuDegistir(notlar, id, (n) => ({ ...n, bitti: !n.bitti }))
}

/**
 * Kâğıdı yığının en üstüne alır.
 *
 * Sürüklenen kâğıt öne gelmeli, yoksa üstüne binen kâğıdın altında kalır ve
 * kullanıcı taşıdığı şeyi göremez. Ayrı bir `z` alanı yerine dizideki sıra
 * kullanılıyor: iki kaynak olsaydı biri ötekiyle çelişebilirdi.
 */
export function oneAl(notlar: readonly NotKagidi[], id: string): NotKagidi[] {
  const not = notlar.find((n) => n.id === id)
  if (!not || notlar[notlar.length - 1]?.id === id) return [...notlar]
  return [...notlar.filter((n) => n.id !== id), not]
}

/** Bitmemiş kâğıt sayısı — başlıktaki sayı. */
export function kalanIs(notlar: readonly NotKagidi[]): number {
  return notlar.filter((n) => !n.bitti).length
}
