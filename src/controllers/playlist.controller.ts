import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler"
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import Playlist from "../models/playlist.model";
import mongoose, { isValidObjectId } from "mongoose";

export const createPlaylist = asyncHandler(
    async (req: Request, res: Response) => {
        const {name, description} = req.body
    
        //TODO: create playlist
    }
);

export const getUserPlaylists = asyncHandler(
    async (req: Request, res: Response) => {
        const {userId} = req.params
        //TODO: get user playlists
    }
);

export const getPlaylistById = asyncHandler(
    async (req: Request, res: Response) => {
        const {playlistId} = req.params
        //TODO: get playlist by id
    }
);

export const addVideoToPlaylist = asyncHandler(
    async (req: Request, res: Response) => {
        const {playlistId, videoId} = req.params
    }
);

export const removeVideoFromPlaylist = asyncHandler(
    async (req: Request, res: Response) => {
        const {playlistId, videoId} = req.params
        // TODO: remove video from playlist
    
    }
);

export const deletePlaylist = asyncHandler(
    async (req: Request, res: Response) => {
        const {playlistId} = req.params
        // TODO: delete playlist
    }
);

export const updatePlaylist = asyncHandler(
    async (req: Request, res: Response) => {
        const {playlistId} = req.params
        const {name, description} = req.body
        //TODO: update playlist
    }
);
