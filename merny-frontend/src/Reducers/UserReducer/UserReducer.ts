import { cloneDeep } from "lodash";
import { USER_ACTION_TYPES } from "../../Actions/UserActions/UserActionTypes";
import { TACTION } from "../../Store/storeTypes";

const initalState = {
  signup: {
    isLoading: false,
    data: null,
    error: null,
  },
  login: {
    isLoading: false,
    data: null,
    error: null,
  },
};

function user(state = initalState, action: TACTION) {
  const clonedState = cloneDeep(state);
  switch (action.type) {
    case USER_ACTION_TYPES.SIGN_UP_START: {
      clonedState.signup.isLoading = true;
      clonedState.signup.error = null;
      clonedState.signup.data = null;
      return clonedState;
    }
    case USER_ACTION_TYPES.SIGN_UP_SUCCESS: {
      const { data } = action.payload;
      clonedState.signup.isLoading = false;
      clonedState.signup.data = data;
      clonedState.signup.error = null;
      return clonedState;
    }
    case USER_ACTION_TYPES.SIGN_UP_FAILED: {
      const { error } = action.payload;
      clonedState.signup.data = null;
      clonedState.signup.error = error;
      clonedState.signup.isLoading = false;
      return clonedState;
    }
    case USER_ACTION_TYPES.LOGIN_START: {
      clonedState.login.isLoading = true;
      clonedState.login.error = null;
      clonedState.login.data = null;
      return clonedState;
    }
    case USER_ACTION_TYPES.LOGIN_SUCCESS: {
      const { data } = action.payload;
      clonedState.login.data = data;
      clonedState.login.error = null;
      clonedState.login.isLoading = false;
      return clonedState;
    }
    case USER_ACTION_TYPES.LOGIN_FAILED: {
      const { error } = action.payload;
      clonedState.login.error = error;
      clonedState.login.data = null;
      clonedState.login.isLoading = false;
      return clonedState;
    }
    default: {
      return state;
    }
  }
}
 

export default user;
