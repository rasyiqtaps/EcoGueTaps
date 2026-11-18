import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { CAMPAIGNS } from '../data/ecoData';
import { getCampaignPercentages, type CampaignItem } from '../utils/ecoLogic';

const AMOUNTS = ['Rp10.000', 'Rp25.000', 'Rp50.000', 'Rp100.000'];

export function DonationAndFooter() {
  const [activeKey, setActiveKey] = useState<CampaignItem['key']>('reb');
  const [selectedAmount, setSelectedAmount] = useState('Rp25.000');
  const [donorName, setDonorName] = useState('');
  const [donationMsg, setDonationMsg] = useState('');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactResult, setContactResult] = useState('');

  const campaign = CAMPAIGNS[activeKey];
  const { fundPct, unitPct } = getCampaignPercentages(campaign);
  const isBurn = activeKey === 'kar';

  useEffect(() => {
    document.body.classList.toggle('burn', isBurn);
    return () => {
      document.body.classList.remove('burn');
    };
  }, [isBurn]);

  const embers = useMemo(() => {
    let seed = 8899;
    const next = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${(next() * 100).toFixed(2)}%`,
      delay: `${(next() * 5).toFixed(2)}s`,
      duration: `${(3 + next() * 4).toFixed(2)}s`,
    }));
  }, []);

  const rp = (n: number) => 'Rp' + Math.round(n).toLocaleString('id-ID');

  const handleDonationSubmit = (e: FormEvent) => {
    e.preventDefault();
    const who = donorName.trim() ? `, ${donorName.trim()}` : '';
    setDonationMsg(
      `Terima kasih${who}! Donasi ${selectedAmount} (${campaign.t}) adalah tampilan contoh, belum tersambung ke pembayaran.`
    );
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const n = contactName.trim();
    const em = contactEmail.trim();
    const m = contactMessage.trim();
    if (!n || !em || !m) {
      setContactResult('Semua kolom wajib diisi.');
      return;
    }
    const summary = `Nama: ${n}\nEmail: ${em}\nPesan: ${m}`;
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error('Clipboard tidak tersedia');
      }
      await navigator.clipboard.writeText(summary);
      setContactResult('Pesan berhasil disalin. Belum dikirim ke server.');
    } catch {
      setContactResult(
        'Fitur salin membutuhkan localhost/HTTPS dan izin clipboard. Pesan tidak dikirim.'
      );
    }
  };

  return (
    <>
      {/* 4. TANAH */}
      <section className={`zone ${isBurn ? 'burn' : ''}`} id="donasi">
        <div className="rock" style={{ width: 90, height: 56, left: '3%', top: 46 }} aria-hidden="true" />
        <div className="rock" style={{ width: 56, height: 36, right: '6%', top: 30 }} aria-hidden="true" />
        <div className="rock" style={{ width: 70, height: 44, left: '48%', bottom: 210 }} aria-hidden="true" />
        <div className="seed" style={{ left: '14%', top: 70 }} aria-hidden="true" />
        <div className="seed g" style={{ right: '20%', top: 90 }} aria-hidden="true" />
        <div className="seed" style={{ left: '70%', bottom: 260 }} aria-hidden="true" />
        <div className="seed g" style={{ left: '30%', bottom: 180 }} aria-hidden="true" />
        <div className="lab" style={{ background: 'rgba(0,0,0,.25)' }}>
          Tanah · penopang semua makhluk
        </div>

        <div className="wrap">
          <div className="chip">
            <h2>Dukung pemulihan alam</h2>
            <p>Pilih program, lihat targetnya, lalu ikut berdonasi.</p>
          </div>

          <div className="stage">
            <div className="fire" />
            <div className="fx" id="emb">
              {embers.map((em) => (
                <div
                  key={em.id}
                  className="emb"
                  style={{
                    left: em.left,
                    animationDelay: em.delay,
                    animationDuration: em.duration,
                  }}
                />
              ))}
            </div>
            <div className="tabs" role="group" aria-label="Program donasi">
              {(['reb', 'kar', 'alam'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  data-c={k}
                  aria-pressed={activeKey === k}
                  onClick={() => setActiveKey(k)}
                >
                  {CAMPAIGNS[k].label}
                </button>
              ))}
            </div>

            <div className="dn">
              <div>
                <h3 id="ct" style={{ fontSize: 30 }}>
                  {campaign.t}
                </h3>
                <p id="cd" style={{ marginTop: 8, maxWidth: '52ch' }}>
                  {campaign.d}
                </p>
                <div className="goal">
                  <b>Target dana</b>
                  <div className="bar">
                    <i id="b1" style={{ width: `${fundPct}%` }} />
                  </div>
                  <small id="s1">
                    {rp(campaign.c)} terkumpul dari {rp(campaign.g)} (contoh)
                  </small>
                </div>
                <div className="goal">
                  <b id="g2t">{campaign.n}</b>
                  <div className="bar">
                    <i id="b2" style={{ width: `${unitPct}%` }} />
                  </div>
                  <small id="s2">
                    {campaign.b} dari {campaign.a} {campaign.u}
                  </small>
                </div>
              </div>

              <form className="form" id="f" onSubmit={handleDonationSubmit}>
                <h3>Donasi sekarang</h3>
                <div className="amt" role="group" aria-label="Nominal">
                  {AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      aria-pressed={selectedAmount === amt}
                      onClick={() => setSelectedAmount(amt)}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
                <input
                  id="nm"
                  placeholder="Nama (boleh disamarkan)"
                  aria-label="Nama"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
                <button className="btn g" type="submit" style={{ width: '100%' }}>
                  Kirim donasi
                </button>
                <div id="msg" role="status">
                  {donationMsg}
                </div>
              </form>
            </div>
          </div>

          <div className="kon" id="kontak">
            <div className="kon__intro">
              <span className="eg-ui-eyebrow">KONTAK</span>
              <h2>Punya ide untuk bumi?</h2>
              <p>
                Kirim masukan atau ide kegiatan lingkungan. Formulir ini masih demo dan
                hanya menyalin pesanmu.
              </p>
            </div>
            <form
              className="kon__form"
              id="eg-contact-form"
              onSubmit={(e) => void handleContactSubmit(e)}
            >
              <div>
                <label htmlFor="eg-contact-name">Nama</label>
                <input
                  id="eg-contact-name"
                  maxLength={70}
                  name="name"
                  placeholder="Nama kamu"
                  required
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="eg-contact-email">Email</label>
                <input
                  id="eg-contact-email"
                  maxLength={120}
                  name="email"
                  placeholder="email@contoh.com"
                  required
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div className="full">
                <label htmlFor="eg-contact-message">Pesan</label>
                <textarea
                  id="eg-contact-message"
                  maxLength={800}
                  name="message"
                  placeholder="Tuliskan idemu di sini..."
                  required
                  rows={3}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>
              <div className="full kon__act">
                <button className="eg-btn eg-btn--green" type="submit">
                  Salin Pesan
                </button>
                <p
                  className="eg-ui-form-result"
                  id="eg-contact-result"
                  role="status"
                  aria-live="polite"
                >
                  {contactResult}
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="eg-footer">
        <svg
          className="eg-mountains"
          viewBox="0 0 1440 520"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 80 L70 150 L130 260 L330 190 L520 120 L560 150 L760 70 L860 130 L990 40 L1090 120 L1190 60 L1300 170 L1440 100 L1440 520 L0 520Z"
            fill="#9E8B52"
            opacity=".95"
          />
          <path
            d="M0 260 L160 130 L300 210 L430 300 L640 220 L820 150 L1010 330 L1180 230 L1330 130 L1440 250 L1440 520 L0 520Z"
            fill="#C9AC48"
            opacity=".92"
          />
          <path
            d="M0 300 L120 190 L230 260 L330 360 L520 290 L690 330 L860 270 L1020 380 L1160 330 L1300 300 L1440 360 L1440 520 L0 520Z"
            fill="#567954"
          />
          <path
            d="M0 400 L180 330 L310 390 L440 330 L620 400 L800 340 L1000 420 L1200 360 L1440 430 L1440 520 L0 520Z"
            fill="#415E3F"
          />
        </svg>
        <div className="eg-footer__body">
          <p>
            <strong>EcoGueTaps</strong> &mdash; Langkah kecil, bumi makin ceria.
          </p>
          <p>&copy; 2026 EcoGueTaps &middot; Pemrograman Web</p>
        </div>
      </footer>
    </>
  );
}
