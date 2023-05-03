import {
  GET_ACTIVE_POLLS,
  GET_ACTIVE_POLLS_TITLES,
  DATA_FETCH_FAILURE,
  ADD_POLLS_SUCCESS,
  ADD_POLLS_FAILURE,
  CHECK_IS_ADMIN_SUCCESS,
  CHECK_IS_ADMIN_FAILURE,
} from "../constants";
import axios from "../../axios";

export const getActivePolls = () => (dispatch) => {
  try {
    axios
      .get(`/poll/active`)
      .then((response) => {
        const activePolls = response.data;

        console.log("I did run in action");
        const pollTitles = [];

        for (const pollId in activePolls.polls) {
          if (activePolls.polls.hasOwnProperty(pollId)) {
            const poll = activePolls.polls[pollId];
            pollTitles.push(poll.title);
          }
        }
        console.log(pollTitles);

        dispatch({
          type: GET_ACTIVE_POLLS_TITLES,
          payload: pollTitles,
        });

        dispatch({
          type: GET_ACTIVE_POLLS,
          payload: activePolls,
        });
      })
      .catch((err) => {
        dispatch({
          type: DATA_FETCH_FAILURE,
          payload: err.response.data,
        });
      });
  } catch (error) {
    console.log(error);
  }
};

export const checkIsAdmin = () =>{
  return (dispatch) =>{
    axios.get("/isAdmin").then (response =>{
      const isAdmin = response.data.isAdmin;
      dispatch({
        type: CHECK_IS_ADMIN_SUCCESS,
        payload: isAdmin
      })
    }).catch(err =>{
      dispatch({
        type: CHECK_IS_ADMIN_FAILURE,
        payload: err.response.data,
      });
    })
  }
}

export const addPoll = (pollData) => (dispatch) => {
  console.log("runing in add poll:", pollData);
  axios
    .post("/poll/add", pollData)
    .then((res) => {
      const resp = res.data;

      dispatch({
        type: ADD_POLLS_SUCCESS,
        payload: {
          add_polls_response: resp,
        },
      });
    })
    .catch((err) => {
      dispatch({
        type: ADD_POLLS_FAILURE,
        payload: { add_polls_response: err.response.data },
      });
    });
};