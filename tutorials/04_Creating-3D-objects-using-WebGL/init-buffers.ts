export function initBuffers(gl: WebGLRenderingContext) {
  const positionBuffer = initPositionBuffer(gl);
  const colorBuffer = initColorBuffer(gl);
  const indexBuffer = initIndexBuffer(gl);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

function initPositionBuffer(gl: WebGLRenderingContext) {
  // 육면체의 위치를 저장할 버퍼!
  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) throw '위치 버퍼를 초기화하는데 실패했어요';

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 이제 한 점을 표현하는데에 x,y,z 3개의 값이 필요..!
  const positions = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

function initColorBuffer(gl: WebGLRenderingContext) {
  // 따로 위치를 지정해주진 않았지만
  // 기본적으로 각 픽셀이 부드럽게 연결될 수 있게,
  // 그라데이션을 준다고 하네용
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ];

  const colorBuffer = gl.createBuffer();
  if (!colorBuffer) throw '색상 버퍼 생성에 실패했어요';

  const colorArray = faceColors.flatMap((c) => [c, c, c, c]).flat();

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);

  return colorBuffer;
}

function initIndexBuffer(gl: WebGLRenderingContext) {
  const indexBuffer = gl.createBuffer();
  if (!indexBuffer)
    throw '폴리곤 맵핑에 사용될 indexBuffer 의 생성에 실패했어요';
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // 3D 에선 삼각형으로 표현합니다!
  // 사각형을 그리려면 두개의 삼각형을 합쳐야 하므로,
  // 각 면을 표현하는데 6개의 점이 필요합니다.
  // 해당 인덱슨는 position array 의 index 입니다! (위에서 선언한 그거)
  const indices = [
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // back
    8,
    9,
    10,
    8,
    10,
    11, // top
    12,
    13,
    14,
    12,
    14,
    15, // bottom
    16,
    17,
    18,
    16,
    18,
    19, // right
    20,
    21,
    22,
    20,
    22,
    23, // left
  ];

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  return indexBuffer;
}
