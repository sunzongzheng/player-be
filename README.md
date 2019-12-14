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
1. 问：怎么实现登录

   答：需要去对应的平台注册应用并配置，如QQ登录就需要去QQ互联创建应用，微博就去微博开放平台，
   github在setting -> Developer settings -> New Github App注册。QQ、微博创建应用都要域名备案，github不用。
   创建完应用记得修改配置文件

关联项目：
- [sunzongzheng/music](https://github.com/sunzongzheng/music)
- [caiyonglong/MusicLake](https://github.com/caiyonglong/MusicLake)