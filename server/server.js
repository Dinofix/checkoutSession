const express = require("express");
const cookieSession = require("cookie-session");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const userRouter = require("./resources/users/users.router");
const authRouter = require("./resources/auth/auth.router");
const stripeRouter = require("./resources/stripe/stripe.router");

const allowedOrigins = [process.env.FRONTEND_URL];

const key1 = crypto.randomBytes(32).toString("hex");
const key2 = crypto.randomBytes(32).toString("hex");

const app = express();

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    keys: [key1, key2],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/payments", stripeRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server is up and running on port ${PORT}...🌭`)
);
