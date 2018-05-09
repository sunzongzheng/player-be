module.exports = {
    env: "travis-ci",
    server: {
        host: "127.0.0.1",
        port: 8080
    },
    sequelize: {
        host: "127.0.0.1",
        database: "player",
        username: "root",
        password: "",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        timezone: "+08:00",
        logging: false
    },
    session: {
        secret: "secret"
    },
    qqStrategyOption: {
        clientID: 100000,
        clientSecret: "clientSecret",
        callbackURL: "https://127.0.0.1:8080/auth/qq/callback"
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
    emailSendENV: ["production", "test"],
    avoidNotifyIDList: [],
    jwtKey: "jwtKey"
}