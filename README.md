# player-be [![Build Status](https://travis-ci.org/sunzongzheng/player-be.svg?branch=master)](https://travis-ci.org/sunzongzheng/player-be)
用以支撑音乐湖云歌单

## 开发
1. `cp config/default.js config/development.js`
2. 修改config/development.js相应配置
2. `npm install`
3. `npm run start`

## 部署
1. `cp config/default.js config/production.js`
2. 修改`config/production.js`相应配置
3. 以下三种方式任选一
    ````bash
    docker-compose up -d # Docker Compose（Recommended）
    pm2 start pm2.production.json # PM2, daemon run
    npm run start # Just run it
    ````

关联项目：
- [sunzongzheng/music](https://github.com/sunzongzheng/music)
- [caiyonglong/MusicLake](https://github.com/caiyonglong/MusicLake)