import React, { useState } from 'react';
import { FaLock, FaEnvelope, FaUser } from 'react-icons/fa';
import { FaUnlock } from 'react-icons/fa6';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../../utils/APIs';
import { Error, Success } from '../../common/alert';
import Logo from '../../assets/logo.png';

const AuthForm = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignIn = async ({ email, password }) => {
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(API_ROUTES.SIGN_IN, { email, password });

            if (response.data.status === 200) {
                sessionStorage.setItem('token', response.data.data.token);
                sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async ({ first_name, last_name, email, password, confirm_password }) => {
        if (loading) return;
        if (password !== confirm_password) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            firstname: first_name,
            lastname: last_name,
            email,
            password,
            confirm_password,
        };

        try {
            const response = await axios.post(API_ROUTES.SIGN_UP, payload);

            if (response.data.status === 201) {
                setSuccess('Registration successful! Check your email for verification.');
                localStorage.setItem('verify-email', email);
                navigate('/verify');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 md:bg-none">
            <div className="relative w-full max-w-[850px] h-full md:h-[550px] flex flex-col md:flex-row rounded-3xl shadow-2xl md:bg-[#259ded] overflow-hidden">

                {/* Side Panel */}
                <div className={`hidden md:flex absolute top-0 left-0 w-1/2 h-full bg-blue-600 flex-col justify-center items-center text-center p-10 transition-transform duration-700 z-20 rounded-3xl ${isRegistering ? 'translate-x-full' : 'translate-x-0'}`}>
                    <img src={Logo} alt="Logo" className="mb-10 w-23 h-12" />
                    <h1 className="text-3xl font-bold text-white">
                        {isRegistering ? 'Welcome Back!' : 'Hello, Welcome!'}
                    </h1>
                    <p className="mt-2 mb-4 text-white">
                        {isRegistering ? 'Already have an account?' : 'Don’t have an account?'}
                    </p>
                    <button
                        onClick={() => {
                            setError(null);
                            setSuccess(null);
                            setIsRegistering(!isRegistering);
                        }}
                        className="w-40 h-12 text-white border-2 border-white rounded-md"
                    >
                        {isRegistering ? 'Login' : 'Register'}
                    </button>
                </div>

                {/* Form Container */}
                <div className="w-full h-full relative flex flex-col md:flex-row items-center justify-center">

                    {/* Register */}
                    <div className={`absolute md:static w-full text-center md:w-1/2 h-full flex flex-col justify-center items-center p-10 bg-white transition-all duration-700 ${isRegistering ? 'z-10 opacity-100 pointer-events-auto' : 'z-0 opacity-0 pointer-events-none'}`}>
                        <h1 className="text-3xl text-center font-bold mb-8">Register</h1>
                        <div className="flex flex-col items-center justify-center">
                            <form
                                className="w-full max-w-xs"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const { first_name, last_name, email, password, confirm_password } = e.target;

                                    handleSignUp({
                                        first_name: first_name.value.trim(),
                                        last_name: last_name.value.trim(),
                                        email: email.value.trim(),
                                        password: password.value,
                                        confirm_password: confirm_password.value,
                                    });
                                }}
                            >
                                {error && <Error message={error} />}
                                {success && <Success message={success} />}
                                <div className="flex gap-1 mb-4">
                                    <div className="relative w-1/2">
                                        <input
                                            type="text"
                                            name="first_name"
                                            placeholder="First Name"
                                            required
                                            className="w-full px-5 py-2 bg-gray-200 rounded-md"
                                        />
                                        <FaUser className="absolute top-1/2 right-4 transform -translate-y-1/2 text-md" />
                                    </div>
                                    <div className="relative w-1/2">
                                        <input
                                            type="text"
                                            name="last_name"
                                            placeholder="Last Name"
                                            required
                                            className="w-full px-5 py-2 bg-gray-200 rounded-md"
                                        />
                                        <FaUser className="absolute top-1/2 right-4 transform -translate-y-1/2 text-md" />
                                    </div>
                                </div>

                                <div className="relative mb-4">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        required
                                        className="w-full px-5 py-2 pr-12 bg-gray-200 rounded-md"
                                    />
                                    <FaEnvelope className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl" />
                                </div>

                                <div className="relative mb-4">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Password"
                                        required
                                        className="w-full px-5 py-2 pr-12 bg-gray-200 rounded-md"
                                    />
                                    <div
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl text-gray-600 cursor-pointer"
                                    >
                                        {showPassword ? <FaUnlock /> : <FaLock />}
                                    </div>
                                </div>

                                <div className="relative mb-4">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirm_password"
                                        placeholder="Confirm Password"
                                        required
                                        className="w-full px-5 py-2 pr-12 bg-gray-200 rounded-md"
                                    />
                                    <div
                                        onClick={() => setShowConfirmPassword(prev => !prev)}
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl text-gray-600 cursor-pointer"
                                    >
                                        {showConfirmPassword ? <FaUnlock /> : <FaLock />}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2 bg-[#259ded] text-white font-semibold rounded-md hover:bg-blue-700"
                                >
                                    {loading ? 'Registering...' : 'Register'}
                                </button>
                            </form>
                        </div>

                        <div className="text-sm text-left text-gray-600 mt-4">
                            <p className="text-center">
                                Already have an account?{' '}
                                <span
                                    onClick={() => setIsRegistering(false)}
                                    className="cursor-pointer text-blue-600 hover:underline"
                                >
                                    Login here
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Login */}
                    <div className={`absolute md:static w-full md:w-1/2 h-full flex flex-col justify-center items-center p-10 bg-white transition-all duration-700 ${isRegistering ? 'z-0 opacity-0 pointer-events-none' : 'z-10 opacity-100 pointer-events-auto'}`}>
                        <h1 className="text-3xl font-bold mb-8">Login</h1>
                        <form
                            className="w-full max-w-xs"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const { email, password } = e.target;
                                handleSignIn({
                                    email: email.value.trim(),
                                    password: password.value,
                                });
                            }}
                        >
                            {error && <Error message={error} />}
                            <div className="relative mb-4">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    required
                                    className="w-full px-5 py-2 pr-12 bg-gray-200 rounded-md"
                                />
                                <FaEnvelope className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl" />
                            </div>

                            <div className="relative mb-4">
                                <input
                                    type={showLoginPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    required
                                    className="w-full px-5 py-2 pr-12 bg-gray-200 rounded-md"
                                />
                                <div
                                    onClick={() => setShowLoginPassword(prev => !prev)}
                                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl text-gray-600 cursor-pointer"
                                >
                                    {showLoginPassword ? <FaUnlock /> : <FaLock />}
                                </div>
                            </div>

                            <div className="text-sm text-left text-gray-600 mb-4">
                                <a href="#" className="hover:underline">Forgot Password?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-[#259ded] text-white font-semibold rounded-md hover:bg-blue-700"
                            >
                                {loading ? 'Signing in...' : 'Login'}
                            </button>
                        </form>

                        <div className="text-sm text-left text-gray-600 mt-4">
                            <p className="text-center">
                                Don’t have an account?{' '}
                                <span
                                    onClick={() => setIsRegistering(true)}
                                    className="cursor-pointer text-blue-600 hover:underline"
                                >
                                    Register here
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
