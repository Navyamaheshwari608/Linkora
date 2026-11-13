import { Router } from "express";
import {
  activeCheck,
  commentPost,
  createPost,
  delete_comments_of_user,
  deletePost,
  get_comments_by_post,
  getAllPosts,
  increment_likes,
} from "../controllers/posts.controller.js";
import multer from "multer";
import path from "path";

const router = Router();

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

router.route("/").get(activeCheck);

router.route("/post").post(upload.single("media"), createPost);

router.route("/posts").get(getAllPosts);

router.route("/delete_post").delete(deletePost);

router.route("/comment").post(commentPost);

router.route("/get_comments").get(get_comments_by_post);

router.route("/delete_comment").delete(delete_comments_of_user);

router.route("/increment_post_like").post(increment_likes);

export default router;
