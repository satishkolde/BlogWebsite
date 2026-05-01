import express from 'express';
import dotenv from 'dotenv';
import {errorHandler} from './middlewares/errorHandler.middleware.js'
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import blogRouter from './routes/blog.route.js';
import commentRouter from './routes/comment.route.js';
import cors from 'cors';

const app = express();

dotenv.config({
    path: "./.env"
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/comment", commentRouter);

app.use(errorHandler);

export {app};