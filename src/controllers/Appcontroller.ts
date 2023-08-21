class AppController {
  static getHome() {
    return {
      success: true,
      message: 'API is online, welcome!',
      data: {
        name: 'FinApp',
        purpose: 'Payment made easy',
        API: 'REST',
        version: '1.0.0',
        API_docs: 'update',
      },
    };
  }
}

export default AppController;
