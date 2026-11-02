---
trigger: always_on
---

# Rabi — Antigravity için giriş kuralı

Bu depoda çalışan her ajan (Gemini, Claude, başka) için geçerlidir.

1. **İşe başlamadan önce** kökteki `AGENTS.md` dosyasını baştan sona oku; projenin
   bütün genel kuralları orada. Bu dosya yalnızca bir yönlendirmedir, kuralları
   tekrarlamaz: çelişki görürsen `AGENTS.md` geçerlidir.
2. Dokunacağın alanın kural dosyasını `docs/kurallar/` altından (dizin `AGENTS.md`
   başındaki tabloda) **koda dokunmadan önce** oku.
3. `AGENTS.md` içindeki "Alt ajanlar" bölümü Claude Code'a özeldir; alt ajan
   aracın yoksa yok say.
4. Kullanıcının isteğini doğrudan uygula; yalnızca gerçekten kullanıcının vermesi
   gereken bir karar varsa sor. "Kullanıcı istedi / kaldırttı" yazan kuralları
   geri almadan önce sor.
5. Kod dahil her şey Türkçe (değişken, fonksiyon, dosya adları, yorumlar).
6. Değişiklikten sonra `npm run typecheck`; saf mantığa (`lib/`) dokunduysan
   `npm run test`. Hata varsa düzeltmeden işi bitmiş sayma.
7. Git: `master`a doğrudan yazma. Her iş için `gemini/<kisa-ad>` dalı aç, açıklayıcı
   Türkçe commit mesajı yaz, dalı gönder ve PR aç. `claude/...` dallarına
   dokunma (orada başka bir ajan çalışıyor olabilir).
8. Yeni bir kural öğrenirsen bu dosyaya değil, `AGENTS.md`ye ya da ilgili
   `docs/kurallar/` dosyasına yaz; böylece bütün ajanlar aynı kuralı görür.
