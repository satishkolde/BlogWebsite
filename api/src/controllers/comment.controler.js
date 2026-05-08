import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {Comment} from '../models/comment.model.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

export const addComment = asyncHandler(async (req, res) => {
    const {id, message} = req.body;

    if(!id || !message || id?.trim() === "" || message?.trim() === "") {
        throw new ApiError(400, "id or comment shouldn't be empty");
    }

    const comment = await Comment.create({
        author: req.user.username,
        message: message,
        blog: id
    });

    const createdComment = await Comment.findByPk(comment.id);

    if(!createdComment) {
        throw new ApiError(500,"Internal Server Error while creating comment");
    }

    res.status(201).send(new ApiResponse(201, "Added Comment"));
});

export const getComments = asyncHandler(async (req, res) => {
    const id = req.body?.id;

    if(!id || id?.trim() === "") {
        throw new ApiError(400, "Blog id shouldn't be null or empty");
    }

    const comments = await Comment.findAll({
        where: {
            blog: id
        }
    });

    res.status(200).send(new ApiResponse(200,"Got all comments",{
        comments:comments
    }));
});