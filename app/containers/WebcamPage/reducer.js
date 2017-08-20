/*
 *
 * WebcamPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  QUERY_CLASSROOM,
  QUERY_CLASSROOM_SUCCESS,
  QUERY_CLASSROOM_ERROR,
} from './constants';

const initialState = fromJS({
  classroom: false,
});

function webcamPageReducer(state = initialState, action) {
  switch (action.type) {
    case QUERY_CLASSROOM:
      return state
        .set('loadingClassroom', true)
        .set('classroom', false);
    case QUERY_CLASSROOM_SUCCESS:
      return state
        .set('loadingClassroom', false)
        .set('classroom', action.classroom);
    case QUERY_CLASSROOM_ERROR:
      return state
        .set('loadingClassroom', false);
    default:
      return state;
  }
}

export default webcamPageReducer;
