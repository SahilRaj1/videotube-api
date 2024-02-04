import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler"
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import Tweet from "../models/tweet.model";
import User from "../models/user.model";
import mongoose, { isValidObjectId } from "mongoose";

export const createTweet = asyncHandler(
    async (req:Request, res: Response) => {
        //TODO: create tweet
    }
);

export const getUserTweets = asyncHandler(
    async (req:Request, res: Response) => {
        // TODO: get user tweets
    }
);

export const updateTweet = asyncHandler(
    async (req:Request, res: Response) => {
        //TODO: update tweet
    }
);

export const deleteTweet = asyncHandler(
    async (req:Request, res: Response) => {
        //TODO: delete tweet
    }
);
