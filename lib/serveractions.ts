"use server";

import { Post } from "@/models/post.model";
import { IUser } from "@/models/user.model";
import { currentUser } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./db";
import { revalidatePath } from "next/cache";
import { Comment } from "@/models/comment.model";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const createPostAction = async (
  inputText: string,
  selectedFile: string
) => {
  await connectDB();
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated");
  if (!inputText) throw new Error("Input field is required");
  const image = selectedFile;
  const userDatabase: IUser = {
    firstName: user.firstName || "abhi",
    lastName: user.lastName || "Mern stack",
    userId: user.id,
    profilePhoto: user.imageUrl,
  };
  let uploadresponse;
  try {
    if (image) {
      uploadresponse = await cloudinary.uploader.upload(image);
      await Post.create({
        description: inputText,
        user: userDatabase,
        imageUrl: uploadresponse?.secure_url,
      });
    } else {
      await Post.create({
        description: inputText,
        user: userDatabase,
      });
    }
    revalidatePath("/");
  } catch (error) {}
};

//get all posts
export const getAllPosts = async () => {
  await connectDB();
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "comments", options: { sort: { createdAt: -1 } } });

    if (!posts) return [];
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.log(error);
  }
};

// delete post
export const deletePostAction = async (postId: any) => {
  await connectDB();
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated");
  const post = await Post.findById(postId);
  if (!post) throw new Error("post not found");

  if (post.user.userId !== user.id) {
    throw new Error("You are delete only own post");
  }

  try {
    await Post.deleteOne({ _id: postId });
    revalidatePath("/");
  } catch (error: any) {
    throw new Error("An error occured", error);
  }
};

// createpost
export const createCommentAction = async (
  postId: string,
  formData: FormData
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");
    const inputText = formData.get("inputText") as string;
    if (!inputText) throw new Error("field is required");
    if (!postId) throw new Error("Post id required");

    const userDatabase: IUser = {
      firstName: user.firstName || "abhi",
      lastName: user.lastName || "Mern stack",
      userId: user.id,
      profilePhoto: user.imageUrl,
    };
    const post = await Post.findById({ _id: postId });
    if (!post) throw new Error("Post not found");
    const comment = await Comment.create({
      textMessage: inputText,
      user: userDatabase,
    });
    post.comments?.push(comment._id as any);
    await post.save();
    revalidatePath("/");
  } catch (error: any) {
    throw new Error("An error accurred", error);
  }
};
