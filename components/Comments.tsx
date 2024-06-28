import { IPostDocument } from "@/models/post.model";
import React from "react";
import Comment from "@/components/Comment";

const Comments = ({ post }: { post: IPostDocument }) => {
  return (
    <div>
      {post.comments?.map((commen: any) => {
        return (
          <div key={commen._id}>
            <Comment comment={commen} />
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
