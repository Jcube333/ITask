import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({
      __id: decoded.__id,
      "tokens.token": token,
    });

    if (!user) throw new Error();

    //Why? Subsequent routes after this middleware don't have to explicitely fetch users.
    req.user = user;

    //Specifically useful for logging out from a specific device which was used to login.
    req.token = token;

    next();
  } catch (e) {
    res.send({ Error: "Not authenticated" });
  }
};
