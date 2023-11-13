import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from 'babylonjs';
import seaImage from '../assets/imgs/sea.webp';
import { ModuleInfo } from '../initial-functions.ts';

function main(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });

  const scene = new Scene(engine);

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

  const ground = MeshBuilder.CreateGround(
    'ground1',
    { width: 24, height: 24 },
    scene
  );
  const groundMaterial = new StandardMaterial('ground material1', scene);
  const groundTexture = new Texture(seaImage, scene);
  groundMaterial.diffuseTexture = groundTexture;
  ground.material = groundMaterial;

  const camera = new ArcRotateCamera(
    'arcRotateCamera1',
    Math.PI / 2,
    Math.PI / 2.5,
    0,
    new Vector3(4, 4, 2)
  );

  camera.setTarget(sphere);
  camera.attachControl(canvas, true);

  engine.runRenderLoop(() => scene.render());

  return engine;
}

export const _02: ModuleInfo = {
  text: '02_texture',
  render: main,
};
