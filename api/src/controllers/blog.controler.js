import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const getAllBlogsController = asyncHandler(async (req, res) => {
    const blogs = await Blog.findAll({where:{
        is_published: true
    }});

    if(!blogs){
        throw new ApiError(500, "Internal Server Error when finding the blogs");
    }

    res.status(200).send(new ApiResponse(200,"Got All the blogs",{blogs}));
});

export const getUserPrivateBlogsController = asyncHandler(async (req, res) => {
    const page = Number(req.query?.page) || 1;
    const limitBlogs = 5;
    const skipBlogs = (Number(page) - 1)*limitBlogs;
    const {count, rows} = await Blog.findAndCountAll({
        where: {
            author: req.user.username
        },
        offset: skipBlogs,
        limit: limitBlogs
    });

    if(!rows){
        throw new ApiError(500, "Internal Server Error when finding the blogs");
    }

    const pageCount = Math.ceil(count/limitBlogs);
    res.status(200).send(new ApiResponse(200,"Got All the blogs",{blogs:rows,count:pageCount}));
});

export const getUserPublicBlogController = asyncHandler(async (req, res) => {
    const {username} = req.params;
    const page = Number(req.query?.page) || 1;

    if(!username || username.trim() === '') {
        throw new ApiError(400,"Username is requiered");
    }

    const limitBlogs = 5;
    const skipBlogs = (Number(page) - 1)*limitBlogs;
    const {count, rows} = await Blog.findAndCountAll({
        where: {
            author: req.user.username,
            is_publised: true
        },
        offset: skipBlogs,
        limit: limitBlogs
    });

    if(!rows){
        throw new ApiError(500, "Internal Server Error when finding the blogs");
    }

    const pageCount = Math.ceil(count/limitBlogs);
    res.status(200).send(new ApiResponse(200,"Got All the blogs",{blogs:rows,count:pageCount}));


    res.status(200).send(new ApiResponse(200,"Got All the blogs",{blogs}));
});

export const getSpecificBlogController = asyncHandler(async (req, res) => {
    const id = req.body?.id;
    
    if(!id || id?.trim() === "") {
        throw new ApiError(400, "Blog id is required to get the blog");
    }

    const blog = await Blog.findByPk(id);

    if(!blog) {
        throw new ApiError(404, "Blog doesn't Exist");
    }
    res.status(200).send(new ApiResponse(200, "Got the Specific blog", blog));
});

export const getPaginatedBlogsController = asyncHandler(async (req, res) => {
    const page = Number(req.query?.page) || 1;
    const limitBlogs = 5;
    const skipBlogs = (Number(page) - 1)*limitBlogs;
    const {count, rows} = await Blog.findAndCountAll({
        where: {
            author: req.user.username
        },
        offset: skipBlogs,
        limit: limitBlogs
    });

    if(!rows){
        throw new ApiError(500, "Internal Server Error when finding the blogs");
    }
    
    const pageCount = Math.ceil(count/limitBlogs);

    res.status(200).send(new ApiResponse(200,"Got All the blogs",{blogs:rows,count:pageCount}));
});

export const createBlogController = asyncHandler(async (req, res) => {
    const {title, body} = req.body;
    const is_publised = req.body?.is_publised || false;
    if(!title || !body || title.trim() === "" || body.trim() === ""){
        throw new ApiError(400, "Title or Body shouldn't empty");
    }

    if(title.length > 100) {
        throw new ApiError(400, "Title length shouldn't greater than 100");
    }

    const duplicateBlog = await Blog.findOne({where:{
        title: title,
        author: req.user.username
    }});

    if(duplicateBlog) {
        throw new ApiError(409,"Blog already exist");
    }


    const blog = await Blog.create({
        title:title,
        body:body,
        is_publised:is_publised,
        author:req.user.username,
    });

    const createdBlog = await Blog.findByPk(blog.id,{
        attributes: {
            exclude: ["author"]
        }
    });

    if(!createdBlog) {
        throw new ApiError(500, "Internal Server Error while creating the blog");
    }

    res.status(201).send(new ApiResponse(201,"Created Blog successfully",{blog,author:req.user}));
});

export const updateBlogController = asyncHandler(async (req, res) => {
    const id = req.params?.id;
    const {title, body, is_published} = req.body;
    
    const blog = await Blog.findByPk(id);
    
    if(!blog) {
        throw new ApiError(404,"Blog not found for the user");
    }
    
    if(title){
        blog.title = title;
    }

    if(body) {
        blog.body = body;
    }

    if(is_published) {
        blog.is_publised = is_published;
    }
    const updatedBlog = (await blog.save()).toJSON();
    delete updatedBlog.author;

    res.status(200).send(new ApiResponse(200,"Updated Blog successfully",{blog:updatedBlog,author:req.user}));
});

export const deleteBlogController = asyncHandler(async (req, res) => {
    const id = req.params?.id;
    
    if(!id || id.trim() === "") {
        throw new ApiError(400,"Blog title is required");
    } 

    const blog = await Blog.destroy({where:{
        id: id,
        author: req.user.username
    }});

    if(!blog) {
        throw new ApiError(404, "Blog doesn't exist");
    }

    res.status(204).send();
});

