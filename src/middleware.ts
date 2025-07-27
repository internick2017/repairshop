import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(async function middleware(req: NextRequest) {
   // Add breadcrumb for route navigation in development
   if (process.env.NODE_ENV === 'development') {
     console.log(`[${new Date().toISOString()}] ${req.method} ${req.nextUrl.pathname}`);
   }
   
   // Sentry breadcrumb for route tracking (only on client-side)
   if (typeof window !== 'undefined') {
     try {
       const { addBreadcrumb } = await import('@/lib/sentry-utils');
       addBreadcrumb({
         message: `Route navigation: ${req.nextUrl.pathname}`,
         category: 'navigation',
         level: 'info',
         data: {
           url: req.nextUrl.pathname,
           method: req.method,
           userAgent: req.headers.get('user-agent') || undefined,
         },
       });
     } catch {
       // Silently fail if Sentry utils are not available
     }
   }
}, {
    isReturnToCurrentPage: true,
}
)


export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        * - login (login page)
        * - robots.txt (robots file)
        * - images (image files)
        * - homepage (represented by $ sign at the end of the path)
        * 
        */
        "/((?!api|_next/static|_next/image|favicon.ico|login|robots.txt|images|$).*)",
    ],
}