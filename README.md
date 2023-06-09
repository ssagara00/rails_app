# ssagara-communication-board

## アプリ概要
旅先の思い出を共有できるWEBサービスです。
* 旅の思い出を投稿しましょう。写真を添付することができます。
* 他の人の投稿を見てみましょう。詳細ボタンでより多くの情報を見ることができます。
* 他の人の投稿にコメントをしたり、いいねをすることができます。

![一覧画面](https://github.com/ssagara00/rails_app/assets/113130446/f593570b-c8be-4faf-9b95-6d9fbc7be091)
![トップ](https://github.com/ssagara00/rails_app/assets/113130446/da7c2ef3-e8a3-4063-9e66-c668932d12ee)

# URL
https://ssagara-communication-board.com/
* 常時SSL化。
* ゲストログイン出来ます。
* スマートフォン対応。

# 作成の背景
私自身は元々旅行が一番の趣味で、国内外問わず出かけては写真をよく撮影してました。
コロナの影響で旅行需要が衰退した後、回復する中、旅行の楽しみを今一度再認識したいと思いました。
旅行に行くことがなくても、他の人の感想を見聞きすることで自分も旅行を楽しんだ気分になれます。
自分の旅行の記録を共有することができればもっと楽しいです。
そういった思いで作りました。

# 使用技術
〇フロントエンド
* HTML/CSS
* TypeScript
* react.js: 18.2.0

〇バックエンド
* Ruby: 3.1.1
* Rails: 6.1.6

〇インフラ・開発環境
* MySQL: 8.0.33
* Nginx
* Puma
* Docker/docker-compose（開発、テスト）
* AWS(Fargate・ECS・ECR・RDS・S3・ACM・VPC・Route53・ALB・IAM)
* CircleCI（CI/CD）

〇テスト・静的コード解析
* Rspec
* Rubocop
* Jest
* ESLint/Prettier

〇バージョン管理
* Git/GitHub

# 工夫した点
* スマホでの使用を想定し、レスポンシブデザインを意識
* フロント、バックともにテストコードを記述した。
* テストとデプロイを効率化するために、CircleCIを用いてCI/CDパイプラインの構築を行った。
* 優れたUI/UXを提供するため、サイト全体をSPA化した。
* GitHubでissues、プルリクエストを活用。機能実装を細分化し擬似チーム開発を意識した。

# 機能一覧

〇ユーザー管理機能
* 新規会員登録・ログイン機能・ログアウト機能・退会機能
* マイページ機能（自分の投稿のみ抽出して表示する機能）
* ユーザー登録情報変更（ユーザー名、メールアドレス）

〇投稿に関する機能
* 投稿一覧表示、投稿機能、投稿詳細表示、投稿編集、投稿削除機能
* 画像投稿機能／画像のプレビュー機能

〇投稿の「コメント」機能
* 投稿ごとにコメント投稿、編集、削除、表示する機能

〇投稿の「いいね」機能（ハートアイコン）
* 投稿にいいねができる機能
* 自分がいいねした投稿はハートアイコンの色が変化する。
* いいね数を投稿ごとに集計、表示する。
* いいねをした投稿のいいね数が増減する。

〇その他
* 画面を下にスクロールすると、投稿を追加読み込みする。

# 今後の改良予定
* フロントエンドのテストコードを記述し、自動テストをより充実させる。
* パスワードの変更をできるようにする。
