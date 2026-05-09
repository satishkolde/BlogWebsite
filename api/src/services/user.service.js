import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export class UserService {
    static async registerUser(username, password) {
        if (!username || !password || username.trim() === "" || password.trim() === "") {
            throw new ApiError(400, "Invalid credentials");
        }

        const duplicateUser = await User.findByPk(username);

        if (duplicateUser) {
            throw new ApiError(409, "User already exist");
        }

        const user = await User.create({ username, password });

        const createdUser = (await User.findByPk(username, {
            attributes: {
                exclude: ['password']
            }
        }));

        if (!createdUser) {
            throw new ApiError(500, "Internal Server Error While creating the user");
        }

        const accessToken = createdUser.generateAccessToken();

        if (!accessToken) {
            throw new ApiError(500, "Internal Server Error while creating the accessToken");
        }

        return { createdUser, accessToken };
    }

    static async loginUser(username, password) {
        if (!username || !password || username.trim() === "" || password.trim() === "") {
            throw new ApiError(401, "Invalid credentials");
        }

        const createdUser = await User.findByPk(username);

        if (!createdUser) {
            throw new ApiError(404, "User didn't Exist");
        }

        const isPasswordCorrect = await createdUser.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid Credentials");
        }

        const accessToken = createdUser.generateAccessToken();

        if (!accessToken) {
            throw new ApiError(500, "Internal Server Error while creating the accessToken");
        }

        const sendUser = createdUser.toJSON();
        delete sendUser.password;

        return { sendUser, accessToken };
    }
}