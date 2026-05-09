import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createBlogController, deleteBlogController, getPaginatedBlogsController, getSpecificBlogController, getUserPrivateBlogsController, getUserPublicBlogController, updateBlogController } from "../controllers/blog.controller.js";

const route = Router();

route.use(verifyJwt);
route.route("/me").get(getUserPrivateBlogsController);
route.route("/pagination").get(getPaginatedBlogsController);
route.route("/:username").get(getUserPublicBlogController);
route.route("/specific").post(getSpecificBlogController);
route.route("/").post(createBlogController);
route.route("/:id").delete(deleteBlogController);
route.route("/:id").patch(updateBlogController);

export default route;