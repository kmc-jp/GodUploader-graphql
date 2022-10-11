import json
import os
import sys
from pathlib import Path
from typing import List

import requests

BASE_URL = os.environ.get("BASE_URL", "http://localhost:5000")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
GRAPHQL_API_ENDPOINT = f"{BASE_URL}/api/graphql"
UPLOAD_ARTWORK_MUTATION = """
mutation UploadArtworkMutation($input: UploadArtworkInput!) {
    uploadArtwork(input: $input) {
        artwork {
            id
        }
    }
}
"""


def main() -> int:
    image_path = Path(__file__).parent / "me.png"
    if not image_path.exists():
        print(f"File {image_path} not found")
        return 1

    payload = {
        "operations": json.dumps(
            {
                "query": UPLOAD_ARTWORK_MUTATION,
                "variables": {
                    "input": {
                        "title": "タイトル",
                        "caption": "説明文です",
                        "tags": [
                            "タグ1",
                            "tag_2",
                        ],
                        "rating": "safe",
                        "shareOption": "SHARE_TO_SLACK_WITH_IMAGE",
                        "channelId": "C03875433",
                        "files": [None],
                    },
                },
            }
        ),
        "map": json.dumps({"variables.input.files.0": ["variables.input.files.0"]}),
    }
    files = {"variables.input.files.0": image_path.open("rb")}
    headers = {
        # リファラチェックがあるので渡しておく
        "Referer": f"{FRONTEND_URL}/",
    }
    resp = requests.post(
        GRAPHQL_API_ENDPOINT, data=payload, headers=headers, files=files
    )

    resp_json = resp.json()
    print(resp_json)

    if resp.status_code != 200 or "errors" in resp_json:
        return 1

    print(
        f"URL: {FRONTEND_URL}/artwork/{resp_json['data']['uploadArtwork']['artwork']['id']}"
    )

    return 0


if __name__ == "__main__":
    sys.exit(main())
