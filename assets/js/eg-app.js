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
    syncReviews();
    window.addEventListener('focus', syncReviews);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { syncReviews(); } });
})();
