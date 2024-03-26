import { Schema, model } from "mongoose";

const likeSchema = new Schema(
    {
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        likeFor: {
            type: String,
            required: true,
            enum: ["video", "comment", "tweet"],
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
        },
    },
    { timestamps: true }
);

const Like = model("Like", likeSchema);

export default Like;
