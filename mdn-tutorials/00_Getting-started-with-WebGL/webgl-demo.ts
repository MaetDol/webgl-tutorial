main();

function main() {
  const canvas = document.querySelector('#glcanvas');
  if (!canvas) throw '캔버스를 찾지 못했습니다';
  if (!(canvas instanceof HTMLCanvasElement))
    throw '선택된 요소가 캔버스가 아닙니다';

  const gl = canvas.getContext('webgl');
  if (!gl)
    throw 'WebGL을 초기화하는데 실패했습니다. 브라우저가 지원하지 않는 것 같네요';

  // rgba 인듯. 버퍼에 '이 색으로 초기화 해주세용' 명령어를 넣는다
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 버퍼에 쌓인 명령 전부 실행
  gl.clear(gl.COLOR_BUFFER_BIT);
}
