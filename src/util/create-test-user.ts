import bcrypt from "bcrypt";
import { User } from "../models";
import Role from "../models/role";

const createTestUsers = async () => {
  // create test user if the db is empty
  if ((await User.countDocuments({})) === 0) {
    const admin = new User({
      username: "admin",
      passwordHash: bcrypt.hashSync("admin", 10),
      role: Role.Admin,
    });
    await admin.save();

    const user = new User({
      username: "user",
      passwordHash: bcrypt.hashSync("user", 10),
      role: Role.User,
    });
    await user.save();
  }
};

export default createTestUsers;
