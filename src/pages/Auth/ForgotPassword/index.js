import { Link, useNavigate } from 'react-router-dom'
import { Form, Formik } from 'formik'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { API_ROUTES } from '../../../utils/APIs'
import ROUTES_URL from '../../../constant/routes'
import { Error, Success } from '../../../common/alert'
import { TextField } from '../../../component/InputField'
import { ArrowRight, Loader } from '../../../common/Icons'
import { forgotPasswordValidation } from '../../../constant/validation'
import logo from '../../../assets/logo (1).png'
import forgotPassword from '../../../assets/forgotPassword.png'

function ForgotPassword() {
  let navigate = useNavigate()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await axios.post(API_ROUTES.FORGOT_PASSWORD, values)
      if (response.data.status === 200) {
        setError(null)
        localStorage.setItem('forgot-email', JSON.stringify(values.email))
        navigate(ROUTES_URL.VERIFY_FORGOT_PASSWORD_OTP)
        setLoading(false)
      }
    } catch (error) {
      setError(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div>

            <div className="text-center mt-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-md">
                  <img
                      src={logo}
                      className="flex justify-center items-center "
                      width="150px"
                      alt="logo"
                  />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-black">Forgot Password</h2>
              <p className="text-gray-500 mt-2">
                Easily reset your password if you've forgotten it. Just enter your registered email address and we'll send you a link to create a new password.
              </p>
            </div>

          <div className="mt-6 w-full">
            {error && <Error message={error} />}

            <Formik
              initialValues={{
                email: '',
              }}
              validationSchema={forgotPasswordValidation}
              onSubmit={(values) => {
                handleSubmit(values)
              }}
            >
              {({ isSubmitting, setFieldValue, isValid }) => (
                <Form>
                  <TextField
                    type="email"
                    label="email"
                    name="email"
                    placeholder="youremail@domain.com"
                    onChange={(e) => setFieldValue('email', e.target.value)}
                  />

                  <button
                    type="submit"
                    className={`flex gap-x-2 justify-center items-center rounded w-full p-2 mt-4 ${
                      isValid ? 'bg-primary' : 'bg-[#adbfdd]'
                    }`}
                  >
                    {loading ? (
                      <Loader />
                    ) : (
                      <>
                        <span className="text-white text-base font-bold capitalize">
                          continue
                        </span>
                        <ArrowRight />
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div className="flex gap-x-1 justify-center text-sm mt-2 mb-8">
            <span className="text-gray-400">Back to</span>
            <Link to={ROUTES_URL.SIGN_IN}>
              <span className="text-primary font-bold uppercase">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
