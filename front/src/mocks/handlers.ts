import { graphql, HttpResponse } from "msw";

import {
  getDb,
  toConnection,
  toPaginatedConnection,
  toPaginatedConnectionBackward,
} from "./db";
import { CommentFactory, LikeFactory } from "./factories";

export const handlers = [
  graphql.query("IndexQuery", async () => {
    const { accounts, artworks } = await getDb();
    return HttpResponse.json({
      data: {
        activeAccounts: toConnection(accounts),
        safeArtworks: toConnection(artworks.filter((a) => a.rating === "safe")),
      },
    });
  }),

  graphql.query("ArtworkDetailQuery", async ({ variables }) => {
    const { artworks } = await getDb();
    const artwork = artworks.find((a) => a.id === variables.id) ?? null;
    return HttpResponse.json({
      data: {
        artworkWithBidirectional: artwork
          ? { ...artwork, artworkId: artwork.id }
          : null,
      },
    });
  }),

  graphql.query("UserDetailQuery", async ({ variables }) => {
    const { accounts, artworks } = await getDb();
    const user = accounts.find((a) => a.kmcid === variables.kmcid) ?? null;
    if (!user) return HttpResponse.json({ data: { user: null } });
    const userArtworks = artworks.filter(
      (a) => a.account?.kmcid === variables.kmcid,
    );
    return HttpResponse.json({
      data: {
        user: { ...user, artworks: toConnection(userArtworks) },
      },
    });
  }),

  graphql.query("RecentArtworksQuery", async ({ variables }) => {
    const { artworks } = await getDb();
    const ratings: string[] = variables.rating ?? ["safe"];
    const filtered = artworks.filter((a) => ratings.includes(a.rating ?? ""));
    return HttpResponse.json({
      data: {
        artworks: toPaginatedConnection(filtered, 40, null),
      },
    });
  }),

  graphql.query("ArtworkListPaginationQuery", async ({ variables }) => {
    const { accounts, artworks } = await getDb();
    const account = accounts.find((a) => a.id === variables.id) ?? null;
    if (!account) return HttpResponse.json({ data: { node: null } });
    const userArtworks = artworks.filter(
      (a) => a.account?.kmcid === account.kmcid,
    );
    return HttpResponse.json({
      data: {
        node: {
          __typename: "Account",
          id: account.id,
          artworks: toPaginatedConnectionBackward(
            userArtworks,
            variables.count ?? 20,
            variables.cursor,
          ),
        },
      },
    });
  }),

  graphql.query("RecentArtworkListPaginationQuery", async ({ variables }) => {
    const { artworks } = await getDb();
    const ratings: string[] = variables.rating ?? ["safe"];
    const filtered = artworks.filter((a) => ratings.includes(a.rating ?? ""));
    return HttpResponse.json({
      data: {
        artworks: toPaginatedConnection(
          filtered,
          variables.count ?? 20,
          variables.cursor,
        ),
      },
    });
  }),

  graphql.query("TagsQuery", async () => {
    const { tags } = await getDb();
    return HttpResponse.json({
      data: { allTags: toConnection(tags) },
    });
  }),

  graphql.query("TagsInputQuery", async () => {
    const { tags } = await getDb();
    return HttpResponse.json({
      data: { allTags: toConnection(tags) },
    });
  }),

  graphql.query("SlackChannelInputQuery", () => {
    return HttpResponse.json({
      data: {
        allSlackChannels: [
          { id: btoa("SlackChannel:1"), name: "general" },
          { id: btoa("SlackChannel:2"), name: "illust" },
        ],
      },
    });
  }),

  graphql.query("UploadArtworkModalQuery", async () => {
    const { accounts } = await getDb();
    return HttpResponse.json({
      data: { viewer: { kmcid: accounts[0].kmcid } },
    });
  }),

  graphql.query("TaggedArtworksQuery", async ({ variables }) => {
    const { artworks, tags } = await getDb();
    const tag = tags.find((t) => t.name === variables.tag) ?? null;
    const tagged = tag
      ? artworks.filter((a) =>
          a.tags?.edges?.some((e) => e?.node?.name === variables.tag),
        )
      : [];
    return HttpResponse.json({
      data: {
        tagByName: tag,
        taggedArtworks: toConnection(tagged),
      },
    });
  }),

  graphql.query("RedirectToMyPageQuery", async () => {
    const { accounts } = await getDb();
    return HttpResponse.json({
      data: { viewer: { kmcid: accounts[0].kmcid } },
    });
  }),

  graphql.query("UploadArtworkQuery", async () => {
    const { accounts } = await getDb();
    return HttpResponse.json({
      data: { viewer: { kmcid: accounts[0].kmcid } },
    });
  }),

  graphql.query("RedirectFolderToArtworkQuery", async () => {
    const { artworks } = await getDb();
    return HttpResponse.json({
      data: { artworkByFolderId: { id: artworks[0].id } },
    });
  }),

  graphql.mutation("UploadArtworkMutation", async () => {
    const { accounts } = await getDb();
    return HttpResponse.json({
      data: {
        uploadArtwork: {
          artwork: {
            id: btoa("Artwork:99"),
            title: "アップロードされた作品",
            account: accounts[0],
          },
        },
      },
    });
  }),

  graphql.mutation("UpdateArtworkMutation", async ({ variables }) => {
    const { artworks } = await getDb();
    const artwork =
      artworks.find((a) => a.id === variables.input?.id) ?? artworks[0];
    return HttpResponse.json({
      data: { updateArtwork: { artwork } },
    });
  }),

  graphql.mutation("DeleteArtworkMutation", ({ variables }) => {
    return HttpResponse.json({
      data: {
        deleteArtwork: { deletedArtworkId: variables.input?.id ?? null },
      },
    });
  }),

  graphql.mutation("CreateCommentMutation", async ({ variables }) => {
    const { accounts } = await getDb();
    const comment = await CommentFactory.build({
      text: variables.input?.text ?? "",
      account: accounts[0],
    });
    return HttpResponse.json({
      data: { createComment: { comment } },
    });
  }),

  graphql.mutation("LikeArtworkMutation", async () => {
    const { accounts } = await getDb();
    const like = await LikeFactory.build({
      account: { id: accounts[0].id, kmcid: accounts[0].kmcid },
    });
    return HttpResponse.json({
      data: { likeArtwork: { like } },
    });
  }),

  graphql.mutation("UpdateAccountMutation", async ({ variables }) => {
    const { accounts } = await getDb();
    return HttpResponse.json({
      data: {
        updateAccount: {
          account: {
            ...accounts[0],
            name: variables.input?.name ?? accounts[0].name,
          },
        },
      },
    });
  }),

  graphql.mutation("UpdateTagMutation", async ({ variables }) => {
    const { tags } = await getDb();
    const tag = tags.find((t) => t.id === variables.input?.id) ?? null;
    return HttpResponse.json({
      data: {
        updateTag: {
          tag: tag
            ? {
                ...tag,
                canonicalName:
                  variables.input?.canonicalName ?? tag.canonicalName,
              }
            : null,
        },
      },
    });
  }),
];
