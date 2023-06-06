import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import styles from "../Navigation/Navigation.module.css";
import MessageIcon from "@mui/icons-material/Message";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Constant/Constant";
import { getAccessTokenFromCookie, removeAccessTokenCookie } from "../../Constant/helpers";
import BasicPopover from "./PopOverNotification";
import { useSelector } from "react-redux";
import { TStore } from "../../Store/store";

export type TNotification = {
  text: string;
  user: any;
  isRead: boolean;
};

const Navigation = () => {
  const user: any = useSelector<TStore>((state) => state.loggedInUserDetails);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [allNotifications, setAllNotifications] = useState<TNotification[]>([]);
  const userId = user?.data?.userData?._id;

  const getAllNotifications = async () => {
    const accessToken = getAccessTokenFromCookie();
    try {
      const notifications = await axios.get(`${BASE_URL}/notifications`, {
        headers: {
          "X-Authorization": accessToken,
        },
      });
      setAllNotifications(notifications.data.notification);
      console.log(notifications);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllNotification = async () => {
    const accessToken = getAccessTokenFromCookie();
    try {
      const notifications = await axios.delete(
        `${BASE_URL}/deleteAllNotification`,
        {
          headers: {
            "X-Authorization": accessToken,
          },
        }
      );
      setAllNotifications([]);
      console.log(notifications.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogOut = () => {
    removeAccessTokenCookie()
    handleClose();
  }

  return (
    <div className={styles.navContainer}>
      <div className={styles.navbar}>
        <div>
          <h1 className={styles.title}>
            <Link className={styles.mernyLogo} to={"/"}>
              MERNY
            </Link>
          </h1>
        </div>
        <div>
          <input
            className={styles.searchBar}
            type="text"
            placeholder="Enter The Search"
          />
        </div>
        <div className={styles.iconsContainer}>
          <button className={styles.icons}>
            <Link className={styles.link} to={"/"}>
              <HomeIcon className={styles.homeButton} />
            </Link>
          </button>
          <button className={styles.icons}>
            <MessageIcon />
          </button>
          <BasicPopover
            notification={allNotifications}
            deleteAllNotification={deleteAllNotification}
          />
          <button className={styles.icons} onClick={handleClick}>
            <AccountCircleSharpIcon />
          </button>
        </div>
      </div>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <Link to={"/MyProfile"}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Link>
        <Link to={"/login"}>
          <MenuItem onClick={onLogOut}>Logout</MenuItem>
        </Link>
      </Menu>
    </div>
  );
};

export default Navigation;
