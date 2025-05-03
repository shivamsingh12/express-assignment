import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import getErrorMessage from "../utils/getErrorMessage.js";

const errorMiddleWare = (
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(error);
  res.status(500).json({ message: getErrorMessage(error) });
};

export default errorMiddleWare;

console.log("error middleware registered");
