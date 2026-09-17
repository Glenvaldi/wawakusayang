# Cara memasang adegan "Dunia kecil kita"

Salin isi folder ini ke folder proyekmu, timpa yang lama.
Folder `assets/` punyamu tidak perlu disentuh sama sekali.

```
kado/
├── index.html          ← ditambal (2 baris)
├── css/
│   ├── base.css        (tidak berubah)
│   ├── scenes.css      ← ditambal (gaya kotak petunjuk)
│   └── orbit.css       ← FILE BARU
└── js/
    ├── config.js       ← diganti (Najwa & Glen, PIN 0408, isian adegan baru)
    ├── flora.js        (tidak berubah)
    ├── petals.js       (tidak berubah)
    ├── keepsake.js     (tidak berubah)
    ├── orbit.js        ← FILE BARU
    └── app.js          ← ditambal (petunjuk otomatis + adegan baru)
```

Kalau kamu sudah pernah mengubah isi `config.js` sendiri, jangan ditimpa —
buka file baru ini, salin **bagian nomor 8 (`dunia`)** saja ke config lamamu,
lalu pastikan `untuk`, `dari`, dan `gerbang.jawaban` sudah benar.

---

## Yang berubah

### 1. Kunci pembuka

PIN sekarang `0408`. Tombol "Butuh petunjuk?" dihapus — petunjuknya sekarang
muncul sendiri setelah dia salah **2 kali**.

```js
gerbang: {
  jawaban: "0408",
  salahSebelumPetunjuk: 2,      // ganti angkanya kalau mau
  petunjuk: "Bulan dulu, baru tanggalnya. Bulan keempat, hari kedelapan.",
  salah: "Bukan itu. Pelan-pelan aja, nggak ada yang ngejar."
}
```

**Cek dulu pertanyaannya.** Saya menebak `0408` = 8 April (bulan dulu, seperti
contoh di file aslinya). Kalau maksudnya 4 Agustus atau hal lain, ubah
`pertanyaan`, `formatJawaban`, dan `petunjuk` supaya nyambung.

### 2. Adegan baru

Muncul setelah galeri foto, sebelum hitungan hari. Mau dipindah?
Buka `js/app.js`, cari `bangunUrutan()`, geser baris `u.push(Dunia.adegan);`
ke posisi yang kamu mau.

---

## Mengisi kartu kenangan

Semuanya di `js/config.js` bagian `dunia.kenangan`. Maksimal 8 kartu —
enam sudah terasa penuh. Tiap kartu punya `jenis`:

| jenis | yang perlu diisi |
|---|---|
| `"surat"` | `teks` (baris kosong = paragraf baru), `ttd` |
| `"lagu"` | `judul`, `artis`, `teks`, `spotify` |
| `"video"` | `judul`, `teks`, `youtube` |
| `"foto"` | `file`, `judul`, `teks` |
| `"buket"` | `bunga: [{ jenis, nama, makna }]`, `penutup` |
| `"catatan"` | `judul`, `teks` |

`label` = tulisan kecil di bawah kartu waktu mengorbit. Bikin pendek,
satu atau dua kata, biar tidak menabrak kartu sebelahnya.

**Spotify:** buka lagunya → Share → Copy link → tempel apa adanya.

```js
spotify: "https://open.spotify.com/track/1234567890abcdefgh"
```

**YouTube:** salin alamat videonya, apa adanya juga.

```js
youtube: "https://www.youtube.com/watch?v=xxxxxxxxxxx"
```

Kalau `spotify` atau `youtube` dibiarkan kosong (`""`), pemutarnya tidak
muncul, tapi judul dan teksnya tetap tampil. Jadi situsnya tetap jalan.

**Foto:** sama aturannya seperti galeri — taruh di `assets/foto/`, nama file
harus persis termasuk huruf besar-kecilnya, dan kompres dulu di squoosh.app
sampai di bawah 300 KB. Kalau fotonya belum ada, otomatis diganti gambar bunga.

---

## Catatan teknis

- **Tidak ada file gambar baru.** Hati, bunga, bintang, dan planet semuanya
  digambar sebagai SVG lewat JavaScript. Yang perlu diunduh cuma fotomu sendiri.
- **Warna ikut tema.** Hatinya memakai palet dari `tema` di config.js, jadi
  kalau kamu ganti ke `"merah"` atau `"pink"`, hatinya ikut berubah.
- **Orbitnya melambat** saat kartu disentuh atau di-hover, biar gampang dipencet.
- **Hemat gerakan.** Kalau HP-nya menyalakan "kurangi gerakan", orbitnya
  dibekukan dan kartunya tersebar diam — isinya tetap bisa dibuka semua.
- **Keyboard.** Tiap kartu bisa di-Tab, dan panelnya bisa ditutup dengan Esc.

### Kalau mau mengatur ulang orbitnya

Di `js/orbit.js`, dekat komentar `gerak orbit`:

```js
const MIRING = -7 * Math.PI / 180;   // kemiringan bidang orbit
const KECEPATAN = 0.000148;          // satu putaran ± 42 detik
...
Ry = Rx * 0.5;                       // besar = orbit makin tegak
```

Besar-kecil hati diatur di `css/orbit.css`:

```css
.dunia__hati { width: min(72%, 20rem); }
```
