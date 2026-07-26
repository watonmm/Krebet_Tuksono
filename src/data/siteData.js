/**
 * Data konten website Padukuhan Krebet.
 *
 * Struktur ini dirancang agar mudah di-replace dengan fetch() dari API eksternal.
 * Cukup ganti isi variabel atau ubah menjadi async fetch tanpa mengubah komponen.
 *
 * Contoh migrasi ke API:
 *   const res = await fetch('/api/site-config');
 *   export const siteConfig = await res.json();
 */

export const siteConfig = {
  /* ─── Info Padukuhan ─── */
  padukuhan: {
    name: 'Krebet',
    desa: 'Tuksono',
    kecamatan: 'Sentolo',
    kabupaten: 'Kulon Progo',
    provinsi: 'Daerah Istimewa Yogyakarta',
  },

  /* ─── Hero Section ─── */
  hero: {
    title: 'Selamat Datang di Padukuhan Krebet',
    subtitle:
      'Portal informasi resmi Padukuhan Krebet, Desa Tuksono, Kecamatan Sentolo, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta. Temukan potensi desa, produk UMKM unggulan, dan informasi layanan masyarakat.',
    ctaText: 'Jelajahi Potensi',
    backgroundImage: '/images/Profildesa.jpeg',
  },

  /* ─── Statistik Demografi ─── */
  stats: [
    {
      id: 'kk',
      label: 'Jumlah KK',
      value: 245,
      description: 'Kepala Keluarga terdaftar',
      icon: 'home',
    },
    {
      id: 'male',
      label: 'Laki-laki',
      value: 520,
      description: 'Penduduk laki-laki',
      icon: 'male',
    },
    {
      id: 'female',
      label: 'Perempuan',
      value: 498,
      description: 'Penduduk perempuan',
      icon: 'female',
    },
  ],

  /* ─── Direktori UMKM ─── */
  umkm: [
    {
      id: 1,
      name: 'Keripik Tempe Bu Sari',
      description:
        'Keripik tempe renyah dengan bumbu rempah khas Jawa yang gurih dan nikmat. Tersedia berbagai varian rasa.',
      image: null, // Ganti: '/images/umkm/keripik-tempe.jpg'
      qris: true,
      whatsapp: '6281234567890',
      category: 'Makanan',
      gmaps: null, // Ganti: 'https://maps.app.goo.gl/...'
    },
    {
      id: 2,
      name: 'Batik Tulis Krebet',
      description:
        'Batik tulis tradisional dengan motif khas Kulon Progo, dibuat secara handmade oleh pengrajin lokal.',
      image: null,
      qris: true,
      whatsapp: '6281234567891',
      category: 'Kerajinan',
    },
    {
      id: 3,
      name: 'Madu Hutan Sentolo',
      description:
        'Madu murni dari lebah hutan lokal, kaya manfaat untuk kesehatan dan dikemas secara higienis.',
      image: null,
      qris: false,
      whatsapp: '6281234567892',
      category: 'Pertanian',
    },
    {
      id: 4,
      name: 'Anyaman Bambu Pak Joko',
      description:
        'Produk anyaman bambu berkualitas untuk kebutuhan rumah tangga dan dekorasi interior.',
      image: null,
      qris: true,
      whatsapp: '6281234567893',
      category: 'Kerajinan',
    },
    {
      id: 5,
      name: 'Kopi Robusta Krebet',
      description:
        'Kopi robusta pilihan dari kebun lokal, dipanggang sempurna untuk cita rasa premium.',
      image: null,
      qris: true,
      whatsapp: '6281234567894',
      category: 'Minuman',
    },
    {
      id: 6,
      name: 'Gula Kelapa Organik',
      description:
        'Gula kelapa organik tanpa bahan pengawet, cocok untuk gaya hidup sehat dan masakan tradisional.',
      image: null,
      qris: false,
      whatsapp: '6281234567895',
      category: 'Pertanian',
    },
  ],

  /* ─── Fasilitas Umum ─── */
  facilities: [
    {
      id: 1,
      name: 'Balai Dusun Krebet',
      type: 'Balai Desa',
      description:
        'Tempat pertemuan warga, kegiatan gotong royong, dan pelatihan masyarakat.',
      address: 'Jl. Krebet No. 1, Dusun Krebet',
      phone: '6281234567801',
      gmaps: null,
      image: null,
    },
    {
      id: 2,
      name: 'Posyandu Melati',
      type: 'Posyandu',
      description:
        'Layanan kesehatan ibu dan anak, imunisasi, serta penyuluhan gizi.',
      address: 'Jl. Krebet Raya, Dusun Krebet',
      phone: '6281234567802',
      gmaps: null,
      image: null,
    },
  ],

  /* ─── Kebudayaan & Kesenian ─── */
  culture: [
    {
      id: 1,
      name: 'Sanggar Tari Oglek Krebet',
      type: 'Sanggar Seni',
      description:
        'Komunitas pelestarian tari tradisional Krebet dan pertunjukan kesenian lokal.',
      address: 'Dusun Krebet',
      phone: '6281234567803',
      gmaps: null,
      image: null,
    },
    {
      id: 2,
      name: 'Festival Baritan Suran',
      type: 'Kesenian Tradisional',
      description:
        'Acara budaya tahunan yang menampilkan musik tradisional dan pertunjukan seni rakyat.',
      address: 'Lapangan Krebet',
      phone: '',
      gmaps: null,
      image: null,
    },
  ],

  /* ─── Perangkat / Pimpinan ─── */
  leadership: [
    {
      name: '—', // Ganti dengan nama asli
      position: 'Kepala Padukuhan',
      phone: '6281234567800',
    },
  ],

  /* ─── Kontak ─── */
  contact: {
    address:
      'Padukuhan Krebet, Desa Tuksono, Kec. Sentolo, Kab. Kulon Progo, Daerah Istimewa Yogyakarta',
  },

  /* ─── Peta ─── */
  map: {
    wilayah: {
      title: 'Peta administrasi Wilayah',
      description: 'Peta batas wilayah Padukuhan Krebet',
      embedUrl: null, // Ganti dengan Google Maps embed URL
      image: '/images/PetaKrebet.jpg', // Atau: '/images/peta-wilayah.jpg'
    },
    administrasi: {
      title: 'Peta UMKM Krebet',
      description: 'Peta persebaran UMKM Krebet',
      image: '/images/PetaUMKM.jpg',
    },
  },

  /* ─── Tentang Kami ─── */
  about: {
    title: 'Profil Padukuhan',
    subtitle: 'Sejarah, Visi & Misi Padukuhan Krebet',
    sejarah: 'Padukuhan Krebet merupakan salah satu wilayah yang masyarakatnya terus menjaga identitas budaya dan tradisi seperti Baritan Suran dan kesenian Oglek. Wilayah ini memiliki potensi pertanian dan UMKM yang berkembang, serta berkomitmen untuk melestarikan nilai-nilai lokal.',
    visi: 'Mewujudkan Desa Tuksono menjadi Desa Mandiri melalui bidang Pertanian dan Industri Kecil, serta menjadi Desa Budaya yang lestari.',
    misi: [
      'Meningkatkan perekonomian masyarakat melalui pemberdayaan UMKM dan kerajinan lokal.',
      'Memajukan sektor pertanian sebagai penopang utama ketahanan pangan.',
      'Melestarikan nilai-nilai tradisi dan seni budaya lokal, seperti pelestarian adat Baritan dan kesenian Oglek.'
    ],
    image: '/images/Profildesa.jpeg',
  },
};
