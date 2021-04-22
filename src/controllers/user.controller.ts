import express, { NextFunction } from "express";

const router = express.Router();

router.post("/authenticate");

type MiddlewareFn = (req: Request>, res: Response, next: NextFunction) => void;

const checkAuthenticationSchema = <MiddlewareFn>function (req, res, next) {

};

const authenticate = <MiddlewareFn>function (req, res, next) {
  const {username, password} = req.body;
  const ip = req.ip;

};