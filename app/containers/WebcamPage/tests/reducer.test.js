
import { fromJS } from 'immutable';
import webcamPageReducer from '../reducer';

describe('webcamPageReducer', () => {
  it('returns the initial state', () => {
    expect(webcamPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
