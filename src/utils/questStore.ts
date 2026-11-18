import type { QuestItem } from './ecoLogic';

export interface SubmissionRow {
  id: string;
  questId: string;
  questTitle: string;
  userName: string;
  note: string;
  proof: Blob;
  proofName: string;
  xp: number;
  poin: number;
  status: 'terkirim' | 'disetujui' | 'ditolak';
  reason: string;
  submittedAt: string;
  reviewedAt: string | null;
  demo: true;
}

const DB_NAME = 'ecoguetaps-quest-demo';
const STORE = 'submissions';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('Browser tidak mendukung IndexedDB.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error || new Error('Database lokal gagal dibuka.'));
  });
}

async function transact<T>(
  mode: IDBTransactionMode,
  op: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const store = tx.objectStore(STORE);
    let req: IDBRequest<T>;
    try {
      req = op(store);
    } catch (err) {
      db.close();
      reject(err);
      return;
    }
    let output: T;
    req.onsuccess = () => {
      output = req.result;
    };
    tx.oncomplete = () => {
      db.close();
      resolve(output);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('Gagal menyimpan data.'));
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error || new Error('Transaksi dibatalkan.'));
    };
  });
}

export function getAllSubmissions(): Promise<SubmissionRow[]> {
  return transact('readonly', (s) => s.getAll()) as Promise<SubmissionRow[]>;
}

export function getSubmission(id: string): Promise<SubmissionRow | undefined> {
  return transact('readonly', (s) => s.get(id)) as Promise<
    SubmissionRow | undefined
  >;
}

function putSubmission(row: SubmissionRow): Promise<IDBValidKey> {
  return transact('readwrite', (s) => s.put(row));
}

export async function submitQuestProof(
  quest: QuestItem,
  file: File | Blob | null | undefined,
  note: string
): Promise<SubmissionRow> {
  if (
    !(file instanceof Blob) ||
    !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
  ) {
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
  const proofName =
    file instanceof File && file.name
      ? String(file.name).slice(0, 100)
      : 'bukti-foto';
  const row: SubmissionRow = {
    id,
    questId: quest.id,
    questTitle: quest.judul,
    userName: 'Kamu',
    note: String(note || '').trim().slice(0, 240),
    proof: file,
    proofName,
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

export async function reviewSubmission(
  id: string,
  approve: boolean,
  reason: string
): Promise<SubmissionRow> {
  const row = await getSubmission(id);
  if (!row) {
    throw new Error('Pengajuan tidak ditemukan.');
  }
  if (row.status !== 'terkirim') {
    throw new Error('Pengajuan ini sudah diperiksa.');
  }
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
