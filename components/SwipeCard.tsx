"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";

export type SwipeDirection = "left" | "right" | "up" | "down";

export type SwipeCardApi = {
  swipe: (direction?: SwipeDirection) => Promise<void>;
  restoreCard: () => Promise<void>;
};

type SwipeCardProps = {
  children: ReactNode;
  className?: string;
  onCardLeftScreen?: (direction: SwipeDirection) => void;
  onSwipe?: (direction: SwipeDirection) => void;
  preventSwipe?: SwipeDirection[];
  swipeThreshold?: number;
};

const EXIT_DURATION = 320;

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

const SwipeCard = forwardRef<SwipeCardApi, SwipeCardProps>(
  function SwipeCard(
    {
      children,
      className,
      onCardLeftScreen,
      onSwipe,
      preventSwipe = [],
      swipeThreshold = 110,
    },
    ref,
  ) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isTransitioning, setIsTransitioning] = useState(false);
    const pointerId = useRef<number | null>(null);
    const startPoint = useRef({ x: 0, y: 0 });
    const latestPosition = useRef({ x: 0, y: 0 });
    const isExiting = useRef(false);
    const didDrag = useRef(false);

    const updatePosition = useCallback((x: number, y: number) => {
      const nextPosition = { x, y };
      latestPosition.current = nextPosition;
      setPosition(nextPosition);
    }, []);

    const restoreCard = useCallback(async () => {
      isExiting.current = false;
      setIsTransitioning(true);
      updatePosition(0, 0);
      await wait(EXIT_DURATION);
      setIsTransitioning(false);
    }, [updatePosition]);

    const swipe = useCallback(
      async (direction: SwipeDirection = "right") => {
        if (isExiting.current || preventSwipe.includes(direction)) return;

        isExiting.current = true;
        didDrag.current = true;
        onSwipe?.(direction);
        setIsTransitioning(true);

        const horizontalDirection = direction === "left" ? -1 : 1;
        const verticalDirection = direction === "up" ? -1 : 1;
        const isHorizontal = direction === "left" || direction === "right";
        const exitDistance = Math.max(window.innerWidth, 900);

        updatePosition(
          isHorizontal
            ? horizontalDirection * exitDistance
            : latestPosition.current.x,
          isHorizontal
            ? latestPosition.current.y
            : verticalDirection * window.innerHeight,
        );

        await wait(EXIT_DURATION);
        onCardLeftScreen?.(direction);
      },
      [onCardLeftScreen, onSwipe, preventSwipe, updatePosition],
    );

    useImperativeHandle(
      ref,
      () => ({
        restoreCard,
        swipe,
      }),
      [restoreCard, swipe],
    );

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (isExiting.current || !event.isPrimary) return;
      pointerId.current = event.pointerId;
      startPoint.current = {
        x: event.clientX - latestPosition.current.x,
        y: event.clientY - latestPosition.current.y,
      };
      didDrag.current = false;
      setIsTransitioning(false);
      event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerId.current !== event.pointerId) return;
      const x = event.clientX - startPoint.current.x;
      const y = (event.clientY - startPoint.current.y) * 0.3;
      if (Math.abs(x) > 5) didDrag.current = true;
      updatePosition(x, y);
    };

    const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerId.current !== event.pointerId) return;
      pointerId.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);

      const direction = latestPosition.current.x < 0 ? "left" : "right";
      if (
        Math.abs(latestPosition.current.x) >= swipeThreshold &&
        !preventSwipe.includes(direction)
      ) {
        void swipe(direction);
        return;
      }

      void restoreCard();
    };

    const cardStyle: CSSProperties = {
      cursor: isExiting.current ? "default" : "grab",
      transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${position.x / 28}deg)`,
      transition: isTransitioning
        ? `transform ${EXIT_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
        : "none",
    };

    return (
      <div
        className={className}
        onClickCapture={(event) => {
          if (!didDrag.current) return;
          event.preventDefault();
          event.stopPropagation();
          didDrag.current = false;
        }}
        onPointerCancel={finishDrag}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        style={cardStyle}
      >
        {children}
      </div>
    );
  },
);

export default SwipeCard;
