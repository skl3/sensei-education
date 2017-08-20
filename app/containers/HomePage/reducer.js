/*
 *
 * Home reducer
 *
 */

import { fromJS } from 'immutable';
import {
  GENERATE_CLASSROOM,
  GENERATE_CLASSROOM_SUCCESS,
  GENERATE_CLASSROOM_ERROR,
  SEARCH_CLASSROOM,
  SEARCH_CLASSROOM_SUCCESS,
  SEARCH_CLASSROOM_ERROR,
} from './constants';

const initialState = fromJS({});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case GENERATE_CLASSROOM:
      return state
        .set('generating', true);
    case GENERATE_CLASSROOM_SUCCESS:
      return state
        .set('generating', false);
    case GENERATE_CLASSROOM_ERROR:
      return state
        .set('generating', false);
    case SEARCH_CLASSROOM:
      return state
        .set('searching', true);
    case SEARCH_CLASSROOM_SUCCESS:
      return state
        .set('searching', false);
    case SEARCH_CLASSROOM_ERROR:
      return state
        .set('searching', false);
    default:
      return state;
  }
}

export default homeReducer;
