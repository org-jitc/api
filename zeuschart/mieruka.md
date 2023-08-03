# モニタリングへのAPI
## リアルタイムのデマンドグラフデータの取得
### url
```
get /rest/mieruka/echarts/realtime/demand
```
### リクエストパラメーター
```
{
    demandId:,
    halfHourType:,
    lastTimeMilli:,
    lastValue:
}
```
### レスポンス
```
{
    result: 'ok',
    data: {
        // デマンドセンサーラベル名
        demandLabel:,
        // 時限タイプ（前30分か後ろ30分か）
        halfHourType: ['first'|'last'],
        // リアルタイム電力
        realtime: [{timeMilli:, value:},...],
        // y軸
        yAxis: {
            // y軸の最大値
            max:
        },
        // 最後の電力
        lastValue:
        // 以下は最初のアクセスあるいは時限(halfHourType)が変わる場合に
        // x軸の開始時刻と終了時刻
        xAxis: {
            start:,
            end:
        },
        // 契約電力、限界電力、初期電力、目標電力
        setting: {
            contract:,
            limit:,
            initial:,
            target:
        }
    }
}
```