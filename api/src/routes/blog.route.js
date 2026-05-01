import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createBlogController, deleteBlogController, getAllBlogsController, getPaginatedBlogsController, getSpecificBlogController, getTotalNumberOfPagesController, getUserPrivateBlogsController, getUserPublicBlogController, updateBlogController } from "../controllers/blog.controler.js";

const route = Router();

route.use(verifyJwt);
route.route("/").get(getAllBlogsController);
route.route("/me").get(getUserPrivateBlogsController);
route.route("/pagination").get(getPaginatedBlogsController);
route.route("/pagination/pages").get(getTotalNumberOfPagesController);
route.route("/:username").get(getUserPublicBlogController);
route.route("/specific").post(getSpecificBlogController);
route.route("/").post(createBlogController);
route.route("/").delete(deleteBlogController);
route.route("/").patch(updateBlogController);

export default route;