import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken';

export const verifyJwt = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

    if(!accessToken) {
        throw new ApiError(401,"Accesstoken not found");
    }

    let decoded;
    try {
        decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired access token");
    }

    if(!decoded) {
        throw new ApiError(401, "Invalid access token");
    }

    const user = await User.findByPk(decoded.username, {
        attributes: {
            exclude: ["password"]
        }
    });

    if(!user) {
        throw new ApiError(404, "User no longer Exist");
    }

    req.user = user;
    next();
});