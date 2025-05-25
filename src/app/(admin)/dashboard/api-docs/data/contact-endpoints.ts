import { ApiEndpointType } from "../components/endpoint-list";

export const contactEndpoints: ApiEndpointType[] = [
  {
    method: 'GET',
    path: '/api/contact',
    description: 'Fetch all contact form submissions',
    authorization: 'Staff or Admin',
    requestBody: null,
    responseExample: [
      {
        id: "contact_1",
        name: "Jane Doe",
        email: "jane@example.com",
        subject: "Project Inquiry",
        message: "I'm interested in discussing a potential project for my company...",
        phone: "+1234567890",
        company: "ABC Corporation",
        isRead: true,
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-02T00:00:00.000Z"
      },
      {
        id: "contact_2",
        name: "Mark Johnson",
        email: "mark@example.com",
        subject: "Collaboration Opportunity",
        message: "I'd like to discuss a potential collaboration between our companies...",
        phone: "+1987654321",
        company: "XYZ Agency",
        isRead: false,
        createdAt: "2023-01-03T00:00:00.000Z",
        updatedAt: "2023-01-03T00:00:00.000Z"
      }
    ]
  },
  {
    method: 'GET',
    path: '/api/contact/[id]',
    description: 'Fetch a specific contact submission by ID',
    authorization: 'Staff or Admin',
    requestBody: null,
    responseExample: {
      id: "contact_1",
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Project Inquiry",
      message: "I'm interested in discussing a potential project for my company...",
      phone: "+1234567890",
      company: "ABC Corporation",
      isRead: true,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-02T00:00:00.000Z"
    }
  },
  {
    method: 'POST',
    path: '/api/contact',
    description: 'Submit a new contact form',
    authorization: 'No authentication required, but requires CAPTCHA',
    requestBody: {
      name: "New Contact",
      email: "contact@example.com",
      subject: "New Project Request",
      message: "I would like to inquire about your services for a new project...",
      phone: "+1122334455",
      company: "New Company LLC"
    },
    responseExample: {
      id: "contact_3",
      name: "New Contact",
      email: "contact@example.com",
      subject: "New Project Request",
      message: "I would like to inquire about your services for a new project...",
      phone: "+1122334455",
      company: "New Company LLC",
      isRead: false,
      createdAt: "2023-02-01T00:00:00.000Z",
      updatedAt: "2023-02-01T00:00:00.000Z"
    }
  },
  {
    method: 'PUT',
    path: '/api/contact/[id]/read',
    description: 'Mark a contact submission as read',
    authorization: 'Staff or Admin',
    requestBody: null,
    responseExample: {
      id: "contact_2",
      isRead: true,
      updatedAt: "2023-02-05T00:00:00.000Z"
    }
  },
  {
    method: 'DELETE',
    path: '/api/contact/[id]',
    description: 'Delete a contact submission',
    authorization: 'Admin only',
    requestBody: null,
    responseExample: {
      success: true,
      message: "Contact submission deleted successfully"
    }
  },
  {
    method: 'GET',
    path: '/api/contact/count',
    description: 'Get total count of contact submissions (with optional unread filter)',
    authorization: 'Staff or Admin',
    requestBody: null,
    responseExample: {
      count: 15,
      unreadCount: 3
    }
  }
]; 