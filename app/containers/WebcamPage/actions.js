/*
 *
 * WebcamPage actions
 *
 */

import {
  RECORD_VIDEO_DATA,
  RECORD_VIDEO_DATA_SUCCESS,
  RECORD_VIDEO_DATA_ERROR,
} from './constants';

export function recordVideoData(data) {
  return {
    type: RECORD_VIDEO_DATA,
    data,
  };
}

export function videoDataRecorded() {
	return {
		type: RECORD_VIDEO_DATA_SUCCESS,
	};
}

export function recordVideoDataError(error) {
	return {
		type: RECORD_VIDEO_DATA_ERROR,
		error,
	};
}
