import {
  AccountFactory,
  ArtworkFactory,
  CommentFactory,
  IllustFactory,
  TagFactory,
} from "./factories";

let _db: Awaited<ReturnType<typeof buildDb>> | null = null;

export async function getDb() {
  if (_db) return _db;
  _db = await buildDb();
  return _db;
}

async function buildDb() {
  const [account0, account1, account2] = await Promise.all([
    AccountFactory.build({
      kmcid: "testuser",
      name: "テストユーザー",
      isYou: true,
      artworksCount: 3,
    }),
    AccountFactory.build({
      kmcid: "artist2",
      name: "アーティスト2",
      isYou: false,
      artworksCount: 5,
    }),
    AccountFactory.build({
      kmcid: "creator3",
      name: "クリエイター3",
      isYou: false,
      artworksCount: 2,
    }),
  ]);

  const [illust0, illust1, illust2, illust3] = await Promise.all([
    IllustFactory.build(),
    IllustFactory.build(),
    IllustFactory.build(),
    IllustFactory.build(),
  ]);

  const [tag0, tag1, tag2] = await Promise.all([
    TagFactory.build({ name: "風景", canonicalName: "風景", artworksCount: 2 }),
    TagFactory.build({
      name: "キャラクター",
      canonicalName: "キャラクター",
      artworksCount: 1,
    }),
    TagFactory.build({ name: "抽象", canonicalName: "抽象", artworksCount: 1 }),
  ]);

  const comment0 = await CommentFactory.build({
    text: "素晴らしい作品ですね！",
    account: account1,
    accountId: 1,
  });

  const emptyLikes = {
    edges: [] as never[],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  };

  const [base0, base1, base2, ...extraArtworks] = await Promise.all([
    ArtworkFactory.build({
      title: "テスト作品1",
      caption: "これはテスト用の作品です。",
      editable: true,
      account: account0,
      topIllust: illust0,
      illusts: { edges: [{ node: illust0 }, { node: illust1 }] },
      tags: { edges: [{ node: tag0 }, { node: tag1 }] },
      likes: emptyLikes,
      comments: {
        edges: [{ node: comment0, cursor: btoa("0") }],
        pageInfo: { hasPreviousPage: false, startCursor: null },
      },
    }),
    ArtworkFactory.build({
      title: "テスト作品2",
      caption: "二番目のテスト作品です。",
      editable: false,
      account: account1,
      topIllust: illust2,
      illusts: { edges: [{ node: illust2 }] },
      tags: { edges: [{ node: tag0 }, { node: tag2 }] },
      likes: emptyLikes,
      comments: {
        edges: [],
        pageInfo: { hasPreviousPage: false, startCursor: null },
      },
    }),
    ArtworkFactory.build({
      title: "テスト作品3",
      caption: "三番目の作品。",
      editable: true,
      account: account0,
      topIllust: illust3,
      illusts: { edges: [{ node: illust3 }] },
      tags: { edges: [{ node: tag1 }] },
      likes: emptyLikes,
      comments: {
        edges: [],
        pageInfo: { hasPreviousPage: false, startCursor: null },
      },
    }),
    ...Array.from({ length: 57 }, (_, i) =>
      ArtworkFactory.build({
        title: `追加作品${i + 4}`,
        caption: `自動生成された作品${i + 4}のキャプション`,
        editable: true,
        account: account0,
        topIllust: illust0,
        illusts: { edges: [{ node: illust0 }] },
        tags: { edges: [{ node: tag0 }] },
        likes: emptyLikes,
        comments: {
          edges: [],
          pageInfo: { hasPreviousPage: false, startCursor: null },
        },
      }),
    ),
  ]);

  const artworks = [
    { ...base0, previousArtwork: null, nextArtwork: pickArtwork(base1) },
    {
      ...base1,
      previousArtwork: pickArtwork(base0),
      nextArtwork: pickArtwork(base2),
    },
    { ...base2, previousArtwork: pickArtwork(base1), nextArtwork: null },
    ...extraArtworks.map((a) => ({
      ...a,
      previousArtwork: null,
      nextArtwork: null,
    })),
  ];

  return {
    accounts: [account0, account1, account2],
    illusts: [illust0, illust1, illust2, illust3],
    tags: [tag0, tag1, tag2],
    artworks,
  };
}

// pickArtwork は使うフィールドだけを宣言した構造型で受け取ることで
// リテラル型の相違 (editable: true vs false など) に依存しない
function pickArtwork(b: {
  id?: string;
  title?: string;
  nsfw?: boolean;
  topIllust?: { id?: string; thumbnailUrl?: string } | null;
}) {
  return {
    id: b.id,
    title: b.title,
    nsfw: b.nsfw,
    topIllust: b.topIllust
      ? { id: b.topIllust.id, thumbnailUrl: b.topIllust.thumbnailUrl }
      : null,
  };
}

export function toConnection<T>(nodes: T[]) {
  return {
    edges: nodes.map((node, i) => ({ node, cursor: btoa(String(i)) })),
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: nodes.length > 0 ? btoa("0") : null,
      endCursor: nodes.length > 0 ? btoa(String(nodes.length - 1)) : null,
    },
  };
}

export function toPaginatedConnection<T>(
  nodes: T[],
  first: number,
  after: string | null | undefined,
) {
  let startIndex = 0;
  if (after) {
    try {
      startIndex = parseInt(atob(after), 10) + 1;
    } catch {
      // ignore
    }
  }
  const slice = nodes.slice(startIndex, startIndex + first);
  const hasNextPage = startIndex + first < nodes.length;
  return {
    edges: slice.map((node, i) => ({ node, cursor: btoa(String(startIndex + i)) })),
    pageInfo: {
      hasNextPage,
      hasPreviousPage: startIndex > 0,
      startCursor: slice.length > 0 ? btoa(String(startIndex)) : null,
      endCursor:
        slice.length > 0 ? btoa(String(startIndex + slice.length - 1)) : null,
    },
  };
}

export function toPaginatedConnectionBackward<T>(
  nodes: T[],
  last: number,
  before: string | null | undefined,
) {
  let endIndex = nodes.length;
  if (before) {
    try {
      endIndex = parseInt(atob(before), 10);
    } catch {
      // ignore
    }
  }
  const startIndex = Math.max(0, endIndex - last);
  const slice = nodes.slice(startIndex, endIndex);
  return {
    edges: slice.map((node, i) => ({ node, cursor: btoa(String(startIndex + i)) })),
    pageInfo: {
      hasNextPage: endIndex < nodes.length,
      hasPreviousPage: startIndex > 0,
      startCursor: slice.length > 0 ? btoa(String(startIndex)) : null,
      endCursor:
        slice.length > 0 ? btoa(String(startIndex + slice.length - 1)) : null,
    },
  };
}
