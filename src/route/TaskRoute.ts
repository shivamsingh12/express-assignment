import { Request, Response } from "express";
import { Router } from "express";

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controller/TaskController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkRole from "../middleware/checkRole.js";
import validateSchema from "../middleware/validationMiddleware.js";
import {
  CreateTaskSchema,
  QueryTaskSchema,
  UpdateTaskSchema,
} from "../schema/TaskSchema.js";

const router = Router();

router.get("/:id", getTaskById);

router.get("/", validateSchema(QueryTaskSchema), getAllTasks);

router.post(
  "/",
  authMiddleware,
  checkRole,
  validateSchema(CreateTaskSchema),
  createTask,
);

router.put(
  "/:id",
  authMiddleware,
  checkRole,
  validateSchema(UpdateTaskSchema),
  updateTask,
);

router.delete("/:id", authMiddleware, checkRole, deleteTask);

export default router;
