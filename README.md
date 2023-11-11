해당 레포지토리는 WebGL 을 공부하기 위해 MDN의 `WebGL tutorial` 아티클을 참고하며 작성한 코드들을 담았습니다.

..그런데 타입스크립트를 얹은..!! 3D 렌더링 해볼거야!

## Ref

- [MDN - WebGL tutorial](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial)
- [MDN - WebGL: 2D and 3D graphics for the web](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- 그림으로 알아보는 WebGL 2D 행렬 계산! [WebGL 2D Matrices](https://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html)
- 일반적으로 사용된다는 Phong shading.. 광원 작업할때 참고 [Phong shading](https://en.wikipedia.org/wiki/Phong_shading)
- 그림으로 알아보는 Point Lighting! [WebGL 3D - Point Lighting
  ](https://webglfundamentals.org/webgl/lessons/webgl-3d-lighting-point.html)

## Memo..

빛..! 빛에는 세 종류가 있다!

- Ambient light (주변 빛) - 기본적인 밝기?
- Directional light (방향성을 띄는 빛) - 손전등에서 빔~ 나오는 느낌. 다른 방향으로 퍼지지 않고, 특정 방향으로만 이동한다
- Point light (광원) - 태양 같은 그런 것. 모든 방향으로 빛을 쏘는!
