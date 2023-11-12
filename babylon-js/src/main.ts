import { createCanvas, createDrawButton } from './initial-functions.ts';
import { _01 } from './scenes/01_sphere.ts';

const canvas = createCanvas();
const app = document.querySelector('#app');
app?.appendChild(canvas);

[_01].forEach((info) => app?.appendChild(createDrawButton(canvas, info)));
