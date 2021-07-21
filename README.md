# GodUploader-graphql
GodUploader with GraphQL

## 動かす

以下の環境で動作確認済です。

- Node.js v16.1.0
- yarn 1.12.10
- Python 3.9.5
- poetry version 1.1.6

### api

poetryをインストールしておいてください。

```
$ poetry install
$ poetry run python main.py
```

### front

yarnを入れたら以下で動くはずです。

```
$ yarn install --frozen-lockfile
$ yarn start
```

### 初期データを投入する

本番環境のGodUploader-graphqlからデータを手元に持ってくることができます。

```
$ BASE="utgw@kmc.gr.jp:~passenger/GodUploader-graphql" python3 api/script/init.py
```
