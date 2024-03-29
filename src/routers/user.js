import express from "express";
import { User } from "../models/user.js";
import { auth } from "../middleware/auth.js";
import multer from "multer";
import sharp from "sharp";
import { sendWelcomeMail, sendDeleteMail } from "../emails/account.js";

export const userRouter = express.Router();

userRouter.get("/users/me", auth, async (req, res) => {
  try {
    // const my_profile = await User.findById(req.user._id);
    if (!req.user) return res.status(404).send();
    res.send(req.user);
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
    res.status(400).send(e);
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
    sendWelcomeMail(usr.email, usr.name);
    const token = await user.generateAuthToken();
    console.log(usr);

    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//Patch requests
userRouter.patch("/users/me", auth, async (req, res) => {
  try {
    const allowedUpdates = ["name", "email", "password", "age"];
    const updates = Object.keys(req.body);
    const status = updates.every((update) => allowedUpdates.includes(update));

    if (!status) return res.status(400).send({ Error: "Invalid Operation" });

    // const usr = await User.findById(req.params.id);
    updates.forEach((updateStr) => (req.user[updateStr] = req.body[updateStr]));

    await req.user.save();

    return res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Delete requests
userRouter.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendDeleteMail(req.user.email, req.user.name);
    return res.send(req.user);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//File uploads

const upload = multer({
  // dest: "avatar",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    // console.log(file.originalname);

    if (!file.originalname.match(/\.(png|jpg|jpeg)$/))
      return cb(new Error("Please upload a valid image (png,jpg,jpeg)"));

    return cb(undefined, true);
  },
});

userRouter.post(
  "/uploads/me/avatar",
  auth,
  upload.single("myImg"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

userRouter.get("/uploads/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar);
    {
      new Error("");
    }

    res.header("Content-Type", "image/png");

    res.send(user.avatar);
  } catch (e) {
    res.status(400).send();
  }
});

userRouter.delete(
  "/uploads/me/avatar",
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();

    res.send();
  },
  (err, req, res, next) => {
    res.status(500).send({ serverError: err.message });
  }
);
