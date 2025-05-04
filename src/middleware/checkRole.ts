import { NextFunction, Request, Response } from "express";

import { UserType } from "../types/userType.js";
import validateJWT from "../utils/validateJWT.js";

const checkRole = (req: Request, res: Response, next: NextFunction) => {
  const token: string = (req.headers.authorization ??
    req.headers.Authorization) as string;
  const user: null | UserType = validateJWT(token);
  if (
    (req.path === "/assign-role" || req.method === "DELETE") &&
    user?.role != "ADMIN"
  ) {
    res.status(403).json({ message: "insufficient privileges" }).send();
    return;
  }
  next();
};

export default checkRole;

console.log("role middleware registered");
