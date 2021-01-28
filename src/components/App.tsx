import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { renderer, composer, scene, startAnimation } from '../setup';
import { Thumbs } from './Thumbs';
import { sketches, SketchInterface } from '../sketches';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

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
  const currentSketch = useRef<SketchInterface>();

  const [sketchIndex, setSketchIndex] = useState(2);

  // Will only fire once
  useEffect(() => {
    containerRef.current.appendChild(renderer.domElement);

    startAnimation(info => {
      if (
        currentSketch &&
        currentSketch.current &&
        currentSketch.current.update
      ) {
        currentSketch.current.update(info);
      }
    });
  }, []);

  useEffect(() => {
    composer.reset();
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    currentSketch.current = new sketches[sketchIndex].Module({
      composer,
      scene,
    });
  }, [sketchIndex]);

  return (
    <Wrapper>
      <CanvasContainer ref={containerRef} />
      <Thumbs setSketchIndex={setSketchIndex} sketchIndex={sketchIndex} />
    </Wrapper>
  );
}
