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
|-|-|-|
|/zeuschart/Mieruka/Archive/Energy.do?date=yyyy-MM-dd|mst_electric_energy_record_realtime|Ver.2|
|/zeuschart/Mieruka/Archive/Demand.do|mst_electric_energy_record_realtime_demand|Ver.2|
|/zeuschart/InputInfo/Archive.do|mst_input_status_history|Ver.2|
|/zeuschart/ChartViewer?c=2&csvtype=db&fromdate=yyyy-MM-dd,HH:mm<br>redirect:/zeuschart/node/status/archive.do?date=yyyy-MM-dd|mst_node_status_history<br>mst_node_threshold_status_history<br>mst_node_load_factor_history|Ver.2|
|/zeuschart/CSVOutput?csvtype=db&ys=yyyy&ms=M&ds=d<br>redirect:/zeuschart/PeriodOutput/archive/get.do?date=yyyy-MM-dd|mst_electric_energy_record<br>mst_temperature_record|Ver.2|
|/zeuschart/WirelessStateHistory/GetArchiveCSV.do?archiveDate=yyyy-MM-dd<br>redirect:/zeuschart/spp/network/status/archive/get.do?date=yyyy-MM-dd|mst_spp_network_status|Ver.2|
|/zeuschart/Mieruka/Archive/Env.do|mst_temperature_record_realtime|Ver.2|

# 画面CSV

|メニュー|url|バージョン|
|-|-|-|
|入力接点状況|/zeuschart/InputInfo/CSV.do|Ver.2|

# アーカイブするマスターの一日のレコード数：szmpa

|テーブル|バージョン|2021-06-30|2021-06-29|2021-06-28|
|-|-|-|-|-|
|mst_input_status_history|Ver.2|531,951|529,299|532,836|
|mst_node_status_history|Ver.2|446,139|443,883|446,939|
|mst_temperature_record_realtime|Ver.2|132,483|131,405|134,009|
|mst_electric_energy_record_realtime|Ver.2|78,884|72,172|72,308|
|mst_temperature_record|Ver.1|59,040|58,986|59,020|
|mst_electric_energy_record|Ver.1|57,228|48,946|48,956|
|mst_electric_energy_record_realtime_demand|Ver.2|7,997|7,914|8,042|
|mst_spp_network_status|Ver.1|2,535|3,075|2,695|