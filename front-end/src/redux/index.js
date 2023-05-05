import { combineReducers } from 'redux';
import {authReducer} from './user/authReducer';
import {pollReducer} from "./poll/pollReducer"
import { voteReducer } from './vote/voteReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  poll: pollReducer,
  vote: voteReducer
});

export default rootReducer;
