import React, { useEffect, useState } from "react";
import Navigation from "../Navigation/Navigation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClearIcon from "@mui/icons-material/Clear";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import styles from "./HomePage.module.css";
import SuggestionProfile from "./suggestionProfile/SuggestionProfile";
import { Box, Modal, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { TStore } from "../../Store/store";
import axios from "axios";
import { BASE_URL } from "../../Constant/Constant";
import { getAccessTokenFromCookie } from "../../Constant/helpers";
import { cloneDeep } from "lodash";
import { useNavigate } from "react-router-dom";
import Post from "./Post/Post";

const style = {
  position: "absolute" as "absolute",
  bottom: 0,
  right: 0,
  maxHeight: "70%",
  overflow: "auto",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 8,
  padding: 5,
};

export type TRecommendation = {
  _id: string;
  avatar: string;
  fullname: string;
  username: string;
};

export type TPost = {
  _id: string;
  comment: any[];
  content: string;
  image: string[];
  like: string[];
  createdAt: string;
  user?: {
    fullname: string;
    username: string;
    _id: string;
    avatar: string;
  };
};

const HomePage = () => {
  const user: any = useSelector<TStore>((state) => state.loggedInUserDetails);
  const [uploadedDisplayImages, setUploadedDisplayImages] = useState<string[]>(
    []
  );
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [userRecommendation, setUserRecommendation] = useState<
    TRecommendation[]
  >([]);
  const [allPosts, setAllPosts] = useState<TPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<TPost | null>(null);
  const navigate = useNavigate();
  useEffect(()=>{
    const accessToken = getAccessTokenFromCookie();
    if(!accessToken || !user.data){
      console.log("here ====>")
      navigate('/login');
    }
  },[user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditPost(false);
    setSelectedPost(null);
  };

  const getAllRecommendations = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    try {
      setIsLoading(true);
      const data = await axios.get(`${BASE_URL}/search`, {
        headers: {
          "X-Authorization": accessToken,
        },
      });
      setUserRecommendation(data.data);
      console.log(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllPosts = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    try {
      const data = await axios.get(`${BASE_URL}/posts`, {
        headers: {
          "X-Authorization": accessToken,
        },
      });
      const postsArray = data.data?.post;
      const posts: TPost[] = [];
      if (postsArray.length) {
        postsArray.forEach((item: any) => {
          posts.push({
            _id: item._id,
            comment: item.comments,
            content: item.content,
            image: item.image,
            like: item.like,
            createdAt: item.createdAt,
            user: {
              _id: item.user?._id,
              fullname: item.user?.fullname,
              username: item.user?.username,
              avatar: item.user?.avatar,
            },
          });
        });
      }
      setAllPosts(posts);
      console.log(posts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRecommendations();
    getAllPosts();
  }, []);

  const handlePostContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPostContent(event.target.value);
  };

  const onSubmitEditPost = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    try {
      const formData = new FormData();
      formData.append("content", newPostContent);
      if (uploadedDisplayImages.length && uploadedImages.length) {
        uploadedImages.forEach((image) => {
          formData.append("image", image, image.name);
        });
      }
      const data = await axios.put(
        `${BASE_URL}/post/${selectedPost?._id}`,
        formData,
        {
          headers: {
            "X-Authorization": accessToken,
          },
        }
      );
      console.log(data.data);
      getAllPosts();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitNewPost = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    try {
      if (newPostContent === "") {
        return;
      } else {
        // const newPostData = {
        //   content: newPostContent,
        //   image: [],
        // };
        const formData = new FormData();
        formData.append("content", newPostContent);
        if (uploadedDisplayImages.length) {
          uploadedImages.forEach((image) => {
            formData.append("image", image, image.name);
          });
        }
        console.log(formData.getAll("image"));
        /*
          {
            content: '',
            image: []
          }
        */

        const data = await axios.post(`${BASE_URL}/posts`, formData, {
          headers: {
            "X-Authorization": accessToken,
          },
        });
        console.log(data.data);
        handleClose();
        getAllPosts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    console.log(files);
    if (files.length > 2) {
      alert("You can only upload a maximum of 2 files.");
      // Clear the file input
      event.target.value = "";
    }
    const imageUrls = Array.from(files).map((image) => {
      const imageUrl = URL.createObjectURL(image);
      return imageUrl;
    });
    setUploadedDisplayImages(imageUrls);
    const filesArray = Array.from(files);
    setUploadedImages(filesArray);
  };

  const removeUploadedImage = (index: number) => {
    const updatedDisplayImages = [...uploadedDisplayImages];
    const updatedUploadedImages = [...uploadedImages];
    updatedDisplayImages.splice(index, 1);
    updatedUploadedImages.splice(index, 1);
    setUploadedDisplayImages(updatedDisplayImages);
    setUploadedImages(updatedUploadedImages);
  };

  const handleEditPost = (post: TPost) => {
    setIsEditPost(true);
    setOpen(true);
    setSelectedPost(post);
    setNewPostContent(post.content);
    const imageUrls = post.image.map((url) => `${BASE_URL}/${url}`);
    setUploadedDisplayImages(imageUrls);
  };


  if(user.isLoading){
    return(
      <h1>loading...</h1>
    )
  }

  return (
    <div>
      <div>
        <Navigation />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.postPageContainer}>
          <div className={styles.postPage}>
            <img
              className={styles.avatarButtonBarIcon}
              src={user?.data?.userData?.avatar}
              alt=""
            />
            <div className={styles.buttonBarSize}>
              <button className={styles.buttonBar} onClick={handleOpen}>
                {user?.data?.userData?.fullname} What are you Thinking?
              </button>
            </div>
          </div>
          {allPosts.map((post) => (
            <Post
              reFreshPost={getAllPosts}
              openEditModal={() => handleEditPost(post)}
              _id={post._id}
              key={post._id}
              comment={post.comment}
              content={post.content}
              image={post.image}
              like={post.like}
              user={post.user}
              createdAt={post.createdAt}
            />
          ))}
        </div>
        <div>
          <div>
            <div className={styles.profile}>
              <img
                className={styles.userIcon}
                src={user?.data?.userData?.avatar}
                alt=""
              />
              <div className={styles.profileName}>
                <span>{user?.data?.userData?.username}</span>
                <span>{user?.data?.userData?.fullname}</span>
              </div>
            </div>
            <div className={styles.refresh}>
              <h2>Recommendation</h2>
              <div>
                <button
                  onClick={getAllRecommendations}
                  className={`${styles.refreshIcon} ${
                    isLoading ? styles.refreshIconAnimate : null
                  }`}
                >
                  <RefreshIcon />
                </button>
              </div>
            </div>
            <div className={styles.recommendationContainer}>
              {userRecommendation.map((item) => (
                <SuggestionProfile
                  _id={item._id}
                  avatar={item.avatar}
                  fullname={item.fullname}
                  username={item.username}
                  key={item._id}
                />
              ))}
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className={styles.modelCloseIcon}>
              <div>
                <Typography id="modal-modal-title" variant="h4" component="h2">
                  {isEditPost ? "Edit Post" : "Create Post"}
                  <hr />
                </Typography>
              </div>
              <div className={styles.cross}>
                <ClearIcon onClick={handleClose} />
              </div>
            </div>
            <Typography
              id="modal-modal-description"
              sx={{ mb: 30, mt: 2, ml: 5, mr: 5 }}
            >
              <input
                className={styles.postTextField}
                onChange={handlePostContent}
                value={newPostContent}
                type="text"
                placeholder={`Hi, Tikesh@22 Whats on Your Mind ?`}
              />
            </Typography>
            <div className={styles.uploadedImageCtr}>
              {uploadedDisplayImages.map((image, index) => (
                <div className={styles.uploadedImageWrapper}>
                  <button
                    onClick={() => removeUploadedImage(index)}
                    className={styles.uploadedImageRemoveBtn}
                  >
                    <ClearIcon />
                  </button>
                  <img
                    key={index}
                    src={image}
                    className={styles.uploadedImage}
                    alt=""
                  />
                </div>
              ))}
            </div>
            <div className={styles.fileIcons}>
              <PhotoCameraIcon fontSize="inherit" />
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                name=""
                id=""
              />
              <InsertPhotoIcon fontSize="inherit" />
            </div>
            <div className={styles.postButton}>
              <button
                onClick={isEditPost ? onSubmitEditPost : onSubmitNewPost}
                className={styles.postButtonIcon}
              >
                Post
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default HomePage;
