// import React, { useState, useEffect } from "react";
// import { FaBars, FaInbox, FaEnvelope, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
//
// const Sidebar = ({ open, setOpen }) => {
//     const [openSubmenu, setOpenSubmenu] = useState({});
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
//
//     // Detect screen width changes
//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 500);
//             if (window.innerWidth >= 500) {
//                 setOpen(true); // Keep sidebar open on large screens
//             }
//         };
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);
//
//     const menuItems = [
//         { text: "Inbox", icon: <FaInbox /> },
//         { text: "Starred", icon: <FaEnvelope /> },
//         { text: "Send email", icon: <FaInbox /> },
//         { text: "Drafts", icon: <FaEnvelope /> },
//         {
//             text: "All mail",
//             icon: <FaEnvelope />,
//             submenu: [
//                 { text: "Single", icon: <FaInbox /> },
//                 { text: "Spam", icon: <FaEnvelope /> },
//             ],
//         },
//         { text: "Trash", icon: <FaTrash /> },
//         { text: "Spam", icon: <FaEnvelope /> },
//     ];
//
//     const handleSubmenuClick = (text) => {
//         setOpenSubmenu((prev) => ({ ...prev, [text]: !prev[text] }));
//     };
//
//     return (
//         <>
//             {/* Sidebar for Large Screens */}
//             <div
//                 className={`hidden md:block fixed inset-y-0 left-0 bg-gray-800 text-white transition-all duration-300 ease-in-out ${
//                     open ? "w-72" : "w-16"
//                 }`}
//             >
//                 <div className="flex items-center justify-between p-4">
//                     <button onClick={() => setOpen(!open)} className="text-white p-2">
//                         <FaBars size={24} />
//                     </button>
//                 </div>
//
//                 {/* User Profile */}
//                 {open && (
//                     <div className="flex flex-col items-center my-4">
//                         <img
//                             className="w-24 h-24 rounded-full border-2 border-gray-600"
//                             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTOy4r282WZz8LxMjUt9ZqKrrZfhk7tr8qew&s"
//                             alt="User"
//                         />
//                         <p className="text-lg font-semibold mt-2">Heet Timbadiya</p>
//                         <p className="text-sm text-gray-400">heettimbadiya650@gmail.com</p>
//                     </div>
//                 )}
//
//                 {/* Navigation Menu */}
//                 <ul className="px-2 space-y-2">
//                     {menuItems.map((item) => (
//                         <li key={item.text} className="relative">
//                             <button
//                                 onClick={() => item.submenu && handleSubmenuClick(item.text)}
//                                 className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition"
//                             >
//                                 <span className="text-lg">{item.icon}</span>
//                                 <span className={`ml-3 text-sm font-medium ${open ? "block" : "hidden"}`}>
//                                     {item.text}
//                                 </span>
//                                 {item.submenu && (
//                                     <span className="ml-auto">{openSubmenu[item.text] ? <FaChevronUp /> : <FaChevronDown />}</span>
//                                 )}
//                             </button>
//
//                             {/* Submenu */}
//                             {item.submenu && openSubmenu[item.text] && (
//                                 <ul className="ml-6 mt-2 border-l border-gray-600">
//                                     {item.submenu.map((subItem) => (
//                                         <li key={subItem.text}>
//                                             <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-700 rounded-lg">
//                                                 <span className="text-lg">{subItem.icon}</span>
//                                                 <span className="ml-3">{subItem.text}</span>
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//
//             {/* Mobile Drawer */}
//             {isMobile && open && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-50"
//                     onClick={() => setOpen(false)}
//                 />
//             )}
//
//             <div
//                 className={`fixed inset-y-0 left-0 bg-gray-800 text-white z-50 transition-transform transform ${
//                     open ? "translate-x-0" : "-translate-x-full"
//                 } md:hidden w-64`}
//             >
//                 <div className="flex items-center justify-between p-4">
//                     <button onClick={() => setOpen(false)} className="text-white p-2">
//                         <FaBars size={24} />
//                     </button>
//                 </div>
//
//                 {/* User Profile */}
//                 <div className="flex flex-col items-center my-4">
//                     <img
//                         className="w-24 h-24 rounded-full border-2 border-gray-600"
//                         src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTOy4r282WZz8LxMjUt9ZqKrrZfhk7tr8qew&s"
//                         alt="User"
//                     />
//                     <p className="text-lg font-semibold mt-2">Heet Timbadiya</p>
//                     <p className="text-sm text-gray-400">heettimbadiya650@gmail.com</p>
//                 </div>
//
//                 {/* Navigation Menu */}
//                 <ul className="px-2 space-y-2">
//                     {menuItems.map((item) => (
//                         <li key={item.text} className="relative">
//                             <button
//                                 onClick={() => item.submenu && handleSubmenuClick(item.text)}
//                                 className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition"
//                             >
//                                 <span className="text-lg">{item.icon}</span>
//                                 <span className="ml-3 text-sm font-medium">{item.text}</span>
//                                 {item.submenu && (
//                                     <span className="ml-auto">{openSubmenu[item.text] ? <FaChevronUp /> : <FaChevronDown />}</span>
//                                 )}
//                             </button>
//
//                             {/* Submenu */}
//                             {item.submenu && openSubmenu[item.text] && (
//                                 <ul className="ml-6 mt-2 border-l border-gray-600">
//                                     {item.submenu.map((subItem) => (
//                                         <li key={subItem.text}>
//                                             <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-700 rounded-lg">
//                                                 <span className="text-lg">{subItem.icon}</span>
//                                                 <span className="ml-3">{subItem.text}</span>
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </>
//     );
// };
//
// export default Sidebar;


import React, { useState, useEffect } from "react";
import {
    FaBars,
    FaInbox,
    FaEnvelope,
    FaTrash,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
const Sidebar = ({ open, setOpen ,menuItems}) => {
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
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTOy4r282WZz8LxMjUt9ZqKrrZfhk7tr8qew&s"
                        alt="logo"
                        className="w-32 h-32 rounded-full mx-auto"
                    />
                    <h3 className="text-white mt-2">Zeroed</h3>
                    <p className="text-gray-400 text-sm">zeroed650@gmail.com</p>
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
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTOy4r282WZz8LxMjUt9ZqKrrZfhk7tr8qew&s"
                        alt="logo"
                        className="w-32 h-32 rounded-full mx-auto"
                    />
                    <h3 className="text-white mt-2">Zeroed</h3>
                    <p className="text-gray-400 text-sm">zeroed650@gmail.com</p>
                </div>
                <ul className="px-2 space-y-2">{menuItems.map(renderMenuItem)}</ul>
            </div>
        </>
    );
};

export default Sidebar;

