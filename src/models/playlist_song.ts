import Sequelize from "Sequelize"

export default (sequelize: Sequelize.Sequelize) => {
    return sequelize.define(
        "playlist_song",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            song_id: {
                type: Sequelize.INTEGER,
                unique: "playlist_song",
                comment: "song表ID"
            },
            playlist_id: {
                type: Sequelize.INTEGER,
                unique: "playlist_song",
                comment: "歌单ID"
            }
        },
        {
            freezeTableName: true
        }
    )
}
