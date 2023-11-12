export function initBuffers(gl: WebGLRenderingContext) {
  const positionBuffer = initPositionBuffer(gl);
  if (!positionBuffer) throw '위치 버퍼를 초기화하는데 실패했어요';

  return {
    position: positionBuffer,
  };
}

function initPositionBuffer(gl: WebGLRenderingContext) {
  // 육면체의 위치를 저장할 버퍼!
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}
