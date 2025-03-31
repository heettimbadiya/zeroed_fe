export const BASE_URL = "/";
const ROUTES_URL = {
  SIGN_IN: `/sign-in`,
  SIGN_UP: `/sign-up`,
  VERIFY: `/verify`, // verify email at the time of signup
  FORGOT_PASSWORD: `/forgot-password`,
  VERIFY_FORGOT_PASSWORD_OTP: `/otp-verify`,
  RESET_PASSWORD: `/reset-password`,
  INITIAL: `/`,
  VIEW: `/view`,
  HOME: `/home`,
  PROFILE: `/profile`,
  FEED: `/feed`,
  MESSAGING: `/messaging`,
  PRICING: `/pricing`,
  // --------------------------- ADMIN ROUTES ---------------------------------------------------
  ADMIN: `/admin`,
  DASHBOARD: `/dashboard`,
};

export default ROUTES_URL;
