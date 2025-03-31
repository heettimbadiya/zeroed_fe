import {Route, Routes} from 'react-router-dom'
import SignIn from './pages/Auth/signIn'
import ROUTES_URL from './constant/routes'
import React, {Suspense} from 'react'
import {PageLoading} from './common/Icons/Loading/pageLoading'
import ProtectedRoute from './helper/protectedRoute'
import MainLayout from "./layout/sidebar/MainLayout";

function AdminApp() {
    const localUser = localStorage.getItem('user')

    return (<div>
        <Suspense fallback={<PageLoading/>}>
            <Routes>
                <Route
                    path={ROUTES_URL.SIGN_IN}
                    element={<ProtectedRoute>
                        <SignIn/>
                    </ProtectedRoute>}
                />


                {/*------------------------------------------------------ ADMIN ROUTES ------------------------------------------------------------*/}
                {/*<Route*/}
                {/*    path={`${ROUTES_URL.SIGN_IN}`}*/}
                {/*    element={<ProtectedRoute>*/}
                {/*        <MainLayout/>*/}
                {/*    </ProtectedRoute>}*/}
                {/*/>*/}
                <Route
                    path={`${ROUTES_URL.DASHBOARD}/*`}
                    element={<ProtectedRoute>
                        <MainLayout/>
                    </ProtectedRoute>}
                />
            </Routes>
        </Suspense>
        {/*<ChatPopup/>*/}
    </div>)
}

export default AdminApp
