import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler"
import User from "../models/user.model";
import Video from "../models/video.model";
import Like from "../models/like.model";
import Comment from "../models/comment.model";
import Subscription from "../models/subscription.model";
import Tweet from "../models/tweet.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import mongoose from "mongoose";

export const getChannelStats = asyncHandler(
    async (req: Request, res: Response) => {
        // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    }
);

export const getChannelVideos = asyncHandler(
    async (req: Request, res: Response) => {
        // TODO: Get all the videos uploaded by the channel
    }
);
