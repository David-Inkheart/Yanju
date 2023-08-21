// import { Request, Response } from 'express';
// import { loginHandler, registerHandler } from '../../routes/routeHandlers/auth';
// import AuthController from '../Authcontroller';

// jest.mock('../repositories/user');
// jest.mock('../utils/passwordService');

// let mockRequest: jest.Mocked<Request>;
// let mockResponse: jest.Mocked<Response>;

// beforeEach(() => {
//   mockRequest = {
//     body: {
//       username: 'testuser',
//       email: 'test@email.com',
//       password: 'testpassword',
//     },
//   } as unknown as jest.Mocked<Request>;

//   mockResponse = {
//     status: jest.fn().mockReturnThis(),
//     json: jest.fn(),
//   } as unknown as jest.Mocked<Response>;
// });

// describe('AuthController', () => {
//   describe('register', () => {
//     it('should return 400 if validation fails', async () => {
//       mockRequest.body = {};
//       await registerHandler(mockRequest, mockResponse, jest.fn());

//       expect(mockResponse.status).toHaveBeenCalledWith(400);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         success: false,
//         error: '"username" is required',
//       });
//     });

//     it.skip('should return 201 if user is created successfully', async () => {
//       await registerHandler(mockRequest, mockResponse, jest.fn());
//       expect(mockResponse.status).toHaveBeenCalledWith(201);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         success: true,
//         message: 'User registered successfully',
//         token: expect.any(String),
//       });
//     });

//     it('should return 409 if user already exists', async () => {
//       await AuthController.register(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(409);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         success: false,
//         error: 'User with same email or username already exists',
//       });
//     });
//   });
// });

// describe('login', () => {
//   //
// });
