import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler"
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import Like from "../models/like.model";
import mongoose, { isValidObjectId } from "mongoose";

export const toggleVideoLike = asyncHandler(
    async (req: Request, res: Response) => {
        const {videoId} = req.params
        
        if (!isValidObjectId(videoId)) {
            return new ApiError(400, "Invalid video id");
        }

        let like = await Like.findOne({
            likedBy: new mongoose.Types.ObjectId((req as any).user._id),
            video: new mongoose.Types.ObjectId(videoId),
        });

        let message: string;

        if (!like) {
            like = await Like.create({
                likedBy: new mongoose.Types.ObjectId((req as any).user._id),
                video: new mongoose.Types.ObjectId(videoId),
                likeFor: "video",
            });
            message = "Liked added successfully";
        } else {
            like = await Like.deleteOne({
                likedBy: new mongoose.Types.ObjectId((req as any).user._id),
                video: new mongoose.Types.ObjectId(videoId),
            });
            message = "Liked removed successfully"
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    like,
                    message
                )
            );
    }
);

export const toggleCommentLike = asyncHandler(
    async (req: Request, res: Response) => {
        const {commentId} = req.params

        if (!isValidObjectId(commentId)) {
            return new ApiError(400, "Invalid comment id");
        }

        let like = await Like.findOne({
            likedBy: new mongoose.Types.ObjectId((req as any).user._id),
            comment: new mongoose.Types.ObjectId(commentId),
        });

        let message: string;

        if (!like) {
            like = await Like.create({
                likedBy: new mongoose.Types.ObjectId((req as any).user._id),
                comment: new mongoose.Types.ObjectId(commentId),
                likeFor: "comment",
            });
            message = "Liked added successfully";
        } else {
            like = await Like.deleteOne({
                likedBy: new mongoose.Types.ObjectId((req as any).user._id),
                comment: new mongoose.Types.ObjectId(commentId),
            });
            message = "Liked removed successfully"
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    like,
                    message
                )
            );
    }
);

export const toggleTweetLike = asyncHandler(
    async (req: Request, res: Response) => {
        const {tweetId} = req.params

        if (!isValidObjectId(tweetId)) {
            return new ApiError(400, "Invalid comment id");
        }

        let like = await Like.findOne({
            likedBy: new mongoose.Types.ObjectId((req as any).user._id),
            tweet: new mongoose.Types.ObjectId(tweetId),
        });

        let message: string;

        if (!like) {
            like = await Like.create({
                likedBy: new mongoose.Types.ObjectId((req as any).user._id),
                tweet: new mongoose.Types.ObjectId(tweetId),
                likeFor: "tweet",
            });
            message = "Liked added successfully";
        } else {
            like = await Like.deleteOne({
                likedBy: new mongoose.Types.ObjectId((req as any).user._id),
                tweet: new mongoose.Types.ObjectId(tweetId),
            });
            message = "Liked removed successfully"
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    like,
                    message
                )
            );
    }
);

export const getLikedVideos = asyncHandler(
    async (req: Request, res: Response) => {

        const likedVideos = await Like.find({
            likedBy: new mongoose.Types.ObjectId((req as any).user._id),
            likeFor: "video",
        })
        .populate("likedBy")
        .populate("video");

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                likedVideos,
                "Liked Videos fetched successfully"
            ));
    }
);
