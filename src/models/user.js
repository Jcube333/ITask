import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  const usr = this;
  const token = jwt.sign({ _id: usr._id.toString() }, "thisisjcube333");

  usr.tokens = usr.tokens.concat({ token });
  await usr.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const usr = await User.findOne({ email });
  if (!usr) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, usr.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return usr;
};

//Hasing password before saving using Middleware
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

export const User = mongoose.model("User", userSchema);
