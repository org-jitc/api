# 無線ノード管理API

# 表示順保存API
* URL
```
POST /zeus/rest/wirelessunit/displayorders
```

* RequestBody
```
{
    data: [
        {ipAddress:, childId:, unitId:, displayOrder:},
        ...
    ]
}
```

* Response
```
1. 200

1.1. 同期サーバー接続エラー
{
    result: "ng",
    msgs: ["同期サーバーに接続できませんでした。"]
}

1.2. 成功
{
    result: "ok"
}

2. 200以外のエラー
サーバー側が返すエラー
```