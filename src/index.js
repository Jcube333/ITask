import express from "express";
import "./db/mongoose.js";
import { User } from "./models/user.js";
import { Task } from "./models/task.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

//Testing Code

// Get requests for users
app.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) return res.status(404).send();

      res.send(users);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) return res.status(404).send();

      res.send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//Get requests for tasks

app.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => {
      if (!tasks) return res.status(404).send();

      res.send(tasks);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/tasks/:id", (req, res) => {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) return res.status(400).send();

      res.send(task);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//Post request for users

app.post("/users", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then((usr) => {
      // Server sending response back after db entry success.
      res.send(usr);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//Post requests for tasks

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then((tsk) => {
      res.send(tsk);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.listen(port, () => {
  console.log("App running on port " + port);
});
