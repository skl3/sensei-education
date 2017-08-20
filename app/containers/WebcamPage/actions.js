/*
 *
 * WebcamPage actions
 *
 */

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

// TODO: redo with server generated sessionId
export function createSession(classCode, sessionId) {
  return {
    type: CREATE_SESSION,
    classCode,
    sessionId,
  };
}

export function sessionCreated(session) {
  return {
    type: CREATE_SESSION_SUCCESS,
    session,
  };
}

export function createSessionError(err) {
  return {
    type: CREATE_SESSION_ERROR,
    err,
  };
}

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

export function videoImageRecorded(emotion) {
	return {
		type: RECORD_VIDEO_IMAGE_SUCCESS,
    emotion,
	};
}

export function recordVideoImageError(error) {
	return {
		type: RECORD_VIDEO_IMAGE_ERROR,
		error,
	};
}
