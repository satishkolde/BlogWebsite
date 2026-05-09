import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addComment, getComments } from "../controllers/comment.controller.js";

const route = Router();

route.use(verifyJwt);
route.route("/add").post(addComment);
route.route("/get/:id").get(getComments);

export default route;