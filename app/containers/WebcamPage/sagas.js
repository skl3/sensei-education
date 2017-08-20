import { takeLatest } from 'redux-saga';
import { take, call, put, fork, select, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { RECORD_VIDEO_IMAGE } from './constants';
import { videoImageRecorded, recordVideoImageError } from './actions';
import request from 'utils/request';

export function* recordVideoImage(action) {
  try {
  	const { code, data } = action;
    const response = yield call(request, '/api/classrooms/' + code + '/images', {
    	method: 'POST',
    	headers: { 'Content-Type': 'application/json' },
    	body: JSON.stringify(data),
    });
    console.log(response, 'response');
    yield put(videoDataRecorded());
  } catch (err) {
    yield put(recordVideoImageError(err));
  }
}

export function* getWebcamWatcher() {
  yield fork(takeLatest, RECORD_VIDEO_IMAGE, recordVideoImage);
}

export function* webcamSaga() {
  const getWatcher = yield fork(getWebcamWatcher);
  yield take(LOCATION_CHANGE);
  yield cancel(getWatcher);
}

export default [
  webcamSaga,
];
