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
    const blog = await Blog.findById(id);

    if(!blog) {
        throw new ApiError(400, "Blog not found");
    }

    if(!blog.comments) {
        blog.comments = [];
    }

    const comment = await Comment.create({
        author: req.user._id,
        message: message
    });

    const createdComment = await Comment.findById(comment._id);

    if(!createdComment) {
        throw new ApiError(500,"Internal Server Error while creating comment");
    }

    blog.comments.push(createdComment._id);

    const updatedBlog = await blog.save();

    if(!updatedBlog) {
        throw new ApiError(500, "Internal Server Error while updating blog");
    }

    res.status(200).send(new ApiResponse(200, "Added Comment"));
});

export const getComments = asyncHandler(async (req, res) => {
    const id = req.body?.id;

    if(!id || id?.trim() === "") {
        throw new ApiError(400, "Blog id shouldn't be null or empty");
    }

    const blog = await Blog.findById(id);

    const comments = await Comment.find({
        _id: {
            $in: blog.comments
        }
    });

    const commentWithAuthor = await Promise.all(comments.map(async (comment) => {
        const user = await User.findById(comment.author);
        return {
            message:comment.message,
            author: user.username
        }
    }));
    res.status(200).send(new ApiResponse(200,"Got all comments",{
        comments:commentWithAuthor
    }));
});