import { createSelector } from 'reselect';

/**
 * Direct selector to the home state domain
 */
const selectHomeDomain = () => (state) => state.get('home');

/**
 * Other specific selectors
 */
 const selectLoadingClassrooms = () => createSelector(
   selectHomeDomain(),
   (homePageDomain) => homePageDomain.get('loadingClassrooms')
 );

 const selectClassrooms = () => createSelector(
   selectHomeDomain(),
   (homePageDomain) => homePageDomain.get('classrooms')
 );

/**
 * Default selector used by Home
 */

const makeSelectHome = () => createSelector(
  selectHomeDomain(),
  (substate) => substate.toJS()
);

export default makeSelectHome;
export {
  selectHomeDomain,
  selectLoadingClassrooms,
  selectClassrooms,
};
