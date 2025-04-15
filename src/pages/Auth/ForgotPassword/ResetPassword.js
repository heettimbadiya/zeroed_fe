import { Link, useNavigate } from 'react-router-dom'
import { Form, Formik } from 'formik'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { API_ROUTES } from '../../../utils/APIs'
import ROUTES_URL from '../../../constant/routes'
import { Error, Success } from '../../../common/alert'
import { TextField } from '../../../component/InputField'
import { ArrowRight, Loader } from '../../../common/Icons'
import { resetPasswordValidation } from '../../../constant/validation'
import logo from '../../../assets/logo.png'
import forgotPassword from '../../../assets/forgotPassword.png'

function ResetPassword() {
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
      const response = await axios.post(API_ROUTES.RESET_PASSWORD, {
        email: defaultEmail,
        newPassword: values.password,
      })
      if (response.data.status === 200) {
        setError(null)
        localStorage.clear()
        navigate(ROUTES_URL.SIGN_IN)
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
          <div className="text-center">

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
              <h2 className="text-2xl font-bold text-black">Please check your email!</h2>
              <p className="text-gray-500 mt-2">
                We've emailed a 4-digit confirmation code. <br/>
                Please enter the code in the box below to verify your email.
              </p>
            </div>

            <div className="mt-6 w-full">
              {error && <Error message={error}/>}
              <Formik
                  initialValues={{
                    password: '',
                    confirm_password: '',
                  }}
                  validationSchema={resetPasswordValidation}
                  onSubmit={(values) => {
                    handleSubmit(values)
                  }}
              >
                {({isSubmitting, setFieldValue, isValid}) => (
                    <Form>
                      <TextField
                          type="password"
                          label="password"
                          name="password"
                          placeholder="* * * * * * * *"
                          onChange={(e) => setFieldValue('password', e.target.value)}
                      />
                      <TextField
                          type="password"
                          label="Confirm password"
                          name="confirm_password"
                          placeholder="* * * * * * * *"
                          onChange={(e) =>
                              setFieldValue('confirm_password', e.target.value)
                          }
                      />
                      <button
                          type="submit"
                          className={`flex gap-x-2 justify-center items-center rounded w-full p-2 mt-4 ${
                              isValid ? 'bg-primary' : 'bg-[#adbfdd]'
                          }`}
                          // disabled={isValid ? false : true}
                      >
                        {loading ? (
                            <Loader/>
                        ) : (
                            <>
                        <span className="text-white text-base font-bold capitalize">
                          continue
                        </span>
                              <ArrowRight/>
                            </>
                        )}
                      </button>
                    </Form>
                )}
              </Formik>
            </div>

            <div className="flex gap-x-1 justify-end text-sm mt-2">
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

export default ResetPassword
