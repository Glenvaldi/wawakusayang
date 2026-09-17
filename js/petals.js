/* ============================================================
   petals.js — kelopak yang jatuh di latar belakang.
   Digambar di <canvas>, ringan, berhenti sendiri kalau tab
   tidak dilihat atau kalau perangkat minta gerakan dikurangi.
   ============================================================ */

const Petals = (() => {
  let kanvas, ctx, isi = [], jalan = false, rafId = null;
  let W = 0, H = 0, dpr = 1;
  let warna = ["#FFFBEE", "#F8D77A", "#F5BE45", "#FDF0C8"];
  let jumlahDasar = 14;

  const hematGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ukur() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = kanvas.clientWidth;
    H = kanvas.clientHeight;
    kanvas.width = Math.round(W * dpr);
    kanvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function kelopakBaru(dariAtas = false) {
    const s = 5 + Math.random() * 11;
    return {
      x: Math.random() * W,
      y: dariAtas ? -20 - Math.random() * H * 0.4 : Math.random() * H,
      s,
      sudut: Math.random() * Math.PI * 2,
      putar: (Math.random() - 0.5) * 0.028,
      turun: 0.28 + Math.random() * 0.62 + s * 0.028,
      goyangKuat: 8 + Math.random() * 26,
      goyangCepat: 0.006 + Math.random() * 0.013,
      fase: Math.random() * Math.PI * 2,
      warna: warna[Math.floor(Math.random() * warna.length)],
      alpha: 0.5 + Math.random() * 0.45,
      pipih: 0.45 + Math.random() * 0.5
    };
  }

  function gambarKelopak(p) {
    const r = p.s;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.sudut);
    ctx.scale(1, p.pipih);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.warna;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-r, -r * 0.35, -r * 0.62, -r * 1.05, 0, -r * 1.15);
    ctx.bezierCurveTo(r * 0.62, -r * 1.05, r, -r * 0.35, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function bingkai(t) {
    ctx.clearRect(0, 0, W, H);
    for (let i = isi.length - 1; i >= 0; i--) {
      const p = isi[i];
      p.y += p.turun;
      p.x += Math.sin(t * p.goyangCepat + p.fase) * 0.9;
      p.sudut += p.putar;
      gambarKelopak(p);
      if (p.y - p.s * 2 > H) {
        if (p.sekali) { isi.splice(i, 1); continue; }
        Object.assign(p, kelopakBaru(true));
      }
    }
    if (jalan) rafId = requestAnimationFrame(bingkai);
  }

  function pasang(induk, opsi = {}) {
    if (opsi.warna) warna = opsi.warna;
    if (opsi.jumlah) jumlahDasar = opsi.jumlah;

    if (!kanvas) {
      kanvas = document.createElement("canvas");
      kanvas.className = "lapisan-kelopak";
      ctx = kanvas.getContext("2d");
      window.addEventListener("resize", () => { if (kanvas) ukur(); }, { passive: true });
      document.addEventListener("visibilitychange", () => {
        document.hidden ? jeda() : lanjut();
      });
    }
    (induk || document.body).appendChild(kanvas);
    kanvas.classList.toggle("lapisan-kelopak--belakang", !!opsi.belakang);
    ukur();

    if (opsi.pertahankan && isi.length) { lanjut(); return; }
    isi = [];
    if (hematGerak) { gambarSekali(); return; }
    const n = window.innerWidth < 640 ? Math.round(jumlahDasar * 0.6) : jumlahDasar;
    for (let i = 0; i < n; i++) isi.push(kelopakBaru(false));
    lanjut();
  }

  function gambarSekali() {
    for (let i = 0; i < 10; i++) isi.push(kelopakBaru(false));
    ctx.clearRect(0, 0, W, H);
    isi.forEach(gambarKelopak);
  }

  /* hamburan kelopak sekali lewat — dipakai saat tirai terbuka / penutup */
  function hujan(n = 34) {
    if (!kanvas || hematGerak) return;
    for (let i = 0; i < n; i++) {
      const p = kelopakBaru(true);
      p.sekali = true;
      p.turun *= 1.6;
      isi.push(p);
    }
    lanjut();
  }

  function lanjut() {
    if (jalan || hematGerak || !kanvas) return;
    jalan = true;
    rafId = requestAnimationFrame(bingkai);
  }

  function jeda() {
    jalan = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function lepas() {
    jeda();
    if (kanvas && kanvas.parentNode) kanvas.parentNode.removeChild(kanvas);
    isi = [];
  }

  return { pasang, hujan, jeda, lanjut, lepas };
})();
