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

router.post("/authenticate", checkAuthenticationSchema, authenticate);
router.post("/refresh-token", refreshToken);
router.post(
  "/revoke-token",
  authJwt,
  authorize(),
  checkRevokeTokenSchema,
  revokeToken
);
router.get("/user/", authJwt, authorize([Role.Admin]), getAll);
router.get("/user/:id", authJwt, authorize(), getById);
router.get("/user/:id/refresh-tokens", authJwt, authorize(), getRefreshTokens);

export default router;