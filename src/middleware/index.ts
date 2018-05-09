import express from "../libs/express"
import auth from "./auth"
import api from "../api"
import errors from "./errors"

const router = express()
router.use(auth)
router.use(api)
router.use(errors)
export default router
