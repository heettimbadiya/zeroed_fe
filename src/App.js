import {Route, Routes} from 'react-router-dom'
import SignIn from './admin/pages/Auth/signIn'
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
import Feed from "./pages/Feed/Feed";
import Messaging from "./pages/Messaging/Messaging";
import Header from "./pages/Header";
import axios from "axios";
import {API_ROUTES} from "./utils/APIs";
import View from "./pages/View";
import Pricing from "./pages/Pricing/Pricing";
import AdminApp from "./admin";
import UserSignIn from "./pages/Auth/signIn";
import {Toaster} from "react-hot-toast";

function App() {
    const Home = lazy(() => import('./pages/Home'));

    return (<div>
        <Toaster />
        <Suspense fallback={<PageLoading/>}>
            <Routes>
                <Route
                    path={ROUTES_URL.SIGN_IN}
                    element={<ProtectedRoute>
                        <UserSignIn/>
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
                            // profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}
                            // slug={data?.basicDetails ? data?.basicDetails?.slug : null}
                            // userId={user?.id || data?.basicDetails?.user_id}
                        />
                        <Home/>
                    </ProtectedRoute>}
                />
                <Route
                    path={ROUTES_URL.HOME}
                    element={<ProtectedRoute>
                        <Header
                            // profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}
                            // slug={data?.basicDetails ? data?.basicDetails?.slug : null}
                            // userId={user?.id || data?.basicDetails?.user_id}
                        />
                        <Home/>
                    </ProtectedRoute>}
                />
                <Route
                    path={ROUTES_URL.FEED}
                    element={<ProtectedRoute>
                        <Header
                            // profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}
                            // slug={data?.basicDetails ? data?.basicDetails?.slug : null}
                            //  userId={user?.id || data?.basicDetails?.user_id}
                        />
                        <Feed/>
                    </ProtectedRoute>}
                />
                <Route
                    path={ROUTES_URL.MESSAGING}
                    element={<ProtectedRoute>
                        <Header
                            // profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}
                            // slug={data?.basicDetails ? data?.basicDetails?.slug : null}
                            //  userId={user?.id || data?.basicDetails?.user_id}
                        />
                        <Messaging/>
                    </ProtectedRoute>}
                />
                <Route
                    path={ROUTES_URL.PRICING}
                    element={<ProtectedRoute>
                        <Header
                            // profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}
                            // slug={data?.basicDetails ? data?.basicDetails?.slug : null}
                            //  userId={user?.id || data?.basicDetails?.user_id}
                        />
                        <Pricing/>
                    </ProtectedRoute>}
                />
                <Route
                    path={`${ROUTES_URL.PROFILE}/:id`}
                    element={<>
                        <Header
                            // profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}
                            // slug={data?.basicDetails ? data?.basicDetails?.slug : null}
                            //  userId={user?.id || data?.basicDetails?.user_id}
                        />
                        <Profile/>
                    </>}
                />
                 <Route
                    path={`${ROUTES_URL.INBOX}`}
                    element={<>
                        <Header
                            // profile={data?.basicDetails ? data?.basicDetails?.profile_pic : null}
                            // slug={data?.basicDetails ? data?.basicDetails?.slug : null}
                            //  userId={user?.id || data?.basicDetails?.user_id}
                        />
                        <Feed/>
                    </>}
                />
                <Route
                    path={`${ROUTES_URL.VIEW}/:id`}
                    element={<>
                        <View/>
                    </>}
                />
                <Route
                    path={ROUTES_URL.CHAT}
                    element={<>
                        <Messaging/>
                    </>}
                />
            </Routes>

           <AdminApp/>
        </Suspense>
    </div>)
}

export default App
