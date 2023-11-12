import {
  Engine,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from 'babylonjs';
import { ModuleInfo } from '../initial-functions.ts';

function main(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });

  const scene = new Scene(engine);

  const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, true);

  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  const sphere = MeshBuilder.CreateSphere(
    'sphere1',
    {
      diameter: 2,
      segments: 32,
    },
    scene
  );
  sphere.position.y = 1;

  MeshBuilder.CreateGround('ground1', { width: 6, height: 6 }, scene);

  engine.runRenderLoop(() => scene.render());

  return engine;
}

export const _01: ModuleInfo = {
  text: '01_Sphere',
  render: main,
};
