import React, { useState } from "react";
import styles from "./SignInForm.module.css";
import InputWithLabel from "../CommonComponents/InputWithLabel/InputWithLabel";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup } from "../../Actions/UserActions/UserActions";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type formInput = {
  value: string;
  error: string;
  isValid: boolean;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SignInForm: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [fullName, setFullName] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });
  const [userName, setUserName] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });
  const [emailAddress, setEmailAddress] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });
  const [password, setPassword] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });
  const [confirmPassword, setConfirmPassword] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });
  const [gender, setGender] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });
  const [alert, setAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handelFullName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullName({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };
  const handelUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };
  const handleEmailAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddress({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };
  const handleConfirmPasssword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };
  const handleGender = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };

  const validateFrom = () => {
    let validationFlag = true;
    if (fullName.value === "") {
      setFullName({
        ...fullName,
        isValid: false,
        error: "Please Fill your FULLNAME",
      });
      validationFlag = false;
    }
    if (userName.value === "") {
      setUserName({
        ...userName,
        isValid: false,
        error: "Please fill User Name",
      });
      validationFlag = false;
    }
    if (gender.value === "") {
      setGender({
        ...gender,
        isValid: false,
        error: "Please select Gender",
      });
      validationFlag = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.value)) {
      setEmailAddress({
        ...emailAddress,
        isValid: false,
        error: "Please Fill a Valid Email Address",
      });
      validationFlag = false;
    }
    if (password.value.length < 6) {
      setPassword({
        ...password,
        isValid: false,
        error: "Password is Less than 6 Character",
      });
      validationFlag = false;
    }
    if (confirmPassword.value !== password.value) {
      setConfirmPassword({
        ...confirmPassword,
        isValid: false,
        error: "Password Does not match",
      });
      validationFlag = false;
    }
    return validationFlag;
  };

  const submitForm = () => {
    if (validateFrom()) {
      dispatch(
        signup(
          emailAddress.value,
          userName.value,
          fullName.value,
          password.value,
          gender.value
        )
      )
        .then((res: any) => {})
        .catch((err: any) => {
          console.log(err);
          setErrorMsg(err.msg);
          handleAlertOpen();
        });
    }
  };

  const handleAlertOpen = () => {
    setAlert(true);
  };

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert(false);
  };

  return (
    <div className={styles.loginForm}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>MERNY</h1>
        <div className={styles.input}>
          <InputWithLabel
            inputType="text"
            label="Full Name"
            value={fullName.value}
            onChange={handelFullName}
            errorMessage={fullName.error}
          />
          <InputWithLabel
            inputType="text"
            label="User Name"
            value={userName.value}
            onChange={handelUserName}
            errorMessage={userName.error}
          />
          <InputWithLabel
            inputType="text"
            label="Email Address"
            value={emailAddress.value}
            onChange={handleEmailAddress}
            errorMessage={emailAddress.error}
          />
          <InputWithLabel
            inputType="password"
            label="Password"
            value={password.value}
            onChange={handlePassword}
            errorMessage={password.error}
          />
          <InputWithLabel
            inputType="password"
            label="Confirm Password"
            value={confirmPassword.value}
            onChange={handleConfirmPasssword}
            errorMessage={confirmPassword.error}
          />
        </div>
        <div className={styles.genderWrapper}>
          <label className={styles.gender}>
            Male
            <input
              type="radio"
              name="radio-button"
              value="male"
              id="male"
              onChange={handleGender}
            />
          </label>
          <label className={styles.gender}>
            Female
            <input
              type="radio"
              name="radio-button"
              value="female"
              id="female"
              onChange={handleGender}
            />
          </label>
          <label className={styles.gender}>
            Others
            <input
              type="radio"
              name="radio-button"
              value="others"
              id="others"
              onChange={handleGender}
            />
          </label>
        </div>
        {gender.isValid ? null : (
          <span className={styles.error}>{gender.error}</span>
        )}
        <div>
          <button className={styles.registerButton} onClick={submitForm}>
            Register
          </button>
        </div>
        <div className={styles.account}>
          <h3>Already Have an Account?</h3>
          <Link className={styles.button} to={"/login"}>
            LogIn Now
          </Link>
        </div>
      </div>
      <Snackbar open={alert} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignInForm;
