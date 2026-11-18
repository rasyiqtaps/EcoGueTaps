import { useEffect, useRef, useState } from 'react';

interface IntroOverlayProps {
  onReady: () => void;
}

export function IntroOverlay({ onReady }: IntroOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
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
      setVisible(false);
      document.documentElement.classList.remove('lock');
      document.body.classList.add('ready');
      onReady();
      return;
    }

    document.documentElement.classList.add('lock');
    try {
      sessionStorage.setItem('eg', '1');
    } catch {
      // ignore storage errors
    }

    const end = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setFadingOut(true);
      document.documentElement.classList.remove('lock');
      document.body.classList.add('ready');
      onReady();
      window.setTimeout(() => setVisible(false), 1000);
    };

    const timer = window.setTimeout(end, 10200);

    const ic = canvasRef.current;
    if (!ic) {
      return () => window.clearTimeout(timer);
    }
    const ix = ic.getContext('2d');
    if (!ix) {
      return () => window.clearTimeout(timer);
    }

    const eo = (u: number) => 1 - Math.pow(1 - u, 3);
    const i0 = performance.now();
    let IW = window.innerWidth;
    let IH = window.innerHeight;

    const ifit = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      IW = window.innerWidth;
      IH = window.innerHeight;
      ic.width = IW * d;
      ic.height = IH * d;
      ix.setTransform(d, 0, 0, d, 0, 0);
    };
    ifit();

    let sd = 12345;
    const rn = () => {
      sd = (sd * 16807) % 2147483647;
      return (sd - 1) / 2147483646;
    };
    const rg = (a: number, b: number) => a + rn() * (b - a);
    const LV = 15;
    const TH = 185;
    const TW = 83;
    const BR: Array<{
      y: number;
      s: number;
      len: number;
      dr: number;
      dl: number;
      tw: Array<{ p: number; tl: number; sd: number; nd: number[] }>;
    }> = [];

    for (let i = 0; i < LV; i++) {
      const t = i / (LV - 1);
      const y = -13 - t * (TH - 20);
      const bw = TW * Math.pow(1 - t, 0.85) + 5;
      for (const s of [-1, 1]) {
        const b = {
          y,
          s,
          len: bw * rg(0.83, 1.13),
          dr: rg(0.15, 0.29),
          dl: 0.08 + t * 0.84,
          tw: [] as Array<{ p: number; tl: number; sd: number; nd: number[] }>,
        };
        for (let j = 0; j < 8; j++) {
          const tl = rg(7, 17) * (1 - t * 0.4);
          const sdr = rn() > 0.5 ? 1 : -1;
          const nd: number[] = [];
          for (let n = 0; n < 5; n++) nd.push(rg(4, 8));
          b.tw.push({ p: (j + 1) / 9, tl, sd: sdr, nd });
        }
        BR.push(b);
      }
    }

    const itree = (t: number) => {
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
    };

    let rafId = 0;
    const iloop = (t: number) => {
      if (doneRef.current) return;
      itree(t);
      if (t - i0 < 7400) {
        rafId = requestAnimationFrame(iloop);
      }
    };
    rafId = requestAnimationFrame(iloop);

    const onResize = () => {
      ifit();
      itree(performance.now());
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [onReady]);

  const handleSkip = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFadingOut(true);
    document.documentElement.classList.remove('lock');
    document.body.classList.add('ready');
    onReady();
    window.setTimeout(() => setVisible(false), 1000);
  };

  if (!visible) return null;

  return (
    <div id="intro" className={fadingOut ? 'out' : ''}>
      <div className="isky" />
      <canvas ref={canvasRef} id="introCanvas" className="iscene" aria-hidden="true" />
      <button id="skip" className="btn y" type="button" onClick={handleSkip}>
        Lewati intro
      </button>
    </div>
  );
}
