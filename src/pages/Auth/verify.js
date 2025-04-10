import {
  ArrowLeftBlue,
  ArrowRight,
  Loader,
  SuccessIcon,
} from '../../common/Icons'
import ROUTES_URL from '../../constant/routes'
import { Link, useNavigate } from 'react-router-dom'
import { TextField } from '../../component/InputField'
import { Form, Formik } from 'formik'
import { otpVerifyValidation } from '../../constant/validation'
import { useState } from 'react'
import axios from 'axios'
import { Error } from '../../common/alert'
import { API_ROUTES } from '../../utils/APIs'
import logo from '../../assets/logo.png'
import auth from '../../assets/auth.png'

function Verify() {
  let navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (values) => {
    setLoading(true)
    const email = localStorage.getItem('verify-email')
    try {
      const response = await axios.post(API_ROUTES.VERIFY_OTP, {
        email: email,
        otp: values.otp,
      })
      if (response.data.status === 200) {
        setError(null)
        localStorage.removeItem('verify-email')
        localStorage.setItem('verify', true)
        navigate(ROUTES_URL.SIGN_IN)
      }
    } catch (error) {
      setError(error.response.data.message)
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
              Sign in with login code
            </div>
            <div className="text-lg font-normal text-gray-500 mt-2">
              We have sent you one-time code on your email.
            </div>
          </div>

          <div className="mt-6 w-full">
            {error && <Error message={error} />}
            <Formik
              initialValues={{
                otp: '',
              }}
              validationSchema={otpVerifyValidation}
              onSubmit={(values) => {
                handleSubmit(values)
              }}
            >
              {({ setFieldValue, isValid }) => (
                <Form>
                  <TextField
                    label="Enter 4 digit code"
                    type="otp"
                    name="otp"
                    placeholder="* * * *"
                    onChange={(e) => setFieldValue('otp', e.target.value)}
                    icon={
                      <div className="p-1 bg-[#5EB500] rounded-full h-6 w-6 flex justify-center items-center">
                        <SuccessIcon />
                      </div>
                    }
                  />
                  <button
                    className={`flex gap-x-2 justify-center items-center rounded w-full p-2 mt-4 ${
                      isValid ? 'bg-primary' : 'bg-[#adbfdd]'
                    }`}
                    disabled={isValid ? false : true || loading ? false : true}
                  >
                    {loading ? (
                      <Loader />
                    ) : (
                      <>
                        <span className="text-white text-base font-bold">
                          Verify
                        </span>
                        <ArrowRight />
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div className="flex gap-x-1 justify-end text-sm mt-2 mb-8">
            <span className="text-gray-400">Don't received your code?</span>
            <span>
              <span className="text-primary font-bold uppercase cursor-pointer">
                Resend
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="lg:block hidden w-1/2 bg-primary-100 p-10">
        <div className="flex justify-center items-center lg:min-h-[calc(100vh-105px)] h-full">
          <img src={auth} className="h-auto w-auto" alt="login" />
        </div>
      </div>
    </div>
  )
}

export default Verify
