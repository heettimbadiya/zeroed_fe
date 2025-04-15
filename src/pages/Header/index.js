import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo (1).png';
import default_user from '../../assets/user.png';
import ROUTES_URL from '../../constant/routes';
import {ArrowDown, LogoutIcon, UserIcon} from '../../common/Icons';
import axios from 'axios';
import { API_ROUTES } from '../../utils/APIs';

const Header = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const profile = data?.basicDetails?.profile_pic || null;
    const userId = user?.id || data?.basicDetails?.user_id;
    const slug = data?.basicDetails?.slug || null;
    const fullUrl = `${window.location.origin}/view/${slug}`;

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        const storedToken = sessionStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (!user?.id || !token) return;

        async function fetchData() {
            setLoading(true);
            try {
                const response = await axios.get(API_ROUTES.GET_PROFILE_INFO + '/' + user.id);
                if (response?.data?.success) {
                    setData(response.data.data);
                }
            } catch (err) {
                console.error("Error fetching profile info:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [user?.id, token]);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const toggleShareProfileMenu = () => setIsProfileMenuOpen(prev => !prev);
    const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate(ROUTES_URL.SIGN_IN);
    };

    const MobileNav = () => (
        <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-5 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div>
                    <button onClick={toggleMobileMenu} className={'flex justify-end w-full'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
                            <path fill="currentColor"
                                  d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27"/>
                        </svg>
                    </button>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <img src={logo} alt="Logo" className="h-8 cursor-pointer" onClick={() => navigate('/home')}/>
                </div>
                <nav className="flex flex-col gap-4">
                    <span onClick={() => {
                        navigate('/zeroed-in');
                        toggleMobileMenu();
                    }} className="cursor-pointer">Zeroed-In</span>
                    <span onClick={() => { navigate('/messaging'); toggleMobileMenu(); }} className="cursor-pointer">Messaging</span>
                    {shareButtons}
                    {profileButton}
                </nav>
            </div>
        </div>
    );

    const shareButtons = (slug && (
        <div className="relative cursor-pointer flex items-center">
            <div onClick={toggleShareProfileMenu}>
                <div className="flex items-center justify-center gap-x-2 bg-[#CDEAFF] text-black rounded-full py-1 px-3">
        <span className="flex items-center gap-2 border-r border-white pr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor"
                                                                                                     d="m13.576 17.271l-5.11-2.787a3.5 3.5 0 1 1 0-4.968l5.11-2.787a3.5 3.5 0 1 1 .958 1.755l-5.11 2.787a3.5 3.5 0 0 1 0 1.457l5.11 2.788a3.5 3.5 0 1 1-.958 1.755"/></svg>
          Share
        </span>
                    <ArrowDown/>
                </div>
            </div>

            {isProfileMenuOpen && !loading && (
                <div className="absolute right-0 top-10 mt-2 py-2 w-44 bg-white rounded-md z-10 border border-gray-200">
                    <div className="flex flex-col gap-2 items-start px-4">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 text-sm py-1"
                            title="Copy profile link"
                        >
                            {/* Copy icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                 <path fill="currentColor"
                                                           d="M11 17H7q-2.075 0-3.537-1.463T2 12t1.463-3.537T7 7h4v2H7q-1.25 0-2.125.875T4 12t.875 2.125T7 15h4zm-3-4v-2h8v2zm5 4v-2h4q1.25 0 2.125-.875T20 12t-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.463T22 12t-1.463 3.538T17 17z"/>
                                               </svg>
                                {copied ? 'Copied!' : 'Copy URL'}
                        </button>

                        <a
                            href={`https://web.whatsapp.com/?text=${encodeURIComponent(fullUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm py-1"
                            title="Share on WhatsApp"
                            onClick={handleCopy}
                        >
                                                 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
                                                 <path fill="currentColor"
                                                 d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"/>
                                               </svg>
                            WhatsApp
                        </a>

                        <a
                            target="_blank"
                            href={`https://mail.google.com`}
                            className="flex items-center gap-2 text-sm py-1"
                            title="Share via Email"
                            onClick={handleCopy}
                        >
                                                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"
                                                className="w-4 h-4">
                                                <path
                                               d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v.217l-8 4.8-8-4.8V4zm0 1.383v6.634l5.803-3.482L0 5.383zM6.761 9.674l-6.38 3.827A2 2 0 0 0 2 14h12a2 2 0 0 0 1.619-.499l-6.38-3.827-.736.443a1 1 0 0 1-1.007 0l-.736-.443zm3.436-1.139L16 12.017V5.383l-5.803 3.152z"/>
                                               </svg>
                            Email
                        </a>
                    </div>
                </div>
            )}
        </div>
    ));
    const profileButton = (
        <div className="relative cursor-pointer flex items-center">
            <div onClick={toggleMenu}>
                <div className="flex items-center gap-x-2 border border-gray-300 py-1 px-3 rounded-lg">
                    <img src={profile || default_user} alt="profile" className="rounded-full h-6 w-6"/>
                    <ArrowDown/>
                </div>
            </div>
            {(isMenuOpen && !loading) && (<div
                className="absolute right-0 top-10 mt-2 w-36 bg-white rounded-md z-10 border border-gray-200">
                <div className="py-1">
                    <div
                        onClick={() => {
                            toggleMenu();
                            navigate(`${ROUTES_URL.PROFILE}/${userId}`);
                        }}
                        className="flex items-center gap-2 w-full px-3 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                    >
                        <div className="w-10">
                            <UserIcon/>
                        </div>
                        <span>Profile</span>
                    </div>

                    <div
                        onClick={() => {
                            toggleMenu();
                            handleLogout();
                        }}
                        className="flex items-center gap-2 w-full px-3 text-sm text-red-600 hover:bg-red-50 transition duration-200"
                    >
                        <div className="w-10">
                            <LogoutIcon/>
                        </div>
                        <span>Logout</span>
                    </div>
                </div>
            </div>)}
        </div>
    )

    return (
        <div className="bg-white px-4 sm:px-10 shadow-md">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                    <img
                        src={logo}
                        onClick={() => navigate('/home')}
                        alt="logo"
                        className="h-8 w-auto cursor-pointer"
                    />
                    <button className="md:hidden text-xl" onClick={toggleMobileMenu}>☰</button>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    <span className="cursor-pointer" onClick={() => navigate('/zeroed-in')}>Zeroed-In</span>
                    <span className="cursor-pointer" onClick={() => navigate('/messaging')}>Messaging</span>
                    {shareButtons}
                    {profileButton}

                </div>
            </div>

            {/* Mobile Nav */}
            {MobileNav()}
        </div>
    );
};

export default Header;
