/* ============================================================
   keepsake.js — membuat kartu rencana jadi satu gambar PNG
   yang bisa dia simpan ke galeri HP.
   Semuanya digambar di <canvas>, tanpa pustaka luar.
   ============================================================ */

const Keepsake = (() => {

  const L = 1080;              // lebar kartu
  const TEPI = 84;             // jarak dari pinggir

  const WARNA = {
    kertasA: "#FDF8EC",
    kertasB: "#F1E3C7",
    kertasC: "#E6D3AE",
    emas:    "#A8823A",
    emasMuda:"#D9B463",
    tinta:   "#4A3320",
    tintaMuda:"#7A6045",
    segel:   "#7E1428",
    segelTua:"#4E0C1B"
  };

  function huruf(ctx, ukuran, keluarga = "cetak", tebal = 400, miring = false) {
    const peta = {
      cetak: '"Cormorant Garamond", Georgia, serif',
      nama:  '"Parisienne", cursive',
      tulis: '"Caveat", cursive'
    };
    ctx.font = `${miring ? "italic " : ""}${tebal} ${ukuran}px ${peta[keluarga]}`;
  }

  /* pecah teks jadi baris sesuai lebar */
  function baris(ctx, teks, lebar) {
    const kata = String(teks).split(/\s+/);
    const hasil = [];
    let kini = "";
    for (const k of kata) {
      const coba = kini ? kini + " " + k : k;
      if (ctx.measureText(coba).width > lebar && kini) { hasil.push(kini); kini = k; }
      else kini = coba;
    }
    if (kini) hasil.push(kini);
    return hasil;
  }

  function tulis(ctx, teks, x, y, lebar, tinggiBaris, rata = "left") {
    const brs = baris(ctx, teks, lebar);
    ctx.textAlign = rata;
    brs.forEach((b, i) => ctx.fillText(b, x, y + i * tinggiBaris));
    return brs.length * tinggiBaris;
  }

  /* spasi huruf manual, karena canvas belum konsisten mendukungnya */
  function tulisRenggang(ctx, teks, x, y, spasi, rata = "center") {
    const hrf = String(teks).split("");
    const lebarTotal = hrf.reduce((a, h) => a + ctx.measureText(h).width + spasi, -spasi);
    let kx = rata === "center" ? x - lebarTotal / 2 : x;
    ctx.textAlign = "left";
    for (const h of hrf) { ctx.fillText(h, kx, y); kx += ctx.measureText(h).width + spasi; }
    return lebarTotal;
  }

  /* bunga sederhana untuk hiasan sudut */
  function bungaKecil(ctx, x, y, r, isi, intiWarna, jumlah = 12) {
    ctx.save();
    ctx.translate(x, y);
    for (let i = 0; i < jumlah; i++) {
      ctx.save();
      ctx.rotate((Math.PI * 2 / jumlah) * i);
      ctx.fillStyle = isi;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-r * .22, -r * .34, -r * .18, -r * .95, 0, -r);
      ctx.bezierCurveTo(r * .18, -r * .95, r * .22, -r * .34, 0, 0);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = intiWarna;
    ctx.beginPath(); ctx.arc(0, 0, r * .26, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function garisHias(ctx, x, y, lebar) {
    ctx.strokeStyle = WARNA.emas;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x - lebar / 2, y);
    ctx.lineTo(x - 22, y);
    ctx.moveTo(x + 22, y);
    ctx.lineTo(x + lebar / 2, y);
    ctx.stroke();
    ctx.fillStyle = WARNA.emas;
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 13, y, 2.4, 0, Math.PI * 2);
    ctx.arc(x + 13, y, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ---------- menghitung tinggi lalu menggambar ---------- */
  function gambar(data) {
    const ukur = document.createElement("canvas").getContext("2d");
    const dalam = L - TEPI * 2;

    /* --- hitung tinggi dulu --- */
    let t = TEPI + 70;
    huruf(ukur, 56, "cetak", 500); t += 4;
    const judulBaris = baris(ukur, data.rencana.judul, dalam - 60);
    t += judulBaris.length * 76 + 18;
    huruf(ukur, 30, "cetak", 400, true);
    t += baris(ukur, data.rencana.subjudul, dalam - 140).length * 42 + 26;
    t += 40 + 46;

    const tinggiBaris = [];
    data.rencana.agenda.forEach(a => {
      huruf(ukur, 27, "cetak", 400, true);
      const nb = baris(ukur, a.catatan || "", dalam - 250).length;
      tinggiBaris.push(Math.max(156, 118 + nb * 36));
    });
    t += tinggiBaris.reduce((a, b) => a + b, 0) + 34;

    huruf(ukur, 28, "cetak", 400);
    const notaBaris = baris(ukur, data.rencana.catatanKecil, dalam - 96);
    t += 40 + 52 + notaBaris.length * 44 + 40 + 36;
    t += 54 + 64 + TEPI;

    const T = Math.max(1620, Math.round(t));

    /* --- kanvas sebenarnya --- */
    const k = document.createElement("canvas");
    k.width = L; k.height = T;
    const c = k.getContext("2d");

    /* kertas */
    const kg = c.createLinearGradient(0, 0, L * .5, T);
    kg.addColorStop(0, WARNA.kertasA);
    kg.addColorStop(.55, WARNA.kertasB);
    kg.addColorStop(1, WARNA.kertasC);
    c.fillStyle = kg;
    c.fillRect(0, 0, L, T);

    /* noda halus supaya terasa seperti kertas */
    for (let i = 0; i < 150; i++) {
      c.fillStyle = `rgba(150,120,70,${Math.random() * .016})`;
      const r = 14 + Math.random() * 46;
      c.beginPath();
      c.arc(Math.random() * L, Math.random() * T, r, 0, Math.PI * 2);
      c.fill();
    }

    /* hiasan bunga di sudut */
    c.globalAlpha = .17;
    [[74, 74], [L - 74, 74], [74, T - 74], [L - 74, T - 74]].forEach(([x, y], i) => {
      bungaKecil(c, x, y, 62, "#D8A93F", "#A8823A", 14);
      bungaKecil(c, x + (i % 2 ? -46 : 46), y + (i < 2 ? 40 : -40), 38, "#E8D08A", "#C09A46", 12);
    });
    c.globalAlpha = 1;

    /* bingkai emas rangkap */
    c.strokeStyle = "rgba(168,130,58,.62)"; c.lineWidth = 2;
    c.strokeRect(44, 44, L - 88, T - 88);
    c.strokeStyle = "rgba(168,130,58,.3)"; c.lineWidth = 1;
    c.strokeRect(58, 58, L - 116, T - 116);

    let y = TEPI + 76;
    const tengah = L / 2;

    /* pita atas */
    c.fillStyle = WARNA.emas;
    huruf(c, 21, "cetak", 600);
    tulisRenggang(c, (data.sampul.garisAtas || "").toUpperCase(), tengah, y, 7.5);
    y += 56;

    /* judul */
    c.fillStyle = WARNA.segel;
    huruf(c, 62, "cetak", 500);
    c.textAlign = "center";
    judulBaris.forEach((b, i) => c.fillText(b, tengah, y + i * 76));
    y += judulBaris.length * 76 + 6;

    /* subjudul */
    c.fillStyle = WARNA.tintaMuda;
    huruf(c, 30, "cetak", 400, true);
    y += tulis(c, data.rencana.subjudul, tengah, y, dalam - 140, 42, "center") + 18;

    /* tanggal */
    if (data.rencana.tanggal) {
      c.fillStyle = WARNA.emas;
      huruf(c, 20, "cetak", 600);
      tulisRenggang(c, data.rencana.tanggal.toUpperCase(), tengah, y, 6);
      y += 34;
    }

    garisHias(c, tengah, y + 10, 220);
    y += 62;

    /* daftar acara */
    const xRel = TEPI + 46;
    const totalRel = tinggiBaris.reduce((a, b) => a + b, 0);
    c.strokeStyle = "rgba(168,130,58,.45)";
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(xRel, y + 14);
    c.lineTo(xRel, y + totalRel - tinggiBaris[tinggiBaris.length - 1] + 14);
    c.stroke();

    data.rencana.agenda.forEach((a, i) => {
      const tinggi = tinggiBaris[i];
      const ty = y;

      /* lingkaran nomor */
      const g = c.createRadialGradient(xRel - 6, ty + 6, 2, xRel, ty + 12, 26);
      g.addColorStop(0, "#9A1B31"); g.addColorStop(.6, WARNA.segel); g.addColorStop(1, WARNA.segelTua);
      c.fillStyle = g;
      c.beginPath(); c.arc(xRel, ty + 12, 24, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#F7DCC6";
      huruf(c, 24, "cetak", 600);
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(String(i + 1), xRel, ty + 13);
      c.textBaseline = "alphabetic";

      const xt = xRel + 48;
      const lebarTeks = dalam - 250;

      /* jam */
      c.fillStyle = WARNA.tintaMuda;
      huruf(c, 23, "cetak", 400);
      c.textAlign = "left";
      c.fillText(a.jam || "", xt, ty + 8);

      /* kategori tulisan tangan */
      c.fillStyle = WARNA.emas;
      huruf(c, 30, "tulis", 400);
      c.fillText(a.kategori || "", xt, ty + 42);

      /* nama tempat */
      c.fillStyle = WARNA.tinta;
      huruf(c, 30, "cetak", 600);
      tulisRenggang(c, (a.tempat || "").toUpperCase(), xt, ty + 78, 2.6, "left");

      /* catatan */
      c.fillStyle = WARNA.tintaMuda;
      huruf(c, 27, "cetak", 400, true);
      tulis(c, a.catatan || "", xt, ty + 112, lebarTeks, 36, "left");

      /* ubin kanan */
      const ux = L - TEPI - 92, uy = ty + 6;
      c.save();
      c.translate(ux + 40, uy + 40);
      c.rotate((i % 2 ? -2 : 2) * Math.PI / 180);
      c.fillStyle = "#FCF8F0";
      c.fillRect(-44, -44, 88, 88);
      const ug = c.createLinearGradient(-38, -38, 38, 38);
      ug.addColorStop(0, "#EFE2C8"); ug.addColorStop(1, "#DCC9A6");
      c.fillStyle = ug;
      c.fillRect(-38, -38, 76, 76);
      c.font = '44px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",serif';
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(a.emoji || "♡", 0, 2);
      c.textBaseline = "alphabetic";
      c.restore();

      if (i < data.rencana.agenda.length - 1) {
        c.strokeStyle = "rgba(168,130,58,.3)";
        c.lineWidth = 1;
        c.setLineDash([5, 7]);
        c.beginPath();
        c.moveTo(xt, y + tinggi - 26);
        c.lineTo(L - TEPI - 24, y + tinggi - 26);
        c.stroke();
        c.setLineDash([]);
      }

      y += tinggi;
    });

    y += 28;

    /* catatan kecil */
    const notaT = 52 + notaBaris.length * 44 + 34;
    const ng = c.createLinearGradient(TEPI, y, TEPI, y + notaT);
    ng.addColorStop(0, "#6D1226"); ng.addColorStop(1, WARNA.segelTua);
    c.fillStyle = ng;
    c.fillRect(TEPI, y, dalam, notaT);
    c.fillStyle = WARNA.emasMuda;
    huruf(c, 32, "tulis", 400);
    c.textAlign = "left";
    c.fillText("Catatan kecil", TEPI + 34, y + 44);
    c.fillStyle = "rgba(246,226,210,.92)";
    huruf(c, 28, "cetak", 400);
    let ny = y + 88;
    baris(c, data.rencana.catatanKecil, dalam - 96).forEach(b => {
      c.fillText(b, TEPI + 34, ny); ny += 44;
    });
    y += notaT + 46;

    /* label */
    if (data.rencana.label && data.rencana.label.length) {
      huruf(c, 20, "cetak", 600);
      const lebarLabel = data.rencana.label.map(l => {
        const hrf = l.toUpperCase().split("");
        return hrf.reduce((a, h) => a + c.measureText(h).width + 5, -5) + 44;
      });
      const total = lebarLabel.reduce((a, b) => a + b, 0) + (lebarLabel.length - 1) * 14;
      let lx = tengah - total / 2;
      data.rencana.label.forEach((l, i) => {
        c.strokeStyle = "rgba(168,130,58,.5)";
        c.lineWidth = 1;
        const w = lebarLabel[i];
        c.beginPath();
        if (c.roundRect) c.roundRect(lx, y - 22, w, 38, 19);
        else c.rect(lx, y - 22, w, 38);
        c.stroke();
        c.fillStyle = WARNA.emas;
        tulisRenggang(c, l.toUpperCase(), lx + w / 2, y + 3, 5);
        lx += w + 14;
      });
      y += 58;
    }

    /* kaki kartu */
    garisHias(c, tengah, y + 4, 180);
    y += 52;
    c.fillStyle = WARNA.segel;
    huruf(c, 46, "nama", 400);
    c.textAlign = "center";
    c.fillText(`untuk ${data.untuk}`, tengah, y);
    y += 40;
    c.fillStyle = WARNA.tintaMuda;
    huruf(c, 24, "cetak", 400, true);
    c.fillText(`dari ${data.dari}`, tengah, y);

    return k;
  }

  /* ---------- tampilkan + unduh ---------- */
  function simpan(data, saatKabar) {
    const pesan = saatKabar || (() => {});
    pesan("Menyiapkan kartunya…");

    const siap = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    return siap.then(() => new Promise(res => {
      // beri jeda satu bingkai supaya huruf benar-benar siap dipakai kanvas
      requestAnimationFrame(() => {
        const k = gambar(data);
        const nama = `rencana-untuk-${String(data.untuk).toLowerCase().replace(/\s+/g, "-")}.png`;

        k.toBlob(blob => {
          if (!blob) { pesan("Kartunya gagal dibuat. Coba lagi ya."); return res(false); }
          const url = URL.createObjectURL(blob);

          // coba unduh langsung
          const a = document.createElement("a");
          a.href = url; a.download = nama;
          document.body.appendChild(a); a.click(); a.remove();

          // dan tetap tampilkan gambarnya, karena sebagian HP tidak
          // mengunduh otomatis — di situ dia tinggal tekan lama lalu simpan
          tampilkan(url, nama);
          pesan("Kartunya sudah jadi.");
          setTimeout(() => URL.revokeObjectURL(url), 120000);
          res(true);
        }, "image/png");
      });
    }));
  }

  function tampilkan(url, nama) {
    const lama = document.getElementById("pratinjau-kartu");
    if (lama) lama.remove();

    const bungkus = document.createElement("div");
    bungkus.id = "pratinjau-kartu";
    bungkus.className = "pratinjau";
    bungkus.innerHTML = `
      <div class="pratinjau__isi" role="dialog" aria-modal="true" aria-label="Kartu rencana">
        <img src="${url}" alt="Kartu rencana kencan">
        <p class="pratinjau__petunjuk">Kalau belum otomatis tersimpan, tekan lama gambarnya lalu pilih simpan.</p>
        <div class="pratinjau__aksi">
          <a class="tombol" href="${url}" download="${nama}">Unduh lagi</a>
          <button class="tombol tombol--sepi" type="button" data-tutup>Tutup</button>
        </div>
      </div>`;
    document.body.appendChild(bungkus);
    requestAnimationFrame(() => bungkus.classList.add("tampil"));

    const tutup = () => {
      bungkus.classList.remove("tampil");
      setTimeout(() => bungkus.remove(), 300);
    };
    bungkus.querySelector("[data-tutup]").addEventListener("click", tutup);
    bungkus.addEventListener("click", e => { if (e.target === bungkus) tutup(); });
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") { tutup(); document.removeEventListener("keydown", esc); }
    });
  }

  return { simpan, gambar };
})();
