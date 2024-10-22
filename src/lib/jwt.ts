import JWT from "jsonwebtoken";
import { env } from "./../env";
type CreateTokenType = [
  data: Parameters<typeof JWT.sign>[0],
  options?: Parameters<typeof JWT.sign>[2],
  cb?: Parameters<typeof JWT.sign>[3]
];

export const createToken = (...[data, options, cb]: CreateTokenType) => {
  try {
    return JWT.sign(data, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      ...(options ?? {}),
    });
  } catch (error) {
    console.error(error);
  }
};
export const verifyToken = (token: string) => {
  try {
    return JWT.verify(token, env.JWT_SECRET);
  } catch (error) {
    console.error(error);
  }
};
