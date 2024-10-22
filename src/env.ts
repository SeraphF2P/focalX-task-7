import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET ??
  (() => {
    throw new Error("JWT secret is missing in the .env file");
  })();

const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN ??
  (() => {
    throw new Error("JWT expires in is missing in the .env file");
  })();
export const env = { JWT_SECRET, JWT_EXPIRES_IN };
export default env;
