const URL = process.env.REACT_APP_AUTH_URL

export const API_ROUTES = {
  SIGN_IN: `${URL}/auth/login`,
  SIGN_UP: `${URL}/auth/signup`,
  VERIFY_OTP: `${URL}/auth/verify-otp`,

  FORGOT_PASSWORD: `${URL}/auth/forgot-password`,
  VERIFY_FORGOT_PASSWORD_OTP: `${URL}/auth/forgot-password-otp-verify`,
  RESET_PASSWORD: `${URL}/auth/reset-password`,

  CREATE_PROFILE: `${URL}/user/all-details`,
  GET_PROFILE: `${URL}/user/get-details`,
  GET_PROFILE_INFO: `${URL}/user/get-data`,
  UPDATE_PROFILE: `${URL}/user/update-profile/`,
  DELETE_WORK_EXPERIENCE: `${URL}/work-experience/delete/`,
  DELETE_PROJECT: `${URL}/project/delete/`,
  DELETE_INTERNATIONAL_EDUCATION: `${URL}/international-education/delete/`,
  DELETE_CANADIAN_EDUCATION: `${URL}/canadian-education/delete/`,
  UPDATE_SECONDARY_VIDEO: `${URL}/user/update-secondary-video/`,
  ALL_CHAT : `${URL}/chat/all-chats`,
  CREATE_CHAT : `${URL}/chat/create`,
  SEND_MESSAGES : `${URL}/message/send`,
  CHAT_MESSAGES : `${URL}/message`,
  CAREER_INDUSTRY : `${URL}/industry`,
  FEEDS : `${URL}/feed`,
  BROADCAST : `${URL}/message/broadcast`,
  SEARCH : `${URL}/get-users`,
  POST_CHAT : `${URL}/chat/create`,

}
