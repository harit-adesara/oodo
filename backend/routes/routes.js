import { Router } from "express";

const router = Router();

import {
  loginJWT,
  logOut,
  getCurrentUser,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgetPassword,
  changePassword,
} from "../controllers/auth.js";

import { verifyJWT } from "../middleware/verifyJWT.js";

// auth routes

router.route("/login").post(loginJWT); // done

router.route("/forgot-password").post(forgotPasswordRequest); // done

router.route("/reset-password/:resetToken").post(resetForgetPassword); // done

router.route("/refresh-token").post(refreshAccessToken); // done

router.route("/me").get(verifyJWT, getCurrentUser); //done

router.route("/logout").post(verifyJWT, logOut); //done

router.route("/change-password").post(verifyJWT, changePassword); // done

export { router };
