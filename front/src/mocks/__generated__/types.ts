export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: { input: unknown; output: unknown; }
  /**
   * Create scalar that ignores normal serialization/deserialization, since
   * that will be handled by the multipart request spec
   */
  Upload: { input: unknown; output: unknown; }
};

export type Account = Node & {
  __typename?: 'Account';
  artworks: Maybe<ArtworkConnection>;
  artworksCount: Scalars['Int']['output'];
  comments: Maybe<CommentConnection>;
  createdAt: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  /** ログインユーザーかどうか */
  isYou: Scalars['Boolean']['output'];
  kmcid: Scalars['String']['output'];
  lastLoggedIn: Scalars['DateTime']['output'];
  likes: Maybe<LikeConnection>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type AccountArtworksArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};


export type AccountCommentsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};


export type AccountLikesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type AccountConnection = {
  __typename?: 'AccountConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AccountEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Account` and its cursor. */
export type AccountEdge = {
  __typename?: 'AccountEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<Account>;
};

/** An enumeration. */
export type AccountSortEnum =
  | 'ARTWORKS_COUNT_ASC'
  | 'ARTWORKS_COUNT_DESC'
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'KMCID_ASC'
  | 'KMCID_DESC'
  | 'LAST_LOGGED_IN_ASC'
  | 'LAST_LOGGED_IN_DESC'
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'UPDATED_AT_ASC'
  | 'UPDATED_AT_DESC';

export type Artwork = Node & {
  __typename?: 'Artwork';
  account: Maybe<Account>;
  accountId: Scalars['Int']['output'];
  caption: Scalars['String']['output'];
  comments: Maybe<CommentConnection>;
  createdAt: Scalars['DateTime']['output'];
  /** 作品の情報を編集できるかどうかを返す */
  editable: Scalars['Boolean']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  illusts: Maybe<IllustConnection>;
  likes: Maybe<LikeConnection>;
  /** この作品より1つ新しい、同じユーザーの作品を返す */
  nextArtwork: Maybe<Artwork>;
  nsfw: Scalars['Boolean']['output'];
  /** この作品より1つ古い、同じユーザーの作品を返す */
  previousArtwork: Maybe<Artwork>;
  rating: ArtworkRatingEnum;
  tags: Maybe<TagConnection>;
  title: Scalars['String']['output'];
  topIllust: Maybe<Illust>;
  updatedAt: Scalars['DateTime']['output'];
};


export type ArtworkCommentsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};


export type ArtworkIllustsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};


export type ArtworkLikesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};


export type ArtworkTagsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type ArtworkConnection = {
  __typename?: 'ArtworkConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ArtworkEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Artwork` and its cursor. */
export type ArtworkEdge = {
  __typename?: 'ArtworkEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<Artwork>;
};

/** 作品の年齢制限 (全年齢/R-18/R-18G) を表すenum */
export type ArtworkRatingEnum =
  | 'r_18'
  | 'r_18g'
  | 'safe';

/** An enumeration. */
export type ArtworkSortEnum =
  | 'ACCOUNT_ID_ASC'
  | 'ACCOUNT_ID_DESC'
  | 'CAPTION_ASC'
  | 'CAPTION_DESC'
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'TITLE_ASC'
  | 'TITLE_DESC'
  | 'UPDATED_AT_ASC'
  | 'UPDATED_AT_DESC';

export type Comment = Node & {
  __typename?: 'Comment';
  account: Maybe<Account>;
  accountId: Scalars['Int']['output'];
  artwork: Maybe<Artwork>;
  artworkId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CommentConnection = {
  __typename?: 'CommentConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CommentEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Comment` and its cursor. */
export type CommentEdge = {
  __typename?: 'CommentEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<Comment>;
};

export type CreateCommentInput = {
  /** コメントをする対象の作品ID */
  artworkId: Scalars['ID']['input'];
  clientMutationId: InputMaybe<Scalars['String']['input']>;
  /** コメントの本文 */
  text: Scalars['String']['input'];
};

export type CreateCommentPayload = {
  __typename?: 'CreateCommentPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  comment: Maybe<Comment>;
};

export type DeleteArtworkInput = {
  clientMutationId: InputMaybe<Scalars['String']['input']>;
  /** 削除対象の作品のID */
  id: Scalars['ID']['input'];
};

export type DeleteArtworkPayload = {
  __typename?: 'DeleteArtworkPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  deletedArtworkId: Maybe<Scalars['ID']['output']>;
};

export type Illust = Node & {
  __typename?: 'Illust';
  artwork: Maybe<Artwork>;
  artworkId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  filename: Scalars['String']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  thumbnailUrl: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  webpUrl: Scalars['String']['output'];
};

export type IllustConnection = {
  __typename?: 'IllustConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<IllustEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Illust` and its cursor. */
export type IllustEdge = {
  __typename?: 'IllustEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<Illust>;
};

export type Like = Node & {
  __typename?: 'Like';
  account: Maybe<Account>;
  accountId: Scalars['Int']['output'];
  artwork: Maybe<Artwork>;
  artworkId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LikeArtworkInput = {
  /** 「いいね」をする対象の作品ID */
  artworkId: Scalars['ID']['input'];
  clientMutationId: InputMaybe<Scalars['String']['input']>;
};

export type LikeArtworkPayload = {
  __typename?: 'LikeArtworkPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  like: Maybe<Like>;
};

export type LikeConnection = {
  __typename?: 'LikeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LikeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Like` and its cursor. */
export type LikeEdge = {
  __typename?: 'LikeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<Like>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** 作品にコメントする */
  createComment: Maybe<CreateCommentPayload>;
  /** 作品を削除する */
  deleteArtwork: Maybe<DeleteArtworkPayload>;
  /** 作品に「いいね」をする */
  likeArtwork: Maybe<LikeArtworkPayload>;
  /** ユーザー情報を更新する */
  updateAccount: Maybe<UpdateAccountPayload>;
  /** 作品の情報を更新する */
  updateArtwork: Maybe<UpdateArtworkPayload>;
  /** タグの情報を更新する */
  updateTag: Maybe<UpdateTagPayload>;
  /** 作品をアップロードする */
  uploadArtwork: Maybe<UploadArtworkPayload>;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationDeleteArtworkArgs = {
  input: DeleteArtworkInput;
};


export type MutationLikeArtworkArgs = {
  input: LikeArtworkInput;
};


export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};


export type MutationUpdateArtworkArgs = {
  input: UpdateArtworkInput;
};


export type MutationUpdateTagArgs = {
  input: UpdateTagInput;
};


export type MutationUploadArtworkArgs = {
  input: UploadArtworkInput;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID']['output'];
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  accountByKmcid: Maybe<Account>;
  accounts: Maybe<AccountConnection>;
  activeAccounts: Maybe<AccountConnection>;
  allSlackChannels: Array<Maybe<SlackChannel>>;
  allTags: Maybe<TagConnection>;
  /** for compatibility */
  artworkByFolderId: Maybe<Artwork>;
  artworks: Maybe<ArtworkConnection>;
  node: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  tagByName: Maybe<Tag>;
  taggedArtworks: Maybe<ArtworkConnection>;
  viewer: Maybe<Account>;
};


export type QueryAccountByKmcidArgs = {
  kmcid: Scalars['String']['input'];
};


export type QueryAccountsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  sort: InputMaybe<Array<InputMaybe<AccountSortEnum>>>;
};


export type QueryActiveAccountsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  sort: InputMaybe<Array<InputMaybe<AccountSortEnum>>>;
};


export type QueryAllTagsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  sort: InputMaybe<Array<InputMaybe<TagSortEnum>>>;
};


export type QueryArtworkByFolderIdArgs = {
  folderId: Scalars['Int']['input'];
};


export type QueryArtworksArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  rating: InputMaybe<Array<ArtworkRatingEnum>>;
  sort: InputMaybe<Array<InputMaybe<ArtworkSortEnum>>>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryTagByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryTaggedArtworksArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  sort: InputMaybe<Array<InputMaybe<ArtworkSortEnum>>>;
  tag: Scalars['String']['input'];
};

export type SlackChannel = {
  __typename?: 'SlackChannel';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

/** 画像をアップロードする際にSlackに共有するかどうかを表すenum */
export type SlackShareOptionEnum =
  | 'NONE'
  | 'SHARE_TO_SLACK'
  | 'SHARE_TO_SLACK_WITH_IMAGE';

export type Tag = Node & {
  __typename?: 'Tag';
  artworks: Maybe<ArtworkConnection>;
  artworksCount: Scalars['Int']['output'];
  canonicalName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  editFreezed: Scalars['Boolean']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type TagArtworksArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type TagConnection = {
  __typename?: 'TagConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TagEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Tag` and its cursor. */
export type TagEdge = {
  __typename?: 'TagEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<Tag>;
};

/** An enumeration. */
export type TagSortEnum =
  | 'ARTWORKS_COUNT_ASC'
  | 'ARTWORKS_COUNT_DESC'
  | 'CANONICAL_NAME_ASC'
  | 'CANONICAL_NAME_DESC'
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'EDIT_FREEZED_ASC'
  | 'EDIT_FREEZED_DESC'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'UPDATED_AT_ASC'
  | 'UPDATED_AT_DESC';

export type TwitterShareOption = {
  /** 作品をTwitterに共有するかどうか。falseのときは共有されず、他のフィールドも無視される。 */
  share: Scalars['Boolean']['input'];
  /** Twitterに共有する際の投稿者の表示名。空文字やnullのときはKMCIDが使われる */
  username: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAccountInput = {
  clientMutationId: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type UpdateAccountPayload = {
  __typename?: 'UpdateAccountPayload';
  account: Maybe<Account>;
  clientMutationId: Maybe<Scalars['String']['output']>;
};

export type UpdateArtworkInput = {
  /** 更新後の説明文 */
  caption: Scalars['String']['input'];
  clientMutationId: InputMaybe<Scalars['String']['input']>;
  /** 更新対象の作品のID */
  id: Scalars['ID']['input'];
  /** 更新後の年齢制限 */
  rating: InputMaybe<ArtworkRatingEnum>;
  /** 更新後のタグ */
  tags: Array<Scalars['String']['input']>;
  /** 更新後のタイトル */
  title: Scalars['String']['input'];
};

export type UpdateArtworkPayload = {
  __typename?: 'UpdateArtworkPayload';
  artwork: Maybe<Artwork>;
  clientMutationId: Maybe<Scalars['String']['output']>;
};

export type UpdateTagInput = {
  clientMutationId: InputMaybe<Scalars['String']['input']>;
  /** 更新対象のタグのID */
  id: Scalars['ID']['input'];
  /** 更新後のタグの表記 */
  name: Scalars['String']['input'];
};

export type UpdateTagPayload = {
  __typename?: 'UpdateTagPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  tag: Maybe<Tag>;
};

export type UploadArtworkInput = {
  /** 作品の説明文 */
  caption: Scalars['String']['input'];
  /** 投稿したことを共有するSlackチャンネルのID */
  channelId: InputMaybe<Scalars['String']['input']>;
  clientMutationId: InputMaybe<Scalars['String']['input']>;
  /** アップロードする画像 (GIF/PNG/JPEG形式) */
  files: Array<Scalars['Upload']['input']>;
  /** 更新後の年齢制限 */
  rating: ArtworkRatingEnum;
  /** 作品をSlackにシェアするかどうか */
  shareOption: InputMaybe<SlackShareOptionEnum>;
  /** 作品に付けるタグ */
  tags: Array<Scalars['String']['input']>;
  /** 作品のタイトル */
  title: Scalars['String']['input'];
  /** Twitterへの共有設定。nullのときは共有しない */
  twitterShareOption: InputMaybe<TwitterShareOption>;
};

export type UploadArtworkPayload = {
  __typename?: 'UploadArtworkPayload';
  artwork: Maybe<Artwork>;
  clientMutationId: Maybe<Scalars['String']['output']>;
};
