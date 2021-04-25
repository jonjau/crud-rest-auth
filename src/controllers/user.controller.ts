import { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";

import * as userService from "../services/user.service";
import Role from "../models/role";
import { UserDoc } from "../models/user.model";
import RefreshToken from "../models/refresh-token.model";

/**
 * Middleware function does something to a Request and Response and passes
 * them on to the next handler
 */
type MiddlewareFn<ReqT = Request> = (
  req: ReqT,
  res: Response,
  next: NextFunction
) => void;

/**
 * 
 */
const validateRequest = (
  req: Request,
  next: NextFunction,
  schema: Joi.ObjectSchema
) => {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    next(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
  } else {
    req.body = value;
    next();
  }
};

/**
 * Validates whether the request to validate follows the approriate schema.
 */
const checkAuthenticationSchema = function (
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
};

/**
 * Check if the username/password pair corresponds to a registered User/Admin
 * and sets their refresh token accordingly, then returns the registered User
 * details if successful. Those details include the bearer token to
 * authenticate further requests.
 */
const authenticate = <MiddlewareFn>function (req, res, next) {
  const { username, password } = req.body;
  const ipAddress = req.ip;
  userService
    .authenticate({ username, password, ipAddress })
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      res.json(user);
    })
    .catch(next);
};

/**
 * Refresh the refresh token that was passed as a cookie
 */
const refreshToken = <MiddlewareFn>function (req, res, next) {
  const token = req.cookies.refreshToken;
  const ipAddress = req.ip;
  userService
    .refreshToken({ token, ipAddress })
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      res.json(user);
    })
    .catch(next);
};

/**
 * Check that the request to revoke a token follows the schema
 */
const checkRevokeTokenSchema = <MiddlewareFn>function (req, _res, next) {
  const schema = Joi.object({
    token: Joi.string().empty(""),
  });
  validateRequest(req, next, schema);
};

/**
 * Check if the given user owns the given token
 */
const ownsToken = async (user: UserDoc, token: any) => {
  const ownTokens = await RefreshToken.find({
    UserId: user.id,
  });
  return !!ownTokens.find((tokn: any) => tokn.token === token);
};

/**
 * Revoke a person's token, the token revoked must belong to the user
 * requesting this revoke, but if they are an Admin, they can revoke anyone's
 * token.
 */
const revokeToken = <MiddlewareFn>async function (req, res, next) {
  // accept token from request body or cookie
  const token = req.body.token || req.cookies.refreshToken;
  const ipAddress = req.ip;

  if (!token) {
    res.status(400).json({ message: "Token is required" });
  }

  // users can revoke their own tokens and admins can revoke any tokens
  if (
    !req.user ||
    (!ownsToken(req.user, token) && req.user.role !== Role.Admin)
  ) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    userService
      .revokeToken({ token, ipAddress })
      .then(() => res.json({ message: "Token revoked" }))
      .catch(next);
  }
};

/**
 * Get all the users' details, must be Admin doing this
 */
const getAll = <MiddlewareFn>function (_req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
};

/**
 * Get a user's details, the Admin or User in question can do this
 */
const getById = <MiddlewareFn>function (req, res, next) {
  // regular users can get their own record and admins can get any record
  if (
    !req.user ||
    (req.params.id !== req.user.id && req.user.role !== Role.Admin)
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch(next);
};

/**
 * Get the refresh tokens of a user. Users can get their own refresh tokens and
 * admins can get any user's refresh tokens
 */
const getRefreshTokens = <MiddlewareFn>function (req, res, next) {
  if (
    !req.user ||
    (req.params.id !== req.user.id && req.user.role !== Role.Admin)
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return userService
    .getRefreshTokens(req.params.id)
    .then((tokens) => (tokens ? res.json(tokens) : res.sendStatus(404)))
    .catch(next);
};

/**
 * Set the token as a cookie in the given Reponse
 */
const setTokenCookie = (res: Response, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  res.cookie("refreshToken", token, cookieOptions);
};

export {
  checkAuthenticationSchema,
  authenticate,
  refreshToken,
  checkRevokeTokenSchema,
  revokeToken,
  getAll,
  getById,
  getRefreshTokens
};
