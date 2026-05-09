import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";

export class CommentService {
    static async addComment(id, message, author) {
        if (!id || !message || id?.trim() === "" || message?.trim() === "") {
            throw new ApiError(400, "id or comment shouldn't be empty");
        }

        const comment = await Comment.create({
            author: author,
            message: message,
            blog: id
        });

        const createdComment = await Comment.findByPk(comment.id);

        if (!createdComment) {
            throw new ApiError(500, "Internal Server Error while creating comment");
        }
    }

    static async getComments(id) {
        if (!id || id?.trim() === "") {
            throw new ApiError(400, "Blog id shouldn't be null or empty");
        }

        const comments = await Comment.findAll({
            where: {
                blog: id
            }
        });

        if(!comments) {
            throw new ApiError(500, "Internal Server Error");
        }
        return comments;
    }
}