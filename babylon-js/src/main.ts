import { createCanvas, createDrawButton } from './initial-functions.ts';
import { _01 } from './scenes/01_sphere.ts';
import { _02 } from './scenes/02_texture.ts';

const canvas = createCanvas();
const app = document.querySelector('#app');
app?.appendChild(canvas);

[_01, _02].forEach((info) => app?.appendChild(createDrawButton(canvas, info)));

// 마지막에 추가된 버튼을 클릭
(document.querySelector('button:last-child') as HTMLButtonElement)?.click();
