import Sequelize from 'sequelize'
import config from 'config'
import fs from 'fs'
import path from 'path'

const db: any = {}
const sequelizeConfig: Config.sequelize = config.get('sequelize')

const sequelize = new Sequelize(sequelizeConfig)

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return !file.includes('index')
    })
    .forEach(function(file) {
        const model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model
    })

Object.keys(db).forEach(modelName => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db)
    }
})

/* 歌单表 */

db.playlist.hasMany(db.playlist_song, {
    foreignKey: 'playlist_id',
    sourceKey: 'id',
})
db.playlist.belongsToMany(db.song, {
    through: 'playlist_song',
    foreignKey: 'playlist_id',
})
db.playlist.belongsTo(db.user, {
    foreignKey: 'user_id',
    targetKey: 'id',
})

/* 歌单-歌曲关系表 */
db.playlist_song.belongsTo(db.playlist, {
    foreignKey: 'playlist_id',
    targetKey: 'id',
})
db.playlist_song.belongsTo(db.song, {
    foreignKey: 'song_id',
    targetKey: 'id',
})

/* 用户表 */
db.user.hasMany(db.playlist, {
    foreignKey: 'user_id',
    sourceKey: 'id',
})
db.user.hasMany(db.log_login, {
    foreignKey: 'user_id',
    sourceKey: 'id',
})
db.user.hasMany(db.chat_history, {
    foreignKey: 'user_id',
    sourceKey: 'id',
})

/* 歌曲表 */
db.song.belongsToMany(db.playlist, {
    through: 'playlist_song',
    foreignKey: 'song_id',
})
db.song.hasMany(db.playlist_song, {
    foreignKey: 'song_id',
    sourceKey: 'id',
})

/* 登陆日志表 */
db.log_login.belongsTo(db.user, {
    foreignKey: 'user_id',
    targetKey: 'id',
})

/* 聊天消息记录表 */
db.chat_history.belongsTo(db.user, {
    foreignKey: 'user_id',
    targetKey: 'id',
})

db.sequelize = sequelize
db.Sequelize = Sequelize
export default db
