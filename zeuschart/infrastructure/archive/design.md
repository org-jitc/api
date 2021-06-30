# 概要
1日分のデータをCSVファイルとしてレスポンスする機能

# 機能概要
## Ver.1
1. 1日分データを取得しマップに格納する
2. StringBuilderを用いてCSV Stringを組む
3. CSV Stringをレスポンスする

## Ver.2
Ver.1にはメモリ使用量が多いことによってTomcatサーバーの再起動問題を起こすためVer.2を設計
1. 1時間分のデータを取得しマップに格納する
2. マップのデータを臨時ファイルに書き込む
3. 1と2を24回繰り返す
4. 臨時ファイルをレスポンスする

# アーカイブ
|url|マスター|バージョン|
|:-:|:-:|:-:|
|/zeuschart/Mieruka/Archive/Energy.do|mst_electric_energy_record_realtime|Ver.2|
|/zeuschart/Mieruka/Archive/Demand.do|mst_electric_energy_record_realtime_demand|Ver.2|
|/zeuschart/InputInfo/Archive.do|mst_input_status_history|Ver.2|
||mst_node_status_history|Ver.1|
||mst_period_data_csv|Ver.1|
||mst_spp_network_status|Ver.1|
|/zeuschart/Mieruka/Archive/Env.do|mst_temperature_record_realtime|Ver.2|

# 画面CSV
|url|バージョン|
|:-:|:-:|
|/zeuschart/InputInfo/CSV.do|Ver.2|