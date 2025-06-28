import { useEffect, useRef } from 'react';

interface TiltOptions {
  max?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
}

export const useTiltEffect = (options: TiltOptions = {}) => {
  const {
    max = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 500,
  } = options;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -max;
      const rotateY = ((x - centerX) / centerX) * max;

      element.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };

    const handleMouseLeave = () => {
      element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    element.style.transition = `transform ${speed}ms ease-out`;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [max, perspective, scale, speed]);

  return ref;
}; 