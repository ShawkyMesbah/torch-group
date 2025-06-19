"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ExternalLink, Github, Linkedin, Twitter } from "lucide-react";

interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'website';
  url: string;
}

interface TeamMemberCardProps {
  name: string;
  role: string;
  imageUrl: string;
  bio?: string;
  socialLinks?: SocialLink[];
  className?: string;
  variant?: 'default' | 'minimal' | 'bordered';
}

export function TeamMemberCard({
  name,
  role,
  imageUrl,
  bio,
  socialLinks = [],
  className,
  variant = 'default',
}: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getSocialIcon = (platform: SocialLink['platform']) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'website':
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  if (variant === 'minimal') {
    return (
      <div 
        className={cn(
          "group relative flex flex-col items-center",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3">
          <Image
            src={imageUrl || "/images/default-avatar.png"}
            alt={name}
            width={80}
            height={80}
            className="rounded-full object-cover border-2 torch-border-accent shadow-md"
            placeholder="blur"
            sizes="80px"
          />
        </div>
        <h3 className="text-base font-medium text-white">{name}</h3>
        <p className="text-xs text-gray-400">{role}</p>
        
        {socialLinks.length > 0 && (
          <div 
            className={cn(
              "flex gap-2 mt-2 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-orange-400 hover:shadow-[0_0_8px_rgba(255,87,34,0.3)] transition-all duration-300 transform hover:scale-110"
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'bordered') {
    return (
      <div 
        className={cn(
          "group relative overflow-hidden border border-gray-800 bg-black",
          "transition-all duration-300 hover:border-red-900/50",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-60 relative overflow-hidden">
          <Image
            src={imageUrl || "/images/default-avatar.png"}
            alt={name}
            width={80}
            height={80}
            className="rounded-full object-cover border-2 torch-border-accent shadow-md"
            placeholder="blur"
            sizes="80px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          
          <div 
            className={cn(
              "absolute bottom-0 left-0 w-full p-4 transform transition-transform duration-300",
              isHovered ? "translate-y-0" : "translate-y-12"
            )}
          >
            <h3 className="text-white text-lg font-bold mb-1">{name}</h3>
            <p className="text-red-400 text-sm">{role}</p>
          </div>
        </div>
        
        {bio && (
          <div 
            className={cn(
              "px-4 py-3 bg-gray-900/50 transform transition-all duration-300",
              isHovered ? "max-h-24 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            )}
          >
            <p className="text-gray-400 text-sm line-clamp-3">{bio}</p>
          </div>
        )}
        
        {socialLinks.length > 0 && (
          <div className="flex border-t border-gray-800">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex-1 flex items-center justify-center py-3 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 hover:shadow-[0_0_8px_rgba(255,87,34,0.2)] transition-all duration-300",
                  index !== socialLinks.length - 1 && "border-r border-gray-800"
                )}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div 
      className={cn(
        "group relative overflow-hidden bg-black border border-gray-800",
        "transition-all duration-300 hover:border-gray-700/70",
        "hover:shadow-[0_0_30px_rgba(220,38,38,0.07)]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-60 relative overflow-hidden">
        <Image
          src={imageUrl || "/images/default-avatar.png"}
          alt={name}
          width={80}
          height={80}
          className="rounded-full object-cover border-2 torch-border-accent shadow-md"
          placeholder="blur"
          sizes="80px"
        />
        
        {/* Overlay gradient */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent",
            "transition-opacity duration-500",
            isHovered ? "opacity-80" : "opacity-0"
          )}
        ></div>
        
        {/* Hire tag */}
        <div className="absolute top-3 right-3 torch-bg-primary text-white text-xs py-1 px-2">
          TALENT
        </div>
        
        {/* Content overlay on hover */}
        <div 
          className={cn(
            "absolute inset-0 flex flex-col justify-end p-5",
            "transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          {bio && (
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">{bio}</p>
          )}
          
          {socialLinks.length > 0 && (
            <div className="flex gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900/80 hover:torch-bg-primary text-gray-400 hover:text-white p-2 rounded-full 
                             transition-colors flex items-center justify-center"
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="text-gray-400 text-sm">{role}</p>
      </div>
      
      {/* Bottom border animation */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 h-0.5 torch-bg-primary",
          "transition-all duration-500 ease-out",
          isHovered ? "w-full" : "w-0"
        )}
      ></div>
    </div>
  );
} 