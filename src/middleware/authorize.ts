import jwt from "express-jwt";
import { secret } from "../../config.json";
import { RefreshToken, User } from "../models";
import Role from "../models/role";
import { Request, Response, NextFunction } from "express";

/**
 * JWT middleware so subsequent functions in the chain of handlers will know
 * the JWT token
 */
const authJwt = jwt({ secret, algorithms: ["HS256"] });

/**
 * Given the roles to check authorization for, this function returns 401 if
 * the requester does not have the role, else it lets it pass on
 */
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
