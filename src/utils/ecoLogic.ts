export interface QuestItem {
  id: string;
  judul: string;
  tag: string;
  xp: number;
  poin: number;
  deskripsi: string;
  langkah: string[];
}

export type QuestStatus = 'belum' | 'terkirim' | 'disetujui' | 'ditolak';

export interface UserProfile {
  nama: string;
  xp: number;
  poin: number;
  level: number;
  levelXp: number;
  levelStep: number;
}

export interface LeaderboardEntry {
  nama: string;
  xp: number;
  poin: number;
  isMe?: boolean;
}

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  tone: 'green' | 'purple' | 'yellow';
  minutes: number;
  summary: string;
  paragraphs: string[];
}

export interface CampaignItem {
  key: 'reb' | 'kar' | 'alam';
  label: string;
  t: string;
  d: string;
  g: number;
  c: number;
  n: string;
  a: number;
  b: number;
  u: string;
}

export function applyQuestRewards(
  baseMe: UserProfile,
  approvedQuestIds: string[],
  questMap: Record<string, QuestItem>
): UserProfile {
  const next: UserProfile = { ...baseMe };
  const seen = new Set<string>();
  for (const id of approvedQuestIds) {
    if (seen.has(id)) continue;
    const quest = questMap[id];
    if (!quest) continue;
    seen.add(id);
    next.xp += quest.xp;
    next.poin += quest.poin;
  }
  while (next.xp >= next.levelXp) {
    next.level += 1;
    next.levelXp += next.levelStep;
  }
  return next;
}

export function pickRerollCandidate(
  questPool: QuestItem[],
  activeIds: string[],
  submittedMap: Record<string, boolean>,
  rng: () => number = Math.random
): QuestItem | null {
  const candidates = questPool.filter(
    (q) => !activeIds.includes(q.id) && !submittedMap[q.id]
  );
  if (candidates.length === 0) return null;
  const idx = Math.floor(rng() * candidates.length) % candidates.length;
  return candidates[idx];
}

export function buildLeaderboard(
  others: LeaderboardEntry[],
  me: UserProfile
): LeaderboardEntry[] {
  const rows: LeaderboardEntry[] = others.map((o) => ({ ...o }));
  rows.push({ nama: me.nama, xp: me.xp, poin: me.poin, isMe: true });
  rows.sort((a, b) => b.xp - a.xp);
  return rows;
}

export function filterArticles(
  articles: ArticleItem[],
  category: string,
  searchTerm: string
): ArticleItem[] {
  const term = searchTerm.trim().toLocaleLowerCase('id-ID');
  return articles.filter((a) => {
    const fitsCategory = category === 'Semua' || a.category === category;
    const fitsSearch =
      !term ||
      [a.title, a.category, a.summary]
        .join(' ')
        .toLocaleLowerCase('id-ID')
        .includes(term);
    return fitsCategory && fitsSearch;
  });
}

export function getCampaignPercentages(campaign: CampaignItem): {
  fundPct: number;
  unitPct: number;
} {
  return {
    fundPct: Math.min(100, Math.max(0, (campaign.c / campaign.g) * 100)),
    unitPct: Math.min(100, Math.max(0, (campaign.b / campaign.a) * 100)),
  };
}
