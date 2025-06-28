import { useEffect, useRef } from 'react';

interface TiltOptions {
  max?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  disableOnMobile?: boolean;
}

export const useTiltEffect = (options: TiltOptions = {}) => {
  const {
    max = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 500,
    disableOnMobile = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if device is mobile/tablet
    const isMobileOrTablet = () => {
      const ua = navigator.userAgent;
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    };

    // Reduced values for mobile/tablet
    const getMobileAdjustedValues = () => ({
      maxTilt: max * 0.5,
      scaleFactor: 1 + (scale - 1) * 0.5,
      perspectiveValue: perspective * 0.8
    });

    const values = isMobileOrTablet() ? getMobileAdjustedValues() : {
      maxTilt: max,
      scaleFactor: scale,
      perspectiveValue: perspective
    };

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (disableOnMobile && isMobileOrTablet()) {
        element.style.transform = `perspective(${values.perspectiveValue}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        return;
      }

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -values.maxTilt;
      const rotateY = ((x - centerX) / centerX) * values.maxTilt;

      element.style.transform = `perspective(${values.perspectiveValue}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${values.scaleFactor}, ${values.scaleFactor}, ${values.scaleFactor})`;
    };

    // Handle touch movement
    const handleTouchMove = (e: TouchEvent) => {
      if (disableOnMobile) {
        element.style.transform = `perspective(${values.perspectiveValue}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        return;
      }

      const touch = e.touches[0];
      if (!touch) return;

      const rect = element.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -values.maxTilt * 0.5; // Reduced tilt for touch
      const rotateY = ((x - centerX) / centerX) * values.maxTilt * 0.5;

      element.style.transform = `perspective(${values.perspectiveValue}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${values.scaleFactor}, ${values.scaleFactor}, ${values.scaleFactor})`;
    };

    const handleLeave = () => {
      element.style.transform = `perspective(${values.perspectiveValue}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    element.style.transition = `transform ${speed}ms ease-out`;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('mouseleave', handleLeave);
    element.addEventListener('touchend', handleLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('mouseleave', handleLeave);
      element.removeEventListener('touchend', handleLeave);
    };
  }, [max, perspective, scale, speed, disableOnMobile]);

  return ref;
}; 