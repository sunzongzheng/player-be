import Sequelize from 'sequelize'

export default (sequelize: Sequelize.Sequelize) => {
    return sequelize.define(
        'chat_history',
        {
            user_id: {
                type: Sequelize.INTEGER,
                comment: '用户ID',
            },
            type: {
                type: Sequelize.STRING,
                comment: '类型',
            },
            message: {
                type: Sequelize.TEXT,
                comment: '内容',
            },
            platform: {
                type: Sequelize.STRING,
                comment: '平台',
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        },
        {
            freezeTableName: true,
            timestamps: false,
        }
    )
}
