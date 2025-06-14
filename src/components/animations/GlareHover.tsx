import React, { CSSProperties, ReactNode } from "react";
import "./GlareHover.css";

interface GlareHoverProps {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  children: ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: CSSProperties;
}

const GlareHover: React.FC<GlareHoverProps> = ({
  width = "500px",
  height = "500px",
  background = "#000",
  borderRadius = "10px",
  borderColor = "#333",
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = "",
  style = {},
}) => {
  const hex = glareColor.replace("#", "");
  let rgba = glareColor;
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const vars: CSSProperties = {
    width,
    height,
    background: background,
    borderRadius,
    borderColor,
    // Custom properties for CSS
    // @ts-ignore
    "--gh-width": width,
    // @ts-ignore
    "--gh-height": height,
    // @ts-ignore
    "--gh-bg": background,
    // @ts-ignore
    "--gh-br": borderRadius,
    // @ts-ignore
    "--gh-angle": `${glareAngle}deg`,
    // @ts-ignore
    "--gh-duration": `${transitionDuration}ms`,
    // @ts-ignore
    "--gh-size": `${glareSize}%`,
    // @ts-ignore
    "--gh-rgba": rgba,
    // @ts-ignore
    "--gh-border": borderColor,
    ...style,
  };

  return (
    <div
      className={`glare-hover ${playOnce ? 'glare-hover--play-once' : ''} ${className}`}
      style={vars}
    >
      {children}
    </div>
  );
};

export default GlareHover; 