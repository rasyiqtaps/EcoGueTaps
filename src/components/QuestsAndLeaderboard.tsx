import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  INITIAL_ME,
  INITIAL_QUEST_IDS,
  LEADERBOARD_OTHERS,
  QUEST_POOL,
  REROLL_MAX,
} from '../data/ecoData';
import {
  applyQuestRewards,
  buildLeaderboard,
  pickRerollCandidate,
  type QuestItem,
  type QuestStatus,
  type UserProfile,
} from '../utils/ecoLogic';
import {
  getAllSubmissions,
  reviewSubmission,
  submitQuestProof,
  type SubmissionRow,
} from '../utils/questStore';

interface QuestsAndLeaderboardProps {
  onToast: (msg: string, ms?: number) => void;
}

const STATUS_LABEL: Record<QuestStatus, string> = {
  belum: 'Belum dikerjakan',
  terkirim: 'Menunggu verifikasi',
  disetujui: 'Disetujui',
  ditolak: 'Ditolak, dapat kirim ulang',
};

const TONES = ['green', 'purple', 'yellow'] as const;
const ADMIN_LABELS: Record<SubmissionRow['status'], string> = {
  terkirim: 'Menunggu',
  disetujui: 'Disetujui',
  ditolak: 'Ditolak',
};

export function QuestsAndLeaderboard({ onToast }: QuestsAndLeaderboardProps) {
  const questMap = useMemo(
    () => Object.fromEntries(QUEST_POOL.map((q) => [q.id, q])),
    []
  );

  const [activeIds, setActiveIds] = useState<string[]>(INITIAL_QUEST_IDS);
  const [freshSlot, setFreshSlot] = useState<number | null>(null);
  const [rerollSisa, setRerollSisa] = useState(REROLL_MAX);
  const [statuses, setStatuses] = useState<Record<string, QuestStatus>>({});
  const [submittedMap, setSubmittedMap] = useState<Record<string, boolean>>({});
  const [me, setMe] = useState<UserProfile>(INITIAL_ME);
  const [bumpMe, setBumpMe] = useState(false);

  // Quest Modal state
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const questDialogRef = useRef<HTMLDialogElement>(null);

  // Admin Demo state
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminFilter, setAdminFilter] = useState<'semua' | SubmissionRow['status']>('semua');
  const [reviewRow, setReviewRow] = useState<SubmissionRow | null>(null);
  const [reviewProofUrl, setReviewProofUrl] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewBusy, setReviewBusy] = useState(false);
  const adminDialogRef = useRef<HTMLDialogElement>(null);

  const fmt = useMemo(() => new Intl.NumberFormat('id-ID'), []);

  const syncFromStore = useCallback(
    async (flash = false) => {
      try {
        const all = await getAllSubmissions();
        const sorted = [...all].sort((a, b) =>
          String(b.submittedAt).localeCompare(String(a.submittedAt))
        );
        setSubmissions(sorted);
        setAdminError(null);

        const nextStatuses: Record<string, QuestStatus> = {};
        const nextSubmitted: Record<string, boolean> = {};
        const approvedIds: string[] = [];

        all
          .filter((r) => r.userName === 'Kamu')
          .forEach((r) => {
            if (!questMap[r.questId]) return;
            nextStatuses[r.questId] = r.status;
            if (r.status === 'terkirim' || r.status === 'disetujui') {
              nextSubmitted[r.questId] = true;
            }
            if (r.status === 'disetujui') {
              approvedIds.push(r.questId);
            }
          });

        setStatuses(nextStatuses);
        setSubmittedMap(nextSubmitted);
        setMe((prev) => {
          const updated = applyQuestRewards(INITIAL_ME, approvedIds, questMap);
          if (flash && updated.xp > prev.xp) {
            setBumpMe(true);
            window.setTimeout(() => setBumpMe(false), 950);
          }
          return updated;
        });
      } catch {
        setAdminError(
          'Tidak bisa membaca data demo. Jalankan website melalui localhost dan coba lagi.'
        );
      }
    },
    [questMap]
  );

  useEffect(() => {
    void syncFromStore(false);
    const onFocus = () => void syncFromStore(false);
    const onVis = () => {
      if (!document.hidden) void syncFromStore(false);
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [syncFromStore]);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoPreviewUrl]);

  useEffect(() => {
    return () => {
      if (reviewProofUrl) URL.revokeObjectURL(reviewProofUrl);
    };
  }, [reviewProofUrl]);

  const statusOf = (id: string): QuestStatus => statuses[id] || 'belum';

  const handleReroll = (id: string) => {
    const slot = activeIds.indexOf(id);
    if (slot < 0) return;
    if (submittedMap[id]) {
      onToast('Misi yang sedang ditinjau atau sudah disetujui tidak bisa diganti.');
      return;
    }
    if (rerollSisa <= 0) {
      onToast('Jatah ganti misi hari ini sudah habis.');
      return;
    }
    const candidate = pickRerollCandidate(QUEST_POOL, activeIds, submittedMap);
    if (!candidate) {
      onToast('Belum ada misi lain yang tersedia.');
      return;
    }
    const oldQuest = questMap[id];
    const nextIds = [...activeIds];
    nextIds[slot] = candidate.id;
    setActiveIds(nextIds);
    setRerollSisa((r) => r - 1);
    setFreshSlot(slot);
    window.setTimeout(() => setFreshSlot(null), 500);
    onToast(`Misi diganti: ${oldQuest.judul} → ${candidate.judul}`);
  };

  const openQuestModal = (id: string) => {
    setSelectedQuestId(id);
    setPhotoFile(null);
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
      setPhotoPreviewUrl(null);
    }
    setNote('');
    const dlg = questDialogRef.current;
    if (dlg) {
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setPhotoFile(f);
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmitQuest = async (q: QuestItem) => {
    if (['terkirim', 'disetujui'].includes(statusOf(q.id)) || sending) return;
    if (!photoFile) {
      onToast('Pilih foto bukti kegiatan terlebih dahulu.');
      return;
    }
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(photoFile.type) ||
      photoFile.size === 0 ||
      photoFile.size > 3 * 1024 * 1024
    ) {
      onToast('Gunakan JPG/PNG/WebP maksimal 3 MB.');
      return;
    }

    setSending(true);
    try {
      await submitQuestProof(q, photoFile, note);
      await syncFromStore(false);
      onToast('Bukti dikirim untuk ditinjau. XP diberikan setelah disetujui.');
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Bukti gagal disimpan.');
    } finally {
      setSending(false);
    }
  };

  const openReviewModal = (row: SubmissionRow) => {
    setReviewRow(row);
    setRejectReason(row.reason || '');
    setReviewFeedback('');
    if (reviewProofUrl) URL.revokeObjectURL(reviewProofUrl);
    if (row.proof instanceof Blob && row.proof.size) {
      setReviewProofUrl(URL.createObjectURL(row.proof));
    } else {
      setReviewProofUrl(null);
    }
    const dlg = adminDialogRef.current;
    if (dlg) {
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    }
  };

  const handleReview = async (approve: boolean) => {
    if (!reviewRow || reviewRow.status !== 'terkirim' || reviewBusy) return;
    setReviewBusy(true);
    try {
      await reviewSubmission(reviewRow.id, approve, rejectReason);
      setReviewFeedback(
        approve
          ? 'Disetujui. XP akan diperbarui pada halaman Peringkat.'
          : 'Ditolak. Pengguna dapat mengirim ulang bukti.'
      );
      await syncFromStore(approve);
      adminDialogRef.current?.close();
    } catch (err) {
      setReviewFeedback(err instanceof Error ? err.message : 'Verifikasi gagal.');
    } finally {
      setReviewBusy(false);
    }
  };

  const leaderboardRows = useMemo(
    () => buildLeaderboard(LEADERBOARD_OTHERS, me),
    [me]
  );
  const levelPct = Math.min(100, Math.round((me.xp / me.levelXp) * 100));

  const pendingCount = submissions.filter((r) => r.status === 'terkirim').length;
  const approvedCount = submissions.filter((r) => r.status === 'disetujui').length;
  const rejectedCount = submissions.filter((r) => r.status === 'ditolak').length;
  const visibleSubmissions = submissions.filter(
    (r) => adminFilter === 'semua' || r.status === adminFilter
  );

  const selectedQuest = selectedQuestId ? questMap[selectedQuestId] : null;
  const selectedSent = selectedQuest
    ? ['terkirim', 'disetujui'].includes(statusOf(selectedQuest.id))
    : false;

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso));
    } catch {
      return '-';
    }
  };

  return (
    <>
      {/* 3. DAILY QUEST */}
      <section className="eg-section eg-section--quest" id="misi">
        <div className="eg-hill eg-hill--lilac" aria-hidden="true" />
        <div className="eg-hill eg-hill--gold-r" aria-hidden="true" />
        <div className="eg-hill eg-hill--gold-l" aria-hidden="true" />
        <div className="wrap">
          <h2 className="eg-title">Misi seru hari ini!</h2>
          <p className="eg-sub">
            Pilih tantangan yang bisa kamu lakukan dari rumah atau sekolah.
          </p>
          <p
            className={`eg-reroll-info ${rerollSisa <= 0 ? 'is-empty' : ''}`}
            id="eg-reroll-info"
          >
            &#8635; Ganti misi: <strong>{rerollSisa}x</strong> tersisa hari ini
          </p>
          <div className="eg-grid eg-grid--3" id="eg-quest-list">
            {activeIds.map((id, idx) => {
              const q = questMap[id];
              if (!q) return null;
              const st = statusOf(q.id);
              const sent = st === 'terkirim' || st === 'disetujui';
              const off = sent || rerollSisa <= 0;
              const title = sent
                ? 'Misi yang sudah dikirim tidak bisa diganti'
                : rerollSisa <= 0
                  ? 'Jatah ganti misi hari ini habis'
                  : 'Ganti dengan misi lain';
              return (
                <article
                  key={q.id}
                  className={`eg-card eg-quest eg-tone-${TONES[idx % TONES.length]} ${
                    freshSlot === idx ? 'is-fresh' : ''
                  }`}
                  data-quest-id={q.id}
                >
                  <div className="eg-quest__top">
                    <span className="eg-num">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="eg-tag">{q.tag}</span>
                  </div>
                  <h3>{q.judul}</h3>
                  <p>{q.deskripsi}</p>
                  <div className="eg-quest__meta">
                    <span className={`eg-status eg-status--${st}`}>
                      <i aria-hidden="true" />
                      {STATUS_LABEL[st]}
                    </span>
                    <button
                      type="button"
                      className="eg-reroll"
                      title={title}
                      disabled={off}
                      onClick={() => handleReroll(q.id)}
                    >
                      <span aria-hidden="true">&#8635;</span> Ganti Misi
                    </button>
                  </div>
                  <div className="eg-quest__foot">
                    <span className="eg-chips">
                      <span className="eg-chip">+{q.xp} XP</span>
                      <span className="eg-chip eg-chip--poin">+{q.poin} Poin</span>
                    </span>
                    <button
                      type="button"
                      className="eg-link"
                      onClick={() => openQuestModal(q.id)}
                    >
                      Lihat Misi <span aria-hidden="true">&rarr;</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section className="eg-section" id="peringkat">
        <div className="wrap">
          <h2 className="eg-title">Jadi Pahlawan Bumi!</h2>
          <p className="eg-sub">
            Belajar, beraksi, dan lihat progres petualanganmu.
          </p>
          <div className="eg-board-grid">
            <div className="eg-card eg-board">
              <div className="eg-board__head">
                <span className="eg-board__icon" aria-hidden="true">
                  &#127942;
                </span>
                <div>
                  <h3>Top Eco Heroes</h3>
                  <p>Peringkat minggu ini (contoh)</p>
                </div>
              </div>
              <div className="eg-board__cols" aria-hidden="true">
                <span>#</span>
                <span>Pahlawan</span>
                <span>XP</span>
                <span>Poin</span>
              </div>
              <ol className="eg-board__list" id="eg-leaderboard">
                {leaderboardRows.map((u, i) => {
                  const tone =
                    i === 0 ? 'yellow' : i === 1 ? 'purple' : i === 2 ? 'green' : 'plain';
                  return (
                    <li
                      key={u.nama}
                      className={`eg-row eg-tone-${tone} ${u.isMe ? 'is-me' : ''} ${
                        u.isMe && bumpMe ? 'is-bump' : ''
                      }`}
                    >
                      <span className="eg-row__rank">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="eg-row__name">
                        {u.nama} {u.isMe && <em>(kamu)</em>}
                      </span>
                      <span className="eg-row__xp">{fmt.format(u.xp)} XP</span>
                      <span className="eg-row__poin">{fmt.format(u.poin)} Poin</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <aside className="eg-level" id="eg-level" aria-label="Progres level">
              <p className="eg-level__lv" id="eg-level-lv">
                Level {me.level}
              </p>
              <h3>Level Up!</h3>
              <p className="eg-level__text">
                Semakin rajin menjalankan misi, semakin banyak XP yang kamu dapat.
              </p>
              <div className="eg-level__star" aria-hidden="true">
                <svg viewBox="-16 -16 32 32">
                  <path
                    d="M0,-14 L4,-4.5 L14,-4 L6.3,2.5 L8.7,12 L0,6.8 L-8.7,12 L-6.3,2.5 L-14,-4 L-4,-4.5Z"
                    fill="#E2C258"
                  />
                </svg>
              </div>
              <div
                className="eg-level__bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={me.levelXp}
                aria-valuenow={me.xp}
                aria-label="Progres XP menuju level berikutnya"
              >
                <span id="eg-level-fill" style={{ width: `${levelPct}%` }} />
              </div>
              <p className="eg-level__caption" id="eg-level-caption">
                {fmt.format(me.xp)} / {fmt.format(me.levelXp)} XP menuju level berikutnya
              </p>
              <p className="eg-level__poin" id="eg-level-poin">
                Poin kamu: {fmt.format(me.poin)}
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* PANEL ADMIN DEMO */}
      <section className="eg-section eg-section--tight" id="admin-sec">
        <div className="wrap">
          <details className="adm eg-ui-glass" id="admin">
            <summary>
              <span>
                <b>Panel Admin Demo</b> · verifikasi bukti quest
              </span>
              <span className="adm__badge" id="eg-admin-pending-badge">
                {pendingCount} menunggu
              </span>
            </summary>
            <div className="adm__body">
              <p className="adm__warn">
                <strong>Mode demo lokal.</strong> Tanpa login atau server; data hanya ada di
                browser ini. Jangan dipakai untuk data pengguna sungguhan.
              </p>
              <div className="adm__tools">
                <div>
                  Menunggu<strong id="eg-admin-pending">{pendingCount}</strong>
                </div>
                <div>
                  Disetujui<strong id="eg-admin-approved">{approvedCount}</strong>
                </div>
                <div>
                  Ditolak<strong id="eg-admin-rejected">{rejectedCount}</strong>
                </div>
                <label htmlFor="eg-admin-filter">
                  Status{' '}
                  <select
                    id="eg-admin-filter"
                    value={adminFilter}
                    onChange={(e) =>
                      setAdminFilter(e.target.value as 'semua' | SubmissionRow['status'])
                    }
                  >
                    <option value="semua">Semua</option>
                    <option value="terkirim">Menunggu</option>
                    <option value="disetujui">Disetujui</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </label>
              </div>
              <div id="eg-admin-rows">
                {adminError ? (
                  <p className="eg-ui-error">{adminError}</p>
                ) : (
                  visibleSubmissions.map((row) => (
                    <article key={row.id} className="eg-ui-admin-row">
                      <div>
                        <h3>{row.questTitle}</h3>
                        <p>
                          {row.userName} • {formatDate(row.submittedAt)}
                        </p>
                      </div>
                      <span className={`eg-ui-review-status is-${row.status}`}>
                        {ADMIN_LABELS[row.status] || 'Tidak diketahui'}
                      </span>
                      <button
                        type="button"
                        className="eg-btn eg-btn--purple"
                        onClick={() => openReviewModal(row)}
                      >
                        Lihat Bukti
                      </button>
                    </article>
                  ))
                )}
              </div>
              <p
                className="eg-ui-empty"
                id="eg-admin-empty"
                hidden={Boolean(adminError) || visibleSubmissions.length !== 0}
              >
                Belum ada pengajuan. Kirim quest dengan foto dari bagian Misi.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* POP-UP DETAIL MISI */}
      <dialog
        ref={questDialogRef}
        className="eg-modal"
        id="eg-modal"
        aria-labelledby="eg-modal-title"
        onClick={(e) => {
          if (e.target === questDialogRef.current) questDialogRef.current?.close();
        }}
      >
        <form method="dialog" className="eg-modal__close-wrap">
          <button className="eg-modal__close" aria-label="Tutup">
            &times;
          </button>
        </form>
        <div className="eg-modal__body" id="eg-modal-body">
          {selectedQuest && (
            <>
              <span className="eg-tag eg-tag--solid">{selectedQuest.tag}</span>
              <h3 id="eg-modal-title">{selectedQuest.judul}</h3>
              <p className="eg-modal__desc">{selectedQuest.deskripsi}</p>
              <ol className="eg-modal__steps">
                {selectedQuest.langkah.map((l, idx) => (
                  <li key={idx}>{l}</li>
                ))}
              </ol>
              <div className="eg-modal__meta">
                <span className="eg-chip">+{selectedQuest.xp} XP</span>
                <span className="eg-chip eg-chip--poin">+{selectedQuest.poin} Poin</span>
                <span className={`eg-status eg-status--${statusOf(selectedQuest.id)}`}>
                  <i aria-hidden="true" />
                  {STATUS_LABEL[statusOf(selectedQuest.id)]}
                </span>
              </div>
              {!selectedSent && (
                <div className="eg-proof">
                  <label htmlFor="eg-quest-photo">Bukti foto kegiatan (wajib)</label>
                  <input
                    id="eg-quest-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    onChange={handleFileChange}
                  />
                  {photoPreviewUrl && (
                    <img
                      className="eg-proof__img"
                      src={photoPreviewUrl}
                      alt="Pratinjau bukti"
                    />
                  )}
                  <label htmlFor="eg-quest-note">Catatan singkat (opsional)</label>
                  <textarea
                    id="eg-quest-note"
                    rows={2}
                    maxLength={240}
                    placeholder="Ceritakan kegiatanmu..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <p>
                    Demo: foto hanya disimpan di browser ini. Hindari foto wajah, alamat,
                    atau data pribadi.
                  </p>
                </div>
              )}
              <button
                type="button"
                className="eg-btn eg-btn--green eg-modal__send"
                disabled={selectedSent || sending}
                onClick={() => void handleSubmitQuest(selectedQuest)}
              >
                {sending
                  ? 'Menyimpan bukti...'
                  : selectedSent
                    ? 'Menunggu / Sudah Diverifikasi'
                    : 'Kirim Bukti Foto'}
              </button>
            </>
          )}
        </div>
      </dialog>

      {/* POP-UP TINJAU BUKTI ADMIN */}
      <dialog
        ref={adminDialogRef}
        className="eg-modal eg-ui-review-dialog"
        id="eg-admin-dialog"
        aria-labelledby="eg-admin-dialog-title"
        onClick={(e) => {
          if (e.target === adminDialogRef.current) adminDialogRef.current?.close();
        }}
        onClose={() => {
          if (reviewProofUrl) {
            URL.revokeObjectURL(reviewProofUrl);
            setReviewProofUrl(null);
          }
          setReviewRow(null);
        }}
      >
        <form method="dialog" className="eg-modal__close-wrap">
          <button className="eg-modal__close" aria-label="Tutup">
            &times;
          </button>
        </form>
        <div className="eg-modal__body">
          <span className="eg-ui-eyebrow">TINJAU BUKTI QUEST</span>
          <h2 id="eg-admin-dialog-title">{reviewRow?.questTitle || ''}</h2>
          <p id="eg-admin-user" className="eg-ui-reading-time">
            {reviewRow
              ? `${reviewRow.userName} • ${ADMIN_LABELS[reviewRow.status] || ''} • ${formatDate(
                  reviewRow.submittedAt
                )}`
              : ''}
          </p>
          <div className="eg-ui-proof-preview" id="eg-admin-proof">
            {reviewProofUrl ? (
              <>
                <img
                  src={reviewProofUrl}
                  alt="Bukti foto kegiatan, hanya tersimpan di browser ini"
                />
                <p>{reviewRow?.proofName || 'Bukti foto'}</p>
              </>
            ) : (
              <p>Tidak ada bukti foto. Pengajuan tidak bisa disetujui.</p>
            )}
          </div>
          <p id="eg-admin-note">
            {reviewRow?.note ? `Catatan: ${reviewRow.note}` : 'Tanpa catatan tambahan.'}
          </p>
          <label htmlFor="eg-admin-reason">
            Alasan penolakan (wajib jika menolak)
          </label>
          <textarea
            id="eg-admin-reason"
            maxLength={300}
            rows={2}
            placeholder="Jelaskan apa yang perlu diperbaiki..."
            value={rejectReason}
            disabled={!reviewRow || reviewRow.status !== 'terkirim'}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="eg-ui-review-actions">
            <button
              type="button"
              className="eg-btn eg-btn--green"
              id="eg-admin-approve"
              disabled={
                reviewBusy ||
                !reviewRow ||
                reviewRow.status !== 'terkirim' ||
                !reviewProofUrl
              }
              onClick={() => void handleReview(true)}
            >
              Setujui Quest
            </button>
            <button
              type="button"
              className="eg-btn eg-ui-reject"
              id="eg-admin-reject"
              disabled={reviewBusy || !reviewRow || reviewRow.status !== 'terkirim'}
              onClick={() => void handleReview(false)}
            >
              Tolak Quest
            </button>
          </div>
          <p id="eg-admin-feedback" role="status" aria-live="polite">
            {reviewFeedback}
          </p>
        </div>
      </dialog>
    </>
  );
}
