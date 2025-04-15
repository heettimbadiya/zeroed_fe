import { Link, useNavigate } from 'react-router-dom'
import { Form, Formik } from 'formik'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { API_ROUTES } from '../../../utils/APIs'
import ROUTES_URL from '../../../constant/routes'
import { Error, Success } from '../../../common/alert'
import { TextField } from '../../../component/InputField'
import { ArrowRight, Loader } from '../../../common/Icons'
import { forgotPasswordOTPVerifyValidation } from '../../../constant/validation'
import logo from '../../../assets/logo (1).png'
import forgotPassword from '../../../assets/forgotPassword.png'

function OTPVerify() {
  let navigate = useNavigate()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [defaultEmail, setDefaultEmail] = useState(null)

  useEffect(() => {
    const email = localStorage.getItem('forgot-email')
    if (email) {
      setDefaultEmail(JSON.parse(email))
    } else {
      setDefaultEmail('')
    }
  }, [])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await axios.post(
        API_ROUTES.VERIFY_FORGOT_PASSWORD_OTP,
        values,
      )
      if (response.data.status === 200) {
        setError(null)
        navigate(ROUTES_URL.RESET_PASSWORD)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setError(error.response.data)
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
              <h2 className="text-2xl font-bold text-black">OTP Verify</h2>
              <p className="text-gray-500 mt-2">
                Secure your account by verifying your email address. An OTP has been sent to your email. Please enter the code below to complete the verification process.
              </p>
            </div>

          <div className="mt-6 w-full">
            {error && <Error message={error} />}
            {defaultEmail !== null ? (
              <Formik
                initialValues={{
                  email: defaultEmail || '',
                  otp: '',
                }}
                validationSchema={forgotPasswordOTPVerifyValidation}
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
                    <TextField
                      type="otp"
                      label="OTP"
                      name="otp"
                      placeholder="****"
                      onChange={(e) => setFieldValue('otp', e.target.value)}
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
            ) : (
              <div className="h-10 flex justify-center items-center">
                <Loader color="#2557a7" />
              </div>
            )}
          </div>

          <div className="flex gap-x-1 justify-center text-sm mt-2">
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

export default OTPVerify
