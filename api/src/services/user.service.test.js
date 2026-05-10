import { UserService } from './user.service.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

jest.mock('../models/user.model.js');

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            const mockUser = {
                username: 'testuser',
                password: 'hashedpassword',
                generateAccessToken: jest.fn(() => 'mock-token')
            };

            User.findByPk.mockResolvedValueOnce(null);
            User.create.mockResolvedValueOnce(mockUser);
            User.findByPk.mockResolvedValueOnce({
                username: 'testuser',
                generateAccessToken: jest.fn(() => 'mock-token')
            });

            const result = await UserService.registerUser('testuser', 'password123');

            expect(result.createdUser).toBeDefined();
            expect(result.accessToken).toBe('mock-token');
            expect(User.create).toHaveBeenCalledWith({
                username: 'testuser',
                password: 'password123'
            });
        });

        it('should throw error if username is empty', async () => {
            await expect(UserService.registerUser('', 'password123')).rejects.toThrow(
                new ApiError(400, "Invalid credentials")
            );
        });

        it('should throw error if password is empty', async () => {
            await expect(UserService.registerUser('testuser', '')).rejects.toThrow(
                new ApiError(400, "Invalid credentials")
            );
        });

        it('should throw error if username is whitespace', async () => {
            await expect(UserService.registerUser('   ', 'password123')).rejects.toThrow(
                new ApiError(400, "Invalid credentials")
            );
        });

        it('should throw error if user already exists', async () => {
            const existingUser = {
                username: 'testuser',
                password: 'hashedpassword'
            };

            User.findByPk.mockResolvedValueOnce(existingUser);

            await expect(UserService.registerUser('testuser', 'password123')).rejects.toThrow(
                new ApiError(409, "User already exist")
            );
        });

        it('should throw error if user creation fails', async () => {
            User.findByPk.mockResolvedValueOnce(null);
            User.create.mockResolvedValueOnce({
                username: 'testuser'
            });
            User.findByPk.mockResolvedValueOnce(null);

            await expect(UserService.registerUser('testuser', 'password123')).rejects.toThrow(
                new ApiError(500, "Internal Server Error While creating the user")
            );
        });
    });

    describe('loginUser', () => {
        it('should login user successfully with correct credentials', async () => {
            const mockUser = {
                username: 'testuser',
                password: 'hashedpassword',
                isPasswordCorrect: jest.fn().mockResolvedValue(true),
                generateAccessToken: jest.fn(() => 'mock-token'),
                toJSON: jest.fn(() => ({
                    username: 'testuser',
                    password: 'hashedpassword'
                }))
            };

            User.findByPk.mockResolvedValueOnce(mockUser);

            const result = await UserService.loginUser('testuser', 'password123');

            expect(result.sendUser).toBeDefined();
            expect(result.accessToken).toBe('mock-token');
            expect(mockUser.isPasswordCorrect).toHaveBeenCalledWith('password123');
            expect(result.sendUser.password).toBeUndefined();
        });

        it('should throw error if username is empty', async () => {
            await expect(UserService.loginUser('', 'password123')).rejects.toThrow(
                new ApiError(401, "Invalid credentials")
            );
        });

        it('should throw error if password is empty', async () => {
            await expect(UserService.loginUser('testuser', '')).rejects.toThrow(
                new ApiError(401, "Invalid credentials")
            );
        });

        it('should throw error if user does not exist', async () => {
            User.findByPk.mockResolvedValueOnce(null);

            await expect(UserService.loginUser('nonexistent', 'password123')).rejects.toThrow(
                new ApiError(404, "User didn't Exist")
            );
        });

        it('should throw error if password is incorrect', async () => {
            const mockUser = {
                username: 'testuser',
                isPasswordCorrect: jest.fn().mockResolvedValue(false)
            };

            User.findByPk.mockResolvedValueOnce(mockUser);

            await expect(UserService.loginUser('testuser', 'wrongpassword')).rejects.toThrow(
                new ApiError(401, "Invalid Credentials")
            );
        });

        it('should throw error if token generation fails', async () => {
            const mockUser = {
                username: 'testuser',
                isPasswordCorrect: jest.fn().mockResolvedValue(true),
                generateAccessToken: jest.fn(() => null),
                toJSON: jest.fn()
            };

            User.findByPk.mockResolvedValueOnce(mockUser);

            await expect(UserService.loginUser('testuser', 'password123')).rejects.toThrow(
                new ApiError(500, "Internal Server Error while creating the accessToken")
            );
        });
    });
});
