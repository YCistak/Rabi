import * as ort from 'onnxruntime-web/wasm'
import { ctcCoz, kutulariBul, okumalariSirala } from './ocr-cozum'

// Tek iş parçacığı Android WebView'in paylaşımlı bellek iznine ihtiyaç duymaz.
ort.env.wasm.numThreads = 1
ort.env.wasm.wasmPaths = new URL('/ocr/', self.location.origin).href
ort.env.logLevel = 'error'

function bildirim(metin: string) { self.postMessage({ tur: 'ilerleme', metin }) }

function dondur(resim: ImageBitmap, yon: 1 | -1): OffscreenCanvas {
  const tuval = new OffscreenCanvas(resim.height, resim.width)
  const cizim = tuval.getContext('2d')!
  if (yon === 1) {
    cizim.translate(0, resim.width)
    cizim.rotate(-Math.PI / 2)
  } else {
    cizim.translate(resim.height, 0)
    cizim.rotate(Math.PI / 2)
  }
  cizim.drawImage(resim, 0, 0)
  return tuval
}

function tensoreCevir(resim: ImageData, tespit: boolean): ort.Tensor {
  const { width: en, height: boy, data } = resim
  const alan = en * boy
  const veri = new Float32Array(alan * 3)
  const ortalama = [0.485, 0.456, 0.406], sapma = [0.229, 0.224, 0.225]
  for (let i = 0; i < alan; i++) for (let kanal = 0; kanal < 3; kanal++) {
    const deger = data[i*4+kanal] / 255
    veri[kanal*alan+i] = tespit ? (deger-ortalama[kanal])/sapma[kanal] : (deger-0.5)/0.5
  }
  return new ort.Tensor('float32', veri, [1,3,boy,en])
}

self.onmessage = async (olay: MessageEvent<{ fotograf: Blob }>) => {
  let resim: ImageBitmap | undefined
  let tespit: ort.InferenceSession | undefined, tani: ort.InferenceSession | undefined
  try {
    bildirim('Okuma hazırlanıyor…')
    resim = await createImageBitmap(olay.data.fotograf, { imageOrientation: 'from-image' })
    tespit = await ort.InferenceSession.create('/ocr/yazi-bul.onnx', { executionProviders: ['wasm'] })
    tani = await ort.InferenceSession.create('/ocr/satir-tani.onnx', { executionProviders: ['wasm'] })
    const cevap = await fetch('/ocr/karakterler.txt')
    if (!cevap.ok) throw new Error('Karakterler yüklenemedi')
    const karakterler = ['', ...(await cevap.text()).split('\n').filter(Boolean), ' ']
    let enIyi = { metin: '', isaret: 0 }
    for (const yon of [0, 1, -1] as const) {
      const kaynak = yon === 0 ? resim : dondur(resim, yon)
      const oran = Math.min(1, 960 / Math.max(kaynak.width, kaynak.height))
      const en = Math.max(32, Math.round(kaynak.width*oran/32)*32)
      const boy = Math.max(32, Math.round(kaynak.height*oran/32)*32)
      const tuval = new OffscreenCanvas(en,boy)
      const cizim = tuval.getContext('2d', { willReadFrequently: true })!
      cizim.drawImage(kaynak,0,0,en,boy)
      bildirim(yon === 0 ? 'Yazı satırları bulunuyor…' : 'Kâğıdın yönü kontrol ediliyor…')
      const girdi = tensoreCevir(cizim.getImageData(0,0,en,boy), true)
      const sonuc = await tespit.run({ [tespit.inputNames[0]]: girdi })
      const harita = sonuc[tespit.outputNames[0]]
      const haritaBoy = Number(harita.dims.at(-2)), haritaEn = Number(harita.dims.at(-1))
      const kutular = kutulariBul(harita.data as Float32Array, haritaEn, haritaBoy)
      const okumalar = []
      for (const [sira, kutu] of kutular.entries()) {
        bildirim(`Satırlar okunuyor… ${sira+1}/${kutular.length}`)
        const sol = kutu.sol/haritaEn*kaynak.width, ust = kutu.ust/haritaBoy*kaynak.height
        const genislik = (kutu.sag-kutu.sol)/haritaEn*kaynak.width
        const yukseklik = (kutu.alt-kutu.ust)/haritaBoy*kaynak.height
        const kirpikEn = Math.max(16, Math.ceil(48*genislik/yukseklik))
        if (kirpikEn > 1600) continue
        const kirpik = new OffscreenCanvas(kirpikEn,48)
        const kalem = kirpik.getContext('2d')!
        kalem.drawImage(kaynak,sol,ust,genislik,yukseklik,0,0,kirpikEn,48)
        const veri = await tani.run({ [tani.inputNames[0]]: tensoreCevir(kalem.getImageData(0,0,kirpikEn,48),false) })
        const olasilik = veri[tani.outputNames[0]]
        if (olasilik.dims.at(-1) !== karakterler.length) throw new Error('Model ve karakterler uyuşmuyor')
        const okuma = ctcCoz(olasilik.data as Float32Array, karakterler.length, karakterler)
        if (okuma.guven >= 0.65 && okuma.metin) okumalar.push({ ...kutu, metin: okuma.metin })
      }
      const metin = okumalariSirala(okumalar)
      const isaret = [...metin.matchAll(/\d{1,3}\s*[DYB](?![a-zçğıöşü])/gi)].length
      if (isaret > enIyi.isaret) enIyi = { metin, isaret }
      // Dik çekilmiş kâğıt çoğunlukla ilk denemede okunur; gereksiz yön denemesi gecikme yaratır.
      if (yon === 0 && isaret >= 2) break
    }
    self.postMessage({ tur: 'sonuc', metin: enIyi.metin })
  } catch {
    self.postMessage({ tur: 'hata' })
  } finally {
    resim?.close()
    await tespit?.release()
    await tani?.release()
  }
}
