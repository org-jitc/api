# デマンド制御履歴
* 30分ごとにデマンド制御回数、制御時間を集計する
* 集計したデータを[月、日、30分]粒度で統計し，画面で表示する

## <mark>デマンド制御回数のカウント方法</mark>
* mst_node_status_history.display_statusの値が3以外から3に変わった場合，制御としてカウントする
* 同時限内の場合は，カウントアップする
* 時限を跨いだ場合は，1からカウントする

## <mark>デマンド制御時間を計算する方法</mark>
基本的にmst_node_status_history.diff_secを累計して計算する

* display_statusが3以外から3に変わった場合
    ```
    制御時間 = 0
    ```
* 前回のdisplay_statusが3の場合
    ```
    制御時間 = 制御時間 + diff_sec
    ```
* 時限の臨界での計算例
    ```
    前の時限 = '2021-07-30 16:30:00'
    時限 = '2021-07-30 17:00:00'
    mst_node_status_history.timestamp = '2021-07-30 17:10:00'
    mst_node_status_history.diff_sec = '30'

    IF (timestamp - diff_sec < 時限) {
        前の時限.制御時間 = 前の時限.制御時間 + diff_sec
    }
    ```