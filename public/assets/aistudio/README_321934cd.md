# EcoGueTaps — Daily Quest & Leaderboard (HTML/CSS/JS)

Buka `index.html` langsung di browser (tanpa server). Font memakai Google Fonts (perlu internet; ada fallback).

## Struktur (semua file baru, folder sendiri)
```
EcoGueTaps/
├─ index.html
└─ assets/
   ├─ css/ecoguetaps.css      (class berawalan eg-)
   └─ js/
      ├─ eg-data.js           data contoh quest, leaderboard (XP + Poin), level
      ├─ eg-kirim-stub.js     SIMULASI fitur kirim quest  <-- diganti saat digabung
      └─ eg-app.js            render UI, pop-up, toast, status lokal
```

## Aman untuk digabung dengan fitur "Kirim Quest"
- Tidak ada file/routing yang sudah ada diubah; nama file berawalan `eg-`, class CSS `eg-`, JS dibungkus IIFE.
- Tombol "Kirim Quest" hanya memanggil `window.EcoGueTaps.kirimQuest(quest)` -> `Promise<{ok, status, message}>`.
- Saat ini fungsi itu ada di `eg-kirim-stub.js` (toast "Fitur kirim quest segera hadir" + status "Terkirim (Simulasi)", disimpan di memori saja).
- Saat digabung: hapus `<script src="assets/js/eg-kirim-stub.js">` dan pasang script milik fitur kirim yang mengisi fungsi yang sama.
- XP & Poin: setelah `kirimQuest` mengembalikan `ok: true, status: 'terkirim'`, `eg-app.js` memanggil `beriReward(quest)` (satu-satunya tempat XP/Poin ditambah) -> baris "Kamu" di leaderboard, urutan peringkat, dan kartu Level Up ikut berubah. Tiap misi hanya memberi reward sekali. Kalau nanti ada verifikasi, panggil `beriReward` dari hasil verifikasi.
- Ganti Misi (re-roll): tombol di tiap kartu, jatah `rerollMax` per hari (di `eg-data.js`). Misi diambil acak dari `questPool`, tidak boleh sama dengan yang tampil / sudah dikirim, dan misi yang sudah dikirim tidak bisa diganti.
- Semua state masih di memori (reload = reset).

## Kursor pohon & efek daun jatuh
- `assets/css/eg-cursor.css` : kursor pohon (SVG data-URI, titik klik di ujung atas pohon). Default miring 35° ke kiri; tegak lurus di atas tombol/link (ubah sudut lewat `--eg-cursor-tilt`) + lapisan daun.
- `assets/js/eg-cursor.js`   : 8-12 daun berjatuhan di titik klik/tap. Nonaktif otomatis bila `prefers-reduced-motion`.
- Hanya 2 baris ditambahkan di `index.html` (link CSS + script). Hapus keduanya untuk mematikan fitur.
