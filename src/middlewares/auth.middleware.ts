import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import asyncHandler from "../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import User from "../models/user.model";

dotenv.config();

export const validateToken = asyncHandler(
    async (req: Request, _: Response, next: NextFunction) => {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        );

        const user = await User.findById(
            (decodedToken as JwtPayload)?._id
        ).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        (req as any).user = user;
        next();
    }
);
