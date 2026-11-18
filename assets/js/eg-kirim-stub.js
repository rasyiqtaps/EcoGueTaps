/*
 * EcoGueTaps - STUB fitur "Kirim Quest" (SIMULASI)
 * ------------------------------------------------------------------
 * File ini hanya placeholder supaya tombol "Kirim Quest" bisa didemokan.
 * Fitur kirim yang sebenarnya dikerjakan oleh anggota tim lain.
 *
 * KONTRAK yang dipakai eg-app.js:
 *   window.EcoGueTaps.kirimQuest(quest)  ->  Promise<{ ok, status, message }>
 *     - quest   : objek dari EcoGueTapsData.quests
 *     - status  : 'terkirim' (atau 'belum')
 *     - message : teks yang ditampilkan sebagai toast
 *
 * Saat penggabungan: cukup HAPUS <script> file ini dari index.html dan
 * ganti dengan script fitur kirim yang asli yang mengisi fungsi yang
 * sama. eg-app.js, HTML, dan CSS tidak perlu disentuh.
 */
window.EcoGueTaps = window.EcoGueTaps || {};

window.EcoGueTaps.kirimQuest = function (quest) {
    return Promise.resolve({
        ok: true,
        status: 'terkirim',
        message: 'Fitur kirim quest segera hadir'
    });
};
