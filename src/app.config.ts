import { registerAs } from '@nestjs/config';

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export default registerAs('environment', () => ({
  port: parseInt(getEnv('PORT')),
  url: getEnv('DATABASE_URL'),
  mail_user: getEnv('MAIL_USER'),
  mail_pass: getEnv('MAIL_PASS'),
}));