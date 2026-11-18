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
