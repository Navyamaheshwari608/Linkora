import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

//to check if server working properly
export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};

export const createPost = async (req, res) => {
  const { token } = req.cookies;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();

    return res.status(200).json({ message: "Post created" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name email username profilePicture",
    );
    return res.json({ posts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  const { token } = req.cookies;
  const { post_id } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!user._id.equals(post.userId)) {
      return res.status(401).json({ message: "Unauthorized " });
    }

    await Post.deleteOne({ _id: post_id });

    return res.json({ message: "Post deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {
  const { token } = req.cookies;
  const { post_id, commentBody } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: post_id });

    const comment = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });

    comment.save();

    return res.status(200).json({ message: "Comment Added" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.query;
  try {
    const post = await Post.findOne({ _id: post_id }).select("_id");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ postId: post_id }).populate(
      "userId",
      "username name profilePicture",
    );

    return res.json(comments.reverse());
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const delete_comments_of_user = async (req, res) => {
  const { token, comment_id } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = await Comment.findOne({ _id: comment_id });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    //check if comment belong to this user only
    if (!user._id.equals(comment.userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await comment.deleteOne();

    return res.status(200).json("Comment deleted");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const increment_likes = async (req, res) => {
  const { token } = req.cookies;
  const { post_id } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likedBy.some((id) => id.equals(user._id));

    if (alreadyLiked) {
      post.likes -= 1;
      post.likedBy = post.likedBy.filter((id) => !id.equals(user._id));
      await post.save();
      return res.json({ message: "Likes decremented" });
    } else {
      post.likes += 1;
      post.likedBy = [...post.likedBy, user._id];
      await post.save();
      return res.json({ message: "Likes incremented" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
