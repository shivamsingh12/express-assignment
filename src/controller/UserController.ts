import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import UserModel from "../model/UserModel.js";
import {
  AssignRoleBodyType,
  LogInBodyType,
  SignUpBodyType,
  UserType,
} from "../types/userType.js";
import redisClient from "../utils/getRedisClient.js";
import validateJWT from "../utils/validateJWT.js";

export const signUp = async (req: Request, res: Response) => {
  const body: SignUpBodyType = req.body;
  try {
    await UserModel.create(body);
    res.status(201).json({ message: "sign up success" }).send();
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "user already exits with this email" })
      .send();
  }
};

export const logIn = async (req: Request, res: Response) => {
  const body: LogInBodyType = req.body;
  const user = await UserModel.findOne({ email: body.email }).select(
    "+password",
  );
  const isMatch = bcrypt.compareSync(body.password, user?.password ?? "");
  const SECRET: string = process.env.JWT_SECRET_KEY ?? "";
  if (!user || !isMatch) {
    res.status(401).json({ message: "incorrect credentials" }).send();
  } else {
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id.toString(),
        role: user.role,
      },
      SECRET,
      { expiresIn: "24h" },
    );
    res.status(200).json({ token }).send();
  }
};

export const assignRole = async (req: Request, res: Response) => {
  const body: AssignRoleBodyType = req.body;
  const user: null | UserType = await UserModel.findOne({ email: body.email });
  if (!user) {
    res.status(404).json({ message: `user not found for email` }).send();
    return;
  }
  await UserModel.updateOne({ email: body.email }, { role: body.role });
  res
    .status(200)
    .json({
      message: "success",
    })
    .send();
};
export const logOut = async (req: Request, res: Response) => {
  const token: string = (req.headers.authorization ??
    req.headers.Authorization) as string;
  const { exp, id } = validateJWT(token) as unknown as {
    exp: number;
    id: string;
  };
  const tokenTTL = new Date(exp * 1000).getTime() - new Date().getTime();
  const TTL_IN_SECONDS = Math.ceil(tokenTTL / 1000);
  console.log(TTL_IN_SECONDS / 3600);
  await redisClient?.set(token, "LOGGED_OUT", {
    expiration: {
      type: "EX",
      value: TTL_IN_SECONDS,
    },
  });
  res.status(204).send();
  return;
};
