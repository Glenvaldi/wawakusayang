/* ============================================================
   KADO — file isian
   ------------------------------------------------------------
   Cuma file ini yang perlu kamu ubah. Sisanya biarkan saja.
   Tulis di antara tanda kutip. Kalau teksnya panjang / banyak
   baris, pakai tanda backtick ( ` ) seperti contoh di bawah.
   ============================================================ */

const KADO = {
  /* --- 1. Dua nama ---------------------------------------- */
  untuk: "Najwa",
  dari: "Glen",

  /* Warna bunga di dinding pembuka.
     Pilihan: "kuning" · "merah" · "pink" · "putih" · "campur"  */
  tema: "kuning",

  /* Judul tab browser + teks kecil di pojok atas halaman */
  judulHalaman: "Untuk Najwa",
  labelSudut: "Kisah Kita Glen & Najwa",

  /* --- 2. Kunci kecil sebelum masuk ------------------------
     Biar dia harus jawab dulu. Kalau nggak mau, ubah
     aktif jadi false.
     Jawaban tidak peka huruf besar/kecil.

     salahSebelumPetunjuk: berapa kali dia boleh salah sebelum
     petunjuknya muncul sendiri. Sekarang: 2 kali.            */
  gerbang: {
    aktif: true,
    pertanyaan: "Apa ya kata kuncinya? pasti cintaku tau",
    formatJawaban: "Tulis 4 angka, bulan dulu — contoh: 1225",
    jawaban: "0408",
    salahSebelumPetunjuk: 2,
    petunjuk: "Tanggal dulu, baru Bulanya. Hari keempat, Bulan kedelapan.",
    salah: "Bukan itu. Pelan-pelan aja, nggak ada yang ngejar sayang.",
  },

  /* --- 3. Dinding bunga (layar pertama) -------------------- */
  tirai: {
    ajakan: "Ketuk bunganya",
    bisikan: "pelan aja, nggak usah buru-buru",
  },

  /* --- 4. Kartu sampul ------------------------------------- */
  sampul: {
    garisAtas: "Sebuah hari, sebuah kenangan",
    subjudul:
      "Bukan sekadar kata-kata, tapi sebagian kecil dari alasanku bahagia memilikimu.",
    tombol: "Buka pelan-pelan",
  },

  /* --- 5. Surat tulisan tangan -----------------------------
     Baris kosong = paragraf baru.                            */
  surat: {
    isi: `Wawaakuu sayaanggg,

Aku sengaja siapin ini khusus buat cintaku. Mungkin nggak mewah, tapi aku bikin ini sambil terus mikirin kamu lhoo.

Dibaca pelan-pelan yaa sayang, jangan di-skip bacanya :)`,
    tombol: "Mulai pelan-pelan",
  },

  /* --- 6. Hal kecil, muncul satu per satu ------------------
     Tambah atau kurangi sesukamu. Nomornya otomatis.         */
  /* --- 6. Hal kecil, muncul satu per satu ------------------
     Tambah atau kurangi sesukamu. Nomornya otomatis.         */
  halKecil: [
    "Cilukbaa! Kaget ya halamannya sekarang lega banget? Sengaja aku bikin begini biar aku bisa nulis panjang lebar tentang betapa gemesnya wawaakuu ini. 🥺",
    "Jujur deh, kadang aku suka senyum-senyum sendiri kalau lagi mikirin wawaa. Kayak... kok bisa ya ada bidadari secantik, se-sabar, dan se-ngangenin kamu yang nemenin aku? Hehehe.",
    "Tiap hari rasanya aku makin sayang sama cintakuu. Walaupun kadang aku suka nyebelin atau manja banget, wawaa selalu punya cara buat bikin semuanya jadi adem lagi. Makasih yaa sayang...",
    "Aku tuh pengen banget bisa terus-terusan natap senyum manis kamu. Pengen ndusel-ndusel sambil dengerin ceritamu seharian tanpa ada yang ganggu. Mau yaa? 👉👈",
    "Di dunia yang kadang bikin capek ini, cuma wawaa tempat aku pulang dan nge-charge energi. Jangan bosen-bosen yaa ngadepin manjanya aku, karena cuma ke kamu aku bisa sedekat ini.",
    "Aku janji bakal selalu berusaha jadi Glen yang terbaik buat wawaakuu. Apapun yang terjadi ke depannya, pegang tanganku terus yaa sayang. Kita lewatin semuanya bareng-bareng.",
    "Udah ah, kalau ditulis semua beneran nggak bakal cukup satu buku ini. Intinya... I love you so much, Wawaakuu sayang! Yuk, lanjut buka lembar selanjutnya, masih ada kejutan buat cintakuu! 🥰",
  ],

  /* --- 7. Galeri foto --------------------------------------
     Taruh fotonya di folder: assets/foto/
     Lalu tulis nama filenya persis, termasuk .jpg / .png.
     Belum ada foto? Biarkan saja — nanti muncul gambar bunga
     sebagai pengganti sementara.                             */
  galeri: [
    {
      file: "assets/foto/afiks.webp",
      judul: "Pertama kali",
      catatan: "Betapa indahnya dirimu waktu ini dan membuatku jatuh cinta.",
    },
    {
      file: "assets/foto/bfiks.webp",
      judul: "Sore itu",
      catatan: "Bunga pertama untukmu dan Wawaa menerima cintaakuu.",
    },
    {
      file: "assets/foto/cfiks.webp",
      judul: "Jatim Park 1",
      catatan: "Foto betapa indahnya dirimu dan JatimPark date kita love.",
    },
    {
      file: "assets/foto/dfiks.webp",
      judul: "Kebun Raya",
      catatan: "Bersepeda bersamamu menikmati indahnya wajahmu kala itu",
    },
  ],

  /* --- 8. Dunia kecil kita ---------------------------------
     Adegan hati bersinar dengan kartu kenangan yang mengorbit.
     Letaknya di tengah alur, setelah galeri foto.

     Tiap kenangan punya `jenis`. Pilihannya:

       "foto"    → file: "assets/foto/xx.jpg"
       "surat"   → teks: `...` (baris kosong = paragraf baru)
       "lagu"    → spotify: id lagu atau tautannya
       "video"   → youtube: id video atau tautannya
       "buket"   → bunga: [{ jenis, nama, makna }]
       "catatan" → teks biasa

     label  = tulisan kecil di bawah kartunya waktu mengorbit
     Maksimal 8 kartu. Enam sudah terasa penuh dan cantik.

     Cara ambil id Spotify: buka lagunya → Share → Copy link,
     tempel apa adanya, nggak usah dipotong.
     Cara ambil id YouTube: salin saja alamat videonya.       */
  dunia: {
    aktif: true,
    garisAtas: "Sesuatu untuk Najwa",
    judul: "Dunia kecil kita",
    bisikan:
      "Najwa sayang, pencet tiap kenangan yang mengelilingi hati itu yaa",
    tombol: "Lanjut",

    kenangan: [
      {
        jenis: "surat",
        label: "Surat",
        judul: "Yang nggak sempat aku bilang",
        teks: `Aku nggak selalu pandai merangkai kata. Tapi aku benar-benar bersyukur bisa kenal kamu.

Dan kalau boleh jujur, aku pengen tetap ada di dekat kamu. Bukan cuma hari ini, tapi di banyak hari setelah ini.

Makasih ya udah hadir di hidupku sayang.`,
        ttd: "— Glen",
      },

      {
        jenis: "lagu",
        label: "Spotify",
        judul: "Lagu yang selalu ngingetin aku ke kamu",
        artis: "Ganti judul dan penyanyinya di config.js",
        teks: "Dengerin pas lagi santai ya. Aku nggak pernah bisa dengerin ini tanpa kepikiran kamu.",
        /* tempel tautan Spotify-nya di sini, contoh:
           spotify: "https://open.spotify.com/track/1234567890abcdefghij"  */
        spotify:
          "https://open.spotify.com/track/0f9J5rMcMhCQiPGSJHvr7G?si=1db9dcddf67b41a5",
      },

      {
        jenis: "video",
        label: "YouTube",
        judul: "Ini buat kamu tonton",
        teks: "Nggak panjang kok. Tapi aku pengen kamu lihat.",
        /* tempel alamat videonya di sini, contoh:
           youtube: "https://www.youtube.com/watch?v=xxxxxxxxxxx"  */
        youtube: "https://youtu.be/SLXWSQPM59o?si=bn4jJzpsI3GPsRfG",
      },

      {
        jenis: "foto",
        label: "Foto 1",
        file: "assets/foto/fotokita.jpeg",
        judul: "Hari itu",
        teks: "Bunga yang tidak akan pernah layu dan indah sepertimu",
      },

      {
        jenis: "foto",
        label: "Foto 2",
        file: "assets/foto/fotokitabanget.jpeg",
        judul: "Yang ini juga",
        teks: "Foto gemas kita dan sweet love",
      },

      {
        jenis: "buket",
        label: "Buket",
        judul: "Buket kecil untuk Najwa",
        teks: "Kalau aku bisa kasih bunga lewat layar, ini yang aku pilih.",
        bunga: [
          {
            jenis: "mawar",
            nama: "Mawar",
            makna:
              "Perlambang cintaku buat wawaa. Nggak main-main, aku beneran sayang dan serius banget sama kamu.",
          },
          {
            jenis: "tulip",
            nama: "Tulip",
            makna:
              "Buat ngingetin wawaakuu, secantik apa pun bunga ini, tetep kalah manis sama senyumnya cintakuu.",
          },
          {
            jenis: "daisy",
            nama: "Daisy",
            makna:
              "Untuk semua hal kecil dan random wawaa yang selalu berhasil bikin aku gemes sendiri.",
          },
          {
            jenis: "matahari",
            nama: "Bunga matahari",
            makna:
              "Karena wawaa itu kayak matahari, selalu jadi sumber kehangatan pas hariku lagi capek-capeknya.",
          },
          {
            jenis: "krisan",
            nama: "Krisan",
            makna:
              "Tanda makasihku buat wawaa yang super sabar dan tetep betah nemenin aku pas lagi manja atau nyebelin.",
          },
        ],
        penutup: "Ketuk bunganya kalau mau lihat lebih dekat.",
      },
    ],
  },

  /* --- 9. Hitungan hari ------------------------------------
     Format tanggal: "TAHUN-BULAN-TANGGAL"                    */
  hitungan: {
    aktif: true,
    mulai: "2026-08-04",
    sebelum: "Sampai hari ini kita udah jalan",
    sesudah: "hari.",
    tambahan: "Dan aku masih pengen nambah terus.",
  },

  /* --- 10. Daftar Pujian & Rencana Masa Depan (Pengganti Timeline) --- */
  rencana: {
    judul: "Untuk Wawaakuu Sayaanggg",
    subjudul:
      "Sedikit alasan kenapa aku se-sayang ini sama kamu, dan hal-hal yang pengen banget kita lakuin bareng soon! 💖",
    tanggal: "Coming Soon...",
    agenda: [
      {
        jam: "Alasan #1",
        kategori: "Senyum Wawaa",
        tempat: "Bikin Candu Banget",
        catatan:
          "Senyum wawaa itu magis tau. Secapek apa pun hariku, rasanya langsung luluh dan semangat lagi kalau udah lihat senyum cintakuu.",
        emoji: "✨",
      },
      {
        jam: "Rencana #1",
        kategori: "Motoran Berdua",
        tempat: "Keliling Kota",
        catatan:
          "Nanti kita motoran berdua yaa, nyari angin sore sambil jajan makanan kesukaan wawaakuu sayaanggg. Asal bareng kamu, ke mana aja ayo.",
        emoji: "🛵",
      },
      {
        jam: "Alasan #2",
        kategori: "Kesabaran Wawaa",
        tempat: "Rumah Ternyamanku",
        catatan:
          "Makasih ya wawaa udah selalu sabar ngadepin aku. Support dari cintakuu ini energi paling besar buat aku ngelewatin capeknya hari-hari.",
        emoji: "🏡",
      },
      {
        jam: "Rencana #2",
        kategori: "Nge-date Estetik",
        tempat: "Makan & Photobox",
        catatan:
          "Nanti kita hunting tempat makan enak, terus mampir photobox ya! Biar kenangan aku sama wawaa ada wujud fisiknya buat disimpen.",
        emoji: "📸",
      },
      {
        jam: "Janji Glen",
        kategori: "Cuma Untuk Wawaa",
        tempat: "Selalu Ada Buatmu",
        catatan:
          "Apapun rencananya nanti, yang paling penting itu perginya sama cintakuu. Aku bakal terus berusaha jadi yang terbaik buat wawaakuu sayaanggg.",
        emoji: "❤️",
      },
    ],
    catatanKecil:
      "Tungguin aku yaa cintakuu. Nanti kita realisasikan semua rencana ini bareng-bareng. I love youuu, wawaakuu sayaanggg!",
    label: ["Wawaakuu", "Cintakuu", "Soon yaa sayang"],
  },

  /* --- 11. Buket penutup -----------------------------------
     Tiap tangkai dia ketuk, maknanya muncul.
     jenis: "matahari" · "daisy" · "mawar" · "krisan" · "tulip"
     Maksimal 6 tangkai biar buketnya tetap rapi.             */
  buket: [
    {
      jenis: "matahari",
      nama: "Bunga matahari",
      makna:
        "Karena wawaa itu kayak matahari, selalu jadi sumber kehangatan pas hariku lagi capek-capeknya.",
    },
    {
      jenis: "daisy",
      nama: "Daisy",
      makna:
        "Untuk semua hal kecil dan random wawaa yang selalu berhasil bikin aku gemes sendiri.",
    },
    {
      jenis: "mawar",
      nama: "Mawar",
      makna:
        "Perlambang cintaku buat wawaa. Nggak main-main, aku beneran sayang dan serius banget sama kamu.",
    },
    {
      jenis: "krisan",
      nama: "Krisan",
      makna:
        "Tanda makasihku buat wawaa yang super sabar dan tetep betah nemenin aku pas lagi manja atau nyebelin.",
    },
    {
      jenis: "tulip",
      nama: "Tulip",
      makna:
        "Buat ngingetin wawaakuu, secantik apa pun bunga ini, tetep kalah manis sama senyumnya cintakuu.",
    },
  ],

  /* --- 12. Penutup ----------------------------------------- */
  penutup: {
    judul: "See you soon, Wawaa",
    pesan:
      "Kalau wawaa setuju, tungguin aku jemput yaa. Kalau cintaku mau ganti rencananya juga boleh banget — yang penting aku perginya sama kamu.",
    ttd: "— Glen",
  },

  /* --- 13. Musik latar -------------------------------------
     Taruh file .mp3 di folder: assets/musik/
     Lagu mulai jalan setelah dia menyentuh layar pertama.
     Nggak mau pakai musik? aktif: false                      */
  musik: {
    aktif: true,
    file: "assets/musik/aboutyou.mp3",
    judul: "lagu kita",
  },
};
