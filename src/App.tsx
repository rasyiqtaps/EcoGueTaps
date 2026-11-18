import { useCallback, useEffect, useRef, useState } from 'react';
import { DonationAndFooter } from './components/DonationAndFooter';
import { HeroAndSky } from './components/HeroAndSky';
import { IntroOverlay } from './components/IntroOverlay';
import { DaratanDivider, LandLibraryAbout } from './components/LandLibraryAbout';
import { Navbar } from './components/Navbar';
import { QuestsAndLeaderboard } from './components/QuestsAndLeaderboard';

const NAV_TARGETS = [
  '#top',
  '#cara',
  '#info',
  '#misi',
  '#peringkat',
  '#belajar',
  '#tentang',
  '#donasi',
  '#kontak',
];

const LAYER_DOTS = [
  { href: '#top', label: 'Ozon', aria: 'Lapisan ozon' },
  { href: '#info', label: 'Langit', aria: 'Langit' },
  { href: '#misi', label: 'Daratan', aria: 'Daratan' },
  { href: '#donasi', label: 'Tanah', aria: 'Tanah' },
];

export default function App() {
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('#top');
  const [activeDot, setActiveDot] = useState('#top');
  const [toastMsg, setToastMsg] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string, ms = 2800) => {
    setToastMsg(msg);
    setToastShow(true);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastShow(false);
    }, ms);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Scrollspy & Parallax
  useEffect(() => {
    let ticking = false;
    const pickActive = (selectors: string[], k: number) => {
      let cur = selectors[0];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.getBoundingClientRect().top < window.innerHeight * k) {
          cur = sel;
        }
      }
      return cur;
    };

    const onScroll = () => {
      if (window.scrollY < 2600) {
        const sy = String(window.scrollY);
        const topEl = document.getElementById('top');
        const infoEl = document.getElementById('info');
        if (topEl) topEl.style.setProperty('--sy', sy);
        if (infoEl) infoEl.style.setProperty('--sy', sy);
      }
      setScrolled(window.scrollY > 30);
      setActiveNav(pickActive(NAV_TARGETS, 0.35));
      setActiveDot(
        pickActive(
          LAYER_DOTS.map((d) => d.href),
          0.5
        )
      );
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll Reveal Observer
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll('.card,.m,.pf,.chip,.lv,.goal,.mem,.tbar')
    );
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
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
    els.forEach((el) => {
      el.classList.add('rv');
      const idx = el.parentElement
        ? Array.from(el.parentElement.children).indexOf(el)
        : 0;
      (el as HTMLElement).style.setProperty('--d', `${(idx % 4) * 0.1}s`);
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Falling leaves click/tap burst effect
  useEffect(() => {
    if (!document.body.animate) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;

    const COLORS = [
      '#5FD088',
      '#44B46E',
      '#8CE082',
      '#B5F0A0',
      '#E8B838',
      '#FFD75A',
      '#E89642',
    ];
    const MAX_LEAVES = 60;

    const layer = document.createElement('div');
    layer.className = 'eg-leaf-layer';
    layer.setAttribute('aria-hidden', 'true');
    const pakaiPopover = typeof layer.showPopover === 'function';
    if (pakaiPopover) {
      layer.setAttribute('popover', 'manual');
    }
    document.body.appendChild(layer);

    const naikkanLayer = () => {
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
    };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const leafSvg = (color: string) =>
      `<svg viewBox="0 0 20 20"><path d="M2 18 C1 8 8 1 19 1 C19 12 12 19 2 18Z" fill="${color}"/><path d="M3 17 C8 12 12 8 16 4" stroke="rgba(0,0,0,.25)" stroke-width="1" fill="none" stroke-linecap="round"/></svg>`;

    const burst = (x: number, y: number) => {
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
        const x0 = x - size / 2;
        const y0 = y - size / 2;

        const anim = el.animate(
          [
            {
              transform: `translate(${x0}px,${y0}px) rotate(0deg) scale(.3)`,
              opacity: 0,
            },
            {
              transform: `translate(${x0 + spread * 0.35}px,${y0 - pop}px) rotate(${spin * 0.2}deg) scale(1)`,
              opacity: 1,
              offset: 0.14,
            },
            {
              transform: `translate(${x0 + spread * 0.6 + sway}px,${y0 + fall * 0.45}px) rotate(${spin * 0.55}deg) scale(1)`,
              opacity: 1,
              offset: 0.55,
            },
            {
              transform: `translate(${x0 + spread - sway * 0.6}px,${y0 + fall}px) rotate(${spin}deg) scale(.9)`,
              opacity: 0,
            },
          ],
          {
            duration: dur,
            easing: 'cubic-bezier(.35,.1,.55,.95)',
            fill: 'forwards',
          }
        );
        anim.onfinish = () => el.remove();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== undefined && e.button > 0) return;
      burst(e.clientX, e.clientY);
    };

    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      layer.remove();
    };
  }, []);

  const handleReady = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <>
      <IntroOverlay onReady={handleReady} />
      <div id="vig" />
      <div className="dots" aria-label="Lapisan bumi">
        {LAYER_DOTS.map((d) => (
          <a
            key={d.href}
            href={d.href}
            data-l={d.label}
            aria-label={d.aria}
            className={activeDot === d.href ? 'act' : ''}
          />
        ))}
      </div>
      <Navbar activeSection={activeNav} scrolled={scrolled} ready={ready} />

      <div id="pg">
        <div className="eg-sky-zone">
          <HeroAndSky />
          <QuestsAndLeaderboard onToast={showToast} />
          <DaratanDivider />
        </div>
        <LandLibraryAbout />
        <DonationAndFooter />
      </div>

      <div
        className={`eg-toast ${toastShow ? 'is-show' : ''}`}
        id="eg-toast"
        role="status"
        aria-live="polite"
      >
        {toastMsg}
      </div>
    </>
  );
}
