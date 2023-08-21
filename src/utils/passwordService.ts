import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePasswords = async (plainTextPassword: string, hashedPassword: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
  return isMatch;
};
