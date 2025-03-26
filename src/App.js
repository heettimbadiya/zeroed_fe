import {Route, Routes} from 'react-router-dom'
import SignIn from './pages/Auth/signIn'
import Verify from './pages/Auth/verify'
import ROUTES_URL from './constant/routes'
import SignUp from './pages/Auth/signUp'
import React, {lazy, Suspense, useEffect, useState} from 'react'
import {PageLoading} from './common/Icons/Loading/pageLoading'
import ProtectedRoute from './helper/protectedRoute'
import Profile from './pages/Profile'
import ForgotPassword from './pages/Auth/ForgotPassword'
import OTPVerify from './pages/Auth/ForgotPassword/OTPVerify'
import ResetPassword from './pages/Auth/ForgotPassword/ResetPassword'
import ChatPopup from "./pages/ChatPopup/ChatPopup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Messaging from "./pages/Messaging/Messaging";
import Header from "./pages/Header";
import axios from "axios";
import {API_ROUTES} from "./utils/APIs";
import View from "./pages/View";

function App() {
    const Home = lazy(() => import('./pages/Home'))
    const localUser = localStorage.getItem('user')
    const user = JSON.parse(localUser)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)

        async function fetchData() {
            try {
                const response = await axios.get(API_ROUTES.GET_PROFILE_INFO + '/' + user?.id,)
                if (response?.data?.success) {
                    setData(response?.data?.data)
                    setLoading(false)
                }
            } catch (err) {
                setLoading(false)
            }
        }

        fetchData()
    }, [user?.id])
    return (<div>
        <Suspense fallback={<PageLoading/>}>
            <Routes>
                <Route
                    path={ROUTES_URL.SIGN_IN}
                    element={<ProtectedRoute>
                        <SignIn/>
                    </ProtectedRoute>}
                />
                <Route
                    path={ROUTES_URL.SIGN_UP}
                    element={<ProtectedRoute>
                        <SignUp/>
                    </ProtectedRoute>}
                />
                {/* --------Signup OTP Verify---------- */}
                <Route
                    path={ROUTES_URL.VERIFY}
                    element={<ProtectedRoute>
                        <Verify/>
                    </ProtectedRoute>}
                />
                <Route
                    path={ROUTES_URL.FORGOT_PASSWORD}
                    element={<ProtectedRoute>
                        <ForgotPassword/>
                    </ProtectedRoute>}
                />
                {/* -----------OTP Verify----------- */}
                <Route
                    path={ROUTES_URL.VERIFY_FORGOT_PASSWORD_OTP}
                    element={<ProtectedRoute>
                        <OTPVerify/>
                    </ProtectedRoute>}
                />
                <Route
                    path={ROUTES_URL.RESET_PASSWORD}
                    element={<ProtectedRoute>
                        <ResetPassword/>
                    </ProtectedRoute>}
                />
                <Route
                    path={ROUTES_URL.INITIAL}
                    element={<ProtectedRoute>
                        <Header
                            profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}
                            userId={user?.id}
                        />
                        <Home/>
                    </ProtectedRoute>}
                />
                <Route
                    path={ROUTES_URL.HOME}
                    element={<ProtectedRoute>
                        <Header
                            profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}
                            userId={user?.id}
                        />
                        <Home/>
                    </ProtectedRoute>}
                />
                <Route
                    path={ROUTES_URL.DASHBOARD}
                    element={<ProtectedRoute>
                        <Header
                            profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}
                            userId={user?.id}
                        />
                        <Dashboard/>
                    </ProtectedRoute>}
                />
                <Route
                    path={ROUTES_URL.MESSAGING}
                    element={<ProtectedRoute>
                        <Header
                            profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}
                            userId={user?.id}
                        />
                        <Messaging/>
                    </ProtectedRoute>}
                />
                <Route
                    path={`${ROUTES_URL.PROFILE}/:id`}
                    element={<>
                        <Header
                            profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}
                            userId={user?.id}
                        />
                        <Profile/>
                    </>}
                />
                <Route
                    path={`${ROUTES_URL.VIEW}/:id`}
                    element={<>
                        <View />
                    </>}
                />
            </Routes>
        </Suspense>
        <ChatPopup/>
    </div>)
}

export default App
