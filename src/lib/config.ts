export const serverConfig = {
  authCookieName: "_link_ease_session",
  authCookieOptions: {
    maxAge: 60 * 60 * 24 * 5, // 5 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
  authCookiePath: "/",
};

export const clientConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002",
  domain: process.env.NEXT_PUBLIC_DOMAIN || "localhost:9002",
};
