<div align="center">

<img src="public/icon-192.png" width="96" alt="Rabi">

# Rabi

**Lise öğrencileri için YKS çalışma asistanı.**
Hesap yok, sunucu yok — veriler telefonda kalır.

<sub><i>An offline-first study assistant for Turkish university-entrance exam (YKS) candidates.</i></sub>

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-8-119eff?logo=capacitor&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

## Neler var

- **Deneme takibi** — TYT / AYT / YDT netleri, ders ders döküm.
- **Hedef ve sıralama tahmini** — ÖSYM kılavuzundan gelen bölüm kataloğu; puan ve sıralama tahmini.
- **Pomodoro** — sınav provası (TYT 165 · AYT 180 · YDT 120 dk), kilit ekranında sayaç, odak kilidi.
- **Soru takibi ve yanlış soru bankası** — günlük soru sayısı; yanlışların fotoğrafı ve üstüne çizim.
- **Konu haritası** — Maarif müfredatına göre bilgi kartları ve doğru/yanlış yoklamaları.
- **Mini oyunlar** — derslere göre 25 oyun; yanlış bilinen sorular Oyun Bankası'nda tekrar edilir.
- **Yapılacaklar, devamsızlık, başarımlar ve aylık özet.**

## Geliştirme

```bash
npm install
npm run dev        # http://localhost:3000 (mobil görünümde aç)
npm run typecheck
npm run test
```

Android derlemesi için Android SDK ve **JDK 21** gerekir:

```bash
npm run apk
```

**Yığın:** Next.js 16 (statik export) · React 19 · TypeScript · Tailwind v4 · Capacitor 8

Proje kuralları ve tasarım kararları [`AGENTS.md`](AGENTS.md) içinde.

## Gizlilik

Veriler cihazda (`localStorage`, fotoğraflar `IndexedDB`) tutulur. Ağa yalnızca üç durumda çıkılır:
kullanıcının gönderdiği hata/öneri bildirimi, her seferinde onay istenen çökme raporu ve
Play Store güncelleme denetimi. Ayrıntılar: [gizlilik politikası](https://ycistak.github.io/Rabi/).

## Lisans

[MIT](LICENSE)
