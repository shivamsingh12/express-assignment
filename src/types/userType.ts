import mongoose, { Types } from "mongoose";

import UserModel from "../model/UserModel.js";

export interface AssignRoleBodyType {
  email: string;
  role: string;
}

export interface LogInBodyType {
  email: string;
  password: string;
}

export interface SignUpBodyType {
  email: string;
  name: string;
  password: string;
}

export interface UserType {
  _id: typeof UserModel;
  email: string;
  name: string;
  role: string;
}
