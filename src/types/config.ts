declare namespace Config {
  interface server {
    host: string
    port: number
  }
  interface sequelize {
    host: string
    database: string
    username: string
    password: string
    dialect: string
  }
  interface session {
    secret: string
  }
  interface email {
    transporter: {
      host: string
      secureConnection: boolean
      port: number
      secure: boolean
      auth: {
        user: string
        pass: string
      }
    }
    to: string
  }
}
