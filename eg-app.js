/*
 * EcoGueTaps - UI Daily Quest & Leaderboard
 * Semua kode dibungkus IIFE, tidak ada variabel global baru.
 * State (misi aktif, status, XP/Poin, sisa re-roll) hanya di memori:
 * reload halaman = reset.
 */
(function () {
    'use strict';

    var data = window.EcoGueTapsData;
    if (!data) { return; }

    var STATUS_LABEL = {
        belum: 'Belum dikerjakan',
        terkirim: 'Terkirim (Simulasi)'
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
        var sent = statusOf(q.id) === 'terkirim';
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
        if (statusOf(id) === 'terkirim') { toast('Misi yang sudah dikirim tidak bisa diganti.'); return; }
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
        var sent = statusOf(q.id) === 'terkirim';
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
            '<button type="button" class="eg-btn eg-btn--green eg-modal__send" data-send-quest="' + esc(q.id) + '"' +
                (sent ? ' disabled' : '') + '>' +
                (sent ? 'Terkirim (Simulasi)' : 'Kirim Quest') +
            '</button>';
    }

    function openQuest(id) {
        var q = pool[id];
        if (!q) { return; }
        renderModal(q);
        if (typeof modal.showModal === 'function') { modal.showModal(); }
        else { modal.setAttribute('open', ''); }
    }

    // ------------------------------------------------------------ reward
    // Satu-satunya tempat XP/Poin ditambahkan. Dipanggil sekali per misi
    // setelah kirim berhasil. Saat fitur kirim asli ada verifikasi, cukup
    // panggil fungsi ini dari hasil verifikasi.
    function beriReward(q) {
        var me = state.me;
        me.xp += q.xp;
        me.poin += q.poin;
        var naik = false;
        while (me.xp >= me.levelXp) {
            me.level += 1;
            me.levelXp += me.levelStep;
            naik = true;
        }
        renderLeaderboard(true);
        renderLevel();
        return naik;
    }

    function sendQuest(id) {
        var q = pool[id];
        if (!q || statusOf(id) === 'terkirim') { return; }

        // Disediakan eg-kirim-stub.js (atau fitur kirim asli nanti)
        var kirim = window.EcoGueTaps && window.EcoGueTaps.kirimQuest;
        var proses = typeof kirim === 'function'
            ? Promise.resolve(kirim(q))
            : Promise.resolve({ ok: false, message: 'Fitur kirim quest segera hadir' });

        proses.then(function (res) {
            res = res || {};
            if (res.ok && res.status === 'terkirim' && !state.sudahDikirim[id]) {
                state.status[id] = 'terkirim';
                state.sudahDikirim[id] = true;
                var naik = beriReward(q);
                renderQuests();
                renderModal(q);
                toast((res.message || 'Misi terkirim') + ' • +' + q.xp + ' XP, +' + q.poin + ' Poin' +
                    (naik ? ' • Level Up! Level ' + state.me.level : ''), 3600);
            } else {
                toast(res.message || 'Fitur kirim quest segera hadir');
            }
        }).catch(function () {
            toast('Terjadi kesalahan, coba lagi.');
        });
    }

    // ------------------------------------------------------------ leaderboard
    function renderLeaderboard(flash) {
        var me = state.me;
        var rows = data.leaderboard.slice();
        rows.push({ nama: me.nama, xp: me.xp, poin: me.poin, isMe: true });
        rows.sort(function (a, b) { return b.xp - a.xp; });

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
            if (e.target === modal) { modal.close(); } // klik backdrop
            return;
        }
        if (t.hasAttribute('data-open-quest')) { openQuest(t.getAttribute('data-open-quest')); }
        else if (t.hasAttribute('data-send-quest')) { sendQuest(t.getAttribute('data-send-quest')); }
        else if (t.hasAttribute('data-reroll')) { rerollQuest(t.getAttribute('data-reroll')); }
    });

    renderQuests();
    renderLeaderboard(false);
    renderLevel();
})();
