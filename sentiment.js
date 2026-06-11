// ─── TÜRKÇE DUYGU ANALİZİ MOTORU ────────────────────────────────────────────
// Kelime bazlı leksikon (sözlük) yaklaşımı.
// Her kelime 3 kategoriden birine girer:
//   POS_WORDS  → pozitif duygu taşıyan kelimeler  (0–1 arası skor)
//   NEG_WORDS  → negatif duygu taşıyan kelimeler  (0–1 arası skor, eksi yönde)
//   NEU_WORDS  → tarafsız/olgusal kelimeler        (duygu skoru = 0, ama EKSPLİSİT nötr)
// Bunların dışında kalan kelimeler de nötr sayılır (örtük nötr).
// NEGATORS ve INTENSIFIERS özel kurallarla işlenir.

// ─── POZİTİF KELİMELER ───────────────────────────────────────────────────────
const POS_WORDS = {
  'harika': 0.95,      'harikaydı': 0.93,    'mükemmel': 0.93,    'müthiş': 0.90,
  'güzel': 0.82,       'çok güzel': 0.88,    'muhteşem': 0.91,    'süper': 0.87,
  'iyi': 0.72,         'iyiydi': 0.75,       'kaliteli': 0.80,    'sağlam': 0.68,
  'beğendim': 0.88,    'beğendik': 0.87,     'sevdim': 0.85,      'seviyorum': 0.87,
  'memnun': 0.83,      'memnunum': 0.85,     'tatmin': 0.78,      'tatmin oldum': 0.82,
  'teşekkür': 0.72,    'teşekkürler': 0.76,  'teşekkür ederim': 0.78,
  'lezzetli': 0.84,    'taze': 0.68,         'temiz': 0.66,       'hızlı': 0.62,
  'başarılı': 0.81,    'başarılıydı': 0.82,  'başarılılar': 0.80,
  'dostane': 0.72,     'cana yakın': 0.75,   'yardımsever': 0.74, 'nazik': 0.73,
  'keyifli': 0.80,     'eğlenceli': 0.78,    'hoş': 0.70,         'rahat': 0.68,
  'verimli': 0.72,     'pratik': 0.65,       'faydalı': 0.68,     'yararlı': 0.67,
  'güvenilir': 0.76,   'güvenli': 0.70,      'dürüst': 0.68,      'şeffaf': 0.65,
  'tavsiye': 0.72,     'tavsiye ederim': 0.80, 'öneririm': 0.78,
  'mükemmeldi': 0.93,  'harikaydılar': 0.91, 'fevkalade': 0.90,
  'kusursuz': 0.88,    'olağanüstü': 0.89,   'şahane': 0.87,      'enfes': 0.86,
  'ideal': 0.76,       'optimal': 0.73,      'uygun': 0.63,       'makul': 0.60,
  'sıcak': 0.62,       'samimi': 0.70,       'içten': 0.68,
};

// ─── NEGATİF KELİMELER ───────────────────────────────────────────────────────
const NEG_WORDS = {
  'kötü': 0.90,        'kötüydü': 0.91,      'berbat': 0.95,      'berbattı': 0.94,
  'rezalet': 0.94,     'rezil': 0.92,        'korkunç': 0.92,     'iğrenç': 0.91,
  'mahvetmiş': 0.88,   'mahvetti': 0.90,
  'pahalı': 0.62,      'çok pahalı': 0.75,   'fahiş': 0.80,
  'yavaş': 0.63,       'geç': 0.60,          'gecikti': 0.65,     'beklettiler': 0.72,
  'soğuk': 0.68,       'soğuktu': 0.70,      'bayat': 0.78,       'kirli': 0.80,
  'beğenmedim': 0.85,  'sevmedim': 0.83,     'beğenmedik': 0.84,
  'pişman': 0.82,      'pişmanım': 0.83,     'hayal kırıklığı': 0.88,
  'şikayetçi': 0.80,   'şikayet': 0.72,      'şikayetim': 0.75,
  'başarısız': 0.85,   'başarısızdı': 0.86,  'beceriksiz': 0.82,
  'bozuk': 0.80,       'bozuldu': 0.79,      'çalışmıyor': 0.83,  'çalışmadı': 0.81,
  'yanlış': 0.68,      'hatalı': 0.78,       'hata': 0.65,        'sorun': 0.62,
  'problem': 0.62,     'sıkıntı': 0.65,      'sıkıntılı': 0.68,
  'sinir bozucu': 0.82,'sinir': 0.70,        'sinirli': 0.68,
  'rahatsız': 0.75,    'rahatsız edici': 0.80,
  'üzücü': 0.78,       'üzdü': 0.76,         'hayal kırıklığına uğrattı': 0.88,
  'gürültülü': 0.65,   'karmaşık': 0.60,     'zor': 0.55,
  'olumsuz': 0.72,     'kötü deneyim': 0.88, 'kötü hizmet': 0.87,
  'ilgisiz': 0.75,     'kaba': 0.80,         'saygısız': 0.85,
  'kalitesiz': 0.82,   'düşük kalite': 0.85, 'vasıfsız': 0.80,
  'eksik': 0.65,       'yetersiz': 0.72,     'yetersizdi': 0.73,
  'kandırmak': 0.88,   'aldatmak': 0.90,     'dolandırmak': 0.92,
};

// ─── NÖTR KELİMELER (EKSPLİSİT) ─────────────────────────────────────────────
// Bu kelimeler olgusal/tarafsız bilgi taşır; duygu içermez.
// Bu listedeki kelimeler ısı haritasında "nötr" olarak açıkça etiketlenir.
// Listede olmayan ama POS/NEG'de de olmayan kelimeler "örtük nötr" sayılır.
const NEU_WORDS = new Set([
  // Zaman ifadeleri
  'bugün', 'yarın', 'dün', 'sabah', 'öğlen', 'akşam', 'gece',
  'saat', 'dakika', 'gün', 'hafta', 'ay', 'yıl', 'haftalık',
  // Sayı ve miktar
  'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on',
  'yüz', 'bin', 'toplam', 'kadar',
  // Hava durumu (tarafsız)
  'bulutlu', 'güneşli', 'yağmurlu', 'rüzgarlı', 'sisli', 'karlı', 'açık',
  // Boyut/nitelik sıfatları (duygusuz)
  'büyük', 'küçük', 'uzun', 'kısa', 'yeni', 'eski', 'orta',
  // Fiiller (nesnel eylem)
  'var', 'vardı', 'yok', 'yoktu', 'olan', 'oldu', 'olacak',
  'gidiyor', 'geliyor', 'gitti', 'geldi', 'başlayacak', 'başladı',
  'teslim', 'edilecek', 'edildi', 'yapılıyor', 'yapılacak',
  'açık', 'kapalı', 'çalışıyor',
  // Nesnel isimler
  'hava', 'toplantı', 'tren', 'mağaza', 'kitap', 'sayfa', 'rapor',
  'dosya', 'proje', 'ürün', 'fiyat', 'tarih', 'adres', 'bilgi',
  // Zamirler & bağlaçlar
  'bu', 'şu', 'o', 've', 'ile', 'için', 'gibi', 'da', 'de',
  'ta', 'te', 'ama', 'fakat', 'ancak', 'lakin',
  'her', 'her gün', 'içi', 'içinde', 'dışında', 'üzerinde',
]);

// ─── OLUMSUZLAYICILAR ────────────────────────────────────────────────────────
// Bu kelimeler kendinden sonraki kelimenin etkisini tersine çevirir.
const NEGATORS = [
  'değil', 'değildi', 'değilim', 'değilsin', 'değiliz', 'değiller', 'değilmiş',
  'hiç', 'asla', 'kesinlikle değil',
  'yoktu', 'olmadı', 'olmaz', 'yapmadı',
];

// ─── PEKİŞTİRİCİLER ──────────────────────────────────────────────────────────
// Bu kelimeler kendinden sonraki duygu kelimesinin skorunu çarpar.
// 1'den büyük → güçlendirir, 1'den küçük → zayıflatır.
const INTENSIFIERS = {
  'çok': 1.30,        'gerçekten': 1.25,  'son derece': 1.35, 'oldukça': 1.20,
  'fazlasıyla': 1.28, 'aşırı': 1.30,      'gayet': 1.18,      'epey': 1.15,
  'son': 1.10,        'en': 1.25,
  'biraz': 0.70,      'az': 0.65,         'pek': 0.75,        'hafifçe': 0.60,
};

// ─── TOKENİZE ────────────────────────────────────────────────────────────────
function tokenize(txt) {
  return txt.toLowerCase()
    .replace(/[.,!?;:()"""'']/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

// ─── HER TOKENİ ANALİZ ET ────────────────────────────────────────────────────
// Öncelik sırası: NEGATOR → INTENSIFIER → POS → NEG → NEU_WORDS (eksplisit) → örtük nötr
function analyzeTokens(tokens) {
  const results     = [];
  let globalIntensity = 1.0;

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];

    // 1) Olumsuzlayıcı mı?
    if (NEGATORS.includes(tok)) {
      results.push({ word: tok, score: 0, type: 'negator', isExplicitNeutral: false });
      continue;
    }

    // 2) Pekiştirici mi?
    if (INTENSIFIERS[tok] !== undefined) {
      globalIntensity = INTENSIFIERS[tok];
      results.push({ word: tok, score: 0, type: 'intensifier', isExplicitNeutral: false });
      continue;
    }

    // Önceki 3 ve sonraki 2 kelimede olumsuzlayıcı var mı? (Türkçe'de sonda gelir: "kötü değil")
    const prevTokens = tokens.slice(Math.max(0, i - 3), i);
    const nextTokens = tokens.slice(i + 1, i + 3);
    const negated    = prevTokens.some(p => NEGATORS.includes(p))
                    || nextTokens.some(p => NEGATORS.includes(p));

    let score = 0;
    let type  = 'neutral';
    let isExplicitNeutral = false;

    if (POS_WORDS[tok] !== undefined) {
      // 3) Pozitif kelime
      score = POS_WORDS[tok] * globalIntensity;
      if (negated) score = -score * 0.8;  // olumsuzlanmış pozitif → negatife döner
      type  = score >= 0 ? 'positive' : 'negative';

    } else if (NEG_WORDS[tok] !== undefined) {
      // 4) Negatif kelime
      score = -NEG_WORDS[tok] * globalIntensity;
      if (negated) score = -score * 0.8;  // olumsuzlanmış negatif → pozitife döner
      type  = score <= 0 ? 'negative' : 'positive';

    } else if (NEU_WORDS.has(tok)) {
      // 5) Eksplisit nötr kelime: sözlükte tanımlı, duygu içermiyor
      score = 0;
      type  = 'neutral';
      isExplicitNeutral = true;

    } else {
      // 6) Örtük nötr: hiçbir sözlükte yok, duygu skoru = 0
      score = 0;
      type  = 'neutral';
      isExplicitNeutral = false;
    }

    results.push({
      word: tok,
      score: Math.round(score * 100) / 100,
      type,
      negated,
      isExplicitNeutral,
    });

    globalIntensity = 1.0;  // pekiştirici bir sonraki kelimede tükenir
  }
  return results;
}

// ─── GENEL DUYGU SKORU HESAPLA ───────────────────────────────────────────────
// Algoritma:
//   posScore = pozitif kelimelerin ortalama katkısı
//   negScore = negatif kelimelerin ortalama katkısı
//   neuScore = max(
//     nötr kelime oranı (eksplisit nötrler / anlamlı kelimeler),  ← YENİ
//     1 - (posScore + negScore)                                    ← artık pay
//   )
//   En yüksek skor hangi etiket → o karar.
function computeSentiment(tokenResults) {
  let posSum = 0, negSum = 0;
  let explicitNeuCount = 0;
  let meaningfulCount  = 0;  // negator/intensifier DIŞI kelimeler

  tokenResults.forEach(t => {
    if (t.type === 'negator' || t.type === 'intensifier') return;
    meaningfulCount++;
    if (t.score > 0) posSum += t.score;
    else if (t.score < 0) negSum += Math.abs(t.score);
    if (t.isExplicitNeutral) explicitNeuCount++;
  });

  const mCount   = Math.max(meaningfulCount, 1);
  const sCount   = tokenResults.filter(t => t.score !== 0).length || 1;

  const posScore = posSum / sCount;
  const negScore = negSum / sCount;

  // Eksplisit nötr oranı: cümlede ne kadar "tarafsız" kelime var?
  const explicitNeuRatio = explicitNeuCount / mCount;

  // Artık nötr: pozitif + negatif baskı ne kadar az?
  const residualNeu = Math.max(0, 1 - (posScore + negScore));

  // İkisinin ağırlıklı kombinasyonu
  const neuScore = Math.max(explicitNeuRatio * 0.6 + residualNeu * 0.4, residualNeu);

  const total = posScore + negScore + neuScore || 1;
  const pct = {
    pos: posScore / total,
    neg: negScore / total,
    neu: neuScore / total,
  };

  let label, conf;
  if (pct.pos >= pct.neg && pct.pos >= pct.neu)        { label = 'positive'; conf = pct.pos; }
  else if (pct.neg >= pct.pos && pct.neg >= pct.neu)   { label = 'negative'; conf = pct.neg; }
  else                                                   { label = 'neutral';  conf = pct.neu; }

  return { label, conf, pct };
}

// ─── XAI AÇIKLAMASI ──────────────────────────────────────────────────────────
function buildXAI(tokenResults, sent) {
  const sentimentActive = tokenResults.filter(t => t.score !== 0);
  const sorted          = [...sentimentActive].sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
  const explicitNeuCount = tokenResults.filter(t => t.isExplicitNeutral).length;

  const labelStr = sent.label === 'positive' ? 'POZİTİF'
                 : sent.label === 'negative' ? 'NEGATİF'
                 : 'NÖTR';

  if (sentimentActive.length === 0) {
    const reason = explicitNeuCount > 0
      ? `Cümlede ${explicitNeuCount} adet olgusal/tarafsız kelime tespit edildi; duygu yüklü ifade bulunamadı.`
      : 'Cümlede bilinen duygu ifadesi tespit edilemedi; metin olgusal ya da belirsiz görünüyor.';
    return `Model bu cümleyi <strong>NÖTR</strong> olarak sınıflandırdı. ${reason}`;
  }

  const topPos = sorted.filter(t => t.score > 0).slice(0, 2).map(t => `<strong>"${t.word}"</strong>`).join(' ve ');
  const topNeg = sorted.filter(t => t.score < 0).slice(0, 2).map(t => `<strong>"${t.word}"</strong>`).join(' ve ');

  let text = `Model bu cümleyi <strong>${labelStr}</strong> olarak sınıflandırdı. `;
  text += `Güven skoru <strong>%${Math.round(sent.conf * 100)}</strong>. `;
  if (topPos) text += `Pozitif katkı sağlayan kelimeler: ${topPos}. `;
  if (topNeg) text += `Negatif katkı sağlayan kelimeler: ${topNeg}. `;

  const negatedWords = tokenResults.filter(t => t.negated && t.score !== 0);
  if (negatedWords.length > 0) {
    text += `"${negatedWords.map(t => t.word).join('", "')}" kelimelerinin önünde olumsuzlayıcı sözcük bulundu; etkileri ters çevrildi. `;
  }

  const intensifiers = tokenResults.filter(t => t.type === 'intensifier');
  if (intensifiers.length > 0) {
    text += `"${intensifiers.map(t => t.word).join('", "')}" pekiştirici sözcükler komşu kelimelerin ağırlığını artırdı. `;
  }

  if (explicitNeuCount > 0) {
    text += `Cümlede ${explicitNeuCount} adet olgusal/tarafsız kelime de yer aldı.`;
  }

  return text;
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────
window.SentimentEngine = { tokenize, analyzeTokens, computeSentiment, buildXAI };
