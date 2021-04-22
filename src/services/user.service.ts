import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose from "mongoose";

import config from "../../config.json";
import { User, RefreshToken, isValidId } from "../models";
import { UserDoc } from "src/models/user.model";

interface AuthReqBody {
  username: string;
  password: string;
  ipAddress: string;
}

const authenticate = async ({ username, password, ipAddress }: AuthReqBody) => {
  const user = await User.findOne({ username });

  // check if username exists, and if so, that the password matches
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw "Incorrect username or password";
  }

  // generate tokens, store the refreshToken in DB
  const jwtToken = await generateJwtToken(user);
  const refreshToken = await generateRefreshToken(user, ipAddress);
  await refreshToken.save();

  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: refreshToken.token,
  };
};

interface TokenReqBody {
  token: string;
  ipAddress: string;
}

const refreshToken = async ({ token, ipAddress }: TokenReqBody) => {
  const refreshToken = await getRefreshToken(token);
  const user = refreshToken.user as UserDoc;

  // replace old refresh token with a new one and save
  const newRefreshToken = await generateRefreshToken(user, ipAddress);
  refreshToken.revoked = new Date();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(user);

  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
};

const revokeToken = async ({ token, ipAddress }: TokenReqBody) => {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = new Date();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
};

const getAll = async () => {
  const users = await User.find();
  return users.map((x) => basicDetails(x));
};

type Id = string | number | mongoose.Types.ObjectId;

const getById = async (id: Id) => {
  const user = await getUser(id);
  return basicDetails(user);
};

const getRefreshTokens = async (userId: any) => {
  // check that user exists
  await getUser(userId);

  // return refresh tokens for user
  const refreshTokens = await RefreshToken.find({ user: userId });
  return refreshTokens;
};

const getUser = async (id: Id) => {
  if (!isValidId(id)) throw "User not found";
  const user = await User.findById(id);
  if (!user) throw "User not found";
  return user;
};

const getRefreshToken = async (token: string) => {
  const refreshToken = await RefreshToken.findOne({ token }).populate("user");
  if (!refreshToken || !refreshToken.isActive) throw "Invalid token";
  return refreshToken;
};

const generateJwtToken = async (user: UserDoc) => {
  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign({ sub: user.id, id: user.id }, config.secret, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = async (user: UserDoc, ipAddress: string) => {
  // create a refresh token that expires in 7 days
  return new RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress,
  });
};

const randomTokenString = () => {
  return crypto.randomBytes(40).toString("hex");
};

const basicDetails = (user: UserDoc) => {
  const { id, username, role } = user;
  return { id, username, role };
};

export {
  authenticate,
  refreshToken,
  revokeToken,
  getAll,
  getById,
  getRefreshTokens,
};
