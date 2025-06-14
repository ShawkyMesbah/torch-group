import { Request, Response, Headers } from 'node-fetch';
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Import Jest DOM matchers
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Next.js dynamic imports
jest.mock('next/dynamic', () => (fn) => {
  const Component = fn();
  Component.displayName = 'LoadableComponent';
  return Component;
});

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
  };
};

// Mock NextResponse for API tests
jest.mock('next/server', () => {
  const actualNextServer = jest.requireActual('next/server');
  return {
    ...actualNextServer,
    NextResponse: {
      json: (data, init) => {
        const response = {
          status: init?.status || 200,
          headers: new Headers(init?.headers),
          ok: init?.status ? init.status >= 200 && init.status < 300 : true,
          json: async () => data,
        };
        Object.defineProperty(response, 'statusText', {
          get() {
            return this.ok ? 'OK' : 'Error';
          },
        });
        return response;
      },
    },
  };
});

// Mock Request and Response for API tests
// if (typeof Request === 'undefined') {
//   global.Request = class Request {
//     constructor(url, options = {}) {
//       this.url = url;
//       this.method = options.method || 'GET';
//       this.body = options.body;
//       this.headers = new Headers(options.headers);
//     }
//
//     async json() {
//       return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
//     }
//   };
// }

if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(body, options = {}) {
      this.body = body;
      this.status = options.status || 200;
      this.ok = this.status >= 200 && this.status < 300;
      this.headers = new Headers(options.headers);
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
    }
  };
}

// Mock Headers if not available
if (typeof Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this._headers = { ...init };
    }
    
    append(name, value) {
      this._headers[name.toLowerCase()] = value;
    }
    
    get(name) {
      return this._headers[name.toLowerCase()];
    }

    has(name) {
      return name.toLowerCase() in this._headers;
    }
  };
}

// Enable fake timers for all tests
jest.useFakeTimers();

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Suppress specific console warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  const errorMessage = String(args[0]);
  if (
    errorMessage.includes('Warning: ReactDOM.render is no longer supported') ||
    errorMessage.includes('onLoadingComplete') ||
    errorMessage.includes('act(...)') ||
    errorMessage.includes('lazy: Expected the result of a dynamic import()') ||
    errorMessage.includes('Received `false` for a non-boolean attribute') ||
    errorMessage.includes('Unknown event handler property')
  ) {
    return;
  }
  originalConsoleError(...args);
}; 