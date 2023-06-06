import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import styles from './Profile.module.css'
import { useSelector } from 'react-redux';
import { TStore } from '../../../Store/store';
import { BASE_URL } from '../../../Constant/Constant';

type StandardImageListProps = {
  imageList: any;
} 

const StandardImageList: React.FC<StandardImageListProps>= (props) => {
  const user: any = useSelector<TStore>((state) => state.loggedInUserDetails);
    const userData = user?.data?.userData;
  return (
    <ImageList className={styles.imageGalleryContainer} cols={3}>
      {props.imageList.map((item: any) => (
        <ImageListItem key={item._id}>
          <img
            src={`${BASE_URL}/${item.image[0]}`}
            alt=""
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
];

export default StandardImageList;