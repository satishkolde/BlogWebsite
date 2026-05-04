import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const registerUserController = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || username.trim() === "" || password.trim() === "") {
        throw new ApiError(400, "Invalid credentials");
    }

    const duplicateUser = await User.findOne({ username });

    if (duplicateUser) {
        throw new ApiError(409, "User already exist");
    }

    const user = await User.create({ username, password });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Internal Server Error While creating the user");
    }

    const accessToken = createdUser.generateAccessToken();

    if (!accessToken) {
        throw new ApiError(500, "Internal Server Error while creating the accessToken");
    }

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    res.status(201).cookie("accessToken", accessToken, cookieOptions).send(new ApiResponse(201, "Created User successfully", createdUser));
});

export const loginUserController = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || username.trim() === "" || password.trim() === "") {
        throw new ApiError(401, "Invalid credentials");
    }
    
    const createdUser = await User.findOne({
        username
    });

    if(!createdUser) {
        throw new ApiError(404, "User didn't Exist");
    }

    const isPasswordCorrect = await createdUser.isPasswordCorrect(password);

    if(!isPasswordCorrect) {
        throw new ApiError(401, "Invalid Credentials");
    }

    const accessToken = createdUser.generateAccessToken();

    if (!accessToken) {
        throw new ApiError(500, "Internal Server Error while creating the accessToken");
    }

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    res.status(200).cookie("accessToken", accessToken, cookieOptions).send(new ApiResponse(200, "User login Successfully", createdUser));
});

export const logoutUserController = asyncHandler((req, res)=>{
    const cookieOptions ={ 
        httpOnly: true,
        secure:true
    }
    res.clearCookie("accessToken",cookieOptions).send(new ApiResponse(200, "User logout Successfull"));
})