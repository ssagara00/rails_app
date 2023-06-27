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
* React: 18.2.0

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

# ER図
![ER図](https://github.com/ssagara00/rails_app/assets/113130446/ddb49b08-017c-47b6-aaef-18a310737e29)

# インフラ構成図
![インフラ構築図](https://github.com/ssagara00/rails_app/assets/113130446/4ea9dc70-5402-474f-91cd-85465e024819)

# 設計書
https://docs.google.com/spreadsheets/d/1ELyoUAZjE303z25amdMusymaC5gegF9DCUG2LOskn_A/edit?usp=sharing

# 画面設計書
[画面設計書リンク](https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=%E7%94%BB%E9%9D%A2%E8%A8%AD%E8%A8%88%E6%9B%B8.drawio#R%3Cmxfile%20pages%3D%229%22%3E%3Cdiagram%20name%3D%22%E4%B8%80%E8%A6%A7%E7%94%BB%E9%9D%A2%22%20id%3D%22Z05wb3v8WayzDk5pqRYL%22%3E7ZpRb6s2FMc%2FjR9vFWMw5hFIcjvpXm1aHybtZXKCCegCjsC9SffpZ4MdEnC7Tgs0kdpGqvljE%2FidY%2FucQwGKy%2BPXmu6z7zxhBXAWyRGgJXAc6CJX%2FlHKS6f4Ae6EXZ0nulMvPOV%2FMy0utPqcJ6y56Cg4L0S%2BvxS3vKrYVlxotK754bJbyovLb93THRsJT1tajNU%2F8kRknUocv9cfWb7LzDdDHHRnSmo66ydpMprww5mEVgDFNeeia5XHmBUKnuHSjVu%2FcvZ0YzWrxHsGZL%2F%2B%2Bej%2FUj6m8PmvL%2FBHA0PofNFX%2BUmLZ%2F3A%2BmbFiyFQ8%2BcqYeoiC4CiQ5YL9rSnW3X2IG0utUyUhTyCspnmRRHzgtftWJR66lfqjaj5D3Z2Brc%2FagSvxJne%2FUh9%2FHjmXlkt2PFM0o%2F7lfGSifpFdtFnPU1eu54xxKG3Y2C07MyG2Nci1b6zO125xysbmvB%2FoI2mpc1g4jHfRjvAPqJ4NqrQQnUyqO4Y6goDucxEC7AiIMSArJVCQhB4YOWDkIBofVXwCWUk3VrdfEvYJr0OeOIMyHsj8tDqz1ORxxbyCBAEwmXbcFoTtI3QMQ2s%2BxByhybAwY2ZwLeYYA2iWOHVtjDApaiNcq54QD4SWZpRwcgokowYYa14xQY20BIt8l0lDwuWqmEKbS5301DLZZ4k6spRIw2bV7tvbbel2yu%2Fa2pK4nJ4WrSbZiYHMnmFaM%2FzSrQYvUh%2BJNh48eABT95rLI9hfyw%2Fqnstt5dK3j7NW7Mz2ogDa9TN1VxQQTftk77D464xhS%2Fdxx2vndC2dqKp3IdY187BSrlyQUQAMatp6L8xceEsGAdbUDDG6PoWjO5UGINXF8K3Jx9uF0JPzcJwAaTvKuYrELYNNS9x25D8I7AKQLBU6%2BiHw3f%2Bnb47J30zYyYLYtPU2Vq3lgRvsHelsGqwNEA8xurYnHpCrlMnB7NwRTcIduI8YB6w%2BAbBWnKB%2BwM7DBIsGdbcXC2R%2Fv1xHa4EtwDWEoDdH9jhSnALYG0h2SmU8tq463%2FWAK4A7hTsm3QSWsDZEoJgKm7OO%2FZ8k9N9oxtW%2FMabXORc5XYbLgQvLUmf4AN0TUb36mLlcaeqxg8b2uTbh4zRWlyB6snV3tiYkAXqZFmWYfhqlg4BcYcNVUPBKg9TNZTP5HyG2TgKwcnYb%2BZNzx1LoNg7zjhRb7P0Lp%2F8rOrM5ziDoiD0P9xvbDXxrvywNnVYt6%2FD6lpF9Oklk272%2BNJNkGWzn9lNbAV8uefEIIz1OxQyLvZ9OsWUTvHhJWHHVhMmIAxAhNRWE7kqIrlmkjLPqxu4GJC2RIWuNydoW4oiJ12kEJ%2FeYN4h6KFLfzRoc%2BEL0J6KimT8pMrqgdoN7w%2F06e3jzYC25TltZCrzbvUWaa1ebdwhaDKbR8vD%2Fj%2BC2nNn%2F1eFVv8A%3C%2Fdiagram%3E%3Cdiagram%20name%3D%22%E4%B8%80%E8%A6%A7%E7%94%BB%E9%9D%A2%EF%BC%88%E3%83%AD%E3%82%B0%E3%82%A2%E3%82%A6%E3%83%88%E7%8A%B6%E6%85%8B%EF%BC%89%22%20id%3D%22xdCdjmQl0UhfoBZA7uZS%22%3E7Vldj6IwFP01fdyJpRTKI6DOPrjJZiebfa5QpFmkBuqo8%2Bu3haIizexOVkYzGSWxnH5Azz29vbcCFK%2F3jxXd5N9EygrgTNI9QFPgONBFrvrRyKFF%2FMBrgVXFU9PoBDzxF2bAiUG3PGV1r6EUopB80wcTUZYskT2MVpXY9Ztloug%2FdUNXbAA8JbQYor94KvMWJY5%2Fwr8yvsq7J0MvaGvWtGtsZlLnNBW7MwjNAIorIWRbWu9jVmjyOl62bvGS%2FDwIT8Y4XCxWeLeZf2kHm7%2Bly3EKFSvldYd22qGfabE1fJm5ykNHYCW2Zcr0IBOAol3OJXva0ETX7pRkFJbLdaHuoCpmvChiUYiq6YsyrL8Kr2UlfrOzGq%2F56B6ilGd4%2B1H4P87ZcPPMKsn2ZxY3HDwysWayOqgmphYbaxo5d8bdnbQRdFh%2BpgvPNyA1elwdRz5xrgqG9jeYAI1rAgZTzHybCQLPR9S7LdXQQvVoTLtDpmcIEATCaVNwQDQxhdA1VRG6qjVSykiWWBdEQtgyG9EaxLkwBx6YA1qVP5Y5sMUcLohiEIRghkGg7ALBzAdBAKIIzAJAYhBdd3Hc0BxecGfmCEbeCrLMSaxUp97Sw2P6IdJnGnpDR3R0OudUO%2B5YXHdu7wOSje6Qbfhh2fbukO2xY8q7cSSuJaJ5b7JHjh7vyJHcA9uWCPKDsH3pSO6BbVuAqMJBtwkHsY7Oyfz%2F%2BB%2BLTQgvgjtoYdOW%2BwSjken9Xbp6fjyhxYIuWfFd1FxyUaqqpZBSrBVdXYOw4CtdIcUFn3VON3qw9X6lT5MelrTmyUPOaCXHovooyld2QGRhGo3GtG%2BR7VznNYQ0SSUExL0s6AzUAwFuMtC2cTCwj2JEDpxDKUp24UkMRI2VCpZJi%2FHWPE31yFGtlgcvV4um2dQ9IT8MWxoSqntWNMdfuerI1AjRRvBSNvThSF2K0HjygAFW7xqre3i6V5duXslYlOr1KW80wGgtd6zWL1cJSSVdNjO94bodpApkKCZoW7fjqYm8piYPkFCrRrnFkIBoDmYEqFcmuEmgVWH6qabbqekiw4f%2BzcVkyfHNwdf88uDLOCsEwuhTOu8fQHh97SBLAPG%2B2uniwZ521JYVgzBuCsoX%2BZ9Kub1S3JsrxXLcovalMNCH6Wqnilwd5Vwzb7rhMS4MnAfcN4AlAHXxVfhXt6e%2FG5u6sz9t0ewP%3C%2Fdiagram%3E%3Cdiagram%20name%3D%22%E4%BC%9A%E5%93%A1%E6%83%85%E5%A0%B1%E7%AE%A1%E7%90%86%E7%94%BB%E9%9D%A2%22%20id%3D%22PzXZ8zkcWaIftvw8zqT6%22%3E3ZjLcpswFIafRjPdtGMQCLEEjJNF20W8yFoxwqjFyIPl2MnT90iIgA25zYQkje0ZS78uRv93dIRBONkcL2q2LX7JjJfInWVHhOfIdR0Pe%2FCllbtGCULSCOtaZLZTJyzFPbfizKp7kfHdSUclZanE9lRcyariK3WisbqWh9NuuSxPf3XL1nwgLFesHKrXIlNFo1I36PRLLtZF%2B8sOCZuWDWs725XsCpbJQ0%2FCKcJJLaVqSptjwkttXuvL76vtMoir66MryJ%2F7vX%2BZ38rvzWSL1wx5WELNK%2FW2U7vN1Les3Fu%2F7FrVXWtgLfdVxvUkM4TjQyEUX27ZSrceIGRAK9SmhJoDxVyUZSJLWZuxOPf1G%2FSdquVf3msh5qVHyEr19OYF%2BgvXbL255bXixx5x68EFlxuu6jvoYlt9S9OGcwv30MVG2GpFLy5IYEVm43H9MHPnORSs7a9AgKdFwJ3M58EYgpAEmJGPtdoZsXoyp72h0ylBkM%2FiGUopigiiC63QCIU%2BSgMUURQv3pRGxjjNV6MbYkX5TT4hDeqe4fAHOJzRyJ8Khz%2BCAyOKUTQ3BddwMYXIbQvE9qH0q3Ah4SfjQka4LFCcaM8toJYCiJZUX%2FERLInO21HhgBQ4owZeV7LiZ2CsxEqxrqBa8lwP09YKOOAjK29ElumZ4x3QFtX6p%2Bk29zrlyrqmJQnD89Kc4wUM5DBDvJWiUsZGP4YPGJvMfvjIh2tNoO50dfjo7jUcWRVcPhMmFjjbqQPf6YurpWKK3ZiVviAMJ9vspzHlDVOvM5Z68VQxFYym3rNEm3oopoi2yTgKntjizsd5e3ashUNvvWDEW28qb%2BmjefTpbUpMHvX1fo1mCKJcg0hRZAp6BxNTACgxSkMUznUa%2FpxE3OeReO%2BJpN1b4zn0BYH%2FaOr8Tw85fJaQHDJE5I7tmgkZOU8xCjUOTcTTShh9OSLkExIZ%2Fhv91gMAtxXYZKdh4oK7%2BBjFXu92%2FovRek9YUO0eapi23qMhnP4D%3C%2Fdiagram%3E%3Cdiagram%20id%3D%22HnHgd5uRhiilc48GFWVH%22%20name%3D%22%E6%8A%95%E7%A8%BF%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%22%3E5Zhdj6IwFIZ%2FTS93YylQegnozGY%2Fkpk4ySZ7s2GhCrFSg3XU%2BfVboFU6dLOawTFm1MTTt4XC85ZzGgCKl7v7KlnlP3hGGXBG2Q6gMXAc6CJX%2FtXKvlUw8VthXhWZGnQUpsULVeJIqZsio2tjoOCciWJliikvS5oKQ0uqim%2FNYTPOzFlXyZz2hGmasL76s8hE3qqBg4%2F6F1rMcz0z9Enbs0z0YHUn6zzJ%2BLYjoQlAccW5aKPlLqashqe5tMfd%2FaP3cGEVLcUpByxWodiL3w7M2Mvu18NT9ADJJ3WW54Rt1A2rixV7TaDimzKj9UlGAEXbvBB0ukrSuncrPZdaLpZMtqAM%2BxelZ6CVoLuOpC7ynvIlFdVeDlG9SPHam83tkT7GSss75LHmnCjH54czH6HIQHE5g5HTZzTxQRAC4oEJBmEAoru3UZsVjMWc8ao5FlGYeRRLfS0qvqCdHuJjlPjX5XwpzK4FMwKBU9Ntg9BtAvkLVBBGPfDy7oVJ16RY8pK%2BQq6khBXzUjZTyZRKPapZFjIVhKpjWWRZPY3VTtPwIfwJPMMg6PQd8i0GoUsZ5J%2BTK%2BDZq37m1d9a56Xo6O3H9jT4zWcY2oH5NEDfAptYaPuXoo2tWYfEIIybQGYg%2FHEWv%2BNeefGTD7T4D%2B3%2FLX54Mdx6%2B2csfwyIC6IITLymCLyx6A5SQvFnc526ljLqQM%2BCDg6Brsqfv01Z8PT9cSE2aPzofS1sW7o%2BOVVQHV1QkQoI1pV1rIIo1mPIoJucLKHBLLWu7DSgf2YDOeSZ%2Fni63fHnUFgHz%2Bs2e07aTdbEISBE%2BRT0tzm3gN410Pte%2F9F4X%2FTIgp40lZRo4sEtEz8Q1sTxtYl7p%2BYimXBCvd2PXiclud2%2FPTPe0QvZPL5GaPo6L2PQ5C8%3D%3C%2Fdiagram%3E%3Cdiagram%20name%3D%22%E6%8A%95%E7%A8%BF%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%EF%BC%88%E8%BF%94%E4%BF%A1%EF%BC%89%22%20id%3D%22SxDvgnM4ljZaUMOalrSz%22%3E5Zdhj5sgGMc%2FDS%2BXFFHEl9b1bllyy7K%2BuNecUCVDaSi91n36oWIr09zW3NyWnW3Shz8I8v%2FxQAUoq873mu7LB8W4BMGKnQF6D4IAhii0P63S9Eqc4F4otGCu0VXYim%2FciSunHgXjB6%2BhUUoasffFXNU1z42nUa3VyW%2B2U9IfdU8LPhG2OZVT9VEwU%2FYqCeKr%2FoGLohxGhjjpayo6NHYzOZSUqdNIQhuAMq2U6aPqnHHZmjf48nmzLx7Sp7NoTLP6lD9u5ZeP7%2FrO7m655TIFzWvze7sO%2Bq6fqTw6v9xcTTMYqNWxZrztZAXQ%2BlQKw7d7mre1J7tkrFaaStoStOEvPqmb0TPXhp9HnNyT33NVcaMb28TVIseg8YunK9E4dlo5ohkP7KhbRcWl56tTNnBm3WAcmhq3wYCkIInAJgYpAeu711m5E1JmSird3Ys4ZBGPrX4wWn3lo5oEx4jif9D8pbwPZ7xHgASt5X2Qhl1gv8QF6XpCw87e%2BJb71taq5j9wcBKVoqhtMbdGc6uvWy%2BF3XNSV1EJxtphZhn7q2AxaCTyqMFgig3PUENLUYtu2Wrgzfmxi9pPq6vajPT%2Bmssb3F0LIiB%2B3kA8QyCZQYCXQoBnN60kA2nWBXYDi994mgThX06T%2BK2nyaX8szSBizEY%2Fru%2BfLq3BwsESeLOHDI9YV5z3jPKyS6fBZIT%2FrRbMiei0COCoymRy3HyRzYuCGeAJN2GlQwcyH%2FH4eL7wCFejoMtXt9kurrR%2ByDafAc%3D%3C%2Fdiagram%3E%3Cdiagram%20name%3D%22%E4%BC%9A%E5%93%A1%E7%99%BB%E9%8C%B2%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%22%20id%3D%225aGVFjG3XZUNzCns6bzz%22%3E5Zhdb5swFIZ%2FjS9bxTYY%2BxIobbVl0qRqmrSbioET6AiOiJuP%2FvrZYJI48cXQSjY1yUXs146Jz5P3HAPA8WL70KTL4ovIeQXQJN8CfAcQgh721IdWdp0SMNIJ86bMzaSD8FS%2BcSNOjPpa5nxlTZRCVLJc2mIm6ppn0tLSphEbe9pMVPZVl%2BmcnwlPWVqdq9%2FLXBadSlFw0B95OS%2F6K0PCupFF2k82O1kVaS42RxJOAI4bIWTXWmxjXung9XF5%2FEGS5yrMJuULWjOIkk%2Bfb266xe6HfGW%2FhYbX8n2XRt3S67R6NfEye5W7PoCNeK1zrheZABxtilLyp2Wa6dGN%2BssorZCLSvWgav7hLzU7WvNG8u0RJ%2FPLH7hYcNns1BQzig2Dnd3dHIgGgdGKI5pBzy41%2F6L5fuVDpFTDBGtA4PB54BIPRDFgIUh8wDAIIUgCwBiIIpAwQGMQ%2FWVwZ2VVxaISTftdzGHu80DpK9mIX%2FxohJEAp%2BQ%2FxDEWDc9BQ0GYAHqnG5Tpxmns1V6lHWA7kLWo%2BUnUjZRW5bxW3UyFlSs90pErVc4JzcCizHN9GSdRm%2FloiKhvMYLoHBJxMMJjMfKHpBo42A0zX7%2B1Lmp5pHcvl0tI%2BxoRQV9JegLEQYA5EJCxEBCHTTCgXa5qGyqBGSVqGwiE%2FRxlIjMUm6GIXZunCLq1XYW8c6Zw4l%2FQVv05a2gl0gihFjuWNHrX2pSnnM4yp%2Bsyyn%2FOxoTk24iII%2FHtk%2BFFbAehAxED6iBtPKU40A%2FH4ST7EUf2Gw3D9Ov0%2BWX17RFNl2%2FreLrO55TdOIzywQtQYB%2FTELtgAXIicBmhrSkMHmqKqTL3pyWJXl%2B5gRY%2FHFyw2Dj5Dbpd%2FIgW8uC%2FtpDrxnOIhZJ73aVUHwnU2S5ShwQKwrC9U%2BqGrs5mPrxF9pnBc2RKiILbS3rNcU97XV7zHY8V3strqnt4cNeOHT3%2BxMlv%3C%2Fdiagram%3E%3Cdiagram%20name%3D%22%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%22%20id%3D%22x4VfbEl1ExQlSLnqsn3K%22%3E7ZdBk5sgFMc%2FDcd2FCLIMbrZbQ%2FtIZlpp0dWSGSqkhqySfbTFyOsEt2Zpl23nbbmEPg%2FRHk%2F3nsCUFoe72q2zT8oLgoAA34E6AZAGM7QzPw1yqlVCMWtsKklt4M6YSUfhRUDq%2B4lFztvoFaq0HLri5mqKpFpT2N1rQ7%2BsLUq%2FKdu2UYMhFXGiqH6WXKdt2oMSae%2FE3KTuyeHmLaWkrnBdiW7nHF16EloAVBaK6XbVnlMRdE4z%2FmFvF8%2BovuPy%2BUnIlZfIA2%2BMf2mnez2mluellCLSr%2Fs1LCd%2BoEVe%2Bsvu1Z9cg6s1b7iopkkACg55FKL1ZZljfVgtozRcl0Wphea5g%2B%2BqV3Rg6i1OPY42Te%2FE6oUuj6ZIdaKLIOT3z10RAmxWt6jSRw7ZnfR5mnmzlOmYZ11hePQ0HELBGIE5jfnBgRJYBvzmTUl6Necu5ZFkapC1ed7kQh5JIjRd7pWX0XPQjFBDP%2BBOKaiEV2zjcOrPb2Oml%2Bjq0r39PYaI4DP14QEXJayBEI8RIDpCAI8FQL8bECEbvunTklcZLgxMXWm1EUPHRA0ntE%2BJt%2FtlarEBTsrsUJuKtPNDARh9KTxszQ1Ym4NpeS8eczovvBjdLKQwvBt5DOFQ6ZhEA2ZoqmYkp9Lck0jBJRaU5y8aNrjTMTrbDTosljcr6dkFPmE8Bgh%2BJpRF48QosB8otmIMhjivw7DRe7DI7nvdSnQf678EP8DANLfXX7ccWOYq2jYlRSbvW4vK1L8v9rA2XTVxnS7Y9LZ1jtsosV3%3C%2Fdiagram%3E%3Cdiagram%20name%3D%22%E4%BC%9A%E5%93%A1%E6%83%85%E5%A0%B1%E6%9B%B4%E6%96%B0%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%22%20id%3D%22r2voW5foZdrf88kyo_Hp%22%3E5ZdBb5swGIZ%2FjY%2BbwAaDj4GwVpOmHLJp7anysANWCY6I0yT99bPBNHHgsGglmlZyyOf3Mwa%2FD58NAKXrw11DN%2BU3yXgFoMcOAM0BhH6AAv1nlGOnRAR3QtEIZjudhKV45Vb0rLoTjG%2BdjkrKSomNK%2BayrnmuHI02jdy73Vaycq%2B6oQUfCMucVkP1p2Cq7NQYRif9noui7K%2FsY9Jl1rTvbGeyLSmT%2BzMJZQCljZSqi9aHlFfGvN6XfQbvl8V8IQ4%2FoHqcLRbfnzefusG%2BXHPK2xQaXqv3HRp2Q7%2FQamf9snNVx97ARu5qxs0gHkDJvhSKLzc0N9m9fmS0Vqp1pVu%2BDv%2FwTu2MXnij%2BOGMk73zOy7XXDVH3cVmkWVwdJv7E9Eoslp5RjPq2VH7FBVvI5%2Bc0oE16wrj0NC4LABJCsgMZCEgCMx8kGEQIxCHRpl5IGkVkoAkaAMMEu%2Fv7F6JqkplJZv2XMR9FvJI61vVyGd%2BliE4QhT%2Fg4Cm4hNc82D7Vzu9Cs3P6LJWZ3p3jBHA7TEhgX7dsgR8PESAyQgCPBWCcKREdGV4IJ6bICYmuISiJ6tc510na1nzCxxWopUoat3Mta9c64mxTuiNYGYTa8GYucwoarfsJqsSDD%2BHLiY4xOR74RATmgoTHsE0WKUyvYz5gJA2gCBO3nXdYpTHq3y0avKY%2F1pNSSR0eeAxHvCWZRON8CAGQ0x6DPF%2Fh%2BFi8cIji9dtKcQfbv%2BI3B0ckhvuH3TB2NNx8bATAX96fYiDx%2BKrfZ11CwGZFyrzZtUG%2BnXLKomtiFnfxxaLTqU2lZAPv9nAYLrNRjdPn0Jt7uyDEmW%2FAQ%3D%3D%3C%2Fdiagram%3E%3Cdiagram%20name%3D%22%E8%A9%B3%E7%B4%B0%E7%94%BB%E9%9D%A2%22%20id%3D%22-AzJEhtHHPyheJ09MKhu%22%3E7Vrbcto6FP0aPZ6M75YfsTFNOLm0SS%2Bc89IRWLbV2JbHFgH69ZVscTFoUjoJkHQgzCAtXbDWXtp7SwSYQT7%2FUKEyvaERzoChRXNg9oFh6JZp8Q%2BBLFrE9ZwWSCoSyU5r4IH8xBLUJDolEa47HRmlGSNlF5zQosAT1sFQVdFZt1tMs%2B63lijBO8DDBGW76DcSsbRFoeGu8UtMknT5zbrjtS05WnaWK6lTFNHZBmSGwAwqSllbyucBzgR5S14i%2BFjqxv%2BX4zr5%2BNU2jWw0D%2F5pJxv8yZDVEipcsNed2minfkLZVPIl18oWSwIrOi0iLCbRgOnPUsLwQ4kmonXGJcOxlOUZr%2Bm8uOeTyhU94Yrh%2BYad5JN%2FwDTHrFrwLrLVlDZYdKuztUVdV2LphjWhJUEkVZSsZl4zxQuSrD8gztklLrQB9ADsgdADngd61suojEmWBTSjVTPWjBCG8YTjNavoI95ocSYQj%2BMDkm%2B4XfZtd5d%2B3VDQ7xyKfVfBvgM8H%2FhWU3CAr%2F0t7OvaCdnHs1ma94f58OYm%2Fnx7d%2BsU3lD6mS77A%2BAHAELBPt8Bng1CF%2FQg8AcghABqANpif3i80F929nYsxBlhOxwXtMBbBpEQykhS8GqGYzFMUEq44%2B9JOCdRJGb2a25lUiTXTbe%2BtUbuJVkConx4nDX%2BPeUDMZ%2FBLykpWMOe7fM3X3egXdjA5s8a8Lq%2BrvO36F6xgBb88RFpNIBRzWa4Fg9XUYYYGjcr3Ud%2BtGAylurOAcXlbGlLIS1dIS37UNLSn5OWBfw%2B8IJGY1BoSWx1LjP7rKg3q6iV9zqGpEYwLbOa%2FvvftJx%2Bv4Zfw%2FAyfd5bmQDqAFrbhV6%2F0ZYtwshZWyfL%2BhzYFZOzp5bMV9CSffeNPAWG%2FeXqk49Gt49fhoar0tK2KpZ2vUZjnH2kNWGECvuOKWM0Vxie0S02%2BTmjFJPl80QcyS7GqCaTixSjih2MaLtLtCLFMA%2FEc4lDi1aLxfxqxO4u721SDb8r96wLPB4A%2FCbN5pt08ML8bsMdwt18L46xM1Hme5HrjTXtiPmerlC9o7LG6qD6EnNY1Y05ptPwx71%2BT4dXyYjcYqU5uAmMJr1rCr3Wc5pLp2qCnn92mCcPxuZWNLaMI0ZjpZRUCZ4jkrpeIE9u0D0L580Jx9ZPLZzXvqn6XQCwxZ%2FywN%2B85AwbePs6YmBw9g0Munsoo9iK3dwc%2BnmoFse1AejpLzTTm7mHsaytLXHMexgl%2B6pbsHNYfgfedSWT5U6Gp%2FauUCGl85Xe%2BxSX3hWXe%2FLQ7Z1zvvcgnO2cz933uuVwh4Vn7%2B7O18HvQFQ73kjx0%2B1riYpX17%2FGN20b%2F9Nghr8A%3C%2Fdiagram%3E%3C%2Fmxfile%3E)

# 今後の改良予定
* フロントエンドのテストコードを記述し、自動テストをより充実させる。（現在着手中）
* パスワードの変更をできるようにする。
