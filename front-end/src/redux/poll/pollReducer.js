import {
  GET_ACTIVE_POLLS,
  GET_ACTIVE_POLLS_TITLES,
  DATA_FETCH_FAILURE,
  ADD_POLLS_SUCCESS,
  ADD_POLLS_FAILURE,
  CHECK_IS_ADMIN_SUCCESS,
  CHECK_IS_ADMIN_FAILURE,
} from "../constants";

const initialState = {
  activePolls: [],
  activePollTitles: [],
  dataFetchError: { error: false, payload: null },
  isAdmin: false,
  add_polls_response:{},
};

export const pollReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACTIVE_POLLS:
      return {
        ...state,
        activePolls: action.payload,
      };
    case GET_ACTIVE_POLLS_TITLES:
      return {
        ...state,
        activePollTitles: action.payload,
      };
    case DATA_FETCH_FAILURE:
      return {
        ...state,
        dataFetchError: {
          error: true,
          payload: action.payload,
        },
      };

    case CHECK_IS_ADMIN_SUCCESS:
      return {
        ...state,
        isAdmin: action.payload,
      };
    case CHECK_IS_ADMIN_FAILURE:
      return {
        ...state,
        isAdmin: false,
        dataFetchError: {
          error: true,
          payload: action.payload,
        },
      };

    case ADD_POLLS_SUCCESS:
      return {
        ...state,
        add_polls_response: action.payload,
      };

    case ADD_POLLS_FAILURE:
      return {
        ...state,
        dataFetchError: {
          error: true,
          payload: action.payload,
        },
      };
    default:
      return state;
  }
};
