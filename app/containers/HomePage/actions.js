/*
 *
 * Home actions
 *
 */

import {
  GENERATE_CLASSROOM,
  GENERATE_CLASSROOM_SUCCESS,
  GENERATE_CLASSROOM_ERROR,
  SEARCH_CLASSROOM,
  SEARCH_CLASSROOM_SUCCESS,
  SEARCH_CLASSROOM_ERROR,
} from './constants';

export function generateClassroom() {
  return {
    type: GENERATE_CLASSROOM,
  };
}

export function classroomGenerated(classroom) {
  return {
    type: GENERATE_CLASSROOM_SUCCESS,
    classroom,
  };
}

export function generateClassroomError(error) {
  return {
    type: GENERATE_CLASSROOM_ERROR,
    error,
  };
}

export function searchClassroom(code) {
  return {
    type: SEARCH_CLASSROOM,
    code,
  };
}

export function classroomSearched(classroom) {
  return {
    type: SEARCH_CLASSROOM_SUCCESS,
    classroom,
  };
}

export function searchClassroomError(error) {
  return {
    type: SEARCH_CLASSROOM_ERROR,
    error,
  };
}
