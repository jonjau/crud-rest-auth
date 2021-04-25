import config from "../../config.json";
import mongoose from "mongoose";
import User from "./user.model";
import RefreshToken from "./refresh-token.model";
import e from "express";

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const { MONGO_DB_HOST, MONGO_DB_PORT, MONGO_DB_NAME } = process.env;

let MONGO_DB_URL = config.connectionString;
if (typeof MONGO_DB_HOST !== "undefined") {
  MONGO_DB_URL = `mongodb://${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}?ssl=false`;
}
console.log(MONGO_DB_URL);

mongoose.connect(MONGO_DB_URL, connectionOptions);
mongoose.Promise = global.Promise;
mongoose.connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const isValidId = (id: string | number | mongoose.Types.ObjectId) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export { User, RefreshToken, isValidId };
