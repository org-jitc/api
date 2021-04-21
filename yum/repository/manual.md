2020年12月2日のサポート終止によりyumコマンドが使えなくなっている。

# 1．centos-vaultを更新源にして使い続ける方法
[https://vault.centos.org/](https://vault.centos.org/)

```
# 以下のファイルを修正する
/etc/yum.repos.d/CentOS-Base.repo

mirrorlist=で始まるURLは注釈する

# baseurl=で始まるURLは注釈符号（#）を削除する
# そして
baseurl=http://mirror.centos.org/centos/$releasever
# 上の部分を以下に書き換える
baseurl=http://vault.centos.org/6.10
```

# 2. 独自のyumリポジトリ
# 2.1 リポジトリを作成する
yumリポジトリを作成するには、repomd.xmlファイルや各種データベースファイルを作成する「creatrepo」コマンドが必要となる。これは同名のパッケージで提供されているので、これをあらかじめインストールしておこう。

```
yum install createrepo
```

yumリポジトリを作成するには、公開するRPMファイルが格納されているディレクトリを引数に指定してcreaterepoコマンドを実行する。たとえば/var/www/rpmrepo/x86_64/PackagesというディレクトリにRPMファイルが格納されている場合、以下のように実行する。

```
createrepo /var/www/rpmrepo/x86_64/Packages
```

すると、引数で指定したディレクトリ内にrepodataディレクトリが作成され、そこにrepomd.xmlなどのメタデータファイルが作成される。

そのほかrpmbuildコマンドにはリポジトリで公開するファイルを指定する「-i」オプションやリポジトリの更新時に利用できる「–update」オプションなども用意されているので、詳しくはmanページなどを参照してほしい。

createrepoコマンドでメタデータを作成したら、最後にこれらのディレクトリがHTTPもしくはFTPで公開されるようにすれは設定作業は完了だ。

# 2.2 リポジトリを利用するよう設定を行う