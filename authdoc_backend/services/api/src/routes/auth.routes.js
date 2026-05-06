import express from "express"

import * as controller from "../controllers/auth.controller.js"

import authMiddleware from "../middleware/auth.middleware.js"

const router = express.Router()

router.post(
  "/login",
  controller.login
)

router.get(
  "/me",
  authMiddleware,
  controller.me
)

router.post(
  "/change-password",
  authMiddleware,
  controller.changePassword
)

export default router