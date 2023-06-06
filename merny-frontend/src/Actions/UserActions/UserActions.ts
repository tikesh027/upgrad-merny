import axios from "axios";
import Cookies from 'universal-cookie';
import { USER_ACTION_TYPES } from "./UserActionTypes";
import { TACTION } from "../../Store/storeTypes";
import { BASE_URL } from "../../Constant/Constant";

const cookies = new Cookies();

function signupStart(): TACTION {
  return {
    type: USER_ACTION_TYPES.SIGN_UP_START,
  };
}

function signupSuccess(data: any): TACTION {
  return {
    type: USER_ACTION_TYPES.SIGN_UP_SUCCESS,
    payload: {
      data: data,
    },
  };
}

function signupFailed(error: any): TACTION {
  return {
    type: USER_ACTION_TYPES.SIGN_UP_FAILED,
    payload: {
      error,
    },
  };
}

export function signup(
  email: string,
  userName: string,
  fullName: string,
  password: string,
  gender: string
) {
  return (dispatch: any, getState: any) =>
    new Promise((resolve, rejects) => {
      dispatch(signupStart());
      const data = {
        fullname: fullName,
        email: email,
        username: userName,
        gender: gender,
        password: password,
      };
      axios
        .post(`${BASE_URL}/register`, data)
        .then((response) => {
          dispatch(signupSuccess(response.data));
          resolve(response.data);
        })
        .catch((error) => {
          const errorData = error.response.data;
          dispatch(signupFailed(errorData));
          rejects(errorData);
        });
    });
}

function loginStart(): TACTION{
  return {
    type: USER_ACTION_TYPES.LOGIN_START
  }
}

function loginSuccess(data: any): TACTION{
  return {
    type: USER_ACTION_TYPES.LOGIN_SUCCESS,
    payload: {
      data
    }
  }
}

function loginFailed(error: any): TACTION{
  return {
    type: USER_ACTION_TYPES.LOGIN_FAILED,
    payload: {
      error
    }
  }
}

export function login(email: string, password: string) {
  return (dispatch: any, getState: any) =>
    new Promise((resolve, reject) => {
      dispatch(loginStart());
      const data = {
        email: email,
        password: password,
      };
      axios
        .post(`${BASE_URL}/login`, data)
        .then((response) => {
          dispatch(loginSuccess(response.data));
          const accessToken = response.data?.access_token;
          cookies.set('user-access-token', accessToken);
          resolve(response.data);
        })
        .catch((error) => {
          const errorData = error.response.data;
          dispatch(loginFailed(errorData));
          reject(errorData);
        });
    });
}

