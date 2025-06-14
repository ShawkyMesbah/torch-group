import React from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ApiEndpointType = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  authorization: string;
  requestBody: object | null;
  responseExample: object;
};

export function ApiEndpoint({
  method,
  path,
  description,
  authorization,
  requestBody,
  responseExample
}: ApiEndpointType) {
  const [copied, setCopied] = React.useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Determine method color
  const methodColors = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    PATCH: 'bg-orange-100 text-orange-800',
    DELETE: 'bg-red-100 text-red-800'
  };
  
  const methodColor = methodColors[method] || 'bg-gray-100 text-gray-800';
  
  return (
    <div className="p-6 border-b last:border-b-0">
      <div className="flex items-start justify-between mb-4">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${methodColor}`}>
              {method}
            </span>
            <h3 className="text-lg font-semibold flex-1">{path}</h3>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 h-8 w-8 p-0"
              onClick={() => copyToClipboard(path)}
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-gray-600">{description}</p>
          <p className="text-sm mt-1">
            <span className="font-medium">Authorization:</span> {authorization}
          </p>
        </div>
      </div>
      
      {requestBody && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Request Body</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(requestBody, null, 2)}
          </pre>
        </div>
      )}
      
      <div>
        <h4 className="text-sm font-medium mb-2">Response Example</h4>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
          {JSON.stringify(responseExample, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export function EndpointList({ endpoints }: { endpoints: ApiEndpointType[] }) {
  return (
    <div className="bg-white rounded-lg shadow divide-y">
      {endpoints.map((endpoint, index) => (
        <ApiEndpoint key={`${endpoint.method}-${endpoint.path}-${index}`} {...endpoint} />
      ))}
    </div>
  );
} 