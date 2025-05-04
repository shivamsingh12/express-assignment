import { Router } from "express";
import asyncHandler from "express-async-handler";
import morgan from "morgan";

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

router.use(morgan("combined"));

router.post("/login", validateSchema(LogInSchema), asyncHandler(logIn));

router.post("/signup", validateSchema(SignUpSchema), asyncHandler(signUp));

router.put(
  "/assign-role",
  authMiddleware,
  asyncHandler(checkRole),
  validateSchema(UpdateUserRoleSchema),
  asyncHandler(assignRole),
);

router.delete("/logout", authMiddleware, asyncHandler(logOut));

export default router;

console.log("user routes registered");
