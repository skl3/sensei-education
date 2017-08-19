import { createSelector } from 'reselect';

/**
 * Direct selector to the teacherPage state domain
 */
const selectTeacherPageDomain = () => (state) => state.get('teacherPage');

/**
 * Other specific selectors
 */


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
};
