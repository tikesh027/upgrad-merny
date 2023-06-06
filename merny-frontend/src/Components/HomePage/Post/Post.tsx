import React, { useState, useEffect } from "react";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import SendIcon from "@mui/icons-material/Send";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "./Post.module.css";
import CommentWrapper from "./Comment/CommentWrapper";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  formatDateToRelative,
  getAccessTokenFromCookie,
} from "../../../Constant/helpers";
import SimpleSlider from "./ImageSlider";
import { useSelector } from "react-redux";
import { TStore } from "../../../Store/store";
import axios from "axios";
import { BASE_URL } from "../../../Constant/Constant";
import { TPost } from "../HomePage";

type PostProps = TPost & {
  openEditModal: () => void;
  reFreshPost: () => Promise<void>;
};

const Post: React.FC<PostProps> = (props) => {
  const user: any = useSelector<TStore>((state) => state.loggedInUserDetails);
  const [liked, setLiked] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState(false);
  const [savedPost, setSavedPost] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const userId = user?.data?.userData?._id;
  const savedPosts = user?.data?.userData?.saved;
  // const liked: string | undefined = props.like.find(item => item === userId);

  useEffect(() => {
    const postLiked: string | undefined = props.like.find(
      (item) => item === userId
    );
    setLiked(Boolean(postLiked));
    setPostLikeCount(props.like.length);
  }, [props.like]);

  useEffect(() => {
    if (savedPosts && savedPosts.length) {
      const savedUserPost: string | undefined = savedPosts.find(
        (item: any) => item._id === props._id
      );
      setSavedPost(Boolean(savedUserPost));
    }
  }, [savedPosts]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onEdit = () => {
    props.openEditModal();
    handleClose();
  };
  const onDelete = () => {
    if(window.confirm("sure you want to delete the post")){
      deletePost();
      handleClose();
    }
  };

  const deletePost = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    try {
      const data = await axios.delete(`${BASE_URL}/post/${props._id}`, {
        headers: {
          "X-Authorization": accessToken,
        },
      });
      console.log(data.data);
      props.reFreshPost();
    } catch (error) {
      console.log(error);
    }
  };

  const likedPost = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    try {
      if (liked === false) {
        setLikeProcessing(true);
        const data = await axios.put(`${BASE_URL}/post/${props._id}/like`,{}, {
          headers: {
            "X-Authorization": accessToken,
          },
        });
        // const notificationData = {
        //   id: userData?._id,
        //   recipients: props._id,
        //   url: "",
        //   text: `${userData?.username} has started to follow you.`,
        // };
        // const notification = await axios.post(
        //   `${BASE_URL}/notification`,
        //   notificationData,
        //   {
        //     headers: {
        //       "X-Authorization": accessToken,
        //     },
        //   }
        // );
        setLikeProcessing(false);
        setLiked(true);
        setPostLikeCount((prevState) => prevState + 1);
        console.log(data.data);
      } else {
        setLikeProcessing(true);
        const data = await axios.put(`${BASE_URL}/post/${props._id}/unlike`,{}, {
          headers: {
            "X-Authorization": accessToken,
          },
        });
        setLikeProcessing(false);
        setLiked(false);
        setPostLikeCount((prevState) => prevState - 1);
        console.log(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const savePost = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    try {
      const data = await axios.put(`${BASE_URL}/savepost/${props._id}`,{}, {
        headers: {
          "X-Authorization": accessToken,
        },
      });
      setSavedPost(true);
      console.log(data.data);
      props.reFreshPost();
    } catch (error) {
      console.log(error);
    }
  };

  const unSavePost = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    try {
      const data = await axios.put(`${BASE_URL}/unsavepost/${props._id}`,{}, {
        headers: {
          "X-Authorization": accessToken,
        },
      });
      setSavedPost(false);
      console.log(data.data);
      props.reFreshPost();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.postHeader}>
          <div className={styles.iconAndUserame}>
            <div>
              <img
                className={styles.profileLogo}
                src={props.user?.avatar}
                alt=""
              />
            </div>
            <div className={styles.profiledata}>
              <div className={styles.profileUserName}>
                {props.user?.username}
              </div>
              <div className={styles.userNameAndTime}>
                {formatDateToRelative(props.createdAt)}
              </div>
            </div>
          </div>
          <div>
            <button className={styles.optionButton} onClick={handleClick}>
              <MoreHorizIcon />
            </button>
          </div>
        </div>
        <div>
          <p className={styles.postTitle}>{props.content}</p>
        </div>
        <div className={styles.image}>
          <SimpleSlider>
            {props.image.map((image, index) => (
              <img
                key={index}
                className={styles.image}
                src={`${BASE_URL}/${image}`}
                alt=""
              />
            ))}
          </SimpleSlider>
        </div>
        <div className={styles.iconContainer}>
          <div className={styles.likeCommentShare}>
            <button
              className={styles.likeButton}
              disabled={likeProcessing}
              onClick={likedPost}
            >
              {liked ? (
                <FavoriteIcon className={styles.buttonColor} />
              ) : (
                <FavoriteBorderIcon className={styles.unLikedButton} />
              )}
            </button>
            <div>
              <CommentIcon className={styles.commentIcon} />
            </div>
            <div>
              <SendIcon className={styles.sendIcon} />
            </div>
          </div>

          <div className={styles.savedIcon}>
            <button
              onClick={savedPost ? unSavePost : savePost}
              className={styles.saveButton}
            >
              {savedPost ? (
                <BookmarkOutlinedIcon />
              ) : (
                <BookmarkBorderOutlinedIcon />
              )}
            </button>
          </div>
        </div>
        <div className={styles.likeCount}>
          <div>{postLikeCount}</div>
          <div>likes</div>
        </div>
        <div>
          <CommentWrapper
            postId={props._id}
            comment={props.comment}
            refreshComments={props.reFreshPost}
          />
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
          <MenuItem onClick={onEdit}>Edit Post</MenuItem>
          <MenuItem onClick={onDelete}>Remove Post</MenuItem>
          <MenuItem onClick={handleClose}>CopyLink</MenuItem>
        </div>
      </Menu>
    </div>
  );
};

export default Post;
