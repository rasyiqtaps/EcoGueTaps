import { useMemo, useRef, useState } from 'react';
import { ARTICLES } from '../data/ecoData';
import { filterArticles, type ArticleItem } from '../utils/ecoLogic';

export function DaratanDivider() {
  return (
    <div className="land" aria-hidden="true">
      <svg viewBox="0 0 1440 130" preserveAspectRatio="none">
        <path
          d="M0 60C260 8 520 14 760 48S1200 66 1440 22V130H0Z"
          fill="#C5B3C9"
          opacity=".92"
        />
        <path
          d="M0 88C300 44 560 52 820 78S1230 96 1440 62V130H0Z"
          fill="#A6BA9E"
        />
      </svg>
      <div className="scene">
        <span>🌳</span>
        <span>🌿</span>
        <span>🚲</span>
        <span>🌲</span>
        <span>🧑‍🌾</span>
        <span>🌱</span>
        <span>🌳</span>
        <span>♻️</span>
        <span>🌻</span>
        <span>🌲</span>
        <span>🌷</span>
        <span>🚶</span>
        <span>🌳</span>
        <span>🌿</span>
      </div>
    </div>
  );
}

export function LandLibraryAbout() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  const articleDialogRef = useRef<HTMLDialogElement>(null);

  const categories = useMemo(
    () => ['Semua', ...Array.from(new Set(ARTICLES.map((a) => a.category)))],
    []
  );

  const matchedArticles = useMemo(
    () => filterArticles(ARTICLES, selectedCategory, searchTerm),
    [selectedCategory, searchTerm]
  );

  const openArticle = (article: ArticleItem) => {
    setActiveArticle(article);
    const dlg = articleDialogRef.current;
    if (dlg) {
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    }
  };

  return (
    <>
      {/* Seamless Green Land Zone: from below Daratan through Eco Library & Tentang Kami */}
      <div className="eg-green-land">
        {/* Eco Library */}
        <section className="eg-section eg-section--tight" id="belajar">
          <div className="wrap">
            <div className="lib-head eg-ui-glass">
              <div>
                <span className="eg-ui-eyebrow">ECO LIBRARY</span>
                <h2>
                  Yuk, belajar <span>jaga bumi!</span>
                </h2>
                <p>Cerita singkat tentang lingkungan untuk Eco Heroes.</p>
              </div>
              <div>
                <label className="sr" htmlFor="eg-library-search">
                  Cari cerita lingkungan
                </label>
                <input
                  id="eg-library-search"
                  type="search"
                  placeholder="Cari: sampah, air, pohon..."
                  autoComplete="off"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div
                  className="eg-ui-filters"
                  id="eg-library-filters"
                  aria-label="Filter kategori artikel"
                >
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`eg-ui-filter ${
                        category === selectedCategory ? 'is-active' : ''
                      }`}
                      aria-pressed={category === selectedCategory}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="eg-ui-count" id="eg-library-count" aria-live="polite">
              {matchedArticles.length} artikel ditemukan
            </p>
            <div className="eg-ui-article-grid" id="eg-library-cards">
              {matchedArticles.map((a) => (
                <article key={a.id} className="eg-ui-article eg-ui-glass">
                  <div
                    className={`eg-ui-article__art eg-tone-${a.tone}`}
                    aria-hidden="true"
                  >
                    <span>{a.icon}</span>
                  </div>
                  <span className="eg-ui-article__category">{a.category}</span>
                  <h3>{a.title}</h3>
                  <p className="eg-ui-article__summary">{a.summary}</p>
                  <div className="eg-ui-article__foot">
                    <span>{a.minutes} menit baca</span>
                    <button
                      type="button"
                      className="eg-ui-open"
                      onClick={() => openArticle(a)}
                    >
                      Baca Cerita &rarr;
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p
              className="eg-ui-empty"
              id="eg-library-empty"
              hidden={matchedArticles.length !== 0}
            >
              Belum ada artikel yang cocok. Coba kata kunci atau kategori lain.
            </p>
          </div>
        </section>

        {/* Tentang Kami */}
        <section className="eg-section" id="tentang-sec">
          <div className="wrap">
            <div id="tentang" style={{ marginTop: 22 }}>
              <div className="chip">
                <h2>Tentang kami</h2>
                <p>Kenapa EcoGueTaps ada dan siapa yang membuatnya.</p>
              </div>
              <div className="card">
                <h3>Visi kami</h3>
                <p style={{ marginTop: 8 }}>
                  Setiap pelajar bisa menjadi penjaga bumi lewat kebiasaan kecil yang
                  konsisten. EcoGueTaps mengubah niat baik menjadi misi harian yang seru,
                  terukur, dan bisa dibuktikan.
                </p>
              </div>
              <div className="grid vals">
                <div className="card val">
                  <b>📚</b>
                  <h3>Belajar</h3>
                  <p>Cerita dan fakta singkat tentang sampah, energi, dan alam.</p>
                </div>
                <div className="card val">
                  <b>📸</b>
                  <h3>Beraksi</h3>
                  <p>Kerjakan misi, unggah foto bukti, lalu kumpulkan XP.</p>
                </div>
                <div className="card val">
                  <b>🌍</b>
                  <h3>Jaga bumi</h3>
                  <p>Dampak kecil setiap hari, dan dukungan nyata lewat donasi.</p>
                </div>
              </div>
              <div className="team">
                <div className="mem">
                  <span className="av" style={{ background: '#7d6788' }}>
                    R
                  </span>
                  <div>
                    <h3>Rasyiq</h3>
                    <small>Home, About, Navbar, Footer</small>
                  </div>
                </div>
                <div className="mem">
                  <span className="av" style={{ background: '#527651' }}>
                    R
                  </span>
                  <div>
                    <h3>Rofiq</h3>
                    <small>Eco Library, Contact, XP, Leaderboard</small>
                  </div>
                </div>
                <div className="mem">
                  <span className="av" style={{ background: '#e8a830' }}>
                    A
                  </span>
                  <div>
                    <h3>Akmal</h3>
                    <small>Daily Quest, Foto bukti, My Journey</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Pop-up Artikel */}
      <dialog
        ref={articleDialogRef}
        className="eg-modal eg-ui-article-modal"
        id="eg-article-dialog"
        aria-labelledby="eg-article-title"
        onClick={(e) => {
          if (e.target === articleDialogRef.current) articleDialogRef.current?.close();
        }}
      >
        <form className="eg-modal__close-wrap" method="dialog">
          <button className="eg-modal__close" aria-label="Tutup artikel">
            &times;
          </button>
        </form>
        <div className="eg-modal__body" id="eg-article-body">
          {activeArticle && (
            <>
              <span className="eg-ui-article__category">{activeArticle.category}</span>
              <h3 id="eg-article-title">{activeArticle.title}</h3>
              <p className="eg-ui-reading-time">{activeArticle.minutes} menit baca</p>
              {activeArticle.paragraphs.map((p, idx) => (
                <p key={idx} className="eg-ui-reading-paragraph">
                  {p}
                </p>
              ))}
              <p className="eg-ui-article-note">
                Konten edukasi umum. Pendampingan orang dewasa disarankan untuk aktivitas
                anak.
              </p>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
