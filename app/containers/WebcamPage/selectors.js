import { createSelector } from 'reselect';

/**
 * Direct selector to the webcamPage state domain
 */
const selectWebcamPageDomain = () => (state) => state.get('webcam');

/**
 * Other specific selectors
 */
 const selectLoadingClassroom = () => createSelector(
   selectWebcamPageDomain(),
   (webcamPageDomain) => webcamPageDomain.get('loadngClassroom')
 );

 const selectClassroom = () => createSelector(
   selectWebcamPageDomain(),
   (webcamPageDomain) => webcamPageDomain.get('classroom')
 );

/**
 * Default selector used by WebcamPage
 */

const makeSelectWebcamPage = () => createSelector(
  selectWebcamPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectWebcamPage;
export {
  selectWebcamPageDomain,
  selectLoadingClassroom,
  selectClassroom,
};
