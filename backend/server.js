import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pool from "./config/db.js";
import dotenv from "dotenv";
import taskRoutes from "./routes/routes.js";
import { setupSwagger } from "./swagger.js";
import passport from "./config/passport.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

setupSwagger(app);

app.use("/", taskRoutes);

app.get("/", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");
    res.status(200).send("Database connection and server startup successful!");
  } catch (e) {
    console.error("Database error:", e);
    res.status(500).send("Database connection failed");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
