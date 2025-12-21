# GodUploader-graphql
GodUploader with GraphQL

## 動かす

以下の環境で動作確認済です。

- Node.js v20.5.1
- Python 3.14.2
- poetry version 2.2.1
- ImageMagick 6.9.7-4
- WebP
  - Debian系なら `apt install webp` でWebPのコマンド群をインストールすればOKです

### api

#### Dockerを使う

フロントエンドの開発のためにAPIサーバーを立ち上げるだけであれば、Dockerを使うのがおすすめです。
`docker` `docker-compose` コマンドが叩ける状態であれば、以下のコマンドでAPIサーバーを立ち上げることができます。

```
$ docker-compose up --build
```

-----

以降のセクションに書いてあるコマンドは全て `api` ディレクトリ以下で、Docker環境外で実行してください。

#### 依存ライブラリをインストールする

依存ライブラリの管理は[poetry](https://python-poetry.org/)で行っています。

```
$ poetry install
```

#### 初期設定を行う

```
$ script/init_db.sh
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

### front

```
$ cd front
$ npm ci
$ npm run start
```

http://localhost:3000/ にアクセスして閲覧できればOKです。

#### GraphQLスキーマを更新する

APIサーバーを立ち上げた状態で以下のコマンドを叩くと、GraphQLスキーマ (front/schema.graphql) を更新できます。

```
$ cd front
$ npm run codegen
```

#### GraphQLクエリを更新する

GraphQLクエリ (`graphql` で囲んでいる箇所) の内容を書き換えた場合、relay-compilerのコンパイルが必要になります。

```
$ cd front
$ npm run relay-compiler
```

#### テスト

```
$ npm run test
```

## デプロイする

mainブランチに変更がマージされると、GitHub ActionsでDockerイメージがbuildされて、GitHub Container Registryにpushされます。イメージがpushされてちょっと待つとデプロイされます。

### DBのマイグレーションを行う

https://github.com/sqldef/sqldef からsqlite3defをインストールしておいてください。
hatsuneのpassengerユーザー以下では、sqlite3defコマンドが使える状態になっているはずです (なっていなかったらインストールしておいてください)。

apiディレクトリ以下で次のコマンドを叩くと、./schema.sql の内容に応じて ./db/god.db にあるSQLiteのDBに対してマイグレーションが実行されます。

```console
$ sqlite3def --file=./schema.sql ./db/god.db
```
