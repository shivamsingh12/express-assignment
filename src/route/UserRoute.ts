import { Request, Response } from "express";
import { Router } from "express";

import {
  assignRole,
  logIn,
  logOut,
  signUp,
} from "../controller/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkRole from "../middleware/checkRole.js";
import validateSchema from "../middleware/validationMiddleware.js";
import {
  LogInSchema,
  SignUpSchema,
  UpdateUserRoleSchema,
} from "../schema/UserSchema.js";

const router = Router();

router.post("/login", validateSchema(LogInSchema), logIn);

router.post("/signup", validateSchema(SignUpSchema), signUp);

router.put(
  "/assign-role",
  authMiddleware,
  checkRole,
  validateSchema(UpdateUserRoleSchema),
  assignRole,
);

router.delete("/logout", authMiddleware, logOut);

export default router;
