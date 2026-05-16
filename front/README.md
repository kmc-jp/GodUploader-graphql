# front

GodUploader-graphql のフロントエンド。React + [react-router v7 Framework Mode](https://reactrouter.com/) (SPA only, `ssr: false`) + Vite + Relay。

ビルド成果物は静的ファイル (`build/client/`) で、SPA フォールバックの `index.html` を含む。サーバはこれをそのまま配信すればよい。

## スクリプト

### `npm start`

開発サーバを起動する (デフォルト http://localhost:5173)。`/api` は `http://localhost:5000` の Flask API にプロキシされる。

### `npm test`

vitest でテストを実行する (`vitest.config.ts`)。

### `npm run typecheck`

`react-router typegen` で `.react-router/types/` を生成した上で `tsc` を回す。

### `npm run build`

`build/client/` に SPA 用の静的ファイルを出力する。デプロイはこれを任意の静的ファイルサーバ (nginx, S3 + CloudFront, GitHub Pages 等) で配信し、未知のパスは `index.html` にフォールバックさせる。

### `npm run relay-compiler`

Relay のクエリを再コンパイルする。`schema.graphql` を変更したら実行する。

### `npm run codegen`

`graphql-codegen` でスキーマを更新する。

## 生成物

- `.react-router/` — `react-router typegen` の出力 (gitignore)
- `build/client/` — `react-router build` の出力 (gitignore)
- `src/**/__generated__/` — Relay コンパイル結果
