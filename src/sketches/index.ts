import { Beauty } from './Beauty';
import { Cyborg } from './Cyborg';
import { Smoke } from './Smoke';

export const sketches = [
  {
    Module: Cyborg,
    icon: '🤖',
  },
  {
    Module: Beauty,
    icon: '🥰',
  },
  {
    Module: Smoke,
    icon: '🔥',
  },
  {
    Module: Beauty,
    icon: '🤑',
  },
];

// TODO: Create this type using the above structure
// https://stackoverflow.com/questions/45251664/typescript-derive-union-type-from-tuple-array-values
export type SketchesType = Cyborg | Beauty | Smoke;
