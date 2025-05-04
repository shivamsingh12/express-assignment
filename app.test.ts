import { expect } from "chai";
import { config } from "dotenv";
import request from "supertest";

import app from "./src/index.js";

config({ path: "/.env.local" });

let authToken: string;
let taskID: string;

describe("Login fetch /tasks and Logout", () => {
  it("should login the default ADMIN user", async function () {
    const res = await request(app).post("/login").send({
      email: "shivam@gmail.com",
      password: "12345678",
    });
    authToken = res.body.token;
    expect(res.status).to.equal(200);
    expect(Object.keys(res.body)).to.include("token");
  });
  it("Should return list of tasks /tasks", async function () {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `${authToken}`);
    expect(res.status).to.equal(200);
    expect(Object.keys(res.body)).to.include("count");
  });
  it("Should add new task /tasks", async function () {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `${authToken}`)
      .send({
        description: "task 1 lorem ipsum",
        dueDate: "2024-01-02",
        title: "task 1",
      });
    taskID = res.body.data._id;
    expect(res.status).to.equal(201);
    expect(Object.keys(res.body)).to.include("message");
  });
  it("should delete an added task /tasks", async function () {
    const res = await request(app)
      .delete(`/tasks/${taskID}`)
      .set("Authorization", `${authToken}`);
    expect(res.status).to.equal(200);
    expect(Object.keys(res.body)).to.include("message");
  });
  it("should logout the user ", async function () {
    const res = await request(app)
      .delete(`/logout`)
      .set("Authorization", `${authToken}`);
    expect(res.status).to.equal(204);
  });
  it("Should throw 401 /tasks", async function () {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `${authToken}`)
      .send({
        description: "task 1 lorem ipsum",
        dueDate: "2024-01-02",
        title: "task 1",
      });
    expect(res.status).to.equal(401);
  });
  it("should register the low privilege user", async function () {
    const res = await request(app).post("/signup").send({
      email: "shivamlesser@gmail.com",
      name: "shivam lesser",
      password: "12345678",
    });
    expect(res.status).to.be.oneOf([201, 400]);
    expect(res.body.message).to.be.oneOf([
      "user already exits with this email",
      "sign up success",
    ]);
  });
  it("should login the low privilege user", async function () {
    const res = await request(app).post("/login").send({
      email: "shivamlesser@gmail.com",
      password: "12345678",
    });
    authToken = res.body.token;
    expect(res.status).to.equal(200);
    expect(Object.keys(res.body)).to.include("token");
  });
  it("Should add new task /tasks", async function () {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `${authToken}`)
      .send({
        description: "task 1 lorem ipsum",
        dueDate: "2024-01-02",
        title: "task 1",
      });
    taskID = res.body.data._id;
    console.log(
      taskID + " ====================================================",
    );
    expect(res.status).to.equal(201);
    expect(Object.keys(res.body)).to.include("message");
  });
  it("should fail to delete task /tasks", async function () {
    const res = await request(app)
      .delete(`/tasks/${taskID}`)
      .set("Authorization", `${authToken}`);
    expect(res.status).to.equal(403);
  });
  it("should assign a task to a user /tasks", async function () {
    const res = await request(app)
      .put(`/tasks/${taskID}`)
      .set("Authorization", `${authToken}`)
      .send({ assignedTo: "shivamlesser@gmail.com" });
    console.log(res.error);
    expect(res.status).to.equal(202);
  });
});
