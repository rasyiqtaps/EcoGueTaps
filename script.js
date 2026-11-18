/* ===== Modul Daily Quest & Leaderboard (dari tim): data, stub kirim quest, UI ===== */
try{
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
        { nama: 'DaunCeria',    xp: 1120, poin: 280 },
        { nama: 'EcoKecil',     xp: 1080, poin: 270 },
        { nama: 'AirBersih',    xp: 760,  poin: 190 }
    ]
};

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

}catch(e){console.error("EcoGueTaps quest:",e)}

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
// cabang navbar (canvas): batang kanan ke kiri, lalu ranting besar, ranting kecil, daun
const cv=$('#treeCanvas'),cx=cv.getContext('2d'),CH=190,rnd=(a,b)=>Math.random()*(b-a)+a,cl=v=>Math.min(1,Math.max(0,v)),e2=u=>1-Math.pow(1-u,3),LC=['#8F9E8B','#9cae91','#E2C258','#C5B3C9','#8F9E8B'],TS=.2,TD=1.8;
let CW=0,bs=[],ls=[],t0=0;
const pass=x=>TS+(1-Math.pow(1-cl(1-(x+30)/(CW+60)),1/3))*TD;
const mk=(x,y,z,st)=>({x,y,z,st,r:rnd(0,6.28),s:rnd(0,6.28),v:rnd(.7,1.4),c:LC[Math.floor(rnd(0,LC.length))]});
const build=()=>{bs=[];ls=[];const n=8;
 for(let i=0;i<n;i++){const x=CW/(n-1)*i;bs.push({x,y:rnd(30,52),len:rnd(45,90),a:rnd(Math.PI*.35,Math.PI*.65),w:rnd(5,10),s:rnd(0,6.28),m:1,st:pass(x)+.1})}
 bs.slice().forEach(b=>bs.push({x:b.x+Math.cos(b.a)*b.len,y:b.y+Math.sin(b.a)*b.len,len:rnd(25,55),a:b.a+rnd(-.6,.6),w:rnd(2,4),s:rnd(0,6.28),m:0,st:b.st+.7}));
 bs.forEach(b=>[.6,1].forEach(t=>ls.push(mk(b.x+Math.cos(b.a)*b.len*t,b.y+Math.sin(b.a)*b.len*t,rnd(5,10),b.st+.55+rnd(0,.3)))));
 for(let i=0;i<Math.round(CW/30);i++){const x=rnd(0,CW);ls.push(mk(x,rnd(5,120),rnd(5,9),pass(x)+.4+rnd(0,.4)))}};
const fit=()=>{const d=Math.min(devicePixelRatio||1,1.5);CW=innerWidth;cv.width=CW*d;cv.height=CH*d;cv.style.width=CW+'px';cv.style.height=CH+'px';cx.setTransform(d,0,0,d,0,0);build()};
const trunk=(dy,w,col,xf)=>{cx.save();cx.beginPath();cx.rect(xf,0,CW+80-xf,CH);cx.clip();cx.beginPath();cx.moveTo(-50,40+dy);cx.bezierCurveTo(CW*.2,58+dy,CW*.5,38+dy,CW*.72,46+dy);cx.bezierCurveTo(CW*.9,52+dy,CW*1.05,42+dy,CW+50,38+dy);cx.lineWidth=w;cx.strokeStyle=col;cx.lineCap='round';cx.stroke();cx.restore()};
const leaf=(l,t,s)=>{const k=e2(cl((s-l.st)/.4));if(k<=0)return;const z=l.z;cx.save();cx.translate(l.x+Math.sin(t*.001*l.v+l.s)*4,l.y);cx.rotate(l.r+Math.sin(t*.001)*.1);cx.scale(k,k);cx.beginPath();cx.moveTo(0,-z);cx.bezierCurveTo(z*1.8,-z*.7,z*1.8,z*.7,0,z);cx.bezierCurveTo(-z*1.8,z*.7,-z*1.8,-z*.7,0,-z);cx.fillStyle=l.c;cx.fill();cx.beginPath();cx.moveTo(-z*.8,0);cx.lineTo(z*.8,0);cx.lineWidth=.7;cx.strokeStyle='rgba(40,60,40,.45)';cx.stroke();cx.restore()};
const twigs=(t,s)=>bs.forEach(b=>{const g=e2(cl((s-b.st)/.6));if(g<=0)return;const sw=Math.sin(t*.001+b.s)*2,ex=b.x+Math.cos(b.a)*b.len*g,ey=b.y+Math.sin(b.a)*b.len*g;cx.beginPath();cx.moveTo(b.x,b.y);cx.quadraticCurveTo((b.x+ex)/2+sw,(b.y+ey)/2,ex+sw,ey);cx.lineWidth=b.w*(.5+.5*g);cx.lineCap='round';cx.strokeStyle=b.m?'#633b22':'#4e321f';cx.stroke()});
const draw=t=>{if(!t0&&document.body.classList.contains('ready'))t0=t;cx.clearRect(0,0,CW,CH);if(!t0&&!calm)return;const s=calm?99:(t-t0)/1000,u=cl((s-TS)/TD),xf=(CW+60)*(1-e2(u))-30;
 ls.forEach((l,i)=>i%2||leaf(l,t,s));
 if(u>0){trunk(6,43,'#1f120b',xf);trunk(0,34,'#714527',xf);trunk(-5,5,'rgba(180,120,70,.45)',xf)}
 twigs(t,s);ls.forEach((l,i)=>i%2&&leaf(l,t,s))};
let lt=0;const loop=t=>{requestAnimationFrame(loop);if(scrollY>CH||t-lt<33)return;lt=t;draw(t)};
fit();addEventListener('resize',()=>{fit();if(calm)draw(0)});calm?draw(0):requestAnimationFrame(loop);
links.forEach((a,i)=>a.style.setProperty('--od',(.35+(links.length-1-i)*.14)+'s'));$('nav>.btn.p').style.setProperty('--od','.15s');$('nav>b').style.setProperty('--od','1.9s');
// sungai
const rv=$('.river');for(let i=0;i<10;i++){const g=document.createElement('i');g.className='gl';g.style.cssText=`left:${5+i*10}%;top:${25+i*37%55}%;animation-delay:${i*.35}s`;rv.append(g)}
}
