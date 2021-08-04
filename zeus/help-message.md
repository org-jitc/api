# ヘルプメッセージ
あらゆるメニューで項目について説明するメッセージを定義する機能である。

* [1. 要望](#1)
* [2. 機能設計](#2)
* [3. 機能実現](#3)
* [4. DB設計](#4)
* [5. フィールド設計](#5)
    * [5.1 mst_simple_operation]

## <label id="1">1. <mark>要望</mark></label>
* 画面でヘルプメッセージを編集できる（様式あり）
* 特定メニューでヘルプメッセージを表示させる
    * クエスチョンマークにマウスを置くことで編集したヘルプメッセージを表示させる
    * クエスチョンマークはトグルのOn・Offによって表示または非表示する
* 後から表示したい項目が増えた場合，なるべくwarの置き換えをしない様にする

## <label id="2">2. <mark>機能設計</mark></label>
### 2.1 ヘルプメッセージの編集
* 「ヘルプメッセージ」編集画面でメニューごとに、各項目についてヘルプメッセージを編集する
### 2.2 ヘルプメッセージの表示
* クエスチョンマークを表示・非表示する**トグル**をヘルプメッセージを表示させたいページに追加する
    * **On**
        * 項目名の後ろにクエスチョンマークを表示させる
    * **Off**
        * 項目名の後ろのクエスチョンマークを非表示させる
    * **デフォルト：Off**
* クエスチョンマークにマウスを置いた場合
    * 1.1で設定したヘルプメッセージを表示させる
* warの置き換えを減らすための設計
    * 案1
        * メニューごとにバックサイドでDBに登録されたヘルプメッセージを取得し、画面に送る
        * メニューごとに画面で，全ての項目の後ろにクエスチョンマークをつける
        * 登録されていない項目のクエスチョンマークは画面から消す
    * 案2
        * バックサイドで共通インターフェースを用意する
        * 画面の方では共通インターフェースからDBに登録されたヘルプメッセージを取得する
        * メニューごとに画面で，全ての項目の後ろにクエスチョンマークをつける
        * 登録されていない項目のクエスチョンマークは画面から消す

## <label id="3">3. <mark>機能実現</mark></label>
### 3.1 ヘルプメッセージの編集
* TinyMCEを使って様式ありの編集機能を実現する
### 3.2 ヘルプメッセージの表示
* トグル
    * Bootstrap Toogleを使って機能を実現する
* クエスチョンマーク
    * Bootstrap3のPopover機能を使ってマウスを置いた場合の表示機能を実現する
* warの置き換えを減らすための設計の実現

|案1|バックサイド修正|画面修正|war置き換え|
|-|-|-|-|
|メニュー初回機能追加|必要|必要|必要|
|機能追加後の既存項目追加|不要|不要|不要|
|機能追加後の新項目追加|不要|必要|必要|

|案2|バックサイド修正|画面修正|war置き換え|
|-|-|-|-|
|メニュー初回機能追加|不要|必要|必要|
|機能追加後の既存項目機能追加|不要|不要|不要|
|機能追加後の新項目機能追加|不要|必要|必要|

* 案2を採用
    1. ヘルプメッセージを必要とする画面にトグルを追加
    2. ヘルプメッセージを必要とする画面の全ての項目にクエスチョンマークをつける
    3. 画面ローディング後，ajaxによりヘルプメッセージを取得する
    4. ajaxによって取得したデータによって表示・非表示設定を行う

## <label id="4">4. <mark>DB設計</mark></label>
### <label id="4.1">4.1 mst_help_message_table</label>
#### 4.1.1 フィールド

|名前|タイプ|長さ|少数|ヌルでない|キー|注釈行|デフォルト|
|-|-|-|-|-|-|-|-|
|table_name|varchar|0|0|〇|〇|||
|table_name_key|varchar|0|0|〇||||
|table_data_type|varchar|255|0|||mst_system_menu_flat.data_typeと同じ|single|

### <label id="4.2">4.2 mst_help_message_field</label>
#### 4.2.1 フィールド

|名前|タイプ|長さ|少数|ヌルでない|キー|注釈行|デフォルト|
|-|-|-|-|-|-|-|-|
|table_name|varchar|0|0|〇|〇|||
|table_field|varchar|0|0|〇|〇|||
|table_field_key|varchar|0|0|〇||||
|message|varchar|0|0|〇|||準備中|
|field_order|int2|16|0||||1|
|display_menu_id|varchar|0|0|||表示させたいメニューIDのカンマ区切り文字列||

#### 4.2.2 外部キー

|名前|フィールド|被参照スキーマ|被参照テーブル|被参照フィールド|削除時|更新時|注釈行|
|-|-|-|-|-|-|-|-|
|fk_mst_help_message_table_table_name|table_name|public|mst_help_message_table|table_name|CASCADE|NO ACTION||

## <label id="5">5. <mark>フィールド設計</mark></label>
### <label id="5.1">5.1 mst_simple_operation</label>

|項目|classフィールド|DBフィールド|
|-|-|-|
|制御対象機器名|nodeId|msg_node_id|
|制御モード|controlMode|msg_control_mode|
|省エネ運転時間|onSecond|msg_on_minute|
|通常運転時間|offSecond|msg_off_minute|
|環境制御モード|temperatureControlMode|msg_temperature_control_mode|
|温度センサー・CO2センサー|temperatureSensorId|msg_temperature_sensor_id|
|設定温度(冷)・設定CO2濃度（下限オーバー）|targetTemperatureCooling|msg_target_temperature_cooling|
|許容誤差温度(冷)・許容誤差CO2濃度（下限オーバー）|offsetTemperatureCooling|msg_offset_temperature_cooling|
|設定温度(暖)・設定CO2濃度（上限オーバー）|targetTemperatureHeating|msg_target_temperature_heating|
|許容誤差温度(暖)・許容誤差CO2濃度（上限オーバー）|offsetTemperatureHeating|mst_offset_temperature_heating|
|モード切替温度（冷房⇒暖房）|offsetTemperatureModeChange|msg_offset_temperature_mode_change|
|モード切替温度（暖房⇒冷房）|offsetTemperatureModeChangeHeating|msg_offset_temperature_mode_change_heating|
|制御開始閾値温度(冷)・制御開始閾値不快指数(冷)|thresholdTemperatureCoolingOn|msg_watching_threshold_temperature_cooling_on|
|制御開始維持閾値温度(冷)・制御開始閾値不快指数(冷)|watchingThresholdTemperatureCoolingKeep|msg_watching_threshold_temperature_cooling_keep|
|制御開始維持閾値秒数(冷)|watchingThresholdTemperatureCoolingKeepSec|msg_watching_threshold_temperature_cooling_keep_sec|
|制御解除閾値温度(冷)・制御解除閾値不快指数(冷)|thresholdTemperatureCooling|msg_watching_threshold_temperature_cooling|
|制御開始閾値温度(暖)・制御解除閾値不快指数(暖)|thresholdTemperatureHeatingOn|msg_watching_threshold_temperature_heating_on|
|制御開始維持閾値温度(暖)・制御解除閾値不快指数(暖)|watchingThresholdTemperatureHeatingKeep|msg_watching_threshold_temperature_heaing_keep|
|制御開始閾値秒数(暖)|watchingThresholdTemperatureHeatingKeepSec|msg_watching_threshold_temperature_heating_keep_sec|
|制御解除閾値温度(暖)・制御解除閾値不快指数(暖)|thresholdTemperatureHeating|msg_watching_threshold_temperature_heating|
|デマンド制御時閾値温度(冷)・デマンド制御時閾値不快指数(冷)|thresholdTemperatureCoolingDemand|msg_watching_threshold_temperature_cooling_demand|
|デマンド制御時閾値温度(暖)・デマンド制御時閾値不快指数(暖)|thresholdTemperatureHeatingDemand|msg_watching_threshold_temperature_heating_demand|
|閾値湿度 (下限)|thresholdHumidityLower|msg_watching_threshold_humidity_lower|
|閾値湿度 (上限)|thresholdHumidityUpper|msg_watching_threshold_humidity_upper|
|CO2濃度演算方法（下限オーバー）・温度演算方法（冷）|temperatureOperationMethodCooling|msg_temperature_operation_method_cooling|
|CO2濃度演算方法（上限オーバー）・温度演算方法（暖）|temperatureOperationMethodHeating|msg_temperature_operation_method_heating|
|電力量センサー|electricEnergySensorId|msg_electric_energy_sensor_id|
|制御開始負荷電力|watchingThresholdElectricEnergyOn|msg_watching_threshold_electric_energy_on|
|制御開始判断負荷電力|watchingThresholdElectricEnergyOnJudge|msg_watching_threshold_electric_energy_on_judge|
|制御解除負荷電力|watchingThresholdElectricEnergyOff|msg_watching_threshold_electric_energy_off|
|最低通常時間|watchingTime|msg_watching_time|
|目標電力|estimateThresholdElectricEnergy|msg_estimate_threshold_electric_energy|
|デマンド制御ロック時間|alarmLockTime||
|デマンド警報メール|demandMail|msg_demand_mail|
|制御連携出力：モード|controlLinkNodePriority||
|制御連携出力：条件|controlLinkNodeCondition||
|稼働率|operationRate||
|稼働率判定時間|operationRateJudgeSec||
|稼働率判定方法|operationRateJudgeMode||
|更新周期|PojoAutoThreshold.updateFrequency||
|監視範囲|PojoAutoThreshold.lookupTime||
|モード（制御開始負荷電力）|PojoAutoThreshold.mode||
|最大閾値電力（制御開始負荷電力）|PojoAutoThreshold.maximum||
|最小閾値電力（制御開始負荷電力）|PojoAutoThreshold.minimum||
|閾値電力算出率（制御開始負荷電力）|PojoAutoThreshold.percentage||
|モード（制御開始判断負荷電力）|PojoAutoThreshold.modeJudge||
|最大閾値電力（制御開始判断負荷電力）|PojoAutoThreshold.maximumJudge||
|最小閾値電力（制御開始判断負荷電力）|PojoAutoThreshold.minimumJudge||
|閾値電力算出率（制御開始判断負荷電力）|PojoAutoThreshold.percentageJudge||