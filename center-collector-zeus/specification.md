# データ修復仕様
## 1. 初めに
### 1.1. 目的
一括サーバーの合わない、足りないデータをローカルサーバーから再取得することを目的とする。
### 1.2. 定義
#### 1.2.1 修復記録状態
修復記録の状態には「新規(new)、修復中(reparing)、完了(success)、エラー(error)」の四つの状態がある。

### 1.2. 背景
一括データ取得モジュールを入れるタイミング、削減電力量の再計算等の要素を考えると，一括サーバーのデータとローカルサーバーのデータが合わないことが発生する可能性がある。

## 2. 機能
### 2.1. データ取得
* mst_data_repair_record.is_targetがtrueであるレコードをもとにデータを取得する
* 店舗ごとにスレッドで処理する
* データ取得期間が長すぎて，データ量が多い場合を考慮し，ループで1日ずつデータを取得する

### 2.2 データ保存
* データ取得に成功したら，DBに保存する

### 2.3 状態更新
* プロセス開始時にmst_data_repair_recordの
	* statusをreparingにする
	* start_datetimeを記録する
	* is_targetをfalseにする
	* error_messagesをnullにする
* 店舗データ取得時エラーが発生したらmst_data_repair_recordの
	* statusをerrorにする
	* end_datetimeを記録する
	* error_messagesに記録する
* 店舗データ取得以外のところでエラーが発生した場合，mst_data_repair_recordの
	* statusをerrorにする
	* end_datetimeを記録する
* 成功の場合mst_data_repair_recordの
	* statusをsuccessにする
	* is_targetをfalseにする

# 詳細設計
## 1. DB設計
### mst_data_repair_record

|名前|タイプ|長さ|少数|ヌルでない|キー|注釈|
|-|-|-|-|-|-|-|
|id|varchar|0|0|〇|〇||
|register_datetime|varchar|0|0|〇||登録時刻|
|granularity|varchar|0|0|〇||粒度|
|energy_sensor_type|varchar|0|0|||エネルギーセンサー：「1:電力量センサー」カンマ区切りの組み合わせ|
|env_sensor_type|varchar|0|0|||環境センサー：「0:温度センサー、1:温湿度センサー」カンマ区切りの組み合わせ|
|enudge_release|bool|0|0|||true: 解除率取得，false、null: 解除率取得しない|
|from_date|date|0|0|〇||取得期間：開始日|
|to_date|date|0|0|〇||取得期間：終了日|
|start_datetime|varchar|0|0|||プロセス開始時刻|
|end_datetime|varchar|0|0|||プロセス終了時刻|
|status|varchar|0|0|〇||プロセス状態|
|store_keys|varchar|0|0|〇||カンマ区切りのチェックされた店舗キー文字列|
|error_messages|varchar|0|0|||{店舗名:エラーメッセージ}文字列|