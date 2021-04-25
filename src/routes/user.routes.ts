import express from "express";
import {
  checkAuthenticationSchema,
  authenticate,
  refreshToken,
  checkRevokeTokenSchema,
  revokeToken,
  getAll,
  getById,
  getRefreshTokens
} from "../controllers/user.controller";
import { authJwt, authorize } from "../middleware/authorize";
import Role from "../models/role";

const router = express.Router();

// anyone can authenticate or refresh their token (assuming they have it)
router.post("/authenticate", checkAuthenticationSchema, authenticate);
router.post("/refresh-token", refreshToken);

// Users can revoke their own tokens, but Admins can revoke any token
router.post(
  "/revoke-token",
  authJwt,
  authorize(),
  checkRevokeTokenSchema,
  revokeToken
);

// Only Admins can get all the users and their details
router.get("/user/", authJwt, authorize([Role.Admin]), getAll);

// Users can check their own details, Admins can check any users details
router.get("/user/:id", authJwt, authorize(), getById);

// Users can check their refresh token, Admins can check any refresh token
router.get("/user/:id/refresh-tokens", authJwt, authorize(), getRefreshTokens);

export default router;
