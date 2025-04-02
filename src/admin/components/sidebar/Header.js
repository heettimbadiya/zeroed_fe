import React from 'react';
import {FaBars, FaSignOutAlt} from "react-icons/fa";
import logo from "../../assets/logo.png";
import {useNavigate} from "react-router-dom";

const Header = ({ handleDrawerToggle, open, setOpen }) => {
    const navigate = useNavigate()
    return (
        <div className={`flex justify-between items-center w-full`}>
            {/*<button*/}
            {/*    className="mr-2 h-[50px] w-[50px] flex items-center justify-center sm:hidden hover:bg-gray-200 rounded-full"*/}
            {/*    aria-label="open drawer"*/}
            {/*    onClick={handleDrawerToggle}*/}
            {/*>*/}
            {/*    <FaBars size={24} />*/}
            {/*    <div className="text-black" />*/}
            {/*</button>*/}
            {/*{!open ? (*/}
            <div className='flex items-center'>
                <button
                    className="mr-2 h-[50px] w-[50px] flex items-center justify-center md:hidden xs:flex"
                    aria-label="open drawer"
                    onClick={() => setOpen(!open)}
                >
                    <FaBars size={24}/>
                    <div className="text-black"/>
                </button>
                {/*) : null}*/}
                <h6 className="text-lg font-semibold">
                    <div>
                        <img src={logo} onClick={() => navigate('/home')} alt="zeroed"
                             className="h-[1.875rem] w-[6.25rem] cursor-pointer"/>
                    </div>
                </h6>
            </div>
            <button
                className="flex items-center ms-auto gap-2 text-gray-700 font-medium hover:text-red-500 transition"
                onClick={() => {
                    localStorage.clear()
                    navigate('/admin')
                }}
            >
                <FaSignOutAlt size={20}/>
                <span className="hidden sm:inline">Log Out</span>
            </button>
        </div>
    );
};

export default Header;
