const secret = process.env.SECRET_KEY;

if (!secret) {
  throw new Error('SECRET_KEY is not defined in environment variables.');
}

export const jwtConstants = {
  secret,
};
