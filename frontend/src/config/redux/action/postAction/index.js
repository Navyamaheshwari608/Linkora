import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  //here we are not getting any client input as its not at all needed
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;

    try {
      const formData = new FormData();
      formData.append("body", body);
      formData.append("media", file);

      const response = await clientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        return thunkAPI.fulfillWithValue("Post Uploaded");
      } else {
        return thunkAPI.rejectWithValue("Post not uploaded");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_post", {
        data: { post_id },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  },
);

export const incrementPostLike = createAsyncThunk(
  "post/incrementPostLike",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.post("/increment_post_like", {
        post_id,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  },
);

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_comments", {
        params: { post_id },
      });

      return thunkAPI.fulfillWithValue({
        comments: response.data,
        post_id,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  },
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      const response = await clientServer.post("/comment", {
        post_id: commentData.post_id,
        commentBody: commentData.body,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);
