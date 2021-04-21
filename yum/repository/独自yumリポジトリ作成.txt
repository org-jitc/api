# リポジトリサーバー設定
## リポジトリディレクトリ作成
* rpmファイルをこのディレクトリに入れる
* ディレクトリの名前は何でも良し
* ほかのサーバーがアクセスできる様にするためにはhttpまたはftpで公開する必要がある
	* 今回の例はapacheサーバーである

```
cd /var/www/html
mkdir centos6
```

## コマンドインストール
### yum-utils (yumdownloader) コマンド
```
yum install yum-utils
```

### createrepoコマンド
```
yum install createrepo
```

## rpmファイルのダウンロード 
### yumdownloaderコマンドによるダウンロード
```
# resolve: download dependencies
yumdownloader <packagename> --resolve --destdir=/var/www/html/centos6
```

### yum installコマンドによるダウンロード
```
yum install  --downloadonly --downloaddir=/var/www/html/centos6 <packagename>
```

## リポジトリ更新
* リポジトリディレクトリに変更があった場合更新をする
```
createrepo --update /var/www/html/centos6
```

# インストールを行うサーバー
## repoファイルの作成
/etc/yum.repos.d/local.repo
* 作成ディレクトリは/etc/yum.repos.dの下である
* ファイルの名前は同ディレクトリの.repoファイルと重複しなければ良い
* 拡張子は.repo

```
vi local.repo
[local]
name=local repository #任意
baseurl=http://10.20.30.156/centos6 #リポジトリサーバー
gpgcheck=0
enabled=1
```