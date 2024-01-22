import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import ApiResponse from "../utils/ApiResponse";

export const registerUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { username, email, password, fullname } = req.body;

        if (
            [fullname, email, password, username].some(
                (field: string) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400, "All fields are required");
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            throw new ApiError(
                409,
                "User with email or username already exists"
            );
        }

        const avatarLocalPath = (req.files! as any).avatar[0]?.path;
        const coverImageLocalPath = (req.files! as any).coverImage[0]?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if (!avatar) {
            throw new ApiError(400, "Avatar file is required");
        }

        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase(),
        });

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        if (!createdUser) {
            throw new ApiError(
                500,
                "Something went wrong while registering the user"
            );
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    createdUser,
                    "User registered successfully"
                )
            );
    }
);
