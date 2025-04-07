const URL = process.env.REACT_APP_AUTH_URL

export const API_ROUTES = {
  SIGN_IN: `${URL}/auth/login`,
  SIGN_UP: `${URL}/auth/signup`,
  VERIFY_OTP: `${URL}/auth/verify-otp`,
  USER: `${URL}/user/basic-details`,
  FEED : `${URL}/feed`,
  BROADCAST : `${URL}/broadcast`,
  ALL_CHAT : `${URL}/all-chats`,
  CHAT_MESSAGES : `${URL}/messages`,
}
