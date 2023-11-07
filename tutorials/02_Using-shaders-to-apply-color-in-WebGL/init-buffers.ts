export function initBuffers(gl: WebGLRenderingContext) {
  const positionBuffer = initPositionBuffer(gl);
  const colorBuffer = initColorBuffer(gl);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

function initPositionBuffer(gl: WebGLRenderingContext) {
  // 육면체의 위치를 저장할 버퍼!
  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) throw '위치 버퍼를 초기화하는데 실패했어요';

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

function initColorBuffer(gl: WebGLRenderingContext) {
  // 따로 위치를 지정해주진 않았지만
  // 기본적으로 각 픽셀이 부드럽게 연결될 수 있게,
  // 그라데이션을 준다고 하네용
  const colors = [
    1.0,
    1.0,
    1.0,
    1.0, // white

    1.0,
    0.0,
    0.0,
    1.0, // red

    0.0,
    1.0,
    0.0,
    1.0, // green

    0.0,
    0.0,
    1.0,
    1.0, // blue
  ];

  const colorBuffer = gl.createBuffer();
  if (!colorBuffer) throw '색상 버퍼 생성에 실패했어요';

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return colorBuffer;
}
