// DuyguAnalizi - Türkçe Duygu Analizi Sunum Oluşturucu
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
pres.title = "Türkçe Duygu Analizi";
pres.author = "Esma Sıla Şahinci";

// ─── Renk Paleti ─────────────────────────────────────────────────────────────
const C = {
  navy:    "1F3864",   // koyu lacivert — başlık, vurgu
  navyMid: "2E5090",   // orta lacivert
  navyLt:  "D6E4F7",   // açık lacivert — kart bg
  white:   "FFFFFF",
  offWhite:"F4F7FC",   // slide bg
  gray:    "64748B",   // muted metin
  grayLt:  "E2E8F0",   // ince çizgi
  green:   "166534",   // pozitif
  greenLt: "DCFCE7",
  red:     "991B1B",   // negatif
  redLt:   "FEE2E2",
  neutral: "374151",   // nötr etiket
  neutralLt:"F3F4F6",
  accent:  "3B82F6",   // mavi vurgu
  accentLt:"EFF6FF",
};

// ─── Yardımcı: İçerik Slaytı Başlık Barı ──────────────────────────────────
function addHeader(slide, title) {
  // Koyu lacivert header bar
  slide.addShape("rect", {
    x: 0, y: 0, w: 10, h: 0.85,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  // Altında ince accent çizgi
  slide.addShape("rect", {
    x: 0, y: 0.85, w: 10, h: 0.04,
    fill: { color: C.navyMid }, line: { color: C.navyMid }
  });
  // Başlık metni
  slide.addText(title, {
    x: 0.4, y: 0, w: 9.2, h: 0.85,
    fontSize: 26, bold: true, color: C.white,
    fontFace: "Calibri", valign: "middle", align: "left", margin: 0
  });
}

// ─── Yardımcı: Renkli Kart ─────────────────────────────────────────────────
function addCard(slide, x, y, w, h, headerText, headerColor, bgColor, bodyLines) {
  // Kart arka plan
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: bgColor },
    line: { color: headerColor, pt: 1.5 },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10 }
  });
  // Kart üst başlık barı
  slide.addShape("rect", {
    x, y, w: w, h: 0.38,
    fill: { color: headerColor }, line: { color: headerColor }
  });
  // Kart başlık metni
  slide.addText(headerText, {
    x: x + 0.12, y: y, w: w - 0.24, h: 0.38,
    fontSize: 13, bold: true, color: C.white,
    fontFace: "Calibri", valign: "middle", align: "center", margin: 0
  });
  // Kart içerik
  if (bodyLines && bodyLines.length > 0) {
    const items = bodyLines.map((line, i) => ({
      text: line,
      options: { breakLine: i < bodyLines.length - 1, fontSize: 12.5, color: C.navy, fontFace: "Calibri" }
    }));
    slide.addText(items, {
      x: x + 0.15, y: y + 0.44, w: w - 0.3, h: h - 0.54,
      valign: "top", align: "left"
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SLAYT 1 — KAPAK
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Üst dekoratif şerit
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.navyMid }, line: { color: C.navyMid } });
  // Alt dekoratif şerit
  s.addShape("rect", { x: 0, y: 5.545, w: 10, h: 0.08, fill: { color: C.navyMid }, line: { color: C.navyMid } });

  // Sol dikey accent çizgisi
  s.addShape("rect", { x: 0.5, y: 0.5, w: 0.06, h: 4.6, fill: { color: C.accent }, line: { color: C.accent } });

  // Üniversite adı
  s.addText("NEVŞEHİR HACI BEKTAŞ VELİ ÜNİVERSİTESİ", {
    x: 0.75, y: 0.35, w: 8.9, h: 0.45,
    fontSize: 13, bold: false, color: "B0C4DE",
    fontFace: "Calibri", align: "left", charSpacing: 2
  });
  s.addText("Mühendislik-Mimarlık Fakültesi  |  Bilgisayar Mühendisliği Bölümü", {
    x: 0.75, y: 0.78, w: 8.9, h: 0.32,
    fontSize: 11, color: "8AAFD4", fontFace: "Calibri", align: "left"
  });

  // Yatay ayırıcı çizgi
  s.addShape("rect", { x: 0.75, y: 1.2, w: 8.5, h: 0.025, fill: { color: "3A5A8A" }, line: { color: "3A5A8A" } });

  // Ana başlık
  s.addText("Türkçe Duygu Analizi", {
    x: 0.75, y: 1.35, w: 8.7, h: 1.0,
    fontSize: 46, bold: true, color: C.white,
    fontFace: "Calibri", align: "left"
  });

  // Alt başlık
  s.addText("Kural Tabanlı Leksikon & Açıklanabilir Yapay Zeka", {
    x: 0.75, y: 2.28, w: 8.7, h: 0.5,
    fontSize: 20, bold: false, color: "B0C4DE",
    fontFace: "Calibri", align: "left"
  });
  s.addText("SHAP  &  LIME", {
    x: 0.75, y: 2.72, w: 8.7, h: 0.45,
    fontSize: 18, bold: true, color: C.accent,
    fontFace: "Calibri", align: "left", charSpacing: 3
  });

  // Ayırıcı
  s.addShape("rect", { x: 0.75, y: 3.28, w: 8.5, h: 0.025, fill: { color: "3A5A8A" }, line: { color: "3A5A8A" } });

  // Alt bilgi
  s.addText([
    { text: "Esma Sıla Şahinci", options: { bold: true, color: C.white } },
    { text: "   |   Doğal Dil İşleme   |   2025–2026 Bahar", options: { color: "9AB8D8" } }
  ], {
    x: 0.75, y: 3.42, w: 8.7, h: 0.4,
    fontSize: 13, fontFace: "Calibri", align: "left"
  });

  // Teknoloji etiketi
  s.addText("JavaScript  ·  Client-Side  ·  Saf Leksikon  ·  XAI", {
    x: 0.75, y: 4.7, w: 8.7, h: 0.3,
    fontSize: 10.5, color: "5A7FA0", fontFace: "Calibri", align: "left"
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLAYT 2 — PROJE AMACI
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  addHeader(s, "Projenin Amacı");

  // 4 hedef kartı — 2x2 grid
  const goals = [
    { icon: "🎯", title: "Otomatik Sınıflandırma", body: "Türkçe metinleri\nPozitif / Negatif / Nötr\nolarak sınıflandırmak" },
    { icon: "🔍", title: "XAI Açıklanabilirlik", body: "SHAP ve LIME ile\nhangi kelimenin kararı\ntetiklediğini göstermek" },
    { icon: "🌐", title: "Sunucusuz Web Uygulaması", body: "Tarayıcıda doğrudan\nçalışan interaktif\nweb arayüzü" },
    { icon: "📊", title: "İki Yöntem Karşılaştırması", body: "SHAP ve LIME'ın\nsonuçlarını yan yana\ngörselleştirmek" },
  ];

  const positions = [
    { x: 0.4, y: 1.05 },
    { x: 5.1, y: 1.05 },
    { x: 0.4, y: 3.1 },
    { x: 5.1, y: 3.1 },
  ];

  goals.forEach((g, i) => {
    const { x, y } = positions[i];
    const w = 4.5, h = 1.85;
    // Kart bg
    s.addShape("rect", {
      x, y, w, h,
      fill: { color: C.white },
      line: { color: C.navy, pt: 1.5 },
      shadow: { type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.08 }
    });
    // Sol accent bar
    s.addShape("rect", { x, y, w: 0.07, h, fill: { color: C.navy }, line: { color: C.navy } });
    // İkon
    s.addText(g.icon, { x: x + 0.15, y: y + 0.1, w: 0.6, h: 0.55, fontSize: 22, align: "center" });
    // Başlık
    s.addText(g.title, {
      x: x + 0.7, y: y + 0.08, w: w - 0.85, h: 0.45,
      fontSize: 14, bold: true, color: C.navy,
      fontFace: "Calibri", valign: "middle"
    });
    // İçerik
    s.addText(g.body, {
      x: x + 0.7, y: y + 0.52, w: w - 0.85, h: 1.15,
      fontSize: 12.5, color: C.gray,
      fontFace: "Calibri", valign: "top"
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLAYT 3 — SİSTEM MİMARİSİ
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  addHeader(s, "Sistem Mimarisi");

  // Sol taraf: Dosya tablosu
  const files = [
    { file: "index.html",   tech: "HTML5",      desc: "DOM yapısı & 11 örnek cümle" },
    { file: "sentiment.js", tech: "Vanilla JS", desc: "Tokenizasyon, leksikon, skor" },
    { file: "app.js",       tech: "Vanilla JS", desc: "SHAP & LIME hesabı, grafikler" },
    { file: "style.css",    tech: "CSS3",       desc: "Görsel tasarım & animasyonlar" },
  ];

  // Tablo başlık
  const tHdr = [
    [
      { text: "Dosya",        options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: "Teknoloji",    options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: "Sorumluluk",   options: { bold: true, color: C.white, fill: { color: C.navy } } },
    ]
  ];
  const tRows = files.map((f, i) => [
    { text: f.file, options: { bold: true, color: C.navy,  fill: { color: i % 2 === 0 ? C.white : C.offWhite } } },
    { text: f.tech, options: { color: C.gray,              fill: { color: i % 2 === 0 ? C.white : C.offWhite } } },
    { text: f.desc, options: { color: C.neutral,           fill: { color: i % 2 === 0 ? C.white : C.offWhite } } },
  ]);

  s.addTable([...tHdr, ...tRows], {
    x: 0.4, y: 1.05, w: 5.8,
    colW: [1.7, 1.3, 2.8],
    border: { pt: 0.75, color: C.grayLt },
    fontSize: 12.5, fontFace: "Calibri",
    rowH: 0.5
  });

  // Sağ taraf: Akış diyagramı
  const flowSteps = [
    { label: "Kullanıcı Girişi", color: C.navyMid },
    { label: "analyze()", color: C.navyMid },
    { label: "tokenize()", color: C.navyMid },
    { label: "computeSentiment()", color: C.navyMid },
    { label: "SHAP  &  LIME", color: C.accent },
    { label: "Görselleştirme", color: "166534" },
  ];

  const flowX = 6.7, flowStartY = 1.0, boxW = 3.0, boxH = 0.52, gap = 0.18;

  flowSteps.forEach((step, i) => {
    const fy = flowStartY + i * (boxH + gap);
    // Kutu
    s.addShape("rect", {
      x: flowX, y: fy, w: boxW, h: boxH,
      fill: { color: step.color },
      line: { color: step.color },
      shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.12 }
    });
    // Metin
    s.addText(step.label, {
      x: flowX, y: fy, w: boxW, h: boxH,
      fontSize: 12.5, bold: i === 4, color: C.white,
      fontFace: "Calibri", align: "center", valign: "middle", margin: 0
    });
    // Ok
    if (i < flowSteps.length - 1) {
      const arrowY = fy + boxH;
      s.addShape("rect", { x: flowX + 1.4, y: arrowY, w: 0.2, h: gap, fill: { color: C.gray }, line: { color: C.gray } });
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLAYT 4 — KURAL TABANLI LEKSİKON NEDİR?
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  addHeader(s, "Kural Tabanlı Leksikon Nedir?");

  // Tanım kutusu — üstte geniş
  s.addShape("rect", { x: 0.3, y: 1.05, w: 9.4, h: 0.72,
    fill: { color: C.navyLt }, line: { color: C.navyMid, pt: 1.5 } });
  s.addText([
    { text: "Leksikon", options: { bold: true, color: C.navy } },
    { text: " = kelime sözlüğü  |  ", options: { color: C.neutral } },
    { text: "Kural tabanlı", options: { bold: true, color: C.navy } },
    { text: " = makine öğrenmesi yok, model eğitimi yok — insan tarafından yazılmış kurallar", options: { color: C.neutral } },
  ], {
    x: 0.3, y: 1.05, w: 9.4, h: 0.72,
    fontSize: 13.5, fontFace: "Calibri", align: "center", valign: "middle"
  });

  // Sol: Nasıl çalışır (akış)
  s.addShape("rect", { x: 0.3, y: 1.88, w: 4.5, h: 3.42,
    fill: { color: C.white }, line: { color: C.navy, pt: 1.5 } });
  s.addShape("rect", { x: 0.3, y: 1.88, w: 4.5, h: 0.40,
    fill: { color: C.navy }, line: { color: C.navy } });
  s.addText("Nasıl Çalışır?", {
    x: 0.38, y: 1.88, w: 4.34, h: 0.40,
    fontSize: 13, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0
  });

  const steps = [
    { num: "1", text: "Metni kelimelere böl" },
    { num: "2", text: "Her kelimeyi sözlükte ara" },
    { num: "3", text: "Varsa skorunu al  (+0.95, −0.90...)" },
    { num: "4", text: "Kural var mı? Uygula\n(olumsuzlayıcı, pekiştirici)" },
    { num: "5", text: "Skorları topla → karar ver" },
  ];

  steps.forEach((st, i) => {
    const sy = 2.38 + i * 0.54;
    // Numara dairesi
    s.addShape("rect", { x: 0.48, y: sy, w: 0.38, h: 0.38,
      fill: { color: C.navy }, line: { color: C.navy } });
    s.addText(st.num, { x: 0.48, y: sy, w: 0.38, h: 0.38,
      fontSize: 13, bold: true, color: C.white, fontFace: "Calibri", align: "center", valign: "middle", margin: 0 });
    s.addText(st.text, { x: 0.94, y: sy, w: 3.7, h: 0.38,
      fontSize: 12.5, color: C.neutral, fontFace: "Calibri", valign: "middle" });
    // Bağlantı oku (son adım hariç)
    if (i < steps.length - 1) {
      s.addShape("rect", { x: 0.58, y: sy + 0.38, w: 0.18, h: 0.16,
        fill: { color: C.grayLt }, line: { color: C.grayLt } });
    }
  });

  // Sağ: ML ile karşılaştırma
  s.addShape("rect", { x: 5.2, y: 1.88, w: 4.5, h: 3.42,
    fill: { color: C.white }, line: { color: C.navy, pt: 1.5 } });
  s.addShape("rect", { x: 5.2, y: 1.88, w: 4.5, h: 0.40,
    fill: { color: C.navy }, line: { color: C.navy } });
  s.addText("Makine Öğrenmesi ile Farkı", {
    x: 5.28, y: 1.88, w: 4.34, h: 0.40,
    fontSize: 13, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0
  });

  const compTbl = [
    [
      { text: "", options: { fill: { color: C.navy }, bold: true, color: C.white } },
      { text: "Kural Tabanlı", options: { fill: { color: C.navy }, bold: true, color: C.white, align: "center" } },
      { text: "Makine Öğrenmesi", options: { fill: { color: C.navy }, bold: true, color: C.white, align: "center" } },
    ],
    [
      { text: "Eğitim verisi", options: { bold: true, fill: { color: C.offWhite } } },
      { text: "Gerekmez ✓", options: { fill: { color: C.offWhite }, color: "166534", bold: true, align: "center" } },
      { text: "Binlerce örnek", options: { fill: { color: C.offWhite }, color: C.gray, align: "center" } },
    ],
    [
      { text: "Şeffaflık", options: { bold: true, fill: { color: C.white } } },
      { text: "Tam şeffaf ✓", options: { fill: { color: C.white }, color: "166534", bold: true, align: "center" } },
      { text: "Kara kutu", options: { fill: { color: C.white }, color: C.gray, align: "center" } },
    ],
    [
      { text: "Hız", options: { bold: true, fill: { color: C.offWhite } } },
      { text: "Anlık ✓", options: { fill: { color: C.offWhite }, color: "166534", bold: true, align: "center" } },
      { text: "Model yükle/çalıştır", options: { fill: { color: C.offWhite }, color: C.gray, align: "center" } },
    ],
    [
      { text: "Yeni kelimeler", options: { bold: true, fill: { color: C.white } } },
      { text: "Sözlük gerek", options: { fill: { color: C.white }, color: "B45309", align: "center" } },
      { text: "Otomatik öğrenir", options: { fill: { color: C.white }, color: C.gray, align: "center" } },
    ],
  ];
  s.addTable(compTbl, {
    x: 5.28, y: 2.34, w: 4.3, colW: [1.55, 1.4, 1.35],
    border: { pt: 0.75, color: C.grayLt },
    fontSize: 12, fontFace: "Calibri", rowH: 0.46
  });

  // Alt özet notu
  s.addShape("rect", { x: 0.3, y: 4.96, w: 9.4, h: 0.38,
    fill: { color: C.navyLt }, line: { color: C.navyMid, pt: 1 } });
  s.addText([
    { text: "Bu projede kural tabanlı seçildi: ", options: { bold: true, color: C.navy } },
    { text: "eğitim verisi yok, sunucu yok, her karar anında açıklanabilir", options: { color: C.neutral } },
  ], {
    x: 0.3, y: 4.96, w: 9.4, h: 0.38,
    fontSize: 12.5, fontFace: "Calibri", align: "center", valign: "middle"
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLAYT 5 — DUYGU ANALİZİ MOTORU
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  addHeader(s, "Duygu Analizi Motoru");

  addCard(s, 0.25, 1.05, 3.1, 3.5, "POS_WORDS  (~50 kelime)", "166534", "F0FDF4",
    ["harika : 0.95", "mükemmel : 0.93", "müthiş : 0.90", "beğendim : 0.88", "iyi : 0.72", "tatmin : 0.78", "nazik : 0.73", "", "Aralık: 0.60 – 0.95"]);

  addCard(s, 3.45, 1.05, 3.1, 3.5, "NEG_WORDS  (~55 kelime)", "991B1B", "FFF1F2",
    ["berbat : 0.95", "rezalet : 0.94", "kötü : 0.90", "korkunç : 0.92", "başarısız : 0.85", "beğenmedim : 0.85", "pişmanım : 0.83", "", "Aralık: 0.55 – 0.95"]);

  addCard(s, 6.65, 1.05, 3.1, 3.5, "NEU_WORDS  (~70 kelime)", "374151", "F3F4F6",
    ["bugün, saat, tren", "toplantı, rapor", "bulutlu, haftalık", "büyük, var, yok", "", "Skor = 0", "isExplicitNeutral = true", "", "Olgusal kelimeler"]);

  // Alt öncelik notu
  s.addShape("rect", { x: 0.25, y: 4.66, w: 9.5, h: 0.6, fill: { color: C.navyLt }, line: { color: C.navyMid, pt: 1 } });
  s.addText([
    { text: "Öncelik Sırası:  ", options: { bold: true, color: C.navy } },
    { text: "NEGATORS  →  INTENSIFIERS  →  POS_WORDS  →  NEG_WORDS  →  NEU_WORDS  →  Örtük Nötr", options: { color: C.navy } }
  ], {
    x: 0.35, y: 4.66, w: 9.3, h: 0.6,
    fontSize: 12, fontFace: "Calibri", valign: "middle"
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLAYT 5 — OLUMSUZLAYICI & PEKİŞTİRİCİ KURALLAR
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  addHeader(s, "Olumsuzlayıcı & Pekiştirici Kurallar");

  // SOL — NEGATORS
  s.addShape("rect", { x: 0.3, y: 1.05, w: 4.5, h: 4.2, fill: { color: "FFF7F7" }, line: { color: "991B1B", pt: 1.5 } });
  s.addShape("rect", { x: 0.3, y: 1.05, w: 4.5, h: 0.42, fill: { color: "991B1B" }, line: { color: "991B1B" } });
  s.addText("🚫  NEGATORS — Olumsuzlayıcılar", {
    x: 0.38, y: 1.05, w: 4.34, h: 0.42,
    fontSize: 13, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0
  });

  s.addText("değil  ·  hiç  ·  asla  ·  kesinlikle değil\nyoktu  ·  olmadı  ·  olmaz  ·  yapmadı", {
    x: 0.45, y: 1.55, w: 4.2, h: 0.65,
    fontSize: 12, color: C.neutral, fontFace: "Calibri", align: "left"
  });

  // Formül kutusu
  s.addShape("rect", { x: 0.5, y: 2.28, w: 4.0, h: 0.5, fill: { color: "FEE2E2" }, line: { color: "991B1B", pt: 1 } });
  s.addText("skor_son = −(skor_asıl × 0.80)", {
    x: 0.5, y: 2.28, w: 4.0, h: 0.5,
    fontSize: 13, bold: true, color: "991B1B", fontFace: "Consolas", align: "center", valign: "middle"
  });

  s.addText("Örnek:", {
    x: 0.45, y: 2.9, w: 4.2, h: 0.3, fontSize: 12, bold: true, color: C.neutral, fontFace: "Calibri"
  });
  s.addText([
    { text: '"hiç iyi değil"', options: { bold: true, color: "991B1B" } },
    { text: "\n→ POS(iyi, 0.72) × −0.80 = ", options: { color: C.neutral } },
    { text: "−0.576  [NEGATİF]", options: { bold: true, color: "991B1B" } }
  ], {
    x: 0.45, y: 3.22, w: 4.2, h: 0.9,
    fontSize: 13, fontFace: "Calibri"
  });

  s.addText([
    { text: '"olmadı kötü"', options: { bold: true, color: "166534" } },
    { text: "\n→ NEG(kötü, −0.90) × −0.80 = ", options: { color: C.neutral } },
    { text: "+0.720  [POZİTİF]", options: { bold: true, color: "166534" } }
  ], {
    x: 0.45, y: 4.05, w: 4.2, h: 0.9,
    fontSize: 13, fontFace: "Calibri"
  });

  // SAĞ — INTENSIFIERS
  s.addShape("rect", { x: 5.2, y: 1.05, w: 4.5, h: 4.2, fill: { color: C.accentLt }, line: { color: C.accent, pt: 1.5 } });
  s.addShape("rect", { x: 5.2, y: 1.05, w: 4.5, h: 0.42, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("⚡  INTENSIFIERS — Pekiştiriciler", {
    x: 5.28, y: 1.05, w: 4.34, h: 0.42,
    fontSize: 13, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0
  });

  // Güçlendirici listesi
  s.addText("Güçlendirici (>1.0):", {
    x: 5.35, y: 1.55, w: 4.2, h: 0.28, fontSize: 12, bold: true, color: C.navy, fontFace: "Calibri"
  });
  s.addText("çok:1.30  ·  gerçekten:1.25  ·  son derece:1.35\noldukça:1.20  ·  aşırı:1.30  ·  fazlasıyla:1.28\ngayet:1.18  ·  epey:1.15  ·  en:1.25", {
    x: 5.35, y: 1.82, w: 4.2, h: 0.85,
    fontSize: 11.5, color: C.neutral, fontFace: "Calibri"
  });

  s.addText("Zayıflatıcı (<1.0):", {
    x: 5.35, y: 2.68, w: 4.2, h: 0.28, fontSize: 12, bold: true, color: C.navy, fontFace: "Calibri"
  });
  s.addText("biraz:0.70  ·  az:0.65  ·  pek:0.75  ·  hafifçe:0.60", {
    x: 5.35, y: 2.94, w: 4.2, h: 0.3,
    fontSize: 11.5, color: C.neutral, fontFace: "Calibri"
  });

  s.addText("Örnekler:", {
    x: 5.35, y: 3.32, w: 4.2, h: 0.28, fontSize: 12, bold: true, color: C.neutral, fontFace: "Calibri"
  });
  const exs = [
    { t: '"çok harika"', c: "166534", r: "→ 0.95 × 1.30 = +1.235" },
    { t: '"gerçekten kötü"', c: "991B1B", r: "→ −0.90 × 1.25 = −1.125" },
    { t: '"biraz pahalı"', c: "374151", r: "→ −0.62 × 0.70 = −0.434" },
  ];
  exs.forEach((e, i) => {
    s.addText([
      { text: e.t, options: { bold: true, color: e.c } },
      { text: "  " + e.r, options: { color: C.neutral } }
    ], {
      x: 5.35, y: 3.62 + i * 0.37, w: 4.2, h: 0.35,
      fontSize: 12, fontFace: "Calibri"
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLAYT 6 — XAI: SHAP & LIME (projede nasıl kullanıldı)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  addHeader(s, "SHAP & LIME — Projede Nasıl Uygulandı?");

  // Örnek cümle bandı
  s.addShape("rect", { x: 0.3, y: 1.0, w: 9.4, h: 0.46, fill: { color: C.navyLt }, line: { color: C.navyMid, pt: 1 } });
  s.addText([
    { text: "Ortak örnek:  ", options: { color: C.gray } },
    { text: '"harika beğendim"', options: { bold: true, color: C.navy, fontFace: "Consolas" } },
    { text: "   →   harika: +0.95   |   beğendim: +0.88   |   rawScore = +1.83", options: { color: C.neutral } },
  ], {
    x: 0.3, y: 1.0, w: 9.4, h: 0.46,
    fontSize: 12.5, fontFace: "Calibri", align: "center", valign: "middle"
  });

  // ── SOL: SHAP ─────────────────────────────────────────────
  // Kart: y=1.56 → y=5.28 (h=3.72)
  s.addShape("rect", { x: 0.3, y: 1.56, w: 4.5, h: 3.72, fill: { color: C.white }, line: { color: C.navy, pt: 1.5 } });
  s.addShape("rect", { x: 0.3, y: 1.56, w: 4.5, h: 0.42, fill: { color: C.navy }, line: { color: C.navy } });
  s.addText("SHAP — Her kelimeyi tek tek çıkar", {
    x: 0.38, y: 1.56, w: 4.34, h: 0.42,
    fontSize: 13, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0
  });
  // Soru: y=2.04
  s.addText("Soru: \"Bu kelime olmasaydı skor ne olurdu?\"", {
    x: 0.45, y: 2.04, w: 4.2, h: 0.30,
    fontSize: 12, color: C.gray, fontFace: "Calibri", italic: true
  });
  // Tablo: y=2.38, 3 satır × 0.50 = 1.50 → biter y=3.88
  const shapTbl = [
    [
      { text: "Çıkarılan kelime", options: { bold: true, fill: { color: C.navy }, color: C.white, align: "center" } },
      { text: "Kalan rawScore",   options: { bold: true, fill: { color: C.navy }, color: C.white, align: "center" } },
      { text: "φ (katkı)",        options: { bold: true, fill: { color: C.navy }, color: C.white, align: "center" } },
    ],
    [
      { text: '"harika"',   options: { fill: { color: "FFF1F2" }, align: "center", bold: true, color: C.navy } },
      { text: "+0.88",      options: { fill: { color: "FFF1F2" }, align: "center", color: C.neutral } },
      { text: "+0.95  ⬆",  options: { fill: { color: "FFF1F2" }, align: "center", bold: true, color: "166534" } },
    ],
    [
      { text: '"beğendim"', options: { fill: { color: C.offWhite }, align: "center", bold: true, color: C.navy } },
      { text: "+0.95",      options: { fill: { color: C.offWhite }, align: "center", color: C.neutral } },
      { text: "+0.88  ⬆",  options: { fill: { color: C.offWhite }, align: "center", bold: true, color: "166534" } },
    ],
  ];
  s.addTable(shapTbl, {
    x: 0.38, y: 2.38, w: 4.2, colW: [1.55, 1.35, 1.3],
    border: { pt: 0.75, color: C.grayLt },
    fontSize: 12.5, fontFace: "Calibri", rowH: 0.50
  });
  // Not: y=3.95 (tablo bitti y=3.88)
  s.addText("φ = 1.83 − kalan skor   →   fark büyükse kelime önemli", {
    x: 0.38, y: 3.95, w: 4.2, h: 0.28,
    fontSize: 11.5, color: C.gray, fontFace: "Calibri", italic: true
  });
  // Deterministik kutusu: y=4.28
  s.addShape("rect", { x: 0.38, y: 4.30, w: 4.2, h: 0.44, fill: { color: C.navyLt }, line: { color: C.navyMid, pt: 1 } });
  s.addText("Deterministik — her seferinde aynı sonucu verir", {
    x: 0.38, y: 4.30, w: 4.2, h: 0.44,
    fontSize: 12, bold: true, color: C.navy, fontFace: "Calibri", align: "center", valign: "middle"
  });

  // ── SAĞ: LIME ─────────────────────────────────────────────
  // Kart: y=1.56 → y=5.28 (h=3.72)
  s.addShape("rect", { x: 5.2, y: 1.56, w: 4.5, h: 3.72, fill: { color: C.white }, line: { color: C.accent, pt: 1.5 } });
  s.addShape("rect", { x: 5.2, y: 1.56, w: 4.5, h: 0.42, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText("LIME — 120 rastgele kombinasyon dene", {
    x: 5.28, y: 1.56, w: 4.34, h: 0.42,
    fontSize: 13, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0
  });
  // Soru: y=2.04
  s.addText("Soru: \"Kelime varken skor, yokken skordan ne kadar yüksek?\"", {
    x: 5.28, y: 2.04, w: 4.3, h: 0.30,
    fontSize: 12, color: C.gray, fontFace: "Calibri", italic: true
  });
  // Tablo: y=2.38, 5 satır × 0.36 = 1.80 → biter y=4.18
  const limeTbl = [
    [
      { text: "Maske",    options: { bold: true, fill: { color: C.accent }, color: C.white, align: "center" } },
      { text: "harika",   options: { bold: true, fill: { color: C.accent }, color: C.white, align: "center" } },
      { text: "beğendim", options: { bold: true, fill: { color: C.accent }, color: C.white, align: "center" } },
      { text: "rawScore", options: { bold: true, fill: { color: C.accent }, color: C.white, align: "center" } },
    ],
    [
      { text: "[1, 1]", options: { fill: { color: C.offWhite }, align: "center" } },
      { text: "✓", options: { fill: { color: C.offWhite }, align: "center", color: "166534", bold: true } },
      { text: "✓", options: { fill: { color: C.offWhite }, align: "center", color: "166534", bold: true } },
      { text: "+1.83", options: { fill: { color: C.offWhite }, align: "center", color: "166534", bold: true } },
    ],
    [
      { text: "[1, 0]", options: { fill: { color: C.white }, align: "center" } },
      { text: "✓", options: { fill: { color: C.white }, align: "center", color: "166534", bold: true } },
      { text: "✗", options: { fill: { color: C.white }, align: "center", color: "991B1B" } },
      { text: "+0.95", options: { fill: { color: C.white }, align: "center", color: C.neutral } },
    ],
    [
      { text: "[0, 1]", options: { fill: { color: C.offWhite }, align: "center" } },
      { text: "✗", options: { fill: { color: C.offWhite }, align: "center", color: "991B1B" } },
      { text: "✓", options: { fill: { color: C.offWhite }, align: "center", color: "166534", bold: true } },
      { text: "+0.88", options: { fill: { color: C.offWhite }, align: "center", color: C.neutral } },
    ],
    [
      { text: "[0, 0]", options: { fill: { color: C.white }, align: "center" } },
      { text: "✗", options: { fill: { color: C.white }, align: "center", color: "991B1B" } },
      { text: "✗", options: { fill: { color: C.white }, align: "center", color: "991B1B" } },
      { text: "0.00",  options: { fill: { color: C.white }, align: "center", color: C.gray } },
    ],
  ];
  s.addTable(limeTbl, {
    x: 5.28, y: 2.38, w: 4.3, colW: [0.85, 1.05, 1.2, 1.2],
    border: { pt: 0.75, color: C.grayLt },
    fontSize: 12.5, fontFace: "Calibri", rowH: 0.36
  });
  // Formül: y=4.24 (tablo bitti y=4.18)
  s.addText([
    { text: 'LIME("harika")', options: { bold: true, color: C.navy, fontFace: "Consolas" } },
    { text: " = ort(1.83,0.95) − ort(0.88,0) = ", options: { color: C.neutral } },
    { text: "+0.95", options: { bold: true, color: "166534" } },
  ], {
    x: 5.28, y: 4.24, w: 4.3, h: 0.30,
    fontSize: 11.5, fontFace: "Calibri"
  });
  // Stokastik kutusu: y=4.58
  s.addShape("rect", { x: 5.28, y: 4.58, w: 4.2, h: 0.44, fill: { color: C.accentLt }, line: { color: C.accent, pt: 1 } });
  s.addText("Stokastik — 120 farklı kombinasyon, sonuç hafif değişebilir", {
    x: 5.28, y: 4.58, w: 4.2, h: 0.44,
    fontSize: 12, bold: true, color: "1D4ED8", fontFace: "Calibri", align: "center", valign: "middle"
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLAYT 7 — NEDEN HAM SKOR?
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  addHeader(s, "Neden Ham Skor? (rawScore Tasarımı)");

  // Soru bandı
  s.addText('XAI şunu sorar: "harika" kelimesini çıkarınca skor ne kadar değişti?', {
    x: 0.3, y: 1.02, w: 9.4, h: 0.38,
    fontSize: 14, bold: true, color: C.navy, fontFace: "Calibri", align: "center"
  });

  // ── SOL KUTU: Normalize skor (kötü) ───────────────────────
  s.addShape("rect", { x: 0.3, y: 1.5, w: 4.5, h: 3.55,
    fill: { color: "FFF5F5" }, line: { color: "DC2626", pt: 2 } });
  s.addShape("rect", { x: 0.3, y: 1.5, w: 4.5, h: 0.44,
    fill: { color: "DC2626" }, line: { color: "DC2626" } });
  s.addText("❌  Normalize Skor (yüzde) ile", {
    x: 0.38, y: 1.5, w: 4.34, h: 0.44,
    fontSize: 13, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0
  });

  const badLines = [
    { t: '"harika beğendim"', r: "→  Pozitif %100" },
    { t: '"beğendim"  (harika çıkarıldı)', r: "→  Pozitif %100" },
  ];
  badLines.forEach((l, i) => {
    s.addShape("rect", { x: 0.45, y: 2.06 + i * 0.66, w: 4.15, h: 0.55,
      fill: { color: C.white }, line: { color: "FECACA", pt: 1 } });
    s.addText([
      { text: l.t, options: { bold: true, color: C.neutral, fontFace: "Consolas" } },
      { text: "\n" + l.r, options: { color: "991B1B", bold: true } }
    ], { x: 0.5, y: 2.06 + i * 0.66, w: 4.05, h: 0.55, fontSize: 12, fontFace: "Calibri", valign: "middle" });
  });

  s.addShape("rect", { x: 0.45, y: 3.44, w: 4.15, h: 0.52,
    fill: { color: "FEE2E2" }, line: { color: "DC2626", pt: 1 } });
  s.addText('Fark = 0  →  "harika önemsiz görünür"  (YANLIŞ!)', {
    x: 0.45, y: 3.44, w: 4.15, h: 0.52,
    fontSize: 12.5, bold: true, color: "991B1B", fontFace: "Calibri", align: "center", valign: "middle"
  });

  s.addText("Yüzde her zaman %100'e tamamlandığından\nkelime ekleyip çıkarmak farkı göstermiyor.", {
    x: 0.45, y: 4.04, w: 4.15, h: 0.6,
    fontSize: 11.5, color: C.gray, fontFace: "Calibri"
  });

  // ── SAĞ KUTU: Ham skor (iyi) ───────────────────────────────
  s.addShape("rect", { x: 5.2, y: 1.5, w: 4.5, h: 3.55,
    fill: { color: "F0FDF4" }, line: { color: "16A34A", pt: 2 } });
  s.addShape("rect", { x: 5.2, y: 1.5, w: 4.5, h: 0.44,
    fill: { color: "16A34A" }, line: { color: "16A34A" } });
  s.addText("✓  Ham Skor (rawScore) ile", {
    x: 5.28, y: 1.5, w: 4.34, h: 0.44,
    fontSize: 13, bold: true, color: C.white, fontFace: "Calibri", valign: "middle", margin: 0
  });

  const goodLines = [
    { t: '"harika beğendim"', r: "→  rawScore = +1.83" },
    { t: '"beğendim"  (harika çıkarıldı)', r: "→  rawScore = +0.88" },
  ];
  goodLines.forEach((l, i) => {
    s.addShape("rect", { x: 5.35, y: 2.06 + i * 0.66, w: 4.15, h: 0.55,
      fill: { color: C.white }, line: { color: "BBF7D0", pt: 1 } });
    s.addText([
      { text: l.t, options: { bold: true, color: C.neutral, fontFace: "Consolas" } },
      { text: "\n" + l.r, options: { color: "166534", bold: true } }
    ], { x: 5.4, y: 2.06 + i * 0.66, w: 4.05, h: 0.55, fontSize: 12, fontFace: "Calibri", valign: "middle" });
  });

  s.addShape("rect", { x: 5.35, y: 3.44, w: 4.15, h: 0.52,
    fill: { color: "DCFCE7" }, line: { color: "16A34A", pt: 1 } });
  s.addText("Fark = +0.95  →  harika çok önemli  ✓", {
    x: 5.35, y: 3.44, w: 4.15, h: 0.52,
    fontSize: 12.5, bold: true, color: "166534", fontFace: "Calibri", align: "center", valign: "middle"
  });

  s.addText("rawScore = posSum − negSum\nKelime ne kadar katkı sağladıysa o kadar görünür.", {
    x: 5.35, y: 4.04, w: 4.15, h: 0.6,
    fontSize: 11.5, color: C.gray, fontFace: "Calibri"
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLAYT 8 — WEB ARAYÜZÜ
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  addHeader(s, "Web Arayüzü Bileşenleri");

  const items = [
    { icon: "📝", label: "Metin Girişi", desc: "Türkçe metin alanı + Ctrl+Enter kısayolu" },
    { icon: "💡", label: "11 Örnek Cümle", desc: "Pozitif / Negatif / Nötr / Karma hazır örnekler" },
    { icon: "🌡️",  label: "Kelime Isı Haritası", desc: "Her token renk sınıfıyla gösterilir  (pos-strong → neg-strong)" },
    { icon: "📊", label: "SHAP Grafiği", desc: "Pozitif sağa / Negatif sola — en etkili 8 kelime" },
    { icon: "📈", label: "LIME Grafiği", desc: "Bağımsız hesaplanır, SHAP ile yan yana karşılaştırma" },
    { icon: "📋", label: "Karşılaştırma Tablosu", desc: "Kelime başına SHAP & LIME değerleri + işaret uyumu ✓/✗" },
  ];

  const cols = 2, rows = 3;
  const w = 4.5, h = 1.18, xOff = 0.3, yOff = 1.05, xGap = 4.85, yGap = 1.28;

  items.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = xOff + col * xGap;
    const y = yOff + row * yGap;

    s.addShape("rect", {
      x, y, w, h,
      fill: { color: C.white }, line: { color: C.grayLt, pt: 1 },
      shadow: { type: "outer", color: "000000", blur: 5, offset: 2, angle: 135, opacity: 0.07 }
    });
    // Sol accent bar
    s.addShape("rect", { x, y, w: 0.06, h, fill: { color: C.navy }, line: { color: C.navy } });
    // İkon
    s.addText(item.icon, { x: x + 0.12, y: y + 0.08, w: 0.6, h: 0.52, fontSize: 20, align: "center" });
    // Başlık
    s.addText(item.label, {
      x: x + 0.68, y: y + 0.06, w: w - 0.82, h: 0.38,
      fontSize: 13, bold: true, color: C.navy, fontFace: "Calibri"
    });
    // Açıklama
    s.addText(item.desc, {
      x: x + 0.68, y: y + 0.44, w: w - 0.82, h: 0.62,
      fontSize: 11.5, color: C.gray, fontFace: "Calibri"
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLAYT 9 — ÖRNEK ANALİZ SONUÇLARI
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  addHeader(s, "Örnek Analiz Sonuçları");

  const rows = [
    { cumle: "Bu film gerçekten harikaydı, çok beğendim", pos: "%78", neg: "%0",  neu: "%22", karar: "Pozitif", color: "166534", bg: "F0FDF4" },
    { cumle: "Servis çok kötüydü, yemekler soğuk geldi",  pos: "%0",  neg: "%85", neu: "%15", karar: "Negatif", color: "991B1B", bg: "FFF1F2" },
    { cumle: "Ürün kaliteli ama fiyat biraz pahalı",       pos: "%38", neg: "%27", neu: "%35", karar: "Pozitif", color: "166534", bg: "F0FDF4" },
    { cumle: "Hava bugün bulutlu ve rüzgarlı",             pos: "%0",  neg: "%0",  neu: "%100",karar: "Nötr",    color: "374151", bg: "F3F4F6" },
    { cumle: "Toplantı saat 14:00'te başlayacak",          pos: "%0",  neg: "%0",  neu: "%100",karar: "Nötr",    color: "374151", bg: "F3F4F6" },
  ];

  const tblData = [
    [
      { text: "Cümle",  options: { fill: { color: C.navy }, bold: true, color: C.white } },
      { text: "Pos %",  options: { fill: { color: C.navy }, bold: true, color: C.white, align: "center" } },
      { text: "Neg %",  options: { fill: { color: C.navy }, bold: true, color: C.white, align: "center" } },
      { text: "Nötr %", options: { fill: { color: C.navy }, bold: true, color: C.white, align: "center" } },
      { text: "Karar",  options: { fill: { color: C.navy }, bold: true, color: C.white, align: "center" } },
    ],
    ...rows.map(r => [
      { text: r.cumle,  options: { fill: { color: r.bg } } },
      { text: r.pos,    options: { fill: { color: r.bg }, align: "center", color: r.pos !== "%0" ? "166534" : C.gray, bold: r.pos !== "%0" } },
      { text: r.neg,    options: { fill: { color: r.bg }, align: "center", color: r.neg !== "%0" ? "991B1B" : C.gray, bold: r.neg !== "%0" } },
      { text: r.neu,    options: { fill: { color: r.bg }, align: "center" } },
      { text: r.karar,  options: { fill: { color: r.bg }, align: "center", bold: true, color: r.color } },
    ])
  ];

  s.addTable(tblData, {
    x: 0.25, y: 1.05, w: 9.5,
    colW: [4.5, 1.0, 1.0, 1.1, 1.9],
    border: { pt: 0.75, color: C.grayLt },
    fontSize: 12.5, fontFace: "Calibri",
    rowH: 0.72
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLAYT 10 — SONUÇ
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Sol parlak accent çizgisi
  s.addShape("rect", { x: 0, y: 0, w: 0.07, h: 5.625, fill: { color: C.accent }, line: { color: C.accent } });

  // Başlık
  s.addText("Sonuç & Katkılar", {
    x: 0.3, y: 0.15, w: 9.4, h: 0.7,
    fontSize: 32, bold: true, color: C.white,
    fontFace: "Calibri", align: "left"
  });
  s.addShape("rect", { x: 0.3, y: 0.85, w: 9.4, h: 0.03, fill: { color: "3A5A8A" }, line: { color: "3A5A8A" } });

  // Katkılar
  const katkis = [
    { bold: "rawScore tasarımı:", rest: "  XAI'nin anlamlı sonuç üretmesini sağladı" },
    { bold: "LOO = Exact Shapley:", rest: "  O(2ⁿ) → O(n) karmaşıklık azaltımı" },
    { bold: "Zayıflatıcı kelimeler (biraz, az, pek):", rest: "  Derecelendirme ifadelerinin doğru modellenmesi" },
    { bold: "Nötr seyrek açıklama:", rest: "  φᵢ=0 teorik gerekçesi (Dummy Axiom) ortaya kondu" },
    { bold: "Sunucusuz mimari:", rest: "  Tarayıcıda doğrudan çalışır, altyapı gerektirmez" },
  ];

  katkis.forEach((k, i) => {
    s.addText([
      { text: "✓  ", options: { color: "4ADE80", bold: true } },
      { text: k.bold, options: { color: C.white, bold: true } },
      { text: k.rest, options: { color: "B0C4DE" } }
    ], {
      x: 0.3, y: 0.98 + i * 0.52, w: 9.4, h: 0.5,
      fontSize: 13.5, fontFace: "Calibri"
    });
  });

  // Ayırıcı
  s.addShape("rect", { x: 0.3, y: 3.64, w: 9.4, h: 0.025, fill: { color: "3A5A8A" }, line: { color: "3A5A8A" } });

  // Sınırlılıklar başlık
  s.addText("Sınırlılıklar", {
    x: 0.3, y: 3.72, w: 4, h: 0.35,
    fontSize: 14, bold: true, color: "B0C4DE", fontFace: "Calibri"
  });

  const sinirliliklar = [
    "Sözlükte olmayan kelimeler (argo, neolojizm) nötr sayılır",
    "Morfolojik analiz eksikliği — aynı kökün farklı biçimleri ayrı giriş gerektirir",
  ];
  sinirliliklar.forEach((sn, i) => {
    s.addText([
      { text: "·  ", options: { color: C.accent, bold: true } },
      { text: sn, options: { color: "8AAFD4" } }
    ], {
      x: 0.3, y: 4.08 + i * 0.38, w: 9.4, h: 0.36,
      fontSize: 12.5, fontFace: "Calibri"
    });
  });

  // Alt çizgi
  s.addShape("rect", { x: 0, y: 5.545, w: 10, h: 0.08, fill: { color: C.navyMid }, line: { color: C.navyMid } });
  s.addText("NEVŞEHİR HACI BEKTAŞ VELİ ÜNİVERSİTESİ  |  Doğal Dil İşleme  |  2025–2026 Bahar", {
    x: 0.3, y: 5.3, w: 9.4, h: 0.24,
    fontSize: 9, color: "5A7FA0", fontFace: "Calibri", align: "center"
  });
}

// ─── Kaydet ────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "D:\\Projects\\DuyguAnalizi\\DuyguAnalizi_Sunum_v2.pptx" })
  .then(() => console.log("✅ Sunum oluşturuldu: DuyguAnalizi_Sunum.pptx"))
  .catch(err => console.error("❌ Hata:", err));
