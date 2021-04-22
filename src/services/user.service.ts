import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

interface AuthReqBody {
  username: string;
  password: string;
  ipAddress: string;
}

const authenticate = async ({ username, password, ipAddress }: AuthReqBody) => {
};
