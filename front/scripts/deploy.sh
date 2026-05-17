#!/bin/bash
set -euo pipefail

REPO="kmc-jp/goduploader-graphql"
WORKFLOW_FILE="front.yml"
ARTIFACT_NAME="build-artifacts"
DIST_DIR="$(realpath "$(dirname "$0")/..")/dist"
TOKEN_FILE="$HOME/.secrets/goduploader-graphql-deploy"

if [ ! -f "$TOKEN_FILE" ]; then
  echo "Error: Token file not found: $TOKEN_FILE" >&2
  exit 1
fi

api() {
  curl -fsSL \
    -H "Authorization: Bearer $(cat "$TOKEN_FILE")" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2026-03-10" \
    "$@"
}

if [ $# -ge 1 ]; then
  RUN_ID="$1"
else
  echo "Looking up latest successful run of $WORKFLOW_FILE on main..."
  RUN_ID=$(api "https://api.github.com/repos/$REPO/actions/workflows/$WORKFLOW_FILE/runs?branch=main&status=success&per_page=1" \
    | python3 -c "import sys,json; runs=json.load(sys.stdin)['workflow_runs']; print(runs[0]['id']) if runs else exit(1)")
  echo "Using run ID: $RUN_ID"
fi

ARTIFACT_URL=$(api "https://api.github.com/repos/$REPO/actions/runs/$RUN_ID/artifacts" \
  | python3 -c "
import sys, json
arts = json.load(sys.stdin)['artifacts']
match = [a for a in arts if a['name'] == '$ARTIFACT_NAME']
if not match:
    print('Artifact \"$ARTIFACT_NAME\" not found in run $RUN_ID', file=sys.stderr)
    exit(1)
print(match[0]['archive_download_url'])
")

TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

echo "Downloading artifact..."
api -L -o "$TMPDIR/artifact.zip" "$ARTIFACT_URL"

echo "Extracting..."
unzip -q "$TMPDIR/artifact.zip" -d "$TMPDIR/extracted"

mkdir -p "$DIST_DIR"
echo "Syncing to $DIST_DIR..."
rsync -av --delete "$TMPDIR/extracted/" "$DIST_DIR/"

echo "Done."
