import {requireNativeComponent} from 'react-native';
import PropTypes from 'prop-types';

/**
 * Composes `View`.
 *
 * - src: string
 * - borderRadius: number
 * - resizeMode: 'cover' | 'contain' | 'stretch'
 */
export const CameraViewManager = requireNativeComponent('RTCCameraViewManager');
