import express from "@libs/express"
import auth from "./auth"
import playlist from "./playlist"
import user from './user'

const router = express()
router.use("/auth", auth)
router.use("/playlist", playlist)
router.use("/user", user)
export default router
