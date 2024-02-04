import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const healthcheck = asyncHandler(
    async (req: Request, res: Response) => {
        //TODO: build a healthcheck response that simply returns the OK status as json with a message
    }
);
