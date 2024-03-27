import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler"
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import Playlist from "../models/playlist.model";
import mongoose, { isValidObjectId } from "mongoose";

export const createPlaylist = asyncHandler(
    async (req: Request, res: Response) => {
        const {name, description} = req.body
    
        if (!name) {
            return new ApiError(400, "Playlist name not provided");
        }

        const playlist = await Playlist.create({
            name,
            description,
            owner: new mongoose.Types.ObjectId((req as any).user._id),
        });

        if (!playlist) {
            return new ApiError(500, "Some error occurred while creating playlist");
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    playlist,
                    "Playlist created successfully"
                )
            );
    }
);

export const getUserPlaylists = asyncHandler(
    async (req: Request, res: Response) => {
        const {userId} = req.params
        
        if (!isValidObjectId(userId)) {
            return new ApiError(400, "Invalid user id");
        }

        const playlists = await Playlist.find({ owner: new mongoose.Types.ObjectId(userId) })
            .populate("owner")
            .populate("videos");

        if (!playlists) {
            return new ApiError(500, "Something error occurred while fetching playlists");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    playlists,
                    "User playlists fectched successfully"
                )
            );
    }
);

export const getPlaylistById = asyncHandler(
    async (req: Request, res: Response) => {
        const {playlistId} = req.params
        
        if (!isValidObjectId(playlistId)) {
            return new ApiError(400, "Invalid playlist id");
        }

        const playlist = await Playlist.findById(playlistId)
            .populate("owner")
            .populate("videos");

        if (!playlist) {
            return new ApiError(500, "Something error occurred while fetching playlist");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    playlist,
                    "Playlist fectched successfully"
                )
            );
    }
);

export const addVideoToPlaylist = asyncHandler(
    async (req: Request, res: Response) => {
        const {playlistId, videoId} = req.params

        if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
            return new ApiError(400, "Invalid playlist id or video id");
        }

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $push: { videos: new mongoose.Types.ObjectId(videoId)},
            },
            {
                new: true,
            }
        );

        if (!playlist) {
            return new ApiError(500, "Some error occurred while adding video to playlist");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    playlist,
                    "Video added to playlist successfully"
                )
            );
    }
);

export const removeVideoFromPlaylist = asyncHandler(
    async (req: Request, res: Response) => {
        const {playlistId, videoId} = req.params
        
        if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
            return new ApiError(400, "Invalid playlist id or video id");
        }

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $pull: { videos: new mongoose.Types.ObjectId(videoId)},
            },
            {
                new: true,
            }
        );

        if (!playlist) {
            return new ApiError(500, "Some error occurred while removing video from playlist");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    playlist,
                    "Video removed to playlist successfully"
                )
            );
    }
);

export const deletePlaylist = asyncHandler(
    async (req: Request, res: Response) => {
        const {playlistId} = req.params
        
        if (!isValidObjectId(playlistId)) {
            return new ApiError(400, "Invalid playlist id");
        }

        const playlist = await Playlist.findByIdAndDelete(playlistId);

        if (!playlist) {
            return new ApiError(500, "Some error occurred while deleting playlist");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    playlist,
                    "Playlist deleted successfully"
                )
            );
    }
);

export const updatePlaylist = asyncHandler(
    async (req: Request, res: Response) => {
        const {playlistId} = req.params
        const {updateContents} = req.body
        
        if (!isValidObjectId(playlistId)) {
            return new ApiError(400, "Invalid playlist id");
        }

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $set: updateContents,
            },
            {
                new: true,
            }
        );

        if (!playlist) {
            return new ApiError(404, "Some error occurred while updating playlist");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    playlist,
                    "Playlist updated successfully"
                )
            );
    }
);
