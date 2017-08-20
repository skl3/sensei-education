/*
 *
 * WebcamPage actions
 *
 */

import {
  QUERY_CLASSROOM,
  QUERY_CLASSROOM_SUCCESS,
  QUERY_CLASSROOM_ERROR,
  RECORD_VIDEO_IMAGE,
  RECORD_VIDEO_IMAGE_SUCCESS,
  RECORD_VIDEO_IMAGE_ERROR,
} from './constants';

export function queryClassroom(classCode) {
  return {
    type: QUERY_CLASSROOM,
    classCode,
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

export function recordVideoImage(code, data) {
  return {
    type: RECORD_VIDEO_IMAGE,
    code,
    data,
  };
}

export function videoImageRecorded() {
	return {
		type: RECORD_VIDEO_IMAGE_SUCCESS,
	};
}

export function recordVideoImageError(error) {
	return {
		type: RECORD_VIDEO_IMAGE_ERROR,
		error,
	};
}
