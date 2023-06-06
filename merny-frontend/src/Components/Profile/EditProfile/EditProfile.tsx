import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./EditProfile.module.css";
import InputWithLabel from "../../CommonComponents/InputWithLabel/InputWithLabel";
import { TStore } from "../../../Store/store";
import { getAccessTokenFromCookie } from "../../../Constant/helpers";
import { BASE_URL } from "../../../Constant/Constant";



type updateForm = {
  value: string;
  error: string;
  isValid: boolean;
};

const EditProfile: React.FC = () => {
  const user: any = useSelector<TStore>((state) => state.loggedInUserDetails);
  const userData = user?.data?.userData;

  const [fullName, setFullName] = useState<updateForm>({
    value: "",
    error: "",
    isValid: true,
  });
  const [avatar, setAvatar] = useState<updateForm>({
    value: "",
    error: "",
    isValid: true,
  });
  const [mobileNo, setMobileNo] = useState<updateForm>({
    value: "",
    error: "",
    isValid: true,
  });
  const [address, setAddress] = useState<updateForm>({
    value: "",
    error: "",
    isValid: true,
  });
  const [story, setStory] = useState<updateForm>({
    value: "",
    error: "",
    isValid: true,
  });
  const [website, setWebsite] = useState<updateForm>({
    value: "",
    error: "",
    isValid: true,
  });
  const [gender, setGender] = useState<updateForm>({
    value: "",
    error: "",
    isValid: true,
  });

  useEffect(()=>{
    if(userData){
      setFullName((prev) => ({
        ...prev,
        value: userData.fullname
      }));
      setAvatar((prev) => ({
        ...prev,
        value: userData.avatar
      }));
      setMobileNo((prev) => ({
        ...prev,
        value: userData.mobile
      }));
      setAddress((prev) => ({
        ...prev,
        value: userData.address
      }));
      setWebsite((prev) => ({
        ...prev,
        value: userData.website
      }));
      setGender((prev) => ({
        ...prev,
        value: userData.gender
      }));
    }
  },[userData]);

  const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };
  const handleMobileNo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMobileNo({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };
  const handleAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };
  const handleStory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStory({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };
  const handleWebsite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };
  const handlegender = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };
  const handleFullName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullName({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };

  const userValidator = () => {
    let validatorFlag = true;

    if (fullName.value === "") {
      setFullName({
        ...fullName,
        isValid: false,
        error: "please fill the username",
      });
      validatorFlag = false;
    }

    if (avatar.value === "") {
      setAvatar({
        ...avatar,
        isValid: false,
        error: "please set an avatar",
      });
      validatorFlag = false;
    }
    if (address.value === "") {
      setAddress({
        ...address,
        isValid: false,
        error: "please fill the Address",
      });
      validatorFlag = false;
    }
    if (website.value === "") {
      setWebsite({
        ...website,
        isValid: false,
        error: "please fill the website",
      });
      validatorFlag = false;
    }
    if (gender.value === "") {
      setGender({
        ...gender,
        isValid: false,
        error: "please Choose Your gender",
      });
      validatorFlag = false;
    }
    if (mobileNo.value === "") {
      setMobileNo({
        ...mobileNo,
        isValid: false,
        error: "please fill Your Mobile-Number",
      });
      validatorFlag = false;
    }
    return validatorFlag;
  };

  const editUserProfile = async () => {
    if (!userValidator()) return;
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) return;
    const userData = {
      avatar: avatar.value,
      fullname: fullName.value,
      mobile: mobileNo.value,
      address: address.value,
      story: story.value,
      website: website.value,
      gender: gender.value,
    };
    try {
      const data = await axios.put(`${BASE_URL}/user`, userData,{
        headers: {
          "X-Authorization": accessToken,
        },
      });
      console.log(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  if(user.isLoading){
    return(
      <h1>loading...</h1>
    )
  }

  return (
    <div >
      <div className={styles.iconContainer}>
        <img className={styles.icon} src={userData.avatar} alt=""/>
      </div>
      <div className={styles.editProfileContainer}>
        <InputWithLabel
          inputType="text"
          label="FullName"
          value={fullName.value}
          onChange={handleFullName}
        />
        <InputWithLabel
          inputType="text"
          label="Address"
          value={address.value}
          onChange={handleAddress}
        />
        <InputWithLabel
          inputType="text"
          label="Mobile no"
          value={mobileNo.value}
          onChange={handleMobileNo}
        />
        <InputWithLabel
          inputType="text"
          label="Avatar"
          value={avatar.value}
          onChange={handleAvatar}
        />
        <InputWithLabel
          inputType="text"
          label="Website"
          value={website.value}
          onChange={handleWebsite}
        />
        <InputWithLabel
          inputType="text"
          label="Gender"
          value={gender.value}
          onChange={handlegender}
        />
      </div>
      <div>
        <button className={styles.submitButton} onClick={editUserProfile}>Save</button>
      </div>
    </div>
  );
};

export default EditProfile;
