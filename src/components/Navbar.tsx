import { useEffect, useRef, useState, type CSSProperties } from 'react';

const NAV_LINKS = [
  { href: '#top', label: 'Beranda' },
  { href: '#cara', label: 'Informasi' },
  { href: '#info', label: 'Bukti' },
  { href: '#misi', label: 'Misi' },
  { href: '#peringkat', label: 'Peringkat' },
  { href: '#belajar', label: 'Belajar' },
  { href: '#tentang', label: 'Tentang' },
  { href: '#donasi', label: 'Donasi' },
  { href: '#kontak', label: 'Kontak' },
];

interface NavbarProps {
  activeSection: string;
  scrolled: boolean;
  ready: boolean;
}

export function Navbar({ activeSection, scrolled, ready }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CH = 86;
    const rnd = (a: number, b: number) => Math.random() * (b - a) + a;
    const cl = (v: number) => Math.min(1, Math.max(0, v));
    const e2 = (u: number) => 1 - Math.pow(1 - u, 3);
    const LC = ['#A6BA9E', '#BDCEB5', '#E2C258', '#C5B3C9', '#6B8F69'];
    const TS = 0.2;
    const TD = 1.8;

    interface LeafItem {
      u: number;
      sd: number;
      len: number;
      c: string;
      ph: number;
    }
    interface BranchItem {
      x?: number;
      y?: number;
      par?: BranchItem;
      len: number;
      a: number;
      w: number;
      ph: number;
      bd: number;
      st: number;
      lv: LeafItem[];
      tx?: number;
      ty?: number;
    }

    let CW = 0;
    let bs: BranchItem[] = [];
    let t0 = 0;

    const pass = (x: number) =>
      TS + (1 - Math.pow(1 - cl(1 - (x + 30) / (CW + 60)), 1 / 3)) * TD;

    const mkLv = (n: number): LeafItem[] =>
      Array.from({ length: n }, (_, i) => ({
        u: i === n - 1 ? 1 : 0.3 + (0.5 * i) / Math.max(1, n - 2),
        sd: i % 2 ? 1 : -1,
        len: rnd(8, 13),
        c: LC[Math.floor(rnd(0, LC.length))],
        ph: rnd(0, 6.28),
      }));

    const build = () => {
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
    };

    const fit = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      CW = window.innerWidth;
      cv.width = CW * d;
      cv.height = CH * d;
      cv.style.width = CW + 'px';
      cv.style.height = CH + 'px';
      cx.setTransform(d, 0, 0, d, 0, 0);
      build();
    };

    const trunk = (dy: number, w: number, col: string, xf: number) => {
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
    };

    const leaf = (x: number, y: number, a: number, L: number, c: string) => {
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
    };

    const twig = (b: BranchItem, t: number, s: number) => {
      const g = e2(cl((s - b.st) / 0.6));
      if (g <= 0) return;
      const bx = b.par ? (b.par.tx ?? 0) : (b.x ?? 0);
      const by = b.par ? (b.par.ty ?? 0) : (b.y ?? 0);
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
        leaf(
          px,
          py,
          l.u === 1 ? ang : ang + l.sd * 0.95 + Math.sin(t * 0.0015 + l.ph) * 0.08,
          l.len * k,
          l.c
        );
      });
    };

    const draw = (t: number) => {
      if (!t0 && (ready || document.body.classList.contains('ready'))) t0 = t;
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
    };

    let lt = 0;
    let rafId = 0;
    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop);
      if (t - lt < 40) return;
      lt = t;
      draw(t);
    };

    fit();
    const onResize = () => {
      fit();
      if (calm) draw(0);
    };
    window.addEventListener('resize', onResize);

    if (calm) {
      draw(0);
    } else {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [ready]);

  return (
    <nav
      aria-label="Menu utama"
      className={`${menuOpen ? 'open' : ''} ${scrolled ? 'sc' : ''}`.trim()}
    >
      <div className="br" aria-hidden="true">
        <canvas ref={canvasRef} id="treeCanvas" />
      </div>
      <b style={{ '--od': '1.9s' } as CSSProperties}>
        <svg className="lgo" viewBox="0 0 52 36" width="46" height="32" aria-hidden="true">
          <path d="M3 17C3 6 16 3 28 6 27 18 18 26 3 17Z" fill="#6D926A" />
          <path
            d="M4 17C12 16 18 12 23 8"
            stroke="#ECE5D3"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M49 12C49 3 38 1 28 4 29 14 37 21 49 12Z" fill="#B4C8AC" />
          <path
            d="M28 26C28 20 27 14 28 8"
            stroke="#ECE5D3"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        EcoGueTaps
      </b>
      <div className="l" id="menu">
        {NAV_LINKS.map((link, idx) => (
          <a
            key={link.href}
            href={link.href}
            className={activeSection === link.href ? 'act' : ''}
            style={
              {
                '--od': `${(0.35 + (NAV_LINKS.length - 1 - idx) * 0.14).toFixed(2)}s`,
              } as CSSProperties
            }
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>
      <a className="btn p" href="#misi" style={{ '--od': '.15s' } as CSSProperties}>
        Mulai sekarang
      </a>
      <button
        type="button"
        className="burger"
        aria-label="Buka menu"
        aria-expanded={menuOpen}
        aria-controls="menu"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
