import express, { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";

import * as userService from "../services/user.service";

const router = express.Router();

type MiddlewareFn = (req: Request, res: Response, next: NextFunction) => void;

const validateRequest = (req: Request, next: NextFunction, schema: Joi.ObjectSchema) => {
  const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
      next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  } else {
      req.body = value;
      next();
  }
}

const checkAuthenticationSchema = <MiddlewareFn>function (req, _res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
};

const authenticate = <MiddlewareFn>function (req, res, next) {
  const { username, password } = req.body;
  const ipAddress = req.ip;
  userService
    .authenticate({ username, password, ipAddress })
    .then(({ refreshToken, ...user }) => {
      console.log("asdk");
      setTokenCookie(res, refreshToken);
      res.json(user);
    })
    .catch(next);
};

const setTokenCookie = (res: Response, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  res.cookie("refreshToken", token, cookieOptions);
};


router.post("/authenticate", checkAuthenticationSchema, authenticate);
router.get('/', function (_req, res) {
  res.send('GET request to the homepage')
})

export default router;