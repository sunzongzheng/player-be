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
1.问：怎么实现登录

答：需要去对应的平台注册应用并配置，如QQ登录就需要去QQ互联创建应用，微博就去微博开放平台，
github在setting -> Developer settings -> New Github App注册。QQ、微博创建应用都要域名备案，github不用。
创建完应用记得修改配置文件

2.问：可否使用Sqlite?
   
答：可以，本项目使用Sequelize ORM v4，支持多种数据库，只需要`npm i sqlite3@~4.0.0`安装Sqlite并配置`config/local.js`的`sequelize`对象为：
```javascript
sequelize: {
   database: process.env.APP_MYSQL_DATABASE || "database",
   username: process.env.APP_MYSQL_USER || "username",
   password: process.env.APP_MYSQL_PASSWORD || "password",
   dialect: "sqlite",
   pool: {
      max: 5,
      min: 0,
      idle: 10000
   },
   timezone: "+00:00",
   logging: false,
   operatorsAliases: false
},
```

关联项目：
- [sunzongzheng/music](https://github.com/sunzongzheng/music)
- [caiyonglong/MusicLake](https://github.com/caiyonglong/MusicLake)
