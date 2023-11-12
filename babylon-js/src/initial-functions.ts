import { Engine, FreeCamera, Scene, Vector3 } from 'babylonjs';

export type ModuleInfo = {
  text: string;
  render: (canvas: HTMLCanvasElement) => Engine;
};

export function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 480;

  canvas.style.display = 'block';
  canvas.style.margin = 'auto';

  return canvas;
}

let previousEngine: Engine | null = null;
export function createDrawButton(
  canvas: HTMLCanvasElement,
  { render, text }: ModuleInfo
) {
  const button = document.createElement('button');
  button.style.margin = '8px';
  button.innerText = text;
  button.onclick = () => {
    previousEngine?.dispose();
    previousEngine = render(canvas);
  };

  return button;
}

function createEngine(canvas: HTMLCanvasElement) {
  return new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });
}

export function createScene(canvas: HTMLCanvasElement) {
  const engine = createEngine(canvas);
  const scene = new Scene(engine);

  const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());

  return scene;
}
