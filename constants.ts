import { CameraMotion, Atmosphere, AspectRatio } from './types';

export const APP_NAME = "VEO Studio";

export const MOTIONS = Object.values(CameraMotion);
export const ATMOSPHERES = Object.values(Atmosphere);
export const ASPECT_RATIOS = [
  { label: 'Portrait 9:16', value: AspectRatio.PORTRAIT, icon: '📱' },
  { label: 'Landscape 16:9', value: AspectRatio.LANDSCAPE, icon: '💻' },
];

export const SCENE_MOTIONS = [
  "Subtle hair movement",
  "Background blur animation",
  "Light flicker",
  "Floating particles",
  "Soft wind",
  "Water ripples"
];

export const DEFAULT_CONFIG = {
  promptModifier: "",
  motion: CameraMotion.ZOOM_IN,
  atmosphere: Atmosphere.CLEAN,
  identityLock: true,
  aspectRatio: AspectRatio.PORTRAIT,
  sceneMotion: SCENE_MOTIONS[0],
  videoLength: 5
};