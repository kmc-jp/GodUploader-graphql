from datetime import datetime

from graphene.relay.node import Node
from tests.util import create_artwork, create_illust


def test_url_fields(client):
    filename_base = str(datetime.now())
    illust = create_illust(
        artwork=create_artwork(),
        filename=f"{filename_base}.png"
    )
    query = """
    query ($id: ID!) {
        node(id: $id) {
            ... on Illust {
                imageUrl
                thumbnailUrl
                webpUrl
            }
        }
    }
    """
    result = client.execute(
        query,
        variable_values={"id": Node.to_global_id("Illust", illust.id)},
    )
    assert result == {
        "data": {
            "node": {
                "imageUrl": f"http://localhost:3000/test/public/illusts/{filename_base}.png",
                "thumbnailUrl": f"http://localhost:3000/test/public/thumbnail/{filename_base}.png",
                "webpUrl": f"http://localhost:3000/test/public/webp/{filename_base}.webp",
            }
        }
    }
