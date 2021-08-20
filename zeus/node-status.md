# 通常・制御ボタン

* 1．該当ノードのスレッドが起動されているかをチェック
    * 1.1.　起動されていた場合
        * エラーメッセージをレスポンス
    * 1.2.　起動されていない場合
        * 1.2.1.　mst_daemonの更新
            * SQL
                ```
                    update
                        MST_DAEMON
                    set
                        CONDITIONS = 1か0,
                        SWITCH_TIME = リクエスト時の時刻,
                        CYCLIC_ON_FLAG = 0,
                        CYCLIC_ON_OK_FLAG = 0
                    where
                        NODE_ID = ノードID
                ```
            * 上のSQLをhttp://ローカルサーバードメイン/ControlListener/ReceiveControlInfoServletに送信
                ```
                    http://ローカルサーバードメイン/ControlListener/ReceiveControlInfoServlet
                    ?ipAddress=該当ノードのIPアドレス
                    &protocol=該当ノードのプロトコル
                    /*
                        if (PROTOCOL_MEWTOCOL.equals(protocol) ||
                                PROTOCOL_YOCTOPUCE1.equals(protocol) ||
                                PROTOCOL_YOCTOPUCE2.equals(protocol) ||
                                PROTOCOL_YOCTOPUCE8.equals(protocol) ||
                                PROTOCOL_A4056S.equals(protocol) ||
                                PROTOCOL_R1212.equals(protocol) ||
                                PROTOCOL_GENERAL.equals(protocol))
                        の場合にwirelessIdをつける
                    */
                    &wirelessId=ノードのwireless_id
                    &channel=ノードのchannel
                    channelList=ノードのchannel_list，nullの場合はchannel
                    &waitTime=ノードのcontrol_wait_time
                    &mode=1か0
                    &sql=上のSQL
                    &childId=ノードのchild_id
                    &switchingOrder=ノードのcontrol_switching_order
                ```
                * 制御サイクリック待ち時間（デフォルトは20秒）まで1秒間隔でsqlを実行しmst_daemonのconditionが変わったかを監視する
                    * 変わった場合はOK
                    * 変わっていない場合はNG
        * 1.2.2.　通知情報に1.2.1の結果に応じてイベント登録を行う

# 手動・自動ボタン

* 1．スケジュールがあるか
    ```
        select
			control_target
		from
			mst_simple_operation_schedule
		where
			node_id = ノードID
		and
			schedule_mode = 0
		limit 1
    ```
    * 1．1．スケジュールありの場合
        * mst_simple_operation.node_controlを更新する
        * mst_simple_operation_schedule.control_targetを更新する
        * 通知情報にイベント登録をする
        * 自動から手動の場合は制御から通常に戻す
            * [BackToNormalThread](#BackToNormalThread)スレッドを立ち上げる
            * [BackToNormalThread](#BackToNormalThread)スレッドをコンテキストに格納する
    * 1．2．スケジュール無しの場合
        * 1．2.1．該当ノードのスレッドが起動されているかをチェック
            * 起動されていた場合
                * エラーメッセージをレスポンス
            * 起動されていない場合
                * mst_simple_operation.node_controlを更新する
                * 通知情報にイベント登録をする
                * 自動から手動の場合制御から通常に戻す
                    * [BackToNormalThread](#BackToNormalThread)スレッドを立ち上げる
                    * [BackToNormalThread](#BackToNormalThread)スレッドをコンテキストに格納する

# <label id="BackToNormalThread">制御から通常に戻すスレッド：BackToNormalThread</label>

* http://ローカルサーバードメイン/ControlListener/ReceiveControlInfoServletにリクエストを送信
* スレッド内部で処理が終わったらコンテキストから削除する
