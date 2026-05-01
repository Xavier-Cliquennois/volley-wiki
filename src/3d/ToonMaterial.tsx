import React from 'react';
import { useToonGradient } from './useToonGradient';

type ToonMaterialProps = {
  color: string;
  transparent?: boolean;
  opacity?: number;
};

export const ToonMaterial: React.FC<ToonMaterialProps> = ({ color, transparent = false, opacity = 1 }) => {
  const gradientMap = useToonGradient(4);
  return <meshToonMaterial color={color} gradientMap={gradientMap} transparent={transparent} opacity={opacity} />;
};
