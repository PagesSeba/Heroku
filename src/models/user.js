import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  avatar: { type: String, required: true },
  age: { type: Number, required: true },
  id_cart: { type: String, required: true },
});

// const userModel = mongoose.model("user", userSchema);

export default userSchema;
