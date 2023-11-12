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

  // attribute 의 a-Vertex...
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;

  // uniform 의 u-Model...
  uniform mat4 uNormalMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;


    // Apply lighting effect

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.0, 0.0, 1.0));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
  }
`;

// Fragment :
//  texel(텍스쳐의 각 픽셀)이 어디에 그려져야 할지 계산해주는 친구
export const fsSource = `
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  uniform sampler2D uSampler;

  void main() {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
  }
`;

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

export const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
  },
};

const buffers = initBuffers(gl);
const texture = loadTexture(gl, './cubetexture.png');
// WebGL은 텍스처 이미지를 밑에서 위로 읽기 때문에, 뒤집어서 그려야 한다
// 일반적으론 위에서 아래로 읽는다
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

function render(now: number) {
  drawScene(gl, programInfo, buffers, texture, rotationInfo);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

function loadTexture(gl: WebGLRenderingContext, url: string) {
  const texture = gl.createTexture();
  if (!texture) throw '텍스처 생성에 실패했어요';
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 이미지가 다운로드 되는 동안 미리 1px 짜리 도트를 텍스처로
  // 미리 렌더링 해둠으로써, 다운로드 받자마자 바로 바꿀 수 있게..?
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    // 이미지의 w, h가 2의 거듭제곱(n^2) 인지에 따라 렌더링 박식이 달라진다
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // 왜냐묜.. mipmap은 해당 해상도를 여러 배율로 만들어서,
      // 멀리 있을땐 작은 해상도로 렌더링하고 가까이 있는건 고해상도 텍스처로
      // 렌더링 해주는 칭구이기 때문이다. 깔끔하게 나누어 떨어지는 n^2 가 좋겠죵? 결과도 보장할 수 있을테구
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };

  image.src = url;
  return texture;
}

// 2의 거듭제곱인지 확인.
// 2진수로 변환시 10, 100, 1000 의 형태이기 때문에,
// 1000 & 0111 === 0 // true. 같은 방식으로 확인한다
function isPowerOf2(value: number) {
  return (value & (value - 1)) === 0;
}

const prev: { x: null | number; y: null | number } = { x: null, y: null };
let isDragging = false;
const rotationInfo = { x: 0, y: 0, z: 0 };

canvas.addEventListener('mousedown', () => {
  isDragging = true;
});
window.addEventListener('mouseup', () => {
  isDragging = false;
  prev.x = null;
  prev.y = null;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  if (prev.x === null || prev.y === null) {
    prev.x = e.clientX;
    prev.y = e.clientY;
    return;
  }

  const delta = {
    x: e.clientX - prev.x,
    y: e.clientY - prev.y,
  };

  prev.x = e.clientX;
  prev.y = e.clientY;

  rotationInfo.x += delta.x / 500;
  rotationInfo.y += delta.y / 500;
});

window.addEventListener('wheel', (e) => {
  rotationInfo.z -= e.deltaY / 500;
});
