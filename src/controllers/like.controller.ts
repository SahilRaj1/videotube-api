import { Request } from "express";
import asyncHandler from "../utils/asyncHandler"
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import Like from "../models/like.model";
import mongoose, { isValidObjectId } from "mongoose";

export const toggleVideoLike = asyncHandler(
    async (req: Request, res: Response) => {
        const {videoId} = req.params
        //TODO: toggle like on video
    }
);

export const toggleCommentLike = asyncHandler(
    async (req: Request, res: Response) => {
        const {commentId} = req.params
        //TODO: toggle like on comment
    
    }
);

export const toggleTweetLike = asyncHandler(
    async (req: Request, res: Response) => {
        const {tweetId} = req.params
        //TODO: toggle like on tweet
    }
);

export const getLikedVideos = asyncHandler(
    async (req: Request, res: Response) => {
        //TODO: get all liked videos
    }
);
