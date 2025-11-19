export type ViewState = 'home' | 'editor' | 'processing' | 'result';

export enum AspectRatio {
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  // Note: Veo API typically supports 16:9 and 9:16. 1:1 might fallback or crop.
  SQUARE = '1:1' 
}

export enum CameraMotion {
  NONE = 'Static',
  ZOOM_IN = 'Slow Zoom-In',
  PARALLAX = 'Portrait Parallax',
  ORBIT = 'Cinematic Orbit',
  DOLLY_IN = 'Studio Dolly-In',
  HANDHELD = 'Natural Handheld'
}

export enum Atmosphere {
  CLEAN = 'Studio Clean',
  GOLDEN = 'Golden Hour',
  NEON = 'Neon Mood',
  SOFT = 'Soft Natural Light',
  SHADOW = 'Cinematic Shadow'
}

export interface GenerationConfig {
  promptModifier: string;
  motion: CameraMotion;
  atmosphere: Atmosphere;
  identityLock: boolean;
  aspectRatio: AspectRatio;
  sceneMotion: string; // e.g., "Hair wind", "Background movement"
  videoLength: number;
}

export interface GeneratedVideo {
  uri: string;
  mimeType: string;
}