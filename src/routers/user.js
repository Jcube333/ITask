import express from "express";
import { User } from "../models/user.js";

export const userRouter = express.Router();

userRouter.get("/users", async (req, res) => {
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

userRouter.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Logging in a user
userRouter.post("/users/login", async (req, res) => {
  try {
    const usr = await User.findByCredentials(req.body.email, req.body.password);
    res.send(usr);
  } catch (e) {
    res.status(400).send();
  }
});

//Post request for users
userRouter.post("/users", async (req, res) => {
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

//Patch requests
userRouter.patch("/users/:id", async (req, res) => {
  try {
    const allowedUpdates = ["name", "email", "password", "age"];
    const updates = Object.keys(req.body);
    const status = updates.every((update) => allowedUpdates.includes(update));

    if (!status) return res.status(400).send({ Error: "Invalid Operation" });

    const usr = await User.findById(req.params.id);
    updates.forEach((updateStr) => (usr[updateStr] = req.body[updateStr]));

    await usr.save();
    // const usr = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!usr) return res.status(404).send();

    return res.send(usr);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Delete requests
userRouter.delete("/users/:id", async (req, res) => {
  try {
    const usr = await User.findByIdAndDelete(req.params.id);
    if (!usr) return res.status(404).send();
    return res.send(usr);
  } catch (e) {
    return res.status(500).send(e);
  }
});
