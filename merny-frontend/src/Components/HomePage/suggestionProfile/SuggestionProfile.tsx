import React, { useState, useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "../suggestionProfile/SuggestionProfile.module.css";
import { TRecommendation } from "../HomePage";
import axios from "axios";
import { BASE_URL } from "../../../Constant/Constant";
import { useSelector } from "react-redux";
import { TStore } from "../../../Store/store";
import { getAccessTokenFromCookie } from "../../../Constant/helpers";

type SuggestionProfileProps = TRecommendation;

const SuggestionProfile: React.FC<SuggestionProfileProps> = (props) => {
  const user: any = useSelector<TStore>((state) => state.loggedInUserDetails);
  const [followUser, setFollowUser] = useState(false);
  const [followButton, setFollowButton] = useState(false);
  const userData = user?.data?.userData;
  useEffect(() => {
    if (user.data) {
      const following = user.data.userData.following;
      const id = following.find((item: string) => item === props._id);
      setFollowUser(Boolean(id));
    }
  }, [user]);

  const follow = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    setFollowButton(true);
    try {
      if (followUser === false) {
        const data = await axios.put(`${BASE_URL}/user/${props._id}/follow`, {}, {
          headers: {
            "X-Authorization": accessToken,
            'X-HTTP-Method-Override': 'PATCH'
          },
        });
        setFollowUser(true);
        const notificationData = {
          id: userData?._id,
          recipients: props._id,
          url: "",
          text: `${userData?.username} has started to follow you.`,
        };
        const notification = await axios.post(
          `${BASE_URL}/notification`,
          notificationData,
          {
            headers: {
              "X-Authorization": accessToken,
            },
          }
        );
        console.log(notification);
        
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFollowButton(false);
    }
  };

  const unFollow = async () => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    setFollowButton(true);
    try {
      const data = await axios.put(`${BASE_URL}/user/${props._id}/unfollow`,{}, {
        headers: {
          "X-Authorization": accessToken,
        },
      });
      setFollowUser(false);
      console.log(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setFollowButton(false);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.icon}>
          {/* <button className={styles.profileIcon}>
            <AccountCircleIcon fontSize="inherit"/>
          </button> */}
          <img src={props.avatar} alt={props.fullname} />
        </div>
        <img
          alt=""
          className={styles.userIcon}
          src={user?.data?.userData?.avatar}
        />
        <div className={styles.title}>
          <p className={styles.user}>{props.username}</p>
          <p className={styles.user}>{props.fullname}</p>
        </div>
        <div className={styles.follow}>
          {followUser === false ? (
            <button
              disabled={followButton}
              onClick={follow}
              className={styles.followButton}
            >
              Follow
            </button>
          ) : (
            <button
              disabled={followButton}
              onClick={unFollow}
              className={styles.followButton}
            >
              Unfollow
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestionProfile;
