import { takeLatest } from 'redux-saga';
import { take, call, put, fork, select, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { CREATE_SESSION, QUERY_CLASSROOM, RECORD_VIDEO_IMAGE } from './constants';
import {
  sessionCreated, createSessionError,
  classroomQueried, queryClassroomError,
  videoImageRecorded, recordVideoImageError,
} from './actions';
import request from 'utils/request';


export function* createSession(action) {
  try {
    const { classCode, sessionId } = action;
    const session = yield call(request, '/api/classrooms/' + classCode + '/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    yield put(sessionCreated(session));
  } catch (err) {
    console.error('err', err);
    yield put(createSessionError(err));
  }
}

export function* fetchClassroom(action) {
  try {
    const { classCode } = action;
    const response = yield call(request, '/api/classrooms/' + classCode + '/code');
    yield put(classroomQueried(response));
  } catch (err) {
    yield put(queryClassroomError(err));
  }
}

export function* recordVideoImage(action) {
  try {
  	const { code, data } = action;
    console.log({ code, data });
    const emotion = yield call(request, '/api/classrooms/' + code + '/images', {
    	method: 'POST',
    	headers: { 'Content-Type': 'application/json' },
    	body: JSON.stringify(data),
    });
    console.log('emotion', emotion);
    yield put(videoDataRecorded(emotion));
  } catch (err) {
    yield put(recordVideoImageError(err));
  }
}

export function* getWebcamWatcher() {
  yield fork(takeLatest, CREATE_SESSION, createSession);
  yield fork(takeLatest, RECORD_VIDEO_IMAGE, recordVideoImage);
  yield fork(takeLatest, QUERY_CLASSROOM, fetchClassroom);
}

export function* webcamSaga() {
  const getWatcher = yield fork(getWebcamWatcher);
  yield take(LOCATION_CHANGE);
  yield cancel(getWatcher);
}

export default [
  webcamSaga,
];
