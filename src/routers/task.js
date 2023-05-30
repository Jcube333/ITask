import express from "express";
import { Task } from "../models/task.js";
import { User } from "../models/user.js";
import { auth } from "../middleware/auth.js";

export const taskRouter = express.Router();

//Get requests for tasks
// GET/tasks?completed=true
// GET/tasks?limit=10&skip=5
// GET/tasks?sortBy = createdAt:desc or updatedAt:asc or any criteria in our JSON response
//Note: ':' is just added as a separator it has no special meaning

taskRouter.get("/tasks", auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed == "true";
  }

  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
      },
    });
    //Alternative:
    //Task.find({owner:req.user._id})
    if (!req.user.tasks)
      return res
        .status(404)
        .send({ Warning: "No tasks created for this user" });
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

taskRouter.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

taskRouter.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user.id,
  });

  try {
    const tsk = await task.save();
    res.status(201).send(tsk);
  } catch (e) {
    res.status(400).send(e);
  }
});

taskRouter.patch("/tasks/:id", auth, async (req, res) => {
  const allowedUpdates = ["description", "completed"];

  const updates = Object.keys(req.body);
  const status = updates.every((update) => allowedUpdates.includes(update));

  if (!status) return res.status(400).send({ Error: "Invalid operation" });
  try {
    const tsk = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!tsk) res.send(404);
    updates.forEach((updateStr) => (tsk[updateStr] = req.body[updateStr]));
    await tsk.save();
    // const tsk = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!tsk) return res.status(404).send();

    return res.send(tsk);
  } catch (e) {
    return res.status(400).send(e);
  }
});

taskRouter.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const tsk = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!tsk) return res.status(404).send();
    return res.send(tsk);
  } catch (e) {
    return res.status(500).send(e);
  }
});
