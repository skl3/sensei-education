import { takeLatest } from 'redux-saga';
import { take, call, put, fork, select, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  UPDATE_CLASSROOM,
  QUERY_CLASSROOM,
  QUERY_SESSION,
} from './constants';
import {
  classroomUpdated, updateClassroomError,
  classroomQueried, queryClassroomError,
  sessionQueried, querySessionError,
} from './actions';
import request from 'utils/request';


export function* updateClassroom(action) {
  try {
    const { classroom, id } = action;
    const { title, description, videoUrl, tags, isPublic } = classroom;
    const updateBody = { title, description, videoUrl, isPublic, tags };
    const response = yield call(request, '/api/classrooms/' + id, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateBody),
    });
    yield put(classroomUpdated(response));
  } catch (err) {
    yield put(updateClassroomError(err));
  }
}

export function* queryClassroomAnalytics(action) {
  try {
    const classroom = yield call(request, '/api/classrooms/' + action.id);
    yield put(classroomQueried(classroom));
  } catch (err) {
    yield put(queryClassroomError(err));
  }
}

export function* querySessionAnalytics(action) {
  try {
    const session = yield call(request, '/api/sessions/' + action.id);
    console.log(session, 'search session analytics');
    yield put(sessionQueried(session));
  } catch (err) {
    yield put(querySessionError(err));
  }
}

export function* getTeacherWatcher() {
  yield fork(takeLatest, UPDATE_CLASSROOM, updateClassroom);
  yield fork(takeLatest, QUERY_CLASSROOM, queryClassroomAnalytics);
  yield fork(takeLatest, QUERY_SESSION, querySessionAnalytics);
}

export function* teacherSaga() {
  const getWatcher = yield fork(getTeacherWatcher);
  yield take(LOCATION_CHANGE);
  yield cancel(getWatcher);
}

export default [
  teacherSaga,
];
