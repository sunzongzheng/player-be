# 一、背景 
player-be [![Build Status](https://travis-ci.org/sunzongzheng/player-be.svg?branch=master)](https://travis-ci.org/sunzongzheng/player-be)
用以支撑音乐湖云歌单，如果需要云歌单服务，则需要自己搭建服务器。服务器可以设置在本地，也可以使用云服务器。
不管是哪种，都需要走第三节的步骤。

# 二、开发（调试）
1. `cp config/default.js config/local.js`
2. 修改config/local.js相应配置
2. `npm install`
3. `npm run start`

# 三、准备工作
环境要求
- mysql >= 5.7.8
- redis
- docker（可选）

## 3.1 安装redis
自行搜索教程，安装后设置redis开机自启动（否则一旦机器重启服务就gg了）

## 3.2 安装mysql
设置mysql开机自启动（否则一旦机器重启服务就gg了）
创建用户（记住密码），也可以直接使用root用户
创建数据库
以上两步将在后续配置中使用到

## 3.3 安装docker
自行搜索教程，安装后设置docker开机自启动（否则一旦机器重启服务就gg了）

## 3.4 注册Github APP
自行搜索教程，核心的点在于：
**User authorization callback URL**设置为如下格式，其中xx.xx.xx.xx是你的服务器公网地址（如果你服务器是内网，那内网地址也可）
```
http://xx.xx.xx.xx:port/auth/github/callback
```

# 四、开始配置
## 4.1 客户端
```
$ cd /path-to-music-project/music
$ vim /config/index.js
```
将配置改为下方类型，其中xx.xx.xx.xx是你的服务器公网地址（如果你服务器是内网，那内网地址也可）
```
export default {
    api: 'http://xx.xx.xx.xx:port',
    socket: 'http://xx.xx.xx.xx:port'
}
```

## 4.2 服务端
以下介绍使用docker的方案。
修改完配置文件后记得重新构建docker镜像
修改完配置文件后记得重新构建docker镜像
修改完配置文件后记得重新构建docker镜像
(重要的事情说三遍)

```
// 连上你的服务器
$ ssh user@xx.xx.xx.xx
```
### 4.2.1 docker配置
docker默认端口是8080，如果你的服务器上有其他服务占用了8080端口，你可以选择一个另外的端口号来作为云歌单服务的端口号。如果你的服务器8080没有被占用，可跳过docker这块的步骤。
```
// 进入项目目录
$ cd /path-to-player-be-project/player-be

// 修改docker配置文件
$ vim docker-compose.yml
```

假设你希望云歌单服务的端口号为12345，socket为12346，那么可以增加ports部分的映射：
```
version: '3'
services:
  redis:
    image: redis:3
    restart: always
    volumes:
      - "./redis:/data"
  mysql:
    image: mysql:5.7
    restart: always
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    volumes:
      - "./mysql:/var/lib/mysql"
    environment:
      MYSQL_DATABASE: musiclake
      MYSQL_USER: musiclake
      MYSQL_PASSWORD: musiclake
      MYSQL_ROOT_PASSWORD: musiclake
  server:
    build: .
    environment:
      APP_REDIS_HOST: redis
      APP_MYSQL_HOST: mysql
      APP_MYSQL_DATABASE: musiclake
      APP_MYSQL_USER: musiclake
      APP_MYSQL_PASSWORD: musiclake
    restart: always
    ports:
      - "12345:12345"
      - "12346:12346"
      - "8080:8080"
      - "8081:8081"
    depends_on:
      - redis
      - mysql
    volumes:
      - "./wait-for-it.sh:/app/wait-for-it.sh"
    command: ["./wait-for-it.sh", "-t", "0", "mysql:3306", "--", "npm", "start"]
```

### 4.2.2 项目配置
修改配置文件：
```
$ cd /path-to-player-be-project/player-be

// 复制一份配置文件，重命名为local.js
$ cp config/default.js config/local.js

// 修改项目配置文件
$ vim config/local.js
```
以下为示例配置，要修改的点为：
1. server的port和socket：默认为8080、8081，如果8080端口没有被占用则无需更改
2. sequelize部分（数据库）：
  * atabase的名字，改为你创建的数据库的名字
  * username，改为某个用户名
  * password，改为对应的用户密码
3. githubStrategyOption：
  * clientID、clientSecret，改为Github APP注册后对应的信息
  * callbackURL，改为http://xx.xx.xx.xx:port/auth/github/callback格式，其中xx.xx.xx.xx是你的服务器公网地址（如果你服务器是内网，那内网地址也可），和Github APP的User authorization callback URL保持一致即可

以下配置：
1. 端口和socket改为了12345和12346
2. 数据库使用your_user_name用户登陆，密码为your_password，使用your_database_name这个数据库存储数据
3. github app的clientID为aaaa，clientSecret为bbbb，callbackURL为http://xx.xx.xx.xx:12345/auth/github/callback

```
module.exports = {
    env: "development",
    server: {
        host: "127.0.0.1",
        port: 12345,
        socket: 12346
    },
    sequelize: {
        host: process.env.APP_MYSQL_HOST || "127.0.0.1",
        port: process.env.APP_MYSQL_PORT || 3306,
        database: process.env.APP_MYSQL_DATABASE || "your_database_name",
        username: process.env.APP_MYSQL_USER || "your_user_name",
        password: process.env.APP_MYSQL_PASSWORD || "your_password",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        timezone: "+08:00",
        logging: false,
        operatorsAliases: false
    },
    session: {
        secret: "secret",
        resave: false,
        saveUninitialized: false
    },
    qqStrategyOption: {
        clientID: 100000,
        clientSecret: "clientSecret",
        callbackURL: "https://127.0.0.1:33006/auth/qq/callback"
    },
    weiboStrategyOption: {
        clientID: 100000,
        clientSecret: "clientSecret",
        callbackURL: "https://127.0.0.1:33006/auth/weibo/callback"
    },
    githubStrategyOption: {
        clientID: "aaaa",
        clientSecret: "bbbb",
        callbackURL: "http://xx.xx.xx.xx:12345/auth/github/callback"
    },
    email: {
        transporter: {
            host: "smtp.163.com",
            secureConnection: true,
            port: 465,
            secure: true,
            auth: {
                user: "user",
                pass: "pass"
            }
        },
        to: "your@email"
    },
    emailSendENV: [
        "production", "test"
    ],
    avoidNotifyIDList: [],
    jwtKey: "jwtKey",
    webhook: {
        path: '/webhook',
        port: 8338,
        secret: 'webhook'
    },
    blacklist: [],
    administrators: []
}
```

# 五、部署
以下三种方式任选一
````bash
docker-compose up -d # Docker Compose（Recommended）
pm2 start pm2.production.json # PM2, daemon run
npm run start # Just run it
````

# 六、FAQ
1. 问：怎么实现登录
需要去对应的平台注册应用并配置，如QQ登录就需要去QQ互联创建应用，微博就去微博开放平台，github在setting -> Developer settings -> New Github App注册。QQ、微博创建应用都要域名备案，github不用。创建完应用记得修改配置文件。

# 七、关联项目：
- [sunzongzheng/music](https://github.com/sunzongzheng/music)
- [caiyonglong/MusicLake](https://github.com/caiyonglong/MusicLake)

