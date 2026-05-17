#!/bin/bash
set -euo pipefail

REPO="kmc-jp/GodUploader-graphql"
WORKFLOW_FILE="front.yml"
ARTIFACT_NAME="build-artifacts"
DIST_DIR="$(cd "$(dirname "$0")/../.." && pwd)/front/dist"
TOKEN_FILE="$HOME/.secrets/goduploader-graphql-deploy"
API_BASE="https://api.github.com"

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "Error: Token file not found: $TOKEN_FILE" >&2
  exit 1
fi

# Read token without exposing it in logs or process list
GITHUB_TOKEN=$(cat "$TOKEN_FILE")

api_get() {
  local url="$1"
  shift
  curl -fsSL \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "$@" \
    "$url"
}

if [[ $# -ge 1 ]]; then
  RUN_ID="$1"
  echo "Using specified run ID: $RUN_ID"
else
  echo "Fetching latest successful run of $WORKFLOW_FILE..."
  RUN_ID=$(api_get "$API_BASE/repos/$REPO/actions/workflows/$WORKFLOW_FILE/runs?status=success&per_page=1" \
    | python3 -c "import sys,json; runs=json.load(sys.stdin)['workflow_runs']; print(runs[0]['id']) if runs else (print('No successful runs found', file=sys.stderr) or exit(1))")
  echo "Latest successful run ID: $RUN_ID"
fi

echo "Fetching artifact list for run $RUN_ID..."
ARTIFACT_URL=$(api_get "$API_BASE/repos/$REPO/actions/runs/$RUN_ID/artifacts" \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
artifacts = [a for a in data['artifacts'] if a['name'] == '$ARTIFACT_NAME']
if not artifacts:
    print('Artifact \"$ARTIFACT_NAME\" not found in run $RUN_ID', file=sys.stderr)
    exit(1)
print(artifacts[0]['archive_download_url'])
")

echo "Downloading artifact: $ARTIFACT_NAME"
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

api_get "$ARTIFACT_URL" -L -o "$TMPDIR/artifact.zip"

echo "Extracting to $DIST_DIR..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"
unzip -q "$TMPDIR/artifact.zip" -d "$DIST_DIR"

echo "Done. Artifact extracted to $DIST_DIR"
