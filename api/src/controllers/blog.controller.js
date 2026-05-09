import { Op } from "sequelize";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { BlogService } from "../services/blog.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const getUserPrivateBlogsController = asyncHandler(async (req, res) => {
    const page = Number(req.query?.page) || 1;
    const title = req.query?.title;
    const query = {
        author: req.user.username
    };
    if(title && title.trim() !== "") {
        query["title"] = {
            [Op.like] :`%${title}%`
        }
    }

    const {rows, pageCount} = await BlogService.getBlogList(query,page);
    
    res.status(200).send(new ApiResponse(200,"Got All the blogs",{blogs:rows,count:pageCount}));
});

export const getUserPublicBlogController = asyncHandler(async (req, res) => {
    const {username} = req.params;
    const page = Number(req.query?.page) || 1;

    if(!username || username.trim() === '') {
        throw new ApiError(400,"Username is requiered");
    }

    const title = req.query?.title;
    const query = {
        is_published: true,
        author: username
    };
    if(title && title.trim() !== "") {
        query["title"] = {
            [Op.like] :`%${title}%`
        }
    }

    const {rows, pageCount} = await BlogService.getBlogList(query,page);

    res.status(200).send(new ApiResponse(200,"Got All the blogs",{blogs:rows,count:pageCount}));
});

export const getSpecificBlogController = asyncHandler(async (req, res) => {
    const id = req.body?.id;
    
    const blog = await BlogService.getSpecificBlog(req.user.username,id);
    
    res.status(200).send(new ApiResponse(200, "Got the Specific blog", blog));
});

export const getPaginatedBlogsController = asyncHandler(async (req, res) => {
    const page = Number(req.query?.page) || 1;
    const title = req.query?.title;
    console.log(title);
    const query = {
        is_published: true
    };
    if(title && title.trim() !== "") {
        query["title"] = {
            [Op.like] :`%${title}%`
        }
    }
    

    const {rows, pageCount} = await BlogService.getBlogList(query,page);

    res.status(200).send(new ApiResponse(200,"Got All the blogs",{blogs:rows,count:pageCount}));
});

export const createBlogController = asyncHandler(async (req, res) => {
    const {title, body} = req.body;
    const is_published = req.body?.is_published || false;
    
    const blog = await BlogService.createBlog(req.user.username,title,body,is_published);

    res.status(201).send(new ApiResponse(201,"Created Blog successfully",{blog}));
});

export const updateBlogController = asyncHandler(async (req, res) => {
    const id = req.params?.id;
    const {title, body, is_published} = req.body;
    
    const updatedBlog = await BlogService.updateBlog(req.user.username,id,title,body,is_published);

    res.status(200).send(new ApiResponse(200,"Updated Blog successfully",{blog:updatedBlog}));
});

export const deleteBlogController = asyncHandler(async (req, res) => {
    const id = req.params?.id;
    
    await BlogService.deleteBlog(req.user.username,id);

    res.status(204).send();
});

