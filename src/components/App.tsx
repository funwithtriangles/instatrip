import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { renderer, composer, scene, startAnimation } from '../setup';
import { Cyborg } from '../sketches/Cyborg.js';

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

  // Will only fire once
  useEffect(() => {
    containerRef.current.appendChild(renderer.domElement);

    const sketch = new Cyborg({ composer, scene });

    startAnimation(info => {
      sketch.update(info);
    });
  }, []);

  return <CanvasContainer ref={containerRef} />;
}
