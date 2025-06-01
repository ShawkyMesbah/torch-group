"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Phone,
  Globe
} from "lucide-react";

export interface SocialLink {
  platform: "github" | "linkedin" | "twitter" | "website";
  url: string;
}

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  socialLinks?: SocialLink[];
  skills?: string[];
}

export function TeamMemberCard({
  name,
  role,
  bio,
  imageUrl,
  email,
  phone,
  socialLinks = [],
  skills = [],
}: TeamMemberCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "github":
        return <Github className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {bio && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{bio}</p>
        )}
        
        {skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <Mail className="h-4 w-4 mr-2" />
              {email}
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <Phone className="h-4 w-4 mr-2" />
              {phone}
            </a>
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className="mt-4 flex items-center space-x-2">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 