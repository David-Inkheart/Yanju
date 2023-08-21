// import { Request, Response } from 'express';
// import QuestionController from '../Questioncontroller';

// let mockRequest: jest.Mocked<Request>;
// let mockResponse: jest.Mocked<Response>;

// beforeEach(() => {
//   // mock the request and response objects
//   mockRequest = {
//     userId: 7,
//     params: {
//       id: '6',
//     },
//     body: {
//       title: 'How to create a new question',
//       content: 'I have been trying to create a new question but I am unable to do so',
//     },
//   } as unknown as jest.Mocked<Request>;
//   mockResponse = {
//     status: jest.fn().mockReturnThis(),
//     json: jest.fn(),
//   } as unknown as jest.Mocked<Response>;
// });

// afterEach(() => {
//   jest.clearAllMocks();
// });

// describe('get list of all questions', () => {
//   it('returns a status code of 200', async () => {
//     await QuestionController.listQuestions(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//   });

//   it('calls the json method', async () => {
//     await QuestionController.listQuestions(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalled();
//   });

//   it('returns a success message with clear data', async () => {
//     await QuestionController.listQuestions(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: true,
//         message: expect.any(String),
//         data: expect.any(Object),
//       }),
//     );
//   });

//   it('returns clear response when there is an error', async () => {
//     const mockError = new Error('There was an error fetching the data');
//     mockResponse.json = jest.fn().mockImplementationOnce(() => {
//       throw mockError;
//     });
//     await QuestionController.listQuestions(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//         data: expect.any(String),
//       }),
//     );
//   });
// });

// describe('get list of all questions by a user', () => {
//   it('returns a status code of 200', async () => {
//     await QuestionController.listUserQuestions(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//   });

//   it('calls the json method', async () => {
//     await QuestionController.listUserQuestions(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalled();
//   });

//   it('returns a success message with clear data', async () => {
//     await QuestionController.listUserQuestions(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: true,
//         message: expect.any(String),
//         data: expect.any(Object),
//       }),
//     );
//   });

//   it('returns clear response when there is an error', async () => {
//     const mockError = new Error('There was an error fetching the data');
//     mockResponse.json = jest.fn().mockImplementationOnce(() => {
//       throw mockError;
//     });
//     await QuestionController.listUserQuestions(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//         data: expect.any(String),
//       }),
//     );
//   });
// });

// describe('create a new question', () => {
//   it.skip('calls the json method, returns 201 and returns a clear success message', async () => {
//     await QuestionController.createQuestion(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(201);
//     expect(mockResponse.json).toHaveBeenCalled();
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: true,
//         message: expect.any(String),
//         data: expect.any(Object),
//       }),
//     );
//   });

//   it('returns an error message when the request body is invalid', async () => {
//     mockRequest.body = {
//       title: 'How to create a new question',
//     };
//     await QuestionController.createQuestion(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns an error message when the request body is empty', async () => {
//     mockRequest.body = {};
//     await QuestionController.createQuestion(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });
// });

// describe('update a question', () => {
//   // mock the userId, request body and request params
//   beforeEach(() => {
//     mockRequest.body = {
//       title: 'How to create a question',
//       content: 'I have been trying to create a new question but I am unable to do so',
//     };
//     mockRequest.params = {
//       id: '39',
//     };
//   });

//   it('calls the json method, returns 200', async () => {
//     await QuestionController.updateQuestion(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//     expect(mockResponse.json).toHaveBeenCalled();
//   });

//   it('returns a success message with clear data', async () => {
//     await QuestionController.updateQuestion(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: true,
//         message: expect.any(String),
//         data: expect.any(Object),
//       }),
//     );
//   });

//   it('returns an error message when the request body is invalid', async () => {
//     mockRequest.body = {
//       title: 'How to create a new question',
//     };
//     await QuestionController.updateQuestion(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns an error message when the request body is empty', async () => {
//     mockRequest.body = {};
//     await QuestionController.updateQuestion(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns an error message when the question does not exist', async () => {
//     mockRequest.params = {
//       id: '0',
//     };
//     await QuestionController.updateQuestion(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns an error message when the user is not the author of the question', async () => {
//     mockRequest.userId = 2;
//     await QuestionController.updateQuestion(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: 'You are not authorized to update this question',
//       }),
//     );
//   });
// });

// describe('delete a question', () => {
//   it('calls the json method, returns 404, and a clear message', async () => {
//     mockRequest.params = {
//       id: '37',
//     };
//     await QuestionController.deleteQuestion(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(404); // question not found since we have deleted it previously
//     expect(mockResponse.json).toHaveBeenCalled();
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: 'Question not found',
//       }),
//     );
//   });

//   it('returns an error message when the question does not exist', async () => {
//     mockRequest.params = {
//       id: '7',
//     };
//     await QuestionController.deleteQuestion(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns an error message when the user is not the author of the question', async () => {
//     mockRequest.params = {
//       id: '1',
//     };
//     await QuestionController.deleteQuestion(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: 'You are not authorized to delete this question',
//       }),
//     );
//   });

//   it('returns an error message when there is an error deleting the question', async () => {
//     const mockError = new Error('There was an error deleting the question');
//     mockResponse.json = jest.fn().mockImplementationOnce(() => {
//       throw mockError;
//     });
//     await QuestionController.deleteQuestion(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });
// });
