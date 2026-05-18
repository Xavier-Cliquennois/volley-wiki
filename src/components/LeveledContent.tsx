import { type ReactNode } from 'react';
import { meetsLevel, useUserLevel, type Level } from '../userLevel/useUserLevel';

type Props = {
  // Minimum level required to render the children.
  // 'beginner' = always visible. 'advanced' = only visible in advanced mode.
  requires: Level;
  children: ReactNode;
  // Optional placeholder rendered when content is hidden (e.g. a hint).
  fallback?: ReactNode;
};

export default function LeveledContent({ requires, children, fallback = null }: Props) {
  const [current] = useUserLevel();
  if (!meetsLevel(current, requires)) return <>{fallback}</>;
  return <>{children}</>;
}
