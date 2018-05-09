import express from "../../libs/express"
import passport from "passport"
import callback from "./qq/callback"
import android from "./qq/android"

const router = express()

router.get("/", passport.authenticate("qq"), (req, res) => {})
router.use("/callback", callback)
router.use("/android", android)

export default router
