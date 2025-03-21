import {Route, Routes} from 'react-router-dom'
import SignIn from './pages/Auth/signIn'
import Verify from './pages/Auth/verify'
import ROUTES_URL from './constant/routes'
import SignUp from './pages/Auth/signUp'
import {lazy, Suspense} from 'react'
import {PageLoading} from './common/Icons/Loading/pageLoading'
import ProtectedRoute from './helper/protectedRoute'
import Profile from './pages/Profile'
import ForgotPassword from './pages/Auth/ForgotPassword'
import OTPVerify from './pages/Auth/ForgotPassword/OTPVerify'
import ResetPassword from './pages/Auth/ForgotPassword/ResetPassword'
import ChatPopup from "./pages/ChatPopup/ChatPopup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Messaging from "./pages/Messaging/Messaging";

function App() {
    const Home = lazy(() => import('./pages/Home'))

    return (
        <div>
            <Suspense fallback={<PageLoading/>}>
                <Routes>
                    <Route
                        path={ROUTES_URL.SIGN_IN}
                        element={
                            <ProtectedRoute>
                                <SignIn/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES_URL.SIGN_UP}
                        element={
                            <ProtectedRoute>
                                <SignUp/>
                            </ProtectedRoute>
                        }
                    />
                    {/* --------Signup OTP Verify---------- */}
                    <Route
                        path={ROUTES_URL.VERIFY}
                        element={
                            <ProtectedRoute>
                                <Verify/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES_URL.FORGOT_PASSWORD}
                        element={
                            <ProtectedRoute>
                                <ForgotPassword/>
                            </ProtectedRoute>
                        }
                    />
                    {/* -----------OTP Verify----------- */}
                    <Route
                        path={ROUTES_URL.VERIFY_FORGOT_PASSWORD_OTP}
                        element={
                            <ProtectedRoute>
                                <OTPVerify/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES_URL.RESET_PASSWORD}
                        element={
                            <ProtectedRoute>
                                <ResetPassword/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES_URL.INITIAL}
                        element={
                            <ProtectedRoute>
                                <Home/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES_URL.HOME}
                        element={
                            <ProtectedRoute>
                                <Home/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES_URL.DASHBOARD}
                        element={
                            <ProtectedRoute>
                                <Dashboard/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES_URL.MESSAGING}
                        element={
                            <ProtectedRoute>
                                <Messaging />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={`${ROUTES_URL.PROFILE}/:id`}
                        element={
                            // <ProtectedRoute>
                            <Profile/>
                            // </ProtectedRoute>
                        }
                    />
                </Routes>
            </Suspense>
            <ChatPopup />
        </div>
    )
}

export default App
