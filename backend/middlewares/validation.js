import { check, validationResult } from "express-validator";

export const validateRegister = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters",
  ).isLength({ min: 6 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateLogin = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateTask = [
  check("title", "Title is required").not().isEmpty(),
  check("status", "Status must be Pending, In Progress, or Completed")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"]),
  check("priority", "Priority must be Low, Medium, or High")
    .optional()
    .isIn(["Low", "Medium", "High"]),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
