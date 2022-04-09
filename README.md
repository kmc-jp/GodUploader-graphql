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
- MySQL 8.0.28

### api

#### Dockerを使う

フロントエンドの開発のためにAPIサーバーを立ち上げるだけであれば、Dockerを使うのがおすすめです。
`docker` `docker-compose` コマンドが叩ける状態であれば、以下のコマンドでAPIサーバーを立ち上げることができます。

```
$ docker-compose up --build
```

-----

以降のセクションに書いてあるコマンドは全て `api` ディレクトリ以下で、Docker環境外で実行してください。

DBマイグレーションを作成する際や、Pythonの依存ライブラリを追加する際などは、docker-composeでMySQLコンテナを立ち上げたままDocker環境外で作業するのがおすすめです。
`DB_URL` 環境変数を設定して、MySQLコンテナにつなぎに行くようにすると作業しやすいかもしれません。

```
$ DB_URL=mysql+mysqlconnector://root@localhost:3306/goduploader
```

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

## デプロイする

### api

mainブランチに変更がマージされると、GitHub ActionsでDockerイメージがbuildされて、GitHub Container Registryにpushされます。イメージがpushされてちょっと待つとデプロイされます。

### front

hatsuneの `~passenger/GodUploader-graphql` ディレクトリで以下のコマンドを実行してください。

```
$ git pull
$ make front-k8s
```
