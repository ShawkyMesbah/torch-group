const fs = require('fs');
const path = require('path');

// Create sample analytics events
const sampleEvents = [
  {
    id: "local_1715716200000_a1b2c3d",
    type: "PAGE_VIEW",
    meta: {
      path: "/",
      referrer: "",
      userAgent: "Mozilla/5.0",
      timestamp: "2024-05-14T10:10:00.000Z"
    },
    createdAt: "2024-05-14T10:10:00.000Z"
  },
  {
    id: "local_1715716260000_e4f5g6h",
    type: "PAGE_VIEW",
    meta: {
      path: "/about",
      referrer: "/",
      userAgent: "Mozilla/5.0",
      timestamp: "2024-05-14T10:11:00.000Z"
    },
    createdAt: "2024-05-14T10:11:00.000Z"
  },
  {
    id: "local_1715716320000_i7j8k9l",
    type: "FORM_SUBMIT",
    meta: {
      formId: "contact-form",
      formData: {},
      path: "/contact",
      timestamp: "2024-05-14T10:12:00.000Z"
    },
    createdAt: "2024-05-14T10:12:00.000Z"
  },
  {
    id: "local_1715716380000_m1n2o3p",
    type: "PHONE_VERIFIED",
    meta: {
      phone: "+123***4567",
      path: "/contact",
      timestamp: "2024-05-14T10:13:00.000Z"
    },
    createdAt: "2024-05-14T10:13:00.000Z"
  },
  {
    id: "local_1715716440000_q4r5s6t",
    type: "TALENT_CLICK",
    meta: {
      talentId: "talent1",
      talentName: "John Doe",
      path: "/",
      timestamp: "2024-05-14T10:14:00.000Z"
    },
    createdAt: "2024-05-14T10:14:00.000Z"
  },
  {
    id: "local_1715716500000_u7v8w9x",
    type: "TALENT_CLICK",
    meta: {
      talentId: "talent1",
      talentName: "John Doe",
      path: "/",
      timestamp: "2024-05-14T10:15:00.000Z"
    },
    createdAt: "2024-05-14T10:15:00.000Z"
  },
  {
    id: "local_1715716560000_y1z2a3b",
    type: "TALENT_CLICK",
    meta: {
      talentId: "talent2",
      talentName: "Jane Smith",
      path: "/",
      timestamp: "2024-05-14T10:16:00.000Z"
    },
    createdAt: "2024-05-14T10:16:00.000Z"
  },
  {
    id: "local_1715716620000_c4d5e6f",
    type: "PAGE_VIEW",
    meta: {
      path: "/services",
      referrer: "/",
      userAgent: "Mozilla/5.0",
      timestamp: "2024-05-14T10:17:00.000Z"
    },
    createdAt: "2024-05-14T10:17:00.000Z"
  }
];

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write the events to the file
const filePath = path.join(dataDir, 'analytics-events.json');
fs.writeFileSync(filePath, JSON.stringify(sampleEvents, null, 2));

console.log(`Created sample analytics events at ${filePath}`);
console.log(`Total events: ${sampleEvents.length}`); 