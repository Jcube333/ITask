import mongoose from "mongoose";
import validator from "validator";

export const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Provide a valid Email");
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length < 6) {
        console.log(value.length);
        throw new Error("Password too short");
      }
      if (value.toLowerCase().includes("password"))
        throw new Error("Password too weak");
    },
  },
  age: {
    type: Number,
    default: 0,
  },
});
