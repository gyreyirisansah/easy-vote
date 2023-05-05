import {
  CAST_VOTE_SUCCESS,
  CAST_VOTE_FAILURE,
  VOTE_COUNT_SUCCESS,
  VOTE_COUNT_FAILURE,
} from "../constants";
import axios from "../../axios";

export const castVote = (voteData) => (dispatch) => {
  console.log("runing in cast vote:", voteData);
  axios
    .post("/vote/cast", voteData)
    .then((res) => {
      const resp = res.data;

      dispatch({
        type: CAST_VOTE_SUCCESS,
        payload: {
          vote_response: resp,
        },
      });
    })
    .catch((err) => {
      dispatch({
        type: CAST_VOTE_FAILURE,
        payload: { vote_response: err.response.data },
      });
    });
};

export const getVoteCount = () => {
  return (dispatch) => {
    axios
      .get(`/vote/result`)
      .then((response) => {
        const voteResult = response.data;
        console.log(voteResult)
        dispatch({
          type: VOTE_COUNT_SUCCESS,
          payload: voteResult,
        });

       
      })
      .catch((err) => {
        dispatch({
          type: VOTE_COUNT_FAILURE,
          payload: err.response.data,
        });
      });
  };
};
