import { radian } from '../utils/math.js';
import { programInfo } from './index.js';

type ProgramInfo = typeof programInfo;
type Buffers = {
  normal: WebGLBuffer;
  position: WebGLBuffer;
  textureCoord: WebGLBuffer;
  indices: WebGLBuffer;
};

export function drawScene(
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  buffers: Buffers,
  texture: any,
  rotationInfo: { x: number; y: number; z: number }
) {
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST); // 깊이 테스트 활성화?
  gl.depthFunc(gl.LEQUAL); // 가까이 있는게 멀리 있는걸 가리는 옵션.. 오호

  // 색상 정보와 깊이 정보를 클리어
  // 비트 연산자!
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if (!(gl.canvas instanceof HTMLCanvasElement))
    throw '캔버스 요소를 찾을 수 없습니다';

  // 시야각. 정확히 어떤건진 찾아봐야할듯..?
  const fieldOfView = radian(45);
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  // 0.1 에서 100.0 사이에 있는 것만 렌더링
  const zNear = 0.1;
  const zFar = 100.0;
  // 계산한 결과를 담을 행렬
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();

  // 사각형을 그릴 위치를 조절한다. x, y, z
  const defaultNear = -6.0;
  mat4.translate(modelViewMatrix, modelViewMatrix, [
    -0.0,
    0.0,
    defaultNear + rotationInfo.z,
  ]);

  // 이젠 x, y, z 전부 돌려돌려! 다만 가중치를 다르게 둬서, 돌아가는 속도를 다르게!
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotationInfo.x, [0, 1, 0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotationInfo.y, [1, 0, 0]);

  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  setPositionAttribute(gl, buffers, programInfo);
  setTextureAttribute(gl, buffers, programInfo);
  setNormalAttribute(gl, buffers, programInfo);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // WebGL이여, 그릴때 이 프로그램을 써라!
  gl.useProgram(programInfo.program);

  // 여기서 uniform 이라면 셰이더에 전달되는 전역변수인듯.
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix
  );

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  {
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    // 이제 한 면을 만드는데 2개의 삼각형이 들어가니, 6개의 점이 필요합니다
    // 정육면체 - 6 x 6 = 36
    const vertexCount = 36;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

// 이부분은 잘 모르겠다.. 흠..
function setPositionAttribute(
  gl: WebGLRenderingContext,
  buffers: Buffers,
  programInfo: ProgramInfo
) {
  // 이제 x, y 뿐만 아니라 z 축까지 포함하므로, 2 -> 3 으로 변경
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setTextureAttribute(
  gl: WebGLRenderingContext,
  buffers: Buffers,
  programInfo: ProgramInfo
) {
  const num = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
  gl.vertexAttribPointer(
    programInfo.attribLocations.textureCoord,
    num,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}

function setNormalAttribute(
  gl: WebGLRenderingContext,
  buffers: Buffers,
  programInfo: ProgramInfo
) {
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexNormal,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}
