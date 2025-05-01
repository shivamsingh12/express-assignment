import jwt, { Secret } from "jsonwebtoken";

import { UserType } from "../types/userType.js";

type StringOrNull = null | string;

export default function validateJWT(token: StringOrNull) {
  const SECRET: string = process.env.JWT_SECRET_KEY ?? "";
  if (!token) return null;
  try {
    const decodedToken = jwt.verify(token, SECRET);
    return decodedToken as UserType;
  } catch (error) {
    return null;
  }
}
