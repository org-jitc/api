# ヘルプメッセージ
あらゆるメニューで項目について説明するメッセージを定義する機能である。

* [1. 要望](#1)
* [2. 機能設計](#2)
* [3. 機能実現](#3)
* [4. DB設計](#4)
* [5. フィールド設計](#5)
    * [5.1 mst_simple_operation](#5.1)
    * [5.2 mst_electric_energy_sensor](#5.2)
    * [5.3 mst_node](#5.3)

## <label id="1">1. <mark>要望</mark></label>
* 画面でヘルプメッセージを編集できる（様式あり）
* 特定メニューでヘルプメッセージを表示させる
    * クエスチョンマークにマウスを置くことで編集したヘルプメッセージを表示させる
    * クエスチョンマークはトグルのOn・Offによって表示または非表示する
    * セッションレベルでメニューごとのトグルの状態を記憶する
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

|項目|classフィールド|DBフィールド|表示メニューID|
|-|-|-|-|
|制御対象機器名|nodeId|msg_node_id|simpleOperation|
|制御モード|controlMode|msg_control_mode|simpleOperation|
|省エネ運転時間|onSecond|msg_on_minute|simpleOperation|
|通常運転時間|offSecond|msg_off_minute|simpleOperation|
|環境制御モード|temperatureControlMode|msg_temperature_control_mode|simpleOperation|
|温度センサー・CO2センサー|temperatureSensorId|msg_temperature_sensor_id|simpleOperation|
|設定温度(冷)・設定CO2濃度（下限オーバー）|targetTemperatureCooling|msg_target_temperature_cooling|simpleOperation|
|許容誤差温度(冷)・許容誤差CO2濃度（下限オーバー）|offsetTemperatureCooling|msg_offset_temperature_cooling|simpleOperation|
|設定温度(暖)・設定CO2濃度（上限オーバー）|targetTemperatureHeating|msg_target_temperature_heating|simpleOperation|
|許容誤差温度(暖)・許容誤差CO2濃度（上限オーバー）|offsetTemperatureHeating|mst_offset_temperature_heating|simpleOperation|
|モード切替温度（冷房⇒暖房）|offsetTemperatureModeChange|msg_offset_temperature_mode_change|simpleOperation|
|モード切替温度（暖房⇒冷房）|offsetTemperatureModeChangeHeating|msg_offset_temperature_mode_change_heating|simpleOperation|
|制御開始閾値温度(冷)・制御開始閾値不快指数(冷)|thresholdTemperatureCoolingOn|msg_watching_threshold_temperature_cooling_on|simpleOperation|
|制御開始維持閾値温度(冷)・制御開始閾値不快指数(冷)|watchingThresholdTemperatureCoolingKeep|msg_watching_threshold_temperature_cooling_keep|simpleOperation|
|制御開始維持閾値秒数(冷)|watchingThresholdTemperatureCoolingKeepSec|msg_watching_threshold_temperature_cooling_keep_sec|simpleOperation|
|制御解除閾値温度(冷)・制御解除閾値不快指数(冷)|thresholdTemperatureCooling|msg_watching_threshold_temperature_cooling|simpleOperation|
|制御開始閾値温度(暖)・制御解除閾値不快指数(暖)|thresholdTemperatureHeatingOn|msg_watching_threshold_temperature_heating_on|simpleOperation|
|制御開始維持閾値温度(暖)・制御解除閾値不快指数(暖)|watchingThresholdTemperatureHeatingKeep|msg_watching_threshold_temperature_heaing_keep|simpleOperation|
|制御開始閾値秒数(暖)|watchingThresholdTemperatureHeatingKeepSec|msg_watching_threshold_temperature_heating_keep_sec|simpleOperation|
|制御解除閾値温度(暖)・制御解除閾値不快指数(暖)|thresholdTemperatureHeating|msg_watching_threshold_temperature_heating|simpleOperation|
|デマンド制御時閾値温度(冷)・デマンド制御時閾値不快指数(冷)|thresholdTemperatureCoolingDemand|msg_watching_threshold_temperature_cooling_demand|simpleOperation|
|デマンド制御時閾値温度(暖)・デマンド制御時閾値不快指数(暖)|thresholdTemperatureHeatingDemand|msg_watching_threshold_temperature_heating_demand|simpleOperation|
|閾値湿度 (下限)|thresholdHumidityLower|msg_watching_threshold_humidity_lower|simpleOperation|
|閾値湿度 (上限)|thresholdHumidityUpper|msg_watching_threshold_humidity_upper|simpleOperation|
|CO2濃度演算方法（下限オーバー）・温度演算方法（冷）|temperatureOperationMethodCooling|msg_temperature_operation_method_cooling|simpleOperation|
|CO2濃度演算方法（上限オーバー）・温度演算方法（暖）|temperatureOperationMethodHeating|msg_temperature_operation_method_heating|simpleOperation|
|電力量センサー|electricEnergySensorId|msg_electric_energy_sensor_id|simpleOperation|
|制御開始負荷電力|watchingThresholdElectricEnergyOn|msg_watching_threshold_electric_energy_on|simpleOperation|
|制御開始判断負荷電力|watchingThresholdElectricEnergyOnJudge|msg_watching_threshold_electric_energy_on_judge|simpleOperation|
|制御解除負荷電力|watchingThresholdElectricEnergyOff|msg_watching_threshold_electric_energy_off|simpleOperation|
|最低通常時間|watchingTime|msg_watching_time|simpleOperation|
|目標電力|estimateThresholdElectricEnergy|msg_estimate_threshold_electric_energy|
|デマンド制御ロック時間|alarmLockTime|msg_alarm_lock_time|
|デマンド警報メール|demandMail|msg_demand_mail|simpleOperation|
|制御連携出力|controlLinkNode|msg_control_link_node|
|稼働率|operationRate|msg_operation_rate|
|稼働率判定時間|operationRateJudgeSec|msg_operation_rate_judge_sec|
|稼働率判定方法|operationRateJudgeMode|msg_operation_rate_judge_mode|
|更新周期|PojoAutoThreshold.updateFrequency|msg_update_frequency|
|監視範囲|PojoAutoThreshold.lookupTime|msg_lookup_time|
|モード（制御開始負荷電力）|PojoAutoThreshold.mode|msg_auto_threshold_mode|
|最大閾値電力（制御開始負荷電力）|PojoAutoThreshold.maximum|msg_auto_threshold_maximum|
|最小閾値電力（制御開始負荷電力）|PojoAutoThreshold.minimum|msg_auto_threshold_minimum|
|閾値電力算出率（制御開始負荷電力）|PojoAutoThreshold.percentage|msg_auto_threshold_percentage|
|モード（制御開始判断負荷電力）|PojoAutoThreshold.modeJudge|msg_auto_threshold_mode_judge|
|最大閾値電力（制御開始判断負荷電力）|PojoAutoThreshold.maximumJudge|msg_auto_threshold_maximum_judge|
|最小閾値電力（制御開始判断負荷電力）|PojoAutoThreshold.minimumJudge|msg_auto_threshold_minimum_judge|
|閾値電力算出率（制御開始判断負荷電力）|PojoAutoThreshold.percentageJudge|msg_auto_threshold_percentage_judge|

### <label id="5.2">5.2 mst_electric_energy_sensor</label>

|項目|classフィールド|DBフィールド|表示メニューID|
|-|-|-|-|
|グループ|groupId|msg_group_id|
|センサー名|electricEnergySensorName|msg_electric_energy_sensor_name|
|センサー名（英）|electricEnergySensorNameEn|msg_electric_energy_sensor_name_en|
|エネルギー種別|sensorType|msg_sensor_type|
|電力表示種別|measurementDataType|msg_measurement_data_type|
|設備種別|deviceTypeId|msg_device_type_id|
|通信方式|comselect|msg_comselect|
|IPアドレス : ポート番号|ipAddress|msg_ip_and_port|
|デバイス名|deviceId|msg_device_id|
|MACアドレス|macAddress|msg_mac_address|
|接続方式|connectionMode|msg_connection_mode|
|プロトコル|protocol|msg_protocol|
|電力値書込IPアドレス : ポート番号|plcIpAddress|msg_plc_ip_address|
|電力値書込レジスタアドレス|plcRegisterAddress|msg_plc_register_address|
|1パルスあたりの量|whperpulse|msg_wh_per_puls|
|換算係数選択|energyType<br>energyTypeNight|msg_energy_type|
|供給電気方式|phasewire|msg_phasewire|
|電圧|fixedMilliVoltage|msg_fixed_milli_voltage|
|力率|fixedPowerFactor|msg_fixed_power_factor|
|非測定エネルギーセンサー制御時電流|nonMeasuredControlCurrent|msg_non_measured_control_current|
|非測定エネルギーセンサー制御解除時電流|nonMeasuredUncontrolCurrent|msg_non_measured_uncontrol_current|
|非測定エネルギーセンサー電圧|nonMeasuredVoltage|msg_non_measured_voltage|
|非測定エネルギーセンサー力率|nonMeasuredPowerFactor|msg_non_measured_power_factor|
|非測定エネルギーセンサー出力接点|nonMeasuredNodeId|msg_non_measured_nodeId|
|削減電力用定格電力|ratedPower|msg_rated_power|
|削減電力用閾値電力|reductionThresholdEnergy|msg_reduction_threshold_energy|
|削減ガス量用出力設定|reductionGasNodeId|msg_reduction_gas_node_id|
|リアルタイム電流表示|realtimeDispCurrent|msg_realtime_disp_current|
|リアルタイム電圧表示|realtimeDispVoltage|msg_realtime_disp_voltage|
|メーカー|maker|msg_maker|simpleOperation|
|型式|modelNo|msg_model_no|simpleOperation|
|定格出力|coolingHeatingFlag<br>ratedOutputCooling<br>ratedOutputHeating|msg_rated_output|simpleOperation|
|備考（制御方法等）|controlMethod|msg_control_method|simpleOperation|
|調光グループ|dimmingGroupId|msg_dimming_group_id|
|制御ID|controlId|msg_control_id|
|親機ID|childId|msg_child_id|
|子機ID|boxId|msg_box_id|
|グラフの色（電力等）|rgb|msg_rgb|
|グラフの色（削減電力量）|reduceRgb|msg_reduce_rgb|
|アラート通知設定|alertLimitMinute<br>alertLimitCount|msg_alert_notification|
|電池電圧閾値|cellVoltageThreshold|msg_cell_voltage_threshold|
|構成センサー（加算）|physicalSensor|msg_physical_sensor|
|構成センサー（減算）|physicalSensorSubtraction|msg_physical_sensor_subtraction|
|加算減算結果補正|virtualSensorCorrection|msg_virtual_sensor_correction|
|取得方法|dataGetMethod|msg_data_get_method|
|センサー種別|measuretype|msg_measuretype|
|遮断制御|cutstatus|msg_cutstatus|
|施設名称|facilities|msg_facilities|
|目標電力|targetE|msg_target_electricity|facilityInfo|
|限界電力|limitE|msg_limit_electricity|facilityInfo|
|契約電力|contractE|msg_contract_electricity|facilityInfo|
|遮断電力|breakingE|msg_cutoff_electricity|facilityInfo|
|復帰電力|returnE|msg_return_electricity|facilityInfo|
|初期電力|initialE|msg_initial_electricity|facilityInfo|
|デマンド制御ロック時間|alarmLockTime|msg_alarm_lock_time|facilityInfo|
|~~パルス入力デマンド計測~~||msg_measure_demand|

### <label id="5.3">5.3 mst_node</label>

|項目|classフィールド|DBフィールド|表示メニューID|
|-|-|-|-|
|グループ|groupId|msg_group_id|
|出力名|nodeNameStr|msg_node_id|
|機器タイプ|nodeType|msg_node_type|
|通信方式|comMethod|msg_comm_type|
|IPアドレス：ポート番号|comMethod|msg_ip_port|
|デバイス名|deviceId|msg_device_id|
|接続方式|connectionMode|msg_connection_mode|
|制御ID|wirelessId|msg_wireless_id|
|制御ポート|channelType<br>channelList<br>controlWaitTime<br>controlSwitchingOrder<br>capacityChannelList<br>capacityWaitTime<br>capacitySwitchingOrder<br>capacityDemandMode<br>controlStatusOffword<br>controlStatusOnword<br>controlStatusOnwordCapacity|msg_channel|
|デマンド制御|demandControl|msg_demand_control|simpleOperation|
|プロトコル|protocol|msg_protocol|
|親機ID|childId|msg_child_id|
|子機ID|boxId|msg_box_id|
|省エネ運転最低時間|onMinMitute|msg_on_min_minute|simpleOperation|
|通常運転最低時間|offMinMitute|msg_off_min_minute|simpleOperation|
|アラート通知設定|alertLimitMinute<br>alertLimitCount|msg_alert_notify|
|運転判断電力量センサー|electricEnergySensorId|msg_electric_energy_sensor_id|simpleOperation|
|運転判断閾値電力|thresholdEnergy|msg_threshold_energy|simpleOperation|
|入力監視対象|inputWatchingTarget|msg_input_watching_target|simpleOperation|
|入力監視処理|inputWatchingProcess|msg_input_watching_process|simpleOperation|
|入力ON時表示|inputWatchingOnword|msg_input_watching_onword|
|通常無制御入力監視対象|controlInputCondition<br>controlInputIds|msg_control_input|
|削減電力判断入力対象|inputId|msg_input_id|
|削減効果演算方法|reductionCalculationMethod|msg_reduction_calculation_method|
|削減電力表示方法|reductionDispMode|msg_reduction_disp_mode|
|制御ロック秒数|controlLockSec|msg_control_lock_sec|
|削減電力グループ|reduceEnergyGroupId|msg_reduce_energy_group_id|simpleOperation|
|削減電力グループ内順位|reduceEnergyGroupPriority|msg_reduce_energy_group_priority|simpleOperation|
|ON切替時監視|onCheck|msg_on_check|
|ON切替時文言|onWord|msg_on_word|
|OFF切替時監視|offCheck|msg_off_check|
|OFF切替時文言|offWord|msg_off_word|
|電力変化前制御検出モニター時間|beforeSec|msg_before_sec|
|電力変化後制御検出モニター時間|afterSec|msg_after_sec|