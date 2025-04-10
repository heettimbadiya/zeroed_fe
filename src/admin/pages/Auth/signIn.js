import React, { useState, useEffect } from 'react';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../../utils/APIs';
import { Error, Success } from '../../common/alert';
import Logo from "../../../assets/logo.png";
import { Formik, Form } from 'formik';
import { signInValidation } from '../../constant/validation';

const SignIn = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [isVerify, setIsVerify] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyStatus = localStorage.getItem('verify');
        setIsVerify(!!verifyStatus);
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(API_ROUTES.SIGN_IN, values);
            if (response.data.status === 200) {
                sessionStorage.setItem('admin_token', response.data.data.token);
                sessionStorage.setItem('admin_user', JSON.stringify(response.data.data.user));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 md:bg-none">
            <div
                className="relative w-full max-w-[400px] md:max-w-[850px] h-full md:h-[550px] flex flex-col md:flex-row rounded-3xl shadow-2xl md:bg-[#259ded] overflow-hidden">

                {/* Left Side */}
                <div className="hidden md:flex md:w-1/2 bg-[#259ded] flex-col justify-center items-center text-center p-10 md:p-16">
                    <img src={Logo} alt="Logo" className="mb-10 w-30 h-12"/>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Hello, Welcome!</h1>
                    <p className="mt-2 mb-4 text-white">Don’t have an account?</p>
                </div>


                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-10 md:p-16">
                    <h1 className="text-3xl font-bold mb-8">Login</h1>
                    {error && <Error message={error}/>}
                    {isVerify && <Success message="Email verified successfully! Please login to continue..."/>}

                    <Formik
                        initialValues={{userName: '', password: ''}}
                        validationSchema={signInValidation}
                        onSubmit={handleSubmit}
                    >
                        {({setFieldValue, isValid}) => (
                            <Form className="w-full">
                                <div className="relative mb-4">
                                    <input
                                        type="name"
                                        name="userName"
                                        placeholder="Email"
                                        required
                                        className="w-full px-5 py-2 pr-12 bg-gray-200 rounded-md"
                                        onChange={(e) => setFieldValue('userName', e.target.value)}
                                    />
                                    <FaEnvelope
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl"/>
                                </div>

                                <div className="relative mb-3">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        required
                                        className="w-full px-5 py-2 pr-12 bg-gray-200 rounded-md"
                                        onChange={(e) => setFieldValue('password', e.target.value)}
                                    />
                                    <FaLock className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl"/>
                                </div>

                                <div className="text-sm text-left text-gray-600 mb-4">
                                    <a href="#" className="hover:underline">
                                        Forgot Password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !isValid}
                                    className="w-full py-3 bg-[#259ded] text-white font-semibold rounded-md hover:bg-blue-700"
                                >
                                    {loading ? 'Signing in...' : 'Login'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
