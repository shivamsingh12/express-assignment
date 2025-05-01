import mongoose, { Mongoose } from "mongoose";

import UserModel from "../model/UserModel.js";

export interface CreateTaskType {
  assignedTo: typeof UserModel;
  description: string;
  dueDate: string;
  status: null | string; // UNASSIGNED, PENDING, COMPLETED
  title: string;
}

export interface UpdateTaskType {
  assignedTo: typeof UserModel;
  description: string;
  status: string;
}
