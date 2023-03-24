import express from "express";
import "./db/mongoose.js";
import { userRouter } from "./routers/user.js";
import { taskRouter } from "./routers/task.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("App running on port " + port);
});
