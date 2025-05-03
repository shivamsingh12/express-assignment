import { Router } from "express";
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

console.log("user routes registered");
