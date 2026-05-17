#!/bin/bash
set -euo pipefail

REPO="kmc-jp/goduploader-graphql"
WORKFLOW_FILE="front.yml"
ARTIFACT_NAME="build-artifacts"
DIST_DIR="$(realpath "$(dirname "$0")/..")/dist"

CLIENT_ID="Iv23liAVKe614ZUwJS4I"

get_github_token() {
  local client_id="$1"

  local device_response
  device_response=$(curl -fsSL \
    -X POST \
    -H "Accept: application/json" \
    --data-urlencode "client_id=$client_id" \
    --data-urlencode "scope=repo" \
    "https://github.com/login/device/code")

  local device_code user_code interval expires_in
  device_code=$(echo "$device_response" | jq -r '.device_code')
  user_code=$(echo "$device_response"   | jq -r '.user_code')
  interval=$(echo "$device_response"    | jq -r '.interval // 5')
  expires_in=$(echo "$device_response"  | jq -r '.expires_in // 900')

  echo "以下のURLをブラウザで開き、コードを入力してください:" >&2
  echo "  URL:  https://github.com/login/device" >&2
  echo "  Code: $user_code" >&2
  read -rp "ログイン完了したらEnterキーを押してください..." >&2

  local start_time=$SECONDS
  while true; do
    if (( SECONDS - start_time >= expires_in )); then
      echo "Device flow timed out." >&2
      return 1
    fi

    sleep "$interval"

    local token_response error access_token
    token_response=$(curl -fsSL \
      -X POST \
      -H "Accept: application/json" \
      --data-urlencode "client_id=$client_id" \
      --data-urlencode "device_code=$device_code" \
      --data-urlencode "grant_type=urn:ietf:params:oauth:grant-type:device_code" \
      "https://github.com/login/oauth/access_token")

    error=$(echo "$token_response" | jq -r '.error // ""')

    case "$error" in
      "")
        access_token=$(echo "$token_response" | jq -r '.access_token')
        echo "$access_token"
        return 0
        ;;
      "authorization_pending")
        ;;
      "slow_down")
        interval=$((interval + 5))
        ;;
      *)
        echo "Authorization failed: $error" >&2
        return 1
        ;;
    esac
  done
}

GITHUB_TOKEN=$(get_github_token "$CLIENT_ID")

api() {
  curl -fsSL \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2026-03-10" \
    "$@"
}

if [ $# -ge 1 ]; then
  RUN_ID="$1"
else
  echo "Looking up latest successful run of $WORKFLOW_FILE on main..."
  RUN_ID=$(api "https://api.github.com/repos/$REPO/actions/workflows/$WORKFLOW_FILE/runs?branch=main&status=success&per_page=1" \
    | jq -r 'if (.workflow_runs | length) > 0 then .workflow_runs[0].id else error("no successful runs found") end')
  echo "Using run ID: $RUN_ID"
fi

ARTIFACT_URL=$(api "https://api.github.com/repos/$REPO/actions/runs/$RUN_ID/artifacts" \
  | jq -r --arg name "$ARTIFACT_NAME" \
    '.artifacts | map(select(.name == $name)) | if length > 0 then .[0].archive_download_url else error("Artifact \($name) not found") end')

TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

echo "Downloading artifact..."
api -L -o "$TMPDIR/artifact.zip" "$ARTIFACT_URL"

echo "Extracting..."
unzip -q "$TMPDIR/artifact.zip" -d "$TMPDIR/extracted"

mkdir -p "$DIST_DIR"
echo "Syncing to $DIST_DIR..."
rsync -av --delete-after "$TMPDIR/extracted/" "$DIST_DIR/"

echo "Done."
