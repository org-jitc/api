# tomcatコマンドが効かない問題の調査

## 10.20.30.154

### 問題1：/bin/shutdown.shでconnection refusedエラーが発生
```
ifup lo
```

上のコマンドでloを立ち上げることでエラーはなくなる

### 問題2：/bin/shutdown.shを実行した後，プロセスが残される
* 解決1：プログラムの修正
	* スレッド起動前，setDaemon(true)を実行する
* 解決2：/bin/shutdown.shの修正
	* プロセスをkillする様に修正する

#### 解決2
1. tomcatのPIDを記憶する様にする

/bin/catalina.sh

```
# Get standard environment variables
PRGDIR=`dirname "$PRG"`
# 以下のコードを追加し，tomcatのPIDを記憶する様にする
if [ -z "$CATALINA_PID" ]; then
    CATALINA_PID=$PRGDIR/CATALINA_PID
fi
```

2. -forceオプションを追加し，記憶したPIDをkillする様にする

/bin/shutdown.sh

```
# -forceオプションを追加
exec "$PRGDIR"/"$EXECUTABLE" stop -force "$@"
```