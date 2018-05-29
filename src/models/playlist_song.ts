import Sequelize from 'sequelize'

export default (sequelize: Sequelize.Sequelize) => {
    return sequelize.define(
        'playlist_song',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            song_id: {
                type: Sequelize.INTEGER,
                comment: 'song表ID',
            },
            playlist_id: {
                type: Sequelize.INTEGER,
                comment: '歌单ID',
            },
        },
        {
            indexes: [
                {
                    fields: ['song_id', 'playlist_id'],
                    unique: true,
                },
            ],
            freezeTableName: true,
        }
    )
}
