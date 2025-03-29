import React, { useState } from "react";
import Sidebar from "../../component/sidebar/Sidebar";
import Header from "../../component/sidebar/Header";
import {Route, Routes} from "react-router-dom";
import Dashboard from "../../pages/Dashboard/Dashboard";

export default function MainLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [open, setOpen] = useState(true);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 bg-gray-800 text-white transition-all duration-300 ease-in-out ${open ? "w-64" : "md:w-16"}`}
            >
                <Sidebar open={open} setOpen={setOpen} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${open ? "md:ml-72" : "md:ml-16"}`}
            >
                {/* Header */}
                <header className="fixed w-full bg-white shadow-md flex items-center px-6 h-16 z-10">
                    <Header handleDrawerToggle={handleDrawerToggle} open={open} setOpen={setOpen} />
                </header>

                {/* Content Area */}
                <main className="p-6 pt-20">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        {/*<Route path="two" element={<One />} />*/}
                        {/*<Route path="three" element={<Three />} />*/}
                    </Routes>
                </main>
            </div>
        </div>
    );
}
