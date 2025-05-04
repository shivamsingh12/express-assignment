import { Router } from "express";
import asyncHandler from "express-async-handler";
import morgan from "morgan";

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controller/TaskController.js";
import cacheMiddleware from "../middleware/cacheMIddleware.js";
import checkRole from "../middleware/checkRole.js";
import validateSchema from "../middleware/validationMiddleware.js";
import {
  CreateTaskSchema,
  QueryTaskSchema,
  UpdateTaskSchema,
} from "../schema/TaskSchema.js";

const router = Router();

router.use(morgan("combined"));

router.get("/:id", asyncHandler(getTaskById));

router.get(
  "/",
  validateSchema(QueryTaskSchema),
  asyncHandler(cacheMiddleware),
  asyncHandler(getAllTasks),
);

router.post(
  "/",
  checkRole,
  validateSchema(CreateTaskSchema),
  asyncHandler(createTask),
);

router.put(
  "/:id",
  asyncHandler(checkRole),
  validateSchema(UpdateTaskSchema),
  asyncHandler(updateTask),
);

router.delete("/:id", asyncHandler(checkRole), asyncHandler(deleteTask));

export default router;

console.log("task routes registered");
