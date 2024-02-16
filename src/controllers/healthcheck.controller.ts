import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";

export const healthcheck = asyncHandler(
    async (req: Request, res: Response) => {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Everything seems fine!"
                )
            );
    }
);
