
import { fromJS } from 'immutable';
import teacherPageReducer from '../reducer';

describe('teacherPageReducer', () => {
  it('returns the initial state', () => {
    expect(teacherPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
