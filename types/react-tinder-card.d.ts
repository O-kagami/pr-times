import * as React from 'react';

declare module 'react-tinder-card' {
  export type Direction = 'left' | 'right' | 'up' | 'down';

  export interface TinderCardProps {
    ref?: React.Ref<any>;
    onSwipe?: (direction: Direction) => void;
    onCardLeftScreen?: (direction: Direction) => void;
    preventSwipe?: Direction[];
    flickOnSwipe?: boolean;
    className?: string;
    children?: React.ReactNode;
    outputRotationRange?: string[];
  }

  export interface TinderCardRef {
    swipe: (dir?: Direction) => Promise<void>;
    restoreCard: () => Promise<void>;
  }

  const TinderCard: React.ForwardRefExoticComponent<
    TinderCardProps & React.RefAttributes<TinderCardRef>
  >;

  export default TinderCard;
}
