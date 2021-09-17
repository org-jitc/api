# 既存現在電力計算
## 1. 開始時刻（0分0秒、または、30分0秒）の使用電力値を取得する
```
select
    DATETIME, W
from
    MST_ELECTRIC_ENERGY_RECORD_REALTIME_DEMAND MEERRD
where
    MEERRD.ELECTRIC_ENERGY_SENSOR_ID = 'sensor_id'
and
    DATETIME >= 'yyyy-MM-dd HH:00:00 OR yyyy-MM-dd HH:30:00'
order by
    DATETIME
limit 1 
```

## 2. 差分電力を求める
* 時限開始時刻ちょうどにデータが存在する場合
    * 開始時刻のデータを差分電力とする
* 開始時刻より後に最初のデータが存在する場合
    * 開始直前何秒前に記録されたか求める
    * 開始直後何秒後に記録されたか求める

```
iDiffElectricity = iElectricityAfterStartTime - (iElectricityAfterStartTime * iSecondsAfter / (iSecondsBefore + iSecondsAfter));
```

## 3. 
```
select
    MEES.ELECTRIC_ENERGY_SENSOR_NAME,
    MEES.RGB,
    to_char(DATETIME, 'yyyy/mm/dd hh24:mi:ss') AS DT,
    W
from
    MST_ELECTRIC_ENERGY_RECORD_REALTIME_DEMAND MEERRD, MST_ELECTRIC_ENERGY_SENSOR MEES
where
    MEERRD.ELECTRIC_ENERGY_SENSOR_ID = MEES.ELECTRIC_ENERGY_SENSOR_ID
and
    MEERRD.ELECTRIC_ENERGY_SENSOR_ID = '" + strDevice + "'"
and
    DATETIME >= '" + strStartTime + "'"
and
    DATETIME < '" + strEndTime + "'");
order by
    MEERRD.ELECTRIC_ENERGY_SENSOR_ID, DATETIME
```

# 
## 機能リスト
* センサーごとの現在の電力を求める
* デマンドセンサーの場合
    * グラフ用累計データセットを求める