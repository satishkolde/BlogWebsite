import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken';

export const verifyJwt = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

    if(!accessToken) {
        throw new ApiError(400,"Accesstoken not found");
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SCERET_KEY);

    if(!decoded) {
        throw new ApiError(500, "Internal Server Error While decoding the Jwt token");
    }

    const user = await User.findOne({username:decoded.username}).select("-password");

    if(!user) {
        throw new ApiError(400, "User no longer Exist");
    }

    req.user = user;
    next();
});