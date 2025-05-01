import { NextFunction, Request, Response } from "express";

import validateJWT from "../utils/validateJWT.js";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token: string = (req.headers.authorization ??
    req.headers.Authorization) as string;
  console.log(validateJWT(token));
  if (!validateJWT(token)) {
    console.log(validateJWT(token));
    res.status(401).json({ message: "Invalid authorization header" }).send();
  } else {
    next();
  }
};

export default authMiddleware;
