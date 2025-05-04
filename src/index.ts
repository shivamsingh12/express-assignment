import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";

import authMiddleware from "./middleware/authMiddleware.js";
import errorMiddleWare from "./middleware/errorMiddleware.js";
import TaskRoutes from "./route/TaskRoute.js";
import UserRoutes from "./route/UserRoute.js";

const PORT = process.env.PORT ?? "3000";
const URI: string = process.env.MONGO_URI ?? "";
const app = express();

await mongoose.connect(URI);

console.log("connected to mongo ");

app.use(bodyParser.json());
app.use("/tasks", authMiddleware, TaskRoutes);
app.use("/", UserRoutes);
app.use(errorMiddleWare);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

export default app;
