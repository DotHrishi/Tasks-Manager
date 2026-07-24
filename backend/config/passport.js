import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./db.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "dummy_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_client_secret",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let userResult = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [profile.id],
        );

        if (userResult.rows.length === 0) {
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null;

          if (email) {
            userResult = await pool.query(
              "SELECT * FROM users WHERE email = $1",
              [email],
            );
          }

          if (userResult.rows.length > 0) {
            const linkedUser = await pool.query(
              "UPDATE users SET google_id = $1 WHERE email = $2 RETURNING *",
              [profile.id, email],
            );
            return cb(null, linkedUser.rows[0]);
          } else {
            const name = profile.displayName;
            const newUser = await pool.query(
              "INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *",
              [name, email, profile.id],
            );
            return cb(null, newUser.rows[0]);
          }
        }

        return cb(null, userResult.rows[0]);
      } catch (err) {
        return cb(err, null);
      }
    },
  ),
);

export default passport;
