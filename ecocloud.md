# Ecocloud-API仕様書
## 通知情報API
### デマンド警報
#### URL
```
/zeuschart/eco_cloud_api/event_information/demand_warning
```
#### クエリパラメーター
##### 1. デマンド警報タイプ（type）
<table>
	<tr>
		<td>注意警報発生通知</td>
		<td>cautionstart</td>
	</tr>
	<tr>
		<td>注意警報解除通知</td>
		<td>cautionend</td>
	</tr>
	<tr>
		<td>遮断警報発生通知</td>
		<td>demandstart</td>
	</tr>
	<tr>
		<td>遮断警報解除通知</td>
		<td>demandend</td>
	</tr>
	<tr>
		<td>限界警報発生通知</td>
		<td>limitstart</td>
	</tr>
	<tr>
		<td>個別遮断警報発生通知</td>
		<td>demandstart.individual</td>
	</tr>
	<tr>
		<td>個別遮断警報解除通知</td>
		<td>demandend.individual</td>
	</tr>
	<tr>
		<td>全部</td>
		<td>all</td>
	</tr>
</table>

```
例：
一つの場合：type=cautionstart
複数の場合（カンマ区切り）：type=cautionstart,cautionend
全部の場合：type=all
```
##### 2. 期間(period)
* パラメーターフォーマット：period=[開始][ハイフン][終了]
	+ 開始：>=
	+ 終了：<
* 日付フォーマット：yyyyMMddHHmm

```
例：
period=202011070000-202011080000
```
#### レスポンス
#### レスポンスデータ概要
<table>
	<tr>
		<th colspan="2">キー</th>
	</tr>
	<tr>
		<td>日時</td>
		<td>datetime</td>
	</tr>
	<tr>
		<td>重要度</td>
		<td>priority</td>
	</tr>
	<tr>
		<td>カテゴリー</td>
		<td>category</td>
	</tr>
	<tr>
		<td>内容</td>
		<td>message</td>
	</tr>
	<tr>
		<td>操作ユーザー</td>
		<td>operateUser</td>
	</tr>
</table>

#### OK
```
{
	result: "ok",
	data: [
		{
			datetime: "2020-11-07 00:00:00",
			priority: "低",
			category: "通知",
			message: "警報メッセージ",
			operateUser: "ユーザーID"
		},
		...
	]
}
```
#### NG
```
{
	result: "ng",
	error: {
		code: 500,
		message: "エラーが発生しました。"
	}
}
```
