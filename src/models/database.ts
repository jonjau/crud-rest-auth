import config from "../../config.json";
import mongoose from "mongoose";
import User from "./user.model";
import RefreshToken from "./refresh-token.model";

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose.connect(
  process.env.MONGODB_URI || config.connectionString,
  connectionOptions
);
mongoose.Promise = global.Promise;

const isValidId = (id: string | number | mongoose.Types.ObjectId) => {
  return mongoose.Types.ObjectId.isValid(id);
}

export {
  User,
  RefreshToken,
  isValidId
}
