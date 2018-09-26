import Sequelize from 'sequelize'

export default (sequelize: Sequelize.Sequelize) => {
    return sequelize.define(
        'log_login',
        {
            user_id: {
                type: Sequelize.INTEGER,
                comment: '用户ID',
            },
            from: {
                type: Sequelize.ENUM('qq', 'token', 'weibo'),
                comment: '登录方式',
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
