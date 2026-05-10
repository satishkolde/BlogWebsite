import request from 'supertest';
import express from 'express';
import userRoute from './user.route.js';
import { UserService } from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';

jest.mock('../services/user.service.js');
jest.mock('../middlewares/auth.middleware.js', () => ({
    verifyJwt: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/api/users', userRoute);

describe('User Routes Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/users/register', () => {
        it('should register a new user successfully', async () => {
            const mockUser = { username: 'newuser', id: 'user-id' };
            const mockToken = 'mock-jwt-token';

            UserService.registerUser.mockResolvedValueOnce({
                createdUser: mockUser,
                accessToken: mockToken
            });

            const response = await request(app)
                .post('/api/users/register')
                .send({
                    username: 'newuser',
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body.statusCode).toBe(201);
            expect(response.body.data).toEqual(mockUser);
        });

        it('should return 400 if credentials are invalid', async () => {
            UserService.registerUser.mockRejectedValueOnce(
                new ApiError(400, 'Invalid credentials')
            );

            const response = await request(app)
                .post('/api/users/register')
                .send({
                    username: '',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
        });

        it('should return 409 if user already exists', async () => {
            UserService.registerUser.mockRejectedValueOnce(
                new ApiError(409, 'User already exist')
            );

            const response = await request(app)
                .post('/api/users/register')
                .send({
                    username: 'existinguser',
                    password: 'password123'
                });

            expect(response.status).toBe(409);
        });
    });

    describe('POST /api/users/login', () => {
        it('should login user successfully', async () => {
            const mockUser = { username: 'testuser', id: 'user-id' };
            const mockToken = 'mock-jwt-token';

            UserService.loginUser.mockResolvedValueOnce({
                sendUser: mockUser,
                accessToken: mockToken
            });

            const response = await request(app)
                .post('/api/users/login')
                .send({
                    username: 'testuser',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.statusCode).toBe(200);
            expect(response.body.data).toEqual(mockUser);
        });

        it('should return 401 if credentials are invalid', async () => {
            UserService.loginUser.mockRejectedValueOnce(
                new ApiError(401, 'Invalid Credentials')
            );

            const response = await request(app)
                .post('/api/users/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
        });

        it('should return 404 if user does not exist', async () => {
            UserService.loginUser.mockRejectedValueOnce(
                new ApiError(404, "User didn't Exist")
            );

            const response = await request(app)
                .post('/api/users/login')
                .send({
                    username: 'nonexistent',
                    password: 'password123'
                });

            expect(response.status).toBe(404);
        });

        it('should return 401 if empty credentials provided', async () => {
            UserService.loginUser.mockRejectedValueOnce(
                new ApiError(401, 'Invalid credentials')
            );

            const response = await request(app)
                .post('/api/users/login')
                .send({
                    username: '',
                    password: ''
                });

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/users/logout', () => {
        it('should logout user successfully', async () => {
            const response = await request(app)
                .post('/api/users/logout');

            expect(response.status).toBe(200);
            expect(response.body.statusCode).toBe(200);
        });
    });
});
