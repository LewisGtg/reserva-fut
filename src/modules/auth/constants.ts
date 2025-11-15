import { SetMetadata } from '@nestjs/common';
const secret = process.env.SECRET_KEY;

if (!secret) {
  throw new Error('SECRET_KEY is not defined in environment variables.');
}
export const jwtConstants = {
  secret,
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
