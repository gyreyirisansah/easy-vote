import { CAST_VOTE_SUCCESS, CAST_VOTE_FAILURE,VOTE_COUNT_SUCCESS,VOTE_COUNT_FAILURE } from "../constants";

const initialState = {
  vote_response: "",
  dataFetchError : {error:false,payload:null},
  vote_count:[]
};

export const voteReducer = (state = initialState, action) => {
  switch (action.type) {
    case CAST_VOTE_SUCCESS:
      return {
        ...state,
        vote_response: action.payload,
      };

    case CAST_VOTE_FAILURE:
      return {
        ...state,
        dataFetchError: {
            error:true,
            payload:action.payload,
        },
      };

    case VOTE_COUNT_SUCCESS:
      return {
        ...state,
        vote_count: action.payload
      };

    case VOTE_COUNT_FAILURE:
      return {
        ...state,
        dataFetchError: {
            error:true,
            payload:action.payload,
        },
      };
    default:
      return state;
  }
};
