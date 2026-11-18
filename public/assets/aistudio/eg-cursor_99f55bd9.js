/*
 * EcoGueTaps - efek daun jatuh saat klik/tap.
 * Kursor pohon diatur lewat CSS (eg-cursor.css). Berdiri sendiri:
 * tidak mengubah script.js dan tidak membuat variabel global.
 */
(function () {
    'use strict';

    if (!document.body.animate) { return; }
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce && reduce.matches) { return; }

    var COLORS = ['#52bb7d', '#37a266', '#7fc977', '#a9e594', '#e0a526', '#ffcf40', '#d9822b'];
    var MAX_LEAVES = 60;

    var layer = document.createElement('div');
    layer.className = 'eg-leaf-layer';
    layer.setAttribute('aria-hidden', 'true');
    var pakaiPopover = typeof layer.showPopover === 'function';
    if (pakaiPopover) { layer.setAttribute('popover', 'manual'); }
    document.body.appendChild(layer);

    // Naikkan lapisan ke paling atas top layer (di atas <dialog> showModal yang terbuka)
    function naikkanLayer() {
        if (!pakaiPopover) { return; }
        try {
            if (layer.matches(':popover-open')) {
                if (!document.querySelector('dialog[open]')) { return; }
                layer.hidePopover();
            }
            layer.showPopover();
        } catch (err) { /* abaikan */ }
    }

    function rand(a, b) { return a + Math.random() * (b - a); }

    function leafSvg(color) {
        return '<svg viewBox="0 0 20 20"><path d="M2 18 C1 8 8 1 19 1 C19 12 12 19 2 18Z" fill="' + color + '"/>' +
               '<path d="M3 17 C8 12 12 8 16 4" stroke="rgba(0,0,0,.25)" stroke-width="1" fill="none" stroke-linecap="round"/></svg>';
    }

    function burst(x, y) {
        naikkanLayer();
        var n = Math.round(rand(8, 12));
        for (var i = 0; i < n; i++) {
            if (layer.childElementCount >= MAX_LEAVES) { break; }

            var el = document.createElement('span');
            el.className = 'eg-leaf';
            el.innerHTML = leafSvg(COLORS[Math.floor(Math.random() * COLORS.length)]);
            var size = rand(13, 24);
            el.style.width = el.style.height = size + 'px';
            layer.appendChild(el);

            var spread = rand(-70, 70);              // melebar ke samping
            var pop = rand(14, 44);                  // sedikit terlontar ke atas dulu
            var fall = rand(130, 280);               // jarak jatuh
            var sway = rand(-40, 40);                // goyangan
            var spin = rand(-320, 320);
            var dur = rand(1300, 2300);
            var x0 = x - size / 2, y0 = y - size / 2;

            var anim = el.animate([
                { transform: 'translate(' + x0 + 'px,' + y0 + 'px) rotate(0deg) scale(.3)', opacity: 0 },
                { transform: 'translate(' + (x0 + spread * .35) + 'px,' + (y0 - pop) + 'px) rotate(' + spin * .2 + 'deg) scale(1)', opacity: 1, offset: .14 },
                { transform: 'translate(' + (x0 + spread * .6 + sway) + 'px,' + (y0 + fall * .45) + 'px) rotate(' + spin * .55 + 'deg) scale(1)', opacity: 1, offset: .55 },
                { transform: 'translate(' + (x0 + spread - sway * .6) + 'px,' + (y0 + fall) + 'px) rotate(' + spin + 'deg) scale(.9)', opacity: 0 }
            ], { duration: dur, easing: 'cubic-bezier(.35,.1,.55,.95)', fill: 'forwards' });

            anim.onfinish = (function (node) { return function () { node.remove(); }; })(el);
        }
    }

    // pointerdown: respons instan, berlaku untuk mouse, sentuh, dan pena
    document.addEventListener('pointerdown', function (e) {
        if (e.button !== undefined && e.button > 0) { return; } // abaikan klik kanan/tengah
        burst(e.clientX, e.clientY);
    }, { passive: true });
})();
