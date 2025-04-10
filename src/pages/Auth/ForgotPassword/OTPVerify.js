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
import logo from '../../../assets/logo.png'
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
    <div className="lg:flex w-screen">
      <div className="h-full lg:w-1/2">
        <img
          src={logo}
          className="flex justify-center items-center xl:mx-10 mx-4 mt-10"
          width="64px"
          alt="logo"
        />
        <div className="xl:px-[6.25rem] px-4 lg:min-h-[calc(100vh-56px)] h-full flex flex-col justify-center items-center w-full">
          <div className="mt-8 w-full text-start">
            <div className="text-[2.5rem] font-bold leading-[3.25rem] lato text-black text-start">
              OTP Verify
            </div>
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

          <div className="flex gap-x-1 justify-end text-sm mt-2">
            <span className="text-gray-400">Back to</span>
            <Link to={ROUTES_URL.SIGN_IN}>
              <span className="text-primary font-bold uppercase">Login</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="lg:block hidden w-1/2 bg-primary-100 p-10">
        <div className="flex justify-center items-center lg:min-h-[calc(100vh-105px)] h-full">
          <img src={forgotPassword} className="h-auto w-auto" alt="login" />
        </div>
      </div>
    </div>
  )
}

export default OTPVerify
