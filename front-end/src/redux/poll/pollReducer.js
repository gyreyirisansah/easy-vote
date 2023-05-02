import { GET_ACTIVE_POLLS,GET_ACTIVE_POLLS_TITLES,DATA_FETCH_FAILURE } from '../constants';

const initialState = {
  activePolls: [],
  activePollTitles:[],
  dataFetchError:null
};

export const pollReducer = (state=initialState, action) => {
    switch (action.type){
        case GET_ACTIVE_POLLS:
            return {
                ...state,
                activePolls:action.payload
            }
        case GET_ACTIVE_POLLS_TITLES:
            return {
                ...state,
                activePollTitles: action.payload
            }
        case DATA_FETCH_FAILURE:
            return {
                ...state,
                dataFetchError:{
                    error:true,
                    payload:action.payload
                }
            }
        default:
            return state
    }
}

