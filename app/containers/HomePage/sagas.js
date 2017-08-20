import { takeLatest } from 'redux-saga';
import { take, call, put, fork, select, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { GENERATE_CLASSROOM, SEARCH_CLASSROOM } from './constants';
import {
  classroomGenerated, generateClassroomError,
  classroomSearched, searchClassroomError
} from './actions';
import request from 'utils/request';

export function* generateClassroom(action) {
  try {
    const response = yield call(request, '/api/classrooms', { method: "POST" });
    const { shortCode } = response;
    yield put(classroomGenerated(response.shortCode));
    window.location = '/teacher/' + shortCode; // redirect to teacher page
  } catch (err) {
    console.log(err, 'error');
    yield put(generateClassroomError(err));
  }
}

export function* searchClassrooms(action) {
  try {
    const response = yield call(request, '/classrooms', {
      query: ""
    });
    console.log(response, 'search classroom from saga');
    const classroom = response.body;
    yield put(classroomSearched(classroom));
    // redirect to webcam page
    window.location = '/webcam';
  } catch (err) {
    yield put(searchClassroomError(err));
  }
}

export function* getHomeWatcher() {
  yield fork(takeLatest, GENERATE_CLASSROOM, generateClassroom);
  yield fork(takeLatest, SEARCH_CLASSROOM, searchClassrooms);
}

// Individual exports for testing
export function* homeSaga() {
  const getWatcher = yield fork(getHomeWatcher);
  yield take(LOCATION_CHANGE);
  yield cancel(getWatcher);
}

// All sagas to be loaded
export default [
  homeSaga,
];
