import { ApiEndpointType } from "../components/endpoint-list";

export const userEndpoints: ApiEndpointType[] = [
  {
    method: 'GET',
    path: '/api/users',
    description: 'Fetch all users in the system',
    authorization: 'Admin only',
    requestBody: null,
    responseExample: [
      {
        id: "user_1",
        name: "John Doe",
        email: "john@example.com",
        role: "ADMIN",
        image: "https://example.com/avatar1.jpg",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z"
      },
      {
        id: "user_2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "STAFF",
        image: "https://example.com/avatar2.jpg",
        createdAt: "2023-01-02T00:00:00.000Z",
        updatedAt: "2023-01-02T00:00:00.000Z"
      }
    ]
  },
  {
    method: 'GET',
    path: '/api/users/[id]',
    description: 'Fetch a specific user by ID',
    authorization: 'Admin or owner of account',
    requestBody: null,
    responseExample: {
      id: "user_1",
      name: "John Doe",
      email: "john@example.com",
      role: "ADMIN",
      image: "https://example.com/avatar1.jpg",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z"
    }
  },
  {
    method: 'POST',
    path: '/api/users',
    description: 'Create a new user',
    authorization: 'Admin only',
    requestBody: {
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
      role: "STAFF",
      image: "https://example.com/avatar.jpg"
    },
    responseExample: {
      id: "user_3",
      name: "New User",
      email: "newuser@example.com",
      role: "STAFF",
      image: "https://example.com/avatar.jpg",
      createdAt: "2023-01-03T00:00:00.000Z",
      updatedAt: "2023-01-03T00:00:00.000Z"
    }
  },
  {
    method: 'PUT',
    path: '/api/users/[id]',
    description: 'Update an existing user',
    authorization: 'Admin or owner of account',
    requestBody: {
      name: "Updated User",
      email: "updated@example.com",
      role: "STAFF",
      image: "https://example.com/new-avatar.jpg"
    },
    responseExample: {
      id: "user_1",
      name: "Updated User",
      email: "updated@example.com",
      role: "STAFF",
      image: "https://example.com/new-avatar.jpg",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-03T12:00:00.000Z"
    }
  },
  {
    method: 'DELETE',
    path: '/api/users/[id]',
    description: 'Delete a user',
    authorization: 'Admin only',
    requestBody: null,
    responseExample: {
      success: true,
      message: "User deleted successfully"
    }
  },
  {
    method: 'GET',
    path: '/api/users/count',
    description: 'Get total count of users in the system',
    authorization: 'Admin only',
    requestBody: null,
    responseExample: {
      count: 25
    }
  }
]; 