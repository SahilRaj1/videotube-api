import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler"
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import Video from "../models/video.model";
import mongoose, { isValidObjectId } from "mongoose";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import User from "../models/user.model";

export const getAllVideos = asyncHandler(
    async (req: Request, res: Response) => {
        const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
        //TODO: get all videos based on query, sort, pagination
    }
);

export const publishAVideo = asyncHandler(
    async (req: Request, res: Response) => {
        const { title, description} = req.body
        // TODO: get video, upload to cloudinary, create video
    }
);

export const getVideoById = asyncHandler(
    async (req: Request, res: Response) => {
        const { videoId } = req.params
        //TODO: get video by id
    }
);

export const updateVideo = asyncHandler(
    async (req: Request, res: Response) => {
        const { videoId } = req.params
        //TODO: update video details like title, description, thumbnail
    
    }
);

export const deleteVideo = asyncHandler(
    async (req: Request, res: Response) => {
        const { videoId } = req.params
        //TODO: delete video
    }
);

export const togglePublishStatus = asyncHandler(
    async (req: Request, res: Response) => {
        const { videoId } = req.params
    }
);
