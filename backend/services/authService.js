import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (name, email, password) => {
  const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  
  if (userExists.rows.length > 0) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, hashedPassword],
  );

  const token = jwt.sign(
    { id: newUser.rows[0].id, email: newUser.rows[0].email },
    process.env.JWT_SECRET || "secret123",
    {
      expiresIn: "30d",
    },
  );

  return { user: newUser.rows[0], token };
};

export const loginUser = async (email, password) => {
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (user.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  if (!user.rows[0].password) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.rows[0].id, email: user.rows[0].email },
    process.env.JWT_SECRET || "secret123",
    {
      expiresIn: "30d",
    },
  );

  return {
    user: {
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
    },
    token,
  };
};
