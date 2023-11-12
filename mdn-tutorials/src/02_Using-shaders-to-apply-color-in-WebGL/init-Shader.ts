// OpenGL ES Shading Language(GLSL)
type GLSL = string;

// 두 셰이더 프로그램을 initialize 한다
export function initShaderProgram(
  gl: WebGLRenderingContext,
  vsSource: GLSL,
  fsSource: GLSL
) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  if (!shaderProgram) throw '셰이더 프로그램 생성에 실패했어요';
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw `셰이더 프로그램 초기화에 실패했어요: ${gl.getProgramInfoLog(
      shaderProgram
    )}`;
  }

  return shaderProgram;
}

// 셰이더 소스코드를 넘기고 컴파일 후, 로드한다
function loadShader(
  gl: WebGLRenderingContext,
  type:
    | WebGLRenderingContext['VERTEX_SHADER']
    | WebGLRenderingContext['FRAGMENT_SHADER'],
  source: GLSL
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw '셰이더 생성에 실패했어요';

  // 셰이더 소스를 보낸다
  gl.shaderSource(shader, source);
  // 보낸 소스를 컴파일
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const err = `셰이더를 컴파일하는데 실패했어요: ${gl.getShaderInfoLog(
      shader
    )}`;
    gl.deleteShader(shader);

    throw err;
  }

  return shader;
}
