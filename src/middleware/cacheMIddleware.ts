import { NextFunction, Request, Response } from "express";

import redisClient from "../utils/getRedisClient.js";

export const KEY = `/tasks`;

const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { dueDateGT, dueDateLT, status } = req.query;
  let { assignedTo } = req.query;
  if (assignedTo) {
    assignedTo = assignedTo?.toString()?.toLowerCase();
  }
  let tasks;
  try {
    tasks = await redisClient?.get(KEY);
    if (tasks) {
      tasks = tasksFilter(
        dueDateLT as string,
        dueDateGT as string,
        status as string,
        assignedTo!,
        JSON.parse(tasks),
      );
      res
        .status(200)
        .json({ count: tasks.length, message: "cache hit", tasks })
        .send();
      return;
    } else {
      next();
    }
  } catch (error) {
    next();
  }
};

export default cacheMiddleware;

interface AssignedToType {
  email: string;
}

interface TasksType {
  assignedTo: AssignedToType;
  dueDate: string;
  status: string;
}

function tasksFilter(
  dueDateLT: string,
  dueDateGT: string,
  status: string,
  assignedTo: string,
  tasks: TasksType[],
) {
  let dueDateGTMillis: number;
  let dueDateLTMillis: number;
  if (status) {
    tasks = tasks.filter((task) => task.status === status);
  }
  if (assignedTo) {
    tasks = tasks.filter((task) => task?.assignedTo.email === assignedTo);
  }
  if (dueDateLT) {
    dueDateLTMillis = new Date(dueDateLT).getTime();
    tasks = tasks.filter(
      (task) => new Date(task.dueDate).getTime() <= dueDateLTMillis,
    );
  }
  if (dueDateGT) {
    dueDateGTMillis = new Date(dueDateGT).getTime();
    tasks = tasks.filter(
      (task) => new Date(task.dueDate).getTime() >= dueDateGTMillis,
    );
  }
  return tasks;
}

console.log("redis middleware registered");
