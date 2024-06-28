import connectDB from "@/lib/db";
import { Post } from "@/models/post.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest, {params}:{params:{postId:string}}) => {
  try {
    await connectDB();
    const userId = await req.json();
    console.log("userId", userId);

    const post = await Post.findById({ _id: params.postId });
    if (!post)
      return NextResponse.json({
        error: "Post not found.",
      });
    await post.updateOne({ $pull: { likes: userId } });
    return NextResponse.json({ message: "Post dislike successfully" });
  } catch (error) {
    return NextResponse.json({ error: "An error accured" });
  }
};
