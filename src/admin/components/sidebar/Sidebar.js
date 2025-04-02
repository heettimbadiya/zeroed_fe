import React, {useState, useEffect, useContext} from "react";
import {
    FaBars,
    FaInbox,
    FaEnvelope,
    FaTrash,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../layout/sidebar/MainLayout";
const Sidebar = ({ open, setOpen ,menuItems}) => {
    const stringifyUser = localStorage.getItem('admin_user')
    const parsedUser = JSON.parse(stringifyUser)
    const navigate = useNavigate()
    const [openSubmenu, setOpenSubmenu] = useState({});

    useEffect(() => {
        const handleResize = () => setOpen(window.innerWidth >= 768);
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [setOpen]);

    const toggleSubmenu = (text) => {
        setOpenSubmenu((prev) => ({ ...prev, [text]: !prev[text] }));
    };

    const renderMenuItem = (item) => (
        <li key={item.text} className="relative">
            <button
                onClick={() => {
                    item.submenu && toggleSubmenu(item.text)
                    navigate(item.path)
                }}
                className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition"
            >
                <span className="text-lg">{item.icon}</span>
                <span className={`ml-3 text-sm font-medium ${open ? "block" : "hidden"}`}>
                    {item.text}
                </span>
                {item.submenu && (
                    <span className="ml-auto">
                        {openSubmenu[item.text] ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                )}
            </button>
            {item.submenu && openSubmenu[item.text] && (
                <ul className="ml-6 mt-2 border-l border-gray-600">
                    {item.submenu.map((subItem) => renderMenuItem(subItem))}
                </ul>
            )}
        </li>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div
                className={`hidden md:block fixed inset-y-0 left-0 bg-gray-800 text-white transition-all duration-300 ease-in-out ${
                    open ? "w-72" : "w-16"
                }`}
            >
                <div className="flex items-center justify-between p-4">
                    <button onClick={() => setOpen(!open)} className="text-white p-2">
                        <FaBars size={24}/>
                    </button>
                </div>
                {open && <div className="text-center my-4">
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
                        alt="logo"
                        className="w-32 h-32 rounded-full mx-auto"
                    />
                    <h3 className="text-white mt-2">{parsedUser?.userName}</h3>
                    <p className="text-gray-400 text-sm">{parsedUser?.email}</p>
                </div>}
                <ul className="px-2 space-y-2">{menuItems.map(renderMenuItem)}</ul>
            </div>

            {/* Mobile Drawer */}
            {open && (
                <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setOpen(false)}/>
            )}
            <div
                className={`md:hidden fixed inset-y-0 left-0 bg-gray-800 text-white z-50 transition-transform transform ${
                    open ? "translate-x-0" : "-translate-x-full"
                } w-64`}
            >
                <div className="flex items-center justify-between p-4">
                    <button onClick={() => setOpen(false)} className="text-white p-2">
                        <FaBars size={24}/>
                    </button>
                </div>
                <div className="text-center my-4">
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
                        alt="logo"
                        className="w-32 h-32 rounded-full mx-auto"
                    />
                    <h3 className="text-white mt-2">{parsedUser?.userName}</h3>
                    <p className="text-gray-400 text-sm">{parsedUser?.email}</p>
                </div>
                <ul className="px-2 space-y-2">{menuItems.map(renderMenuItem)}</ul>
            </div>
        </>
    );
};

export default Sidebar;

