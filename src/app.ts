import express from "express";
import { RouterPath } from "./shared/utils/router-path";
import { getVideoRouter } from "./features/videos/video.router";
import { db } from "./db/db";
import { getTestsRouter } from "./routes/tests";

export const app = express();

app.use(express.json());

app.use(RouterPath.videos, getVideoRouter(db));
app.use(RouterPath.__test__, getTestsRouter(db));
