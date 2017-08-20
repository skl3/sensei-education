/*
 *
 * WebcamPage actions
 *
 */

import {
  RECORD_VIDEO_IMAGE,
  RECORD_VIDEO_IMAGE_SUCCESS,
  RECORD_VIDEO_IMAGE_ERROR,
} from './constants';

export function recordVideoImage(code, data) {
  return {
    type: RECORD_VIDEO_IMAGE,
    code,
    data,
  };
}

export function videoImageRecorded() {
	return {
		type: RECORD_VIDEO_IMAGE_SUCCESS,
	};
}

export function recordVideoImageError(error) {
	return {
		type: RECORD_VIDEO_IMAGE_ERROR,
		error,
	};
}
