/*
 * EcoGueTaps - data contoh (dummy) untuk Daily Quest & Leaderboard.
 * Nanti bisa diganti hasil fetch / PHP. Struktur dipertahankan agar
 * eg-app.js tidak perlu diubah.
 */
window.EcoGueTapsData = {
    // Pengguna yang sedang "login". xp & poin = nilai awal hari ini.
    // levelXp = batas XP (kumulatif) untuk naik ke level berikutnya.
    me: { nama: 'Kamu', xp: 250, poin: 62, level: 3, levelXp: 400, levelStep: 200 },

    // Jumlah maksimal "Ganti Misi" (re-roll) per hari
    rerollMax: 3,

    // 3 misi yang tampil di awal hari (id dari questPool)
    questHarian: ['tumbler-hero', 'water-guardian', 'recycle-ranger'],

    // Kumpulan semua misi. Re-roll mengambil acak dari sini.
    questPool: [
        {
            id: 'tumbler-hero', judul: 'Tumbler Hero', tag: 'Hemat Plastik', xp: 50, poin: 10,
            deskripsi: 'Bawa botol minum sendiri untuk mengurangi sampah plastik.',
            langkah: [
                'Siapkan botol minum yang bisa dipakai ulang.',
                'Isi dengan air dan bawa ke sekolah atau tempat aktivitasmu.',
                'Foto botolmu sebagai bukti, lalu kirim misi.'
            ]
        },
        {
            id: 'water-guardian', judul: 'Water Guardian', tag: 'Hemat Air', xp: 40, poin: 8,
            deskripsi: 'Tutup keran dan gunakan air secukupnya hari ini.',
            langkah: [
                'Pastikan keran tertutup rapat setelah dipakai.',
                'Matikan air saat menyikat gigi atau menyabuni tangan.',
                'Foto keran yang sudah tertutup, lalu kirim misi.'
            ]
        },
        {
            id: 'recycle-ranger', judul: 'Recycle Ranger', tag: 'Daur Ulang', xp: 60, poin: 12,
            deskripsi: 'Pilah sampah organik dan anorganik dengan benar.',
            langkah: [
                'Siapkan dua wadah: organik dan anorganik.',
                'Pisahkan sampah hari ini ke wadah yang sesuai.',
                'Foto hasil pemilahanmu, lalu kirim misi.'
            ]
        },
        {
            id: 'light-saver', judul: 'Light Saver', tag: 'Hemat Energi', xp: 45, poin: 9,
            deskripsi: 'Matikan lampu dan alat listrik yang tidak sedang dipakai.',
            langkah: [
                'Cek ruangan yang kosong di rumah atau kelas.',
                'Matikan lampu, kipas, atau charger yang menganggur.',
                'Foto saklar yang sudah dimatikan, lalu kirim misi.'
            ]
        },
        {
            id: 'green-walker', judul: 'Green Walker', tag: 'Transportasi', xp: 55, poin: 11,
            deskripsi: 'Berjalan kaki atau bersepeda untuk perjalanan dekat.',
            langkah: [
                'Pilih tujuan yang jaraknya dekat.',
                'Berjalan kaki atau bersepeda ke sana.',
                'Foto perjalananmu, lalu kirim misi.'
            ]
        },
        {
            id: 'plant-buddy', judul: 'Plant Buddy', tag: 'Tanam', xp: 70, poin: 14,
            deskripsi: 'Rawat atau siram satu tanaman di sekitarmu.',
            langkah: [
                'Pilih satu tanaman di rumah atau sekolah.',
                'Siram atau bersihkan daunnya dengan lembut.',
                'Foto tanamanmu, lalu kirim misi.'
            ]
        },
        {
            id: 'bag-buddy', judul: 'Bag Buddy', tag: 'Hemat Plastik', xp: 40, poin: 8,
            deskripsi: 'Pakai tas belanja sendiri, tolak kantong plastik sekali pakai.',
            langkah: [
                'Siapkan tas kain atau tas belanja sendiri.',
                'Gunakan saat berbelanja dan tolak kantong plastik.',
                'Foto tas belanjamu, lalu kirim misi.'
            ]
        },
        {
            id: 'trash-collector', judul: 'Trash Collector', tag: 'Peduli Sekitar', xp: 65, poin: 13,
            deskripsi: 'Pungut 5 sampah di sekitarmu dan buang ke tempatnya.',
            langkah: [
                'Cari 5 sampah di sekitar rumah atau sekolah.',
                'Pakai sarung tangan atau alat bantu agar aman.',
                'Foto sampah yang terkumpul, lalu kirim misi.'
            ]
        }
    ],

    // Peringkat mingguan (contoh) SELAIN pengguna. Baris "Kamu" ditambahkan
    // otomatis dari `me` oleh eg-app.js, dan urutannya dihitung dari XP.
    leaderboard: [
        { nama: 'BintangHijau', xp: 1250, poin: 312 },
        { nama: 'DaunCeria', xp: 1120, poin: 280 },
        { nama: 'EcoKecil', xp: 1080, poin: 270 },
        { nama: 'AirBersih', xp: 760, poin: 190 }
    ]
};
