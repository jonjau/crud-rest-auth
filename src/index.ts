import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes";
import todoRouter from "./routes/todo.routes";
import errorHandler from "./middleware/error-handler";
import createTestUsers from "./util/create-test-user";

const app = express();

createTestUsers();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: (_origin, callback) => callback(null, true), credentials: true }));

app.use(userRouter);
app.use("/todos",todoRouter);

app.use(errorHandler);

const PORT = 2525;
app.listen(PORT, () => {
  console.log(`RUNNING ON PORT: ${PORT}`);
});

