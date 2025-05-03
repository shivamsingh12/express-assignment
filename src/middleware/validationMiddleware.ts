import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

interface ErrorResponseSchemaType {
  errors: SchemaErrorFieldsType[];
  type: string;
}

interface SchemaErrorFieldsType {
  code: string;
  message: string;
  path: string[];
}

interface ZodErrorType extends ErrorRequestHandler {
  issues: SchemaErrorFieldsType[];
}

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      const errorResponse: ErrorResponseSchemaType = {
        errors: [],
        type: "VALIDATION_ERROR",
      };
      errorResponse.errors = (error as ZodErrorType).issues.map(
        (item: SchemaErrorFieldsType) => ({
          code: item.code,
          message: item.message,
          path: item.path,
        }),
      );
      res.status(400).json(errorResponse).send();
    }
  };

export default validate;

console.log("validation middleware registered");
