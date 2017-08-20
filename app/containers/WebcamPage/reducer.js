/*
 *
 * WebcamPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  // RECORD_VIDEO_IMAGE,
  // RECORD_VIDEO_IMAGE_SUCCESS,
  // RECORD_VIDEO_IMAGE_ERROR,
} from './constants';

const initialState = fromJS({

});

function webcamPageReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default webcamPageReducer;
