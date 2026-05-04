import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const getAllBlogsController = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({is_publised:true});

    if(!blogs){
        throw new ApiError(500, "Internal Server Error when finding the blogs");
    }

    res.status(200).send(new ApiResponse(200,"Got All the blogs",{blogs}));
});

export const getUserPrivateBlogsController = asyncHandler(async (req, res) => {
    const page = Number(req.query?.page) || 1;
    const limitBlogs = 5;
    const skipBlogs = (Number(page) - 1)*limitBlogs;
    let blogs = await Blog.countDocuments({author:req.user._id});
    const pageCount = Math.ceil(blogs/limitBlogs);
    blogs =  await Blog.find({author:req.user._id}).skip(skipBlogs).limit(limitBlogs);

    res.status(200).send(new ApiResponse(200,"Got All the blogs",{blogs,count:pageCount}));
});

export const getUserPublicBlogController = asyncHandler(async (req, res) => {
    const {username} = req.params?.username;

    if(!username || username.trim() === '') {
        throw new ApiError(400,"Username is requiered");
    }

    const user = await User.findOne({username});
    const blogs = await Blog.find({author:user._id,is_publised:true});

    if(!blogs){
        throw new ApiError(500, "Internal Server Error when finding the blogs");
    }

    res.status(200).send(new ApiResponse(200,"Got All the blogs",{blogs}));
});

export const getSpecificBlogController = asyncHandler(async (req, res) => {
    const id = req.body?.id;
    
    if(!id || id?.trim() === "") {
        throw new ApiError(400, "Blog id is required to get the blog");
    }

    const blog = await Blog.findById(id);

    if(!blog) {
        throw new ApiError(404, "Blog doesn't Exist");
    }
    res.status(200).send(new ApiResponse(200, "Got the Specific blog", blog));
});

export const getPaginatedBlogsController = asyncHandler(async (req, res) => {
    const page = Number(req.query?.page) || 1;
    const limitBlogs = 5;
    const skipBlogs = (Number(page) - 1)*limitBlogs;
    let blogs = await Blog.countDocuments({is_publised:true});
    const pageCount = Math.ceil(blogs/limitBlogs);
    blogs =  await Blog.find({is_publised:true}).skip(skipBlogs).limit(limitBlogs);

    res.status(200).send(new ApiResponse(200,"Got All the blogs",{blogs,count:pageCount}));
});

export const getTotalNumberOfPagesController = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({is_publised:true});
    const pagesCount = Math.ceil(blogs.length/5);
    res.status(200).send(new ApiResponse(200,"Got the pages number", {count:pagesCount}));
})

export const createBlogController = asyncHandler(async (req, res) => {
    const {title, body} = req.body;
    const is_publised = req.body?.is_publised || false;
    if(!title || !body || title.trim() === "" || body.trim() === ""){
        throw new ApiError(400, "Title or Body shouldn't empty");
    }

    if(title.length > 100) {
        throw new ApiError(400, "Title length shouldn't greater than 100");
    }

    const duplicateBlog = await Blog.findOne({title:title,author:req.user._id});

    if(duplicateBlog) {
        throw new ApiError(409,"Blog already exist");
    }

    const currentDate = (is_publised)? (new Date()): undefined;

    const blog = await Blog.create({
        title:title,
        body:body,
        is_publised:is_publised,
        author:req.user._id,
        published_at: currentDate
    });

    const createdBlog = await Blog.findById(blog._id).select("-author");

    if(!createdBlog) {
        throw new ApiError(500, "Internal Server Error while creating the blog");
    }

    res.status(201).send(new ApiResponse(201,"Created Blog successfully",{blog,author:req.user}));
});

export const updateBlogController = asyncHandler(async (req, res) => {
    const {title, body, is_publised} = req.body;

    if(!title || !body || title.trim() === "" || body.trim() === ""){
        throw new ApiError(400, "Title or Body shouldn't empty");
    }

    
    const blog = await Blog.findOne({title,author:req.user._id});
    
    if(!blog) {
        throw new ApiError(404,"Blog not found for the user");
    }
    
    const currentDate = (is_publised)? (new Date()): undefined;

    blog.body = body;
    blog.is_publised = is_publised;
    blog.published_at = currentDate;
    const updatedBlog = await blog.save();
    
    if(updatedBlog.body !== blog.body){
        throw new ApiError(500, "Internal Server Error while updating the blog");
    }

    const sendData = updatedBlog.toObject();
    
    delete sendData.author;

    res.status(200).send(new ApiResponse(200,"Updated Blog successfully",{blog:sendData,author:req.user}));
});

export const deleteBlogController = asyncHandler(async (req, res) => {
    const blogTitle = req.body?.title;
    
    if(!blogTitle || blogTitle.trim() === "") {
        throw new ApiError(400,"Blog title is required");
    } 

    const blog = await Blog.findOneAndDelete({title:blogTitle, author:req.user._id});

    if(!blog) {
        throw new ApiError(404, "Blog doesn't exist");
    }

    res.status(204).send();
});

