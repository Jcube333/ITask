import express from "express";
import { User } from "../models/user.js";
import { auth } from "../middleware/auth.js";

export const userRouter = express.Router();

userRouter.get("/users/me", auth, async (req, res) => {
  try {
    const my_profile = await User.find({ __id: req.user.__id });
    if (!my_profile) return res.status(404).send();
    res.send(my_profile);
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
    const token = await usr.generateAuthToken();
    res.status(200).send({ usr, token });
  } catch (e) {
    res.status(400).send();
  }
});

//Logging out a user
userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) =>
      //Each token object has id and token property
      {
        return token.token != req.token;
      }
    );

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//Logging out on all devices
userRouter.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(500).send("Logout Unsuccessful");
  }
});

//Post request for users/ Signup
userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const usr = await user.save();
    const token = await user.generateAuthToken();
    console.log(usr);

    res.status(201).send({ user, token });
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
