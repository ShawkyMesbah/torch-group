import { ApiEndpointType } from "../components/endpoint-list";

export const teamEndpoints: ApiEndpointType[] = [
  {
    method: 'GET',
    path: '/api/team',
    description: 'Fetch all team members',
    authorization: 'No authentication required',
    requestBody: null,
    responseExample: [
      {
        id: "team_1",
        name: "Sarah Johnson",
        position: "Creative Director",
        bio: "Sarah has over 10 years of experience in creative direction and brand strategy...",
        imageUrl: "https://example.com/team1.jpg",
        socialLinks: {
          linkedin: "https://linkedin.com/in/sarahjohnson",
          twitter: "https://twitter.com/sarahjohnson",
          github: null
        },
        order: 1,
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
      },
      {
        id: "team_2",
        name: "Michael Chen",
        position: "Lead Developer",
        bio: "Michael specializes in full-stack development with a focus on scalable architecture...",
        imageUrl: "https://example.com/team2.jpg",
        socialLinks: {
          linkedin: "https://linkedin.com/in/michaelchen",
          twitter: null,
          github: "https://github.com/michaelchen"
        },
        order: 2,
        createdAt: "2023-01-02T00:00:00.000Z",
        updatedAt: "2023-01-02T00:00:00.000Z"
      }
    ]
  },
  {
    method: 'GET',
    path: '/api/team/[id]',
    description: 'Fetch a specific team member by ID',
    authorization: 'No authentication required',
    requestBody: null,
    responseExample: {
      id: "team_1",
      name: "Sarah Johnson",
      position: "Creative Director",
      bio: "Sarah has over 10 years of experience in creative direction and brand strategy...",
      imageUrl: "https://example.com/team1.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/sarahjohnson",
        github: null
      },
      order: 1,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z"
    }
  },
  {
    method: 'POST',
    path: '/api/team',
    description: 'Create a new team member',
    authorization: 'Staff or Admin',
    requestBody: {
      name: "Alex Rodriguez",
      position: "UX Designer",
      bio: "Alex has 5+ years of experience designing user experiences for web and mobile applications...",
      imageUrl: "https://example.com/team-alex.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/alexrodriguez",
        twitter: "https://twitter.com/alexrodriguez",
        github: null
      },
      order: 3
    },
    responseExample: {
      id: "team_3",
      name: "Alex Rodriguez",
      position: "UX Designer",
      bio: "Alex has 5+ years of experience designing user experiences for web and mobile applications...",
      imageUrl: "https://example.com/team-alex.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/alexrodriguez",
        twitter: "https://twitter.com/alexrodriguez",
        github: null
      },
      order: 3,
      createdAt: "2023-02-01T00:00:00.000Z",
      updatedAt: "2023-02-01T00:00:00.000Z"
    }
  },
  {
    method: 'PUT',
    path: '/api/team/[id]',
    description: 'Update an existing team member',
    authorization: 'Staff or Admin',
    requestBody: {
      name: "Sarah Johnson",
      position: "Executive Creative Director",
      bio: "Updated bio with recent accomplishments and experience...",
      imageUrl: "https://example.com/team1-updated.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/sarahjohnson_new",
        github: "https://github.com/sarahjohnson"
      },
      order: 1
    },
    responseExample: {
      id: "team_1",
      name: "Sarah Johnson",
      position: "Executive Creative Director",
      bio: "Updated bio with recent accomplishments and experience...",
      imageUrl: "https://example.com/team1-updated.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/sarahjohnson_new",
        github: "https://github.com/sarahjohnson"
      },
      order: 1,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-02-15T00:00:00.000Z"
    }
  },
  {
    method: 'DELETE',
    path: '/api/team/[id]',
    description: 'Delete a team member',
    authorization: 'Admin only',
    requestBody: null,
    responseExample: {
      success: true,
      message: "Team member deleted successfully"
    }
  }
]; 