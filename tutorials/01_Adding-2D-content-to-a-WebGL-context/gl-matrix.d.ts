import * as glmatrix from 'gl-matrix';

declare global {
  var mat4: typeof glmatrix.mat4;
}

export {};
