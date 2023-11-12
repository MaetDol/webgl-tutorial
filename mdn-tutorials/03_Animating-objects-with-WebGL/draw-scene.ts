import { radian } from '../utils/math.js';
import { programInfo } from './index.js';

type ProgramInfo = typeof programInfo;
type Buffers = { position: WebGLBuffer; color: WebGLBuffer };

export function drawScene(
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  buffers: Buffers,
  squareRotation: number
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
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
  // 요건 돌리기~ z축만 돌릴거니까 마지막만 1!
  mat4.rotate(modelViewMatrix, modelViewMatrix, squareRotation, [0, 0, 1]);

  setPositionAttribute(gl, buffers, programInfo);
  setColorAttribute(gl, buffers, programInfo);

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

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

// 이부분은 잘 모르겠다.. 흠..
function setPositionAttribute(
  gl: WebGLRenderingContext,
  buffers: Buffers,
  programInfo: ProgramInfo
) {
  const numComponents = 2;
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

function setColorAttribute(
  gl: WebGLRenderingContext,
  buffers: Buffers,
  programInfo: ProgramInfo
) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}
