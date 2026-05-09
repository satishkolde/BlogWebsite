import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { UserService } from '../services/user.service.js';

export const registerUserController = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const {createdUser,accessToken} = await UserService.registerUser(username, password);
    const cookieOptions = {
        httpOnly: true,
        secure: true
    }
    res.status(201).cookie("accessToken", accessToken, cookieOptions).send(new ApiResponse(201, "Created User successfully", createdUser));
});

export const loginUserController = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const {sendUser, accessToken} = await UserService.loginUser(username, password);
    const cookieOptions = {
        httpOnly: true,
        secure: true
    }
    res.status(200).cookie("accessToken", accessToken, cookieOptions).send(new ApiResponse(200, "User login Successfully", sendUser));
});

export const logoutUserController = asyncHandler((req, res)=>{
    const cookieOptions ={ 
        httpOnly: true,
        secure:true
    }
    res.clearCookie("accessToken",cookieOptions).send(new ApiResponse(200, "User logout Successfull"));
})