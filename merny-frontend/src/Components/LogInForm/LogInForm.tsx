import React, { useState } from "react";
import InputWithLabel from "../CommonComponents/InputWithLabel/InputWithLabel";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../Actions/UserActions/UserActions";
import { fetchUserLoggedInUserDetails } from "../../Actions/UserDetailsAction/UserDetailsAction";
import styles from "./LogInForm.module.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type signUpInput = {
  value: string;
  isValid: boolean;
  errorMessage: string;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  const [alert, setAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
          navigate("/");
          dispatch(fetchUserLoggedInUserDetails()).then(() => {
            console.log("here", res);
          });
        })
        .catch((error: any) => {
          setErrorMsg(error.msg);
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
    <>
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
            inputType="password"
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
            <Link className={styles.registerLink} to={"/signup"}>
              Register Now
            </Link>
          </div>
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
    </>
  );
};

export default LogInForm;
