export const DEFAULT_CANVAS_ATTRIBUTES = {
  id: 'glcanvas',
  width: '640',
  height: '480',
  style: 'border: 1px solid black',
};

export function createCanvas(attributes: Record<string, string> = {}) {
  const canvas = document.createElement('canvas');
  document.body.append(canvas);

  for (const name in attributes) {
    canvas.setAttribute(name, attributes[name]);
  }

  return canvas;
}

export function getWebGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl');
  if (!gl)
    throw 'WebGL을 초기화하는데 실패했습니다. 브라우저가 지원하지 않는 것 같네요.';

  return gl;
}
