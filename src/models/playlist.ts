import Sequelize from "sequelize"

export default (sequelize: Sequelize.Sequelize) => {
    return sequelize.define(
        "playlist",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                comment: "歌单名称"
            },
            user_id: {
                type: Sequelize.INTEGER,
                comment: "歌单所属用户ID"
            }
        },
        {
            freezeTableName: true
        }
    )
}
