import React, { useState } from "react";
import InputWithLabel from "../CommonComponents/InputWithLabel/InputWithLabel";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../Actions/UserActions/UserActions";
import { fetchUserLoggedInUserDetails } from "../../Actions/UserDetailsAction/UserDetailsAction";
import styles from "./LogInForm.module.css";

type signUpInput = {
  value: string;
  isValid: boolean;
  errorMessage: string;
};

const LogInForm: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState<signUpInput>({
    value: "",
    isValid: true,
    errorMessage: "",
  });
  const [password, setPassword] = useState<signUpInput>({
    value: "",
    isValid: true,
    errorMessage: "",
  });

  const handleEmailAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddress({
      value: event.target.value,
      isValid: true,
      errorMessage: "",
    });
  };
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({
      value: event.target.value,
      isValid: true,
      errorMessage: "",
    });
  };

  const validateFrom = () => {
    let validationFlag = true;
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.value) ||
      emailAddress.value === ""
    ) {
      setEmailAddress({
        ...emailAddress,
        isValid: false,
        errorMessage: "Please Fill a Valid Email Address",
      });
      validationFlag = false;
    }
    if (password.value.length < 6) {
      setPassword({
        ...password,
        isValid: false,
        errorMessage: "Password is Less than 6 Character",
      });
      validationFlag = false;
    }
    return validationFlag;
  };
  const submitForm = () => {
    if (validateFrom()) {
      dispatch(login(emailAddress.value, password.value))
        .then((res: any) => {
          dispatch(fetchUserLoggedInUserDetails()).then(() => {
            navigate("/");
            console.log("here", res);
          });
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  return (
    <div className={styles.SignUpForm}>
      <div className={styles.formContainer}>
        <div>
          <h1 className={styles.title}>MERNY</h1>
        </div>
        <InputWithLabel
          inputType="text"
          label="Email Address"
          value={emailAddress.value}
          onChange={handleEmailAddress}
          errorMessage={emailAddress.errorMessage}
        />
        <InputWithLabel
          inputType="text"
          label="Password"
          value={password.value}
          onChange={handlePassword}
          errorMessage={password.errorMessage}
        />
        <div>
          <button className={styles.loginButton} onClick={submitForm}>
            LogIn
          </button>
        </div>
        <div className={styles.account}>
          <p>Don't have an account?</p>
          <Link className={styles.button} to={"/signup"}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
