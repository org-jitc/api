# warのサイズを減らす方法の調査

## 試行

zeusとzeuschartから除外された全てのjarファイルをtomcat/libに置く

<table>
	<thead>
		<tr>
			<th></th>
			<th>zeus</th>
			<th>zeuschart</th>
			<th>結果</th>
			<th>エラー</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>1</td>
			<td>全て除外</td>
			<td>全て除外</td>
			<td>tomcatが正常に起動しない</td>
			<td>zeuschartがSpringバージョンの問題で起動できない</td>
		</tr>
		<tr>
			<td>2</td>
			<td>Spring関連のjar以外を除外</td>
			<td>Spring関連のjar以外を除外</td>
			<td>tomcatが正常に起動しない</td>
			<td>zeusがSpringの関連jarがロードされなかったため起動できない<br>zeuschartがSpringの関連jarがロードされなかったため起動できない</td>
		</tr>
		<tr>
			<td>3</td>
			<td>全て除外</td>
			<td>除外しない</td>
			<td>tomcatが正常に起動する</td>
			<td></td>
		</tr>
	</tbody>
</table>

## warサイズ

||zeus|zeuschart|
|-|-|
|jarを含む|34,757KB|24,890KB|
|jarを含まない|15,894KB|3,271KB|