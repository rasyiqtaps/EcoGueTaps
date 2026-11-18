import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react';

type SkyTime = 'day' | 'dusk' | 'night';

export function HeroAndSky() {
  const [skyTime, setSkyTime] = useState<SkyTime>('day');
  const mascotRef = useRef<HTMLDivElement>(null);
  const eyeLeftRef = useRef<SVGEllipseElement>(null);
  const eyeRightRef = useRef<SVGEllipseElement>(null);

  const stars = useMemo(() => {
    let seed = 4242;
    const next = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    return Array.from({ length: 70 }, (_, i) => {
      const size = 1 + next() * 2.5;
      return {
        id: i,
        left: `${(next() * 100).toFixed(2)}%`,
        top: `${(next() * 85).toFixed(2)}%`,
        width: `${size.toFixed(2)}px`,
        height: `${size.toFixed(2)}px`,
        delay: `${(next() * 3).toFixed(2)}s`,
      };
    });
  }, []);

  const glints = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${5 + i * 10}%`,
        top: `${25 + ((i * 37) % 55)}%`,
        delay: `${(i * 0.35).toFixed(2)}s`,
      })),
    []
  );

  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm) return;
    const onMove = (e: PointerEvent) => {
      const mas = mascotRef.current;
      if (!mas) return;
      const m = mas.getBoundingClientRect();
      const dx = e.clientX - (m.left + m.width / 2);
      const dy = e.clientY - (m.top + m.height / 2);
      const k = Math.min(1, Math.hypot(dx, dy) / 400) * 5;
      const a = Math.atan2(dy, dx);
      const tx = `${Math.cos(a) * k}px ${Math.sin(a) * k}px`;
      if (eyeLeftRef.current) eyeLeftRef.current.style.translate = tx;
      if (eyeRightRef.current) eyeRightRef.current.style.translate = tx;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const handleMascotClick = (e: MouseEvent<HTMLDivElement>) => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  };

  return (
    <>
      {/* 1. LAPISAN OZON */}
      <section className="zone" id="top">
        <div className="sg" aria-hidden="true">
          {stars.map((s) => (
            <div
              key={s.id}
              className="star"
              style={{
                left: s.left,
                top: s.top,
                width: s.width,
                height: s.height,
                animationDelay: s.delay,
              }}
            />
          ))}
        </div>
        <div className="lab">Lapisan ozon · sehat</div>
        <div className="met" style={{ left: '80%', top: '8%' }} aria-hidden="true" />
        <div className="met" style={{ left: '55%', top: '2%', animationDelay: '2.5s' }} aria-hidden="true" />
        <div className="met" style={{ left: '95%', top: '25%', animationDelay: '4s' }} aria-hidden="true" />

        <div className="wrap hero">
          <div>
            <p className="eyebrow">Petualangan Eco Hero</p>
            <h1>
              Langkah Kecil,
              <br />
              <span>Bumi Makin Ceria!</span>
            </h1>
            <p>
              Ayo belajar menjaga lingkungan lewat misi seru, kumpulkan XP, dan jadilah
              pahlawan bumi!
            </p>
            <div className="hero-actions">
              <a className="btn g" href="#misi">
                Mulai Petualangan &rarr;
              </a>
              <a className="btn" style={{ background: '#F6F1E4', color: 'var(--purple)' }} href="#cara">
                Cara Bermain
              </a>
            </div>
          </div>

          <div
            ref={mascotRef}
            className="mas2"
            role="img"
            aria-label="Maskot EcoGueTaps"
            onClick={handleMascotClick}
          >
            <svg viewBox="0 0 340 290" style={{ overflow: 'visible', width: '100%' }}>
              <circle cx="60" cy="40" r="32" fill="#E2C258" opacity=".4" />
              <circle cx="255" cy="92" r="96" fill="#F6F1E4" opacity=".75" />
              <circle cx="255" cy="92" r="72" fill="#E2C258" />
              <circle cx="232" cy="215" r="82" fill="#D2DEC9" />
              <circle cx="268" cy="190" r="22" fill="#E5DCE8" />
              <ellipse cx="256" cy="58" rx="30" ry="52" transform="rotate(18 256 58)" fill="#628660" />
              <path d="M290 82l12 14-12 14-12-14z" fill="#3E5B3D" />
              <ellipse cx="62" cy="132" rx="36" ry="60" transform="rotate(-22 62 132)" fill="#92AA8B" />
              <ellipse cx="78" cy="168" rx="26" ry="12" fill="#527651" />
              <ellipse cx="150" cy="215" rx="92" ry="74" fill="#C5B3C9" />
              <circle cx="150" cy="130" r="96" fill="#C8D8BF" stroke="#A0B598" strokeWidth="14" />
              <ellipse ref={eyeLeftRef} className="eye" cx="116" cy="122" rx="8" ry="11" fill="#243020" />
              <ellipse ref={eyeRightRef} className="eye" cx="178" cy="122" rx="8" ry="11" fill="#243020" />
              <ellipse cx="100" cy="146" rx="15" ry="9" fill="#D8B4BE" />
              <ellipse cx="196" cy="146" rx="15" ry="9" fill="#D8B4BE" />
              <path
                d="M140 156q8 10 16 0"
                stroke="#243020"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <rect x="140" y="214" width="20" height="30" rx="10" fill="#ECE5D3" />
              <ellipse cx="112" cy="270" rx="36" ry="11" fill="#527651" />
              <ellipse cx="190" cy="266" rx="36" ry="11" fill="#527651" />
              <path
                d="M20 112Q20 128 36 128Q20 128 20 144Q20 128 4 128Q20 128 20 112Z"
                fill="#7d6788"
              />
              <path
                d="M318 236Q318 250 332 250Q318 250 318 264Q318 250 304 250Q318 250 318 236Z"
                fill="#E2C258"
              />
            </svg>
          </div>
        </div>

        <div className="wrap river" aria-hidden="true" style={{ marginTop: 20 }}>
          <svg className="w w1" viewBox="0 0 1200 80" preserveAspectRatio="none">
            <path d="M0 40Q75 8 150 40T300 40T450 40T600 40T750 40T900 40T1050 40T1200 40V80H0Z" />
          </svg>
          <svg className="w w2" viewBox="0 0 1200 80" preserveAspectRatio="none">
            <path d="M0 40Q75 8 150 40T300 40T450 40T600 40T750 40T900 40T1050 40T1200 40V80H0Z" />
          </svg>
          <svg className="w w3" viewBox="0 0 1200 80" preserveAspectRatio="none">
            <path d="M0 40Q75 8 150 40T300 40T450 40T600 40T750 40T900 40T1050 40T1200 40V80H0Z" />
          </svg>
          <span className="bt" style={{ top: '20%' }}>
            🍂
          </span>
          <span className="bt" style={{ top: '46%', animationDelay: '-7s' }}>
            🍃
          </span>
          {glints.map((g) => (
            <i
              key={g.id}
              className="gl"
              style={{ left: g.left, top: g.top, animationDelay: g.delay }}
            />
          ))}
        </div>

        <div className="wrap" id="cara" style={{ marginTop: 20 }}>
          <div className="grid">
            <div className="card">
              <h3>Tentang website</h3>
              <p style={{ marginTop: 8 }}>
                EcoGueTaps mengajak pelajar menjaga lingkungan lewat misi harian. Kamu
                mengerjakan misi, mengunggah foto sebagai bukti, lalu mendapat XP dan naik
                peringkat.
              </p>
            </div>
            <div className="card">
              <h3>Latar belakang</h3>
              <p style={{ marginTop: 8 }}>
                Sampah plastik, air yang terbuang, dan hutan yang terbakar sering terasa
                jauh dari keseharian. Kami mengubahnya menjadi tindakan kecil yang bisa
                dilakukan dari rumah atau sekolah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LANGIT */}
      <section className="zone" id="info" data-t={skyTime}>
        <div className="sk d" />
        <div className="sk s" />
        <div className="sk n">
          <div className="au a1" />
          <div className="au a2" />
        </div>
        <div className="sun" />
        <div className="cl" style={{ top: 230, animationDelay: '-10s' }} />
        <div className="cl rain" style={{ top: 420, animationDelay: '-40s' }}>
          <i style={{ left: 30 }} />
          <i style={{ left: 70, animationDelay: '.3s' }} />
          <i style={{ left: 110, animationDelay: '.5s' }} />
        </div>
        <div className="fly" style={{ top: 300, animationDelay: '-6s' }}>
          🐦
        </div>
        <div className="fly" style={{ top: 340, animationDelay: '-3s', fontSize: 20 }}>
          🐦
        </div>
        <div className="fly plane" style={{ top: 170, animationDelay: '-14s' }}>
          ✈️
        </div>
        <div className="lab">Langit · berubah mengikuti waktu</div>

        <div className="wrap">
          <div className="tbar" role="group" aria-label="Waktu langit">
            {(
              [
                { key: 'day', label: 'Siang' },
                { key: 'dusk', label: 'Senja' },
                { key: 'night', label: 'Malam' },
              ] as Array<{ key: SkyTime; label: string }>
            ).map((btn) => (
              <button
                key={btn.key}
                type="button"
                data-t={btn.key}
                aria-pressed={skyTime === btn.key}
                onClick={() => setSkyTime(btn.key)}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="chip">
            <h2>Bukti dari peserta</h2>
            <p>Contoh laporan misi</p>
          </div>
          <div className="proof">
            <div className="pf">
              <div style={{ background: '#A6BA9E' } as CSSProperties}>🧴</div>
              <p>
                <b>BintangHijau · Tumbler Hero</b>
                Seminggu bawa botol sendiri.
              </p>
            </div>
            <div className="pf">
              <div style={{ background: '#C5B3C9' } as CSSProperties}>🚰</div>
              <p>
                <b>DaunCeria · Water Guardian</b>
                Menutup keran saat menyikat gigi.
              </p>
            </div>
            <div className="pf">
              <div style={{ background: '#E2C258' } as CSSProperties}>♻️</div>
              <p>
                <b>EcoKecil · Recycle Ranger</b>
                Memilah sampah organik dan anorganik.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
