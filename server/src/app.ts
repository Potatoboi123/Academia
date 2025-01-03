// src/infrastructure/server/Server.ts
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config(/* { path: "./src/.env" } */);

import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/error-handler";

import passport from "passport";
import "./config/passport";

import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());

app.use("/api/users", userRoutes);

app.use(
  errorHandler as (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
);

export { app };
