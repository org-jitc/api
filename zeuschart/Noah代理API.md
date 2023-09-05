# Noahリスナーへの代理API

Cross Domainや，ローカルサーバーに対してリクエストしなければならないことを考慮し，zeuschartに機能追加をすることにしました。

## 「MCファン運転状態」と「空調機運転状態」を取得するAPI

```text
GET /rest/noahproxy/machinestatus
```

### レスポンス

```text
1. 200 成功レスポンス
{
    result: 'ok',
    data: [{
        machineId:,
        machineName:,
        status:
    },...]
}

2. 200 エラーレスポンス
{
    result: 'ng'
}

3. 200以外 エラーレスポンス
connection timeout等
```

## 「環境センサー」を取得するAPI

```text
GET /rest/noahproxy/monitoringdata
```

### レスポンス

```text
1. 200 成功レスポンス
{
    result: 'ok',
    data: {
        monitorings: [{
            monitoringId:,
            monitoringName:,
            value:
        },...],
        sensors:[{
            sensorId:,
            sensorName:,
            isAbnormal:
        },...]
    }
}

2. 200 エラーレスポンス
{
    result: 'ng'
}

3. 200以外　エラーレスポンス
connection timeout等
```

## 「操作」を取得するAPI

```text
GET /rest/noahproxy/operationstatus
```

### レスポンス

```text
1. 200 成功レスポンス
{
    result: 'ok',
    data: [{
        operationId:,
        operationName:,
        statusButton:,
        statusLamp:
    }]
}

2. 200 エラーレスポンス
{
    result: 'ng'
}

3. 200以外　エラーレスポンス
connection timeout等
```

## レジスタの値を更新するAPI

```text
POST /rest/noahproxy/register
```

### リクエスト

```text
{
    data: [{
        monitoringId:,
        value:
    },...]
}
```

### レスポンス

```text
1. 200 成功レスポンス
{
    result: 'ok'
}

2. 200 エラーレスポンス
{
    result: 'ng'
}

3. 200以外　エラーレスポンス
connection timeout等
```

## コイルの値を更新するAPI

```text
POST /rest/noahproxy/coil
```

### リクエスト

```text
{
    data: [{
        operationId:,
        status:
    },...]
}
```

### レスポンス

```text
1. 200 成功レスポンス
{
    result: 'ok'
}

2. 200 エラーレスポンス
{
    result: 'ng'
}

3. 200以外　エラーレスポンス
connection timeout等
```
