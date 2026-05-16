import {
  defineAccountFactory,
  defineArtworkFactory,
  defineCommentFactory,
  defineIllustFactory,
  defineLikeFactory,
  defineTagFactory,
  dynamic,
} from "./__generated__/fabbrica";

export const AccountFactory = defineAccountFactory({
  defaultFields: {
    __typename: "Account",
    id: dynamic(({ seq }) => btoa(`Account:${seq}`)),
    kmcid: dynamic(({ seq }) => `user${seq}`),
    name: dynamic(({ seq }) => `ユーザー${seq}`),
    artworksCount: 0,
    isYou: false,
    lastLoggedIn: "2024-01-01T00:00:00",
    createdAt: "2023-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
});

export const IllustFactory = defineIllustFactory({
  defaultFields: {
    __typename: "Illust",
    id: dynamic(({ seq }) => btoa(`Illust:${seq}`)),
    artworkId: dynamic(({ seq }) => seq),
    filename: dynamic(({ seq }) => `illust${seq}.jpg`),
    imageUrl: dynamic(
      ({ seq }) => `https://placehold.jp/800x600.png?text=Illust${seq}`
    ),
    thumbnailUrl: dynamic(
      ({ seq }) => `https://placehold.jp/300x200.png?text=Illust${seq}`
    ),
    webpUrl: dynamic(
      ({ seq }) => `https://placehold.jp/800x600.png?text=Illust${seq}`
    ),
    createdAt: "2024-01-10T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
  },
});

export const TagFactory = defineTagFactory({
  defaultFields: {
    __typename: "Tag",
    id: dynamic(({ seq }) => btoa(`Tag:${seq}`)),
    name: dynamic(({ seq }) => `タグ${seq}`),
    canonicalName: dynamic(({ seq }) => `タグ${seq}`),
    artworksCount: 1,
    editFreezed: false,
  },
});

export const CommentFactory = defineCommentFactory({
  defaultFields: {
    __typename: "Comment",
    id: dynamic(({ seq }) => btoa(`Comment:${seq}`)),
    artworkId: 1,
    accountId: 1,
    text: dynamic(({ seq }) => `テストコメント${seq}`),
    createdAt: "2024-01-11T00:00:00",
    updatedAt: "2024-01-11T00:00:00",
  },
});

export const LikeFactory = defineLikeFactory({
  defaultFields: {
    __typename: "Like",
    id: dynamic(({ seq }) => btoa(`Like:${seq}`)),
    artworkId: 1,
    accountId: 1,
    createdAt: "2024-01-11T00:00:00",
    updatedAt: "2024-01-11T00:00:00",
  },
});

export const ArtworkFactory = defineArtworkFactory({
  defaultFields: {
    __typename: "Artwork",
    id: dynamic(({ seq }) => btoa(`Artwork:${seq}`)),
    accountId: 1,
    title: dynamic(({ seq }) => `テスト作品${seq}`),
    caption: dynamic(({ seq }) => `作品${seq}のキャプション`),
    rating: "safe",
    nsfw: false,
    editable: true,
    createdAt: "2024-01-10T00:00:00",
    updatedAt: "2024-01-10T00:00:00",
    nextArtwork: undefined,
    previousArtwork: undefined,
    topIllust: undefined,
    illusts: undefined,
    tags: undefined,
    likes: undefined,
    comments: undefined,
    account: undefined,
  },
});
