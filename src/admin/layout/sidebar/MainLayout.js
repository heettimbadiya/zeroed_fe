import React, {createContext, useState} from "react";
import {json, Route, Routes} from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/sidebar/Header";
import Dashboard from "../../pages/Dashboard/Dashboard";
import User from "../../pages/User/User";
import {FaEnvelope, FaInbox, FaRegUser, FaTrash} from "react-icons/fa";
import { MdOutlineMoveToInbox } from "react-icons/md";
import {TbDashboardFilled} from "react-icons/tb";
import Feed from "../../pages/Feed/feed";
import ChatPopup from "../../../pages/ChatPopup/ChatPopup";
const menuItems = [
    { text: "Dashboard", icon: <TbDashboardFilled /> ,path:'/dashboard'},
    { text: "User", icon: <FaRegUser /> ,path:'/dashboard/user'},
    { text: "Inbox", icon: <MdOutlineMoveToInbox /> ,path:'/dashboard/feed'},
    // { text: "Starred", icon: <FaEnvelope /> ,path:'/user'},
    // { text: "Send email", icon: <FaInbox /> ,path:'/user'},
    // { text: "Drafts", icon: <FaEnvelope /> ,path:'/user'},
    // { text: "Trash", icon: <FaTrash /> ,path:'/user'},
    // { text: "Spam", icon: <FaEnvelope /> ,path:'/user'},
];
export const UserContext = createContext()
export default function MainLayout() {
    const stringifyUser = sessionStorage.getItem('admin_user')
    const [user,setUser] = useState(JSON.parse(stringifyUser))
    const [mobileOpen, setMobileOpen] = useState(false);
    const [open, setOpen] = useState(true);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <div className="flex h-screen overflow-auto bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 bg-gray-800 text-white transition-all duration-300 ease-in-out ${open ? "w-64" : "md:w-16"}`}
            >
                <Sidebar open={open} setOpen={setOpen} mobileOpen={mobileOpen} menuItems={menuItems} handleDrawerToggle={handleDrawerToggle} />
            </div>

            {/* Main Content */}
                <header className="fixed w-full bg-white shadow-md flex items-center px-6 h-16 z-10">
                    <Header handleDrawerToggle={handleDrawerToggle} open={open} setOpen={setOpen} />
                </header>
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${open ? "md:ml-72" : "md:ml-16"}`}
            >
                {/* Header */}

                {/* Content Area */}
                <main className="p-6 pt-20 overflow-auto">
                    <UserContext.Provider value={user}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/user" element={<User />} />
                        <Route path="/feed" element={<Feed />} />
                        {/*<Route path="two" element={<One />} />*/}
                        {/*<Route path="three" element={<Three />} />*/}
                    </Routes>
                    </UserContext.Provider>
                    <ChatPopup/>
                </main>
            </div>
        </div>
    );
}
