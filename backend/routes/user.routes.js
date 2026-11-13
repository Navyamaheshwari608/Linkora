import { Router } from "express";
import multer from "multer";
import {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionsRequests,
  whatAreMyConnections,
  acceptConnectionRequest,
  logout,
  getUserProfileAndUserBasedOnUsername,
} from "../controllers/user.controller.js";
import path from "path";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format"), false);
    }
  },
});

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);

router.route("/user_update").post(updateUserProfile);

router.route("/get_user_and_profile").get(getUserAndProfile);

router.route("/update_profile_data").post(updateProfileData);

router.route("/user/get_all_users").get(getAllUserProfile);

router.route("/user/download_resume").get(downloadProfile);

router.route("/user/send_connection_request").post(sendConnectionRequest);

router.route("/user/getConnectionRequests").get(getMyConnectionsRequests);

router.route("/user/user_connection_request").get(whatAreMyConnections);

router.route("/user/accept_connection_request").post(acceptConnectionRequest);

router.route("/user/logout").patch(logout);

router
  .route("/user/get_profile_based_on_username")
  .get(getUserProfileAndUserBasedOnUsername);

export default router;
