import { createSelector } from 'reselect';

/**
 * Direct selector to the teacherPage state domain
 */
const selectTeacherPageDomain = () => (state) => state.get('teacherPage');

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

const selectLoadingSessions = () => createSelector(
  selectTeacherPageDomain(),
  (teacherPageDomain) => teacherPageDomain.get('loadingSessions')
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
