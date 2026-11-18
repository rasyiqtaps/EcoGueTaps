import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyQuestRewards,
  buildLeaderboard,
  filterArticles,
  getCampaignPercentages,
  pickRerollCandidate,
  type ArticleItem,
  type CampaignItem,
  type QuestItem,
  type UserProfile,
} from './ecoLogic';

const sampleQuests: QuestItem[] = [
  {
    id: 'q1',
    judul: 'Tumbler Hero',
    tag: 'Hemat Plastik',
    xp: 50,
    poin: 10,
    deskripsi: 'Bawa botol minum sendiri.',
    langkah: ['Langkah 1'],
  },
  {
    id: 'q2',
    judul: 'Water Guardian',
    tag: 'Hemat Air',
    xp: 40,
    poin: 8,
    deskripsi: 'Hemat air.',
    langkah: ['Langkah 1'],
  },
  {
    id: 'q3',
    judul: 'Light Saver',
    tag: 'Hemat Energi',
    xp: 120,
    poin: 20,
    deskripsi: 'Matikan lampu.',
    langkah: ['Langkah 1'],
  },
];

const baseMe: UserProfile = {
  nama: 'Kamu',
  xp: 250,
  poin: 62,
  level: 3,
  levelXp: 400,
  levelStep: 200,
};

test('applyQuestRewards deduplicates approved quests and levels up', () => {
  const map = Object.fromEntries(sampleQuests.map((q) => [q.id, q]));
  const updated = applyQuestRewards(baseMe, ['q1', 'q1', 'q3'], map);
  assert.equal(updated.xp, 420);
  assert.equal(updated.poin, 92);
  assert.equal(updated.level, 4);
  assert.equal(updated.levelXp, 600);
});

test('pickRerollCandidate excludes active and already submitted quests', () => {
  const picked = pickRerollCandidate(
    sampleQuests,
    ['q1'],
    { q2: true },
    () => 0
  );
  assert.equal(picked?.id, 'q3');

  const none = pickRerollCandidate(sampleQuests, ['q1', 'q3'], { q2: true });
  assert.equal(none, null);
});

test('buildLeaderboard sorts descending by XP and marks me', () => {
  const board = buildLeaderboard(
    [
      { nama: 'A', xp: 500, poin: 100 },
      { nama: 'B', xp: 100, poin: 20 },
    ],
    baseMe
  );
  assert.deepEqual(
    board.map((r) => r.nama),
    ['A', 'Kamu', 'B']
  );
  assert.equal(board[1].isMe, true);
});

test('filterArticles filters by category and search term', () => {
  const articles: ArticleItem[] = [
    {
      id: 'a1',
      title: 'Yuk, Pilah Sampah!',
      category: 'Daur Ulang',
      icon: '♻',
      tone: 'green',
      minutes: 3,
      summary: 'Pisahkan plastik dan daun.',
      paragraphs: [],
    },
    {
      id: 'a2',
      title: 'Hemat Air di Rumah',
      category: 'Hemat Air',
      icon: '💧',
      tone: 'purple',
      minutes: 2,
      summary: 'Matikan keran saat sikat gigi.',
      paragraphs: [],
    },
  ];
  assert.equal(filterArticles(articles, 'Semua', '').length, 2);
  assert.equal(filterArticles(articles, 'Hemat Air', '').length, 1);
  assert.equal(filterArticles(articles, 'Semua', 'plastik')[0].id, 'a1');
});

test('getCampaignPercentages computes percentages accurately', () => {
  const camp: CampaignItem = {
    key: 'reb',
    label: 'Reboisasi',
    t: 'Reboisasi',
    d: 'Desc',
    g: 20_000_000,
    c: 12_400_000,
    n: 'Target pohon',
    a: 2000,
    b: 1240,
    u: 'pohon',
  };
  const pct = getCampaignPercentages(camp);
  assert.equal(pct.fundPct, 62);
  assert.equal(pct.unitPct, 62);
});
