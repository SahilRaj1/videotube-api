import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoUrl: {
            type: String, // cloudinary url
            required: true,
        },
        videoPublicId: {
            type: String, // cloudinary public ID
            required: true,
        },
        thumbnailUrl: {
            type: String, // cloudinary url
            required: true,
        },
        thumbnailPublicId: {
            type: String, // cloudinary public ID
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number, // cloudinary data
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

const Video = model("Video", videoSchema);

export default Video;
