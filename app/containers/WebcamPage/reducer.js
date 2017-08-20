/*
 *
 * WebcamPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_SESSION,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_ERROR,
  QUERY_CLASSROOM,
  QUERY_CLASSROOM_SUCCESS,
  QUERY_CLASSROOM_ERROR,
  RECORD_VIDEO_IMAGE,
  RECORD_VIDEO_IMAGE_SUCCESS,
  RECORD_VIDEO_IMAGE_ERROR,
} from './constants';

const initialState = fromJS({
  classroom: false,
  emotions: false,
  session: false,
});

function webcamPageReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_SESSION:
      return state;
    case CREATE_SESSION_SUCCESS:
      return state
        .set('session', action.session);
    case CREATE_SESSION_ERROR:
      return state;
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
    case RECORD_VIDEO_IMAGE:
      return state;
    case RECORD_VIDEO_IMAGE_SUCCESS:
      return state
        .set('emotions', state.get('emotions') ? [...state.get('emotions'), action.emotion] : null );
    case RECORD_VIDEO_IMAGE_ERROR:
      return state;
    default:
      return state;
  }
}

export default webcamPageReducer;
