import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the error parameter if any
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');
  
  // Redirect to our custom unauthorized page
  redirect('/unauthorized');
} 