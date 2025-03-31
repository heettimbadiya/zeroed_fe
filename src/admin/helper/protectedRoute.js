import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ROUTES_URL from '../constant/routes'

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const email = localStorage.getItem('verify-email')
  const emailForForgot = localStorage.getItem('forgot-email')

  useEffect(() => {
    if (
      !token &&
      ![
        ROUTES_URL.SIGN_IN,
      ].includes(location.pathname)
    ) {
      navigate(ROUTES_URL.SIGN_IN)
    }

    // if (
    //   !email &&
    //   [ROUTES_URL.VERIFY, ROUTES_URL.INITIAL].includes(location.pathname)
    // ) {
    //   navigate(ROUTES_URL.SIGN_IN)
    // }
    // if (
    //   !emailForForgot &&
    //   [
    //     ROUTES_URL.VERIFY_FORGOT_PASSWORD_OTP,
    //     ROUTES_URL.RESET_PASSWORD,
    //   ].includes(location.pathname)
    // ) {
    //   navigate(ROUTES_URL.SIGN_IN)
    // }

    // New condition for RESET_PASSWORD route
    // if (location.pathname === ROUTES_URL.RESET_PASSWORD) {
    //   if (token) {
    //     navigate(ROUTES_URL.HOME);
    //   } 
    // }

    // If the user has a token and is trying to access sign-in, sign-up, or verify, redirect to home
    if (
      token &&
      [ROUTES_URL.SIGN_IN].includes(
        location.pathname,
      )
    ) {
      navigate(ROUTES_URL.DASHBOARD)
    }
  }, [email, token, emailForForgot, navigate, location.pathname])

  return children
}

export default ProtectedRoute
