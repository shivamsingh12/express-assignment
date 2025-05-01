import { model, Schema, SchemaTypes } from "mongoose";

const TaskSchema = new Schema({
  assignedTo: { ref: "User", type: SchemaTypes.ObjectId },
  description: { required: true, type: SchemaTypes.String },
  dueDate: { required: true, type: SchemaTypes.Date },
  status: { default: "UNASSIGNED", type: SchemaTypes.String },
  title: { required: true, type: SchemaTypes.String },
});

const TaskModel = model("Task", TaskSchema);

export default TaskModel;
