import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";


export default withAuth(async function middleware(request: NextRequest) {
   // console.log(request)
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