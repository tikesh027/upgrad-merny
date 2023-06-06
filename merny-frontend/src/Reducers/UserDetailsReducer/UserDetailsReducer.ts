import { cloneDeep } from 'lodash';
import { USER_DETAILS_TYPES } from "../../Actions/UserDetailsAction/UserDetailsActionTypes";
import { TACTION } from "../../Store/storeTypes";

const initalState = {
    data: null,
    isLoading: true,
    error: null
}

function loggedInUserDetails(state = initalState, action: TACTION){
    const clonedState = cloneDeep(state);
    switch(action.type){
        case USER_DETAILS_TYPES.FETCH_USER_DETAILS: {
            clonedState.isLoading = true;
            clonedState.error = null;
            return clonedState;
        }
        case USER_DETAILS_TYPES.FETCH_USER_DETAILS_SUCCESS: {
            const { data } = action.payload;
            clonedState.isLoading = false;
            clonedState.error = null;
            clonedState.data = data;
            return clonedState;
        }
        case USER_DETAILS_TYPES.FETCH_USER_DETAILS_FAILED: {
            const { error } = action.payload;
            clonedState.isLoading = false;
            clonedState.error = error;
            return clonedState;
        }
        default: {
            return state;
        }
    }
}

export default loggedInUserDetails;