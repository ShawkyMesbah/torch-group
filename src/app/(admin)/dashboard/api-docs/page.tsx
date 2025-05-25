"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Endpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  requiresAuth: boolean;
  role?: "USER" | "STAFF" | "ADMIN";
  params?: { name: string; type: string; required: boolean; description: string }[];
  body?: { name: string; type: string; required: boolean; description: string }[];
  response?: { status: number; description: string; example?: string }[];
}

interface ApiCategory {
  name: string;
  description: string;
  endpoints: Endpoint[];
}

const API_DOCS: ApiCategory[] = [
  {
    name: "Authentication",
    description: "API endpoints for authentication and authorization",
    endpoints: [
      {
        path: "/api/auth/signin",
        method: "POST",
        description: "Sign in with credentials",
        requiresAuth: false,
        body: [
          { name: "email", type: "string", required: true, description: "User email address" },
          { name: "password", type: "string", required: true, description: "User password" },
        ],
        response: [
          { status: 200, description: "Authentication successful, session created" },
          { status: 401, description: "Authentication failed" },
        ],
      },
      {
        path: "/api/auth/signout",
        method: "POST",
        description: "Sign out the current user",
        requiresAuth: true,
        response: [
          { status: 200, description: "Successfully signed out" },
        ],
      },
      {
        path: "/api/auth/session",
        method: "GET",
        description: "Get the current session information",
        requiresAuth: false,
        response: [
          { status: 200, description: "Current session information", example: '{ "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }' },
          { status: 401, description: "No active session" },
        ],
      }
    ],
  },
  {
    name: "Blog",
    description: "API endpoints for blog post management",
    endpoints: [
      {
        path: "/api/blog",
        method: "GET",
        description: "Get all blog posts",
        requiresAuth: false,
        params: [
          { name: "page", type: "number", required: false, description: "Page number for pagination" },
          { name: "limit", type: "number", required: false, description: "Number of items per page" },
        ],
        response: [
          { status: 200, description: "List of blog posts" },
        ],
      },
      {
        path: "/api/blog",
        method: "POST",
        description: "Create a new blog post",
        requiresAuth: true,
        role: "STAFF",
        body: [
          { name: "title", type: "string", required: true, description: "Blog post title" },
          { name: "excerpt", type: "string", required: true, description: "Short excerpt/summary" },
          { name: "content", type: "string", required: true, description: "Full blog post content" },
          { name: "slug", type: "string", required: false, description: "URL slug (auto-generated if not provided)" },
          { name: "coverImage", type: "string", required: false, description: "URL to the cover image" },
          { name: "isPublished", type: "boolean", required: false, description: "Whether the post is published" },
        ],
        response: [
          { status: 201, description: "Blog post created successfully" },
          { status: 400, description: "Invalid request data" },
          { status: 401, description: "Unauthorized" },
        ],
      },
      {
        path: "/api/blog/[slug]",
        method: "GET",
        description: "Get a specific blog post by slug",
        requiresAuth: false,
        params: [
          { name: "slug", type: "string", required: true, description: "Blog post slug" },
        ],
        response: [
          { status: 200, description: "Blog post data" },
          { status: 404, description: "Blog post not found" },
        ],
      },
      {
        path: "/api/blog/[slug]",
        method: "PUT",
        description: "Update a blog post",
        requiresAuth: true,
        role: "STAFF",
        params: [
          { name: "slug", type: "string", required: true, description: "Blog post slug" },
        ],
        body: [
          { name: "title", type: "string", required: false, description: "Blog post title" },
          { name: "excerpt", type: "string", required: false, description: "Short excerpt/summary" },
          { name: "content", type: "string", required: false, description: "Full blog post content" },
          { name: "coverImage", type: "string", required: false, description: "URL to the cover image" },
          { name: "isPublished", type: "boolean", required: false, description: "Whether the post is published" },
        ],
        response: [
          { status: 200, description: "Blog post updated successfully" },
          { status: 404, description: "Blog post not found" },
          { status: 400, description: "Invalid request data" },
          { status: 401, description: "Unauthorized" },
        ],
      },
      {
        path: "/api/blog/[slug]",
        method: "DELETE",
        description: "Delete a blog post",
        requiresAuth: true,
        role: "ADMIN",
        params: [
          { name: "slug", type: "string", required: true, description: "Blog post slug" },
        ],
        response: [
          { status: 200, description: "Blog post deleted successfully" },
          { status: 404, description: "Blog post not found" },
          { status: 401, description: "Unauthorized" },
        ],
      },
      {
        path: "/api/blog/count",
        method: "GET",
        description: "Get the total count of blog posts",
        requiresAuth: true,
        role: "STAFF",
        response: [
          { status: 200, description: "Total count of blog posts", example: '{ "count": 42 }' },
          { status: 401, description: "Unauthorized" },
        ],
      },
    ],
  },
  {
    name: "Talents",
    description: "API endpoints for talent management",
    endpoints: [
      {
        path: "/api/talents",
        method: "GET",
        description: "Get all talents",
        requiresAuth: false,
        params: [
          { name: "page", type: "number", required: false, description: "Page number for pagination" },
          { name: "limit", type: "number", required: false, description: "Number of items per page" },
          { name: "active", type: "boolean", required: false, description: "Filter by active status" },
          { name: "category", type: "string", required: false, description: "Filter by category" },
        ],
        response: [
          { status: 200, description: "List of talents" },
        ],
      },
      {
        path: "/api/talents",
        method: "POST",
        description: "Create a new talent",
        requiresAuth: true,
        role: "STAFF",
        body: [
          { name: "name", type: "string", required: true, description: "Talent name" },
          { name: "description", type: "string", required: true, description: "Talent description" },
          { name: "category", type: "string", required: true, description: "Talent category" },
          { name: "profileImage", type: "string", required: false, description: "URL to profile image" },
          { name: "isActive", type: "boolean", required: false, description: "Whether the talent is active" },
        ],
        response: [
          { status: 201, description: "Talent created successfully" },
          { status: 400, description: "Invalid request data" },
          { status: 401, description: "Unauthorized" },
        ],
      },
    ],
  },
  {
    name: "Team",
    description: "API endpoints for team member management",
    endpoints: [
      {
        path: "/api/team",
        method: "GET",
        description: "Get all team members",
        requiresAuth: false,
        response: [
          { status: 200, description: "List of team members" },
        ],
      },
    ],
  },
  {
    name: "Projects",
    description: "API endpoints for project management",
    endpoints: [
      {
        path: "/api/projects",
        method: "GET",
        description: "Get all projects",
        requiresAuth: false,
        response: [
          { status: 200, description: "List of projects" },
        ],
      },
    ],
  },
  {
    name: "Contact",
    description: "API endpoints for contact form submissions",
    endpoints: [
      {
        path: "/api/contact",
        method: "POST",
        description: "Submit a contact form",
        requiresAuth: false,
        body: [
          { name: "name", type: "string", required: true, description: "Contact name" },
          { name: "email", type: "string", required: true, description: "Contact email" },
          { name: "phone", type: "string", required: false, description: "Contact phone number" },
          { name: "message", type: "string", required: true, description: "Contact message" },
        ],
        response: [
          { status: 201, description: "Contact message submitted successfully" },
          { status: 400, description: "Invalid request data" },
        ],
      },
    ],
  },
  {
    name: "Analytics",
    description: "API endpoints for analytics data",
    endpoints: [
      {
        path: "/api/analytics/stats",
        method: "GET",
        description: "Get analytics statistics",
        requiresAuth: true,
        role: "ADMIN",
        params: [
          { name: "startDate", type: "string", required: false, description: "Start date for analytics (ISO format)" },
          { name: "endDate", type: "string", required: false, description: "End date for analytics (ISO format)" },
        ],
        response: [
          { status: 200, description: "Analytics statistics" },
          { status: 401, description: "Unauthorized" },
        ],
      },
    ],
  },
  {
    name: "Settings",
    description: "API endpoints for site settings",
    endpoints: [
      {
        path: "/api/settings/homepage-sections",
        method: "GET",
        description: "Get homepage sections ordering",
        requiresAuth: false,
        response: [
          { status: 200, description: "Homepage sections order" },
        ],
      },
      {
        path: "/api/settings/homepage-sections",
        method: "PUT",
        description: "Update homepage sections ordering",
        requiresAuth: true,
        role: "ADMIN",
        body: [
          { name: "sections", type: "array", required: true, description: "Ordered array of section IDs" },
        ],
        response: [
          { status: 200, description: "Homepage sections updated successfully" },
          { status: 400, description: "Invalid request data" },
          { status: 401, description: "Unauthorized" },
        ],
      },
    ],
  },
];

export default function ApiDocs() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
        <p className="text-muted-foreground">
          This page documents all available API endpoints in the Torch Group application.
        </p>
      </div>

      <Tabs defaultValue={API_DOCS[0].name.toLowerCase()}>
        <TabsList className="mb-4 flex flex-wrap h-auto">
          {API_DOCS.map((category) => (
            <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {API_DOCS.map((category) => (
          <TabsContent key={category.name} value={category.name.toLowerCase()}>
            <Card>
              <CardHeader>
                <CardTitle>{category.name} API</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {category.endpoints.map((endpoint, index) => (
                    <div key={`${endpoint.path}-${endpoint.method}-${index}`} className="border-b pb-6 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={endpoint.method === "GET" ? "default" : endpoint.method === "POST" ? "success" : endpoint.method === "PUT" ? "warning" : "destructive"}>
                          {endpoint.method}
                        </Badge>
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {endpoint.path}
                        </code>
                        {endpoint.requiresAuth && (
                          <Badge variant="outline" className="ml-auto">
                            {endpoint.role ? `Requires ${endpoint.role}` : "Auth Required"}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {endpoint.description}
                      </p>

                      {endpoint.params && endpoint.params.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">URL Parameters</h4>
                          <div className="bg-muted rounded-md p-4">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left pb-2">Name</th>
                                  <th className="text-left pb-2">Type</th>
                                  <th className="text-left pb-2">Required</th>
                                  <th className="text-left pb-2">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {endpoint.params.map((param) => (
                                  <tr key={param.name} className="border-b last:border-0">
                                    <td className="py-2 font-mono text-xs">{param.name}</td>
                                    <td className="py-2">{param.type}</td>
                                    <td className="py-2">{param.required ? "Yes" : "No"}</td>
                                    <td className="py-2">{param.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {endpoint.body && endpoint.body.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Request Body</h4>
                          <div className="bg-muted rounded-md p-4">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left pb-2">Name</th>
                                  <th className="text-left pb-2">Type</th>
                                  <th className="text-left pb-2">Required</th>
                                  <th className="text-left pb-2">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {endpoint.body.map((param) => (
                                  <tr key={param.name} className="border-b last:border-0">
                                    <td className="py-2 font-mono text-xs">{param.name}</td>
                                    <td className="py-2">{param.type}</td>
                                    <td className="py-2">{param.required ? "Yes" : "No"}</td>
                                    <td className="py-2">{param.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {endpoint.response && endpoint.response.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Responses</h4>
                          <div className="bg-muted rounded-md p-4">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left pb-2">Status</th>
                                  <th className="text-left pb-2">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {endpoint.response.map((res) => (
                                  <tr key={res.status} className="border-b last:border-0">
                                    <td className="py-2 font-mono text-xs">{res.status}</td>
                                    <td className="py-2">{res.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            
                            {endpoint.response.some(r => r.example) && (
                              <div className="mt-4">
                                <h5 className="text-xs font-semibold mb-2">Example Response</h5>
                                <pre className="bg-background p-2 rounded-md text-xs whitespace-pre-wrap">
                                  {endpoint.response.find(r => r.example)?.example}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 