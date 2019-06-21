module.exports = {
    env: "development",
    server: {
        host: "127.0.0.1",
        port: 8080,
        socket: 8081
    },
    sequelize: {
        host: process.env.APP_MYSQL_HOST || "127.0.0.1",
        port: process.env.APP_MYSQL_PORT || 3306,
        database: process.env.APP_MYSQL_DATABASE || "database",
        username: process.env.APP_MYSQL_USER || "username",
        password: process.env.APP_MYSQL_PASSWORD || "password",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        timezone: "+08:00",
        logging: false,
        operatorsAliases: false
    },
    session: {
        secret: "secret",
        resave: false,
        saveUninitialized: false
    },
    qqStrategyOption: {
        clientID: 100000,
        clientSecret: "clientSecret",
        callbackURL: "https://127.0.0.1:8080/auth/qq/callback"
    },
    weiboStrategyOption: {
        clientID: 100000,
        clientSecret: "clientSecret",
        callbackURL: "https://127.0.0.1:8080/auth/weibo/callback"
    },
    email: {
        transporter: {
            host: "smtp.163.com",
            secureConnection: true,
            port: 465,
            secure: true,
            auth: {
                user: "user",
                pass: "pass"
            }
        },
        to: "to@email"
    },
    emailSendENV: [
        "production", "test"
    ],
    avoidNotifyIDList: [],
    jwtKey: "jwtKey",
    webhook: {
        path: '/webhook',
        port: 8338,
        secret: 'webhook'
    },
    blacklist: [],
    administrators: []
}