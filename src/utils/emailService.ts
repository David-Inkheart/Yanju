/* eslint-disable no-console */
async function mockPasswordResetEmail(recipient: string, subject: string, message: string) {
  await console.log('Mock email sent:');
  await console.log('Recipient:', recipient);
  await console.log('Subject:', subject);
  await console.log('Message:', message);
}

export default mockPasswordResetEmail;
