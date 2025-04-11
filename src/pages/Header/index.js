import {useNavigate} from 'react-router-dom'
import logo from '../../assets/logo (1).png'
import default_user from '../../assets/user.png'
import React, {useState} from 'react'
import ROUTES_URL from '../../constant/routes'
import {ArrowDown, LinkIcon, LogoutIcon, Messaging, UserIcon} from '../../common/Icons'

const Header = ({profile, userId, slug}) => {
    let navigate = useNavigate()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [copied, setCopied] = useState(false);


    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev)
    }

    const handleCopy = () => {
        const fullUrl = `${window.location.origin}/profile/${slug}`;
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false)
        }, 2000);
    };
    const handleLogout = () => {
        sessionStorage.clear()
        navigate(ROUTES_URL.SIGN_IN)
    }

    return (
        <div className="bg-white px-10">
            <div className="flex justify-between items-center py-5">
                <div className="flex">
                    <div>
                        <img src={logo} onClick={() => navigate('/home')} alt="zeroed"
                             className="h-[1.875rem] w-[6.25rem] cursor-pointer"/>
                    </div>
                    {/*<div className="ps-4">*/}
                    {/*    <SideDrawer/>*/}
                    {/*</div>*/}
                </div>
                <div className={'flex items-center'}>
                    <div className={'px-3 cursor-pointer'} onClick={() => navigate('/inbox')}>Inbox</div>
                    <div className={'px-3 cursor-pointer'} onClick={() => navigate('/pricing')}>Pricing</div>
                    <div className={'px-3 cursor-pointer'} onClick={() => navigate('/messaging')}>Messaging</div>
                    <div className="relative cursor-pointer flex items-center">
                        <div onClick={toggleMenu}>
                            <div
                                className="flex justify-center items-center gap-x-4 border border-text-border py-1 px-2 rounded-lg">
                                <img
                                    src={
                                        profile
                                            ? profile
                                            : default_user
                                    }
                                    alt="profile"
                                    className="bg-gray-400 rounded-full border h-6 w-6 flex items-center justify-center cursor-pointer"

                                />
                                <ArrowDown/>
                            </div>
                        </div>
                        {isMenuOpen && (
                            <div
                                className="absolute right-0 top-10 mt-2 w-36 bg-white rounded-md z-10 border border-gray-200">
                                <div className="py-1">
                                    {/*{profile !== null && (*/}
                                        <div
                                            onClick={() => {
                                                toggleMenu()
                                                navigate(`${ROUTES_URL.PROFILE}/${userId}`)
                                            }}
                                            className="flex items-center gap-2 w-full px-3 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                                        >
                                            <div className="w-10">
                                                <UserIcon/>
                                            </div>
                                            <span>Profile</span>
                                        </div>
                                    {/*)}*/}
                                    {slug && (
                                        <div className="relative">
                                            <div
                                                onClick={handleCopy}
                                                className="flex items-center gap-2 w-full px-3 text-sm text-gray-700 hover:bg-gray-100 transition duration-200 cursor-pointer"
                                            >
                                                <div className="w-10 pl-1.5">
                                                    <LinkIcon/>
                                                </div>
                                                <span>Copy URL</span>
                                            </div>
                                            {copied && (
                                                <div
                                                    className="absolute top-full right-0 transform mt-2 px-3 py-1 bg-black text-white text-xs rounded-md font-semibold">
                                                    Copied!
                                                    <div className="absolute -top-1 right-2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-black"></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onClick={() => {
                                            toggleMenu()
                                            handleLogout()
                                        }}
                                        className="flex items-center gap-2 w-full px-3 text-sm text-red-600 hover:bg-red-50 transition duration-200"
                                    >
                                        <div className="w-10">
                                            <LogoutIcon/>
                                        </div>
                                        <span>Logout</span>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
