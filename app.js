// ─── UYGULAMA KONTROLCÜSÜ ────────────────────────────────────────────────────

document.getElementById('current-year').textContent = new Date().getFullYear();

document.getElementById('txt').addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') analyze();
});

function setEx(el) {
  document.getElementById('txt').value = el.textContent.trim();
  analyze();
}

function clearAll() {
  document.getElementById('txt').value = '';
  document.getElementById('result').style.display = 'none';
  document.getElementById('loading').style.display = 'none';
}

// ══════════════════════════════════════════════════════════════════════════════
// MODEL ÇIKTISI
// Ham (normalize edilmemiş) skor: posSum - negSum
// Normalized pct.pos - pct.neg hep ±1.0 döndüğünden bu kullanılmalı.
// ══════════════════════════════════════════════════════════════════════════════

function rawScore(tokenList) {
  if (!tokenList || tokenList.length === 0) return 0;
  const res = window.SentimentEngine.analyzeTokens(tokenList);
  let pos = 0, neg = 0, neuCount = 0;
  res.forEach(t => {
    if (t.score > 0)           pos += t.score;
    else if (t.score < 0)      neg += Math.abs(t.score);
    if (t.isExplicitNeutral)   neuCount++;
  });

  return pos - neg;
}

// ══════════════════════════════════════════════════════════════════════════════
// SHAP — Shapley Additive Explanations
// Yöntem: Leave-One-Out Shapley approximation
// Her kelimeyi tam metinden çıkarıp skor farkını ölçer.
// Negatif etkileşimler (olumsuzlayıcı+pekiştirici) otomatik yakalanır.
// ══════════════════════════════════════════════════════════════════════════════

function computeSHAP(tokens) {
  const fullScore = rawScore(tokens);
  const results   = [];

  tokens.forEach((tok, i) => {
    const without      = tokens.filter((_, j) => j !== i);
    const withoutScore = rawScore(without);
    // Shapley değeri: kelime varken skor - kelime yokken skor
    const phi = fullScore - withoutScore;

    results.push({ word: tok, value: phi });
  });

  return results
    .filter(r => Math.abs(r.value) > 0.005)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 8)
    .map(r => ({ ...r, value: +r.value.toFixed(3) }));
}

// ══════════════════════════════════════════════════════════════════════════════
// LIME — Local Interpretable Model-agnostic Explanations
// Yöntem: Rastgele binary maskeleme → koşullu beklenti farkı
// Her kelime için: "bu kelime maskede varken ortalama skor" -
//                  "bu kelime maskede yokken ortalama skor"
// SHAP'tan farkı: kelimeyi her zaman TAM bağlamda değil,
// RASTGELE alt kümelerde test eder → etkileşim etkisi farklı ölçülür.
// ══════════════════════════════════════════════════════════════════════════════

function computeLIME(tokens) {
  const n = tokens.length;
  const M = 120;  // pertürbasyon sayısı

  // Her token için dahil edildiği ve dışarıda bırakıldığı durumlardaki skorlar
  const whenIn  = Array.from({ length: n }, () => []);
  const whenOut = Array.from({ length: n }, () => []);

  for (let m = 0; m < M; m++) {
    // Rastgele binary maske (her kelime %50 ihtimalle dahil)
    const mask   = tokens.map(() => Math.random() < 0.5 ? 1 : 0);
    const subset = tokens.filter((_, i) => mask[i] === 1);
    const score  = rawScore(subset);

    mask.forEach((present, i) => {
      if (present) whenIn[i].push(score);
      else         whenOut[i].push(score);
    });
  }

  const results = [];
  tokens.forEach((tok, i) => {
    const avgIn  = whenIn[i].length  ? whenIn[i].reduce((a,b)=>a+b,0)  / whenIn[i].length  : 0;
    const avgOut = whenOut[i].length ? whenOut[i].reduce((a,b)=>a+b,0) / whenOut[i].length : 0;
    // LIME önemi: kelime dahilken ortalama çıktı - dışarıdayken ortalama çıktı
    const limeVal = avgIn - avgOut;

    results.push({ word: tok, value: limeVal });
  });

  return results
    .filter(r => Math.abs(r.value) > 0.005)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 8)
    .map(r => ({ ...r, value: +r.value.toFixed(3) }));
}

// ══════════════════════════════════════════════════════════════════════════════
// ANA ANALİZ
// ══════════════════════════════════════════════════════════════════════════════

function analyze() {
  const txt = document.getElementById('txt').value.trim();
  if (!txt) return;

  document.getElementById('result').style.display = 'none';
  document.getElementById('loading').style.display = 'flex';

  // XAI hesaplamaları biraz sürebileceğinden setTimeout ile UI bloke olmasın
  setTimeout(() => {
    const { tokenize, analyzeTokens, computeSentiment, buildXAI } = window.SentimentEngine;

    const tokens  = tokenize(txt);
    const tokRes  = analyzeTokens(tokens);
    const sent    = computeSentiment(tokRes);
    const xaiText = buildXAI(tokRes, sent);
    const shap    = computeSHAP(tokens);
    const lime    = computeLIME(tokens);

    renderResult(tokRes, sent, xaiText, shap, lime);

    document.getElementById('loading').style.display = 'none';
    document.getElementById('result').style.display = 'flex';
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 80);
}

// ══════════════════════════════════════════════════════════════════════════════
// RENDER
// ══════════════════════════════════════════════════════════════════════════════

function labelTR(lbl) {
  return lbl === 'positive' ? 'Pozitif' : lbl === 'negative' ? 'Negatif' : 'Nötr';
}
function emojiFor(lbl) {
  return lbl === 'positive' ? '😊' : lbl === 'negative' ? '😞' : '😐';
}
function tokenClass(score, type) {
  if (type === 'negator')     return 'negator';
  if (type === 'intensifier') return 'intensifier';
  const a = Math.abs(score);
  if (score > 0) return a > 0.70 ? 'pos-strong' : a > 0.35 ? 'pos-mid' : 'pos-weak';
  if (score < 0) return a > 0.70 ? 'neg-strong' : a > 0.35 ? 'neg-mid' : 'neg-weak';
  return 'neutral';
}

function renderResult(tokRes, sent, xaiText, shap, lime) {

  // ── Karar ──────────────────────────────────────────────────────────────────
  document.getElementById('verdict-emoji').textContent = emojiFor(sent.label);
  const lbl = document.getElementById('verdict-label');
  lbl.textContent = labelTR(sent.label);
  lbl.className   = 'verdict-label ' + sent.label;

  const confPct = Math.round(sent.conf * 100);
  document.getElementById('verdict-sub').textContent =
    `${confPct}% güven · ${tokRes.filter(t => t.score !== 0).length} etkili kelime`;

  document.getElementById('s-pos').textContent = Math.round(sent.pct.pos * 100) + '%';
  document.getElementById('s-neg').textContent = Math.round(sent.pct.neg * 100) + '%';
  document.getElementById('s-neu').textContent = Math.round(sent.pct.neu * 100) + '%';

  // ── Güven çubuğu ────────────────────────────────────────────────────────────
  const bar = document.getElementById('conf-bar');
  bar.style.width = confPct + '%';
  bar.className   = 'conf-bar ' + sent.label;
  document.getElementById('conf-pct').textContent = confPct + '%';

  // ── Kelime ısı haritası ─────────────────────────────────────────────────────
  const tokDiv = document.getElementById('tokens');
  tokDiv.innerHTML = '';
  tokRes.forEach(t => {
    const sp  = document.createElement('span');
    sp.className   = 'token ' + tokenClass(t.score, t.type);
    sp.textContent = t.word;
    const tip = document.createElement('span');
    tip.className  = 'token-tip';
    if (t.type === 'negator')          tip.textContent = 'Olumsuzlayıcı';
    else if (t.type === 'intensifier') tip.textContent = 'Pekiştirici';
    else if (t.score > 0) tip.textContent = `+${t.score.toFixed(2)}`;
    else if (t.score < 0) tip.textContent = `${t.score.toFixed(2)}`;
    else                  tip.textContent = 'Nötr';
    sp.appendChild(tip);
    tokDiv.appendChild(sp);
  });

  // ── SHAP & LIME Grafikleri ──────────────────────────────────────────────────
  renderBarChart('shap-chart', shap);
  renderBarChart('lime-chart', lime);

  // ── Karşılaştırma tablosu ───────────────────────────────────────────────────
  renderComparison(shap, lime);

  // ── Açıklama ────────────────────────────────────────────────────────────────
  document.getElementById('xai-text').innerHTML = xaiText;
}

// ─── BAR GRAFİĞİ ─────────────────────────────────────────────────────────────

function renderBarChart(id, values) {
  const container = document.getElementById(id);
  container.innerHTML = '';

  if (!values.length) {
    container.innerHTML = '<p style="font-size:.78rem;color:#94a3b8;padding:.4rem 0;line-height:1.6">Bireysel kelime katkısı tespit edilemedi.<br><span style="font-size:.72rem">Nötr kararlarda bu beklenen bir sonuçtur: karar kelimelerden değil, duygu sinyalinin yokluğundan gelir.</span></p>';
    return;
  }

  const maxAbs = Math.max(...values.map(v => Math.abs(v.value)), 0.001);

  values.forEach(item => {
    const pct   = Math.min((Math.abs(item.value) / maxAbs) * 46, 46);
    const isPos = item.value >= 0;
    const valStr = (isPos ? '+' : '') + item.value.toFixed(3);

    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `
      <span class="bar-word" title="${item.word}">${item.word}</span>
      <div class="bar-track">
        <div class="bar-center"></div>
        <div class="bar-fill ${isPos ? 'pos-fill' : 'neg-fill'}" style="width:${pct}%"></div>
      </div>
      <span class="bar-val ${isPos ? 'pos-val' : 'neg-val'}">${valStr}</span>`;
    container.appendChild(row);
  });
}

// ─── KARŞILAŞTIRMA TABLOSU ────────────────────────────────────────────────────

function renderComparison(shap, lime) {
  const container = document.getElementById('comparison-table');

  const shapMap = Object.fromEntries(shap.map(v => [v.word, v.value]));
  const limeMap = Object.fromEntries(lime.map(v => [v.word, v.value]));
  const allWords = [...new Set([...shap.map(v=>v.word), ...lime.map(v=>v.word)])].slice(0, 8);

  if (!allWords.length) {
    container.innerHTML = '<p style="font-size:.78rem;color:#94a3b8;padding:.5rem">Yeterli veri yok.</p>';
    return;
  }

  const header = `
    <div class="cmp-row cmp-header">
      <span>Kelime</span><span>SHAP</span><span>LIME</span><span>Uyum</span>
    </div>`;

  const rows = allWords.map(w => {
    const s = shapMap[w] !== undefined ? shapMap[w] : null;
    const l = limeMap[w] !== undefined ? limeMap[w] : null;

    const fmtVal = (v, color) => v !== null
      ? `<span style="font-family:var(--mono);font-weight:600;color:${color}">${(v>=0?'+':'')+v.toFixed(3)}</span>`
      : '<span style="color:#94a3b8">—</span>';

    const sc = s === null ? '#94a3b8' : s > 0 ? '#16a34a' : '#dc2626';
    const lc = l === null ? '#94a3b8' : l > 0 ? '#16a34a' : '#dc2626';

    const agree = s !== null && l !== null ? Math.sign(s) === Math.sign(l) : null;
    const agreeHtml = agree === null ? '<span style="color:#94a3b8">—</span>'
      : agree
        ? '<span class="cmp-agree agree-yes">✓ Evet</span>'
        : '<span class="cmp-agree agree-no">✗ Farklı</span>';

    return `<div class="cmp-row">
      <span class="cmp-word">${w}</span>
      ${fmtVal(s, sc)}
      ${fmtVal(l, lc)}
      ${agreeHtml}
    </div>`;
  });

  container.innerHTML = header + rows.join('');
}
