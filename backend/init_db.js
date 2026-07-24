import pool from "./config/db.js";

async function initDB() {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255)
            );
        `);
    console.log("Users table created or exists.");

    try {
      await pool.query(`
                ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
                ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
            `);
      console.log("users table altered for Google Auth.");
    } catch (e) {
      console.log(
        "users table already compatible with Google Auth.",
        e.message,
      );
    }

    try {
      await pool.query(`
                ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
            `);
      console.log("user_id column added to tasks.");
    } catch (e) {
      console.log(
        "user_id might already exist in tasks or another error: ",
        e.message,
      );
    }

    console.log("DB Init Complete");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing DB:", error);
    process.exit(1);
  }
}

initDB();
