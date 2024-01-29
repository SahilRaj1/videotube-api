import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { validateToken } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
);
router.route("/login").post(loginUser);

// secured routes

router.route("/logout").post(validateToken, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(validateToken, changeCurrentPassword);
router.route("/current-user").get(validateToken, getCurrentUser);
router.route("/update-account").put(validateToken, updateAccountDetails);
router.route("/update-avatar").put(validateToken, upload.single("avatar"), updateUserAvatar);
router.route("/update-cover").put(validateToken, upload.single("coverImage"), updateUserCoverImage);    

export default router;
