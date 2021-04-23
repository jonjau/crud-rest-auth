import bcrypt from "bcrypt";
import { User } from "../models";
import Role from "../models/role";

const createTestUser = async () => {
  // create test user if the db is empty
  if ((await User.countDocuments({})) === 0) {
    const user = new User({
      firstName: "Test",
      lastName: "User",
      username: "test",
      passwordHash: bcrypt.hashSync("test", 10),
      role: Role.Admin,
    });
    await user.save();
  }
};

export default createTestUser;
