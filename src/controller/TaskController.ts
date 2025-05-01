import { Request, Response } from "express";

import TaskModel from "../model/TaskModel.js";
import UserModel from "../model/UserModel.js";
import { CreateTaskType, UpdateTaskType } from "../types/taskType.js";
import { UserType } from "../types/userType.js";

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  let task = null;
  try {
    task = await TaskModel.findOne({ _id: id });
  } catch (error) {
    console.log(error);
  }
  if (!task) {
    res.status(404).json({ message: "task not found for the id" }).send();
  } else {
    await task.populate("assignedTo");
    res.status(200).json(task).send();
  }
  return;
};

export const getAllTasks = async (req: Request, res: Response) => {
  const { dueDateGT, dueDateLT, status } = req.query;
  let { assignedTo } = req.query;
  assignedTo = assignedTo?.toString()?.toLowerCase();
  const user: typeof UserModel = (await UserModel.findOne({
    email: assignedTo,
  }))!;
  if (!user && assignedTo) {
    res.status(404).json({ message: "user not found" }).send();
    return;
  }
  const query = TaskModel.find();
  if (status) {
    query.where({ status });
  }
  if (dueDateGT && dueDateLT) {
    query.where({ dueDate: { $gte: dueDateGT, $lte: dueDateLT } });
  } else {
    if (dueDateGT) {
      query.where({ dueDate: { $gte: dueDateGT } });
    }
    if (dueDateLT) {
      query.where({ dueDate: { $lte: dueDateLT } });
    }
  }
  let tasks = await query.populate("assignedTo").exec();
  if (assignedTo) {
    tasks = tasks.filter((item) => {
      const assignedUser: UserType = item?.assignedTo as unknown as UserType;
      return assignedUser?.email == assignedTo;
    });
  }
  res.status(200).json({ count: tasks.length, tasks }).send();
  return;
};

export const createTask = async (req: Request, res: Response) => {
  const body: CreateTaskType = req.body as CreateTaskType;
  const user: typeof UserModel = (await UserModel.findOne({
    email: body.assignedTo,
  }))!;
  if (body.assignedTo && !user) {
    res
      .status(404)
      .json({
        message: "user not found for the assignedTo field",
      })
      .send();
    return;
  }
  if (body.status && body.assignedTo) {
    if (body.status === "UNASSIGNED") {
      res
        .status(400)
        .json({
          message: "assignedTo cannot be set if status is set to UNASSIGNED",
        })
        .send();
      return;
    } else {
      body.assignedTo = user;
      const createdTask = await TaskModel.create(body);
      res.status(201).json({ data: createdTask, message: "success" }).send();
      return;
    }
  } else if (body.status) {
    if (body.status === "PENDING" || body.status === "COMPLETED") {
      res
        .status(400)
        .json({
          message: `status cannot be set to ${body.status} if assignedTo is not set`,
        })
        .send();
      return;
    } else {
      const createdTask = await TaskModel.create(body);
      res.status(201).json({ data: createdTask, message: "success" }).send();
      return;
    }
  } else if (body.assignedTo) {
    body.assignedTo = user;
    body.status = "PENDING";
    const createdTask = await TaskModel.create(body);
    res.status(201).json({ data: createdTask, message: "success" }).send();
    return;
  }
  const task = await TaskModel.create(body);
  res.status(201).json({ data: task, message: "succes" }).send();
  return;
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: UpdateTaskType = req.body;
  let task: {
    assignedTo: typeof UserModel;
    description: string;
    save: Function;
    status: string;
  } = {} as {
    assignedTo: typeof UserModel;
    description: string;
    save: Function;
    status: string;
  };
  try {
    task = (await TaskModel.findOne({ _id: id }))!;
  } catch (error) {
    console.log(error);
  }
  if (!task) {
    res.status(404).json({ message: "task not found for the id" }).send();
    return;
  }
  const user: typeof UserModel = (await UserModel.findOne({
    email: body.assignedTo,
  }))!;
  if (body.assignedTo && !user) {
    res
      .status(404)
      .json({
        message: "user not found for the assignedTo field",
      })
      .send();
    return;
  }

  if (body.status && body.assignedTo) {
    if (body.status === "UNASSIGNED") {
      res
        .status(400)
        .json({
          message: "assignedTo cannot be set if status is set to UNASSIGNED",
        })
        .send();
      return;
    } else {
      task.status = body.status;
      task.assignedTo = user;
      await task.save();
    }
  } else if (body.status) {
    if (body.status === "PENDING" || body.status === "COMPLETED") {
      res
        .status(400)
        .json({
          message: `status cannot be set to ${body.status} if assignedTo is not set`,
        })
        .send();
      return;
    } else {
      task.status = body.status;
      await task.save();
    }
  } else if (body.assignedTo) {
    task.assignedTo = user;
    task.status = "PENDING";
    await task.save();
  }
  if (body.description) {
    task.description = body.description;
    task = await task.save();
  }
  res.status(202).json({ data: task, message: "success" }).send();
  return;
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  let task = null;
  try {
    task = await TaskModel.findOne({ _id: id });
  } catch (error) {
    console.log(error);
  }
  if (!task) {
    res.status(404).json({ message: "task not found for the id" }).send();
    return;
  } else {
    await TaskModel.deleteOne({ _id: id });
    res.status(200).json({ message: "success" }).send();
    return;
  }
};
