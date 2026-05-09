import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {Comment} from '../models/comment.model.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { CommentService } from "../services/comments.service.js";

export const addComment = asyncHandler(async (req, res) => {
    const {id, message} = req.body;

    await CommentService.addComment(id, message, req.user.username);

    res.status(201).send(new ApiResponse(201, "Added Comment"));
});

export const getComments = asyncHandler(async (req, res) => {
    const id = req.body?.id;

    const comments = await CommentService.getComments(id);
    
    res.status(200).send(new ApiResponse(200,"Got all comments",{
        comments:comments
    }));
});