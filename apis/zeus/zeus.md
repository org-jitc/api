# APIリスト
||api|url|
|-|-|-|
|1|[zeusadmin用店舗情報取得](#ajaxFacility)|/Ajax/FacilityInfo/Remote/Get.remote|
|2|[RMI方式各種データ取得](#rmiData)|/rmi/center/data|

# 1. <label id="ajaxFacility">zeusadmin用店舗情報取得</label>
## URL
/Ajax/FacilityInfo/Remote/Get.remote
## request parameter
なし

## response
### ok
```
{
	cpId:,
	storeKey:,
	storeName:,
	storeUrl:,
	storeIndustry:,
	storeIndustryName:,
	storeTdfk:,
	storeTdfkName:,
	address:,
	personInCharge: 値がある場合,
	phone: 値がある場合,
	mailAddress: 値がある場合
}
```

### ng
1. zeusに施設情報がない場合
```
{
	error: 'unregistered',
	message: 'No store information.'
}
```

2. zeusに施設情報はあるが販社ID（companyId）が設定されていない場合
```
{
	error: 'unregistered',
	message: 'No company id information.'
}
```

# 2. <label id="rmiData">RMI方式各種データ取得</label>
## URL
/rmi/center/data
### Interface
jp.co.jitc.interfaces.rmi.center.IRMICenter
```
public interface IRMICenter {
    public JSONObject data(JSONObject objParam){

    }
}
```
#### objParam構成
```
{
    authentication: {
        timestamp: string,
        key: string
    },
    data: {
        server: {
			cpId:,
		},
        sensor: {
			energy: {
				types: 1 // 1,2,3,4
			},
			env: {
				types: 0,1 // 1,2,3,4,5,6,7
			}
        }
        sensor-data: {
			from: yyyy-MM-dd HH:00:00|yyyy-MM-dd HH:30:00,
			to: yyyy-MM-dd HH:00:00|yyyy-MM-dd HH:30:00,
			granularity: 'half-hour'|'hour'|'half-hour,hour',
			energy: {
				types: 1 // 1,2,3,4
			},
			env: {
				types: 0,1 // 1,2,3,4,5,6,7
			}
        },
		// 解除率
		enudge-release: {
			from: yyyy-MM-dd HH:00:00|yyyy-MM-dd HH:30:00,
			to: yyyy-MM-dd HH:00:00|yyyy-MM-dd HH:30:00,
			// 時限別は毎時29分/59分
			// 日別は0時6分に計算される, 取得タイミングは毎日2時29分
			// 月別は0時40分に計算される, 取得タイミングは毎月1日3時29分
			granularity: ['half-hour'|'day'|'month'|'カンマ区切り組み合わせ'],
		}
    }
}
```
#### レスポンスデータ
```
suucess result:
{
    result: ok,
    data: {
        server: {
			result: 'ok'|'ng',
			// エラーの場合のみ
			error: {
				code: 'unregistered',
				messge: '施設情報が登録されていません。'
			},
			data: {
				address:,
				url:,
				facilityName: 施設名称,
				facilityNameShort: 施設略称,
				industryIds: 業種,
				industryNames:,
				areaId: 地域,
				tdfkId: 都道府県,
				tdfkName:,
				cpId: 販社ID,
				storeKey: 店舗識別子,
				personInCharge: ある場合,
				phone: ある場合,
				mailAddress: ある場合
			}
        },
        sensor: {
            energy: [{
                sensorId: センサーID, // required
                sensorName: センサー名, // required
                sensorType: エネルギー種別, // required
				measurementDataType: 電力表示種別 // option
            },...],
			env: [{
				sensorId: ,
				sensorName: ,
				sensorType: 
			},...]
        },
        sensor-data: {
            energy: {
                usage: {
                    half-hour: [
						sensorId:,
						datetime:,
						wh:,
						w:,
						measurementDataType:
					],
                    hour: [
						sensorId:,
						datetime:,
						wh:,
						measurementDataType:
					]
                },
                reduction: {
                    half-hour: [
						sensorId:
						datetime:
						reduction:
					],
                    hour: [
						sensorId:
						datetime:
						reduction:
					]
                }
            },
			env: {
				half-hour: [
					sensorId:,
					datetime:,
					first_avg:,
					first_max:,
					first_min:,
					second_avg:,
					second_max:,
					second_min:,
					third_avg:,
					third_max:,
					third_min:
				],
				hour: [
					sensorId:,
					datetime:,
					first_avg:,
					first_max:,
					first_min:,
					second_avg:,
					second_max:,
					second_min:,
					third_avg:,
					third_max:,
					third_min:
				]
			}
        },
		releaseRate: {
			half-hour: {
				'yyyy-MM-dd HH:mm:ss': releaseRate,...
			}
			day: {
				'yyyy-MM-dd': releaseRate,...
			},
			month: {
				'yyyy-MM': releasRate,...
			}
		}
    }
}

failed result (request parameter validation result):
// server
{
    result: 'ng',
    error: {
		code: 'invalid'
        message: '販社IDが指定されていません。'|'販社IDが不正です。'
    }
}
// sensor
{
	result: 'ng',
	error: {
		message: 'センサーパラメーターが指定されていません。'|'センサータイプパラメーターが指定されていません。'|'センサータイプパラメーターが無効です。'
	}
}
// sensor data -> type
{
	result: 'ng',
	error: {
		'データタイプが指定されていません。'|'データタイプの値が無効です。'
	}
}
// sensor data -> period
{
	result: 'ng',
	error: {
		message: '期間パラメーターが指定されていません。'|'期間タイプパラメーターが指定されていません。'|'期間パラメーターの値が無効な値です。'|'時刻パラメーターが指定されていません。'|'開始時刻パラメーターが指定されていません。'|'終了時刻パラメーターが指定されていません。'
	}
}
```