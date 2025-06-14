import { ApiEndpointType } from "../components/endpoint-list";

export const talentEndpoints: ApiEndpointType[] = [
  {
    method: 'GET',
    path: '/api/talents',
    description: 'Fetch all talents. Can filter by category.',
    authorization: 'No authentication required',
    requestBody: null,
    responseExample: [
      {
        id: "talent_1",
        name: "John Smith",
        email: "john@example.com",
        phone: "+1234567890",
        category: "DESIGN",
        skills: ["UI/UX", "Adobe Creative Suite", "Figma"],
        experience: 5,
        portfolio: "https://johnsmith.com",
        resume: "https://example.com/john-resume.pdf",
        availability: "FULL_TIME",
        createdAt: "2023-01-01T00:00:00.000Z"
      },
      {
        id: "talent_2",
        name: "Amanda Lee",
        email: "amanda@example.com",
        phone: "+1987654321",
        category: "DEVELOPMENT",
        skills: ["React", "Node.js", "TypeScript"],
        experience: 3,
        portfolio: "https://amandalee.dev",
        resume: "https://example.com/amanda-resume.pdf",
        availability: "CONTRACT",
        createdAt: "2023-01-02T00:00:00.000Z"
      }
    ]
  },
  {
    method: 'GET',
    path: '/api/talents/[id]',
    description: 'Fetch a specific talent by ID',
    authorization: 'Staff or Admin',
    requestBody: null,
    responseExample: {
      id: "talent_1",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1234567890",
      category: "DESIGN",
      skills: ["UI/UX", "Adobe Creative Suite", "Figma"],
      experience: 5,
      portfolio: "https://johnsmith.com",
      resume: "https://example.com/john-resume.pdf",
      availability: "FULL_TIME",
      notes: "Great candidate with excellent portfolio. Ready for immediate start.",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-15T00:00:00.000Z"
    }
  },
  {
    method: 'POST',
    path: '/api/talents',
    description: 'Create a new talent entry',
    authorization: 'Anyone can submit, but needs CAPTCHA validation',
    requestBody: {
      name: "New Talent",
      email: "talent@example.com",
      phone: "+1122334455",
      category: "MARKETING",
      skills: ["Social Media", "Content Strategy", "SEO"],
      experience: 2,
      portfolio: "https://talent-portfolio.com",
      resume: "https://example.com/talent-resume.pdf",
      availability: "PART_TIME",
      notes: "Initial contact through website form."
    },
    responseExample: {
      id: "talent_3",
      name: "New Talent",
      email: "talent@example.com",
      phone: "+1122334455",
      category: "MARKETING",
      skills: ["Social Media", "Content Strategy", "SEO"],
      experience: 2,
      portfolio: "https://talent-portfolio.com",
      resume: "https://example.com/talent-resume.pdf",
      availability: "PART_TIME",
      notes: "Initial contact through website form.",
      createdAt: "2023-02-01T00:00:00.000Z",
      updatedAt: "2023-02-01T00:00:00.000Z"
    }
  },
  {
    method: 'PUT',
    path: '/api/talents/[id]',
    description: 'Update an existing talent entry',
    authorization: 'Staff or Admin',
    requestBody: {
      name: "Updated Talent Name",
      email: "updated@example.com",
      phone: "+1234567890",
      category: "DESIGN",
      skills: ["UI/UX", "Adobe Creative Suite", "Figma", "Sketch"],
      experience: 6,
      portfolio: "https://updated-portfolio.com",
      resume: "https://example.com/updated-resume.pdf",
      availability: "FULL_TIME",
      notes: "Updated after interview. Strong candidate."
    },
    responseExample: {
      id: "talent_1",
      name: "Updated Talent Name",
      email: "updated@example.com",
      phone: "+1234567890",
      category: "DESIGN",
      skills: ["UI/UX", "Adobe Creative Suite", "Figma", "Sketch"],
      experience: 6,
      portfolio: "https://updated-portfolio.com",
      resume: "https://example.com/updated-resume.pdf",
      availability: "FULL_TIME",
      notes: "Updated after interview. Strong candidate.",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-02-15T00:00:00.000Z"
    }
  },
  {
    method: 'DELETE',
    path: '/api/talents/[id]',
    description: 'Delete a talent entry',
    authorization: 'Admin only',
    requestBody: null,
    responseExample: {
      success: true,
      message: "Talent entry deleted successfully"
    }
  },
  {
    method: 'GET',
    path: '/api/talents/count',
    description: 'Get total count of talents',
    authorization: 'Staff or Admin',
    requestBody: null,
    responseExample: {
      count: 42
    }
  }
]; 