import bcrypt from "bcrypt";
import { model, Schema, SchemaTypes } from "mongoose";

const SALT_ROUNDS = 8;

const UserSchema = new Schema({
  email: { required: true, type: SchemaTypes.String, unique: true },
  name: { required: true, type: SchemaTypes.String },
  password: { required: true, select: false, type: SchemaTypes.String },
  role: { default: "USER", type: SchemaTypes.String },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
  next();
});
const UserModel = model("User", UserSchema);

export default UserModel;
