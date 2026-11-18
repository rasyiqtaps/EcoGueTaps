/* Navigasi responsif yang digunakan di semua halaman. */
(function () {
    'use strict';
    var nav = document.getElementById('eg-nav');
    var button = document.getElementById('eg-nav-toggle');
    var menu = document.getElementById('eg-nav-menu');
    if (!nav || !button || !menu) { return; }
    button.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    });
    menu.addEventListener('click', function (event) {
        if (event.target.closest('a')) {
            nav.classList.remove('is-open');
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-label', 'Buka menu');
        }
    });
})();
