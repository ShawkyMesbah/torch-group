import { ApiEndpointType } from "../components/endpoint-list";

export const settingsEndpoints: ApiEndpointType[] = [
  {
    method: 'GET',
    path: '/api/settings/homepage-sections',
    description: 'Get the current order of homepage sections',
    authorization: 'No authentication required',
    requestBody: null,
    responseExample: {
      sections: [
        {
          id: "hero",
          name: "Hero",
          visible: true,
          order: 1
        },
        {
          id: "about",
          name: "About Us",
          visible: true,
          order: 2
        },
        {
          id: "services",
          name: "Services",
          visible: true,
          order: 3
        },
        {
          id: "projects",
          name: "Featured Projects",
          visible: true,
          order: 4
        },
        {
          id: "team",
          name: "Our Team",
          visible: true,
          order: 5
        },
        {
          id: "blog",
          name: "Latest Blog Posts",
          visible: true,
          order: 6
        },
        {
          id: "contact",
          name: "Contact Us",
          visible: true,
          order: 7
        }
      ]
    }
  },
  {
    method: 'PUT',
    path: '/api/settings/homepage-sections',
    description: 'Update the order of homepage sections',
    authorization: 'Admin only',
    requestBody: {
      sections: [
        {
          id: "hero",
          visible: true,
          order: 1
        },
        {
          id: "services",
          visible: true,
          order: 2
        },
        {
          id: "about",
          visible: true,
          order: 3
        },
        {
          id: "projects",
          visible: true,
          order: 4
        },
        {
          id: "team",
          visible: true,
          order: 5
        },
        {
          id: "blog",
          visible: false,
          order: 6
        },
        {
          id: "contact",
          visible: true,
          order: 7
        }
      ]
    },
    responseExample: {
      success: true,
      message: "Homepage sections updated successfully",
      sections: [
        {
          id: "hero",
          name: "Hero",
          visible: true,
          order: 1
        },
        {
          id: "services",
          name: "Services",
          visible: true,
          order: 2
        },
        {
          id: "about",
          name: "About Us",
          visible: true,
          order: 3
        },
        {
          id: "projects",
          name: "Featured Projects",
          visible: true,
          order: 4
        },
        {
          id: "team",
          name: "Our Team",
          visible: true,
          order: 5
        },
        {
          id: "blog",
          name: "Latest Blog Posts",
          visible: false,
          order: 6
        },
        {
          id: "contact",
          name: "Contact Us",
          visible: true,
          order: 7
        }
      ]
    }
  }
]; 