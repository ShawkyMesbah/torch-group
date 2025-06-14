import { ApiEndpointType } from "../components/endpoint-list";

export const projectEndpoints: ApiEndpointType[] = [
  {
    method: 'GET',
    path: '/api/projects',
    description: 'Fetch all projects',
    authorization: 'No authentication required',
    requestBody: null,
    responseExample: [
      {
        id: "project_1",
        title: "E-commerce Website Redesign",
        slug: "ecommerce-website-redesign",
        description: "Complete redesign of an e-commerce platform with modern UI/UX",
        content: "This project involved a complete overhaul of the client's e-commerce platform...",
        imageUrl: "https://example.com/project1.jpg",
        clientName: "Fashion Retailer Inc.",
        projectUrl: "https://fashion-retailer.com",
        tags: ["E-commerce", "UI/UX", "React"],
        featured: true,
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
      },
      {
        id: "project_2",
        title: "Mobile Banking App",
        slug: "mobile-banking-app",
        description: "Secure and user-friendly mobile banking application",
        content: "Developed a feature-rich mobile banking application with emphasis on security...",
        imageUrl: "https://example.com/project2.jpg",
        clientName: "Global Bank",
        projectUrl: "https://global-bank.com/app",
        tags: ["Mobile", "FinTech", "Security"],
        featured: true,
        createdAt: "2023-02-01T00:00:00.000Z",
        updatedAt: "2023-02-15T00:00:00.000Z"
      }
    ]
  },
  {
    method: 'GET',
    path: '/api/projects/[slug]',
    description: 'Fetch a specific project by slug',
    authorization: 'No authentication required',
    requestBody: null,
    responseExample: {
      id: "project_1",
      title: "E-commerce Website Redesign",
      slug: "ecommerce-website-redesign",
      description: "Complete redesign of an e-commerce platform with modern UI/UX",
      content: "This project involved a complete overhaul of the client's e-commerce platform...",
      imageUrl: "https://example.com/project1.jpg",
      clientName: "Fashion Retailer Inc.",
      projectUrl: "https://fashion-retailer.com",
      tags: ["E-commerce", "UI/UX", "React"],
      featured: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z"
    }
  },
  {
    method: 'POST',
    path: '/api/projects',
    description: 'Create a new project',
    authorization: 'Staff or Admin',
    requestBody: {
      title: "New Project",
      slug: "new-project",
      description: "Short description of the new project",
      content: "Detailed content about the project, process, and outcomes...",
      imageUrl: "https://example.com/new-project.jpg",
      clientName: "New Client Corp",
      projectUrl: "https://new-client.com",
      tags: ["Web", "Design", "Marketing"],
      featured: false
    },
    responseExample: {
      id: "project_3",
      title: "New Project",
      slug: "new-project",
      description: "Short description of the new project",
      content: "Detailed content about the project, process, and outcomes...",
      imageUrl: "https://example.com/new-project.jpg",
      clientName: "New Client Corp",
      projectUrl: "https://new-client.com",
      tags: ["Web", "Design", "Marketing"],
      featured: false,
      createdAt: "2023-03-01T00:00:00.000Z",
      updatedAt: "2023-03-01T00:00:00.000Z"
    }
  },
  {
    method: 'PUT',
    path: '/api/projects/[slug]',
    description: 'Update an existing project',
    authorization: 'Staff or Admin',
    requestBody: {
      title: "Updated Project",
      description: "Updated description of the project",
      content: "Updated detailed content about the project...",
      imageUrl: "https://example.com/updated-project.jpg",
      clientName: "Updated Client Name",
      projectUrl: "https://updated-client.com",
      tags: ["Web", "UI/UX", "Development"],
      featured: true
    },
    responseExample: {
      id: "project_1",
      title: "Updated Project",
      slug: "ecommerce-website-redesign",
      description: "Updated description of the project",
      content: "Updated detailed content about the project...",
      imageUrl: "https://example.com/updated-project.jpg",
      clientName: "Updated Client Name",
      projectUrl: "https://updated-client.com",
      tags: ["Web", "UI/UX", "Development"],
      featured: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-03-15T00:00:00.000Z"
    }
  },
  {
    method: 'DELETE',
    path: '/api/projects/[slug]',
    description: 'Delete a project',
    authorization: 'Admin only',
    requestBody: null,
    responseExample: {
      success: true,
      message: "Project deleted successfully"
    }
  },
  {
    method: 'GET',
    path: '/api/projects/count',
    description: 'Get total count of projects',
    authorization: 'No authentication required',
    requestBody: null,
    responseExample: {
      count: 8
    }
  }
]; 