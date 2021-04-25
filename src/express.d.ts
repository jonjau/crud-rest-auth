import { UserDoc } from "./models/user.model";

// declaration merging, let Express know that Requests can contain UserDoc's
declare global {
  namespace Express {
    interface User extends UserDoc {}
  }
}
