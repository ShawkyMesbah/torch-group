import { ApiEndpointType } from "../components/endpoint-list";

export const newsletterEndpoints: ApiEndpointType[] = [
  {
    method: 'GET',
    path: '/api/newsletter',
    description: 'Get all newsletter subscribers',
    authorization: 'Admin only',
    requestBody: null,
    responseExample: [
      {
        id: "subscriber_1",
        email: "subscriber1@example.com",
        name: "John Doe",
        subscribedAt: "2023-01-01T00:00:00.000Z",
        active: true
      },
      {
        id: "subscriber_2",
        email: "subscriber2@example.com",
        name: "Jane Smith",
        subscribedAt: "2023-01-02T00:00:00.000Z",
        active: true
      },
      {
        id: "subscriber_3",
        email: "subscriber3@example.com",
        name: null,
        subscribedAt: "2023-01-03T00:00:00.000Z",
        active: false
      }
    ]
  },
  {
    method: 'POST',
    path: '/api/newsletter',
    description: 'Subscribe to the newsletter',
    authorization: 'No authentication required',
    requestBody: {
      email: "new@example.com",
      name: "New Subscriber"
    },
    responseExample: {
      id: "subscriber_4",
      email: "new@example.com",
      name: "New Subscriber",
      subscribedAt: "2023-02-01T00:00:00.000Z",
      active: true
    }
  },
  {
    method: 'DELETE',
    path: '/api/newsletter',
    description: 'Unsubscribe from the newsletter',
    authorization: 'No authentication required, but needs valid unsubscribe token',
    requestBody: {
      email: "subscriber3@example.com",
      token: "valid-unsubscribe-token"
    },
    responseExample: {
      success: true,
      message: "Successfully unsubscribed"
    }
  }
]; 