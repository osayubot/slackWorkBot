
## SlackWorkBot の使い方

「開始」or「終了」の文字を入力することで、自動で GoogleSpreadSheet に作業時間を入力してくれます。
その際に「メモ：〇〇」と記入することで、メモ：以降の文字列を保存します。
そのため作業内容も記録することが可能です。

https://user-images.githubusercontent.com/81318499/131246026-1fa85072-aa2b-4737-8c71-2872218ec0d2.mov


## SlackWorkBot の導入方法

### IncomingWebhook（Slack）の設定

- カスタムインテグレーションより、IncomingWebhook を追加
- SlackWorkBot を導入したいチャンネルを設定する
- Bot の通知アイコンや名前はご自由にどうぞ
- WebhookURL をコピーする

### GoogleAppScript の設定

- main.gs を貼り付ける
- 先ほどコピーした WebhookURL を 10 行目の変数 url に代入する
- デプロイ → 新しいデプロイを選択。デプロイの種類を「ウェブアプリ」に、アクセスできるユーザーを全員に変更し、デプロイ
- ウェブアプリの URL（https://script.google.com/macros/s/....） をコピーする

### OutgoingWebhook の設定

- カスタムインテグレーションより、OutgoingWebhook を追加
- SlackWorkBot を導入したいチャンネル（先ほど IncomingWebhook で設定したチャンネル）を設定する
- 引き金となる言葉に　開始,終了　を入力
- URL に先ほどコピーしたウェブアプリの URL を入力する
- 設定を保存する
