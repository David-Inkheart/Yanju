// import { Request, Response } from 'express';
// import AnswerController from '../Answercontroller';

// let mockRequest: jest.Mocked<Request>;
// let mockResponse: jest.Mocked<Response>;

// beforeEach(() => {
//   mockRequest = {
//     userId: 7,
//     params: {
//       id: '1',
//       answerId: '10',
//     },
//     body: {
//       content: 'I have also been trying to create a new question but I am unable to do so',
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

// describe('get list of all answers to a question', () => {
//   it('returns a status code of 200', async () => {
//     await AnswerController.listQuestionAnswers(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//   });

//   it('calls the json method', async () => {
//     await AnswerController.listQuestionAnswers(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalled();
//   });

//   it('returns a success message with clear data', async () => {
//     await AnswerController.listQuestionAnswers(mockRequest, mockResponse);
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
//     // force an error
//     mockRequest.params.id = 'a';
//     await AnswerController.listQuestionAnswers(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns a success message when there are no answers', async () => {
//     mockResponse.json = jest.fn().mockImplementationOnce(() => {
//       throw new Error('There are no answers to this question');
//     });
//     // question with id 3 has no answers
//     mockRequest.params.id = '3';
//     await AnswerController.listQuestionAnswers(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: true,
//         message: expect.any(String),
//       }),
//     );
//   });
// });

// describe('list all answers posted by a user', () => {
//   it('returns a status code of 200', async () => {
//     await AnswerController.listUserAnswers(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//   });

//   it('calls the json method', async () => {
//     await AnswerController.listUserAnswers(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalled();
//   });

//   it('returns a success message with clear data', async () => {
//     await AnswerController.listUserAnswers(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: true,
//         message: expect.any(String),
//         data: expect.any(Object),
//       }),
//     );
//   });

//   it('returns clear response when there is an error', async () => {
//     // force an error
//     mockRequest.userId = NaN;
//     await AnswerController.listUserAnswers(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns a success message when there are no answers', async () => {
//     // user with id 5 has no answers
//     mockRequest.userId = 5;
//     await AnswerController.listUserAnswers(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: true,
//         message: expect.any(String),
//       }),
//     );
//   });
// });

// describe('create a new answer', () => {
//   it.skip('returns a json with status 201 and a clear message', async () => {
//     mockRequest.params.id = '39';
//     await AnswerController.createAnswer(mockRequest, mockResponse);
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

//   it('returns clear response when there is an error', async () => {
//     // force an error
//     mockRequest.userId = NaN;
//     await AnswerController.createAnswer(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns a 400 error when the question id is invalid', async () => {
//     mockRequest.params.id = 'a';
//     await AnswerController.createAnswer(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns a 400 error when the user input is invalid', async () => {
//     mockRequest.body.content = '';
//     await AnswerController.createAnswer(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns a 404 error when the question does not exist', async () => {
//     mockRequest.params.id = '90000000';
//     await AnswerController.createAnswer(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(404);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });
// });

// describe('update an answer', () => {
//   it.skip('returns a json with status 200 and a clear message', async () => {
//     mockRequest.params.id = '39';
//     mockRequest.params = {
//       answerId: '12',
//     };
//     await AnswerController.updateAnswer(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//     expect(mockResponse.json).toHaveBeenCalled();
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: true,
//         message: expect.any(String),
//         data: expect.any(Object),
//       }),
//     );
//   });

//   it('returns clear response when there is an error', async () => {
//     // force an error
//     mockRequest.userId = NaN;
//     await AnswerController.updateAnswer(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns a 400 error when the question id is invalid', async () => {
//     mockRequest.params.id = 'a';
//     await AnswerController.updateAnswer(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns a 400 error when the user input is invalid', async () => {
//     mockRequest.body.content = '';
//     await AnswerController.updateAnswer(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns a 404 error when the answer does not exist', async () => {
//     mockRequest.params.id = '90000000';
//     await AnswerController.updateAnswer(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(404);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });
// });

// describe('delete an answer', () => {
//   it('returns a json with status 404 and a clear message', async () => {
//     await AnswerController.deleteAnswer(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(404); // should be 200 but question has been deleted
//     expect(mockResponse.json).toHaveBeenCalled();
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns clear response when there is an error', async () => {
//     // force an error
//     mockRequest.userId = NaN;
//     await AnswerController.deleteAnswer(mockRequest, mockResponse);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns a 400 error when the question id is invalid', async () => {
//     mockRequest.params.id = 'a';
//     await AnswerController.deleteAnswer(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(400);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns a 404 error when the answer does not exist', async () => {
//     await AnswerController.deleteAnswer(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(404);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });

//   it('returns a 403 error when the user is not the author of the answer', async () => {
//     mockRequest.params.answerId = '1';
//     await AnswerController.deleteAnswer(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(403);
//     expect(mockResponse.json).toHaveBeenCalledWith(
//       expect.objectContaining({
//         success: false,
//         error: expect.any(String),
//       }),
//     );
//   });
// });
