import { Router } from "express";
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

router.get("/:id", getTaskById);

router.get("/", validateSchema(QueryTaskSchema), cacheMiddleware, getAllTasks);

router.post("/", checkRole, validateSchema(CreateTaskSchema), createTask);

router.put("/:id", checkRole, validateSchema(UpdateTaskSchema), updateTask);

router.delete("/:id", checkRole, deleteTask);

export default router;

console.log("task routes registered");
