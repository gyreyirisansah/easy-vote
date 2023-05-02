import { GET_ACTIVE_POLLS,GET_ACTIVE_POLLS_TITLES,DATA_FETCH_FAILURE } from "../constants";
import axios from  "../../axios"

export const getActivePolls = () =>dispatch => {

      try {
        const response =  axios.get(`/poll/active`).then((response) =>{
            const activePolls = response.data;

        console.log("I did run in action")
        const pollTitles = [];

        for (const pollId in activePolls.polls) {
            if (activePolls.polls.hasOwnProperty(pollId)) {
                const poll = activePolls.polls[pollId];
                pollTitles.push(poll.title);
            }
        }
        console.log(pollTitles)

        dispatch({
          type: GET_ACTIVE_POLLS_TITLES,
          payload: pollTitles
        });

        dispatch({
            type: GET_ACTIVE_POLLS,
            payload: activePolls
        });

        }).catch(err => {
            dispatch({
                type: DATA_FETCH_FAILURE,
                payload: err.response.data
            })
        })
        
      } catch (error) {
        console.log(error);
      }
  };


// export const getActivePolls = () => {
//     return (dispatch) => {
//         axios.get(`/poll/active`).then((response) =>{
//             const activePolls = response.data;
  
//         console.log("I did run in action")
//         const pollTitles = [];
  
//         for (const pollId in activePolls.polls) {
//             if (activePolls.polls.hasOwnProperty(pollId)) {
//                 const poll = activePolls.polls[pollId];
//                 pollTitles.push(poll.title);
//             }
//         }
//         console.log(pollTitles)
  
//         dispatch({
//           type: GET_ACTIVE_POLLS_TITLES,
//           payload: pollTitles
//         });
  
//         dispatch({
//             type: GET_ACTIVE_POLLS,
//             payload: activePolls
//         });
  
//         }).catch(err => {
//             dispatch({
//                 type: DATA_FETCH_FAILURE,
//                 payload: err.response.data
//             })
//         })
//     }
// }
