import express from "express";
import "./db/mongoose.js";
import { User } from "./models/user.js";
import { Task } from "./models/task.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

//Testing Code

// Get requests for users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) return res.status(404).send();
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }

  //   User.find({})
  //     .then((users) => {
  //       if (!users) return res.status(404).send();

  //       res.send(users);
  //     })
  //     .catch((err) => {
  //       res.status(500).send(err);
  //     });
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Get requests for tasks

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    if (!tasks) return res.status(404).send();
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Post request for users

app.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const usr = await user.save();
    res.status(201).send(usr);
  } catch (e) {
    res.status(400).send(e);
  }
  //   user
  //     .save()
  //     .then((usr) => {
  //       // Server sending response back after db entry success.
  //       res.send(usr);
  //     })
  //     .catch((err) => {
  //       res.status(400).send(err);
  //     });
});

//Post requests for tasks

app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    const tsk = await task.save();
    res.status(201).send(tsk);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log("App running on port " + port);
});
