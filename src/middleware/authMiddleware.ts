import { NextFunction, Request, Response } from "express";

import redisClient from "../utils/getRedisClient.js";
import validateJWT from "../utils/validateJWT.js";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token: string = (req.headers.authorization ??
    req.headers.Authorization) as string;
  const isLoggedOut = await redisClient?.get(token ?? "");
  if (!validateJWT(token) || isLoggedOut === "LOGGED_OUT") {
    res.status(401).json({ message: "Invalid authorization header" }).send();
    return;
  } else {
    next();
  }
};

export default authMiddleware;

console.log("auth middleware registered");
