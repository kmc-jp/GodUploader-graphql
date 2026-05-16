import {
  type DefineTypeFactoryInterface,
  defineTypeFactory,
} from '@mizdra/graphql-codegen-typescript-fabbrica/helper';
import type {
  Maybe,
  Account,
  AccountConnection,
  AccountEdge,
  Artwork,
  ArtworkConnection,
  ArtworkEdge,
  Comment,
  CommentConnection,
  CommentEdge,
  CreateCommentInput,
  CreateCommentPayload,
  DeleteArtworkInput,
  DeleteArtworkPayload,
  Illust,
  IllustConnection,
  IllustEdge,
  Like,
  LikeArtworkInput,
  LikeArtworkPayload,
  LikeConnection,
  LikeEdge,
  Mutation,
  PageInfo,
  Query,
  SlackChannel,
  Tag,
  TagConnection,
  TagEdge,
  TwitterShareOption,
  UpdateAccountInput,
  UpdateAccountPayload,
  UpdateArtworkInput,
  UpdateArtworkPayload,
  UpdateTagInput,
  UpdateTagPayload,
  UploadArtworkInput,
  UploadArtworkPayload,
} from './types';

export * from '@mizdra/graphql-codegen-typescript-fabbrica/helper';

export type OptionalAccount = {
  __typename?: 'Account';
  artworks?: Maybe<OptionalArtworkConnection> | undefined;
  artworksCount?: Account['artworksCount'] | undefined;
  comments?: Maybe<OptionalCommentConnection> | undefined;
  createdAt?: Account['createdAt'] | undefined;
  /** The ID of the object. */
  id?: Account['id'] | undefined;
  /** ログインユーザーかどうか */
  isYou?: Account['isYou'] | undefined;
  kmcid?: Account['kmcid'] | undefined;
  lastLoggedIn?: Account['lastLoggedIn'] | undefined;
  likes?: Maybe<OptionalLikeConnection> | undefined;
  name?: Account['name'] | undefined;
  updatedAt?: Account['updatedAt'] | undefined;
};

/**
 * Define factory for {@link Account} model.
 *
 * @param options
 * @returns factory {@link AccountFactoryInterface}
 */
export const defineAccountFactory: DefineTypeFactoryInterface<
  OptionalAccount,
  {}
> = defineTypeFactory;

export type OptionalAccountConnection = {
  __typename?: 'AccountConnection';
  /** Contains the nodes in this connection. */
  edges?: Maybe<OptionalAccountEdge>[] | undefined;
  /** Pagination data for this connection. */
  pageInfo?: OptionalPageInfo | undefined;
};

/**
 * Define factory for {@link AccountConnection} model.
 *
 * @param options
 * @returns factory {@link AccountConnectionFactoryInterface}
 */
export const defineAccountConnectionFactory: DefineTypeFactoryInterface<
  OptionalAccountConnection,
  {}
> = defineTypeFactory;

/** A Relay edge containing a `Account` and its cursor. */
export type OptionalAccountEdge = {
  __typename?: 'AccountEdge';
  /** A cursor for use in pagination */
  cursor?: AccountEdge['cursor'] | undefined;
  /** The item at the end of the edge */
  node?: Maybe<OptionalAccount> | undefined;
};

/**
 * Define factory for {@link AccountEdge} model.
 *
 * @param options
 * @returns factory {@link AccountEdgeFactoryInterface}
 */
export const defineAccountEdgeFactory: DefineTypeFactoryInterface<
  OptionalAccountEdge,
  {}
> = defineTypeFactory;

export type OptionalArtwork = {
  __typename?: 'Artwork';
  account?: Maybe<OptionalAccount> | undefined;
  accountId?: Artwork['accountId'] | undefined;
  caption?: Artwork['caption'] | undefined;
  comments?: Maybe<OptionalCommentConnection> | undefined;
  createdAt?: Artwork['createdAt'] | undefined;
  /** 作品の情報を編集できるかどうかを返す */
  editable?: Artwork['editable'] | undefined;
  /** The ID of the object. */
  id?: Artwork['id'] | undefined;
  illusts?: Maybe<OptionalIllustConnection> | undefined;
  likes?: Maybe<OptionalLikeConnection> | undefined;
  /** この作品より1つ新しい、同じユーザーの作品を返す */
  nextArtwork?: Maybe<OptionalArtwork> | undefined;
  nsfw?: Artwork['nsfw'] | undefined;
  /** この作品より1つ古い、同じユーザーの作品を返す */
  previousArtwork?: Maybe<OptionalArtwork> | undefined;
  rating?: Artwork['rating'] | undefined;
  tags?: Maybe<OptionalTagConnection> | undefined;
  title?: Artwork['title'] | undefined;
  topIllust?: Maybe<OptionalIllust> | undefined;
  updatedAt?: Artwork['updatedAt'] | undefined;
};

/**
 * Define factory for {@link Artwork} model.
 *
 * @param options
 * @returns factory {@link ArtworkFactoryInterface}
 */
export const defineArtworkFactory: DefineTypeFactoryInterface<
  OptionalArtwork,
  {}
> = defineTypeFactory;

export type OptionalArtworkConnection = {
  __typename?: 'ArtworkConnection';
  /** Contains the nodes in this connection. */
  edges?: Maybe<OptionalArtworkEdge>[] | undefined;
  /** Pagination data for this connection. */
  pageInfo?: OptionalPageInfo | undefined;
};

/**
 * Define factory for {@link ArtworkConnection} model.
 *
 * @param options
 * @returns factory {@link ArtworkConnectionFactoryInterface}
 */
export const defineArtworkConnectionFactory: DefineTypeFactoryInterface<
  OptionalArtworkConnection,
  {}
> = defineTypeFactory;

/** A Relay edge containing a `Artwork` and its cursor. */
export type OptionalArtworkEdge = {
  __typename?: 'ArtworkEdge';
  /** A cursor for use in pagination */
  cursor?: ArtworkEdge['cursor'] | undefined;
  /** The item at the end of the edge */
  node?: Maybe<OptionalArtwork> | undefined;
};

/**
 * Define factory for {@link ArtworkEdge} model.
 *
 * @param options
 * @returns factory {@link ArtworkEdgeFactoryInterface}
 */
export const defineArtworkEdgeFactory: DefineTypeFactoryInterface<
  OptionalArtworkEdge,
  {}
> = defineTypeFactory;

export type OptionalComment = {
  __typename?: 'Comment';
  account?: Maybe<OptionalAccount> | undefined;
  accountId?: Comment['accountId'] | undefined;
  artwork?: Maybe<OptionalArtwork> | undefined;
  artworkId?: Comment['artworkId'] | undefined;
  createdAt?: Comment['createdAt'] | undefined;
  /** The ID of the object. */
  id?: Comment['id'] | undefined;
  text?: Comment['text'] | undefined;
  updatedAt?: Comment['updatedAt'] | undefined;
};

/**
 * Define factory for {@link Comment} model.
 *
 * @param options
 * @returns factory {@link CommentFactoryInterface}
 */
export const defineCommentFactory: DefineTypeFactoryInterface<
  OptionalComment,
  {}
> = defineTypeFactory;

export type OptionalCommentConnection = {
  __typename?: 'CommentConnection';
  /** Contains the nodes in this connection. */
  edges?: Maybe<OptionalCommentEdge>[] | undefined;
  /** Pagination data for this connection. */
  pageInfo?: OptionalPageInfo | undefined;
};

/**
 * Define factory for {@link CommentConnection} model.
 *
 * @param options
 * @returns factory {@link CommentConnectionFactoryInterface}
 */
export const defineCommentConnectionFactory: DefineTypeFactoryInterface<
  OptionalCommentConnection,
  {}
> = defineTypeFactory;

/** A Relay edge containing a `Comment` and its cursor. */
export type OptionalCommentEdge = {
  __typename?: 'CommentEdge';
  /** A cursor for use in pagination */
  cursor?: CommentEdge['cursor'] | undefined;
  /** The item at the end of the edge */
  node?: Maybe<OptionalComment> | undefined;
};

/**
 * Define factory for {@link CommentEdge} model.
 *
 * @param options
 * @returns factory {@link CommentEdgeFactoryInterface}
 */
export const defineCommentEdgeFactory: DefineTypeFactoryInterface<
  OptionalCommentEdge,
  {}
> = defineTypeFactory;

export type OptionalCreateCommentInput = {
  __typename?: 'CreateCommentInput';
  /** コメントをする対象の作品ID */
  artworkId?: CreateCommentInput['artworkId'] | undefined;
  clientMutationId?: CreateCommentInput['clientMutationId'] | undefined;
  /** コメントの本文 */
  text?: CreateCommentInput['text'] | undefined;
};

/**
 * Define factory for {@link CreateCommentInput} model.
 *
 * @param options
 * @returns factory {@link CreateCommentInputFactoryInterface}
 */
export const defineCreateCommentInputFactory: DefineTypeFactoryInterface<
  OptionalCreateCommentInput,
  {}
> = defineTypeFactory;

export type OptionalCreateCommentPayload = {
  __typename?: 'CreateCommentPayload';
  clientMutationId?: CreateCommentPayload['clientMutationId'] | undefined;
  comment?: Maybe<OptionalComment> | undefined;
};

/**
 * Define factory for {@link CreateCommentPayload} model.
 *
 * @param options
 * @returns factory {@link CreateCommentPayloadFactoryInterface}
 */
export const defineCreateCommentPayloadFactory: DefineTypeFactoryInterface<
  OptionalCreateCommentPayload,
  {}
> = defineTypeFactory;

export type OptionalDeleteArtworkInput = {
  __typename?: 'DeleteArtworkInput';
  clientMutationId?: DeleteArtworkInput['clientMutationId'] | undefined;
  /** 削除対象の作品のID */
  id?: DeleteArtworkInput['id'] | undefined;
};

/**
 * Define factory for {@link DeleteArtworkInput} model.
 *
 * @param options
 * @returns factory {@link DeleteArtworkInputFactoryInterface}
 */
export const defineDeleteArtworkInputFactory: DefineTypeFactoryInterface<
  OptionalDeleteArtworkInput,
  {}
> = defineTypeFactory;

export type OptionalDeleteArtworkPayload = {
  __typename?: 'DeleteArtworkPayload';
  clientMutationId?: DeleteArtworkPayload['clientMutationId'] | undefined;
  deletedArtworkId?: DeleteArtworkPayload['deletedArtworkId'] | undefined;
};

/**
 * Define factory for {@link DeleteArtworkPayload} model.
 *
 * @param options
 * @returns factory {@link DeleteArtworkPayloadFactoryInterface}
 */
export const defineDeleteArtworkPayloadFactory: DefineTypeFactoryInterface<
  OptionalDeleteArtworkPayload,
  {}
> = defineTypeFactory;

export type OptionalIllust = {
  __typename?: 'Illust';
  artwork?: Maybe<OptionalArtwork> | undefined;
  artworkId?: Illust['artworkId'] | undefined;
  createdAt?: Illust['createdAt'] | undefined;
  filename?: Illust['filename'] | undefined;
  /** The ID of the object. */
  id?: Illust['id'] | undefined;
  imageUrl?: Illust['imageUrl'] | undefined;
  thumbnailUrl?: Illust['thumbnailUrl'] | undefined;
  updatedAt?: Illust['updatedAt'] | undefined;
  webpUrl?: Illust['webpUrl'] | undefined;
};

/**
 * Define factory for {@link Illust} model.
 *
 * @param options
 * @returns factory {@link IllustFactoryInterface}
 */
export const defineIllustFactory: DefineTypeFactoryInterface<
  OptionalIllust,
  {}
> = defineTypeFactory;

export type OptionalIllustConnection = {
  __typename?: 'IllustConnection';
  /** Contains the nodes in this connection. */
  edges?: Maybe<OptionalIllustEdge>[] | undefined;
  /** Pagination data for this connection. */
  pageInfo?: OptionalPageInfo | undefined;
};

/**
 * Define factory for {@link IllustConnection} model.
 *
 * @param options
 * @returns factory {@link IllustConnectionFactoryInterface}
 */
export const defineIllustConnectionFactory: DefineTypeFactoryInterface<
  OptionalIllustConnection,
  {}
> = defineTypeFactory;

/** A Relay edge containing a `Illust` and its cursor. */
export type OptionalIllustEdge = {
  __typename?: 'IllustEdge';
  /** A cursor for use in pagination */
  cursor?: IllustEdge['cursor'] | undefined;
  /** The item at the end of the edge */
  node?: Maybe<OptionalIllust> | undefined;
};

/**
 * Define factory for {@link IllustEdge} model.
 *
 * @param options
 * @returns factory {@link IllustEdgeFactoryInterface}
 */
export const defineIllustEdgeFactory: DefineTypeFactoryInterface<
  OptionalIllustEdge,
  {}
> = defineTypeFactory;

export type OptionalLike = {
  __typename?: 'Like';
  account?: Maybe<OptionalAccount> | undefined;
  accountId?: Like['accountId'] | undefined;
  artwork?: Maybe<OptionalArtwork> | undefined;
  artworkId?: Like['artworkId'] | undefined;
  createdAt?: Like['createdAt'] | undefined;
  /** The ID of the object. */
  id?: Like['id'] | undefined;
  updatedAt?: Like['updatedAt'] | undefined;
};

/**
 * Define factory for {@link Like} model.
 *
 * @param options
 * @returns factory {@link LikeFactoryInterface}
 */
export const defineLikeFactory: DefineTypeFactoryInterface<
  OptionalLike,
  {}
> = defineTypeFactory;

export type OptionalLikeArtworkInput = {
  __typename?: 'LikeArtworkInput';
  /** 「いいね」をする対象の作品ID */
  artworkId?: LikeArtworkInput['artworkId'] | undefined;
  clientMutationId?: LikeArtworkInput['clientMutationId'] | undefined;
};

/**
 * Define factory for {@link LikeArtworkInput} model.
 *
 * @param options
 * @returns factory {@link LikeArtworkInputFactoryInterface}
 */
export const defineLikeArtworkInputFactory: DefineTypeFactoryInterface<
  OptionalLikeArtworkInput,
  {}
> = defineTypeFactory;

export type OptionalLikeArtworkPayload = {
  __typename?: 'LikeArtworkPayload';
  clientMutationId?: LikeArtworkPayload['clientMutationId'] | undefined;
  like?: Maybe<OptionalLike> | undefined;
};

/**
 * Define factory for {@link LikeArtworkPayload} model.
 *
 * @param options
 * @returns factory {@link LikeArtworkPayloadFactoryInterface}
 */
export const defineLikeArtworkPayloadFactory: DefineTypeFactoryInterface<
  OptionalLikeArtworkPayload,
  {}
> = defineTypeFactory;

export type OptionalLikeConnection = {
  __typename?: 'LikeConnection';
  /** Contains the nodes in this connection. */
  edges?: Maybe<OptionalLikeEdge>[] | undefined;
  /** Pagination data for this connection. */
  pageInfo?: OptionalPageInfo | undefined;
};

/**
 * Define factory for {@link LikeConnection} model.
 *
 * @param options
 * @returns factory {@link LikeConnectionFactoryInterface}
 */
export const defineLikeConnectionFactory: DefineTypeFactoryInterface<
  OptionalLikeConnection,
  {}
> = defineTypeFactory;

/** A Relay edge containing a `Like` and its cursor. */
export type OptionalLikeEdge = {
  __typename?: 'LikeEdge';
  /** A cursor for use in pagination */
  cursor?: LikeEdge['cursor'] | undefined;
  /** The item at the end of the edge */
  node?: Maybe<OptionalLike> | undefined;
};

/**
 * Define factory for {@link LikeEdge} model.
 *
 * @param options
 * @returns factory {@link LikeEdgeFactoryInterface}
 */
export const defineLikeEdgeFactory: DefineTypeFactoryInterface<
  OptionalLikeEdge,
  {}
> = defineTypeFactory;

export type OptionalMutation = {
  __typename?: 'Mutation';
  /** 作品にコメントする */
  createComment?: Maybe<OptionalCreateCommentPayload> | undefined;
  /** 作品を削除する */
  deleteArtwork?: Maybe<OptionalDeleteArtworkPayload> | undefined;
  /** 作品に「いいね」をする */
  likeArtwork?: Maybe<OptionalLikeArtworkPayload> | undefined;
  /** ユーザー情報を更新する */
  updateAccount?: Maybe<OptionalUpdateAccountPayload> | undefined;
  /** 作品の情報を更新する */
  updateArtwork?: Maybe<OptionalUpdateArtworkPayload> | undefined;
  /** タグの情報を更新する */
  updateTag?: Maybe<OptionalUpdateTagPayload> | undefined;
  /** 作品をアップロードする */
  uploadArtwork?: Maybe<OptionalUploadArtworkPayload> | undefined;
};

/**
 * Define factory for {@link Mutation} model.
 *
 * @param options
 * @returns factory {@link MutationFactoryInterface}
 */
export const defineMutationFactory: DefineTypeFactoryInterface<
  OptionalMutation,
  {}
> = defineTypeFactory;

/** An object with an ID */
export type OptionalNode = OptionalAccount | OptionalArtwork | OptionalComment | OptionalIllust | OptionalLike | OptionalTag;

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type OptionalPageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: PageInfo['endCursor'] | undefined;
  /** When paginating forwards, are there more items? */
  hasNextPage?: PageInfo['hasNextPage'] | undefined;
  /** When paginating backwards, are there more items? */
  hasPreviousPage?: PageInfo['hasPreviousPage'] | undefined;
  /** When paginating backwards, the cursor to continue. */
  startCursor?: PageInfo['startCursor'] | undefined;
};

/**
 * Define factory for {@link PageInfo} model.
 *
 * @param options
 * @returns factory {@link PageInfoFactoryInterface}
 */
export const definePageInfoFactory: DefineTypeFactoryInterface<
  OptionalPageInfo,
  {}
> = defineTypeFactory;

export type OptionalQuery = {
  __typename?: 'Query';
  accountByKmcid?: Maybe<OptionalAccount> | undefined;
  accounts?: Maybe<OptionalAccountConnection> | undefined;
  activeAccounts?: Maybe<OptionalAccountConnection> | undefined;
  allSlackChannels?: Maybe<OptionalSlackChannel>[] | undefined;
  allTags?: Maybe<OptionalTagConnection> | undefined;
  /** for compatibility */
  artworkByFolderId?: Maybe<OptionalArtwork> | undefined;
  artworks?: Maybe<OptionalArtworkConnection> | undefined;
  node?: Maybe<OptionalNode> | undefined;
  nodes?: Maybe<OptionalNode>[] | undefined;
  tagByName?: Maybe<OptionalTag> | undefined;
  taggedArtworks?: Maybe<OptionalArtworkConnection> | undefined;
  viewer?: Maybe<OptionalAccount> | undefined;
};

/**
 * Define factory for {@link Query} model.
 *
 * @param options
 * @returns factory {@link QueryFactoryInterface}
 */
export const defineQueryFactory: DefineTypeFactoryInterface<
  OptionalQuery,
  {}
> = defineTypeFactory;

export type OptionalSlackChannel = {
  __typename?: 'SlackChannel';
  id?: SlackChannel['id'] | undefined;
  name?: SlackChannel['name'] | undefined;
};

/**
 * Define factory for {@link SlackChannel} model.
 *
 * @param options
 * @returns factory {@link SlackChannelFactoryInterface}
 */
export const defineSlackChannelFactory: DefineTypeFactoryInterface<
  OptionalSlackChannel,
  {}
> = defineTypeFactory;

export type OptionalTag = {
  __typename?: 'Tag';
  artworks?: Maybe<OptionalArtworkConnection> | undefined;
  artworksCount?: Tag['artworksCount'] | undefined;
  canonicalName?: Tag['canonicalName'] | undefined;
  createdAt?: Tag['createdAt'] | undefined;
  editFreezed?: Tag['editFreezed'] | undefined;
  /** The ID of the object. */
  id?: Tag['id'] | undefined;
  name?: Tag['name'] | undefined;
  updatedAt?: Tag['updatedAt'] | undefined;
};

/**
 * Define factory for {@link Tag} model.
 *
 * @param options
 * @returns factory {@link TagFactoryInterface}
 */
export const defineTagFactory: DefineTypeFactoryInterface<
  OptionalTag,
  {}
> = defineTypeFactory;

export type OptionalTagConnection = {
  __typename?: 'TagConnection';
  /** Contains the nodes in this connection. */
  edges?: Maybe<OptionalTagEdge>[] | undefined;
  /** Pagination data for this connection. */
  pageInfo?: OptionalPageInfo | undefined;
};

/**
 * Define factory for {@link TagConnection} model.
 *
 * @param options
 * @returns factory {@link TagConnectionFactoryInterface}
 */
export const defineTagConnectionFactory: DefineTypeFactoryInterface<
  OptionalTagConnection,
  {}
> = defineTypeFactory;

/** A Relay edge containing a `Tag` and its cursor. */
export type OptionalTagEdge = {
  __typename?: 'TagEdge';
  /** A cursor for use in pagination */
  cursor?: TagEdge['cursor'] | undefined;
  /** The item at the end of the edge */
  node?: Maybe<OptionalTag> | undefined;
};

/**
 * Define factory for {@link TagEdge} model.
 *
 * @param options
 * @returns factory {@link TagEdgeFactoryInterface}
 */
export const defineTagEdgeFactory: DefineTypeFactoryInterface<
  OptionalTagEdge,
  {}
> = defineTypeFactory;

export type OptionalTwitterShareOption = {
  __typename?: 'TwitterShareOption';
  /** 作品をTwitterに共有するかどうか。falseのときは共有されず、他のフィールドも無視される。 */
  share?: TwitterShareOption['share'] | undefined;
  /** Twitterに共有する際の投稿者の表示名。空文字やnullのときはKMCIDが使われる */
  username?: TwitterShareOption['username'] | undefined;
};

/**
 * Define factory for {@link TwitterShareOption} model.
 *
 * @param options
 * @returns factory {@link TwitterShareOptionFactoryInterface}
 */
export const defineTwitterShareOptionFactory: DefineTypeFactoryInterface<
  OptionalTwitterShareOption,
  {}
> = defineTypeFactory;

export type OptionalUpdateAccountInput = {
  __typename?: 'UpdateAccountInput';
  clientMutationId?: UpdateAccountInput['clientMutationId'] | undefined;
  name?: UpdateAccountInput['name'] | undefined;
};

/**
 * Define factory for {@link UpdateAccountInput} model.
 *
 * @param options
 * @returns factory {@link UpdateAccountInputFactoryInterface}
 */
export const defineUpdateAccountInputFactory: DefineTypeFactoryInterface<
  OptionalUpdateAccountInput,
  {}
> = defineTypeFactory;

export type OptionalUpdateAccountPayload = {
  __typename?: 'UpdateAccountPayload';
  account?: Maybe<OptionalAccount> | undefined;
  clientMutationId?: UpdateAccountPayload['clientMutationId'] | undefined;
};

/**
 * Define factory for {@link UpdateAccountPayload} model.
 *
 * @param options
 * @returns factory {@link UpdateAccountPayloadFactoryInterface}
 */
export const defineUpdateAccountPayloadFactory: DefineTypeFactoryInterface<
  OptionalUpdateAccountPayload,
  {}
> = defineTypeFactory;

export type OptionalUpdateArtworkInput = {
  __typename?: 'UpdateArtworkInput';
  /** 更新後の説明文 */
  caption?: UpdateArtworkInput['caption'] | undefined;
  clientMutationId?: UpdateArtworkInput['clientMutationId'] | undefined;
  /** 更新対象の作品のID */
  id?: UpdateArtworkInput['id'] | undefined;
  /** 更新後の年齢制限 */
  rating?: UpdateArtworkInput['rating'] | undefined;
  /** 更新後のタグ */
  tags?: UpdateArtworkInput['tags'] | undefined;
  /** 更新後のタイトル */
  title?: UpdateArtworkInput['title'] | undefined;
};

/**
 * Define factory for {@link UpdateArtworkInput} model.
 *
 * @param options
 * @returns factory {@link UpdateArtworkInputFactoryInterface}
 */
export const defineUpdateArtworkInputFactory: DefineTypeFactoryInterface<
  OptionalUpdateArtworkInput,
  {}
> = defineTypeFactory;

export type OptionalUpdateArtworkPayload = {
  __typename?: 'UpdateArtworkPayload';
  artwork?: Maybe<OptionalArtwork> | undefined;
  clientMutationId?: UpdateArtworkPayload['clientMutationId'] | undefined;
};

/**
 * Define factory for {@link UpdateArtworkPayload} model.
 *
 * @param options
 * @returns factory {@link UpdateArtworkPayloadFactoryInterface}
 */
export const defineUpdateArtworkPayloadFactory: DefineTypeFactoryInterface<
  OptionalUpdateArtworkPayload,
  {}
> = defineTypeFactory;

export type OptionalUpdateTagInput = {
  __typename?: 'UpdateTagInput';
  clientMutationId?: UpdateTagInput['clientMutationId'] | undefined;
  /** 更新対象のタグのID */
  id?: UpdateTagInput['id'] | undefined;
  /** 更新後のタグの表記 */
  name?: UpdateTagInput['name'] | undefined;
};

/**
 * Define factory for {@link UpdateTagInput} model.
 *
 * @param options
 * @returns factory {@link UpdateTagInputFactoryInterface}
 */
export const defineUpdateTagInputFactory: DefineTypeFactoryInterface<
  OptionalUpdateTagInput,
  {}
> = defineTypeFactory;

export type OptionalUpdateTagPayload = {
  __typename?: 'UpdateTagPayload';
  clientMutationId?: UpdateTagPayload['clientMutationId'] | undefined;
  tag?: Maybe<OptionalTag> | undefined;
};

/**
 * Define factory for {@link UpdateTagPayload} model.
 *
 * @param options
 * @returns factory {@link UpdateTagPayloadFactoryInterface}
 */
export const defineUpdateTagPayloadFactory: DefineTypeFactoryInterface<
  OptionalUpdateTagPayload,
  {}
> = defineTypeFactory;

export type OptionalUploadArtworkInput = {
  __typename?: 'UploadArtworkInput';
  /** 作品の説明文 */
  caption?: UploadArtworkInput['caption'] | undefined;
  /** 投稿したことを共有するSlackチャンネルのID */
  channelId?: UploadArtworkInput['channelId'] | undefined;
  clientMutationId?: UploadArtworkInput['clientMutationId'] | undefined;
  /** アップロードする画像 (GIF/PNG/JPEG形式) */
  files?: UploadArtworkInput['files'] | undefined;
  /** 更新後の年齢制限 */
  rating?: UploadArtworkInput['rating'] | undefined;
  /** 作品をSlackにシェアするかどうか */
  shareOption?: UploadArtworkInput['shareOption'] | undefined;
  /** 作品に付けるタグ */
  tags?: UploadArtworkInput['tags'] | undefined;
  /** 作品のタイトル */
  title?: UploadArtworkInput['title'] | undefined;
  /** Twitterへの共有設定。nullのときは共有しない */
  twitterShareOption?: Maybe<OptionalTwitterShareOption> | undefined;
};

/**
 * Define factory for {@link UploadArtworkInput} model.
 *
 * @param options
 * @returns factory {@link UploadArtworkInputFactoryInterface}
 */
export const defineUploadArtworkInputFactory: DefineTypeFactoryInterface<
  OptionalUploadArtworkInput,
  {}
> = defineTypeFactory;

export type OptionalUploadArtworkPayload = {
  __typename?: 'UploadArtworkPayload';
  artwork?: Maybe<OptionalArtwork> | undefined;
  clientMutationId?: UploadArtworkPayload['clientMutationId'] | undefined;
};

/**
 * Define factory for {@link UploadArtworkPayload} model.
 *
 * @param options
 * @returns factory {@link UploadArtworkPayloadFactoryInterface}
 */
export const defineUploadArtworkPayloadFactory: DefineTypeFactoryInterface<
  OptionalUploadArtworkPayload,
  {}
> = defineTypeFactory;

