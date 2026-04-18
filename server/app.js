require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const profileRoutes = require("./routes/profileRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = new Set([
  clientUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""
]);

function isAllowedOrigin(origin) {
  return (
    !origin ||
    allowedOrigins.has(origin) ||
    origin.endsWith(".vercel.app")
  );
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed."));
    }
  })
);
app.use(express.json());

app.use("/", profileRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
}

module.exports = app;
