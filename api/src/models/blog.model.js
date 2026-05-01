import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: [100, "Blog title can't be greater than 100 characters"]
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    is_publised: {
        type: Boolean,
        default: false
    },
    published_at: {
        type: Date,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, {timestamps: true});

export const Blog = mongoose.model("Blog", blogSchema);
