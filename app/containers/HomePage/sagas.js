import { takeLatest } from 'redux-saga';
import { take, call, put, fork, select, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { QUERY_PUBLIC_CLASSROOMS, GENERATE_CLASSROOM, SEARCH_CLASSROOM } from './constants';
import {
  publicClassroomsQueried, queryPublicClassroomsError,
  classroomGenerated, generateClassroomError,
  classroomSearched, searchClassroomError
} from './actions';
import request from 'utils/request';


export function* queryPublicClassrooms(action) {
  try {
    const response = yield call(request, '/api/classrooms/public');
    yield put(publicClassroomsQueried(response));
  } catch (err) {
    yield put(queryPublicClassroomsError(err));
  }
}

export function* generateClassroom(action) {
  try {
    const response = yield call(request, '/api/classrooms', { method: "POST" });
    const { shortCode } = response;
    yield put(classroomGenerated(shortCode));
    window.location = '/teacher/' + shortCode; // redirect to teacher page
  } catch (err) {
    yield put(generateClassroomError(err));
  }
}

export function* searchClassrooms(action) {
  try {
    const { code } = action;
    console.log('entering saga', code);
    const classroom = yield call(request, '/api/classrooms?code=' + code);
    console.log(classroom, 'search classroom from saga');
    yield put(classroomSearched(classroom));
    if (classroom) {
      console.log('inside here');
      // redirect to webcam page
      window.location = '/webcam/' + classroom.classCode;
    } else {
      window.alert("No classroom with that ID");
    }
  } catch (err) {
    window.alert("No classroom with that ID");
    console.log(err, 'error');
    yield put(searchClassroomError(err));
  }
}

export function* getHomeWatcher() {
  yield fork(takeLatest, QUERY_PUBLIC_CLASSROOMS, queryPublicClassrooms);
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
