import mongoose from "mongoose";
import { User } from "./user.js";

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model("Task", taskSchema);

//Async Await

// const deleteAsync = async (id) => {
//   const deleted = await Task.findByIdAndRemove(id);
//   const count = await Task.countDocuments();

//   return { deleted, count };
// };

// deleteAsync("63e89c866edc8e1c3c333ab5")
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

//Promise Chaining

// Task.findByIdAndRemove("63e89caf6edc8e1c3c333ab8")
//   .then((res) => {
//     console.log(res);
//     return Task.find({ completed: false });
//   })
//   .then((tasks) => {
//     console.log(tasks);
//   })
//   .catch((e) => {
//     console.log(e);
//   });
