import { EffectComposer } from 'postprocessing';
import { Scene } from 'three';

import { AnimationInfo } from '../setup';
import { Smoke } from './Smoke';
import { Melt } from './Melt';
import { Tunnel } from './Tunnel';
import { Lumpy } from './Lumpy';
import { Drift } from './Drift';
import { Devil } from './Devil';
import { Noise } from './Noise';

interface SketchConstructorArgs {
  composer: EffectComposer;
  scene: Scene;
}

export interface SketchConstructor {
  new (arg0: SketchConstructorArgs): SketchInterface;
}

export interface SketchInterface {
  update?(arg0: AnimationInfo): void;
  messageText?: string;
  hideText?: () => void;
}

export interface SketchItem {
  Module: SketchConstructor;
  icon: string;
}

export const sketches: SketchItem[] = [
  {
    Module: Smoke,
    icon: '🚬',
  },
  {
    Module: Melt,
    icon: '💊',
  },
  {
    Module: Tunnel,
    icon: '🌈',
  },
  {
    Module: Lumpy,
    icon: '🥴',
  },
  {
    Module: Drift,
    icon: '🧘🏻',
  },
  {
    Module: Devil,
    icon: '👹',
  },
  {
    Module: Noise,
    icon: '✨',
  },
];
