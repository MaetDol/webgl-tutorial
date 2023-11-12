해당 레포지토리는 WebGL 을 공부하기 위해 MDN의 `WebGL tutorial` 아티클을 참고하며 작성한 코드들을 담았습니다.

..그런데 타입스크립트를 얹은..!! 3D 렌더링 해볼거야!

그러나..모델링과 텍스쳐 데이터를 읽고 렌더링하는 부분이 비중이 큽니다. \
gltf 로더만을 이용해 렌더링 하기에는 부가적인 데이터도 있고, vertex/fragment shader 를 직접 작성하는건 허들이 될 것 같군용. \
WebGL 쪽은 라이브러리를 적극적으로 쓰는 방향으로 작업하는걸로. 다만 라이브러리를 사용하는 부분은 인터페이스를 확실하게 \
찢어놓고, 추후 WebGL 쪽을 직접 작성할 수 있는 여지를 남겨두는 방향으로 해보는걸로!

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
