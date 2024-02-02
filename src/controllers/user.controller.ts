import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import ApiResponse from "../utils/ApiResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { cookieOptions, userDontInclude } from "../constants";

dotenv.config();

const generateAccessAndRefreshTokens = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

export const registerUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { username, email, password, fullName } = req.body;

        if (
            [fullName, email, password, username].some(
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

        const avatarLocalPath = (req.files as any).avatar?.[0]?.path;
        const coverImageLocalPath = (req.files as any).coverImage?.[0]?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if (!avatar) {
            throw new ApiError(400, "Avatar file is required");
        }

        const user = await User.create({
            fullName,
            avatarUrl: avatar.url,
            avatarPublicId: avatar.public_id,
            coverImageUrl: coverImage?.url || "",
            coverImagePublicId: coverImage?.public_id || "",
            email,
            password,
            username: username.toLowerCase(),
        });

        const createdUser = await User.findById(user._id).select(
            userDontInclude
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

export const loginUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, username, password } = req.body;

        if (!email && !username) {
            throw new ApiError(400, "Email or Username is required");
        }

        const user = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(400, "Invalid user credentials");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
            user._id
        );

        const loggedInUser = await User.findById(user._id).select(
            userDontInclude
        );

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser,
                        accessToken,
                        refreshToken,
                    },
                    "User logged in Successfully"
                )
            );
    }
);

export const logoutUser = asyncHandler(
    async (req: any, res: Response) => {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: ""
                },
            },
            {
                new: true
            }
        );

        return res
            .status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "User logged out successfully"
                )
            );
    }
);

export const refreshAccessToken = asyncHandler(
    async (req: Request, res: Response) => {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        );

        const user = await User.findById((decodedToken as JwtPayload)?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(
            user._id
        );

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access token refreshed"
                )
            );
    }
);

export const changeCurrentPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById((req as any).user?._id);
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid old password");
        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Password changed successfully"
                )
            );
    }
);

export const getCurrentUser = asyncHandler(
    async (req: Request, res: Response) => {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    (req as any).user,
                    "Current user fetched successfully"
                )
            );
    }
);

export const updateAccountDetails = asyncHandler(
    async (req: Request, res: Response) => {
        const { fullName, username } = req.body;
        const updateFields: Record<string, any> = {}

        if (!fullName && !username) {
            return new ApiError(400, "Nothing to update");
        }

        if (fullName) {
            updateFields.fullName = fullName;
        }

        if (username) {
            updateFields.username = username;
        }

        const updatedUser = await User.findByIdAndUpdate(
            (req as any).user?._id,
            {
                $set: updateFields
            },
            {
                new: true
            }
        ).select(userDontInclude);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedUser,
                    "Account updated successfully"
                )
            );
    }
);

export const updateUserAvatar = asyncHandler(
    async (req: Request, res: Response) => {
        const avatarLocalPath = req.file?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if (!avatar) {
            throw new ApiError(400, "Avatar file is required");
        }

        const oldAvatarPublicId = (await User.findById((req as any).user._id)).avatarPublicId;

        const updatedUser = await User.findByIdAndUpdate(
            (req as any).user?._id,
            {
                $set: {
                    avatarUrl: avatar.url,
                    avatarPublicId: avatar.public_id
                }
            },
            {
                new: true
            }
        ).select(userDontInclude);

        const isOldAvatarDeleted = await deleteFromCloudinary(oldAvatarPublicId);
        if (!isOldAvatarDeleted) {
            throw new ApiError(500, "Unable to delete previous cover image");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedUser,
                    "Avatar updated successfully"
                )
            );
    }
);

export const updateUserCoverImage = asyncHandler(
    async (req: Request, res: Response) => {
        const coverImageLocalPath = req.file?.path;

        if (!coverImageLocalPath) {
            throw new ApiError(400, "Cover Image file is required");
        }

        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if (!coverImage) {
            throw new ApiError(400, "Cover Image file is required");
        }

        const oldCoverImagePublicId = (await User.findById((req as any).user._id)).coverImagePublicId;

        const updatedUser = await User.findByIdAndUpdate(
            (req as any).user?._id,
            {
                $set: {
                    coverImageUrl: coverImage.url,
                    coverImagePublicId: coverImage.public_id 
                }
            },
            {
                new: true
            }
        ).select(userDontInclude);

        const isOldCoverDeleted = await deleteFromCloudinary(oldCoverImagePublicId);
        if (!isOldCoverDeleted) {
            throw new ApiError(500, "Unable to delete previous cover image");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedUser,
                    "Cover Image updated successfully"
                )
            );
    }
);

export const getUserChannelProfile = asyncHandler(
    async (req: Request, res: Response) => {
        const { username } = req.params;

        if (!username?.trim()) {
            return new ApiError(400, "Username is missing");
        }

        const channel = await User.aggregate([
            {
                $match: {
                    username: username?.toLowerCase()
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            },
            {
                $addFields: {
                    subscribersCount: {
                        $size: "$subscribers"
                    },
                    channelsSubscribedToCount: {
                        $size: "$subscribedTo"
                    },
                    isSubscribed: {
                        $condition: {
                            if: { $in: [(req as any).user?._id, "$subscribers.subscriber"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    fullName: 1,
                    username: 1,
                    subscribersCount: 1,
                    channelsSubscribedToCount: 1,
                    isSubscribed: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1
                }
            }
        ]);

        if (!channel?.length) {
            return new ApiError(400, "Channel does not exist");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    channel[0],
                    "User channel fetched successfully"
                )
            );
    }
);
