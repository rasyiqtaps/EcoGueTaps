/* EcoGueTaps - Unified Vanilla JS (Data, IndexedDB Demo Store, Canvas, Interactions) */
(() => {
  'use strict';

  /* ==================== 1. DATA ==================== */
  const INITIAL_ME = {
    nama: 'Kamu',
    xp: 250,
    poin: 62,
    level: 3,
    levelXp: 400,
    levelStep: 200,
  };

  const REROLL_MAX = 3;
  const INITIAL_QUEST_IDS = ['tumbler-hero', 'water-guardian', 'recycle-ranger'];

  const QUEST_POOL = [
    {
      id: 'tumbler-hero',
      judul: 'Tumbler Hero',
      tag: 'Hemat Plastik',
      xp: 50,
      poin: 10,
      deskripsi: 'Bawa botol minum sendiri untuk mengurangi sampah plastik.',
      langkah: [
        'Siapkan botol minum yang bisa dipakai ulang.',
        'Isi dengan air dan bawa ke sekolah atau tempat aktivitasmu.',
        'Foto botolmu sebagai bukti, lalu kirim misi.',
      ],
    },
    {
      id: 'water-guardian',
      judul: 'Water Guardian',
      tag: 'Hemat Air',
      xp: 40,
      poin: 8,
      deskripsi: 'Tutup keran dan gunakan air secukupnya hari ini.',
      langkah: [
        'Pastikan keran tertutup rapat setelah dipakai.',
        'Matikan air saat menyikat gigi atau menyabuni tangan.',
        'Foto keran yang sudah tertutup, lalu kirim misi.',
      ],
    },
    {
      id: 'recycle-ranger',
      judul: 'Recycle Ranger',
      tag: 'Daur Ulang',
      xp: 60,
      poin: 12,
      deskripsi: 'Pilah sampah organik dan anorganik dengan benar.',
      langkah: [
        'Siapkan dua wadah: organik dan anorganik.',
        'Pisahkan sampah hari ini ke wadah yang sesuai.',
        'Foto hasil pemilahanmu, lalu kirim misi.',
      ],
    },
    {
      id: 'light-saver',
      judul: 'Light Saver',
      tag: 'Hemat Energi',
      xp: 45,
      poin: 9,
      deskripsi: 'Matikan lampu dan alat listrik yang tidak sedang dipakai.',
      langkah: [
        'Cek ruangan yang kosong di rumah atau kelas.',
        'Matikan lampu, kipas, atau charger yang menganggur.',
        'Foto saklar yang sudah dimatikan, lalu kirim misi.',
      ],
    },
    {
      id: 'green-walker',
      judul: 'Green Walker',
      tag: 'Transportasi',
      xp: 55,
      poin: 11,
      deskripsi: 'Berjalan kaki atau bersepeda untuk perjalanan dekat.',
      langkah: [
        'Pilih tujuan yang jaraknya dekat.',
        'Berjalan kaki atau bersepeda ke sana.',
        'Foto perjalananmu, lalu kirim misi.',
      ],
    },
    {
      id: 'plant-buddy',
      judul: 'Plant Buddy',
      tag: 'Tanam',
      xp: 70,
      poin: 14,
      deskripsi: 'Rawat atau siram satu tanaman di sekitarmu.',
      langkah: [
        'Pilih satu tanaman di rumah atau sekolah.',
        'Siram atau bersihkan daunnya dengan lembut.',
        'Foto tanamanmu, lalu kirim misi.',
      ],
    },
    {
      id: 'bag-buddy',
      judul: 'Bag Buddy',
      tag: 'Hemat Plastik',
      xp: 40,
      poin: 8,
      deskripsi: 'Pakai tas belanja sendiri, tolak kantong plastik sekali pakai.',
      langkah: [
        'Siapkan tas kain atau tas belanja sendiri.',
        'Gunakan saat berbelanja dan tolak kantong plastik.',
        'Foto tas belanjamu, lalu kirim misi.',
      ],
    },
    {
      id: 'trash-collector',
      judul: 'Trash Collector',
      tag: 'Peduli Sekitar',
      xp: 65,
      poin: 13,
      deskripsi: 'Pungut 5 sampah di sekitarmu dan buang ke tempatnya.',
      langkah: [
        'Cari 5 sampah di sekitar rumah atau sekolah.',
        'Pakai sarung tangan atau alat bantu agar aman.',
        'Foto sampah yang terkumpul, lalu kirim misi.',
      ],
    },
  ];

  const QUEST_MAP = Object.fromEntries(QUEST_POOL.map((q) => [q.id, q]));

  const LEADERBOARD_OTHERS = [
    { nama: 'BintangHijau', xp: 1250, poin: 312 },
    { nama: 'DaunCeria', xp: 1120, poin: 280 },
    { nama: 'EcoKecil', xp: 1080, poin: 270 },
    { nama: 'AirBersih', xp: 760, poin: 190 },
  ];

  const ARTICLES = [
    {
      id: 'pilah-sampah',
      title: 'Yuk, Pilah Sampah!',
      category: 'Daur Ulang',
      icon: '♻',
      tone: 'green',
      minutes: 3,
      summary: 'Kenali sampah organik dan anorganik, lalu temukan cara sederhana memilahnya.',
      paragraphs: [
        'Sampah di sekitar kita memiliki jenis yang berbeda. Sisa makanan dan daun termasuk sampah organik, sedangkan botol plastik dan kaleng umumnya dikelompokkan sebagai sampah anorganik.',
        'Mulailah dengan menyiapkan tempat sampah terpisah. Pastikan sampah yang akan didaur ulang dalam keadaan cukup bersih dan mengikuti aturan pengumpulan di daerahmu.',
        'Cobalah memilah tiga benda yang ada di rumah hari ini. Jika ragu, tanyakan kepada orang dewasa atau petugas pengelola sampah.',
      ],
    },
    {
      id: 'hemat-air',
      title: 'Hemat Air di Rumah',
      category: 'Hemat Air',
      icon: '💧',
      tone: 'purple',
      minutes: 2,
      summary: 'Kebiasaan kecil membantu kita menggunakan air dengan lebih bijak.',
      paragraphs: [
        'Air bersih dibutuhkan untuk minum, memasak, dan menjaga kebersihan. Karena itu, gunakan air secukupnya dan hindari membiarkan keran menyala tanpa diperlukan.',
        'Saat menyikat gigi, matikan keran. Jika menemukan keran yang bocor, beri tahu orang dewasa agar bisa segera diperbaiki.',
        'Ajak keluarga membuat pengingat sederhana di dekat keran: “Gunakan seperlunya, tutup setelah selesai.”',
      ],
    },
    {
      id: 'sahabat-pohon',
      title: 'Sahabat Pohon',
      category: 'Konservasi',
      icon: '🌳',
      tone: 'green',
      minutes: 3,
      summary: 'Cari tahu mengapa pohon penting dan cara merawat tanaman sekitar.',
      paragraphs: [
        'Pohon memberikan tempat berlindung bagi berbagai makhluk hidup dan membantu menjaga kualitas lingkungan.',
        'Kita dapat merawat pohon dengan tidak merusak batang atau rantingnya, menjaga tanah di sekitarnya tetap bersih, dan menyiram tanaman sesuai kebutuhannya.',
        'Pilih satu tanaman di rumah atau sekolah. Amati perubahan daunnya selama beberapa hari.',
      ],
    },
    {
      id: 'energi-pintar',
      title: 'Energi Pintar',
      category: 'Hemat Energi',
      icon: '☀',
      tone: 'yellow',
      minutes: 3,
      summary: 'Kenali cara sederhana menghemat listrik dalam kegiatan sehari-hari.',
      paragraphs: [
        'Peralatan listrik memudahkan banyak aktivitas, tetapi energi perlu digunakan secara bijak.',
        'Matikan lampu saat ruangan tidak digunakan dan cabut pengisi daya dari stopkontak bila sudah tidak diperlukan, dengan bantuan orang dewasa jika perlu.',
        'Periksa rumah bersama keluarga dan temukan satu kebiasaan hemat energi yang bisa dilakukan setiap hari.',
      ],
    },
    {
      id: 'kurangi-plastik',
      title: 'Kurangi Plastik Sekali Pakai',
      category: 'Daur Ulang',
      icon: '🛍',
      tone: 'yellow',
      minutes: 2,
      summary: 'Bawa tumbler dan tas belanja sendiri untuk mengurangi sampah.',
      paragraphs: [
        'Kemasan sekali pakai sering digunakan sebentar, tetapi sampahnya perlu dikelola setelah dibuang.',
        'Membawa botol minum pakai ulang dan tas belanja sendiri adalah dua langkah sederhana yang bisa dicoba.',
        'Sebelum pergi, cek isi tasmu: sudah membawa tumbler atau tas belanja belum?',
      ],
    },
    {
      id: 'laut-bersih',
      title: 'Laut Bersih, Hewan Bahagia',
      category: 'Konservasi',
      icon: '🐟',
      tone: 'purple',
      minutes: 3,
      summary: 'Jaga lingkungan sungai dan laut dengan membuang sampah pada tempatnya.',
      paragraphs: [
        'Sampah yang dibuang sembarangan dapat terbawa air hujan menuju sungai dan laut.',
        'Menjaga kebersihan lingkungan sekitar adalah bagian dari usaha melindungi ekosistem perairan.',
        'Mulai hari ini, buang sampah pada tempatnya dan ajak teman melakukan hal yang sama.',
      ],
    },
  ];

  const CAMPAIGNS = {
    reb: {
      key: 'reb',
      label: 'Reboisasi',
      t: 'Reboisasi',
      d: 'Menanam kembali pohon di lahan kritis dan merawatnya sampai tumbuh.',
      g: 2e7,
      c: 12.4e6,
      n: 'Target pohon',
      a: 2000,
      b: 1240,
      u: 'pohon',
    },
    kar: {
      key: 'kar',
      label: 'Karhutla',
      t: 'Karhutla darurat',
      d: 'Bantuan untuk pemadaman, masker, dan pemulihan lahan yang terbakar.',
      g: 3e7,
      c: 9.6e6,
      n: 'Target paket bantuan',
      a: 500,
      b: 150,
      u: 'paket',
    },
    alam: {
      key: 'alam',
      label: 'Bantuan alam',
      t: 'Bantuan alam',
      d: 'Bersih sungai, bibit mangrove, dan perlengkapan relawan lingkungan.',
      g: 1.5e7,
      c: 6e6,
      n: 'Target aksi bersih',
      a: 20,
      b: 8,
      u: 'aksi',
    },
  };

  /* ==================== 2. PURE HELPERS & TOAST ==================== */
  const fmtNum = new Intl.NumberFormat('id-ID');
  const fmtDate = (iso) => {
    try {
      return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
    } catch {
      return '-';
    }
  };
  const rp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');

  const elToast = document.getElementById('eg-toast');
  let toastTimer = null;
  function showToast(msg, ms = 2800) {
    if (!elToast) return;
    elToast.textContent = msg;
    elToast.classList.add('is-show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elToast.classList.remove('is-show'), ms);
  }

  function applyQuestRewards(baseMe, approvedIds) {
    const next = { ...baseMe };
    const seen = new Set();
    for (const id of approvedIds) {
      if (seen.has(id)) continue;
      const q = QUEST_MAP[id];
      if (!q) continue;
      seen.add(id);
      next.xp += q.xp;
      next.poin += q.poin;
    }
    while (next.xp >= next.levelXp) {
      next.level += 1;
      next.levelXp += next.levelStep;
    }
    return next;
  }

  /* ==================== 3. INDEXEDDB DEMO STORE (WITH MEMORY FALLBACK) ==================== */
  const DB_NAME = 'ecoguetaps-quest-demo';
  const STORE = 'submissions';
  const memFallback = new Map();

  function openDB() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB tidak tersedia.'));
        return;
      }
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('Gagal membuka IndexedDB.'));
    });
  }

  async function transact(mode, op) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      let req;
      try {
        req = op(store);
      } catch (err) {
        db.close();
        reject(err);
        return;
      }
      let out;
      req.onsuccess = () => { out = req.result; };
      tx.oncomplete = () => { db.close(); resolve(out); };
      tx.onerror = () => { db.close(); reject(tx.error || new Error('Gagal menyimpan data.')); };
      tx.onabort = () => { db.close(); reject(tx.error || new Error('Transaksi dibatalkan.')); };
    });
  }

  async function getAllSubmissions() {
    try {
      const rows = await transact('readonly', (s) => s.getAll());
      return Array.isArray(rows) ? rows : [];
    } catch {
      return Array.from(memFallback.values());
    }
  }

  async function getSubmission(id) {
    try {
      return await transact('readonly', (s) => s.get(id));
    } catch {
      return memFallback.get(id);
    }
  }

  async function putSubmission(row) {
    try {
      await transact('readwrite', (s) => s.put(row));
    } catch {
      memFallback.set(row.id, row);
    }
  }

  async function submitQuestProof(quest, file, note) {
    if (!(file instanceof Blob) || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error('Bukti harus berupa JPG, PNG, atau WebP.');
    }
    if (file.size === 0 || file.size > 3 * 1024 * 1024) {
      throw new Error('Ukuran bukti maksimal 3 MB dan tidak boleh kosong.');
    }
    const id = 'user-kamu:' + quest.id;
    const before = await getSubmission(id);
    if (before && before.status !== 'ditolak') {
      throw new Error('Quest ini sudah diajukan atau disetujui.');
    }
    const row = {
      id,
      questId: quest.id,
      questTitle: quest.judul,
      userName: 'Kamu',
      note: String(note || '').trim().slice(0, 240),
      proof: file,
      proofName: file instanceof File && file.name ? String(file.name).slice(0, 100) : 'bukti-foto',
      xp: quest.xp,
      poin: quest.poin,
      status: 'terkirim',
      reason: '',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      demo: true,
    };
    await putSubmission(row);
    return row;
  }

  async function reviewSubmission(id, approve, reason) {
    const row = await getSubmission(id);
    if (!row) throw new Error('Pengajuan tidak ditemukan.');
    if (row.status !== 'terkirim') throw new Error('Pengajuan ini sudah diperiksa.');
    if (approve && (!row.proof || !row.proof.size)) {
      throw new Error('Tidak boleh menyetujui quest tanpa foto bukti.');
    }
    if (!approve && !String(reason || '').trim()) {
      throw new Error('Alasan penolakan wajib diisi.');
    }
    row.status = approve ? 'disetujui' : 'ditolak';
    row.reason = approve ? '' : String(reason).trim().slice(0, 300);
    row.reviewedAt = new Date().toISOString();
    await putSubmission(row);
    return row;
  }

  /* ==================== 4. INTRO OVERLAY & TREE NAVBAR ==================== */
  let navReady = false;

  (function initIntro() {
    const intro = document.getElementById('intro');
    const ic = document.getElementById('introCanvas');
    const skip = document.getElementById('skip');
    if (!intro) {
      document.body.classList.add('ready');
      navReady = true;
      return;
    }

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const params = new URLSearchParams(window.location.search);
    const forceIntro = params.has('intro');
    const autostart = params.get('autostart') === '1';

    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem('eg')) && !forceIntro;
    } catch {
      seen = false;
    }

    if (autostart || seen || calm) {
      intro.hidden = true;
      document.documentElement.classList.remove('lock');
      document.body.classList.add('ready');
      navReady = true;
      return;
    }

    document.documentElement.classList.add('lock');
    try {
      sessionStorage.setItem('eg', '1');
    } catch {
      // ignore storage errors
    }

    let done = false;
    let rafId = 0;

    function finishIntro() {
      if (done) return;
      done = true;
      intro.classList.add('out');
      document.documentElement.classList.remove('lock');
      document.body.classList.add('ready');
      navReady = true;
      setTimeout(() => { intro.hidden = true; }, 1000);
    }

    const timer = setTimeout(finishIntro, 10200);
    if (skip) skip.addEventListener('click', () => { clearTimeout(timer); finishIntro(); });

    const ix = ic ? ic.getContext('2d') : null;
    if (!ix) return;

    const eo = (u) => 1 - Math.pow(1 - u, 3);
    const i0 = performance.now();
    let IW = window.innerWidth;
    let IH = window.innerHeight;

    function ifit() {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      IW = window.innerWidth;
      IH = window.innerHeight;
      ic.width = IW * d;
      ic.height = IH * d;
      ix.setTransform(d, 0, 0, d, 0, 0);
    }
    ifit();

    let sd = 12345;
    const rn = () => {
      sd = (sd * 16807) % 2147483647;
      return (sd - 1) / 2147483646;
    };
    const rg = (a, b) => a + rn() * (b - a);
    const LV = 15;
    const TH = 185;
    const TW = 83;
    const BR = [];

    for (let i = 0; i < LV; i++) {
      const t = i / (LV - 1);
      const y = -13 - t * (TH - 20);
      const bw = TW * Math.pow(1 - t, 0.85) + 5;
      for (const s of [-1, 1]) {
        const b = { y, s, len: bw * rg(0.83, 1.13), dr: rg(0.15, 0.29), dl: 0.08 + t * 0.84, tw: [] };
        for (let j = 0; j < 8; j++) {
          const tl = rg(7, 17) * (1 - t * 0.4);
          const sdr = rn() > 0.5 ? 1 : -1;
          const nd = [];
          for (let n = 0; n < 5; n++) nd.push(rg(4, 8));
          b.tw.push({ p: (j + 1) / 9, tl, sd: sdr, nd });
        }
        BR.push(b);
      }
    }

    function itree(t) {
      const g = eo(Math.min(1, Math.max(0, (t - i0 - 600) / 6500)));
      ix.clearRect(0, 0, IW, IH);
      const k = Math.min((IH * 0.74) / TH, (IW * 0.46) / (TW + 30));
      ix.save();
      ix.translate(IW / 2, IH * 0.9);
      ix.scale(k, k);
      ix.lineCap = 'round';
      ix.fillStyle = 'rgba(166, 186, 158, .34)';
      ix.beginPath();
      ix.ellipse(0, 3, 65, 4, 0, 0, 6.283);
      ix.fill();

      if (g > 0) {
        const gr = ix.createLinearGradient(-5, 0, 5, 0);
        gr.addColorStop(0, '#382316');
        gr.addColorStop(0.35, '#a8794d');
        gr.addColorStop(0.65, '#765035');
        gr.addColorStop(1, '#3b2518');
        ix.beginPath();
        ix.moveTo(0, 0);
        ix.lineTo(0, -TH * g);
        ix.strokeStyle = gr;
        ix.lineWidth = 7;
        ix.stroke();
      }

      const pb = new Path2D();
      const p1 = new Path2D();
      const p2 = new Path2D();
      const n1 = new Path2D();
      const n2 = new Path2D();
      const ph = new Path2D();

      for (const b of BR) {
        const l = eo(Math.min(1, Math.max(0, (g - b.dl) / 0.12)));
        if (l <= 0) continue;
        const L = b.len * l;
        const ex = b.s * L;
        const ey = b.y + L * b.dr;
        pb.moveTo(0, b.y);
        pb.quadraticCurveTo(b.s * L * 0.48, b.y + L * 0.04, ex, ey);
        b.tw.forEach((w, j) => {
          const tx = ex * w.p;
          const ty = b.y + (ey - b.y) * w.p;
          const tl = w.tl * l;
          const d = w.sd * b.s;
          const x2 = tx + d * tl * 0.5;
          const y2 = ty - tl * 0.85;
          const P = j % 3 ? p1 : p2;
          P.moveTo(tx, ty);
          P.quadraticCurveTo(tx + d * tl * 0.2, ty - tl * 0.5, x2, y2);
          for (let n = 0; n < 5; n++) {
            const nx = tx + ((x2 - tx) * n) / 5;
            const ny = ty + ((y2 - ty) * n) / 5;
            const nl = w.nd[n] * l;
            const N = n % 2 ? n2 : n1;
            N.moveTo(nx, ny);
            N.lineTo(nx - nl * 0.65, ny - nl);
            N.moveTo(nx, ny);
            N.lineTo(nx + nl * 0.65, ny - nl);
          }
        });
        for (let i = 0; i < 4; i++) {
          ph.moveTo(ex - b.s * i * 4, ey);
          ph.lineTo(ex - b.s * i * 4 + b.s * 5, ey - 7);
        }
      }

      ix.strokeStyle = '#527651';
      ix.lineWidth = 2.8;
      ix.stroke(pb);
      ix.strokeStyle = '#628760';
      ix.lineWidth = 1.3;
      ix.stroke(p1);
      ix.strokeStyle = '#749871';
      ix.stroke(p2);
      ix.lineWidth = 1.15;
      ix.strokeStyle = '#A6BA9E';
      ix.stroke(n1);
      ix.strokeStyle = '#749871';
      ix.stroke(n2);
      ix.lineWidth = 1.5;
      ix.strokeStyle = '#D4E0CD';
      ix.stroke(ph);

      if (g > 0.88) {
        const p = eo((g - 0.88) / 0.12);
        const tp = -TH;
        ix.beginPath();
        ix.moveTo(0, tp - 4);
        ix.quadraticCurveTo(-10 * p, tp + 12, 0, tp + 20);
        ix.quadraticCurveTo(10 * p, tp + 12, 0, tp - 4);
        ix.fillStyle = '#A6BA9E';
        ix.fill();
      }
      ix.restore();
    }

    function iloop(t) {
      if (done) return;
      itree(t);
      if (t - i0 < 7400) rafId = requestAnimationFrame(iloop);
    }
    rafId = requestAnimationFrame(iloop);

    window.addEventListener('resize', () => {
      if (done) return;
      ifit();
      itree(performance.now());
    });
  })();

  (function initNavbar() {
    const nav = document.querySelector('nav');
    const cv = document.getElementById('treeCanvas');
    const burger = document.querySelector('.burger');
    const menuLinks = Array.from(document.querySelectorAll('#menu a'));
    if (!nav) return;

    if (burger) {
      burger.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
      });
    }
    menuLinks.forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      });
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        nav.classList.remove('open');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      }
    });

    const cx = cv ? cv.getContext('2d') : null;
    if (!cx) return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CH = 86;
    const rnd = (a, b) => Math.random() * (b - a) + a;
    const cl = (v) => Math.min(1, Math.max(0, v));
    const e2 = (u) => 1 - Math.pow(1 - u, 3);
    const LC = ['#A6BA9E', '#BDCEB5', '#E2C258', '#C5B3C9', '#6B8F69'];
    const TS = 0.2;
    const TD = 1.8;

    let CW = 0;
    let bs = [];
    let t0 = 0;

    const pass = (x) => TS + (1 - Math.pow(1 - cl(1 - (x + 30) / (CW + 60)), 1 / 3)) * TD;
    const mkLv = (n) =>
      Array.from({ length: n }, (_, i) => ({
        u: i === n - 1 ? 1 : 0.3 + (0.5 * i) / Math.max(1, n - 2),
        sd: i % 2 ? 1 : -1,
        len: rnd(8, 13),
        c: LC[Math.floor(rnd(0, LC.length))],
        ph: rnd(0, 6.28),
      }));

    function build() {
      bs = [];
      const n = Math.max(7, Math.round(CW / 150));
      for (let i = 0; i < n; i++) {
        const x = (CW / (n - 1)) * i;
        bs.push({
          x,
          y: rnd(22, 30),
          len: rnd(18, 32),
          a: rnd(Math.PI * 0.25, Math.PI * 0.75),
          w: rnd(3.5, 6),
          ph: rnd(0, 6.28),
          bd: i % 2 ? 1 : -1,
          st: pass(x) + 0.1,
          lv: mkLv(3),
        });
      }
      bs.slice().forEach((b) =>
        bs.push({
          par: b,
          len: rnd(12, 22),
          a: b.a + rnd(-0.65, 0.65),
          w: rnd(1.8, 3),
          ph: rnd(0, 6.28),
          bd: -b.bd,
          st: b.st + 0.7,
          lv: mkLv(2),
        })
      );
    }

    function fit() {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      CW = window.innerWidth;
      cv.width = CW * d;
      cv.height = CH * d;
      cv.style.width = CW + 'px';
      cv.style.height = CH + 'px';
      cx.setTransform(d, 0, 0, d, 0, 0);
      build();
    }

    function trunk(dy, w, col, xf) {
      cx.save();
      cx.beginPath();
      cx.rect(xf, 0, CW + 80 - xf, CH);
      cx.clip();
      cx.beginPath();
      cx.moveTo(-50, 26 + dy);
      cx.bezierCurveTo(CW * 0.2, 38 + dy, CW * 0.5, 24 + dy, CW * 0.72, 30 + dy);
      cx.bezierCurveTo(CW * 0.9, 34 + dy, CW * 1.05, 27 + dy, CW + 50, 25 + dy);
      cx.lineWidth = w;
      cx.strokeStyle = col;
      cx.lineCap = 'round';
      cx.stroke();
      cx.restore();
    }

    function leaf(x, y, a, L, c) {
      cx.save();
      cx.translate(x, y);
      cx.rotate(a);
      cx.beginPath();
      cx.moveTo(0, 0);
      cx.bezierCurveTo(L * 0.25, -L * 0.42, L * 0.75, -L * 0.4, L, 0);
      cx.bezierCurveTo(L * 0.75, L * 0.4, L * 0.25, L * 0.42, 0, 0);
      cx.fillStyle = c;
      cx.fill();
      cx.beginPath();
      cx.moveTo(0, 0);
      cx.lineTo(L * 0.85, 0);
      cx.lineWidth = 0.7;
      cx.strokeStyle = 'rgba(40, 80, 45, .42)';
      cx.stroke();
      cx.restore();
    }

    function twig(b, t, s) {
      const g = e2(cl((s - b.st) / 0.6));
      if (g <= 0) return;
      const bx = b.par ? (b.par.tx || 0) : (b.x || 0);
      const by = b.par ? (b.par.ty || 0) : (b.y || 0);
      const L = b.len * g;
      const sw = Math.sin(t * 0.001 + b.ph) * 2;
      const ex = bx + Math.cos(b.a) * L + sw;
      const ey = by + Math.sin(b.a) * L;
      const mx = (bx + ex) / 2 - Math.sin(b.a) * L * 0.18 * b.bd;
      const my = (by + ey) / 2 + Math.cos(b.a) * L * 0.18 * b.bd;
      b.tx = ex;
      b.ty = ey;

      cx.beginPath();
      cx.moveTo(bx, by);
      cx.quadraticCurveTo(mx, my, ex, ey);
      cx.lineWidth = b.w * (0.5 + 0.5 * g);
      cx.lineCap = 'round';
      cx.strokeStyle = b.par ? '#4e321f' : '#633b22';
      cx.stroke();

      const ang = Math.atan2(ey - my, ex - mx);
      b.lv.forEach((l) => {
        const k = e2(cl((s - b.st - 0.3 - l.u * 0.4) / 0.35));
        if (k <= 0) return;
        const u = l.u;
        const q = 1 - u;
        const px = q * q * bx + 2 * q * u * mx + u * u * ex;
        const py = q * q * by + 2 * q * u * my + u * u * ey;
        leaf(px, py, l.u === 1 ? ang : ang + l.sd * 0.95 + Math.sin(t * 0.0015 + l.ph) * 0.08, l.len * k, l.c);
      });
    }

    function draw(t) {
      if (!t0 && (navReady || document.body.classList.contains('ready'))) t0 = t;
      cx.clearRect(0, 0, CW, CH);
      if (!t0 && !calm) return;
      const s = calm ? 99 : (t - t0) / 1000;
      const u = cl((s - TS) / TD);
      const xf = (CW + 60) * (1 - e2(u)) - 30;
      if (u > 0) {
        trunk(5, 34, '#1f120b', xf);
        trunk(0, 27, '#714527', xf);
        trunk(-4, 4, 'rgba(180,120,70,.45)', xf);
      }
      bs.forEach((b) => twig(b, t, s));
    }

    let lt = 0;
    function loop(t) {
      requestAnimationFrame(loop);
      if (t - lt < 40) return;
      lt = t;
      draw(t);
    }

    fit();
    window.addEventListener('resize', () => { fit(); if (calm) draw(0); });
    if (calm) draw(0);
    else requestAnimationFrame(loop);
  })();

  /* ==================== 5. SKY, STARS, MASCOT & RIVER ==================== */
  (function initAtmosphere() {
    const sg = document.getElementById('stars');
    if (sg) {
      let seed = 4242;
      const next = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      for (let i = 0; i < 70; i++) {
        const size = 1 + next() * 2.5;
        const d = document.createElement('div');
        d.className = 'star';
        d.style.left = (next() * 100).toFixed(2) + '%';
        d.style.top = (next() * 85).toFixed(2) + '%';
        d.style.width = size.toFixed(2) + 'px';
        d.style.height = size.toFixed(2) + 'px';
        d.style.animationDelay = (next() * 3).toFixed(2) + 's';
        sg.appendChild(d);
      }
    }

    const river = document.getElementById('river');
    if (river) {
      for (let i = 0; i < 10; i++) {
        const g = document.createElement('i');
        g.className = 'gl';
        g.style.left = (5 + i * 10) + '%';
        g.style.top = (25 + ((i * 37) % 55)) + '%';
        g.style.animationDelay = (i * 0.35).toFixed(2) + 's';
        river.appendChild(g);
      }
    }

    const mascot = document.getElementById('mascot');
    const eyeL = document.getElementById('eyeL');
    const eyeR = document.getElementById('eyeR');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!calm && mascot && eyeL && eyeR) {
      window.addEventListener('pointermove', (e) => {
        const m = mascot.getBoundingClientRect();
        const dx = e.clientX - (m.left + m.width / 2);
        const dy = e.clientY - (m.top + m.height / 2);
        const k = Math.min(1, Math.hypot(dx, dy) / 400) * 5;
        const a = Math.atan2(dy, dx);
        const tx = `${Math.cos(a) * k}px ${Math.sin(a) * k}px`;
        eyeL.style.translate = tx;
        eyeR.style.translate = tx;
      });
    }

    if (mascot) {
      mascot.addEventListener('click', (e) => {
        if (calm) return;
        for (let i = 0; i < 10; i++) {
          const s = document.createElement('span');
          const a = Math.random() * 6.28;
          const r = 60 + Math.random() * 80;
          s.textContent = ['🍃', '🌱', '✨'][i % 3];
          s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;font-size:22px;z-index:60;pointer-events:none`;
          document.body.append(s);
          s.animate(
            [
              { transform: 'translate(0,0) scale(.5)', opacity: 1 },
              {
                transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r - 40}px) rotate(${Math.random() * 360}deg) scale(1.2)`,
                opacity: 0,
              },
            ],
            { duration: 900, easing: 'ease-out' }
          ).onfinish = () => s.remove();
        }
      });
    }

    const infoSec = document.getElementById('info');
    const skyBtns = Array.from(document.querySelectorAll('#info .tbar button'));
    skyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = btn.getAttribute('data-t') || 'day';
        if (infoSec) infoSec.setAttribute('data-t', t);
        skyBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      });
    });
  })();

  /* ==================== 6. QUESTS, LEADERBOARD & ADMIN DEMO ==================== */
  (function initQuestsAndAdmin() {
    const STATUS_LABEL = {
      belum: 'Belum dikerjakan',
      terkirim: 'Menunggu verifikasi',
      disetujui: 'Disetujui',
      ditolak: 'Ditolak, dapat kirim ulang',
    };
    const TONES = ['green', 'purple', 'yellow'];
    const ADMIN_LABELS = { terkirim: 'Menunggu', disetujui: 'Disetujui', ditolak: 'Ditolak' };

    let activeIds = [...INITIAL_QUEST_IDS];
    let rerollSisa = REROLL_MAX;
    let statuses = {};
    let submittedMap = {};
    let me = { ...INITIAL_ME };
    let submissions = [];
    let adminFilter = 'semua';
    let freshSlot = null;
    let bumpMe = false;

    const elRerollInfo = document.getElementById('eg-reroll-info');
    const elQuestList = document.getElementById('eg-quest-list');
    const elLeaderboard = document.getElementById('eg-leaderboard');
    const elLevelLv = document.getElementById('eg-level-lv');
    const elLevelBar = document.getElementById('eg-level-bar');
    const elLevelFill = document.getElementById('eg-level-fill');
    const elLevelCaption = document.getElementById('eg-level-caption');
    const elLevelPoin = document.getElementById('eg-level-poin');

    const elQuestModal = document.getElementById('eg-modal');
    const elQuestModalBody = document.getElementById('eg-modal-body');

    const elAdminBadge = document.getElementById('eg-admin-pending-badge');
    const elAdminPending = document.getElementById('eg-admin-pending');
    const elAdminApproved = document.getElementById('eg-admin-approved');
    const elAdminRejected = document.getElementById('eg-admin-rejected');
    const elAdminFilter = document.getElementById('eg-admin-filter');
    const elAdminRows = document.getElementById('eg-admin-rows');
    const elAdminEmpty = document.getElementById('eg-admin-empty');

    const elAdminDialog = document.getElementById('eg-admin-dialog');
    const elAdminTitle = document.getElementById('eg-admin-dialog-title');
    const elAdminUser = document.getElementById('eg-admin-user');
    const elAdminProof = document.getElementById('eg-admin-proof');
    const elAdminNote = document.getElementById('eg-admin-note');
    const elAdminReason = document.getElementById('eg-admin-reason');
    const elAdminApprove = document.getElementById('eg-admin-approve');
    const elAdminReject = document.getElementById('eg-admin-reject');
    const elAdminFeedback = document.getElementById('eg-admin-feedback');

    let photoPreviewUrl = null;
    let reviewProofUrl = null;
    let currentReviewRow = null;

    const statusOf = (id) => statuses[id] || 'belum';

    function renderRerollInfo() {
      if (!elRerollInfo) return;
      elRerollInfo.className = `eg-reroll-info ${rerollSisa <= 0 ? 'is-empty' : ''}`.trim();
      elRerollInfo.textContent = '';
      elRerollInfo.append('↻ Ganti misi: ');
      const strong = document.createElement('strong');
      strong.textContent = `${rerollSisa}x`;
      elRerollInfo.appendChild(strong);
      elRerollInfo.append(' tersisa hari ini');
    }

    function renderQuests() {
      if (!elQuestList) return;
      elQuestList.textContent = '';

      activeIds.forEach((id, idx) => {
        const q = QUEST_MAP[id];
        if (!q) return;
        const st = statusOf(q.id);
        const sent = st === 'terkirim' || st === 'disetujui';
        const off = sent || rerollSisa <= 0;
        const tip = sent
          ? 'Misi yang sudah dikirim tidak bisa diganti'
          : rerollSisa <= 0
            ? 'Jatah ganti misi hari ini habis'
            : 'Ganti dengan misi lain';

        const card = document.createElement('article');
        card.className = `eg-card eg-quest eg-tone-${TONES[idx % TONES.length]} ${freshSlot === idx ? 'is-fresh' : ''}`.trim();
        card.dataset.questId = q.id;

        const top = document.createElement('div');
        top.className = 'eg-quest__top';
        const num = document.createElement('span');
        num.className = 'eg-num';
        num.textContent = String(idx + 1).padStart(2, '0');
        const tag = document.createElement('span');
        tag.className = 'eg-tag';
        tag.textContent = q.tag;
        top.append(num, tag);

        const h3 = document.createElement('h3');
        h3.textContent = q.judul;
        const p = document.createElement('p');
        p.textContent = q.deskripsi;

        const meta = document.createElement('div');
        meta.className = 'eg-quest__meta';
        const statusSpan = document.createElement('span');
        statusSpan.className = `eg-status eg-status--${st}`;
        const dot = document.createElement('i');
        dot.setAttribute('aria-hidden', 'true');
        statusSpan.append(dot, document.createTextNode(STATUS_LABEL[st]));

        const rerollBtn = document.createElement('button');
        rerollBtn.type = 'button';
        rerollBtn.className = 'eg-reroll';
        rerollBtn.title = tip;
        rerollBtn.disabled = off;
        rerollBtn.textContent = '↻ Ganti Misi';
        rerollBtn.addEventListener('click', () => handleReroll(q.id));
        meta.append(statusSpan, rerollBtn);

        const foot = document.createElement('div');
        foot.className = 'eg-quest__foot';
        const chips = document.createElement('span');
        chips.className = 'eg-chips';
        const xpChip = document.createElement('span');
        xpChip.className = 'eg-chip';
        xpChip.textContent = `+${q.xp} XP`;
        const poinChip = document.createElement('span');
        poinChip.className = 'eg-chip eg-chip--poin';
        poinChip.textContent = `+${q.poin} Poin`;
        chips.append(xpChip, poinChip);

        const openBtn = document.createElement('button');
        openBtn.type = 'button';
        openBtn.className = 'eg-link';
        openBtn.textContent = 'Lihat Misi →';
        openBtn.addEventListener('click', () => openQuestModal(q.id));
        foot.append(chips, openBtn);

        card.append(top, h3, p, meta, foot);
        elQuestList.appendChild(card);
      });
    }

    function handleReroll(id) {
      const slot = activeIds.indexOf(id);
      if (slot < 0) return;
      if (submittedMap[id]) {
        showToast('Misi yang sedang ditinjau atau sudah disetujui tidak bisa diganti.');
        return;
      }
      if (rerollSisa <= 0) {
        showToast('Jatah ganti misi hari ini sudah habis.');
        return;
      }
      const candidates = QUEST_POOL.filter((q) => !activeIds.includes(q.id) && !submittedMap[q.id]);
      if (candidates.length === 0) {
        showToast('Belum ada misi lain yang tersedia.');
        return;
      }
      const candidate = candidates[Math.floor(Math.random() * candidates.length) % candidates.length];
      const oldQuest = QUEST_MAP[id];
      activeIds[slot] = candidate.id;
      rerollSisa -= 1;
      freshSlot = slot;
      renderRerollInfo();
      renderQuests();
      setTimeout(() => { freshSlot = null; }, 500);
      showToast(`Misi diganti: ${oldQuest.judul} → ${candidate.judul}`);
    }

    function renderLeaderboardAndLevel() {
      if (elLeaderboard) {
        const rows = LEADERBOARD_OTHERS.map((o) => ({ ...o, isMe: false }));
        rows.push({ nama: me.nama, xp: me.xp, poin: me.poin, isMe: true });
        rows.sort((a, b) => b.xp - a.xp);
        elLeaderboard.textContent = '';

        rows.forEach((u, i) => {
          const tone = i === 0 ? 'yellow' : i === 1 ? 'purple' : i === 2 ? 'green' : 'plain';
          const li = document.createElement('li');
          li.className = `eg-row eg-tone-${tone} ${u.isMe ? 'is-me' : ''} ${u.isMe && bumpMe ? 'is-bump' : ''}`.trim();

          const r = document.createElement('span');
          r.className = 'eg-row__rank';
          r.textContent = String(i + 1).padStart(2, '0');

          const n = document.createElement('span');
          n.className = 'eg-row__name';
          n.textContent = u.nama;
          if (u.isMe) {
            const em = document.createElement('em');
            em.textContent = ' (kamu)';
            n.appendChild(em);
          }

          const xp = document.createElement('span');
          xp.className = 'eg-row__xp';
          xp.textContent = `${fmtNum.format(u.xp)} XP`;

          const poin = document.createElement('span');
          poin.className = 'eg-row__poin';
          poin.textContent = `${fmtNum.format(u.poin)} Poin`;

          li.append(r, n, xp, poin);
          elLeaderboard.appendChild(li);
        });
      }

      const pct = Math.min(100, Math.round((me.xp / me.levelXp) * 100));
      if (elLevelLv) elLevelLv.textContent = `Level ${me.level}`;
      if (elLevelBar) {
        elLevelBar.setAttribute('aria-valuemax', String(me.levelXp));
        elLevelBar.setAttribute('aria-valuenow', String(me.xp));
      }
      if (elLevelFill) elLevelFill.style.width = `${pct}%`;
      if (elLevelCaption) elLevelCaption.textContent = `${fmtNum.format(me.xp)} / ${fmtNum.format(me.levelXp)} XP menuju level berikutnya`;
      if (elLevelPoin) elLevelPoin.textContent = `Poin kamu: ${fmtNum.format(me.poin)}`;
    }

    function openQuestModal(id) {
      const q = QUEST_MAP[id];
      if (!q || !elQuestModal || !elQuestModalBody) return;
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
        photoPreviewUrl = null;
      }

      let selectedFile = null;
      let sending = false;
      const st = statusOf(q.id);
      const sent = st === 'terkirim' || st === 'disetujui';

      elQuestModalBody.textContent = '';

      const tag = document.createElement('span');
      tag.className = 'eg-tag eg-tag--solid';
      tag.textContent = q.tag;

      const h3 = document.createElement('h3');
      h3.id = 'eg-modal-title';
      h3.textContent = q.judul;

      const desc = document.createElement('p');
      desc.className = 'eg-modal__desc';
      desc.textContent = q.deskripsi;

      const ol = document.createElement('ol');
      ol.className = 'eg-modal__steps';
      q.langkah.forEach((step) => {
        const li = document.createElement('li');
        li.textContent = step;
        ol.appendChild(li);
      });

      const meta = document.createElement('div');
      meta.className = 'eg-modal__meta';
      const xpChip = document.createElement('span');
      xpChip.className = 'eg-chip';
      xpChip.textContent = `+${q.xp} XP`;
      const poinChip = document.createElement('span');
      poinChip.className = 'eg-chip eg-chip--poin';
      poinChip.textContent = `+${q.poin} Poin`;
      const stSpan = document.createElement('span');
      stSpan.className = `eg-status eg-status--${st}`;
      const stDot = document.createElement('i');
      stDot.setAttribute('aria-hidden', 'true');
      stSpan.append(stDot, document.createTextNode(STATUS_LABEL[st]));
      meta.append(xpChip, poinChip, stSpan);

      elQuestModalBody.append(tag, h3, desc, ol, meta);

      let noteInput = null;
      if (!sent) {
        const proofWrap = document.createElement('div');
        proofWrap.className = 'eg-proof';

        const lblPhoto = document.createElement('label');
        lblPhoto.htmlFor = 'eg-quest-photo';
        lblPhoto.textContent = 'Bukti foto kegiatan (wajib)';

        const fileInput = document.createElement('input');
        fileInput.id = 'eg-quest-photo';
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg,image/png,image/webp';
        fileInput.required = true;

        const imgPreview = document.createElement('img');
        imgPreview.className = 'eg-proof__img';
        imgPreview.alt = 'Pratinjau bukti';
        imgPreview.hidden = true;

        fileInput.addEventListener('change', () => {
          selectedFile = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
          if (photoPreviewUrl) {
            URL.revokeObjectURL(photoPreviewUrl);
            photoPreviewUrl = null;
          }
          if (selectedFile) {
            photoPreviewUrl = URL.createObjectURL(selectedFile);
            imgPreview.src = photoPreviewUrl;
            imgPreview.hidden = false;
          } else {
            imgPreview.hidden = true;
          }
        });

        const lblNote = document.createElement('label');
        lblNote.htmlFor = 'eg-quest-note';
        lblNote.textContent = 'Catatan singkat (opsional)';

        noteInput = document.createElement('textarea');
        noteInput.id = 'eg-quest-note';
        noteInput.rows = 2;
        noteInput.maxLength = 240;
        noteInput.placeholder = 'Ceritakan kegiatanmu...';

        const helper = document.createElement('p');
        helper.textContent = 'Demo: foto hanya disimpan di browser ini. Hindari foto wajah, alamat, atau data pribadi.';

        proofWrap.append(lblPhoto, fileInput, imgPreview, lblNote, noteInput, helper);
        elQuestModalBody.appendChild(proofWrap);
      }

      const sendBtn = document.createElement('button');
      sendBtn.type = 'button';
      sendBtn.className = 'eg-btn eg-btn--green eg-modal__send';
      sendBtn.disabled = sent;
      sendBtn.textContent = sent ? 'Menunggu / Sudah Diverifikasi' : 'Kirim Bukti Foto';

      sendBtn.addEventListener('click', async () => {
        if (['terkirim', 'disetujui'].includes(statusOf(q.id)) || sending) return;
        if (!selectedFile) {
          showToast('Pilih foto bukti kegiatan terlebih dahulu.');
          return;
        }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type) || selectedFile.size === 0 || selectedFile.size > 3 * 1024 * 1024) {
          showToast('Gunakan JPG/PNG/WebP maksimal 3 MB.');
          return;
        }
        sending = true;
        sendBtn.disabled = true;
        sendBtn.textContent = 'Menyimpan bukti...';
        try {
          await submitQuestProof(q, selectedFile, noteInput ? noteInput.value : '');
          await syncFromStore(false);
          showToast('Bukti dikirim untuk ditinjau. XP diberikan setelah disetujui.');
          openQuestModal(q.id);
        } catch (err) {
          showToast(err instanceof Error ? err.message : 'Bukti gagal disimpan.');
          sending = false;
          sendBtn.disabled = false;
          sendBtn.textContent = 'Kirim Bukti Foto';
        }
      });

      elQuestModalBody.appendChild(sendBtn);

      if (typeof elQuestModal.showModal === 'function') elQuestModal.showModal();
      else elQuestModal.setAttribute('open', '');
    }

    if (elQuestModal) {
      elQuestModal.addEventListener('click', (e) => {
        if (e.target === elQuestModal) elQuestModal.close();
      });
    }

    function renderAdminPanel() {
      const pending = submissions.filter((r) => r.status === 'terkirim').length;
      const approved = submissions.filter((r) => r.status === 'disetujui').length;
      const rejected = submissions.filter((r) => r.status === 'ditolak').length;

      if (elAdminBadge) elAdminBadge.textContent = `${pending} menunggu`;
      if (elAdminPending) elAdminPending.textContent = String(pending);
      if (elAdminApproved) elAdminApproved.textContent = String(approved);
      if (elAdminRejected) elAdminRejected.textContent = String(rejected);

      const visible = submissions.filter((r) => adminFilter === 'semua' || r.status === adminFilter);
      if (elAdminRows) {
        elAdminRows.textContent = '';
        visible.forEach((row) => {
          const item = document.createElement('article');
          item.className = 'eg-ui-admin-row';

          const info = document.createElement('div');
          const h3 = document.createElement('h3');
          h3.textContent = row.questTitle;
          const p = document.createElement('p');
          p.textContent = `${row.userName} • ${fmtDate(row.submittedAt)}`;
          info.append(h3, p);

          const stBadge = document.createElement('span');
          stBadge.className = `eg-ui-review-status is-${row.status}`;
          stBadge.textContent = ADMIN_LABELS[row.status] || 'Tidak diketahui';

          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'eg-btn eg-btn--purple';
          btn.textContent = 'Lihat Bukti';
          btn.addEventListener('click', () => openReviewModal(row));

          item.append(info, stBadge, btn);
          elAdminRows.appendChild(item);
        });
      }
      if (elAdminEmpty) elAdminEmpty.hidden = visible.length !== 0;
    }

    function openReviewModal(row) {
      currentReviewRow = row;
      if (reviewProofUrl) {
        URL.revokeObjectURL(reviewProofUrl);
        reviewProofUrl = null;
      }
      if (elAdminTitle) elAdminTitle.textContent = row.questTitle;
      if (elAdminUser) {
        elAdminUser.textContent = `${row.userName} • ${ADMIN_LABELS[row.status] || ''} • ${fmtDate(row.submittedAt)}`;
      }
      if (elAdminProof) {
        elAdminProof.textContent = '';
        if (row.proof instanceof Blob && row.proof.size) {
          reviewProofUrl = URL.createObjectURL(row.proof);
          const img = document.createElement('img');
          img.src = reviewProofUrl;
          img.alt = 'Bukti foto kegiatan, hanya tersimpan di browser ini';
          const pName = document.createElement('p');
          pName.textContent = row.proofName || 'Bukti foto';
          elAdminProof.append(img, pName);
        } else {
          const pNo = document.createElement('p');
          pNo.textContent = 'Tidak ada bukti foto. Pengajuan tidak bisa disetujui.';
          elAdminProof.appendChild(pNo);
        }
      }
      if (elAdminNote) elAdminNote.textContent = row.note ? `Catatan: ${row.note}` : 'Tanpa catatan tambahan.';
      if (elAdminReason) {
        elAdminReason.value = row.reason || '';
        elAdminReason.disabled = row.status !== 'terkirim';
      }
      if (elAdminApprove) elAdminApprove.disabled = row.status !== 'terkirim' || !reviewProofUrl;
      if (elAdminReject) elAdminReject.disabled = row.status !== 'terkirim';
      if (elAdminFeedback) elAdminFeedback.textContent = '';

      if (elAdminDialog) {
        if (typeof elAdminDialog.showModal === 'function') elAdminDialog.showModal();
        else elAdminDialog.setAttribute('open', '');
      }
    }

    async function handleAdminReview(approve) {
      if (!currentReviewRow || currentReviewRow.status !== 'terkirim') return;
      if (elAdminApprove) elAdminApprove.disabled = true;
      if (elAdminReject) elAdminReject.disabled = true;
      try {
        await reviewSubmission(currentReviewRow.id, approve, elAdminReason ? elAdminReason.value : '');
        if (elAdminFeedback) {
          elAdminFeedback.textContent = approve
            ? 'Disetujui. XP akan diperbarui pada halaman Peringkat.'
            : 'Ditolak. Pengguna dapat mengirim ulang bukti.';
        }
        await syncFromStore(approve);
        if (elAdminDialog) elAdminDialog.close();
      } catch (err) {
        if (elAdminFeedback) elAdminFeedback.textContent = err instanceof Error ? err.message : 'Verifikasi gagal.';
        if (elAdminApprove) elAdminApprove.disabled = currentReviewRow.status !== 'terkirim' || !reviewProofUrl;
        if (elAdminReject) elAdminReject.disabled = currentReviewRow.status !== 'terkirim';
      }
    }

    if (elAdminFilter) {
      elAdminFilter.addEventListener('change', () => {
        adminFilter = elAdminFilter.value;
        renderAdminPanel();
      });
    }
    if (elAdminApprove) elAdminApprove.addEventListener('click', () => void handleAdminReview(true));
    if (elAdminReject) elAdminReject.addEventListener('click', () => void handleAdminReview(false));
    if (elAdminDialog) {
      elAdminDialog.addEventListener('click', (e) => {
        if (e.target === elAdminDialog) elAdminDialog.close();
      });
      elAdminDialog.addEventListener('close', () => {
        if (reviewProofUrl) {
          URL.revokeObjectURL(reviewProofUrl);
          reviewProofUrl = null;
        }
        currentReviewRow = null;
      });
    }

    async function syncFromStore(flash) {
      const all = await getAllSubmissions();
      submissions = [...all].sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)));

      const nextStatuses = {};
      const nextSubmitted = {};
      const approvedIds = [];

      all
        .filter((r) => r.userName === 'Kamu')
        .forEach((r) => {
          if (!QUEST_MAP[r.questId]) return;
          nextStatuses[r.questId] = r.status;
          if (r.status === 'terkirim' || r.status === 'disetujui') nextSubmitted[r.questId] = true;
          if (r.status === 'disetujui') approvedIds.push(r.questId);
        });

      statuses = nextStatuses;
      submittedMap = nextSubmitted;
      const updated = applyQuestRewards(INITIAL_ME, approvedIds);
      bumpMe = Boolean(flash && updated.xp > me.xp);
      me = updated;

      renderRerollInfo();
      renderQuests();
      renderLeaderboardAndLevel();
      renderAdminPanel();

      if (bumpMe) {
        setTimeout(() => {
          bumpMe = false;
          renderLeaderboardAndLevel();
        }, 950);
      }
    }

    void syncFromStore(false);
    window.addEventListener('focus', () => void syncFromStore(false));
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) void syncFromStore(false);
    });
  })();

  /* ==================== 7. ECO LIBRARY ==================== */
  (function initLibrary() {
    const categories = ['Semua', ...Array.from(new Set(ARTICLES.map((a) => a.category)))];
    let selectedCategory = 'Semua';
    let searchTerm = '';

    const elSearch = document.getElementById('eg-library-search');
    const elFilters = document.getElementById('eg-library-filters');
    const elCount = document.getElementById('eg-library-count');
    const elCards = document.getElementById('eg-library-cards');
    const elEmpty = document.getElementById('eg-library-empty');
    const elDialog = document.getElementById('eg-article-dialog');
    const elDialogBody = document.getElementById('eg-article-body');

    function openArticle(article) {
      if (!elDialog || !elDialogBody) return;
      elDialogBody.textContent = '';

      const cat = document.createElement('span');
      cat.className = 'eg-ui-article__category';
      cat.textContent = article.category;

      const h3 = document.createElement('h3');
      h3.id = 'eg-article-title';
      h3.textContent = article.title;

      const time = document.createElement('p');
      time.className = 'eg-ui-reading-time';
      time.textContent = `${article.minutes} menit baca`;

      elDialogBody.append(cat, h3, time);
      article.paragraphs.forEach((para) => {
        const p = document.createElement('p');
        p.className = 'eg-ui-reading-paragraph';
        p.textContent = para;
        elDialogBody.appendChild(p);
      });

      const note = document.createElement('p');
      note.className = 'eg-ui-article-note';
      note.textContent = 'Konten edukasi umum. Pendampingan orang dewasa disarankan untuk aktivitas anak.';
      elDialogBody.appendChild(note);

      if (typeof elDialog.showModal === 'function') elDialog.showModal();
      else elDialog.setAttribute('open', '');
    }

    function renderFilters() {
      if (!elFilters) return;
      elFilters.textContent = '';
      categories.forEach((cat) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `eg-ui-filter ${cat === selectedCategory ? 'is-active' : ''}`.trim();
        btn.setAttribute('aria-pressed', String(cat === selectedCategory));
        btn.textContent = cat;
        btn.addEventListener('click', () => {
          selectedCategory = cat;
          renderFilters();
          renderArticles();
        });
        elFilters.appendChild(btn);
      });
    }

    function renderArticles() {
      const term = searchTerm.trim().toLocaleLowerCase('id-ID');
      const matched = ARTICLES.filter((a) => {
        const fitsCat = selectedCategory === 'Semua' || a.category === selectedCategory;
        const fitsSearch = !term || [a.title, a.category, a.summary].join(' ').toLocaleLowerCase('id-ID').includes(term);
        return fitsCat && fitsSearch;
      });

      if (elCount) elCount.textContent = `${matched.length} artikel ditemukan`;
      if (elCards) {
        elCards.textContent = '';
        matched.forEach((a) => {
          const card = document.createElement('article');
          card.className = 'eg-ui-article eg-ui-glass';

          const art = document.createElement('div');
          art.className = `eg-ui-article__art eg-tone-${a.tone}`;
          art.setAttribute('aria-hidden', 'true');
          const icon = document.createElement('span');
          icon.textContent = a.icon;
          art.appendChild(icon);

          const cat = document.createElement('span');
          cat.className = 'eg-ui-article__category';
          cat.textContent = a.category;

          const h3 = document.createElement('h3');
          h3.textContent = a.title;

          const sum = document.createElement('p');
          sum.className = 'eg-ui-article__summary';
          sum.textContent = a.summary;

          const foot = document.createElement('div');
          foot.className = 'eg-ui-article__foot';
          const min = document.createElement('span');
          min.textContent = `${a.minutes} menit baca`;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'eg-ui-open';
          btn.textContent = 'Baca Cerita →';
          btn.addEventListener('click', () => openArticle(a));
          foot.append(min, btn);

          card.append(art, cat, h3, sum, foot);
          elCards.appendChild(card);
        });
      }
      if (elEmpty) elEmpty.hidden = matched.length !== 0;
    }

    if (elSearch) {
      elSearch.addEventListener('input', () => {
        searchTerm = elSearch.value;
        renderArticles();
      });
    }
    if (elDialog) {
      elDialog.addEventListener('click', (e) => {
        if (e.target === elDialog) elDialog.close();
      });
    }

    renderFilters();
    renderArticles();
  })();

  /* ==================== 8. DONATION & CONTACT ==================== */
  (function initDonationAndContact() {
    const donasi = document.getElementById('donasi');
    const embWrap = document.getElementById('emb');
    const tabBtns = Array.from(document.querySelectorAll('#donasi .tabs button'));
    const amtBtns = Array.from(document.querySelectorAll('#donasi .amt button'));
    const elTitle = document.getElementById('ct');
    const elDesc = document.getElementById('cd');
    const elB1 = document.getElementById('b1');
    const elS1 = document.getElementById('s1');
    const elG2T = document.getElementById('g2t');
    const elB2 = document.getElementById('b2');
    const elS2 = document.getElementById('s2');
    const formDonasi = document.getElementById('f');
    const inputNama = document.getElementById('nm');
    const elMsg = document.getElementById('msg');

    let activeKey = 'reb';
    let selectedAmt = 'Rp25.000';

    if (embWrap) {
      let seed = 8899;
      const next = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      for (let i = 0; i < 30; i++) {
        const em = document.createElement('div');
        em.className = 'emb';
        em.style.left = (next() * 100).toFixed(2) + '%';
        em.style.animationDelay = (next() * 5).toFixed(2) + 's';
        em.style.animationDuration = (3 + next() * 4).toFixed(2) + 's';
        embWrap.appendChild(em);
      }
    }

    function renderCampaign() {
      const c = CAMPAIGNS[activeKey];
      const isBurn = activeKey === 'kar';
      if (donasi) donasi.classList.toggle('burn', isBurn);
      document.body.classList.toggle('burn', isBurn);

      if (elTitle) elTitle.textContent = c.t;
      if (elDesc) elDesc.textContent = c.d;
      if (elB1) elB1.style.width = `${Math.min(100, Math.max(0, (c.c / c.g) * 100))}%`;
      if (elS1) elS1.textContent = `${rp(c.c)} terkumpul dari ${rp(c.g)} (contoh)`;
      if (elG2T) elG2T.textContent = c.n;
      if (elB2) elB2.style.width = `${Math.min(100, Math.max(0, (c.b / c.a) * 100))}%`;
      if (elS2) elS2.textContent = `${c.b} dari ${c.a} ${c.u}`;
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeKey = btn.getAttribute('data-c') || 'reb';
        tabBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        renderCampaign();
      });
    });

    amtBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedAmt = btn.textContent || 'Rp25.000';
        amtBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      });
    });

    if (formDonasi) {
      formDonasi.addEventListener('submit', (e) => {
        e.preventDefault();
        const who = inputNama && inputNama.value.trim() ? `, ${inputNama.value.trim()}` : '';
        const c = CAMPAIGNS[activeKey];
        if (elMsg) {
          elMsg.textContent = `Terima kasih${who}! Donasi ${selectedAmt} (${c.t}) adalah tampilan contoh, belum tersambung ke pembayaran.`;
        }
      });
    }

    renderCampaign();

    const contactForm = document.getElementById('eg-contact-form');
    const cName = document.getElementById('eg-contact-name');
    const cEmail = document.getElementById('eg-contact-email');
    const cMsg = document.getElementById('eg-contact-message');
    const cRes = document.getElementById('eg-contact-result');

    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const n = cName ? cName.value.trim() : '';
        const em = cEmail ? cEmail.value.trim() : '';
        const m = cMsg ? cMsg.value.trim() : '';
        if (!n || !em || !m) {
          if (cRes) cRes.textContent = 'Semua kolom wajib diisi.';
          return;
        }
        const summary = `Nama: ${n}\nEmail: ${em}\nPesan: ${m}`;
        try {
          if (!navigator.clipboard || !navigator.clipboard.writeText) {
            throw new Error('Clipboard tidak tersedia');
          }
          await navigator.clipboard.writeText(summary);
          if (cRes) cRes.textContent = 'Pesan berhasil disalin. Belum dikirim ke server.';
        } catch {
          if (cRes) cRes.textContent = 'Fitur salin membutuhkan localhost/HTTPS dan izin clipboard. Pesan tidak dikirim.';
        }
      });
    }
  })();

  /* ==================== 9. SCROLLSPY, PARALLAX, REVEAL & LEAVES ==================== */
  (function initScrollAndEffects() {
    const nav = document.querySelector('nav');
    const navLinks = Array.from(document.querySelectorAll('#menu a'));
    const dotLinks = Array.from(document.querySelectorAll('.dots a'));
    const topEl = document.getElementById('top');
    const infoEl = document.getElementById('info');

    const pickActive = (anchors, k) => {
      let cur = anchors[0] ? anchors[0].getAttribute('href') : '';
      for (const a of anchors) {
        const href = a.getAttribute('href');
        const target = href ? document.querySelector(href) : null;
        if (target && target.getBoundingClientRect().top < window.innerHeight * k) {
          cur = href;
        }
      }
      return cur;
    };

    let ticking = false;
    function updateScroll() {
      if (window.scrollY < 2600) {
        const sy = String(window.scrollY);
        if (topEl) topEl.style.setProperty('--sy', sy);
        if (infoEl) infoEl.style.setProperty('--sy', sy);
      }
      if (nav) nav.classList.toggle('sc', window.scrollY > 30);

      const actNav = pickActive(navLinks, 0.35);
      navLinks.forEach((a) => a.classList.toggle('act', a.getAttribute('href') === actNav));

      const actDot = pickActive(dotLinks, 0.5);
      dotLinks.forEach((a) => a.classList.toggle('act', a.getAttribute('href') === actDot));
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    }, { passive: true });
    updateScroll();

    // Scroll reveal
    const rvEls = Array.from(document.querySelectorAll('.card,.m,.pf,.chip,.lv,.goal,.mem,.tbar'));
    if (!('IntersectionObserver' in window)) {
      rvEls.forEach((el) => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      rvEls.forEach((el) => {
        el.classList.add('rv');
        const idx = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
        el.style.setProperty('--d', `${(idx % 4) * 0.1}s`);
        io.observe(el);
      });
    }

    // Falling leaves on click/tap
    if (!document.body.animate) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const COLORS = ['#5FD088', '#44B46E', '#8CE082', '#B5F0A0', '#E8B838', '#FFD75A', '#E89642'];
    const MAX_LEAVES = 60;
    const layer = document.createElement('div');
    layer.className = 'eg-leaf-layer';
    layer.setAttribute('aria-hidden', 'true');
    const pakaiPopover = typeof layer.showPopover === 'function';
    if (pakaiPopover) layer.setAttribute('popover', 'manual');
    document.body.appendChild(layer);

    function naikkanLayer() {
      if (!pakaiPopover) return;
      try {
        if (layer.matches(':popover-open')) {
          if (!document.querySelector('dialog[open]')) return;
          layer.hidePopover();
        }
        layer.showPopover();
      } catch {
        // ignore popover errors
      }
    }

    const rand = (a, b) => a + Math.random() * (b - a);
    const leafSvg = (color) =>
      `<svg viewBox="0 0 20 20"><path d="M2 18 C1 8 8 1 19 1 C19 12 12 19 2 18Z" fill="${color}"/><path d="M3 17 C8 12 12 8 16 4" stroke="rgba(0,0,0,.25)" stroke-width="1" fill="none" stroke-linecap="round"/></svg>`;

    document.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button > 0) return;
      naikkanLayer();
      const n = Math.round(rand(8, 12));
      for (let i = 0; i < n; i++) {
        if (layer.childElementCount >= MAX_LEAVES) break;
        const el = document.createElement('span');
        el.className = 'eg-leaf';
        el.innerHTML = leafSvg(COLORS[Math.floor(Math.random() * COLORS.length)]);
        const size = rand(13, 24);
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        layer.appendChild(el);

        const spread = rand(-70, 70);
        const pop = rand(14, 44);
        const fall = rand(130, 280);
        const sway = rand(-40, 40);
        const spin = rand(-320, 320);
        const dur = rand(1300, 2300);
        const x0 = e.clientX - size / 2;
        const y0 = e.clientY - size / 2;

        el.animate(
          [
            { transform: `translate(${x0}px,${y0}px) rotate(0deg) scale(.3)`, opacity: 0 },
            { transform: `translate(${x0 + spread * 0.35}px,${y0 - pop}px) rotate(${spin * 0.2}deg) scale(1)`, opacity: 1, offset: 0.14 },
            { transform: `translate(${x0 + spread * 0.6 + sway}px,${y0 + fall * 0.45}px) rotate(${spin * 0.55}deg) scale(1)`, opacity: 1, offset: 0.55 },
            { transform: `translate(${x0 + spread - sway * 0.6}px,${y0 + fall}px) rotate(${spin}deg) scale(.9)`, opacity: 0 },
          ],
          { duration: dur, easing: 'cubic-bezier(.35,.1,.55,.95)', fill: 'forwards' }
        ).onfinish = () => el.remove();
      }
    }, { passive: true });
  })();
})();
