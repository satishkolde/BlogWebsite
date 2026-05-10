import { UserService } from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';

jest.mock('../services/user.service.js');

describe('User Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            cookie: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            clearCookie: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('registerUserController', () => {
        it('should register a user successfully', async () => {
            req.body = { username: 'testuser', password: 'password123' };

            const mockUser = { username: 'testuser' };
            const mockToken = 'mock-token';

            UserService.registerUser.mockResolvedValueOnce({
                createdUser: mockUser,
                accessToken: mockToken
            });

            // Simulate controller behavior
            const { createdUser, accessToken } = await UserService.registerUser(
                req.body.username,
                req.body.password
            );

            expect(UserService.registerUser).toHaveBeenCalledWith('testuser', 'password123');
            expect(createdUser).toEqual(mockUser);
            expect(accessToken).toBe(mockToken);
        });

        it('should handle registration errors', async () => {
            req.body = { username: 'testuser', password: '' };

            UserService.registerUser.mockRejectedValueOnce(
                new ApiError(400, 'Invalid credentials')
            );

            await expect(
                UserService.registerUser(req.body.username, req.body.password)
            ).rejects.toThrow(ApiError);
        });
    });

    describe('loginUserController', () => {
        it('should login a user successfully', async () => {
            req.body = { username: 'testuser', password: 'password123' };

            const mockUser = { username: 'testuser' };
            const mockToken = 'mock-token';

            UserService.loginUser.mockResolvedValueOnce({
                sendUser: mockUser,
                accessToken: mockToken
            });

            const { sendUser, accessToken } = await UserService.loginUser(
                req.body.username,
                req.body.password
            );

            expect(UserService.loginUser).toHaveBeenCalledWith('testuser', 'password123');
            expect(sendUser).toEqual(mockUser);
            expect(accessToken).toBe(mockToken);
        });

        it('should handle login errors - invalid credentials', async () => {
            req.body = { username: 'testuser', password: 'wrongpassword' };

            UserService.loginUser.mockRejectedValueOnce(
                new ApiError(401, 'Invalid Credentials')
            );

            await expect(
                UserService.loginUser(req.body.username, req.body.password)
            ).rejects.toThrow(ApiError);
        });

        it('should handle login errors - user not found', async () => {
            req.body = { username: 'nonexistent', password: 'password123' };

            UserService.loginUser.mockRejectedValueOnce(
                new ApiError(404, "User didn't Exist")
            );

            await expect(
                UserService.loginUser(req.body.username, req.body.password)
            ).rejects.toThrow(ApiError);
        });
    });

    describe('Response Handling', () => {
        it('should set proper cookie options on register', async () => {
            const cookieOptions = {
                httpOnly: true,
                secure: true
            };

            res.cookie('accessToken', 'mock-token', cookieOptions);

            expect(res.cookie).toHaveBeenCalledWith('accessToken', 'mock-token', cookieOptions);
        });

        it('should clear cookie on logout', async () => {
            const cookieOptions = {
                httpOnly: true,
                secure: true
            };

            res.clearCookie('accessToken', cookieOptions);

            expect(res.clearCookie).toHaveBeenCalledWith('accessToken', cookieOptions);
        });
    });
});
