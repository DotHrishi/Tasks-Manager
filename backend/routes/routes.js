import express from "express";
import {
  addTasks,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import {
  validateRegister,
  validateLogin,
  validateTask,
} from "../middlewares/validation.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "30d" },
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(
      `${frontendUrl}/oauth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`,
    );
  },
);

router.post("/register", validateRegister, register);

router.post("/login", validateLogin, login);

router.post("/tasks", protect, validateTask, addTasks);

router.get("/tasks", protect, getTasks);

router.get("/tasks/:id", protect, getTaskById);

router.put("/tasks/:id", protect, validateTask, updateTask);

router.delete("/tasks/:id", protect, deleteTask);

export default router;
