import React, { useRef, useState, MouseEvent, ReactNode, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./TiltedCard.css";

interface TiltedCardProps {
  children: ReactNode;
  imageSrc?: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  disableTiltOnMobile?: boolean;
}

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight,
  containerWidth = "100%",
  imageHeight,
  imageWidth = "100%",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = false,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  disableTiltOnMobile = true,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isOlderDevice, setIsOlderDevice] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    // Check for mobile/tablet devices
    const checkDevice = () => {
      const ua = navigator.userAgent.toLowerCase();
      const isMobileDevice = /mobile|tablet|android|ipad|iphone|ipod/i.test(ua);
      const isOlder = /android [1-4]|iphone os [1-9]_|cpu os [1-9]_/.test(ua);
      setIsMobile(isMobileDevice);
      setIsOlderDevice(isOlder);
    };

    checkDevice();
  }, []);

  function handleMouse(e: MouseEvent<HTMLElement>) {
    if (!ref.current || (disableTiltOnMobile && isMobile)) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    // Adjust tilt values for mobile/tablet
    const mobileMultiplier = isMobile ? 0.5 : 1;
    const maxRotation = Math.min(rotateAmplitude * mobileMultiplier, 15);
    const rotationX = Math.max(-maxRotation, Math.min(maxRotation, (offsetY / (rect.height / 2)) * -rotateAmplitude));
    const rotationY = Math.max(-maxRotation, Math.min(maxRotation, (offsetX / (rect.width / 2)) * rotateAmplitude));

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleTouchMove(e: TouchEvent) {
    if (!ref.current || (disableTiltOnMobile && isMobile)) return;

    const touch = e.touches[0];
    if (!touch) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left - rect.width / 2;
    const offsetY = touch.clientY - rect.top - rect.height / 2;

    // Reduced tilt for touch interactions
    const touchMultiplier = 0.3;
    const maxRotation = Math.min(rotateAmplitude * touchMultiplier, 10);
    const rotationX = Math.max(-maxRotation, Math.min(maxRotation, (offsetY / (rect.height / 2)) * -rotateAmplitude));
    const rotationY = Math.max(-maxRotation, Math.min(maxRotation, (offsetX / (rect.width / 2)) * rotateAmplitude));

    rotateX.set(rotationX);
    rotateY.set(rotationY);
  }

  function handleMouseEnter() {
    if (disableTiltOnMobile && isMobile) return;
    scale.set(isOlderDevice ? 1.02 : scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className={`tilted-card-figure ${isMobile ? 'touch-device' : ''}`}
      style={{
        width: containerWidth,
        ...(containerHeight ? { height: containerHeight } : {}),
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove as any}
      onTouchEnd={handleMouseLeave}
    >
      {showMobileWarning && isMobile && (
        <div className="tilted-card-mobile-alert">
          Tilt effect is simplified for mobile devices.
        </div>
      )}

      <motion.div
        className="tilted-card-inner"
        style={{
          width: imageWidth,
          ...(imageHeight ? { height: imageHeight } : {}),
          rotateX,
          rotateY,
          scale,
        }}
      >
        {imageSrc ? (
          <motion.img
            src={imageSrc}
            alt={altText}
            className="tilted-card-img"
            style={{
              width: imageWidth,
              ...(imageHeight ? { height: imageHeight } : {}),
            }}
          />
        ) : (
          <div className="tilted-card-content-wrapper">
            {children}
          </div>
        )}

        {displayOverlayContent && overlayContent && (
          <motion.div className="tilted-card-overlay">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && !isMobile && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
};

export default TiltedCard; 