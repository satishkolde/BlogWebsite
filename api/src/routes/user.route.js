import { Router } from "express";
import {loginUserController, logoutUserController, registerUserController} from '../controllers/user.controler.js'
import { verifyJwt } from "../middlewares/auth.middleware.js";

const route = Router();

route.route("/register").post(registerUserController);
route.route("/login").post(loginUserController);
route.route("/logout").post(verifyJwt, logoutUserController);

export default route;
