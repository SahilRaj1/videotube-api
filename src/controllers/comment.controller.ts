import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import mongoose, { isValidObjectId } from "mongoose";
import Video from "../models/video.model";
import Comment from "../models/comment.model";

export const getVideoComments = asyncHandler(
    async (req: Request, res: Response) => {
        const { videoId } = req.params;
        const { page = 1, limit = 10, sortType } = req.query;

        if (!isValidObjectId(videoId)) {
            return new ApiError(400, "Invalid video id");
        }

        // ?page=1&sortBy=views&sortType=new&limit=4
        const parsedLimit = parseInt(limit as any);
        const pageSkip = (parseInt(page as any) - 1) * parsedLimit;
        const sortBy = sortType === "old" ? -1 : 1;

        const video = await Video.findById(videoId);
        if (!video) {
            return new ApiError(404, "Video not found");
        }

        const comments = await Comment.aggregate([
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId),
                },
            },
            {
                $sort: {
                    createdAt: sortBy,
                },
            },
            {
                $skip: pageSkip,
            },
            {
                $limit: parsedLimit,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "owner",
                    as: "owner",
                },
            },
        ]);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    comments,
                    "Comments fetched successfully"
                )
            );
    }
);

export const addComment = asyncHandler(
    async (req: Request, res: Response) => {
        const { videoId } = req.params;
        const { content } = req.body;

        if (!isValidObjectId(videoId)) {
            return new ApiError(400, "Invalid video id");
        }

        if (!content || !content.trim()) {
            return new ApiError(400, "Comment content not provided");
        }

        const comment = await Comment.create({
            content,
            video: new mongoose.Types.ObjectId(videoId),
            owner: new mongoose.Types.ObjectId((req as any).user?._id)
        });

        if (!comment) {
            return new ApiError(500, "Some error occured while creating a comment");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    201,
                    comment,
                    "Comment created successfully"
                )
            );
    }
);

export const updateComment = asyncHandler(
    async (req: Request, res: Response) => {
        const { commentId } = req.params;
        const { updateContents } = req.body;

        if (!isValidObjectId(commentId)) {
            return new ApiError(400, "Invalid comment id");
        }

        const comment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: updateContents,
            },
            {
                new: true,
            }
        );

        if (!comment) {
            return new ApiError(400, "Tweet not found or not updated");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    comment,
                    "Comment updated successfully"
                )
            );
    }
);

export const deleteComment = asyncHandler(
    async (req: Request, res: Response) => {
        const { commentId } = req.params;

        if (!isValidObjectId(commentId)) {
            return new ApiError(400, "Invalid comment id");
        }

        const comment = await Comment.findByIdAndDelete(commentId);

        if (!comment) {
            return new ApiError(404, "Comment not found or not deleted");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    comment,
                    "Comment deleted successfully"
                )
            );
    }
);
