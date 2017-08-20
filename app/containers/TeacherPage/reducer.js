/*
 *
 * TeacherPage reducer
 *
 */

import _ from 'lodash';
import { fromJS } from 'immutable';
import {
  UPDATE_CLASSROOM,
  UPDATE_CLASSROOM_SUCCESS,
  UPDATE_CLASSROOM_ERROR,
  QUERY_CLASSROOM,
  QUERY_CLASSROOM_SUCCESS,
  QUERY_CLASSROOM_ERROR,
  QUERY_SESSION,
  QUERY_SESSION_SUCCESS,
  QUERY_SESSION_ERROR,
} from './constants';

const initialState = fromJS({
  loadingClassroom: true,
  loadingSession: true,
  classroom: false,
  sessions: false,
});

function teacherPageReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CLASSROOM:
      return state
        .set('updatingClassroom', true);
    case UPDATE_CLASSROOM_SUCCESS:
      return state
        .set('updatingClassroom', false)
        .set('classroom', action.classroom);
    case UPDATE_CLASSROOM_ERROR:
      return state
        .set('updatingClassroom', false);
    case QUERY_CLASSROOM:
      return state
        .set('loadingClassroom', true)
        .set('classroom', null)
        .set('sessions', null);
    case QUERY_CLASSROOM_SUCCESS:
      return state
        .set('loadingClassroom', false)
        .set('classroom', action.classroom)
        .set('sessions', _.keyBy(action.classroom.sessions, session => session.id));
    case QUERY_CLASSROOM_ERROR:
      return state
        .set('loadingClassroom', false);
    case QUERY_SESSION:
      return state
        .set('loadingSession', true);
    case QUERY_SESSION_SUCCESS:
      return state
        .set('loadingSession', false)
        .set('sessions', state ? Object.assign(state.get('sessions'), { [action.session.id] : action.session }) : null);
    case QUERY_SESSION_ERROR:
      return state
        .set('loadingSession', false);
    default:
      return state;
  }
}

export default teacherPageReducer;
