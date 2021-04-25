import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes";
import todoRouter from "./routes/todo.routes";
import errorHandler from "./middleware/error-handler";
import createTestUsers from "./util/create-test-user";

const app = express();

// create two test users if there are no users:
// 1. 'admin' with password 'admin', with role Admin
// 2. 'user' with password 'user', with role User
createTestUsers();

// set up urlencoded, cookie, json parsing, cors with credentials
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (_origin, callback) => callback(null, true),
    credentials: true,
  })
);

// routers
app.use(userRouter);
app.use("/todos", todoRouter);

// global error handler
app.use(errorHandler);

// start app
const PORT = 2525;
app.listen(PORT, () => {
  console.log(`RUNNING ON PORT: ${PORT}`);
});
