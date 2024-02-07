import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler"
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import Tweet from "../models/tweet.model";
import User from "../models/user.model";
import mongoose, { isValidObjectId } from "mongoose";
import Like from "../models/like.model";

export const createTweet = asyncHandler(
    async (req:Request, res: Response) => {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return new ApiError(400, "Tweet content not provided");
        }

        const tweet = await Tweet.create({
            content,
            owner: new mongoose.Types.ObjectId((req as any).user?._id)
        });

        const createdTweet = await Tweet.findById(tweet?._id);
        if (!createdTweet) {
            return new ApiError(500, "")
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    tweet,
                    "Tweet created successfully"
                )
            );
    }
);

export const getUserTweets = asyncHandler(
    async (req:Request, res: Response) => {
        const {userId} = req.params;
        const { page = 1, limit = 10, query, sortType } = req.query;

        // ?page=1&sortBy=views&sortType=asc&limit=4
        const parsedLimit = parseInt((limit as any));
        const pageSkip = (parseInt(page as any) - 1) * parsedLimit;
        const sortBy = sortType === 'old' ? -1 : 1;

        const user = await User.findById(userId);
        if (!user) {
            return new ApiError(404, "User not found");
        }

        const tweets = await Tweet.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $sort: {
                    createdAt: sortBy
                }
            },
            {
                $skip: pageSkip
            },
            {
                $limit: parsedLimit
            },
            {
                $lookup: {
                    from: 'likes',
                    let: { tweetId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$tweet', '$$tweetId'] }
                            }
                        }
                    ],
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likeCount: { $size: '$likes' }
                }
            },
            {
                $project: {
                    likes: 0
                }
            }
        ]);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    tweets,
                    "User Tweets fetched successfully"
                )
            );
    }
);

export const updateTweet = asyncHandler(
    async (req:Request, res: Response) => {
        const { updateContents } = req.body;
        const { tweetId } = req.params;

        if (!isValidObjectId(tweetId)) {
            return new ApiError(400, "Invalid tweet id");
        }

        const tweet = await Tweet.findByIdAndUpdate(
            tweetId,
            {
                $set: updateContents,
            },
            {
                new: true,
            }
        );

        if (!tweet) {
            return new ApiError(404, "Tweet not found");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    tweet,
                    "Tweet updated successfully"
                )
            );
    }
);

export const deleteTweet = asyncHandler(
    async (req:Request, res: Response) => {
        const { tweetId } = req.params;

        if (!isValidObjectId(tweetId)) {
            return new ApiError(400, "Invalid tweet id");
        }
        
        const tweet = await Tweet.findByIdAndDelete(tweetId);

        if (!tweet) {
            return new ApiError(404, "Tweet not found");
        }

        await Like.deleteMany({ tweet: new mongoose.Types.ObjectId(tweetId) });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    tweet,
                    "Deleted tweet successfully"
                )
            );
    }
);
