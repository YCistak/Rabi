# Bilgi kartı yazım rehberi

Kartlar `lib/konu/icerik/<sınıf>-<ders>.ts` içinde. Bu rehber kartın **nasıl
yazılacağını** anlatır; yapı ve sınırlar `lib/konu/tip.ts` ve
`lib/konu/icerik.test.ts` içinde.

## Kimin için

9–10. sınıf öğrencisi, konuyu **ilk kez** okuyor. Kart, bilen birine hatırlatma
değil; bilmeyen birine ilk anlatım. Ders notu değil: kaydırmadan okunan tek
bir şey.

## Kartın biçimi

1. **Bir kart, bir fikir.** İki kural anlatan kart ikiye bölünür. Konu başına
   6–16 kart var; tavana yaklaşmak değil, tek fikirli kalmak hedef.
2. **Başlık ne öğreneceğini söyler**, kavramın adını değil. "Negatif üs" değil
   "Negatif üs sayıyı ters çevirir". Başlık bir cümle gibi okunmalı (≤ 44
   karakter).
3. **Önce örnek, sonra kural.** Sayıyla, nesneyle, günlük bir şeyle başla;
   genel hâlini (formül, tanım) örnekten sonra ver. `2³·2² = 2⁵` önce,
   `aᵐ·aⁿ = aᵐ⁺ⁿ` sonra. Formül tek başına bir kart olamaz.
4. **Terim ilk geçtiği yerde açıklanır.** "Eşlenik", "çökelek", "organel"
   gibi bir kelime okuyucunun bilmediği varsayılır; ilk kartta "yani …" ile
   söylenir, sonraki kartlarda kullanılır. Açıklanmadan kullanılan terim yok.
5. **Kartlar sıraya dayanır.** 5. kartı anlamak için 7. kartı okumak
   gerekmez; her kart öncekilerin üstüne kurulur. Basitten zora.
6. **Kısa ve "sen" diliyle.** Cümle ≤ 15 kelime. Devrik, aforizma, vecize
   yok ("Sınır çizgileri idari, doğal değil" gibi). Konuşur gibi:
   "gördüğünde", "düşün", "bak".
7. **Sık hatayı karta koy.** Sınavda düşülen tuzak varsa bir cümleyle söyle:
   "2⁻³'ü −8 sanma." Etiket olarak `Sık hata` kullanılabilir.
8. **Dolgu kart yazılmaz.** "Neden önemli", "öteki bilimlerle bağı", "kötüye
   kullanımı" gibi felsefi/genel kültür kartları ya somut bir örneğe iner ya
   da atılır. Ölçüt: öğrencinin sınavda ya da konuyu anlamada işine yarıyor
   mu? Taban (6 kart) korunur.
9. **Metin ≤ 240 karakter.** Sığmıyorsa böl, kısaltma; sınırı büyütme.

## Etiket ve Rabi'nin notu

- `etiket` isteğe bağlı (≤ 18): `Tanım`, `Sık hata`, `Örnek`, `Kural`, `Dikkat`.
  Her karta koyma; yalnızca kartın türünü söylemek işe yarıyorsa.
- `not` **konu başına bir kartta** (≤ 120): en tuzaklı karta somut bir ipucu.
  "Ezberleme, sor" gibi buyruklar değil; ne yapılacağını söyleyen bir cümle:
  "2⁻³ gördüğünde aklına −8 gelirse dur, 1/8 olacak."

## Görsel

Görsel yalnızca cümlenin tek başına anlatamadığını gösteriyorsa (eğrinin
yönü, katmanların sırası, karşılaştırma tablosu). Kartı yeniden yazarken
mevcut görseli koru; metnin anlattığını tekrar eden görseli kaldır.
Tabloya bir **örnek** sütunu eklemek çoğu zaman tabloyu okunur yapar.

## Sorular ve hızlı kontroller

- Sorular (`soru`, `sikli`) ve kontroller kartlarla **uyumlu** kalmalı:
  kartın söylemediği şey sorulmaz. Kart atıldıysa ona dayanan soru da
  değişir.
- Kontrolün `kart` numarası (1'den) kart sırası kayınca güncellenir.
- Soru sayısı kart sayısına bağlı: en az kart+1, en çok kart×1,3+1.
- Denge: her konuda hem doğru hem yanlış iddia; bütünde doğru oranı ve
  B şıkkı oranı %40–60 (`icerik.test.ts`).

## Yazdıktan sonra

`npx vitest run lib/konu` ve `npm run typecheck`. Test sınırların hepsini
söylüyor; iddia soru cümlesi olamaz (`?` yok).
