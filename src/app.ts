import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { errorHandler } from "./middleware/errorMiddleware";
import userRouter from "./route/userRoute";
import cookieParser from "cookie-parser";
import chatRouter from "./route/chatRoute";

config();
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

// middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies and credentials (if necessary)
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", userRouter);

app.use("/api/chat", chatRouter);

app.use(errorHandler);

export default app;
