/* ===== Modul tim: quest + bukti foto, leaderboard, Eco Library, admin demo, kontak ===== */
try{
/* -- data -- */
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

}catch(e){console.error("EcoGueTaps data:",e)}
try{
/* -- store -- */
/* Penyimpanan DEMO lokal. Bukan pengganti autentikasi, server, atau storage privat. */
(function () {
    'use strict';
    var DB_NAME = 'ecoguetaps-quest-demo';
    var STORE = 'submissions';

    function openDB() {
        return new Promise(function (resolve, reject) {
            if (!('indexedDB' in window)) { reject(new Error('Browser tidak mendukung IndexedDB.')); return; }
            var request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = function () {
                var db = request.result;
                if (!db.objectStoreNames.contains(STORE)) {
                    db.createObjectStore(STORE, { keyPath: 'id' });
                }
            };
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { reject(request.error || new Error('Database lokal gagal dibuka.')); };
        });
    }
    async function transact(mode, op) {
        var db = await openDB();
        return new Promise(function (resolve, reject) {
            var tx = db.transaction(STORE, mode);
            var store = tx.objectStore(STORE);
            var req;
            try { req = op(store); } catch (err) { db.close(); reject(err); return; }
            var output;
            req.onsuccess = function () { output = req.result; };
            tx.oncomplete = function () { db.close(); resolve(output); };
            tx.onerror = function () { db.close(); reject(tx.error || new Error('Gagal menyimpan data.')); };
            tx.onabort = function () { db.close(); reject(tx.error || new Error('Transaksi dibatalkan.')); };
        });
    }
    function all() { return transact('readonly', function (s) { return s.getAll(); }); }
    function get(id) { return transact('readonly', function (s) { return s.get(id); }); }
    function put(row) { return transact('readwrite', function (s) { return s.put(row); }); }

    async function submit(quest, file, note) {
        if (!(file instanceof Blob) || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            throw new Error('Bukti harus berupa JPG, PNG, atau WebP.');
        }
        if (file.size === 0 || file.size > 3 * 1024 * 1024) {
            throw new Error('Ukuran bukti maksimal 3 MB dan tidak boleh kosong.');
        }
        var id = 'user-kamu:' + quest.id;
        var before = await get(id);
        if (before && before.status !== 'ditolak') {
            throw new Error('Quest ini sudah diajukan atau disetujui.');
        }
        var row = {
            id: id, questId: quest.id, questTitle: quest.judul,
            userName: 'Kamu', note: String(note || '').trim().slice(0, 240),
            proof: file, proofName: String(file.name || 'bukti-foto').slice(0, 100),
            xp: quest.xp, poin: quest.poin, status: 'terkirim', reason: '',
            submittedAt: new Date().toISOString(), reviewedAt: null, demo: true
        };
        await put(row);
        return row;
    }
    async function review(id, approve, reason) {
        var row = await get(id);
        if (!row) { throw new Error('Pengajuan tidak ditemukan.'); }
        if (row.status !== 'terkirim') { throw new Error('Pengajuan ini sudah diperiksa.'); }
        if (approve && (!row.proof || !row.proof.size)) {
            throw new Error('Tidak boleh menyetujui quest tanpa foto bukti.');
        }
        if (!approve && !String(reason || '').trim()) {
            throw new Error('Alasan penolakan wajib diisi.');
        }
        row.status = approve ? 'disetujui' : 'ditolak';
        row.reason = approve ? '' : String(reason).trim().slice(0, 300);
        row.reviewedAt = new Date().toISOString();
        await put(row);
        return row;
    }
    window.EcoGueTapsStore = { all: all, get: get, submit: submit, review: review };
})();

}catch(e){console.error("EcoGueTaps store:",e)}
try{
/* -- kirim -- */
/* Adapter PENGIRIMAN DEMO: menyimpan foto di IndexedDB browser, bukan server. */
window.EcoGueTaps = window.EcoGueTaps || {};
window.EcoGueTaps.kirimQuest = async function (quest, payload) {
    if (!window.EcoGueTapsStore) {
        return { ok: false, message: 'Penyimpanan demo belum tersedia.' };
    }
    try {
        await window.EcoGueTapsStore.submit(quest, payload && payload.file, payload && payload.catatan);
        return { ok: true, status: 'terkirim', message: 'Foto tersimpan di browser. Menunggu verifikasi demo.' };
    } catch (error) {
        return { ok: false, message: error.message || 'Bukti gagal disimpan.' };
    }
};

}catch(e){console.error("EcoGueTaps kirim:",e)}
try{
/* -- app -- */
/*
 * EcoGueTaps - UI Daily Quest & Leaderboard
 * Semua kode dibungkus IIFE, tidak ada variabel global baru.
 * Daftar misi aktif dan sisa re-roll ada di memori halaman.
 * Bukti dan persetujuan demo tersimpan lokal di IndexedDB.
 */
(function () {
    'use strict';

    var data = window.EcoGueTapsData;
    if (!data) { return; }
    var hasQuest = !!document.getElementById('eg-quest-list');
    var hasRanking = !!document.getElementById('eg-leaderboard');
    if (!hasQuest && !hasRanking) { return; }

    var STATUS_LABEL = {
        belum: 'Belum dikerjakan',
        terkirim: 'Menunggu verifikasi',
        disetujui: 'Disetujui',
        ditolak: 'Ditolak, dapat kirim ulang'
    };
    var TONES = ['green', 'purple', 'yellow']; // warna kartu mengikuti posisi

    // ------------------------------------------------------------ state lokal
    var pool = {};
    data.questPool.forEach(function (q) { pool[q.id] = q; });

    var state = {
        aktif: data.questHarian.slice(),          // id misi yang tampil (3 slot)
        status: {},                               // id -> 'belum' | 'terkirim'
        sudahDikirim: {},                         // id -> true (tidak muncul lagi di re-roll)
        rerollSisa: data.rerollMax,
        me: Object.assign({}, data.me)            // salinan: xp, poin, level, levelXp
    };

    var fmt = new Intl.NumberFormat('id-ID');
    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function $(id) { return document.getElementById(id); }
    function statusOf(id) { return state.status[id] || 'belum'; }

    // ------------------------------------------------------------ toast
    var toastEl = $('eg-toast');
    var toastTimer = null;
    function toast(msg, ms) {
        if (!toastEl) { return; }
        toastEl.textContent = msg;
        toastEl.classList.add('is-show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, ms || 2800);
    }

    // ------------------------------------------------------------ kartu misi
    function statusPill(id) {
        var s = statusOf(id);
        return '<span class="eg-status eg-status--' + s + '" data-status-for="' + esc(id) + '">' +
            '<i aria-hidden="true"></i>' + STATUS_LABEL[s] + '</span>';
    }

    function rerollBtn(q) {
        var sent = ['terkirim', 'disetujui'].includes(statusOf(q.id));
        var habis = state.rerollSisa <= 0;
        var off = sent || habis;
        var title = sent ? 'Misi yang sudah dikirim tidak bisa diganti'
            : habis ? 'Jatah ganti misi hari ini habis'
                : 'Ganti dengan misi lain';
        return '<button type="button" class="eg-reroll" data-reroll="' + esc(q.id) + '" title="' + title + '"' +
            (off ? ' disabled' : '') + '><span aria-hidden="true">&#8635;</span> Ganti Misi</button>';
    }

    function questCard(q, idx, fresh) {
        return '' +
            '<article class="eg-card eg-quest eg-tone-' + TONES[idx % TONES.length] + (fresh ? ' is-fresh' : '') + '" data-quest-id="' + esc(q.id) + '">' +
            '<div class="eg-quest__top">' +
            '<span class="eg-num">' + String(idx + 1).padStart(2, '0') + '</span>' +
            '<span class="eg-tag">' + esc(q.tag) + '</span>' +
            '</div>' +
            '<h3>' + esc(q.judul) + '</h3>' +
            '<p>' + esc(q.deskripsi) + '</p>' +
            '<div class="eg-quest__meta">' + statusPill(q.id) + rerollBtn(q) + '</div>' +
            '<div class="eg-quest__foot">' +
            '<span class="eg-chips">' +
            '<span class="eg-chip">+' + q.xp + ' XP</span>' +
            '<span class="eg-chip eg-chip--poin">+' + q.poin + ' Poin</span>' +
            '</span>' +
            '<button type="button" class="eg-link" data-open-quest="' + esc(q.id) + '">Lihat Misi <span aria-hidden="true">&rarr;</span></button>' +
            '</div>' +
            '</article>';
    }

    // freshIdx: indeks slot yang baru diganti (untuk animasi)
    function renderQuests(freshIdx) {
        if (!hasQuest) { return; }
        $('eg-quest-list').innerHTML = state.aktif.map(function (id, i) {
            return questCard(pool[id], i, i === freshIdx);
        }).join('');
        var info = $('eg-reroll-info');
        info.innerHTML = '&#8635; Ganti misi: <strong>' + state.rerollSisa + 'x</strong> tersisa hari ini';
        info.classList.toggle('is-empty', state.rerollSisa <= 0);
    }

    // ------------------------------------------------------------ re-roll
    function rerollQuest(id) {
        var slot = state.aktif.indexOf(id);
        if (slot < 0) { return; }
        if (state.sudahDikirim[id]) { toast('Misi yang sedang ditinjau atau sudah disetujui tidak bisa diganti.'); return; }
        if (state.rerollSisa <= 0) { toast('Jatah ganti misi hari ini sudah habis.'); return; }

        // kandidat: belum tampil & belum pernah dikirim
        var kandidat = data.questPool.filter(function (q) {
            return state.aktif.indexOf(q.id) < 0 && !state.sudahDikirim[q.id];
        });
        if (!kandidat.length) { toast('Belum ada misi lain yang tersedia.'); return; }

        var baru = kandidat[Math.floor(Math.random() * kandidat.length)];
        var lama = pool[id];
        state.aktif[slot] = baru.id;
        state.rerollSisa -= 1;
        renderQuests(slot);
        toast('Misi diganti: ' + lama.judul + ' → ' + baru.judul);
    }

    // ------------------------------------------------------------ modal
    var modal = $('eg-modal');
    var modalBody = $('eg-modal-body');

    function renderModal(q) {
        var sent = ['terkirim', 'disetujui'].includes(statusOf(q.id));
        if (!modalBody) { return; }
        modalBody.innerHTML = '' +
            '<span class="eg-tag eg-tag--solid">' + esc(q.tag) + '</span>' +
            '<h3 id="eg-modal-title">' + esc(q.judul) + '</h3>' +
            '<p class="eg-modal__desc">' + esc(q.deskripsi) + '</p>' +
            '<ol class="eg-modal__steps">' +
            q.langkah.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') +
            '</ol>' +
            '<div class="eg-modal__meta">' +
            '<span class="eg-chip">+' + q.xp + ' XP</span>' +
            '<span class="eg-chip eg-chip--poin">+' + q.poin + ' Poin</span>' +
            statusPill(q.id) +
            '</div>' +
            (sent ? '' : '<div class="eg-proof">' +
                '<label for="eg-quest-photo">Bukti foto kegiatan (wajib)</label>' +
                '<input id="eg-quest-photo" type="file" accept="image/jpeg,image/png,image/webp" required>' +
                '<label for="eg-quest-note">Catatan singkat (opsional)</label>' +
                '<textarea id="eg-quest-note" rows="2" maxlength="240" placeholder="Ceritakan kegiatanmu..."></textarea>' +
                '<p>Demo: foto hanya disimpan di browser ini. Hindari foto wajah, alamat, atau data pribadi.</p>' +
                '</div>') +
            '<button type="button" class="eg-btn eg-btn--green eg-modal__send" data-send-quest="' + esc(q.id) + '"' +
            (sent ? ' disabled' : '') + '>' +
            (sent ? 'Menunggu / Sudah Diverifikasi' : 'Kirim Bukti Foto') +
            '</button>';
    }

    function openQuest(id) {
        var q = pool[id];
        if (!q) { return; }
        if (!modal) { return; }
        renderModal(q);
        if (typeof modal.showModal === 'function') { modal.showModal(); }
        else { modal.setAttribute('open', ''); }
    }

    // ------------------------------------------------------------ sinkronisasi verifikasi demo
    // Skor berasal dari entri DISETUJUI. Pengajuan saja tidak menambah XP.
    // Seluruh data demo tersimpan di IndexedDB browser, bukan backend online.
    async function syncReviews() {
        if (!window.EcoGueTapsStore) { return; }
        try {
            var all = await window.EcoGueTapsStore.all();
            var me = Object.assign({}, data.me);
            state.status = {};
            state.sudahDikirim = {};
            var rewarded = new Set();
            all.filter(function (r) { return r.userName === 'Kamu'; }).forEach(function (r) {
                if (!pool[r.questId]) { return; }
                state.status[r.questId] = r.status;
                if (r.status === 'terkirim' || r.status === 'disetujui') {
                    state.sudahDikirim[r.questId] = true;
                }
                if (r.status === 'disetujui' && !rewarded.has(r.questId)) {
                    rewarded.add(r.questId);
                    me.xp += pool[r.questId].xp;
                    me.poin += pool[r.questId].poin;
                }
            });
            while (me.xp >= me.levelXp) { me.level += 1; me.levelXp += me.levelStep; }
            state.me = me;
            renderQuests();
            renderLeaderboard(false);
            renderLevel();
        } catch (error) {
            toast('Demo lokal tidak tersedia: buka dengan server localhost.');
        }
    }

    var sending = false;
    async function sendQuest(id) {
        var q = pool[id];
        if (!q || ['terkirim', 'disetujui'].includes(statusOf(id)) || sending) { return; }
        var photo = $('eg-quest-photo');
        var note = $('eg-quest-note');
        var file = photo && photo.files && photo.files[0];
        if (!file) { toast('Pilih foto bukti kegiatan terlebih dahulu.'); return; }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size === 0 || file.size > 3 * 1024 * 1024) {
            toast('Gunakan JPG/PNG/WebP maksimal 3 MB.'); return;
        }
        var submit = window.EcoGueTaps && window.EcoGueTaps.kirimQuest;
        if (typeof submit !== 'function') { toast('Fitur pengiriman tidak tersedia.'); return; }
        sending = true;
        var btn = document.querySelector('[data-send-quest]');
        if (btn) { btn.disabled = true; btn.textContent = 'Menyimpan bukti...'; }
        try {
            var result = await submit(q, { file: file, catatan: note ? note.value : '' });
            if (result && result.ok && result.status === 'terkirim') {
                await syncReviews();
                if (window.EcoGueTapsAdminReload) { window.EcoGueTapsAdminReload(); }
                renderModal(q);
                toast('Bukti dikirim untuk ditinjau. XP diberikan setelah disetujui.');
            } else {
                toast(result && result.message || 'Pengiriman belum berhasil.');
            }
        } catch (error) {
            toast(error.message || 'Terjadi kesalahan saat mengirim bukti.');
        } finally {
            sending = false;
            if (btn && btn.isConnected && statusOf(id) !== 'terkirim') { btn.disabled = false; btn.textContent = 'Kirim Bukti Foto'; }
        }
    }

    // ------------------------------------------------------------ leaderboard
    function renderLeaderboard(flash) {
        var me = state.me;
        var rows = data.leaderboard.slice();
        rows.push({ nama: me.nama, xp: me.xp, poin: me.poin, isMe: true });
        rows.sort(function (a, b) { return b.xp - a.xp; });

        if (!hasRanking) { return; }
        $('eg-leaderboard').innerHTML = rows.map(function (u, i) {
            var tone = i === 0 ? 'yellow' : i === 1 ? 'purple' : i === 2 ? 'green' : 'plain';
            return '' +
                '<li class="eg-row eg-tone-' + tone + (u.isMe ? ' is-me' : '') + (u.isMe && flash ? ' is-bump' : '') + '">' +
                '<span class="eg-row__rank">' + String(i + 1).padStart(2, '0') + '</span>' +
                '<span class="eg-row__name">' + esc(u.nama) + (u.isMe ? ' <em>(kamu)</em>' : '') + '</span>' +
                '<span class="eg-row__xp">' + fmt.format(u.xp) + ' XP</span>' +
                '<span class="eg-row__poin">' + fmt.format(u.poin) + ' Poin</span>' +
                '</li>';
        }).join('');
    }

    // ------------------------------------------------------------ kartu level
    function renderLevel() {
        if (!hasRanking) { return; }
        var me = state.me;
        var pct = Math.min(100, Math.round(me.xp / me.levelXp * 100));
        $('eg-level-fill').style.width = pct + '%';
        $('eg-level-lv').textContent = 'Level ' + me.level;
        $('eg-level-caption').textContent = fmt.format(me.xp) + ' / ' + fmt.format(me.levelXp) + ' XP menuju level berikutnya';
        $('eg-level-poin').textContent = 'Poin kamu: ' + fmt.format(me.poin);
        var bar = document.querySelector('.eg-level__bar');
        bar.setAttribute('aria-valuemax', me.levelXp);
        bar.setAttribute('aria-valuenow', me.xp);
    }

    // ------------------------------------------------------------ events
    document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-open-quest],[data-send-quest],[data-reroll]');
        if (!t) {
            if (modal && e.target === modal) { modal.close(); } // klik backdrop
            return;
        }
        if (t.hasAttribute('data-open-quest')) { openQuest(t.getAttribute('data-open-quest')); }
        else if (t.hasAttribute('data-send-quest')) { sendQuest(t.getAttribute('data-send-quest')); }
        else if (t.hasAttribute('data-reroll')) { rerollQuest(t.getAttribute('data-reroll')); }
    });

    renderQuests();
    renderLeaderboard(false);
    renderLevel();
    window.EcoGueTapsSync = syncReviews;
    syncReviews();
    window.addEventListener('focus', syncReviews);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { syncReviews(); } });
})();

}catch(e){console.error("EcoGueTaps app:",e)}
try{
/* -- pustaka-data -- */
/* Artikel contoh untuk demo Edukasi Lingkungan. Teks dapat diedit tim. */
window.EcoGueTapsArticles = [
    {
        id: 'pilah-sampah', title: 'Yuk, Pilah Sampah!', category: 'Daur Ulang', icon: '♻', tone: 'green', minutes: 3,
        summary: 'Kenali sampah organik dan anorganik, lalu temukan cara sederhana memilahnya.',
        paragraphs: [
            'Sampah di sekitar kita memiliki jenis yang berbeda. Sisa makanan dan daun termasuk sampah organik, sedangkan botol plastik dan kaleng umumnya dikelompokkan sebagai sampah anorganik.',
            'Mulailah dengan menyiapkan tempat sampah terpisah. Pastikan sampah yang akan didaur ulang dalam keadaan cukup bersih dan mengikuti aturan pengumpulan di daerahmu.',
            'Cobalah memilah tiga benda yang ada di rumah hari ini. Jika ragu, tanyakan kepada orang dewasa atau petugas pengelola sampah.'
        ]
    },
    {
        id: 'hemat-air', title: 'Hemat Air di Rumah', category: 'Hemat Air', icon: '💧', tone: 'purple', minutes: 2,
        summary: 'Kebiasaan kecil membantu kita menggunakan air dengan lebih bijak.',
        paragraphs: [
            'Air bersih dibutuhkan untuk minum, memasak, dan menjaga kebersihan. Karena itu, gunakan air secukupnya dan hindari membiarkan keran menyala tanpa diperlukan.',
            'Saat menyikat gigi, matikan keran. Jika menemukan keran yang bocor, beri tahu orang dewasa agar bisa segera diperbaiki.',
            'Ajak keluarga membuat pengingat sederhana di dekat keran: “Gunakan seperlunya, tutup setelah selesai.”'
        ]
    },
    {
        id: 'sahabat-pohon', title: 'Sahabat Pohon', category: 'Konservasi', icon: '🌳', tone: 'green', minutes: 3,
        summary: 'Cari tahu mengapa pohon penting dan cara merawat tanaman sekitar.',
        paragraphs: [
            'Pohon memberikan tempat berlindung bagi berbagai makhluk hidup dan membantu menjaga kualitas lingkungan.',
            'Kita dapat merawat pohon dengan tidak merusak batang atau rantingnya, menjaga tanah di sekitarnya tetap bersih, dan menyiram tanaman sesuai kebutuhannya.',
            'Pilih satu tanaman di rumah atau sekolah. Amati perubahan daunnya selama beberapa hari.'
        ]
    },
    {
        id: 'energi-pintar', title: 'Energi Pintar', category: 'Hemat Energi', icon: '☀', tone: 'yellow', minutes: 3,
        summary: 'Kenali cara sederhana menghemat listrik dalam kegiatan sehari-hari.',
        paragraphs: [
            'Peralatan listrik memudahkan banyak aktivitas, tetapi energi perlu digunakan secara bijak.',
            'Matikan lampu saat ruangan tidak digunakan dan cabut pengisi daya dari stopkontak bila sudah tidak diperlukan, dengan bantuan orang dewasa jika perlu.',
            'Periksa rumah bersama keluarga dan temukan satu kebiasaan hemat energi yang bisa dilakukan setiap hari.'
        ]
    },
    {
        id: 'kurangi-plastik', title: 'Kurangi Plastik Sekali Pakai', category: 'Daur Ulang', icon: '🛍', tone: 'yellow', minutes: 2,
        summary: 'Bawa tumbler dan tas belanja sendiri untuk mengurangi sampah.',
        paragraphs: [
            'Kemasan sekali pakai sering digunakan sebentar, tetapi sampahnya perlu dikelola setelah dibuang.',
            'Membawa botol minum pakai ulang dan tas belanja sendiri adalah dua langkah sederhana yang bisa dicoba.',
            'Sebelum pergi, cek isi tasmu: sudah membawa tumbler atau tas belanja belum?'
        ]
    },
    {
        id: 'laut-bersih', title: 'Laut Bersih, Hewan Bahagia', category: 'Konservasi', icon: '🐟', tone: 'purple', minutes: 3,
        summary: 'Jaga lingkungan sungai dan laut dengan membuang sampah pada tempatnya.',
        paragraphs: [
            'Sampah yang dibuang sembarangan dapat terbawa air hujan menuju sungai dan laut.',
            'Menjaga kebersihan lingkungan sekitar adalah bagian dari usaha melindungi ekosistem perairan.',
            'Mulai hari ini, buang sampah pada tempatnya dan ajak teman melakukan hal yang sama.'
        ]
    }
];

}catch(e){console.error("EcoGueTaps pustaka-data:",e)}
try{
/* -- pustaka -- */
/* Modul ui: Eco Library, detail artikel, filter, dan Contact (demo). */
(function () {
    'use strict';
    var articles = window.EcoGueTapsArticles || [];
    var $ = function (id) { return document.getElementById(id); };
    var listing = $('eg-library-cards');
    if (!listing) { return; }
    var selected = 'Semua';
    var categories = ['Semua'].concat(Array.from(new Set(articles.map(function (a) { return a.category; }))));
    var dialog = $('eg-article-dialog');
    var body = $('eg-article-body');

    function el(tag, className, content) {
        var node = document.createElement(tag);
        if (className) { node.className = className; }
        if (content !== undefined) { node.textContent = content; }
        return node;
    }
    function renderCategories() {
        var wrap = $('eg-library-filters');
        wrap.replaceChildren();
        categories.forEach(function (category) {
            var button = el('button', 'eg-ui-filter' + (category === selected ? ' is-active' : ''), category);
            button.type = 'button';
            button.dataset.category = category;
            button.setAttribute('aria-pressed', String(category === selected));
            wrap.append(button);
        });
    }
    function createArticleCard(a) {
        var card = el('article', 'eg-ui-article eg-ui-glass');
        var art = el('div', 'eg-ui-article__art eg-tone-' + a.tone);
        art.setAttribute('aria-hidden', 'true');
        art.append(el('span', '', a.icon));
        card.append(art, el('span', 'eg-ui-article__category', a.category));
        card.append(el('h3', '', a.title), el('p', 'eg-ui-article__summary', a.summary));
        var foot = el('div', 'eg-ui-article__foot');
        foot.append(el('span', '', a.minutes + ' menit baca'));
        var button = el('button', 'eg-ui-open', 'Baca Cerita  →');
        button.type = 'button';
        button.dataset.article = a.id;
        foot.append(button);
        card.append(foot);
        return card;
    }
    function renderArticles() {
        var term = $('eg-library-search').value.trim().toLocaleLowerCase('id-ID');
        var matches = articles.filter(function (a) {
            var fitsCategory = selected === 'Semua' || a.category === selected;
            var fitsSearch = [a.title, a.category, a.summary].join(' ').toLocaleLowerCase('id-ID').includes(term);
            return fitsCategory && fitsSearch;
        });
        listing.replaceChildren();
        matches.forEach(function (a) { listing.append(createArticleCard(a)); });
        $('eg-library-count').textContent = matches.length + ' artikel ditemukan';
        $('eg-library-empty').hidden = matches.length !== 0;
    }
    function openArticle(id) {
        var article = articles.find(function (a) { return a.id === id; });
        if (!article) { return; }
        body.replaceChildren();
        body.append(el('span', 'eg-ui-article__category', article.category));
        var heading = el('h3', '', article.title);
        heading.id = 'eg-article-title';
        body.append(heading, el('p', 'eg-ui-reading-time', article.minutes + ' menit baca'));
        article.paragraphs.forEach(function (p) { body.append(el('p', 'eg-ui-reading-paragraph', p)); });
        var tip = el('p', 'eg-ui-article-note', 'Konten edukasi umum. Pendampingan orang dewasa disarankan untuk aktivitas anak.');
        body.append(tip);
        if (typeof dialog.showModal === 'function') { dialog.showModal(); }
        else { dialog.setAttribute('open', ''); }
    }
    $('eg-library-filters').addEventListener('click', function (e) {
        var button = e.target.closest('[data-category]');
        if (!button) { return; }
        selected = button.dataset.category;
        renderCategories();
        renderArticles();
    });
    $('eg-library-search').addEventListener('input', renderArticles);
    listing.addEventListener('click', function (e) {
        var button = e.target.closest('[data-article]');
        if (button) { openArticle(button.dataset.article); }
    });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) { dialog.close(); } });

    renderCategories();
    renderArticles();
})();

}catch(e){console.error("EcoGueTaps pustaka:",e)}
try{
/* -- admin -- */
/* Admin UI DEMO LOKAL. Tidak memiliki otorisasi server dan tidak aman untuk produksi. */
(function () {
    'use strict';
    var store = window.EcoGueTapsStore;
    var $ = function (id) { return document.getElementById(id); };
    var dialog = $('eg-admin-dialog');
    var listing = $('eg-admin-rows');
    var rows = [];
    var current = null;
    var proofUrl = null;
    var labels = { terkirim: 'Menunggu', disetujui: 'Disetujui', ditolak: 'Ditolak' };

    function element(tag, cls, value) {
        var node = document.createElement(tag);
        if (cls) { node.className = cls; }
        if (value !== undefined) { node.textContent = value; }
        return node;
    }
    function dateText(iso) {
        try { return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)); }
        catch (err) { return '-'; }
    }
    async function load() {
        try {
            rows = (await store.all()).sort(function (a, b) { return String(b.submittedAt).localeCompare(String(a.submittedAt)); });
            render();
        } catch (error) {
            listing.replaceChildren(element('p', 'eg-ui-error', 'Tidak bisa membaca data demo. Jalankan website melalui localhost dan coba lagi.'));
        }
    }
    function render() {
        $('eg-admin-pending').textContent = rows.filter(function (r) { return r.status === 'terkirim'; }).length;
        $('eg-admin-approved').textContent = rows.filter(function (r) { return r.status === 'disetujui'; }).length;
        $('eg-admin-rejected').textContent = rows.filter(function (r) { return r.status === 'ditolak'; }).length;
        var filter = $('eg-admin-filter').value;
        var visible = rows.filter(function (r) { return filter === 'semua' || r.status === filter; });
        listing.replaceChildren();
        $('eg-admin-empty').hidden = visible.length !== 0;
        visible.forEach(function (row) {
            var entry = element('article', 'eg-ui-admin-row');
            var info = element('div');
            info.append(element('h3', '', row.questTitle), element('p', '', row.userName + ' • ' + dateText(row.submittedAt)));
            var badge = element('span', 'eg-ui-review-status is-' + row.status, labels[row.status] || 'Tidak diketahui');
            var btn = element('button', 'eg-btn eg-btn--purple', 'Lihat Bukti');
            btn.type = 'button';
            btn.dataset.reviewId = row.id;
            entry.append(info, badge, btn);
            listing.append(entry);
        });
    }
    function revokePreview() {
        if (proofUrl) { URL.revokeObjectURL(proofUrl); proofUrl = null; }
    }
    function openReview(id) {
        var row = rows.find(function (r) { return r.id === id; });
        if (!row) { return; }
        current = row;
        $('eg-admin-dialog-title').textContent = row.questTitle;
        $('eg-admin-user').textContent = row.userName + ' • ' + (labels[row.status] || '') + ' • ' + dateText(row.submittedAt);
        $('eg-admin-note').textContent = row.note ? 'Catatan: ' + row.note : 'Tanpa catatan tambahan.';
        $('eg-admin-reason').value = row.reason || '';
        $('eg-admin-feedback').textContent = '';
        revokePreview();
        var proof = $('eg-admin-proof');
        proof.replaceChildren();
        if (row.proof instanceof Blob && row.proof.size) {
            proofUrl = URL.createObjectURL(row.proof);
            var picture = element('img');
            picture.src = proofUrl;
            picture.alt = 'Bukti foto kegiatan, hanya tersimpan di browser ini';
            proof.append(picture, element('p', '', row.proofName || 'Bukti foto'));
        } else {
            proof.append(element('p', '', 'Tidak ada bukti foto. Pengajuan tidak bisa disetujui.'));
        }
        var pending = row.status === 'terkirim';
        $('eg-admin-approve').disabled = !pending || !(row.proof instanceof Blob && row.proof.size);
        $('eg-admin-reject').disabled = !pending;
        $('eg-admin-reason').disabled = !pending;
        if (typeof dialog.showModal === 'function') { dialog.showModal(); }
        else { dialog.setAttribute('open', ''); }
    }
    async function review(approve) {
        if (!current || current.status !== 'terkirim') { return; }
        var feedback = $('eg-admin-feedback');
        $('eg-admin-approve').disabled = true;
        $('eg-admin-reject').disabled = true;
        try {
            await store.review(current.id, approve, $('eg-admin-reason').value);
            feedback.textContent = approve ? 'Disetujui. XP akan diperbarui pada halaman Peringkat.' : 'Ditolak. Pengguna dapat mengirim ulang bukti.';
            await load();
            if (window.EcoGueTapsSync) { await window.EcoGueTapsSync(); }
            dialog.close();
        } catch (error) {
            feedback.textContent = error.message || 'Verifikasi gagal.';
            $('eg-admin-approve').disabled = false;
            $('eg-admin-reject').disabled = false;
        }
    }
    $('eg-admin-filter').addEventListener('change', render);
    listing.addEventListener('click', function (event) {
        var button = event.target.closest('[data-review-id]');
        if (button) { openReview(button.dataset.reviewId); }
    });
    $('eg-admin-approve').addEventListener('click', function () { review(true); });
    $('eg-admin-reject').addEventListener('click', function () { review(false); });
    dialog.addEventListener('close', function () { revokePreview(); current = null; });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) { dialog.close(); } });
    window.EcoGueTapsAdminReload = load;
    load();
})();

}catch(e){console.error("EcoGueTaps admin:",e)}
try{
/* -- kontak -- */
/* Form kontak demo: salin pesan, tanpa mengirim ke server. */
(function () {
    'use strict';
    var $ = function (id) { return document.getElementById(id); };
    var contact = $('eg-contact-form');
    contact.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!contact.reportValidity()) { return; }
        var name = $('eg-contact-name').value.trim();
        var email = $('eg-contact-email').value.trim();
        var message = $('eg-contact-message').value.trim();
        var output = $('eg-contact-result');
        if (!name || !email || !message) { output.textContent = 'Semua kolom wajib diisi.'; return; }
        var summary = 'Nama: ' + name + '\nEmail: ' + email + '\nPesan: ' + message;
        try {
            if (!navigator.clipboard || !navigator.clipboard.writeText) { throw new Error('Clipboard tidak tersedia'); }
            await navigator.clipboard.writeText(summary);
            output.textContent = 'Pesan berhasil disalin. Belum dikirim ke server.';
        } catch (err) {
            output.textContent = 'Fitur salin membutuhkan localhost/HTTPS dan izin clipboard. Pesan tidak dikirim.';
        }
    });
})();

}catch(e){console.error("EcoGueTaps kontak:",e)}

/* ===== Script utama ===== */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const SG=document.createElement('div');SG.className='sg';$('#top').prepend(SG);SG.append(...Array.from({length:70},()=>{const s=document.createElement('div');s.className='star';const z=1+Math.random()*2.5;s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*85}%;width:${z}px;height:${z}px;animation-delay:${Math.random()*3}s`;return s}));
$('#emb').append(...Array.from({length:30},()=>{const e=document.createElement('div');e.className='emb';e.style.cssText=`left:${Math.random()*100}%;animation-delay:${Math.random()*5}s;animation-duration:${3+Math.random()*4}s`;return e}));
$$('.tbar button').forEach(b=>b.onclick=()=>{$('#info').dataset.t=b.dataset.t;$$('.tbar button').forEach(x=>x.setAttribute('aria-pressed',x===b))});
const C={reb:{t:'Reboisasi',d:'Menanam kembali pohon di lahan kritis dan merawatnya sampai tumbuh.',g:2e7,c:12.4e6,n:'Target pohon',a:2000,b:1240,u:'pohon'},
kar:{t:'Karhutla darurat',d:'Bantuan untuk pemadaman, masker, dan pemulihan lahan yang terbakar.',g:3e7,c:9.6e6,n:'Target paket bantuan',a:500,b:150,u:'paket'},
alam:{t:'Bantuan alam',d:'Bersih sungai, bibit mangrove, dan perlengkapan relawan lingkungan.',g:1.5e7,c:6e6,n:'Target aksi bersih',a:20,b:8,u:'aksi'}};
const rp=n=>'Rp'+Math.round(n).toLocaleString('id-ID');
function show(k){const c=C[k];$('#ct').textContent=c.t;$('#cd').textContent=c.d;$('#b1').style.width=c.c/c.g*100+'%';$('#s1').textContent=rp(c.c)+' terkumpul dari '+rp(c.g)+' (contoh)';$('#g2t').textContent=c.n;$('#b2').style.width=c.b/c.a*100+'%';$('#s2').textContent=c.b+' dari '+c.a+' '+c.u;
$('#donasi').classList.toggle('burn',k==='kar');document.body.classList.toggle('burn',k==='kar');$$('.tabs button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.c===k))}
$$('.tabs button').forEach(b=>b.onclick=()=>show(b.dataset.c));show('reb');
$$('.amt button').forEach(b=>b.onclick=()=>$$('.amt button').forEach(x=>x.setAttribute('aria-pressed',x===b)));
$('#f').onsubmit=e=>{e.preventDefault();$('#msg').textContent='Terima kasih'+($('#nm').value?', '+$('#nm').value:'')+'! Ini tampilan contoh, belum tersambung ke pembayaran.'};

// === Rasyiq: navbar responsif, scrollspy, animasi ===
const nav=$('nav'),bg=$('.burger'),links=$$('nav .l a'),dots=$$('.dots a');
const closeM=()=>{nav.classList.remove('open');bg.setAttribute('aria-expanded','false')};
bg.onclick=()=>{const o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)};
links.forEach(a=>a.addEventListener('click',closeM));
addEventListener('keydown',e=>e.key==='Escape'&&closeM());
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.card,.m,.pf,.chip,.lv,.goal,.mem,.tbar').forEach(el=>{el.classList.add('rv');el.style.setProperty('--d',[...el.parentNode.children].indexOf(el)%4*.1+'s');io.observe(el)});
const spy=(list,k)=>{let cur=null;list.forEach(a=>{const t=$(a.getAttribute('href'));if(t&&t.getBoundingClientRect().top<innerHeight*k)cur=a});list.forEach(a=>a.classList.toggle('act',a===cur))};
const PX=[$('#top'),$('#info')];let tk=false;const onS=()=>{if(scrollY<2600)for(const e of PX)e.style.setProperty('--sy',scrollY);nav.classList.toggle('sc',scrollY>30);spy(links,.35);spy(dots,.5);tk=false};
addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(onS)}},{passive:true});onS();
const mas=$('.mas2'),eyes=$$('.mas2 .eye'),calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
addEventListener('pointermove',e=>{if(calm)return;const m=mas.getBoundingClientRect(),dx=e.clientX-(m.left+m.width/2),dy=e.clientY-(m.top+m.height/2),k=Math.min(1,Math.hypot(dx,dy)/400)*5,a=Math.atan2(dy,dx);eyes.forEach(i=>i.style.translate=`${Math.cos(a)*k}px ${Math.sin(a)*k}px`)});
mas.onclick=e=>{if(calm)return;for(let i=0;i<10;i++){const s=document.createElement('span'),a=Math.random()*6.28,r=60+Math.random()*80;s.textContent=['🍃','🌱','✨'][i%3];s.style.cssText=`position:fixed;left:${e.clientX}px;top:${e.clientY}px;font-size:22px;z-index:60;pointer-events:none`;document.body.append(s);s.animate([{transform:'translate(0,0) scale(.5)',opacity:1},{transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r-40}px) rotate(${Math.random()*360}deg) scale(1.2)`,opacity:0}],{duration:900,easing:'ease-out'}).onfinish=()=>s.remove()}};

{
const ic=$('#introCanvas'),ix=ic.getContext('2d'),eo=u=>1-Math.pow(1-u,3),i0=performance.now();let IW,IH;
const ifit=()=>{const d=Math.min(devicePixelRatio||1,1.5);IW=innerWidth;IH=innerHeight;ic.width=IW*d;ic.height=IH*d;ix.setTransform(d,0,0,d,0,0)};ifit();addEventListener('resize',()=>{ifit();if($('#intro'))itree(performance.now())});
// pohon intro (ringan): struktur dihitung sekali, garis digabung per warna -> hanya 7 stroke per frame
let sd=12345;const rn=()=>(sd=sd*16807%2147483647,(sd-1)/2147483646),rg=(a,b)=>a+rn()*(b-a);
const LV=15,TH=185,TW=83,BR=[];
for(let i=0;i<LV;i++){const t=i/(LV-1),y=-13-t*(TH-20),bw=TW*Math.pow(1-t,.85)+5;for(const s of [-1,1]){const b={y,s,len:bw*rg(.83,1.13),dr:rg(.15,.29),dl:.08+t*.84,tw:[]};for(let j=0;j<8;j++){const tl=rg(7,17)*(1-t*.4),sdr=rn()>.5?1:-1,nd=[];for(let n=0;n<5;n++)nd.push(rg(4,8));b.tw.push({p:(j+1)/9,tl,sd:sdr,nd})}BR.push(b)}}
const itree=t=>{const g=eo(Math.min(1,Math.max(0,(t-i0-600)/6500)));ix.clearRect(0,0,IW,IH);const k=Math.min(IH*.74/TH,IW*.46/(TW+30));ix.save();ix.translate(IW/2,IH*.9);ix.scale(k,k);ix.lineCap='round';
 ix.fillStyle='rgba(143,158,139,.3)';ix.beginPath();ix.ellipse(0,3,65,4,0,0,6.283);ix.fill();
 if(g>0){const gr=ix.createLinearGradient(-5,0,5,0);gr.addColorStop(0,'#382316');gr.addColorStop(.35,'#a8794d');gr.addColorStop(.65,'#765035');gr.addColorStop(1,'#3b2518');ix.beginPath();ix.moveTo(0,0);ix.lineTo(0,-TH*g);ix.strokeStyle=gr;ix.lineWidth=7;ix.stroke()}
 const pb=new Path2D(),p1=new Path2D(),p2=new Path2D(),n1=new Path2D(),n2=new Path2D(),ph=new Path2D();
 for(const b of BR){const l=eo(Math.min(1,Math.max(0,(g-b.dl)/.12)));if(l<=0)continue;const L=b.len*l,ex=b.s*L,ey=b.y+L*b.dr;pb.moveTo(0,b.y);pb.quadraticCurveTo(b.s*L*.48,b.y+L*.04,ex,ey);
  b.tw.forEach((w,j)=>{const tx=ex*w.p,ty=b.y+(ey-b.y)*w.p,tl=w.tl*l,d=w.sd*b.s,x2=tx+d*tl*.5,y2=ty-tl*.85,P=j%3?p1:p2;P.moveTo(tx,ty);P.quadraticCurveTo(tx+d*tl*.2,ty-tl*.5,x2,y2);
   for(let n=0;n<5;n++){const nx=tx+(x2-tx)*n/5,ny=ty+(y2-ty)*n/5,nl=w.nd[n]*l,N=n%2?n2:n1;N.moveTo(nx,ny);N.lineTo(nx-nl*.65,ny-nl);N.moveTo(nx,ny);N.lineTo(nx+nl*.65,ny-nl)}});
  for(let i=0;i<4;i++){ph.moveTo(ex-b.s*i*4,ey);ph.lineTo(ex-b.s*i*4+b.s*5,ey-7)}}
 ix.strokeStyle='#3B5335';ix.lineWidth=2.8;ix.stroke(pb);ix.strokeStyle='#47653f';ix.lineWidth=1.3;ix.stroke(p1);ix.strokeStyle='#587852';ix.stroke(p2);
 ix.lineWidth=1.15;ix.strokeStyle='#8F9E8B';ix.stroke(n1);ix.strokeStyle='#587852';ix.stroke(n2);ix.lineWidth=1.5;ix.strokeStyle='#C5D0BC';ix.stroke(ph);
 if(g>.88){const p=eo((g-.88)/.12),tp=-TH;ix.beginPath();ix.moveTo(0,tp-4);ix.quadraticCurveTo(-10*p,tp+12,0,tp+20);ix.quadraticCurveTo(10*p,tp+12,0,tp-4);ix.fillStyle='#8F9E8B';ix.fill()}
 ix.restore()};
const iloop=t=>{if(!$('#intro'))return;itree(t);if(t-i0<7400)requestAnimationFrame(iloop)};requestAnimationFrame(iloop);
const intro=$('#intro'),root=document.documentElement;let seen=0;try{seen=sessionStorage.getItem('eg')&&!/intro/.test(location.search)}catch(e){}
if(seen||calm){intro.remove();document.body.classList.add('ready')}
else{root.classList.add('lock');try{sessionStorage.setItem('eg',1)}catch(e){}let done=0;const end=()=>{if(done)return;done=1;intro.classList.add('out');root.classList.remove('lock');document.body.classList.add('ready');setTimeout(()=>intro.remove(),1000)};setTimeout(end,10200);$('#skip').onclick=end}
// cabang navbar (canvas): batang kanan ke kiri, ranting besar, ranting kecil, lalu daun yang menempel di ranting
const cv=$('#treeCanvas'),cx=cv.getContext('2d'),CH=190,rnd=(a,b)=>Math.random()*(b-a)+a,cl=v=>Math.min(1,Math.max(0,v)),e2=u=>1-Math.pow(1-u,3),LC=['#8F9E8B','#A8C09A','#E2C258','#C5B3C9','#8F9E8B'],TS=.2,TD=1.8;
let CW=0,bs=[],t0=0;
const pass=x=>TS+(1-Math.pow(1-cl(1-(x+30)/(CW+60)),1/3))*TD;
const mkLv=n=>Array.from({length:n},(_,i)=>({u:i===n-1?1:.3+.5*i/Math.max(1,n-2),sd:i%2?1:-1,len:rnd(9,15),c:LC[Math.floor(rnd(0,LC.length))],ph:rnd(0,6.28)}));
const build=()=>{bs=[];const n=Math.max(7,Math.round(CW/150));
 for(let i=0;i<n;i++){const x=CW/(n-1)*i;bs.push({x,y:rnd(38,50),len:rnd(50,90),a:rnd(Math.PI*.35,Math.PI*.65),w:rnd(5,9),ph:rnd(0,6.28),bd:i%2?1:-1,st:pass(x)+.1,lv:mkLv(4)})}
 bs.slice().forEach(b=>bs.push({par:b,len:rnd(28,55),a:b.a+rnd(-.6,.6),w:rnd(2,4),ph:rnd(0,6.28),bd:-b.bd,st:b.st+.7,lv:mkLv(3)}))};
const fit=()=>{const d=Math.min(devicePixelRatio||1,1.5);CW=innerWidth;cv.width=CW*d;cv.height=CH*d;cv.style.width=CW+'px';cv.style.height=CH+'px';cx.setTransform(d,0,0,d,0,0);build()};
const trunk=(dy,w,col,xf)=>{cx.save();cx.beginPath();cx.rect(xf,0,CW+80-xf,CH);cx.clip();cx.beginPath();cx.moveTo(-50,40+dy);cx.bezierCurveTo(CW*.2,58+dy,CW*.5,38+dy,CW*.72,46+dy);cx.bezierCurveTo(CW*.9,52+dy,CW*1.05,42+dy,CW+50,38+dy);cx.lineWidth=w;cx.strokeStyle=col;cx.lineCap='round';cx.stroke();cx.restore()};
const leaf=(x,y,a,L,c)=>{cx.save();cx.translate(x,y);cx.rotate(a);cx.beginPath();cx.moveTo(0,0);cx.bezierCurveTo(L*.25,-L*.42,L*.75,-L*.4,L,0);cx.bezierCurveTo(L*.75,L*.4,L*.25,L*.42,0,0);cx.fillStyle=c;cx.fill();cx.beginPath();cx.moveTo(0,0);cx.lineTo(L*.85,0);cx.lineWidth=.7;cx.strokeStyle='rgba(40,60,40,.45)';cx.stroke();cx.restore()};
const twig=(b,t,s)=>{const g=e2(cl((s-b.st)/.6));if(g<=0)return;
 const bx=b.par?b.par.tx:b.x,by=b.par?b.par.ty:b.y,L=b.len*g,sw=Math.sin(t*.001+b.ph)*2,ex=bx+Math.cos(b.a)*L+sw,ey=by+Math.sin(b.a)*L;
 const mx=(bx+ex)/2-Math.sin(b.a)*L*.18*b.bd,my=(by+ey)/2+Math.cos(b.a)*L*.18*b.bd;b.tx=ex;b.ty=ey;
 cx.beginPath();cx.moveTo(bx,by);cx.quadraticCurveTo(mx,my,ex,ey);cx.lineWidth=b.w*(.5+.5*g);cx.lineCap='round';cx.strokeStyle=b.par?'#4e321f':'#633b22';cx.stroke();
 const ang=Math.atan2(ey-my,ex-mx);
 b.lv.forEach(l=>{const k=e2(cl((s-b.st-.3-l.u*.4)/.35));if(k<=0)return;const u=l.u,q=1-u,px=q*q*bx+2*q*u*mx+u*u*ex,py=q*q*by+2*q*u*my+u*u*ey;leaf(px,py,l.u===1?ang:ang+l.sd*.95+Math.sin(t*.0015+l.ph)*.08,l.len*k,l.c)})};
const draw=t=>{if(!t0&&document.body.classList.contains('ready'))t0=t;cx.clearRect(0,0,CW,CH);if(!t0&&!calm)return;const s=calm?99:(t-t0)/1000,u=cl((s-TS)/TD),xf=(CW+60)*(1-e2(u))-30;
 if(u>0){trunk(6,43,'#1f120b',xf);trunk(0,34,'#714527',xf);trunk(-5,5,'rgba(180,120,70,.45)',xf)}
 bs.forEach(b=>twig(b,t,s))};
let lt=0;const loop=t=>{requestAnimationFrame(loop);if(scrollY>CH||t-lt<33)return;lt=t;draw(t)};
fit();addEventListener('resize',()=>{fit();if(calm)draw(0)});calm?draw(0):requestAnimationFrame(loop);
links.forEach((a,i)=>a.style.setProperty('--od',(.35+(links.length-1-i)*.14)+'s'));$('nav>.btn.p').style.setProperty('--od','.15s');$('nav>b').style.setProperty('--od','1.9s');
// sungai
const rv=$('.river');for(let i=0;i<10;i++){const g=document.createElement('i');g.className='gl';g.style.cssText=`left:${5+i*10}%;top:${25+i*37%55}%;animation-delay:${i*.35}s`;rv.append(g)}
}

// pratinjau foto bukti di pop-up quest + lencana admin
document.addEventListener('change',e=>{if(e.target.id!=='eg-quest-photo')return;const f=e.target.files[0],box=e.target.closest('.eg-proof');let im=box.querySelector('.eg-proof__img');if(!f){im&&im.remove();return}if(!im){im=document.createElement('img');im.className='eg-proof__img';im.alt='Pratinjau bukti';e.target.after(im)}if(im.dataset.u)URL.revokeObjectURL(im.dataset.u);im.dataset.u=im.src=URL.createObjectURL(f)});
{const ap=$('#eg-admin-pending'),ab=$('#eg-admin-pending-badge');if(ap&&ab)new MutationObserver(()=>{ab.textContent=ap.textContent+' menunggu'}).observe(ap,{childList:true,characterData:true,subtree:true})}
