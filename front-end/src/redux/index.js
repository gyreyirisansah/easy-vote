import { combineReducers } from 'redux';
import {authReducer} from './user/authReducer';
import {pollReducer} from "./poll/pollReducer"

const rootReducer = combineReducers({
  auth: authReducer,
  poll: pollReducer
});

export default rootReducer;
