import express from "@libs/express"
import single from "./playlist/single"
import { Session } from "@types"
import models from "@models"
import { schema, validate } from "@libs/validator"
import { BadRequest } from "@src/libs/error"
import { name } from "@validator/playlist"

export default express()
    .get("/", async (req, res) => {
        const data = await models.playlist.findAll({
            where: {
                user_id: res.locals.session.meta.id
            },
            order: [["createdAt", "DESC"]],
            attributes: ["id", "name"]
        })
        res.send(data)
    })
    .post(
        "/",
        schema({
            name
        }),
        async (req: express.Request, res: express.Response) => {
            validate(req).throw()
            const data = await models.playlist.create({
                user_id: res.locals.session.meta.id,
                name: req.body.name
            })
            res.send({
                name: data.name,
                id: data.id
            })
        }
    )
    .delete(
        "/",
        schema({
            id: {
                in: ["body"],
                isEmpty: {
                    errorMessage: "歌单id不能为空",
                    negated: true
                }
            }
        }),
        async (req: express.Request, res: express.Response) => {
            validate(req).throw()
            const data = await models.playlist.destroy({
                where: {
                    id: req.body.id,
                    user_id: res.locals.session.meta.id
                }
            })
            if (data) {
                res.send({})
            } else {
                throw new BadRequest("歌单不存在")
            }
        }
    )
    // 检查参数并传递id
    .use(
        "/:id",
        schema({
            id: {
                in: ["params"],
                errorMessage: "ID is wrong",
                isInt: true
            }
        }),
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            validate(req).throw()
            res.locals.id = req.params.id
            next()
        }
    )
    .use("/:id", single)
