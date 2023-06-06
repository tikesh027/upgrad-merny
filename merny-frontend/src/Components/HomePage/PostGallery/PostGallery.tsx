import React from "react";
import styles from "./PostGallery.module.css";

type PostGalleryProps = {
  img: string;
  alt: string;
};

const PostGallery: React.FC<PostGalleryProps> = (props) => {
  return (
    <div>
      <div className={styles.imageContainer}>
        <img src={props.img} alt={props.alt} />
      </div>
    </div>
  );
};

export default PostGallery;
