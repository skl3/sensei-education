/*
 *
 * Home reducer
 *
 */

import { fromJS } from 'immutable';
import {
  QUERY_PUBLIC_CLASSROOMS,
  QUERY_PUBLIC_CLASSROOMS_SUCCESS,
  QUERY_PUBLIC_CLASSROOMS_ERROR,
  SEARCH_CLASSROOM,
  SEARCH_CLASSROOM_SUCCESS,
  SEARCH_CLASSROOM_ERROR,
} from './constants';

const initialState = fromJS({});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case QUERY_PUBLIC_CLASSROOMS:
      return state
        .set('loadingClassrooms', true)
        .set('classrooms', false);
    case QUERY_PUBLIC_CLASSROOMS_SUCCESS:
      return state
        .set('loadingClassrooms', false)
        .set('classrooms', action.classrooms);
    case QUERY_PUBLIC_CLASSROOMS_ERROR:
      return state
        .set('loadingClassrooms', false);
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
