import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { useWinSize } from '../hooks/useWinSize';

const renderer = new THREE.WebGLRenderer();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;
const animate = function() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
};
animate();

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
    const { width, height } = winSize;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }, [winSize]);

  // Will only fire once
  useEffect(() => {
    containerRef.current.appendChild(renderer.domElement);
  }, []);

  return <CanvasContainer ref={containerRef} />;
}
