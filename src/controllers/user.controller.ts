import express, { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";

import * as userService from "../services/user.service";

const router = express.Router();

type MiddlewareFn = (req: Request, res: Response, next: NextFunction) => void;

const checkAuthenticationSchema = <MiddlewareFn>function (req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  // validateRequest(req, next, schema);
};

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

const setTokenCookie = (res: Response, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  res.cookie("refreshToken", token, cookieOptions);
};


router.post("/authenticate", authenticate);