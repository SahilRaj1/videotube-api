import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { BASE_URL } from "./constants";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes";
import healthcheckRouter from "./routes/healthcheck.routes";
import tweetRouter from "./routes/tweet.routes";
import subscriptionRouter from "./routes/subscription.routes";
import videoRouter from "./routes/video.routes";
import commentRouter from "./routes/comment.routes";
import likeRouter from "./routes/like.routes";
import playlistRouter from "./routes/playlist.routes";
import dashboardRouter from "./routes/dashboard.routes";

// routes declaration
app.use(`${BASE_URL}/healthcheck`, healthcheckRouter);
app.use(`${BASE_URL}/users`, userRouter);
app.use(`${BASE_URL}/tweets`, tweetRouter);
app.use(`${BASE_URL}/subscriptions`, subscriptionRouter);
app.use(`${BASE_URL}/videos`, videoRouter);
app.use(`${BASE_URL}/comments`, commentRouter);
app.use(`${BASE_URL}/likes`, likeRouter);
app.use(`${BASE_URL}/playlist`, playlistRouter);
app.use(`${BASE_URL}/dashboard`, dashboardRouter);

export default app;
