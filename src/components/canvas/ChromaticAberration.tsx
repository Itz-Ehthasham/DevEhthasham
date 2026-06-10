'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { ChromaticAberration as ChromaticAberrationPass } from '@react-three/postprocessing';
import * as THREE from 'three';

export function ChromaticAberration() {
  return <ChromaticAberrationPass offset={[0, 0]} />;
}