import express from "express";
import { Task } from "../models/task.js";
export const taskRouter = express.Router();

//Get requests for tasks

taskRouter.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    if (!tasks) return res.status(404).send();
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

taskRouter.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

taskRouter.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    const tsk = await task.save();
    res.status(201).send(tsk);
  } catch (e) {
    res.status(400).send(e);
  }
});

taskRouter.patch("/tasks/:id", async (req, res) => {
  const allowedUpdates = ["description", "completed"];

  const updates = Object.keys(req.body);
  const status = updates.every((update) => allowedUpdates.includes(update));

  if (!status) return res.status(400).send({ Error: "Invalid operation" });
  try {
    const tsk = await Task.findById(req.params.id);
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

taskRouter.delete("/tasks/:id", async (req, res) => {
  try {
    const tsk = await Task.findByIdAndDelete(req.params.id);
    if (!tsk) return res.status(404).send();
    return res.send(tsk);
  } catch (e) {
    return res.status(500).send(e);
  }
});
