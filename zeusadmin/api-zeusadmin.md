# APIリスト
||api|url|
|-|-|-|
|[1](#api1)|店舗情報更新（zeusから）|/store/update.remote|

# <label id="api1">/store/update.remote</label>
## request parameter
```
{
	cpId:,
	storeKey:,
	storeName,
	storeUrl:,
	industryId:,
	areaId:,
	address:,
	personInCharge: 値がある場合,
	phone: 値がある場合,
	mailAddress: 値がある場合
}
```