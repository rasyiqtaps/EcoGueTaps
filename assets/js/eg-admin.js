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
    load();
})();
