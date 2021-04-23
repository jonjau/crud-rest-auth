import jwt from "express-jwt";
import { secret } from "../../config.json";
import { RefreshToken, User } from "../models";
import Role from "../models/role";
import { Request, Response, NextFunction } from "express";

// function authorize(roles: Role[] = []) {
//   // roles param can be a single role string (e.g. Role.User or 'User')
//   // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
//   if (typeof roles === "string") {
//     roles = [roles];
//   }

//   return [
//     // authenticate JWT token and attach user to request object (req.user)
//     jwt({ secret, algorithms: ["HS256"] }),

//     // authorize based on user role
//     async (req: UserRequest, res: Response, next: NextFunction) => {
//       const user = await User.findById(req.user.id);

//       if (!user || (roles.length && !roles.includes(user.role))) {
//         // user no longer exists or role not authorized
//         res.status(401).json({ message: "Unauthorized" });
//       } else {
//         req.user.role = user.role;
//         const refreshTokens = await RefreshToken.find({ user: user.id });
//         req.user.ownsToken = (token: any) =>
//           !!refreshTokens.find((x: any) => x.token === token);
//         next();
//         // authentication and authorization successful
//       }
//     },
//   ];
// }

const authJwt = jwt({ secret, algorithms: ["HS256"] });
const authorize = (roles: Role[] = []) => {
  const auth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(req.user.id);
    if (!user || (roles.length && !roles.includes(user.role))) {
      // user no longer exists or role not authorized
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user.role = user.role;
    const refreshTokens = await RefreshToken.find({ user: user.id });
    req.user.ownsToken = (token: any) =>
      !!refreshTokens.find((x: any) => x.token === token);
    return next();
    // authentication and authorization successful
  };
  return auth;
};

export { authJwt, authorize };