from pathlib import Path

import graphene
from goduploader.model.artwork import ArtworkRatingEnum
from mocket.plugins.httpretty import httpretty
from tests.util import create_account, create_artwork, create_tag


def test_artworks_rating_safe(client):
    safe_artwork = create_artwork(rating=ArtworkRatingEnum.safe)
    create_artwork(rating=ArtworkRatingEnum.r_18)
    create_artwork(rating=ArtworkRatingEnum.r_18g)
    query = """
    {
        safeArtworks: artworks(first: 8, rating: [safe]) {
            edges {
                node {
                    title
                    nsfw
                }
            }
        }
    }
    """
    result = client.execute(query)
    assert result == {
        "data": {
            "safeArtworks": {
                "edges": [{"node": {"title": safe_artwork.title, "nsfw": False}}],
            },
        },
    }, "only fetch safe artworks"


def test_artworks_rating_unsafe(client):
    create_artwork(rating=ArtworkRatingEnum.safe)
    r_18_artwork = create_artwork(rating=ArtworkRatingEnum.r_18)
    r_18g_artwork = create_artwork(rating=ArtworkRatingEnum.r_18g)
    query = """
    {
        unsafeArtworks: artworks(first: 8, rating: [r_18, r_18g], sort: [ID_ASC]) {
            edges {
                node {
                    title
                    nsfw
                }
            }
        }
    }
    """
    result = client.execute(query)
    assert result == {
        "data": {
            "unsafeArtworks": {
                "edges": [
                    {"node": {"title": r_18_artwork.title, "nsfw": True}},
                    {"node": {"title": r_18g_artwork.title, "nsfw": True}},
                ],
            },
        },
    }, "only fetch unsafe artworks"


def test_artworks_rating_all(client):
    safe_artwork = create_artwork(rating=ArtworkRatingEnum.safe)
    r_18_artwork = create_artwork(rating=ArtworkRatingEnum.r_18)
    r_18g_artwork = create_artwork(rating=ArtworkRatingEnum.r_18g)
    query = """
    {
        artworks(first: 8, sort: [ID_ASC]) {
            edges {
                node {
                    title
                    nsfw
                }
            }
        }
    }
    """
    result = client.execute(query)
    assert result == {
        "data": {
            "artworks": {
                "edges": [
                    {"node": {"title": safe_artwork.title, "nsfw": False}},
                    {"node": {"title": r_18_artwork.title, "nsfw": True}},
                    {"node": {"title": r_18g_artwork.title, "nsfw": True}},
                ],
            },
        },
    }, "fetch all artworks"


def test_tagged_artworks(client):
    artworks = [
        create_artwork(),
        create_artwork(tags=["foo"]),
        create_artwork(tags=["bar", "foo"]),
        create_artwork(tags=["bar"]),
    ]
    query = """
    {
        taggedArtworks(tag: "foo", sort: ID_ASC) {
            edges {
                node {
                    title
                }
            }
        }
    }
    """
    result = client.execute(query)
    assert result == {
        "data": {
            "taggedArtworks": {
                "edges": [
                    {"node": {"title": artworks[1].title}},
                    {"node": {"title": artworks[2].title}},
                ],
            },
        },
    }


def _mock_slack_conversations_list():
    # https://api.slack.com/methods/conversations.list
    body = (
        Path(__file__).parent.parent / "data/httpmock/slack_conversations_list.json"
    ).read_text()
    httpretty.register_uri(
        httpretty.POST,
        "https://www.slack.com/api/conversations.list",
        body=body,
    )


def test_all_slack_channels(client):
    _mock_slack_conversations_list()

    query = """
    {
        allSlackChannels {
            id
            name
        }
    }
    """
    result = client.execute(query)
    assert result == {
        "data": {
            "allSlackChannels": [
                {
                    "id": "C012AB3CD",
                    "name": "general",
                },
                {"id": "C061EG9T2", "name": "random"},
            ]
        }
    }


def test_nodes(client):
    account = create_account()
    artwork = create_artwork()

    query = """
    query NodesQuery($ids: [ID!]!){
        nodes(ids: $ids) {
            id
        }
    }
    """
    result = client.execute(
        query,
        variables={
            "ids": [
                graphene.Node.to_global_id("Account", account.id),
                graphene.Node.to_global_id("Artwork", artwork.id),
            ]
        },
    )
    assert result == {
        "data": {
            "nodes": [
                {"id": graphene.Node.to_global_id("Account", account.id)},
                {"id": graphene.Node.to_global_id("Artwork", artwork.id)},
            ]
        }
    }


def test_all_tags(client):
    no_artwork_tag = create_tag()
    tag = create_tag()

    create_artwork(tags=[tag.name])

    query = """
    query AllTagsQuery {
        allTags {
            edges {
                node {
                    id
                }
            }
        }
    }
    """
    result = client.execute(query)
    assert result == {
        "data": {
            "allTags": {
                "edges": [
                    {
                        "node": {
                            "id": graphene.Node.to_global_id("Tag", tag.id)
                        }
                    }
                ]
            }
        }
    }


def test_tag_by_name(client):
    tag = create_tag()
    query = """
    query TagByNameQuery($name: String!) {
        tagByName(name: $name) {
            id
        }
    }
    """
    result = client.execute(
        query,
        variables={
            "name": tag.name,
        }
    )
    assert result == {
        "data": {
            "tagByName": {
                "id": graphene.Node.to_global_id("Tag", tag.id)
            }
        }
    }


def test_account_by_kmcid(client):
    account = create_account()
    query = """
    query ($kmcid: String!) {
        accountByKmcid(kmcid: $kmcid) {
            id
        }
    }
    """
    result = client.execute(
        query,
        variables={
            "kmcid": account.kmcid,
        }
    )
    assert result == {
        "data": {
            "accountByKmcid": {
                "id": graphene.Node.to_global_id("Account", account.id)
            }
        }
    }


def test_active_accounts(client):
    # 何も投稿していないので inactive
    inactive_account = create_account()
    # 1件以上投稿しているので active
    account = create_account()
    create_artwork(account=account)

    query = """
    query ActiveAccountsQuery {
        activeAccounts {
            edges {
                node {
                    id
                }
            }
        }
    }
    """
    result = client.execute(query)
    assert result == {
        "data": {
            "activeAccounts": {
                "edges": [
                    {
                        "node": {
                            "id": graphene.Node.to_global_id("Account", account.id)
                        }
                    }
                ]
            }
        }
    }


def test_artwork_by_folder_id(client):
    artwork = create_artwork()

    query = """
    query ($folderId: Int!) {
        artworkByFolderId(folderId: $folderId) {
            id
        }
    }
    """
    result = client.execute(
        query,
        variables={
            "folderId": artwork.id,
        }
    )
    assert result == {
        "data": {
            "artworkByFolderId": {
                "id": graphene.Node.to_global_id("Artwork", artwork.id),
            }
        }
    }
