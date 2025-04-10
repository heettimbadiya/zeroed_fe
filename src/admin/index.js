import {Route, Routes} from 'react-router-dom'
import SignIn from './pages/Auth/signIn'
import ROUTES_URL from './constant/routes'
import React, {Suspense} from 'react'
import {PageLoading} from './common/Icons/Loading/pageLoading'
import MainLayout from "./layout/sidebar/MainLayout";
import AdminProtectedRoute from "./helper/protectedRoute";

function AdminApp() {

    return (<div>
        <Suspense fallback={<PageLoading/>}>
            <Routes>
                <Route
                    path={ROUTES_URL.SIGN_IN}
                    element={<AdminProtectedRoute>
                        <SignIn/>
                    </AdminProtectedRoute>}
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
                    element={<AdminProtectedRoute>
                        <MainLayout/>
                    </AdminProtectedRoute>}
                />
            </Routes>
        </Suspense>
        {/*<ChatPopup/>*/}
    </div>)
}

export default AdminApp
