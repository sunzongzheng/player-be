import express from "@libs/express"
import session from "express-session"
import bodyParser from "body-parser"
import config from "config"
import middleware from "./middleware"

const app = express()
const serverConfig: Config.server = config.get("server")
const sessionConfig: Config.session = config.get("session")

app.use(session(sessionConfig))
app.use(bodyParser.json())
app.use(middleware)

export function createServer() {
    app.listen(serverConfig.port, () => {
        if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
            console.log(`server running @${serverConfig.port}`)
        }
    })
}

export default app
