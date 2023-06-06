import React, { useState } from "react";
import Comment from "./Comment";
import styles from "./Comment.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { TStore } from "../../../../Store/store";
import { getAccessTokenFromCookie } from "../../../../Constant/helpers";
import { BASE_URL } from "../../../../Constant/Constant";

type CommentWrapperProps = {
  postId: string;
  comment: any[];
  refreshComments: () => Promise<void>;
};

const CommentWrapper: React.FC<CommentWrapperProps> = (props) => {
  const user: any = useSelector<TStore>((state) => state.User);
  const [replyingTo, setReplyingTo] = useState("");
  const [createComment, setCreateComment] = useState("");

  const handleCreateComment = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateComment(event.target.value);
  };

  const onCreateComment = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    if (createComment === "") {
      return;
    }
    const userNewComment = {
      content: createComment,
      postId: props.postId,
      reply: replyingTo ? [replyingTo] : undefined
    };

    try {
      const data = await axios.post(`${BASE_URL}/comment`, userNewComment, {
        headers: {
          "X-Authorization": accessToken,
        },
      });
      console.log(data.data);
      props.refreshComments();
      setCreateComment("");
      setReplyingTo("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {props.comment.map((item) => (
        <Comment
          content={item.content}
          tag={item.tag}
          reply={item.reply}
          like={item.likes}
          user={item.user}
          postId={item.postId}
          postUserId={item.postUserId}
          key={item._id}
          _id={item._id}
          refreshDeleteComment={props.refreshComments}
          setReplyingTo={setReplyingTo}
          commentCreatedAt={item.createdAt}
        />
      ))}

      <div className={styles.commentInputContainer}>
        <input
          value={createComment}
          onChange={handleCreateComment}
          className={styles.commentInput}
          type="text"
          placeholder="Add Your Comments...."
        />
        <button onClick={onCreateComment} className={styles.commentButton}>
          Comments
        </button>
      </div>
    </div>
  );
};

export default CommentWrapper;
