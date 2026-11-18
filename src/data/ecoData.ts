import type {
  ArticleItem,
  CampaignItem,
  LeaderboardEntry,
  QuestItem,
  UserProfile,
} from '../utils/ecoLogic';

export const INITIAL_ME: UserProfile = {
  nama: 'Kamu',
  xp: 250,
  poin: 62,
  level: 3,
  levelXp: 400,
  levelStep: 200,
};

export const REROLL_MAX = 3;

export const INITIAL_QUEST_IDS = [
  'tumbler-hero',
  'water-guardian',
  'recycle-ranger',
];

export const QUEST_POOL: QuestItem[] = [
  {
    id: 'tumbler-hero',
    judul: 'Tumbler Hero',
    tag: 'Hemat Plastik',
    xp: 50,
    poin: 10,
    deskripsi: 'Bawa botol minum sendiri untuk mengurangi sampah plastik.',
    langkah: [
      'Siapkan botol minum yang bisa dipakai ulang.',
      'Isi dengan air dan bawa ke sekolah atau tempat aktivitasmu.',
      'Foto botolmu sebagai bukti, lalu kirim misi.',
    ],
  },
  {
    id: 'water-guardian',
    judul: 'Water Guardian',
    tag: 'Hemat Air',
    xp: 40,
    poin: 8,
    deskripsi: 'Tutup keran dan gunakan air secukupnya hari ini.',
    langkah: [
      'Pastikan keran tertutup rapat setelah dipakai.',
      'Matikan air saat menyikat gigi atau menyabuni tangan.',
      'Foto keran yang sudah tertutup, lalu kirim misi.',
    ],
  },
  {
    id: 'recycle-ranger',
    judul: 'Recycle Ranger',
    tag: 'Daur Ulang',
    xp: 60,
    poin: 12,
    deskripsi: 'Pilah sampah organik dan anorganik dengan benar.',
    langkah: [
      'Siapkan dua wadah: organik dan anorganik.',
      'Pisahkan sampah hari ini ke wadah yang sesuai.',
      'Foto hasil pemilahanmu, lalu kirim misi.',
    ],
  },
  {
    id: 'light-saver',
    judul: 'Light Saver',
    tag: 'Hemat Energi',
    xp: 45,
    poin: 9,
    deskripsi: 'Matikan lampu dan alat listrik yang tidak sedang dipakai.',
    langkah: [
      'Cek ruangan yang kosong di rumah atau kelas.',
      'Matikan lampu, kipas, atau charger yang menganggur.',
      'Foto saklar yang sudah dimatikan, lalu kirim misi.',
    ],
  },
  {
    id: 'green-walker',
    judul: 'Green Walker',
    tag: 'Transportasi',
    xp: 55,
    poin: 11,
    deskripsi: 'Berjalan kaki atau bersepeda untuk perjalanan dekat.',
    langkah: [
      'Pilih tujuan yang jaraknya dekat.',
      'Berjalan kaki atau bersepeda ke sana.',
      'Foto perjalananmu, lalu kirim misi.',
    ],
  },
  {
    id: 'plant-buddy',
    judul: 'Plant Buddy',
    tag: 'Tanam',
    xp: 70,
    poin: 14,
    deskripsi: 'Rawat atau siram satu tanaman di sekitarmu.',
    langkah: [
      'Pilih satu tanaman di rumah atau sekolah.',
      'Siram atau bersihkan daunnya dengan lembut.',
      'Foto tanamanmu, lalu kirim misi.',
    ],
  },
  {
    id: 'bag-buddy',
    judul: 'Bag Buddy',
    tag: 'Hemat Plastik',
    xp: 40,
    poin: 8,
    deskripsi: 'Pakai tas belanja sendiri, tolak kantong plastik sekali pakai.',
    langkah: [
      'Siapkan tas kain atau tas belanja sendiri.',
      'Gunakan saat berbelanja dan tolak kantong plastik.',
      'Foto tas belanjamu, lalu kirim misi.',
    ],
  },
  {
    id: 'trash-collector',
    judul: 'Trash Collector',
    tag: 'Peduli Sekitar',
    xp: 65,
    poin: 13,
    deskripsi: 'Pungut 5 sampah di sekitarmu dan buang ke tempatnya.',
    langkah: [
      'Cari 5 sampah di sekitar rumah atau sekolah.',
      'Pakai sarung tangan atau alat bantu agar aman.',
      'Foto sampah yang terkumpul, lalu kirim misi.',
    ],
  },
];

export const LEADERBOARD_OTHERS: LeaderboardEntry[] = [
  { nama: 'BintangHijau', xp: 1250, poin: 312 },
  { nama: 'DaunCeria', xp: 1120, poin: 280 },
  { nama: 'EcoKecil', xp: 1080, poin: 270 },
  { nama: 'AirBersih', xp: 760, poin: 190 },
];

export const ARTICLES: ArticleItem[] = [
  {
    id: 'pilah-sampah',
    title: 'Yuk, Pilah Sampah!',
    category: 'Daur Ulang',
    icon: '♻',
    tone: 'green',
    minutes: 3,
    summary:
      'Kenali sampah organik dan anorganik, lalu temukan cara sederhana memilahnya.',
    paragraphs: [
      'Sampah di sekitar kita memiliki jenis yang berbeda. Sisa makanan dan daun termasuk sampah organik, sedangkan botol plastik dan kaleng umumnya dikelompokkan sebagai sampah anorganik.',
      'Mulailah dengan menyiapkan tempat sampah terpisah. Pastikan sampah yang akan didaur ulang dalam keadaan cukup bersih dan mengikuti aturan pengumpulan di daerahmu.',
      'Cobalah memilah tiga benda yang ada di rumah hari ini. Jika ragu, tanyakan kepada orang dewasa atau petugas pengelola sampah.',
    ],
  },
  {
    id: 'hemat-air',
    title: 'Hemat Air di Rumah',
    category: 'Hemat Air',
    icon: '💧',
    tone: 'purple',
    minutes: 2,
    summary:
      'Kebiasaan kecil membantu kita menggunakan air dengan lebih bijak.',
    paragraphs: [
      'Air bersih dibutuhkan untuk minum, memasak, dan menjaga kebersihan. Karena itu, gunakan air secukupnya dan hindari membiarkan keran menyala tanpa diperlukan.',
      'Saat menyikat gigi, matikan keran. Jika menemukan keran yang bocor, beri tahu orang dewasa agar bisa segera diperbaiki.',
      'Ajak keluarga membuat pengingat sederhana di dekat keran: “Gunakan seperlunya, tutup setelah selesai.”',
    ],
  },
  {
    id: 'sahabat-pohon',
    title: 'Sahabat Pohon',
    category: 'Konservasi',
    icon: '🌳',
    tone: 'green',
    minutes: 3,
    summary:
      'Cari tahu mengapa pohon penting dan cara merawat tanaman sekitar.',
    paragraphs: [
      'Pohon memberikan tempat berlindung bagi berbagai makhluk hidup dan membantu menjaga kualitas lingkungan.',
      'Kita dapat merawat pohon dengan tidak merusak batang atau rantingnya, menjaga tanah di sekitarnya tetap bersih, dan menyiram tanaman sesuai kebutuhannya.',
      'Pilih satu tanaman di rumah atau sekolah. Amati perubahan daunnya selama beberapa hari.',
    ],
  },
  {
    id: 'energi-pintar',
    title: 'Energi Pintar',
    category: 'Hemat Energi',
    icon: '☀',
    tone: 'yellow',
    minutes: 3,
    summary:
      'Kenali cara sederhana menghemat listrik dalam kegiatan sehari-hari.',
    paragraphs: [
      'Peralatan listrik memudahkan banyak aktivitas, tetapi energi perlu digunakan secara bijak.',
      'Matikan lampu saat ruangan tidak digunakan dan cabut pengisi daya dari stopkontak bila sudah tidak diperlukan, dengan bantuan orang dewasa jika perlu.',
      'Periksa rumah bersama keluarga dan temukan satu kebiasaan hemat energi yang bisa dilakukan setiap hari.',
    ],
  },
  {
    id: 'kurangi-plastik',
    title: 'Kurangi Plastik Sekali Pakai',
    category: 'Daur Ulang',
    icon: '🛍',
    tone: 'yellow',
    minutes: 2,
    summary:
      'Bawa tumbler dan tas belanja sendiri untuk mengurangi sampah.',
    paragraphs: [
      'Kemasan sekali pakai sering digunakan sebentar, tetapi sampahnya perlu dikelola setelah dibuang.',
      'Membawa botol minum pakai ulang dan tas belanja sendiri adalah dua langkah sederhana yang bisa dicoba.',
      'Sebelum pergi, cek isi tasmu: sudah membawa tumbler atau tas belanja belum?',
    ],
  },
  {
    id: 'laut-bersih',
    title: 'Laut Bersih, Hewan Bahagia',
    category: 'Konservasi',
    icon: '🐟',
    tone: 'purple',
    minutes: 3,
    summary:
      'Jaga lingkungan sungai dan laut dengan membuang sampah pada tempatnya.',
    paragraphs: [
      'Sampah yang dibuang sembarangan dapat terbawa air hujan menuju sungai dan laut.',
      'Menjaga kebersihan lingkungan sekitar adalah bagian dari usaha melindungi ekosistem perairan.',
      'Mulai hari ini, buang sampah pada tempatnya dan ajak teman melakukan hal yang sama.',
    ],
  },
];

export const CAMPAIGNS: Record<'reb' | 'kar' | 'alam', CampaignItem> = {
  reb: {
    key: 'reb',
    label: 'Reboisasi',
    t: 'Reboisasi',
    d: 'Menanam kembali pohon di lahan kritis dan merawatnya sampai tumbuh.',
    g: 2e7,
    c: 12.4e6,
    n: 'Target pohon',
    a: 2000,
    b: 1240,
    u: 'pohon',
  },
  kar: {
    key: 'kar',
    label: 'Karhutla',
    t: 'Karhutla darurat',
    d: 'Bantuan untuk pemadaman, masker, dan pemulihan lahan yang terbakar.',
    g: 3e7,
    c: 9.6e6,
    n: 'Target paket bantuan',
    a: 500,
    b: 150,
    u: 'paket',
  },
  alam: {
    key: 'alam',
    label: 'Bantuan alam',
    t: 'Bantuan alam',
    d: 'Bersih sungai, bibit mangrove, dan perlengkapan relawan lingkungan.',
    g: 1.5e7,
    c: 6e6,
    n: 'Target aksi bersih',
    a: 20,
    b: 8,
    u: 'aksi',
  },
};
