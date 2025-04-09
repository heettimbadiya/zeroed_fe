import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../../utils/APIs";

export default function SideDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = sessionStorage.getItem("admin_token");
    const navigate = useNavigate();
    const handleSearch = async () => {
        if (!search) return;

        try {
            setLoading(true);
            const { data } = await axios.get(
                `${API_ROUTES.SEARCH}?search=${search}`,
                {
                    headers: { Authorization: token },
                }
            );
            setResults(data.data);
        } catch (error) {
            console.error("Search error:", error);
            setResults([]);
        } finally {
            setLoading(false);
            setSearch("");
        }
    };


    const handleUserClick = async (userId) => {
        try {
            // 1. Create or get chat with selected user
            const response = await axios.post(
                API_ROUTES.POST_CHAT,
                { userId },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            console.log("POST success:", response.data);

            // 2. Fetch all chats
            const allChats = await axios.get(API_ROUTES.ALL_CHAT, {
                headers: {
                    Authorization: token,
                },
            });

            console.log("ALL_CHAT success:", allChats.data);

            // 3. Navigate to chat page
            navigate("/chat");
        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsOpen(false);
            setResults([]);
        }
    };

    return (
        <div className="w-full">
            {/* Search Button */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1011 18.5a7.5 7.5 0 005.65-1.85z" />
                    </svg>
                </button>
            </div>

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full bg-white shadow-lg w-80 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="border-b p-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Search Users</h2>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setResults([]);
                        }}
                        className="text-gray-500 hover:text-red-500 text-xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex space-x-1 mb-4">
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                            onClick={handleSearch}
                        >
                            Go
                        </button>
                    </div>

                    {loading && <p className="text-gray-500 text-sm mb-2">Searching...</p>}

                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {Array.isArray(results) && results.length > 0 ? (
                            results.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center space-x-3 bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition cursor-pointer"
                                    onClick={() => handleUserClick(user._id)}
                                >
                                    <img
                                        src={user.basicDetails.profile_pic || "https://via.placeholder.com/40"}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full border-2 object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-[17px]">
                                            {user.basicDetails.firstname + ' ' + user.basicDetails.lastname}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-semibold text-[13px]">Email :</span>{" "}
                                            <span className="text-gray-700">{user.email}</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !loading && (
                                <p className="text-sm text-gray-500">No users found.</p>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={() => {
                        setIsOpen(false);
                        setResults([]);
                    }}
                />
            )}
        </div>
    );
}
