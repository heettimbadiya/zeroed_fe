import { ArrowRight, Loader } from '../../common/Icons'
import { Link, useNavigate } from 'react-router-dom'
import ROUTES_URL from '../../constant/routes'
import { Form, Formik } from 'formik'
import { TextField } from '../../component/InputField'
import { signInValidation } from '../../constant/validation'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Error, Success } from '../../common/alert'
import { API_ROUTES } from '../../utils/APIs'
import logo from '../../assets/logo.png'
import auth from '../../assets/auth.png'

function UserSignIn() {
  let navigate = useNavigate()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const [isVerify, setIsVerify] = useState(false)

  useEffect(() => {
    const verifyStatus = localStorage.getItem('verify')
    if (verifyStatus) {
      setIsVerify(true)
    } else {
      setIsVerify(false)
    }
  }, [isVerify])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
        sessionStorage.clear()
      const response = await axios.post(API_ROUTES.SIGN_IN, values)
      if (response.data.status === 200) {
        setError(null)
        sessionStorage.setItem('token', response.data.data.token)
        sessionStorage.setItem('user', JSON.stringify(response.data.data.user))
        navigate(ROUTES_URL.HOME)
        setLoading(false)
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
          <div className="mt-8">
            <div className="text-[2.5rem] font-bold leading-[3.25rem] text-black">
              Welcome
            </div>
            <div className="text-lg font-normal text-gray-500 mt-2">
              Sign in account to continue...
            </div>
            <div className="text-xs font-normal leading-[1.125rem] text-gray-500">
              By creating an account or signing in, you understand and agree to
              Job Site's Terms. You also consent to our Cookie and Privacy
              policies. You will receive marketing messages from Job Site and
              may opt out at any time by following the unsubscribe link in our
              messages, or as detailed in our terms.
            </div>
          </div>

          <div className="mt-6 w-full">
            {error && <Error message={error} />}
            {isVerify && (
              <Success message=" Email verified successful! please login to continue..." />
            )}
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={signInValidation}
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
                    type="password"
                    label="password"
                    name="password"
                    placeholder="* * * * * * * *"
                    onChange={(e) => setFieldValue('password', e.target.value)}
                  />
                  <div
                    className="font-semibold text-right text-sm text-primary cursor-pointer underline"
                    onClick={() => navigate(ROUTES_URL.FORGOT_PASSWORD)}
                  >
                    Forgot Password
                  </div>
                  <button
                    className={`flex gap-x-2 justify-center items-center rounded w-full p-2 mt-4 ${
                      isValid ? 'bg-primary' : 'bg-[#adbfdd]'
                    }`}
                    disabled={isValid ? false : true}
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

          <div className="flex gap-x-1 justify-end text-sm mt-2 mb-8">
            <span className="text-gray-400">Don't have account</span>
            <Link to={ROUTES_URL.SIGN_UP}>
              <span className="text-primary font-bold uppercase">Signup</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="lg:block hidden w-1/2 bg-primary-100 p-10">
        <div className='flex justify-center items-center lg:min-h-[calc(100vh-105px)] h-full'>
          <img src={auth} className="h-auto w-auto" alt="login" />
        </div>
      </div>
    </div>
  )
}

export default UserSignIn
