export { default } from "next-auth/middleware";

export const config = {
  matcher: [
      "/calendary/:path*",
      "/contact/:path*",
      "/groups/:path*",
      "/home/:path*",
      "/user/:path*",
  ],
  pages: {
      signIn: '/login'
  }
}