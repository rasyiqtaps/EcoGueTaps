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
