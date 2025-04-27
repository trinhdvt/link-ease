export const serverConfig = {
  authCookieName: "_link_ease_session",
  authCookieOptions: {
    maxAge: 60 * 60 * 24 * 5, // 5 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
  authCookiePath: "/",
};
