const URL = process.env.REACT_APP_AUTH_URL

export const API_ROUTES = {
  SIGN_IN: `${URL}/auth/login`,
  SIGN_UP: `${URL}/auth/signup`,
  VERIFY_OTP: `${URL}/auth/verify-otp`,
  USER: `${URL}/user/basic-details`,
  FEED : `${URL}/feed`,
  NOC_NUMBERS: `${URL}/industry`, // Add this if not already present
  BROADCAST : `${URL}/chat/broadcast`,
  ALL_CHAT : `${URL}/chat/all-chats`,
  SEARCH : `${URL}/get-users`,
  CHAT_MESSAGES : `${URL}/messages`,
  POST_CHAT : `${URL}/chat/create`,
  ALL_CHATS : `${URL}/chat/all-chats`,
}
