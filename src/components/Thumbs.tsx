import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import Flickity from 'react-flickity-component';
import { sketches } from '../sketches';

const Nav = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const Item = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid white;
  border-radius: 999px;
  width: 6rem;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  margin: 0.5rem;
  transition: 0.2s;
  transform: scale(0.7);

  &.is-selected {
    transform: scale(1);
  }
`;

type ThumbsProps = {
  setSketchIndex: (index: number) => void;
};

export function Thumbs({ setSketchIndex }: ThumbsProps) {
  const flickityRef = useRef<Flickity>();

  useEffect(() => {
    if (flickityRef.current !== undefined) {
      flickityRef.current.on('settle', (index: number) => {
        setSketchIndex(index);
      });
    } else {
      console.error('Flickity ref not available');
    }
  }, [setSketchIndex]);

  return (
    <Nav>
      <Flickity
        flickityRef={c => (flickityRef.current = c)}
        options={{
          prevNextButtons: false,
          pageDots: false,
        }}
      >
        {sketches.map(sketch => (
          <Item>{sketch.icon}</Item>
        ))}
      </Flickity>
    </Nav>
  );
}
