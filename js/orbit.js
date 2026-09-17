/* ============================================================
   orbit.js — adegan "Dunia kecil kita".

   Sebuah hati yang bersinar di tengah, dikelilingi kartu-kartu
   kenangan yang mengorbit: lewat di belakang hati (mengecil,
   meredup, sedikit buram), lalu muncul lagi di depan.
   Tiap kartu bisa diketuk untuk membuka isinya.

   Semua digambar sendiri — hati, bunga, bintang, planet.
   Satu-satunya gambar dari luar adalah foto yang kamu taruh
   sendiri di assets/foto/.

   Yang perlu kamu ubah ada di config.js bagian `dunia`.
   ============================================================ */

const Dunia = (() => {
  "use strict";

  const hematGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* acak yang bisa diulang — biar posisi bintang tidak loncat-loncat */
  function acakDari(benih) {
    let s = benih >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  const aman = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const el = (tag, kelas, isi) => {
    const n = document.createElement(tag);
    if (kelas) n.className = kelas;
    if (isi != null) n.innerHTML = isi;
    return n;
  };

  /* menerima id polos maupun tautan penuh */
  function idSpotify(v) {
    if (!v) return "";
    const m = String(v).match(/track[\/:]([A-Za-z0-9]+)/);
    return m ? m[1] : String(v).trim().split("?")[0];
  }
  function idYoutube(v) {
    if (!v) return "";
    const s = String(v).trim();
    const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : s.split("?")[0];
  }

  /* ============================================================
     IKON KECIL untuk kartu yang bukan foto
     ============================================================ */
  const IKON = {
    surat: `<svg viewBox="0 0 24 24" class="satelit__ikon" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="1.6"/>
      <path d="M3.7 6.6 12 12.9l8.3-6.3"/></svg>`,
    lagu: `<svg viewBox="0 0 24 24" class="satelit__ikon" aria-hidden="true">
      <path d="M9 17.5V5.2l10-2v12"/>
      <ellipse cx="6.6" cy="17.6" rx="2.6" ry="2.2"/>
      <ellipse cx="16.6" cy="15.4" rx="2.6" ry="2.2"/></svg>`,
    video: `<svg viewBox="0 0 24 24" class="satelit__ikon" aria-hidden="true">
      <rect x="2.6" y="5" width="18.8" height="14" rx="3.4"/>
      <path d="m10.2 9.6 5.6 2.5-5.6 2.5Z"/></svg>`,
    catatan: `<svg viewBox="0 0 24 24" class="satelit__ikon" aria-hidden="true">
      <path d="M6 3h8.5L19 7.4V21H6Z"/><path d="M14.3 3v4.4H19"/>
      <path d="M9 12.4h6M9 16h4.2"/></svg>`,
    peta: `<svg viewBox="0 0 24 24" class="satelit__ikon" aria-hidden="true">
      <path d="M12 21c4-4.6 6-8 6-10.8A6 6 0 0 0 6 10.2C6 13 8 16.4 12 21Z"/>
      <circle cx="12" cy="10.2" r="2.2"/></svg>`
  };

  function ikonKartu(k, tema, i) {
    if (k.jenis === "buket" || k.jenis === "bunga") {
      return `<svg viewBox="-50 -50 100 100" class="satelit__bunga" aria-hidden="true">
        ${Flora.bunga(k.bunga && k.bunga[0] ? k.bunga[0].jenis : "mawar", 38, tema, i + 11)}</svg>`;
    }
    return IKON[k.jenis] || IKON.catatan;
  }

  /* ============================================================
     HATI DI TENGAH
     Bentuknya satu kurva bezier, diisi gradasi hangat, lalu
     ditaburi bunga kecil yang dipotong mengikuti bentuk hati.
     ============================================================ */
  const JALUR_HATI =
    "M0 70C-40 36,-78 6,-78 -26C-78 -58,-50 -74,-26 -68" +
    "C-12 -64,-4 -54,0 -44C4 -54,12 -64,26 -68" +
    "C50 -74,78 -58,78 -26C78 6,40 36,0 70Z";

  /* bunga kecil yang murah: satu cincin kelopak + satu inti.
     Bunga penuh dari flora.js terlalu berat kalau ditabur puluhan
     kali di dalam hati — SVG-nya bisa ratusan kilobita. */
  function kembangKecil(r, warna, intiWarna, jumlah = 6, putar = 0) {
    let out = "";
    const d = Flora.kelopak(r, r * 0.42, 0.45);
    for (let i = 0; i < jumlah; i++) {
      out += `<path d="${d}" fill="${warna}" transform="rotate(${(putar + (360 / jumlah) * i).toFixed(0)})"/>`;
    }
    return out + `<circle r="${(r * 0.26).toFixed(1)}" fill="${intiWarna}"/>`;
  }

  function hatiSVG(tema, benih = 408) {
    const p = Flora.PALET[tema] || Flora.PALET.kuning;
    const acak = acakDari(benih);

    /* bunga-bunga kecil di dalam hati */
    let taburan = "";
    for (let i = 0; i < 26; i++) {
      const x = (-76 + acak() * 152).toFixed(1);
      const y = (-66 + acak() * 130).toFixed(1);
      const r = (4.5 + acak() * 9);
      const a = (acak() * 360).toFixed(0);
      const w = p.kelopak[2 + Math.floor(acak() * 3)] || p.kelopak[2];
      const c = p.inti[Math.floor(acak() * p.inti.length)];
      taburan += `<g transform="translate(${x} ${y}) rotate(${a})" opacity="${(0.4 + acak() * 0.45).toFixed(2)}">
        ${kembangKecil(r, w, c, acak() > .5 ? 6 : 5)}</g>`;
    }

    /* empat kuntum yang lebih besar sebagai penanda, digambar penuh */
    let kuntum = "";
    [["mawar", -36, 4, 19], ["daisy", 32, -20, 17], ["kuncup", 8, 40, 14], ["mawar", 22, 26, 13]]
      .forEach(([j, x, y, r], i) => {
        kuntum += `<g transform="translate(${x} ${y}) rotate(${(i * 47) % 360})" opacity=".68">
          ${Flora.bunga(j, r, tema, i * 13 + 5)}</g>`;
      });
    taburan += kuntum;

    /* tangkai samar supaya bagian dalam tidak terasa kosong */
    let tangkai = "";
    for (let i = 0; i < 7; i++) {
      const x = (-56 + acak() * 112).toFixed(1);
      const y = (10 + acak() * 52).toFixed(1);
      const t = (22 + acak() * 34).toFixed(1);
      tangkai += `<path d="M${x} ${y}q${(acak() * 14 - 7).toFixed(1)} ${-t / 2} 0 ${-t}"
        fill="none" stroke="${p.daun[i % p.daun.length]}" stroke-width="1.3"
        opacity="${(0.18 + acak() * 0.2).toFixed(2)}" stroke-linecap="round"/>`;
    }

    return `<svg viewBox="-120 -118 240 236" class="hati-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <clipPath id="hati-potong"><path d="${JALUR_HATI}"/></clipPath>

        <radialGradient id="hati-badan" cx="42%" cy="32%" r="78%">
          <stop offset="0%"   stop-color="${p.kelopak[0]}"/>
          <stop offset="30%"  stop-color="${p.kelopak[1]}"/>
          <stop offset="64%"  stop-color="${p.kelopak[2]}"/>
          <stop offset="100%" stop-color="${p.kelopak[3]}"/>
        </radialGradient>

        <!-- cahaya kecil di jantung hati, sengaja tidak lebar
             supaya bunga di dalamnya tetap kelihatan -->
        <radialGradient id="hati-nyala" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="#FFFDF6" stop-opacity=".92"/>
          <stop offset="34%"  stop-color="${p.kelopak[1]}" stop-opacity=".34"/>
          <stop offset="100%" stop-color="${p.kelopak[2]}" stop-opacity="0"/>
        </radialGradient>

        <!-- tepi yang lebih gelap, biar hatinya terasa membulat -->
        <radialGradient id="hati-tepi" cx="46%" cy="42%" r="62%">
          <stop offset="0%"   stop-color="${p.kelopak[3]}" stop-opacity="0"/>
          <stop offset="70%"  stop-color="${p.kelopak[3]}" stop-opacity=".12"/>
          <stop offset="100%" stop-color="${p.inti[1]}" stop-opacity=".42"/>
        </radialGradient>

        <radialGradient id="hati-aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="${p.kelopak[1]}" stop-opacity=".5"/>
          <stop offset="34%"  stop-color="${p.kelopak[2]}" stop-opacity=".28"/>
          <stop offset="66%"  stop-color="${p.kelopak[3]}" stop-opacity=".12"/>
          <stop offset="100%" stop-color="${p.kelopak[3]}" stop-opacity="0"/>
        </radialGradient>

        <linearGradient id="hati-kilau" x1="10%" y1="0%" x2="70%" y2="90%">
          <stop offset="0%"   stop-color="#FFFFFF" stop-opacity=".55"/>
          <stop offset="55%"  stop-color="#FFFFFF" stop-opacity=".06"/>
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- cahaya yang meluber keluar dari hati -->
      <ellipse class="hati__aura" cx="0" cy="-2" rx="136" ry="130" fill="url(#hati-aura)"/>

      <g class="hati__badan">
        <g clip-path="url(#hati-potong)">
          <path d="${JALUR_HATI}" fill="url(#hati-badan)"/>
          <g>${tangkai}</g>
          <g>${taburan}</g>
          <rect x="-90" y="-90" width="180" height="180" fill="url(#hati-tepi)"/>
          <ellipse cx="0" cy="-4" rx="54" ry="52" fill="url(#hati-nyala)"/>
          <path d="M-70 -50C-40 -66,-6 -60,6 -30C18 0,-2 26,-30 22C-62 18,-84 -32,-70 -50Z"
                fill="url(#hati-kilau)"/>
        </g>

        <!-- tepi tipis supaya bentuknya tetap terbaca di latar gelap -->
        <path d="${JALUR_HATI}" fill="none" stroke="#FFF3E0" stroke-opacity=".42" stroke-width="1.5"/>

        <!-- inti kecil yang berdenyut -->
        <g class="hati__inti">
          <circle r="16" fill="url(#hati-nyala)"/>
          <circle r="6.2" fill="${p.kelopak[0]}"/>
          <circle r="3" fill="${p.inti[0]}" opacity=".7"/>
        </g>
      </g>
    </svg>`;
  }

  /* ============================================================
     LANGIT: bintang, planet, dan meteor sesekali
     ============================================================ */
  function langitHTML(benih = 20260408) {
    const acak = acakDari(benih);

    let bintang = "";
    for (let i = 0; i < 56; i++) {
      const s = (0.9 + acak() * 1.9).toFixed(2);
      bintang += `<i class="langit__bintang" style="
        left:${(acak() * 100).toFixed(2)}%;
        top:${(acak() * 100).toFixed(2)}%;
        width:${s}px;height:${s}px;
        --tunda:${(acak() * 7).toFixed(2)}s;
        --terang:${(0.3 + acak() * 0.6).toFixed(2)}"></i>`;
    }

    /* planet: lingkaran buram yang hanyut pelan di pinggir layar */
    const planet = [
      { x: -8,  y: 22, d: 30, w: "#4A2436", o: .5,  t: 46 },
      { x: 88,  y: 12, d: 26, w: "#6A4B6E", o: .42, t: 58 },
      { x: 96,  y: 68, d: 17, w: "#5A3348", o: .38, t: 52 },
      { x: 4,   y: 82, d: 12, w: "#4E2B3C", o: .34, t: 64 },
      { x: 72,  y: 92, d: 9,  w: "#7A5A72", o: .28, t: 44 },
      { x: 26,  y: -6, d: 8,  w: "#5C3A4E", o: .26, t: 50 }
    ].map((p, i) => `<i class="langit__planet" style="
        left:${p.x}%;top:${p.y}%;
        width:${p.d}vmin;height:${p.d}vmin;
        --w:${p.w};--o:${p.o};--t:${p.t}s;--tunda:${-i * 6}s"></i>`).join("");

    return `<div class="langit__bintang-lapis">${bintang}</div>
            ${planet}
            <i class="langit__meteor" hidden></i>`;
  }

  /* ============================================================
     ADEGAN
     ============================================================ */
  function adegan(lanjut) {
    const d = KADO.dunia || {};
    const tema = KADO.tema || "kuning";
    const daftar = (d.kenangan || []).slice(0, 8);

    const akar = el("div", "dunia");

    /* --- latar --- */
    const langit = el("div", "dunia__langit", langitHTML());
    langit.setAttribute("aria-hidden", "true");

    /* --- kepala --- */
    const kepala = el("header", "dunia__kepala");
    kepala.innerHTML = `
      ${d.garisAtas ? `<p class="terukir dunia__garis-atas">${aman(d.garisAtas)}</p>` : ""}
      <h2 class="dunia__judul">${aman(d.judul || "Dunia kecil kita")}</h2>`;

    /* --- panggung orbit --- */
    const panggungOrbit = el("div", "dunia__panggung");
    const jalurBelakang = el("div", "dunia__jalur dunia__jalur--belakang");
    const jalurDepan = el("div", "dunia__jalur dunia__jalur--depan");
    const hati = el("div", "dunia__hati", hatiSVG(tema));
    panggungOrbit.append(jalurBelakang, hati, jalurDepan);

    const satelit = [];
    daftar.forEach((k, i) => {
      const b = el("button", "satelit");
      b.type = "button";
      b.setAttribute("aria-label", `Buka kenangan: ${k.label || k.judul || "kenangan"}`);

      const ubin = el("span", "satelit__ubin");
      if (k.jenis === "foto" && k.file) {
        const img = new Image();
        img.alt = "";
        img.src = k.file;
        img.addEventListener("error", () => {
          ubin.classList.add("satelit__ubin--kosong");
          ubin.innerHTML = `<svg viewBox="-50 -50 100 100" class="satelit__bunga" aria-hidden="true">
            ${Flora.bunga(["daisy", "matahari", "krisan", "marigold"][i % 4], 38, tema, i + 4)}</svg>`;
        });
        ubin.appendChild(img);
      } else {
        ubin.classList.add("satelit__ubin--" + (k.jenis || "catatan"));
        ubin.innerHTML = ikonKartu(k, tema, i);
      }

      b.appendChild(ubin);
      if (k.label) b.appendChild(el("span", "satelit__label", aman(k.label)));
      b.addEventListener("click", () => buka(k, i));
      panggungOrbit.appendChild(b);
      satelit.push(b);
    });

    /* --- bisikan + tombol --- */
    const bisik = el("p", "dunia__bisik", aman(d.bisikan || ""));
    const kaki = el("div", "dunia__kaki");

    const tombol = el("button", "tombol", "Ulangi dari awal");
    tombol.type = "button";
    
    tombol.addEventListener("click", () => location.reload());
    kaki.appendChild(tombol);

    /* --- panel isi kenangan --- */
    const panel = el("div", "dunia__panel");
    panel.hidden = true;

    akar.append(langit, kepala, panggungOrbit, bisik, kaki, panel);

    /* ==========================================================
       gerak orbit
       ========================================================== */
    const MIRING = -7 * Math.PI / 180;      // kemiringan bidang orbit
    const cosM = Math.cos(MIRING), sinM = Math.sin(MIRING);
    const KECEPATAN = 0.000148;             // satu putaran ± 42 detik

    let Rx = 140, Ry = 50;
    const sudutAwal = satelit.map((_, i) => (Math.PI * 2 / Math.max(1, satelit.length)) * i);
    let waktu = 0, lalu = 0, raf = null, lambat = 1, berhenti = false;

    function ukur() {
      const W = panggungOrbit.clientWidth;
      // lebar ubin diukur langsung dari elemennya — nilai clamp() di CSS
      // tidak bisa dibaca lewat getComputedStyle custom property
      const ubin = (satelit[0] && satelit[0].offsetWidth) || 56;
      Rx = Math.max(72, (W - ubin * 1.2) / 2 * 0.93);
      Ry = Rx * 0.5;   // makin besar = orbitnya makin tegak, ubin tidak menumpuk di hati
      gambarJalur();
      taruh(true);
    }

    /* garis orbit — dipecah dua supaya separuhnya lewat di belakang hati */
    function gambarJalur() {
      const W = panggungOrbit.clientWidth;
      const H = panggungOrbit.clientHeight;
      const cx = W / 2, cy = H / 2;

      const titik = (th) => {
        const x0 = Rx * Math.sin(th), y0 = Ry * Math.cos(th);
        return [(cx + x0 * cosM - y0 * sinM).toFixed(1),
                (cy + x0 * sinM + y0 * cosM).toFixed(1)];
      };
      const busur = (dari, sampai) => {
        let dd = "";
        for (let i = 0; i <= 44; i++) {
          const th = dari + (sampai - dari) * (i / 44);
          const [x, y] = titik(th);
          dd += (i ? "L" : "M") + x + " " + y;
        }
        return dd;
      };

      const bingkai = (isiJalur, tebal, opasitas) =>
        `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="${isiJalur}" fill="none" stroke="rgba(255,226,190,${opasitas})"
                stroke-width="${tebal}" stroke-linecap="round"/></svg>`;

      /* belakang: cos < 0 → sudut dari 90° sampai 270° */
      jalurBelakang.innerHTML = bingkai(busur(Math.PI / 2, Math.PI * 1.5), 1, .16);
      /* depan: cos > 0 → sudut dari -90° sampai 90° */
      jalurDepan.innerHTML = bingkai(busur(-Math.PI / 2, Math.PI / 2), 1.2, .3);
    }

    function taruh(sekali) {
      satelit.forEach((s, i) => {
        const th = sudutAwal[i] + waktu * KECEPATAN;
        const x0 = Rx * Math.sin(th), y0 = Ry * Math.cos(th);
        const x = x0 * cosM - y0 * sinM;
        const y = x0 * sinM + y0 * cosM;
        const z = Math.cos(th);            // 1 = paling depan, -1 = paling belakang
        const k = (z + 1) / 2;

        s.style.transform =
          `translate(-50%,-50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(0.58 + k * 0.56).toFixed(3)})`;
        s.style.opacity = (0.3 + k * 0.7).toFixed(3);
        s.style.filter = z < 0 ? `blur(${(-z * 1.5).toFixed(2)}px)` : "none";
        s.style.zIndex = z < 0 ? "2" : "6";
        s.style.pointerEvents = (sekali || z > -0.55) ? "auto" : "none";
      });
    }

    function bingkaiGerak(sekarang) {
      if (!lalu) lalu = sekarang;
      const beda = Math.min(48, sekarang - lalu);
      lalu = sekarang;
      if (!berhenti) waktu += beda * lambat;
      taruh(false);
      raf = requestAnimationFrame(bingkaiGerak);
    }

    /* pelan sedikit waktu disentuh, biar gampang dipencet */
    satelit.forEach(s => {
      s.addEventListener("pointerenter", () => { lambat = 0.25; });
      s.addEventListener("pointerleave", () => { lambat = 1; });
      s.addEventListener("focus", () => { lambat = 0.25; });
      s.addEventListener("blur", () => { lambat = 1; });
    });

    /* ==========================================================
       meteor sesekali
       ========================================================== */
    let jamMeteor = null;
    function jadwalMeteor() {
      const jeda = 7000 + Math.random() * 9000;
      jamMeteor = setTimeout(() => {
        const m = langit.querySelector(".langit__meteor");
        if (m) {
          m.hidden = false;
          m.style.setProperty("--y", (6 + Math.random() * 46).toFixed(1) + "%");
          m.style.setProperty("--x", (52 + Math.random() * 38).toFixed(1) + "%");
          m.classList.remove("jalan");
          void m.offsetWidth;
          m.classList.add("jalan");
        }
        jadwalMeteor();
      }, jeda);
    }

    /* ==========================================================
       panel isi kenangan
       ========================================================== */
function tutup() {
  akar.classList.remove("dunia--panel");
  berhenti = false;
  document.removeEventListener("keydown", tombolEsc);
  // Hapus isi panel setelah animasinya selesai memudar
  setTimeout(() => {
    panel.hidden = true;
    panel.innerHTML = "";
  }, 380);
}

function buka(k, i) {
  panel.innerHTML = "";
  panel.appendChild(isiPanel(k, i, tema));
  panel.hidden = false;
  akar.classList.add("dunia--panel");
  berhenti = true;

  const kembali = panel.querySelector(".dunia__kembali");
  if (kembali) {
    // 1. Matikan deteksi sentuh pada Icon & Teks agar klik tidak tertelan
    kembali
      .querySelectorAll("*")
      .forEach((el) => (el.style.pointerEvents = "none"));

    // 2. Pasang deteksi klik standar
    kembali.addEventListener("click", tutup);

    // 3. Paksa HP untuk langsung merespon sentuhan jari (touchend)
    kembali.addEventListener("touchend", (e) => {
      e.preventDefault(); // Mencegah HP membaca sentuhan sebagai klik ganda
      tutup();
    });
  }
  document.addEventListener("keydown", tombolEsc);
}

    function tombolEsc(e) { if (e.key === "Escape") tutup(); }

    /* ==========================================================
       hidup / mati
       ========================================================== */
    const amatiUkuran = () => ukur();
    window.addEventListener("resize", amatiUkuran, { passive: true });

    requestAnimationFrame(() => {
      ukur();
      if (hematGerak) { taruh(true); return; }
      raf = requestAnimationFrame(bingkaiGerak);
      jadwalMeteor();
    });

    /* kalau adegan dilepas, hentikan semuanya */
    const pengawas = new MutationObserver(() => {
      if (!document.body.contains(akar)) {
        if (raf) cancelAnimationFrame(raf);
        if (jamMeteor) clearTimeout(jamMeteor);
        window.removeEventListener("resize", amatiUkuran);
        document.removeEventListener("keydown", tombolEsc);
        pengawas.disconnect();
      }
    });
    pengawas.observe(document.body, { childList: true, subtree: true });

    return akar;
  }

  /* ============================================================
     ISI PANEL — beda bentuk untuk tiap jenis kenangan
     ============================================================ */
  function isiPanel(k, i, tema) {
    const bungkus = el("div", "panel");

    const kembali = el("button", "dunia__kembali",
      `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 6-6 6 6 6"/></svg><span>Kembali</span>`);
    kembali.type = "button";
    bungkus.appendChild(kembali);

    if (k.label) bungkus.appendChild(el("p", "terukir panel__label", aman(k.label)));

    const kartu = el("article", "panel__kartu");

    /* --- foto --- */
    if (k.jenis === "foto") {
      const bidang = el("div", "panel__foto");
      const img = new Image();
      img.alt = k.judul || "Foto kenangan";
      img.src = k.file || "";
      img.addEventListener("error", () => {
        bidang.classList.add("panel__foto--kosong");
        bidang.innerHTML = `<svg viewBox="-50 -50 100 100" aria-hidden="true">
          ${Flora.bunga(["daisy", "matahari", "krisan", "marigold"][i % 4], 40, tema, i + 9)}</svg>`;
      });
      bidang.appendChild(img);
      kartu.appendChild(bidang);
      if (k.judul) kartu.appendChild(el("h3", "panel__judul", aman(k.judul)));
      if (k.teks) kartu.appendChild(el("p", "panel__teks", aman(k.teks)));
    }

    /* --- surat --- */
    else if (k.jenis === "surat") {
      kartu.classList.add("panel__kartu--kertas");
      if (k.judul) kartu.appendChild(el("h3", "panel__judul panel__judul--tulis", aman(k.judul)));
      const isi = el("div", "panel__surat tulisan-tangan");
      String(k.teks || "").trim().split(/\n\s*\n/).forEach(p => {
        isi.appendChild(el("p", null, aman(p.trim()).replace(/\n/g, "<br>")));
      });
      kartu.appendChild(isi);
      if (k.ttd) kartu.appendChild(el("p", "panel__ttd", aman(k.ttd)));
    }

    /* --- lagu --- */
    else if (k.jenis === "lagu") {
      const kepala = el("div", "panel__lagu-kepala");
      kepala.innerHTML = `
        <span class="panel__piringan" aria-hidden="true">
          <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="#2A1119"/>
          <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(255,235,205,.22)" stroke-width="1"/>
          <circle cx="24" cy="24" r="13" fill="none" stroke="rgba(255,235,205,.14)" stroke-width="1"/>
          <circle cx="24" cy="24" r="6" fill="#E8C68A"/><circle cx="24" cy="24" r="1.8" fill="#2A1119"/></svg>
        </span>
        <span>
          <strong>${aman(k.judul || "")}</strong>
          ${k.artis ? `<em>${aman(k.artis)}</em>` : ""}
        </span>`;
      kartu.appendChild(kepala);
      if (k.teks) kartu.appendChild(el("p", "panel__teks", aman(k.teks)));
      const id = idSpotify(k.spotify);
      if (id) {
        const bingkai = el("div", "panel__semat panel__semat--lagu");
        bingkai.innerHTML = `<iframe title="Pemutar lagu" loading="lazy"
          src="https://open.spotify.com/embed/track/${aman(id)}?utm_source=generator&theme=0"
          allow="clipboard-write; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
        kartu.appendChild(bingkai);
      }
    }

    /* --- video --- */
    else if (k.jenis === "video") {
      if (k.judul) kartu.appendChild(el("h3", "panel__judul", aman(k.judul)));
      if (k.teks) kartu.appendChild(el("p", "panel__teks", aman(k.teks)));
      const id = idYoutube(k.youtube);
      if (id) {
        const bingkai = el("div", "panel__semat panel__semat--video");
        bingkai.innerHTML = `<iframe title="${aman(k.judul || "Video")}" loading="lazy"
          src="https://www.youtube-nocookie.com/embed/${aman(id)}?rel=0"
          allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
        kartu.appendChild(bingkai);
      }
    }

    /* --- buket --- */
    else if (k.jenis === "buket" || k.jenis === "bunga") {
      const tangkaiku = (k.bunga || []).slice(0, 5);
      const gambar = el("div", "panel__buket");
      gambar.innerHTML = tangkaiku.map((b, n) => {
        const sebar = tangkaiku.length === 1 ? 0 : -34 + (68 / (tangkaiku.length - 1)) * n;
        return `<span class="panel__tangkai" style="--r:${sebar.toFixed(1)}deg;--d:${(n * 0.1).toFixed(2)}s">
          ${Flora.tangkai(b.jenis || "mawar", tema, n + 5, 150, 30)}</span>`;
      }).join("");
      kartu.appendChild(gambar);
      if (k.judul) kartu.appendChild(el("h3", "panel__judul panel__judul--tulis", aman(k.judul)));
      if (k.teks) kartu.appendChild(el("p", "panel__teks", aman(k.teks)));

      const daftar = el("dl", "panel__makna");
      tangkaiku.forEach(b => {
        daftar.appendChild(el("dt", null, aman(b.nama)));
        daftar.appendChild(el("dd", null, aman(b.makna)));
      });
      kartu.appendChild(daftar);
      if (k.penutup) kartu.appendChild(el("p", "panel__penutup", aman(k.penutup)));
    }

    /* --- catatan biasa --- */
    else {
      if (k.judul) kartu.appendChild(el("h3", "panel__judul", aman(k.judul)));
      if (k.teks) {
        String(k.teks).trim().split(/\n\s*\n/).forEach(p => {
          kartu.appendChild(el("p", "panel__teks", aman(p.trim()).replace(/\n/g, "<br>")));
        });
      }
    }

    bungkus.appendChild(kartu);
    return bungkus;
  }

  return { adegan, hatiSVG };
})();
