import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "./Comment.module.css";
import { Menu, MenuItem } from "@mui/material";
import Fade from "@mui/material/Fade";
import axios from "axios";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSelector } from "react-redux";
import {
  formatDateToRelative,
  getAccessTokenFromCookie,
} from "../../../../Constant/helpers";
import { TStore } from "../../../../Store/store";
import { BASE_URL } from "../../../../Constant/Constant";

export type TComment = {
  content: string;
  tag: string;
  reply: string[];
  like: string[];
  user: any;
  postId: string;
  postUserId: string;
  key: string;
  _id: string;
  refreshDeleteComment: () => Promise<void>;
  commentCreatedAt: string;
};

type CommentProps = TComment & {
  setReplyingTo: (id: string) => void;
};

const Comment: React.FC<CommentProps> = (props) => {
  const user: any = useSelector<TStore>((state) => state.loggedInUserDetails);
  const [commentText, setCommentText] = useState(props.content);
  const [editComment, setEditComment] = useState(false);
  const [commentLike, setCommentLike] = useState(false);
  const [commentLikeCount, setCommentLikeCount] = useState(0);
  const [commentLikeProcessing, setCommentLikeProcessing] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const userId = user?.data?.userData?._id;

  useEffect(() => {
    const commentLiked: string | undefined = props.like.find(
      (item) => item === userId
    );
    console.log("======>", commentLiked);
    setCommentLike(Boolean(commentLiked));
    setCommentLikeCount(props.like.length);
  }, [userId, props.like]);

  const handleCommentInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(event.target.value);
  };

  const onCommentEditComplete = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    const userComment = {
      content: commentText,
    };
    try {
      const data = await axios.post(
        `${BASE_URL}/comment/${props._id}`,
        userComment,
        {
          headers: {
            "X-Authorization": accessToken,
          },
        }
      );
      props.refreshDeleteComment();
      console.log(data.data);
    } catch (error) {
      console.log(error);
    }
    setEditComment(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onEditComment = () => {
    setEditComment(true);
    handleClose();
  };
  const onDelete = async () => {
    if (window.confirm("sure you want to delete the comment")) {
      const accessToken = getAccessTokenFromCookie();
      if (!accessToken) return;
      try {
        const data = await axios.delete(`${BASE_URL}/comment/${props._id}`, {
          headers: {
            "X-Authorization": accessToken,
          },
        });
        props.refreshDeleteComment();
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
      handleClose();
    }
  };

  const likeAComment = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    if (commentLike === false) {
      setCommentLikeProcessing(true);
      try {
        const data = await axios.get(`${BASE_URL}/comment/${props._id}/like`, {
          headers: {
            "X-Authorization": accessToken,
          },
        });
        setCommentLikeProcessing(false);
        setCommentLike(true);
        setCommentLikeCount((prevState) => prevState + 1);
        console.log(data.data);
      } catch (error) {
        setCommentLikeProcessing(false);
        console.log(error);
      }
    } else {
      setCommentLikeProcessing(true);
      try {
        const data = await axios.get(
          `${BASE_URL}/comment/${props._id}/unlike`,
          {
            headers: {
              "X-Authorization": accessToken,
            },
          }
        );
        setCommentLikeProcessing(false);
        setCommentLike(false);
        setCommentLikeCount((prevState) => prevState - 1);
        console.log(data.data);
      } catch (error) {
        setCommentLikeProcessing(false);
        console.log(error);
      }
    }
  };

  return (
    <div>
      <div className={styles.profile}>
        <div>
          <img className={styles.avatarIcon} src={props.user?.avatar} alt="" />
        </div>
        <div className={styles.userNameTitle}>{props.user?.username}</div>
      </div>
      <div className={styles.commentWrapper}>
        <div className={styles.comments}>
          <div>
            <div>
              {editComment ? (
                <input
                  value={commentText}
                  onChange={handleCommentInput}
                  onBlur={onCommentEditComplete}
                  type="text"
                />
              ) : (
                commentText
              )}
            </div>
            <div className={styles.likeReply}>
              <div>{formatDateToRelative(props.commentCreatedAt)}</div>
              <div>
                <span>{commentLikeCount}</span>
                <span>Like</span>
              </div>
              <button className={styles.replyButton}>Reply</button>
            </div>
          </div>
          <div className={styles.likeAndMenu}>
            <div>
              <button
                className={styles.commentLikeButton}
                disabled={commentLikeProcessing}
                onClick={likeAComment}
              >
                {commentLike ? (
                  <FavoriteIcon className={styles.buttonColor} />
                ) : (
                  <FavoriteBorderIcon className={styles.unLikedButton} />
                )}
              </button>
            </div>
            <div onClick={handleClick} className={styles.edit}>
              <MoreVertIcon className={styles.editBtn} />
            </div>
          </div>
        </div>
      </div>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <div>
          <MenuItem onClick={onEditComment}>Edit Comment</MenuItem>
          <MenuItem onClick={onDelete}>Remove Comment</MenuItem>
        </div>
      </Menu>
    </div>
  );
};

export default Comment;
