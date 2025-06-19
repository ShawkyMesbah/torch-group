"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
  accentWord?: string; // Word to highlight in red
}

export function SectionHeader({
  subtitle,
  title,
  description,
  align = "center",
  size = "lg",
  className,
  animated = true,
  accentWord
}: SectionHeaderProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  const titleSizeClasses = {
    sm: "text-2xl sm:text-3xl md:text-4xl",
    md: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
    lg: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    xl: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
  };

  const subtitleSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-base",
    xl: "text-lg"
  };

  const descriptionSizeClasses = {
    sm: "text-sm md:text-base",
    md: "text-base md:text-lg",
    lg: "text-lg md:text-xl",
    xl: "text-xl md:text-2xl"
  };

  const renderTitle = () => {
    if (!accentWord) {
      return title;
    }

    // Split title and highlight the accent word
    const words = title.split(' ');
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/, '');
      const punctuation = word.replace(cleanWord, '');
      
      if (cleanWord.toLowerCase() === accentWord.toLowerCase()) {
        return (
          <span key={index} className="torch-text-accent">
            {cleanWord}{punctuation}{' '}
          </span>
        );
      }
      return word + ' ';
    });
  };

  const content = (
    <div className={cn("space-y-4 md:space-y-6", alignClasses[align], className)}>
      {subtitle && (
        <div className="torch-section-header">
          <span className={cn("torch-section-title", subtitleSizeClasses[size])}>
            {subtitle}
          </span>
        </div>
      )}
      
      <h2 className={cn(
        "font-extrabold text-white drop-shadow-lg leading-tight",
        titleSizeClasses[size]
      )}>
        {renderTitle()}
      </h2>
      
      {title && (
        <div className="flex justify-center">
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full torch-pulse"></div>
        </div>
      )}
      
      {description && (
        <div className="space-y-2">
          <p className={cn(
            "font-bold text-gray-200 max-w-2xl leading-relaxed",
            align === "center" && "mx-auto",
            descriptionSizeClasses[size]
          )}>
            {description}
          </p>
        </div>
      )}
    </div>
  );

  if (!animated) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  );
}

// Specialized header variants for common use cases
export function HeroHeader({ 
  title, 
  description, 
  className 
}: { 
  title: string; 
  description?: string; 
  className?: string;
}) {
  return (
    <SectionHeader
      title={title}
      description={description}
      size="xl"
      align="center"
      className={className}
      animated={true}
    />
  );
}

export function PageHeader({ 
  subtitle, 
  title, 
  description, 
  accentWord,
  className 
}: { 
  subtitle?: string;
  title: string; 
  description?: string; 
  accentWord?: string;
  className?: string;
}) {
  return (
    <SectionHeader
      subtitle={subtitle}
      title={title}
      description={description}
      accentWord={accentWord}
      size="lg"
      align="center"
      className={className}
      animated={true}
    />
  );
} 