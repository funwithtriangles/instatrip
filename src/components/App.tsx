import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  orthCam,
  persCam,
  renderer,
  composer,
  scene,
  startAnimation,
} from '../setup';
import { useWinSize } from '../hooks/useWinSize';
import { Wireframe } from '../sketches/Wireframe';

const CanvasContainer = styled.div`
  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const div = document.createElement('div');

export default function App() {
  const containerRef = useRef<HTMLDivElement>(div);
  const winSize = useWinSize();

  useEffect(() => {
    // const { width, height } = winSize;
    // persCam.aspect = window.innerWidth / window.innerHeight;
    // persCam.updateProjectionMatrix();
    // renderer.setSize(width, height);
    // orthCam.left = -0.5 * width;
    // orthCam.right = 0.5 * width;
    // orthCam.top = 0.5 * height;
    // orthCam.bottom = -0.5 * height;
    // orthCam.updateProjectionMatrix();
    // console.log(orthCam);
  }, [winSize]);

  // Will only fire once
  useEffect(() => {
    containerRef.current.appendChild(renderer.domElement);

    const sketch = new Wireframe({ composer, scene, persCam, orthCam });

    startAnimation(() => {
      // sketch.update();
    });
  }, []);

  return <CanvasContainer ref={containerRef} />;
}
