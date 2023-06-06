import { combineReducers } from 'redux';
import User from './UserReducer/UserReducer';
import loggedInUserDetails from './UserDetailsReducer/UserDetailsReducer';

const reducer = combineReducers({
    User,
    loggedInUserDetails,
});

export default reducer;