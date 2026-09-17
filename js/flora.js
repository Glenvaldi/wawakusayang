/* ============================================================
   flora.js — semua bunga di situs ini digambar di sini.
   Tidak ada satu pun file gambar. Semuanya SVG.
   ============================================================ */

const Flora = (() => {

  /* ---------- palet per tema ---------- */
  const PALET = {
    kuning: {
      kelopak: ["#FFFBEE", "#FDF0C8", "#F8D77A", "#F5BE45", "#EFA62E", "#FFF6DC"],
      inti:    ["#D9962A", "#8A5A1C", "#E9B23C", "#C07D1E"],
      daun:    ["#6E7C4A", "#58663A", "#82905C"]
    },
    merah: {
      kelopak: ["#FDEEE4", "#E9A38C", "#C6503F", "#9E2430", "#7C1524", "#F3C9B4"],
      inti:    ["#E0B24A", "#8A5A1C", "#C98C2E", "#5E1018"],
      daun:    ["#5C6B42", "#47542F", "#6F7D50"]
    },
    pink: {
      kelopak: ["#FFF4F6", "#FBDCE4", "#F3B4C6", "#E68CA8", "#D46C90", "#FFE8EE"],
      inti:    ["#E6B84F", "#A9702A", "#D99A3C", "#B85878"],
      daun:    ["#66774C", "#4F5E39", "#7B8A5D"]
    },
    putih: {
      kelopak: ["#FFFFFF", "#FBF6EA", "#F2EAD8", "#E8DEC6", "#FDFBF4", "#F6F0E1"],
      inti:    ["#E3BE5C", "#B08430", "#D2A845", "#8E6A22"],
      daun:    ["#6A7A52", "#53603C", "#7E8C64"]
    },
    campur: {
      kelopak: ["#FFFBEE", "#F8D77A", "#F3B4C6", "#E68CA8", "#C6503F", "#FBF6EA", "#F5BE45", "#FFF4F6"],
      inti:    ["#D9962A", "#8A5A1C", "#E9B23C", "#B85878"],
      daun:    ["#6E7C4A", "#58663A", "#82905C"]
    }
  };

  /* ---------- acak yang bisa diulang (biar tata letak stabil) ---------- */
  function pembuatAcak(benih) {
    let s = benih >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  /* ---------- bentuk satu kelopak ---------- */
  // lebar = seberapa gemuk, ujung = 0 tumpul .. 1 runcing
  function kelopak(panjang, lebar, ujung = 0.5) {
    const w = lebar;
    const h = -panjang;
    const cx = w * (1 - ujung * 0.55);
    return `M0 0C${-w} ${h * 0.34},${-cx} ${h * 0.94},0 ${h}C${cx} ${h * 0.94},${w} ${h * 0.34},0 0Z`;
  }

  function cincinKelopak(jumlah, panjang, lebar, ujung, isi, putar = 0, opasitas = 1) {
    let out = "";
    for (let i = 0; i < jumlah; i++) {
      const a = putar + (360 / jumlah) * i;
      out += `<path d="${kelopak(panjang, lebar, ujung)}" fill="${isi}" transform="rotate(${a})" opacity="${opasitas}"/>`;
    }
    return out;
  }

  /* ---------- inti bunga bertekstur ---------- */
  function inti(r, warna, warnaTitik, rapat = 34) {
    let titik = "";
    const emas = 2.399963;
    for (let i = 0; i < rapat; i++) {
      const rr = r * 0.82 * Math.sqrt(i / rapat);
      const a = i * emas;
      titik += `<circle cx="${(Math.cos(a) * rr).toFixed(2)}" cy="${(Math.sin(a) * rr).toFixed(2)}" r="${(r * 0.10).toFixed(2)}" fill="${warnaTitik}" opacity="0.55"/>`;
    }
    return `<circle r="${r}" fill="${warna}"/>${titik}`;
  }

  /* ============================================================
     JENIS-JENIS BUNGA
     tiap fungsi mengembalikan isi <g>, digambar dari titik 0,0
     dengan jari-jari kira-kira = r
     ============================================================ */

  const JENIS = {

    daisy(r, p, acak) {
      const k = p.kelopak[0];
      const k2 = p.kelopak[1];
      const c = p.inti[0], c2 = p.inti[1];
      return cincinKelopak(15, r, r * 0.20, 0.35, k2, 12, 0.9)
           + cincinKelopak(15, r * 0.94, r * 0.18, 0.4, k, 0)
           + inti(r * 0.27, c, c2, 30);
    },

    matahari(r, p, acak) {
      const k = p.kelopak[3] || p.kelopak[2];
      const k2 = p.kelopak[2];
      return cincinKelopak(20, r, r * 0.17, 0.85, k2, 9, 0.85)
           + cincinKelopak(20, r * 0.9, r * 0.15, 0.85, k, 0)
           + inti(r * 0.34, p.inti[1], p.inti[3], 46);
    },

    krisan(r, p, acak) {
      const a = p.kelopak[1], b = p.kelopak[2], c = p.kelopak[0];
      return cincinKelopak(20, r, r * 0.13, 0.3, b, 0, 0.95)
           + cincinKelopak(17, r * 0.80, r * 0.12, 0.3, a, 11)
           + cincinKelopak(14, r * 0.60, r * 0.11, 0.3, c, 22)
           + cincinKelopak(10, r * 0.40, r * 0.10, 0.3, a, 33)
           + inti(r * 0.13, p.inti[2], p.inti[0], 10);
    },

    marigold(r, p, acak) {
      const a = p.kelopak[3], b = p.kelopak[2], c = p.kelopak[4] || p.kelopak[3];
      return cincinKelopak(18, r, r * 0.20, 0.15, c, 0, 0.9)
           + cincinKelopak(16, r * 0.82, r * 0.19, 0.15, a, 10)
           + cincinKelopak(13, r * 0.62, r * 0.18, 0.15, b, 21)
           + cincinKelopak(10, r * 0.42, r * 0.17, 0.15, a, 32)
           + `<circle r="${r * 0.16}" fill="${a}"/>`;
    },

    mawar(r, p, acak) {
      const luar = p.kelopak[2], tengah = p.kelopak[3], dalam = p.kelopak[4] || p.kelopak[3];
      let out = cincinKelopak(6, r, r * 0.55, 0.1, luar, 0, 0.95)
              + cincinKelopak(6, r * 0.78, r * 0.46, 0.1, tengah, 30)
              + cincinKelopak(5, r * 0.56, r * 0.38, 0.1, dalam, 15);
      // pusaran di tengah
      out += `<path d="M0 ${-r * 0.30}C${r * 0.26} ${-r * 0.30},${r * 0.30} ${r * 0.04},${0} ${r * 0.10}C${-r * 0.24} ${r * 0.12},${-r * 0.22} ${-r * 0.16},${r * 0.02} ${-r * 0.13}"
                fill="none" stroke="${luar}" stroke-width="${r * 0.11}" stroke-linecap="round" opacity="0.85"/>`;
      return out;
    },

    tulip(r, p, acak) {
      const luar = p.kelopak[3], tengah = p.kelopak[2], kilau = p.kelopak[1];
      const gelap = p.inti[3] || p.inti[1];
      return `<path d="${kelopak(r * 0.96, r * 0.50, 0.55)}" fill="${luar}" transform="rotate(-30)"/>`
           + `<path d="${kelopak(r * 0.96, r * 0.50, 0.55)}" fill="${luar}" transform="rotate(30)"/>`
           + `<path d="${kelopak(r, r * 0.47, 0.6)}" fill="${tengah}"/>`
           + `<path d="M${-r * 0.30} ${-r * 0.30}C${-r * 0.16} ${-r * 0.72},${-r * 0.06} ${-r * 0.88},0 ${-r * 0.95}"
                    fill="none" stroke="${gelap}" stroke-width="${r * 0.045}" opacity=".3"/>`
           + `<path d="M${r * 0.30} ${-r * 0.30}C${r * 0.16} ${-r * 0.72},${r * 0.06} ${-r * 0.88},0 ${-r * 0.95}"
                    fill="none" stroke="${gelap}" stroke-width="${r * 0.045}" opacity=".3"/>`
           + `<path d="${kelopak(r * 0.52, r * 0.20, 0.6)}" fill="${kilau}" opacity="0.45" transform="translate(${-r * 0.1},${-r * 0.1})"/>`;
    },

    kuncup(r, p, acak) {
      const a = p.kelopak[2];
      return `<ellipse rx="${r * 0.46}" ry="${r * 0.72}" fill="${a}"/>`
           + `<ellipse rx="${r * 0.24}" ry="${r * 0.6}" fill="${p.kelopak[1]}" opacity="0.7"/>`;
    }
  };

  /* ---------- daun ---------- */
  function daun(panjang, warna, opasitas = 1) {
    const w = panjang * 0.36;
    return `<path d="M0 0C${-w} ${-panjang * 0.4},${-w * 0.5} ${-panjang * 0.9},0 ${-panjang}C${w * 0.5} ${-panjang * 0.9},${w} ${-panjang * 0.4},0 0Z"
             fill="${warna}" opacity="${opasitas}"/>
            <path d="M0 0L0 ${-panjang}" stroke="rgba(0,0,0,.14)" stroke-width="${panjang * 0.035}" fill="none"/>`;
  }

  /* ============================================================
     SATU BUNGA (dipakai buket, loader, hiasan)
     ============================================================ */
  function bunga(jenis, r, tema = "kuning", benih = 1) {
    const p = PALET[tema] || PALET.kuning;
    const acak = pembuatAcak(benih);
    const f = JENIS[jenis] || JENIS.daisy;
    return `<g>${f(r, p, acak)}</g>`;
  }

  /* ============================================================
     DINDING BUNGA
     Dipakai untuk tirai pembuka. Digambar sekali, lalu diam.
     ============================================================ */
  function dinding({ tema = "kuning", benih = 7, lebar = 1000, tinggi = 1000, rapat = 1 } = {}) {
    const p = PALET[tema] || PALET.kuning;
    const acak = pembuatAcak(benih);
    const jenisBesar = ["daisy", "matahari", "krisan", "marigold", "daisy", "krisan"];
    const jenisKecil = ["daisy", "krisan", "kuncup", "marigold"];

    let daunLapis = "";
    let bungaLapis = "";

    const kolom = Math.round(4 * rapat);
    const baris = Math.round(4 * rapat);
    const langkahX = lebar / kolom;
    const langkahY = tinggi / baris;

    // daun di lapisan paling belakang
    for (let i = 0; i < kolom * baris * 1.4; i++) {
      const x = acak() * lebar;
      const y = acak() * tinggi;
      const s = langkahX * (0.34 + acak() * 0.4);
      const a = acak() * 360;
      daunLapis += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})">
        ${daun(s, p.daun[Math.floor(acak() * p.daun.length)], 0.85)}</g>`;
    }

    // bunga besar pada kisi yang digoyang
    for (let gy = -1; gy <= baris; gy++) {
      for (let gx = -1; gx <= kolom; gx++) {
        const x = gx * langkahX + langkahX * (0.2 + acak() * 0.6);
        const y = gy * langkahY + langkahY * (0.2 + acak() * 0.6);
        const r = langkahX * (0.40 + acak() * 0.26);
        const a = acak() * 360;
        const j = jenisBesar[Math.floor(acak() * jenisBesar.length)];
        bungaLapis += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})">
          ${JENIS[j](r, p, acak)}</g>`;
      }
    }

    // bunga kecil penyumpal celah
    for (let i = 0; i < kolom * baris * 1.3; i++) {
      const x = acak() * lebar;
      const y = acak() * tinggi;
      const r = langkahX * (0.16 + acak() * 0.14);
      const a = acak() * 360;
      const j = jenisKecil[Math.floor(acak() * jenisKecil.length)];
      bungaLapis += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})">
        ${JENIS[j](r, p, acak)}</g>`;
    }

    return `<svg class="dinding-svg" viewBox="0 0 ${lebar} ${tinggi}" preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="dinding-dalam" cx="50%" cy="50%" r="72%">
          <stop offset="0%"  stop-color="#000" stop-opacity="0"/>
          <stop offset="68%" stop-color="#2A0A12" stop-opacity=".16"/>
          <stop offset="100%" stop-color="#2A0A12" stop-opacity=".46"/>
        </radialGradient>
      </defs>
      <rect width="${lebar}" height="${tinggi}" fill="${p.inti[1]}"/>
      <g>${daunLapis}</g>
      <g>${bungaLapis}</g>
      <rect width="${lebar}" height="${tinggi}" fill="url(#dinding-dalam)"/>
    </svg>`;
  }

  /* ============================================================
     CINCIN KELOPAK BERPUTAR — dipakai di layar memuat
     ============================================================ */
  function cincinMemuat(tema = "kuning") {
    const p = PALET[tema] || PALET.kuning;
    let out = "";
    const n = 12;
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i;
      const warna = p.kelopak[i % p.kelopak.length];
      out += `<g transform="rotate(${a}) translate(0 -38)">
        <g class="cincin-kelopak" style="--i:${i}">
          <path d="${kelopak(17, 5.4, 0.5)}" fill="${warna}"/>
        </g></g>`;
    }
    return `<svg viewBox="-60 -60 120 120" class="cincin-memuat" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle r="47" fill="none" stroke="rgba(160,120,60,.22)" stroke-width="1"/>
      <g class="cincin-putar">${out}</g>
    </svg>`;
  }

  /* ============================================================
     SATU TANGKAI untuk buket
     ============================================================ */
  function tangkai(jenis, tema, benih, tinggi = 190, r = 34) {
    const p = PALET[tema] || PALET.kuning;
    const acak = pembuatAcak(benih);
    const warnaDaun = p.daun[benih % p.daun.length];
    return `<svg viewBox="-60 -70 120 ${tinggi + 80}" xmlns="http://www.w3.org/2000/svg" class="tangkai-svg" aria-hidden="true">
      <path d="M0 ${tinggi}C${-6} ${tinggi * 0.6},${5} ${tinggi * 0.3},0 0"
            fill="none" stroke="${warnaDaun}" stroke-width="5" stroke-linecap="round"/>
      <g transform="translate(-1 ${tinggi * 0.55}) rotate(-38)">${daun(46, warnaDaun)}</g>
      <g transform="translate(1 ${tinggi * 0.34}) rotate(36)">${daun(38, warnaDaun, .9)}</g>
      <g class="tangkai-kepala"><circle r="${r * 0.9}" fill="none" pointer-events="all"/>${(JENIS[jenis] || JENIS.daisy)(r, p, acak)}</g>
    </svg>`;
  }

  return { bunga, dinding, cincinMemuat, tangkai, PALET, kelopak };
})();
