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
    | jq -r 'if (.workflow_runs | length) == 0 then error("No successful runs found") else .workflow_runs[0].id end')
  echo "Latest successful run ID: $RUN_ID"
fi

echo "Fetching artifact list for run $RUN_ID..."
ARTIFACT_URL=$(api_get "$API_BASE/repos/$REPO/actions/runs/$RUN_ID/artifacts" \
  | jq -r --arg name "$ARTIFACT_NAME" \
      '.artifacts[] | select(.name == $name) | .archive_download_url' \
  | head -1)
if [[ -z "$ARTIFACT_URL" ]]; then
  echo "Error: Artifact \"$ARTIFACT_NAME\" not found in run $RUN_ID" >&2
  exit 1
fi

echo "Downloading artifact: $ARTIFACT_NAME"
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

api_get "$ARTIFACT_URL" -L -o "$TMPDIR/artifact.zip"

echo "Extracting to $DIST_DIR..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"
unzip -q "$TMPDIR/artifact.zip" -d "$DIST_DIR"

echo "Done. Artifact extracted to $DIST_DIR"
