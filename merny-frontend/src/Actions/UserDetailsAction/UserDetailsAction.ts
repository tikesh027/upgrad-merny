import axios from "axios";
import { BASE_URL } from "../../Constant/Constant";
import { TACTION } from "../../Store/storeTypes";
import { USER_DETAILS_TYPES } from "./UserDetailsActionTypes";
import Cookies from "universal-cookie";
import { getAccessTokenFromCookie } from "../../Constant/helpers";

const cookies = new Cookies();

function fetchUserDetails(): TACTION {
  return {
    type: USER_DETAILS_TYPES.FETCH_USER_DETAILS,
  };
}

function fetchUserDetailsSuccess(data: any): TACTION {
  return {
    type: USER_DETAILS_TYPES.FETCH_USER_DETAILS_SUCCESS,
    payload: {
      data,
    },
  };
}

function fetchUserDetailsFailed(error: any): TACTION {
  return {
    type: USER_DETAILS_TYPES.FETCH_USER_DETAILS_SUCCESS,
    payload: {
      error,
    },
  };
}

export function fetchUserLoggedInUserDetails() {
  return (dispatch: any, getState: any) =>
    new Promise((resolve, reject) => {
      dispatch(fetchUserDetails());
      const accessToken = getAccessTokenFromCookie();
      axios
        .get(`${BASE_URL}/loggedInUser`, {
          headers: {
            "X-Authorization": accessToken,
          },
        })
        .then((response) => {
          dispatch(fetchUserDetailsSuccess(response.data));
          resolve(response.data);
        })
        .catch((error) => {
          dispatch(fetchUserDetailsFailed(error));
          // reject(error);
        });
    });
}
