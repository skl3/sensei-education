import { createSelector } from 'reselect';

/**
 * Direct selector to the webcamPage state domain
 */
const selectWebcamPageDomain = () => (state) => state.get('webcamPage');

/**
 * Other specific selectors
 */


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
};
