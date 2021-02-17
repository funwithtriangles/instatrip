import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  renderer,
  composer,
  scene,
  startAnimation,
  renderPass,
  showIntroBlock,
} from '../setup';
import { Thumbs } from './Thumbs';
import { sketches, SketchInterface } from '../sketches';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

const Message = styled.div`
  position: fixed;
  bottom: 10rem;
  width: 100%;
  color: white;
  text-align: center;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: 1s;

  &.show {
    opacity: 1;
  }
`;

const HelpIcon = styled.div`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid white;
  border-radius: 999px;
  width: 2rem;
  height: 2rem;
  font-size: 2rem;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  color: #fa00ff;
`;

const div = document.createElement('div');

let to: number;

export default function App() {
  const containerRef = useRef<HTMLDivElement>(div);
  const currentSketch = useRef<SketchInterface>();

  const [sketchIndex, setSketchIndex] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [textVisible, setTextVisible] = useState(false);

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

  // Fires every time we change sketch
  useEffect(() => {
    renderPass.renderToScreen = false;
    renderPass.clear = true;
    composer.reset();
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    currentSketch.current = new sketches[sketchIndex].Module({
      composer,
      scene,
    });

    // Set text if set in sketch
    setMessageText(currentSketch.current.messageText || '');
    setTextVisible(false);

    // Make text appear after 1.5 seconds
    clearTimeout(to);
    to = setTimeout(() => {
      setTextVisible(true);
    }, 1500);

    // Provide method to sketch to hide text when necessary
    currentSketch.current.hideText = () => {
      setTextVisible(false);
    };
  }, [sketchIndex]);

  return (
    <Wrapper>
      <HelpIcon onClick={showIntroBlock}>⇦</HelpIcon>
      <CanvasContainer ref={containerRef} />
      {messageText && (
        <Message className={textVisible ? 'show' : 'hide'}>
          {messageText}
        </Message>
      )}
      <Thumbs setSketchIndex={setSketchIndex} sketchIndex={sketchIndex} />
    </Wrapper>
  );
}
