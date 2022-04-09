# GodUploader-graphql
GodUploader with GraphQL

## 動かす

以下の環境で動作確認済です。

- Node.js v16.1.0
- yarn 1.12.10
- Python 3.10.1
- poetry version 1.1.12
- ImageMagick 6.9.7-4
- WebP
  - Debian系なら `apt install webp` でWebPのコマンド群をインストールすればOKです

### api

このセクション以下のコマンドは全て `api` ディレクトリ以下で実行してください。

#### 依存ライブラリをインストールする

依存ライブラリの管理は[poetry](https://python-poetry.org/)で行っています。

```
$ poetry install
```

#### 初期設定を行う

```
# DBのマイグレーションを行う
$ poetry run alembic upgrade head

# 特殊なタグを編集できないようにする
$ poetry run python script/freeze_edit_for_nsfw_tags.py
$ poetry run python script/freeze_edit_for_tegaki_du.py
```

#### 手元環境を立ち上げる

```
$ poetry run python script/main.py
```

http://localhost:5000/api/ping にアクセスして `{"ok":true}` というJSONが返ったらOKです。

#### テスト

`tests` 以下にテストがあります。

```
$ poetry run pytest
```

#### 初期データを投入する

本番環境のGodUploader-graphqlからデータを手元に持ってくることもできます。ちょっと時間がかかるかもしれません。

```
$ cd api
$ BASE="utgw@kmc.gr.jp:~passenger/GodUploader-graphql" poetry run python script/init.py
```

### front

yarnを入れたら以下で動くはずです。

```
$ cd front
$ yarn install --frozen-lockfile
$ yarn start
```

http://localhost:3000/ にアクセスして閲覧できればOKです。

#### テスト

```
$ yarn test
```

### デプロイする

```
$ git pull
$ make
```
