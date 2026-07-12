import { Router } from "express";

const router = Router();

import {
  loginJWT,
  logOut,
  registerUser,
  verifyEmail,
  getCurrentUser,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgetPassword,
  changePassword,
  resendRegisterMail,
} from "../controllers/auth.js";

import { verifyJWT } from "../middleware/verifyJWT.js";

// auth routes

router.route("/login").post(loginJWT); // done

router.route("/forgot-password").post(forgotPasswordRequest); // done

router.route("/reset-password/:resetToken").post(resetForgetPassword); // done

router.route("/resend-register-email").post(resendRegisterMail); // done

router.route("/register").post(registerUser); // done

router.route("/refresh-token").post(refreshAccessToken); // done

router.route("/me").get(verifyJWT, getCurrentUser); //done

router.route("/logout").post(verifyJWT, logOut); //done

router.route("/change-password").post(verifyJWT, changePassword); // done

router.route(`/verify/:verificationToken`).get(verifyEmail); // done

export { router };
