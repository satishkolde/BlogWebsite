import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";

export class BlogService {
    static async createBlog(author, title, body, is_published) {
        if (!title || !body || title.trim() === "" || body.trim() === "") {
            throw new ApiError(400, "Title or Body shouldn't empty");
        }

        if (title.length > 100) {
            throw new ApiError(400, "Title length shouldn't greater than 100");
        }

        const duplicateBlog = await Blog.findOne({
            where: {
                title: title,
                author: author
            }
        });

        if (duplicateBlog) {
            throw new ApiError(409, "Blog already exist");
        }


        const blog = await Blog.create({
            title: title,
            body: body,
            is_published: is_published,
            author: author,
        });

        const createdBlog = await Blog.findByPk(blog.id);

        if (!createdBlog) {
            throw new ApiError(500, "Internal Server Error while creating the blog");
        }

        return createdBlog;
    }

    static async updateBlog(author, id, title, body, is_published) {
        const blog = await Blog.findOne({
            where: {
                id: id,
                author: author
            }
        });

        if (!blog) {
            throw new ApiError(404, "Blog not found for the user");
        }

        if (title) {
            blog.title = title;
        }

        if (body) {
            blog.body = body;
        }

        if (is_published !== undefined) {
            blog.is_published = is_published;
        }
        const updatedBlog = await blog.save();
        return updatedBlog;
    }

    static async deleteBlog(author, id) {
        if (!id || id.trim() === "") {
            throw new ApiError(400, "Blog title is required");
        }

        const blog = await Blog.destroy({
            where: {
                id: id,
                author: author
            }
        });

        if (!blog) {
            throw new ApiError(404, "Blog doesn't exist for the user");
        }
        return blog;
    }

    static async getSpecificBlog(author, id) {
        if (!id || id?.trim() === "") {
            throw new ApiError(400, "Blog id is required to get the blog");
        }

        const blog = await Blog.findOne({
            where: {
                id: id
            }
        });

        if (!blog) {
            throw new ApiError(404, "Blog doesn't Exist");
        }

        return blog;
    }

    static async getBlogList(query, page) {
        const limitBlogs = 5;
        const skipBlogs = (Number(page) - 1) * limitBlogs;
        const { count, rows } = await Blog.findAndCountAll({
            where: query,
            offset: skipBlogs,
            limit: limitBlogs
        });

        if (!rows) {
            throw new ApiError(500, "Internal Server Error when finding the blogs");
        }

        const pageCount = Math.ceil(count / limitBlogs);

        return {rows, pageCount}
    }
}