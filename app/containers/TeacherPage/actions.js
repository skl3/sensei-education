/*
 *
 * TeacherPage actions
 *
 */

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

export function updateClassroom(id, classroom) {
  return {
    type: UPDATE_CLASSROOM,
    id,
    classroom,
  };
}

export function classroomUpdated(updatedClassroom) {
  return {
    type: UPDATE_CLASSROOM_SUCCESS,
    updatedClassroom,
  };
}

export function updateClassroomError(error) {
  return {
    type: UPDATE_CLASSROOM_ERROR,
    error,
  };
}

export function queryClassroom(id) {
  return {
    type: QUERY_CLASSROOM,
    id,
  };
}

export function classroomQueried(classroom) {
  return {
    type: QUERY_CLASSROOM_SUCCESS,
    classroom,
  };
}

export function queryClassroomError(error) {
  return {
    type: QUERY_CLASSROOM_ERROR,
    error,
  };
}

export function querySession(id) {
  return {
    type: QUERY_SESSION,
    id,
  };
}

export function sessionQueried(session) {
  return {
    type: QUERY_SESSION_SUCCESS,
    session,
  };
}

export function querySessionError(error) {
  return {
    type: QUERY_SESSION_ERROR,
    error,
  };
}
