# player-be [![Build Status](https://travis-ci.org/sunzongzheng/player-be.svg?branch=master)](https://travis-ci.org/sunzongzheng/player-be)
用以支撑音乐湖云歌单

## 环境要求
- mysql >= 5.7.8
- redis

## 开发
1. `cp config/default.js config/local.js`
2. 修改config/local.js相应配置
2. `npm install`
3. `npm run start`

## 部署
1. `cp config/default.js config/local.js`
2. 修改`config/local.js`相应配置
3. 以下三种方式任选一
    ````bash
    docker-compose up -d # Docker Compose（Recommended）
    pm2 start pm2.production.json # PM2, daemon run
    npm run start # Just run it
    ````

## FAQ
### 1.问：怎么实现登录

答：需要去对应的平台注册应用并配置，如QQ登录就需要去QQ互联创建应用，微博就去微博开放平台，
github在setting -> Developer settings -> New Github App注册。QQ、微博创建应用都要域名备案，github不用。
创建完应用记得修改配置文件

### 2.问：没有条件搭建数据库、想使用其他数据库怎么办?
   
答：没有条件搭建数据库可以使用Sqlite，本项目使用Sequelize ORM v4，支持多种数据库（[请查看Sequelize官方文档了解如何配置其他数据库](https://sequelize.org/v4/manual/installation/usage.html)）。

Sqlite是一种基于文件的数据库方案，不需要单独搭建数据库服务，配置方法如下：

(1) 在项目根目录下安装Sqlite的驱动包：
```bash
npm i sqlite3@~4.0.0
```

(2) 编辑`config/local.js`配置文件的`sequelize`字段：
```javascript
sequelize: {
   database: process.env.APP_MYSQL_DATABASE || "database", // 不用改
   username: process.env.APP_MYSQL_USER || "username", // 不用改
   password: process.env.APP_MYSQL_PASSWORD || "password", // 不用改
   dialect: "sqlite", // 设置为使用Sqlite数据库
   pool: { // 不用改
      max: 5, // 不用改
      min: 0, // 不用改
      idle: 10000 // 不用改
   }, // 不用改
   timezone: "+00:00", // Sqlite不支持自定义时区，所以设置为+00:00
   logging: false, // 不用改
   operatorsAliases: false, // 不用改
   storage: '存放数据库文件的位置/文件名.sqlite' // 这一行也可以不写，不写的话默认会把数据库文件放在项目根目录下，并用上面database字段的名称来命名文件
},
```

关联项目：
- [sunzongzheng/music](https://github.com/sunzongzheng/music)
- [caiyonglong/MusicLake](https://github.com/caiyonglong/MusicLake)
