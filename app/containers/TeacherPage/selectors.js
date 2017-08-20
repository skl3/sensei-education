import { createSelector } from 'reselect';

/**
 * Direct selector to the teacherPage state domain
 */
const selectTeacherPageDomain = () => (state) => state.get('teacher');

/**
 * Other specific selectors
 */
const selectUpdatingClassroom = () => createSelector(
  selectTeacherPageDomain(),
  (teacherPageDomain) => teacherPageDomain.get('updatingClassroom')
);

const selectLoadingClassroom = () => createSelector(
  selectTeacherPageDomain(),
  (teacherPageDomain) => teacherPageDomain.get('loadingClassroom')
);

const selectLoadingSession = () => createSelector(
  selectTeacherPageDomain(),
  (teacherPageDomain) => teacherPageDomain.get('loadingSession')
);

const selectClassroom = () => createSelector(
  selectTeacherPageDomain(),
  (teacherPageDomain) => teacherPageDomain.get('classroom')
);

const selectSessions = () => createSelector(
  selectTeacherPageDomain(),
  (teacherPageDomain) => teacherPageDomain.get('sessions')
);

/**
 * Default selector used by TeacherPage
 */
 const makeSelectTeacherPage = () => createSelector(
   selectTeacherPageDomain(),
   (substate) => substate.toJS()
 );

export default makeSelectTeacherPage;
export {
  selectTeacherPageDomain,
  selectUpdatingClassroom,
  selectLoadingClassroom,
  selectLoadingSession,
  selectClassroom,
  selectSessions,
};
