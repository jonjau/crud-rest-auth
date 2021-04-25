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

// get MONGO info from environment variables
const { MONGO_DB_HOST, MONGO_DB_PORT, MONGO_DB_NAME } = process.env;

let MONGO_DB_URL = config.connectionString;
if (typeof MONGO_DB_HOST !== "undefined") {
  MONGO_DB_URL = `mongodb://${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}?ssl=false`;
}

// actually connect to the database
mongoose.connect(MONGO_DB_URL, connectionOptions);
mongoose.Promise = global.Promise;
mongoose.connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// helper function to check if a Mongo-generated ID is valid
const isValidId = (id: string | number | mongoose.Types.ObjectId) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export { User, RefreshToken, isValidId };
