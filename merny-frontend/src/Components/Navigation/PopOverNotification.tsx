import * as React from "react";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import NotificationsIcon from "@mui/icons-material/Notifications";
import styles from "./Navigation.module.css";
import { useSelector } from "react-redux";
import { TStore } from "../../Store/store";
import { TNotification } from "./Navigation";

type PopOverNotificationProps = {
  notification: TNotification[];
  deleteAllNotification: () => void;
};

const PopOverNotification: React.FC<PopOverNotificationProps> = (props) => {
  const user: any = useSelector<TStore>((state) => state.loggedInUserDetails);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const onDeleteNotification = () => {
    props.deleteAllNotification();
    handleClose();
  }
  return (
    <>
      <button
        aria-describedby={id}
        className={styles.notiButtonColor}
        onClick={handleClick}
      >
        <NotificationsIcon className={styles.notiButtonSize} />
      </button>
      <Popover
        className={styles.notiContent}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ul className={styles.notiTitleContent}>
          <div className={styles.notificationBar}>
            <h1 className={styles.notiTitle}>Notification</h1>
            <NotificationsIcon className={styles.notificationIconOnBar} />
          </div>
          <div>
            <hr />
          </div>
          <div>
            {props.notification &&
              props.notification?.map((item) => (
                <li className={styles.eachNotification}>
                  <li className={styles.notiUserAvatar}>
                    <img src={user?.data?.userData?.avatar} alt="" />
                  </li>
                  {item.text}
                </li>
              ))}
          </div>
          <hr />
          <div className={styles.clearNotiButton}>
            <button
              className={styles.deleteAllButton}
              onClick={onDeleteNotification}
            >
              Delete All
            </button>
          </div>
        </ul>
      </Popover>
    </>
  );
};

export default PopOverNotification;
