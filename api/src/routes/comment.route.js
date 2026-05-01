import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addComment, getComments } from "../controllers/comment.controler.js";

const route = Router();

route.use(verifyJwt);
route.route("/add").post(addComment);
route.route("/get").post(getComments);

export default route;