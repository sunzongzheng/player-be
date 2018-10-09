import Sequelize from 'sequelize'

export default (sequelize: Sequelize.Sequelize) => {
    return sequelize.define(
        'song',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            songId: {
                type: Sequelize.STRING,
                comment: '歌曲ID',
            },
            vendor: {
                type: Sequelize.ENUM('netease', 'qq', 'xiami'),
                comment: '歌曲提供商',
            },
            commentId: {
                type: Sequelize.STRING,
                comment: '评论ID',
            },
            name: {
                type: Sequelize.STRING,
                comment: '歌名',
            },
            album: {
                type: Sequelize.JSON,
                comment: '专辑',
            },
            artists: {
                type: Sequelize.JSON,
                comment: '歌手',
            },
            cp: {
                type: Sequelize.BOOLEAN,
                comment: '是否被限制导致无法播放',
            },
            dl: {
                type: Sequelize.BOOLEAN,
                comment: '是否能免费下载',
                defaultValue: false,
            },
            quality: {
                type: Sequelize.JSON,
                comment: '音质',
            },
        },
        {
            indexes: [
                {
                    fields: ['songId', 'vendor'],
                    unique: true,
                },
            ],
            freezeTableName: true,
        }
    )
}
