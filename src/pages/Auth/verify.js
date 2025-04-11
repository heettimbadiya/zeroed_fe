import {
  ArrowRight,
  Loader,
  SuccessIcon,
} from '../../common/Icons';
import ROUTES_URL from '../../constant/routes';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { otpVerifyValidation } from '../../constant/validation';
import { useState } from 'react';
import axios from 'axios';
import { Error } from '../../common/alert';
import { API_ROUTES } from '../../utils/APIs';
import logo from '../../assets/logo (1).png';
import auth from '../../assets/auth.png';

function Verify() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    const email = localStorage.getItem('verify-email');
    try {
      const response = await axios.post(API_ROUTES.VERIFY_OTP, {
        email: email,
        otp: values.otp,
      });
      if (response.data.status === 200) {
        setError(null);
        localStorage.removeItem('verify-email');
        localStorage.setItem('verify', true);
        navigate(ROUTES_URL.SIGN_IN);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

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
                We've emailed a 4-digit confirmation code. <br />
                Please enter the code in the box below to verify your email.
              </p>
            </div>

            <div className="mt-6 w-full">
              {error && <Error message={error} />}
              <Formik
                  initialValues={{
                    otp: '',
                  }}
                  validationSchema={otpVerifyValidation}
                  onSubmit={(values) => handleSubmit(values)}
              >
                {({ setFieldValue, values, isValid }) => (
                    <Form>
                      {/* OTP Field - 4 digits only */}
                      <div className="flex justify-center gap-2 mb-4">
                        {[...Array(4)].map((_, idx) => (
                            <input
                                key={idx}
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 border border-gray-300 rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                value={values.otp[idx] || ''}
                                onChange={(e) => {
                                  let value = e.target.value.replace(/[^0-9]/g, '');
                                  const otpArr = values.otp.split('');
                                  otpArr[idx] = value;
                                  setFieldValue('otp', otpArr.join(''));

                                  const next = e.target.nextSibling;
                                  if (value && next) next.focus();
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
                                    e.target.previousSibling.focus();
                                  }
                                }}
                            />
                        ))}
                      </div>

                      <button
                          type="submit"
                          className={`flex gap-x-2 justify-center items-center rounded w-full p-2 ${
                              isValid ? 'bg-primary' : 'bg-[#adbfdd]'
                          }`}
                          disabled={!isValid || loading}
                      >
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                              <span className="text-white text-base font-bold">Verify</span>
                              <ArrowRight />
                            </>
                        )}
                      </button>
                    </Form>
                )}
              </Formik>
            </div>

            <div className="flex gap-x-1 justify-center text-sm mt-4 mb-8">
              <span className="text-gray-400">Don’t have a code?</span>
              <span className="text-primary font-bold uppercase cursor-pointer">
              Resend
            </span>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Verify;
