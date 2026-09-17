/* ============================================================
   app.js — pengatur alur. Adegan dibuat satu per satu,
   yang lama dilepas supaya halaman tetap ringan.
   ============================================================ */

(() => {
  ("use strict");

  const panggung = document.getElementById("panggung");
  const layarMuat = document.getElementById("memuat");
  const penandaLangkah = document.getElementById("langkah");
  const sudut = document.getElementById("sudut");

  let indeks = 0;
  let urutan = [];
  let dindingURI = "";
  let audio = null;
  let musikJalan = false;

  const el = (tag, kelas, isi) => {
    const n = document.createElement(tag);
    if (kelas) n.className = kelas;
    if (isi != null) n.innerHTML = isi;
    return n;
  };

  const aman = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  /* ============================================================
     MUSIK
     ============================================================ */
  function siapkanMusik() {
    if (!KADO.musik || !KADO.musik.aktif) return;
    audio = new Audio(KADO.musik.file);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";

    const tombol = el("button", "musik");
    tombol.type = "button";
    tombol.setAttribute("aria-label", "Nyalakan atau matikan musik");
    tombol.dataset.main = "false";
    tombol.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5 6.5 9H3v6h3.5L11 19z"/>
        <g class="gelombang"><path d="M15 9.5a3.5 3.5 0 0 1 0 5"/><path d="M17.8 7a7 7 0 0 1 0 10"/></g>
      </svg>`;
    tombol.addEventListener("click", () =>
      musikJalan ? hentikanMusik() : mulaiMusik(true)
    );
    document.body.appendChild(tombol);
    window.__tombolMusik = tombol;
  }

  function mulaiMusik(paksa) {
    if (!audio || (musikJalan && !paksa)) return;
    audio
      .play()
      .then(() => {
        musikJalan = true;
        if (window.__tombolMusik) window.__tombolMusik.dataset.main = "true";
        let v = 0;
        const naik = setInterval(() => {
          v = Math.min(0.42, v + 0.02);
          audio.volume = v;
          if (v >= 0.42) clearInterval(naik);
        }, 90);
      })
      .catch(() => {
        /* peramban menolak sebelum ada sentuhan — tidak apa-apa */
      });
  }

  function hentikanMusik() {
    if (!audio) return;
    audio.pause();
    musikJalan = false;
    if (window.__tombolMusik) window.__tombolMusik.dataset.main = "false";
  }

  /* ============================================================
     LAYAR MEMUAT
     ============================================================ */
  function jalankanMuat() {
    const batang = layarMuat.querySelector(".memuat__batang i");
    const angka = layarMuat.querySelector(".memuat__angka");
    layarMuat.querySelector(".memuat__cincin").innerHTML = Flora.cincinMemuat(
      KADO.tema
    );

    return new Promise((res) => {
      let n = 0;
      const jalan = setInterval(() => {
        n += 3 + Math.random() * 9;
        if (n >= 100) {
          n = 100;
          clearInterval(jalan);
          setTimeout(res, 420);
        }
        batang.style.width = n + "%";
        angka.textContent = Math.round(n) + "%";
      }, 90);
    });
  }

  /* ============================================================
     DINDING BUNGA — dibuat sekali, dipakai dua panel
     ============================================================ */
  function siapkanDinding() {
    const potret = window.innerHeight > window.innerWidth;
    const svg = Flora.dinding({
      tema: KADO.tema,
      benih: 20260921,
      lebar: potret ? 800 : 1200,
      tinggi: potret ? 1200 : 900,
    });
    dindingURI = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* ============================================================
     GERBANG
     ============================================================ */
  function adeganGerbang() {
    return new Promise((res) => {
      const g = KADO.gerbang;
      const wadah = el("div", "adegan adegan--masuk");
      const lembar = el("div", "lembar");

      const karangan = el("div", "gerbang__karangan");
      karangan.innerHTML = `<svg viewBox="-60 -60 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        ${[0, 60, 120, 180, 240, 300]
          .map(
            (a) =>
              `<g transform="rotate(${a}) translate(0 -36)">${Flora.bunga(
                "daisy",
                15,
                KADO.tema,
                a + 3
              )}</g>`
          )
          .join("")}
        <circle r="13" fill="none" stroke="rgba(201,163,78,.45)" stroke-width="1"/>
        <path d="M0 -5c3-4 9 0 0 7-9-7-3-11 0-7z" fill="#C9A34E" opacity=".8"/>
      </svg>`;

      const tanya = el("h1", "gerbang__tanya", aman(g.pertanyaan));
      const format = el("p", "gerbang__format", aman(g.formatJawaban || ""));

      const jawabanBenar = String(g.jawaban).trim().toLowerCase();
      const pakaiKotak = jawabanBenar.length >= 3 && jawabanBenar.length <= 6;
      const baris = el("div", "gerbang__baris");
      let ambilJawaban;

      if (pakaiKotak) {
        const kotak = [];
        for (let i = 0; i < jawabanBenar.length; i++) {
          const k = el("input", "gerbang__kotak");
          k.type = "text";
          k.inputMode = /^\d+$/.test(jawabanBenar) ? "numeric" : "text";
          k.maxLength = 1;
          k.autocomplete = "off";
          k.setAttribute("aria-label", `Karakter ke-${i + 1}`);
          kotak.push(k);
          baris.appendChild(k);
        }
        kotak.forEach((k, i) => {
          k.addEventListener("input", () => {
            k.value = k.value.slice(-1);
            if (k.value && i < kotak.length - 1) kotak[i + 1].focus();
            if (kotak.every((x) => x.value)) setTimeout(periksa, 160);
          });
          k.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !k.value && i > 0)
              kotak[i - 1].focus();
            if (e.key === "Enter") periksa();
          });
        });
        ambilJawaban = () =>
          kotak
            .map((k) => k.value)
            .join("")
            .trim()
            .toLowerCase();
        setTimeout(() => kotak[0].focus(), 700);
        baris.__kosongkan = () => {
          kotak.forEach((k) => (k.value = ""));
          kotak[0].focus();
        };
      } else {
        const ladang = el("input", "gerbang__ladang");
        ladang.type = "text";
        ladang.autocomplete = "off";
        ladang.setAttribute("aria-label", "Jawaban");
        ladang.addEventListener("keydown", (e) => {
          if (e.key === "Enter") periksa();
        });
        baris.appendChild(ladang);
        ambilJawaban = () => ladang.value.trim().toLowerCase();
        setTimeout(() => ladang.focus(), 700);
        baris.__kosongkan = () => {
          ladang.value = "";
          ladang.focus();
        };
      }

      const pesan = el("p", "gerbang__pesan", "");
      const buka = el("button", "tombol", "Buka");
      buka.type = "button";
      buka.addEventListener("click", periksa);

      /* Petunjuknya sengaja disembunyikan dulu. Baru muncul sendiri
         setelah dia salah sekian kali — diatur lewat
         gerbang.salahSebelumPetunjuk di config.js (bawaannya 2). */
      const batasSalah = Number.isFinite(g.salahSebelumPetunjuk)
        ? g.salahSebelumPetunjuk
        : 2;
      let salahKe = 0;

      const petunjuk = el("p", "gerbang__petunjuk-teks");
      petunjuk.hidden = true;

      function bukaPetunjuk() {
        if (!g.petunjuk || !petunjuk.hidden) return;
        petunjuk.innerHTML = `<span>Petunjuk</span>${aman(g.petunjuk)}`;
        petunjuk.hidden = false;
      }

      function periksa() {
        mulaiMusik();
        const j = ambilJawaban();
        if (!j) return;
        if (j === jawabanBenar) {
          pesan.textContent = "Terbuka.";
          buka.disabled = true;
          setTimeout(() => {
            wadah.classList.add("adegan--keluar");
            setTimeout(() => {
              wadah.remove();
              res();
            }, 340);
          }, 420);
        } else {
          salahKe++;
          baris.classList.add("salah");
          pesan.textContent =
            salahKe >= batasSalah
              ? "Nih aku kasih bocoran."
              : g.salah || "Belum pas. Coba lagi.";
          if (salahKe >= batasSalah) bukaPetunjuk();
          setTimeout(() => {
            baris.classList.remove("salah");
            baris.__kosongkan();
          }, 520);
        }
      }

      lembar.append(karangan, tanya);
      if (g.formatJawaban) lembar.appendChild(format);
      lembar.append(baris, pesan, buka);
      if (g.petunjuk) lembar.appendChild(petunjuk);
      wadah.appendChild(lembar);
      panggung.appendChild(wadah);
    });
  }

  /* ============================================================
     TIRAI BUNGA
     ============================================================ */
  function adeganTirai() {
    return new Promise((res) => {
      const t = el("div", "tirai-bungkus");
      t.id = "tirai";
      t.style.opacity = "0";
      t.style.transition = "opacity .9s ease";
      t.innerHTML = `
        <div class="tirai__daun tirai__daun--atas"><div class="tirai__gambar"></div></div>
        <div class="tirai__daun tirai__daun--bawah"><div class="tirai__gambar"></div></div>
        <div class="tirai__jahitan"></div>
        <button class="tirai__ajakan" type="button">
          <span class="tirai__lingkaran" aria-hidden="true">♡</span>
          <span class="tirai__kata">${aman(KADO.tirai.ajakan)}</span>
          <span class="tirai__bisik">${aman(KADO.tirai.bisikan)}</span>
        </button>`;
      t.querySelectorAll(".tirai__gambar").forEach((d) => {
        d.style.backgroundImage = `url("${dindingURI}")`;
        d.style.backgroundSize = "cover";
        d.style.backgroundPosition = "center";
      });
      document.body.appendChild(t);
      requestAnimationFrame(() => {
        t.style.opacity = "1";
      });

      const ajakan = t.querySelector(".tirai__ajakan");
      setTimeout(() => ajakan.focus({ preventScroll: true }), 1000);

      ajakan.addEventListener(
        "click",
        () => {
          mulaiMusik();
          t.classList.add("buka");
          Petals.pasang(document.body, { warna: warnaKelopak(), jumlah: 16 });
          setTimeout(() => Petals.hujan(26), 260);
          setTimeout(() => {
            t.classList.add("selesai");
            res();
          }, 900);
          setTimeout(() => t.remove(), 2100);
        },
        { once: true }
      );
    });
  }

  function warnaKelopak() {
    const p = Flora.PALET[KADO.tema] || Flora.PALET.kuning;
    return p.kelopak.slice(0, 5);
  }

  /* ============================================================
     ADEGAN 1 — SAMPUL
     ============================================================ */
  /* ============================================================
     ADEGAN BUKU (SAMPUL + SURAT JADI SATU BUKAAN 3D)
     ============================================================ */
  /* ============================================================
     ADEGAN BUKU LENGKAP (Sampul, Surat, & Hal Kecil jadi 1 Buku)
     ============================================================ */
  function adeganBuku(lanjut) {
    const s = KADO.sampul;
    const surat = KADO.surat;
    const catatan = KADO.halKecil || [];
    const lembar = el("div", "lembar");

    const wadah3D = el("div");
    wadah3D.style.position = "relative";
    wadah3D.style.width = "min(100%, 22rem)";
    wadah3D.style.aspectRatio = "5 / 7.2";
    wadah3D.style.perspective = "1500px";

    const isiHalaman = [];

    // 1. HALAMAN COVER
    isiHalaman.push({
      tipe: "cover",
      html: `
        <span class="bingkai-emas" aria-hidden="true"></span>
        <span class="sampul__pita" aria-hidden="true"></span>
        <div class="sampul__isi">
          <p class="sampul__garis-atas">${aman(s.garisAtas)}</p>
          <h1 class="sampul__nama">${aman(KADO.untuk)}</h1>
          <span class="segel" aria-hidden="true"><span>${aman(
            KADO.untuk.charAt(0)
          )}</span></span>
          <p class="sampul__sub">${aman(s.subjudul)}</p>
          <svg class="sampul__hias" viewBox="0 0 78 12" aria-hidden="true">
            <path d="M2 6h24M52 6h24"/><path d="M33 6c2-3 6 0 0 4-6-4-2-7 0-4z" fill="#8A6C33" stroke="none"/>
            <path d="M45 6c2-3 6 0 0 4-6-4-2-7 0-4z" fill="#8A6C33" stroke="none"/>
          </svg>
        </div>`,
    });

    // 2. HALAMAN SURAT UTAMA
    let htmlSurat = `
      <svg viewBox="-50 -50 100 100" style="position:absolute; bottom:-15%; right:-15%; width:220px; opacity:0.12; pointer-events:none;">
        ${Flora.bunga("mawar", 45, KADO.tema, 1)}
      </svg>
      <div class="kertas__isi tulisan-tangan" style="font-size: 1.15rem; position:relative; z-index:2;">`;
    String(surat.isi)
      .trim()
      .split(/\n\s*\n/)
      .forEach((p) => {
        htmlSurat += `<p style="margin-bottom:0.8rem">${aman(p.trim()).replace(
          /\n/g,
          "<br>"
        )}</p>`;
      });
    htmlSurat += `<span class="surat__ttd" style="display:block; text-align:right; margin-top:1rem;">— ${aman(
      KADO.dari
    )}</span></div>`;
    isiHalaman.push({ tipe: "kertas", html: htmlSurat });

    // 3. HALAMAN CATATAN KECIL (Dilengkapi siluet bunga & gradasi)
    const jenisBunga = ["daisy", "krisan", "matahari", "tulip", "mawar"];
    catatan.forEach((teks, i) => {
      let htmlCatatan = `
        <div style="position:absolute; inset:0; background:radial-gradient(circle at top left, rgba(255,255,255,0.4), transparent 70%); pointer-events:none;"></div>
        <svg viewBox="-50 -50 100 100" style="position:absolute; top:-10%; left:-10%; width:160px; opacity:0.15; pointer-events:none;">
          ${Flora.bunga(jenisBunga[i % 5], 40, KADO.tema, i + 10)}
        </svg>
        <svg viewBox="-50 -50 100 100" style="position:absolute; bottom:-10%; right:-10%; width:120px; opacity:0.1; pointer-events:none;">
          ${Flora.bunga(jenisBunga[(i + 2) % 5], 35, KADO.tema, i + 20)}
        </svg>
        <div class="kertas__isi tulisan-tangan" style="font-size: 1.55rem; text-align:center; position:relative; z-index:2;">
          ${aman(teks)}
        </div>
        <p style="position:absolute; bottom: 1rem; left: 0; right: 0; text-align:center; font-size:0.75rem; color:rgba(160,124,58,.6); font-family:var(--cetak);">
          Lembar — ${i + 1} dari ${catatan.length}
        </p>`;
      isiHalaman.push({ tipe: "kertas", html: htmlCatatan });
    });

    // Proses Render Elemen Halaman
    let halElements = [];
    isiHalaman.forEach((hal, i) => {
      const lembarBuku = el(
        "div",
        hal.tipe === "cover" ? "sampul__buku" : "kertas"
      );
      lembarBuku.style.position = "absolute";
      lembarBuku.style.inset = "0";
      lembarBuku.style.width = "100%";
      lembarBuku.style.height = "100%";
      lembarBuku.style.margin = "0";
      lembarBuku.style.transformOrigin = "left center";
      lembarBuku.style.transition =
        "transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.8s ease-in 0.15s";
      lembarBuku.style.zIndex = String(100 - i);

      if (hal.tipe === "kertas") {
        lembarBuku.style.padding = "2.5rem 1.8rem";
        lembarBuku.style.borderRadius = "3px 6px 6px 3px";
        lembarBuku.style.overflow = "hidden";
        lembarBuku.style.display = "flex";
        lembarBuku.style.flexDirection = "column";
        lembarBuku.style.justifyContent = "center";
        lembarBuku.style.boxShadow = "0 12px 30px -10px rgba(0,0,0,.6)";
      }

      lembarBuku.innerHTML = hal.html;
      wadah3D.appendChild(lembarBuku);
      halElements.push(lembarBuku);
    });

    const tombol = el(
      "button",
      "tombol",
      `<span aria-hidden="true">❦</span> Buka pelan-pelan`
    );
    tombol.type = "button";

    let halAktif = 0;
    tombol.addEventListener("click", () => {
      if (halAktif < halElements.length - 1) {
        halElements[halAktif].style.transform = "rotateY(-140deg)";
        halElements[halAktif].style.opacity = "0";
        halAktif++;

        tombol.style.opacity = "0";
        setTimeout(() => {
          tombol.innerHTML =
            halAktif === 1
              ? aman(surat.tombol)
              : halAktif === halElements.length - 1
              ? "Lanjut ke bagian utama"
              : "Buka lembar selanjutnya";
          tombol.style.opacity = "1";
        }, 400);
      } else {
        lanjut();
      }
    });

    lembar.append(wadah3D, tombol);
    return lembar;
  }

  /* ============================================================
     ADEGAN 4 — GALERI
     ============================================================ */
  function adeganGaleri(lanjut) {
    const foto = KADO.galeri || [];
    if (!foto.length) {
      lanjut();
      return el("div");
    }

    const lembar = el("div", "lembar");
    const tumpuk = el("div", "galeri__tumpuk");
    let atas = 0;

    foto.forEach((f, i) => {
      const kartu = el("div", "polaroid");
      const bidang = el("div", "polaroid__bidang");
      const gambar = new Image();
      gambar.alt = f.judul || "Foto kenangan";
      gambar.loading = "eager";
      gambar.src = f.file;
      gambar.addEventListener("error", () => {
        bidang.innerHTML = `<div class="polaroid__kosong">
          <svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            ${Flora.bunga(
              ["daisy", "matahari", "krisan", "marigold"][i % 4],
              38,
              KADO.tema,
              i + 5
            )}
          </svg></div>`;
      });
      bidang.appendChild(gambar);
      kartu.appendChild(bidang);
      if (f.judul) kartu.appendChild(el("p", "polaroid__judul", aman(f.judul)));
      if (f.catatan)
        kartu.appendChild(el("p", "polaroid__catatan", aman(f.catatan)));
      kartu.addEventListener("click", putar);
      tumpuk.appendChild(kartu);
    });

    const kartuSemua = Array.from(tumpuk.children);

    function susun() {
      kartuSemua.forEach((k, i) => {
        const p = (i - atas + kartuSemua.length) % kartuSemua.length;
        const putaran = [0, -4.5, 4, -2.5, 3][p % 5] || 0;
        k.style.transform = `translateY(${p * -7}px) rotate(${
          p === 0 ? -1.2 : putaran
        }deg) scale(${1 - p * 0.035})`;
        k.style.zIndex = String(kartuSemua.length - p);
        k.style.opacity = p > 3 ? "0" : "1";
        k.style.pointerEvents = p === 0 ? "auto" : "none";
      });
      petunjuk.textContent = `Foto ${atas + 1} dari ${
        kartuSemua.length
      } — ketuk untuk ganti`;
    }

    function putar() {
      atas = (atas + 1) % kartuSemua.length;
      susun();
    }

    const petunjuk = el("p", "galeri__petunjuk", "");
    const tombol = el("button", "tombol", "Lanjut");
    tombol.type = "button";
    tombol.addEventListener("click", lanjut);

    lembar.append(tumpuk, petunjuk, tombol);
    susun();
    return lembar;
  }

  /* ============================================================
     ADEGAN 5 — HITUNGAN HARI
     ============================================================ */
  function adeganHitungan(lanjut) {
    const h = KADO.hitungan;
    const mulai = new Date(h.mulai + "T00:00:00");
    const kini = new Date();
    const hari = Math.max(0, Math.floor((kini - mulai) / 86400000));

    const lembar = el("div", "lembar");
    const kotak = el("div", "hitungan__kotak");
    kotak.innerHTML = `
      <p class="hitungan__sebelum">${aman(h.sebelum)}</p>
      <span class="hitungan__garis" aria-hidden="true"></span>
      <p class="hitungan__angka" aria-label="${hari} hari">0</p>
      <p class="hitungan__sesudah">${aman(h.sesudah)}</p>
      <span class="hitungan__garis" aria-hidden="true"></span>
      <p class="hitungan__tambahan">${aman(h.tambahan)}</p>`;

    const angka = kotak.querySelector(".hitungan__angka");
    const hemat = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hemat) angka.textContent = hari.toLocaleString("id-ID");
    else {
      const durasi = 1500;
      const awal = performance.now();
      (function tik(t) {
        const p = Math.min(1, (t - awal) / durasi);
        const e = 1 - Math.pow(1 - p, 3);
        angka.textContent = Math.round(hari * e).toLocaleString("id-ID");
        if (p < 1) requestAnimationFrame(tik);
      })(awal);
    }

    const tombol = el("button", "tombol", "Lanjut");
    tombol.type = "button";
    tombol.addEventListener("click", lanjut);
    lembar.append(kotak, tombol);
    return lembar;
  }

  /* ============================================================
     ADEGAN 6 — RENCANA
     ============================================================ */
  function adeganRencana(lanjut) {
    const r = KADO.rencana;
    const lembar = el("div", "lembar");
    const bungkus = el("div", "rencana__bungkus");
    const kartu = el("article", "kertas kartu-rencana");

    const kepala = el("header", "kartu-rencana__kepala");
    kepala.innerHTML = `
      <p class="kartu-rencana__pita">${aman(KADO.sampul.garisAtas)}</p>
      <h2 class="kartu-rencana__judul">${aman(r.judul)}</h2>
      <p class="kartu-rencana__sub">${aman(r.subjudul)}</p>
      ${
        r.tanggal
          ? `<p class="kartu-rencana__tanggal">${aman(r.tanggal)}</p>`
          : ""
      }`;

    const jadwal = el("ol", "jadwal");
    (r.agenda || []).forEach((a, i) => {
      const li = el("li");
      li.innerHTML = `
        <span class="jadwal__titik" aria-hidden="true">${i + 1}</span>
        <div>
          <p class="jadwal__jam">Pukul ${aman(a.jam)}</p>
          <p class="jadwal__kategori">${aman(a.kategori || "")}</p>
          <h3 class="jadwal__tempat">${aman(a.tempat)}</h3>
          <p class="jadwal__catatan">${aman(a.catatan || "")}</p>
        </div>
        <span class="jadwal__ubin">${
          a.file ? `<img src="${aman(a.file)}" alt="">` : aman(a.emoji || "♡")
        }</span>`;
      jadwal.appendChild(li);
    });

    const nota = el("div", "kartu-rencana__nota");
    nota.innerHTML = `<h4>Catatan kecil</h4><p>${aman(r.catatanKecil)}</p>`;

    const label = el("div", "kartu-rencana__label");
    (r.label || []).forEach((l) =>
      label.appendChild(el("span", null, aman(l)))
    );

    kartu.append(kepala, jadwal, nota, label);
    bungkus.appendChild(kartu);

    const geser = el(
      "p",
      "rencana__geser",
      "geser ke bawah, masih ada lanjutannya"
    );
    bungkus.addEventListener(
      "scroll",
      () => {
        geser.dataset.sembunyi = "true";
      },
      { once: true, passive: true }
    );
    requestAnimationFrame(() => {
      if (bungkus.scrollHeight <= bungkus.clientHeight + 8)
        geser.dataset.sembunyi = "true";
    });

    const tombol = el("button", "tombol", "Aku setuju");
    tombol.type = "button";
    tombol.addEventListener("click", lanjut);

    lembar.append(bungkus, geser, tombol);
    return lembar;
  }

  /* ============================================================
     ADEGAN 7 — BUKET
     ============================================================ */
  function adeganBuket(lanjut) {
    const daftar = (KADO.buket || []).slice(0, 6);
    if (!daftar.length) {
      lanjut();
      return el("div");
    }

    const lembar = el("div", "lembar");
    const ajakan = el("p", "galeri__petunjuk", "Ketuk bunganya satu-satu");
    const buket = el("div", "buket");

    const sebar = 86;
    const awal = -sebar / 2;

    daftar.forEach((b, i) => {
      const sudut =
        daftar.length === 1 ? 0 : awal + (sebar / (daftar.length - 1)) * i;
      const t = el("button", "tangkai mekar");
      t.type = "button";
      t.style.setProperty("--r", sudut.toFixed(1) + "deg");
      t.style.setProperty("--d", (0.16 * i).toFixed(2) + "s");
      t.style.zIndex = String(10 - Math.abs(Math.round(sudut / 10)));
      t.setAttribute("aria-label", b.nama);
      t.innerHTML = Flora.tangkai(b.jenis, KADO.tema, i + 3, 176, 38);
      t.addEventListener("click", () => {
        buket
          .querySelectorAll(".tangkai")
          .forEach((x) => x.classList.remove("dipilih"));
        t.classList.add("dipilih");
        makna.classList.remove("ganti");
        void makna.offsetWidth;
        makna.classList.add("ganti");
        makna.innerHTML = `<h3>${aman(b.nama)}</h3><p>${aman(b.makna)}</p>`;
        Petals.hujan(8);
        if (!dilihat.has(i)) {
          dilihat.add(i);
          if (dilihat.size === daftar.length) {
            tombol.disabled = false;
            tombol.textContent = "Sudah semua";
            ajakan.textContent = "Semua sudah kamu buka.";
          } else {
            ajakan.textContent = `${daftar.length - dilihat.size} tangkai lagi`;
          }
        }
      });
      buket.appendChild(t);
    });

    const dilihat = new Set();

    const bungkusKertas = el("div", "buket__pembungkus");
    bungkusKertas.innerHTML = `<svg viewBox="0 0 150 118" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 4 75 118 140 4 108 18 75 6 42 18Z" fill="#C9AC7E"/>
      <path d="M10 4 75 118 75 6 42 18Z" fill="#B2946A"/>
      <path d="M42 18 75 6 75 118Z" fill="#D7BC90" opacity=".55"/>
      <g stroke="rgba(92,68,36,.28)" stroke-width="1" fill="none">
        <path d="M26 11 75 100"/><path d="M58 12 75 56"/>
        <path d="M124 11 75 100"/><path d="M92 12 75 56"/>
      </g>
      <path d="M28 60h94l-9 13H37Z" fill="#7E1428"/>
      <path d="M28 60h94l-2 3H30Z" fill="#9A1B31" opacity=".7"/>
      <path d="M63 66c-11-7-24 2-15 11 7 6 17 1 21-7zM87 66c11-7 24 2 15 11-7 6-17 1-21-7z" fill="#8E1528"/>
      <path d="M70 73 58 96M80 73l12 23" stroke="#7E1428" stroke-width="4" stroke-linecap="round" fill="none"/>
      <circle cx="75" cy="70" r="6" fill="#C9A34E"/>
    </svg>`;
    buket.appendChild(bungkusKertas);

    const makna = el("div", "buket__makna");
    makna.innerHTML = `<h3>&nbsp;</h3><p>Tiap tangkai punya alasannya sendiri.</p>`;

    const tombol = el("button", "tombol", "Buka semuanya dulu");
    tombol.type = "button";
    tombol.disabled = true;
    tombol.addEventListener("click", lanjut);

    lembar.append(ajakan, buket, makna, tombol);
    return lembar;
  }

  /* ============================================================
     ADEGAN 8 — PENUTUP
     ============================================================ */
  function adeganPenutup(lanjut) {
    const p = KADO.penutup;
    const lembar = el("div", "lembar");
    lembar.append(
      el("h2", "penutup__judul", aman(p.judul)),
      el("p", "penutup__pesan", aman(p.pesan)),
      el("p", "penutup__ttd", aman(p.ttd))
    );

    const kabar = el("p", "penutup__kabar", "");
    const simpan = el("button", "tombol", "Simpan kartu rencananya");
    simpan.type = "button";
    simpan.addEventListener("click", () => {
      simpan.disabled = true;
      Keepsake.simpan(KADO, (t) => (kabar.textContent = t)).finally(() => {
        simpan.disabled = false;
      });
    });

    const tombolLanjut = el(
      "button",
      "tombol tombol--sepi",
      "Masuk ke Dunia Kita"
    );
    tombolLanjut.type = "button";
    tombolLanjut.addEventListener("click", lanjut);

    const kotak = el("div", "penutup__tombol");
    kotak.append(simpan, tombolLanjut);
    lembar.append(kotak, kabar);

    Petals.hujan(46);
    return lembar;
  }

  /* ============================================================
     PENGATUR ADEGAN
     ============================================================ */
  function bangunUrutan() {
    const u = [adeganBuku];
    if ((KADO.galeri || []).length) u.push(adeganGaleri);
    if (KADO.hitungan && KADO.hitungan.aktif) u.push(adeganHitungan);
    if (KADO.rencana && (KADO.rencana.agenda || []).length) u.push(adeganRencana);
    if ((KADO.buket || []).length) u.push(adeganBuket);

    u.push(adeganPenutup);
    /* adegan orbit — hati bersinar dengan kenangan yang mengelilinginya */
    if (
      typeof Dunia !== "undefined" &&
      KADO.dunia &&
      KADO.dunia.aktif &&
      (KADO.dunia.kenangan || []).length
    ) {
      u.push(Dunia.adegan);
    }
    return u;
  }

  function gambarLangkah() {
    penandaLangkah.innerHTML = "";
    urutan.forEach((_, i) => {
      const s = el("span");
      if (i === indeks) s.className = "kini";
      else if (i < indeks) s.className = "lewat";
      penandaLangkah.appendChild(s);
    });
  }

  function ke(i) {
    if (i >= urutan.length) return; // Mencegah nge-blank kalau adegan Orbit gagal dimuat

    const lama = panggung.querySelector(".adegan");
    if (lama && lama.classList.contains("adegan--keluar")) return; // KUNCI: Mencegah numpuk gara-gara klik dobel!

    const pasang = () => {
      indeks = i;
      const wadah = el("div", "adegan adegan--masuk");
      wadah.appendChild(urutan[i](() => ke(i + 1)));
      panggung.appendChild(wadah);
      gambarLangkah();
      const fokus = wadah.querySelector("button:not([disabled])");
      if (fokus) setTimeout(() => fokus.focus({ preventScroll: true }), 760);
    };

    if (lama) {
      lama.classList.remove("adegan--masuk");
      lama.classList.add("adegan--keluar");
      setTimeout(() => {
        lama.remove();
        pasang();
      }, 320);
    } else pasang();
  }

  /* ============================================================
     MULAI
     ============================================================ */
  async function mulai() {
    document.title = KADO.judulHalaman || `Untuk ${KADO.untuk}`;
    if (sudut) sudut.textContent = KADO.labelSudut || "";

    siapkanMusik();
    siapkanDinding();
    urutan = bangunUrutan();

    await jalankanMuat();
    layarMuat.hidden = true;

    if (KADO.gerbang && KADO.gerbang.aktif) await adeganGerbang();
    await adeganTirai();

    // kelopak dipindah ke belakang isi halaman supaya kertas tetap terbaca
    Petals.pasang(panggung, {
      warna: warnaKelopak(),
      jumlah: 12,
      belakang: true,
      pertahankan: true,
    });
    ke(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mulai);
  } else mulai();
})();
