import {
  DEFAULT_CANVAS_ATTRIBUTES,
  createCanvas,
  getWebGL,
} from '../utils/initializer.js';
import { drawScene } from './draw-scene.js';
import { initShaderProgram } from './init-Shader.js';
import { initBuffers } from './init-buffers.js';

// 이번 섹션에선 glMatrix 라는 라이브러리를 사용합니다
// 왜냐묜 행렬 연산을 사용하기 위해..
// index.html 에 추가되어 있습니다

const canvas = createCanvas(DEFAULT_CANVAS_ATTRIBUTES);
const gl = getWebGL(canvas);

// OpenGL ES Shading Language(GLSL)로 작성된 코드를 받아들이며,
// 데이터를 어떻게 렌더링해야 할지 알 수 있게 해주는 뇨속을
// 셰이더(Shader) 프로그램이라 합니다. 'vertex' 와 'fragment', 두 셰이더로 나뉘어요!

// vertex shader :
//   각 점(vertex)를 계산하는 친구. 원 좌표계를 clip-space 좌표계로 변환해준다구 함
export const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
`;

// Fragment :
//  texel(텍스쳐의 각 픽셀)이 어디에 그려져야 할지 계산해주는 친구
export const fsSource = `
  varying lowp vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`;

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

export const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
  },
};

const buffers = initBuffers(gl);

// 사각형을 빙글빙글 돌리는데 사용!
// 하지만 사실 카메라를 돌리는 것!
let squareRotation = 0.0;
let deltaTime = 0;

let then = 0;
function render(now: number) {
  // ms를 초로 변환
  now *= 0.001;
  deltaTime = now - then;
  then = now;

  drawScene(gl, programInfo, buffers, squareRotation);
  squareRotation += deltaTime;

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
