import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_KEY } from './helpers';

export function middleware(request: NextRequest) {
    const auth = request.cookies.has(SESSION_KEY);
    if (!auth) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard'
    ],
}