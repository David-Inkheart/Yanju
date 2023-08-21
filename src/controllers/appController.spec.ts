import AppController from './Appcontroller';

describe('get home', () => {
  it('should return the home page', () => {
    const response = AppController.getHome();

    expect(response).toEqual({
      success: true,
      message: 'API is online, welcome!',
      data: {
        name: 'FinApp',
        purpose: 'Payment made easy',
        API: 'REST',
        version: '1.0.0',
        API_docs: 'update',
      },
    });
  });
});
