# Duygu Analizi

Türkçe metinler için açıklanabilir yapay zeka (XAI) destekli duygu analizi uygulaması. Sözlük tabanlı bir motor üzerine SHAP ve LIME yöntemleri entegre edilerek hangi kelimenin karara ne kadar katkı sağladığı görselleştirilir.

## Özellikler

- **Duygu tespiti** — Türkçe metni Pozitif / Negatif / Nötr olarak sınıflandırır
- **Güven skoru** — Kararın ne kadar güçlü olduğunu yüzde ile gösterir
- **Kelime ısı haritası** — Her kelimenin duygu katkısını renkle vurgular; olumsuzlayıcı (değil, hiç…) ve pekiştirici (çok, en…) kelimeler ayrı işaretlenir
- **SHAP** — Her kelimenin tam metinden çıkarılmasıyla ölçülen Shapley değeri
- **LIME** — Rastgele alt küme pertürbasyonlarıyla tahmin değişimi
- **Yöntem karşılaştırma tablosu** — SHAP ve LIME'ın her kelime için hemfikir olup olmadığını gösterir

## Kullanım

Sunucu gerektirmez; `index.html` dosyasını doğrudan tarayıcıda açın:

```
index.html   →  tarayıcıda aç
```

Metin kutusuna Türkçe bir cümle yazıp **Analiz Et** butonuna tıklayın veya `Ctrl + Enter` kısayolunu kullanın. Hazır örnek cümleler de mevcuttur.

## Teknik Detay

| Katman | Açıklama |
|---|---|
| `sentiment.js` | Sözlük tabanlı motor; POS/NEG/NEU/NEGATOR/INTENSIFIER listeleri ve puanlama mantığı |
| `app.js` | SHAP (Leave-One-Out Shapley), LIME (120 pertürbasyon), render ve UI kontrolü |
| `style.css` | Koyu tema, bar grafikleri, token renklendirme |

### SHAP (Leave-One-Out Shapley)
Her kelime tam metinden çıkarılır, skor farkı o kelimenin Shapley değeri olarak atanır. Olumsuzlayıcı-pekiştirici etkileşimleri otomatik yakalanır.

### LIME (Local Interpretable Model-agnostic Explanations)
Her analiz için 120 rastgele binary maske üretilir. Bir kelimenin maskede dahil olduğu senaryoların ortalama skoru ile dışarıda bırakıldığı senaryoların ortalama skoru arasındaki fark LIME önemi olarak hesaplanır.

## Gereksinimler

Tarayıcı dışında bağımlılık yoktur. `pptxgenjs` paketi yalnızca `create_sunum.js` (sunum oluşturucu script) için kullanılır:

```bash
npm install
node create_sunum.js
```
