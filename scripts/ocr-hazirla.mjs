import { build } from 'esbuild'
import { copyFile, mkdir } from 'node:fs/promises'

// Çalıştırma dosyaları APK içinde olmalı; çevrimdışı kullanım CDN'e bağlı kalamaz.
await mkdir('public/ocr', { recursive: true })
for (const ad of ['ort.wasm.min.mjs', 'ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm']) {
  await copyFile(`node_modules/onnxruntime-web/dist/${ad}`, `public/ocr/${ad}`)
}
await build({
  entryPoints: ['lib/ocr-isci.ts'], outfile: 'public/ocr/okuma-iscisi.js',
  bundle: true, format: 'esm', platform: 'browser', target: 'es2020',
  plugins: [{ name: 'yerel-ocr', setup(derleyici) {
    derleyici.onResolve({ filter: /^onnxruntime-web\/wasm$/ }, () => ({ path: './ort.wasm.min.mjs', external: true }))
  } }],
})
