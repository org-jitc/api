# ヘルプメッセージ
あらゆるメニューで項目について説明するメッセージを定義する機能である。

* [1. 要望](#1)
* [2. 機能設計](#2)
* [3. 機能実現](#3)
* [4. DB設計](#4)

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