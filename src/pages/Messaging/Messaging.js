import React, {useEffect, useRef, useState} from "react";
import logo from "../../assets/logo (1).png";
import profile from "../../admin/assets/profilepic/profile.webp";
import { API_ROUTES } from "../../utils/APIs";
import axios from "axios";
import moment from "moment";
import Header from "../../admin/components/sidebar/Header";
import { AddChat, Back, Send } from "../../common/Icons";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
import { PageLoading } from "../../common/Icons/Loading/pageLoading";
const ENDPOINT = process.env.REACT_APP_FILE_URL;
let socket, selectedChatCompare;
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

function Messaging() {
    const endOfMessagesRef = useRef(null);
    const isAdmin = !!sessionStorage.getItem("admin_token");
    const token = isAdmin ? sessionStorage.getItem("admin_token") : sessionStorage.getItem("token");
    const user = isAdmin ? JSON.parse(sessionStorage.getItem("admin_user")) : JSON.parse(sessionStorage.getItem("user"));
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [newMessageData, setNewMessageData] = useState([]);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [messenger, setMessenger] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

    const navigate = useNavigate();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`${API_ROUTES.SEARCH}?search=`, {
                headers: {
                    Authorization: token,
                },
            });
            setAllUsers(data.data);
            setFilteredUsers(data.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (openDrawer) {
            fetchUsers();
        }
    }, [openDrawer]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        const filtered = allUsers.filter((user) =>
            (user?.basicDetails?.firstname + " " + user?.basicDetails?.lastname)
                .toLowerCase()
                .includes(value.toLowerCase()) ||
            user?.email?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const staticBroadcastChat = isAdmin
        ? [{
            _id: user.id,
            userName: "BROADCAST",
            email: "",
            participants: [{
                basicDetails: {
                    firstname: "BROADCAST",
                    lastname: "",
                    profile_pic: logo,
                },
            }, {
                basicDetails: {
                    firstname: "BROADCAST",
                    lastname: "",
                    profile_pic: logo,
                },
            }],
        }]
        : [];

    const getAllChat = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(API_ROUTES.ALL_CHAT, {
                headers: { Authorization: token },
            });

            const allChats = [...staticBroadcastChat, ...res.data];
            setMessenger(allChats);

            if (allChats.length > 0) {
                setSelectedChat(allChats[0]);
                manageMessages(allChats[0]);
            }
        } catch (error) {
            console.error("Error fetching chats:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);  // Set loading to false after the API call
            setLoading(false);  // Set loading to false after the API call

        }
    };

    const handleUserClick = async (userId) => {
        setIsLoading(true);  // Set loading to true before the API call
        setChatLoading(true);  // Set loading to true before the API call
        try {
            const res = await axios.post(API_ROUTES.POST_CHAT, { userId }, {
                headers: { Authorization: token },
            });
            if (res?.data?._id) {
                getAllChat()
                navigate(isAdmin ? "/chat" : "/messaging");
            }
        } catch (error) {
            console.error("Error initiating chat:", error);
        } finally {
            setIsLoading(false);  // Set loading to false after the API call
            setOpenDrawer(false);
            setChatLoading(false);
        }
    };

    const manageMessages = async (chat) => {
        setIsLoading(true);  // Set loading to true before the API call
        setChatLoading(true);  // Set loading to true before the API call
        try {
            if (isAdmin && chat.userName === "BROADCAST") {
                const res = await axios.get(API_ROUTES.BROADCAST, {
                    headers: { Authorization: token },
                });
                setNewMessageData(res.data);
            } else {
                const res = await axios.get(`${API_ROUTES.CHAT_MESSAGES}/${chat._id}`, {
                    headers: { Authorization: token },
                });
                setNewMessageData(res.data);
                socket.emit("join chat", selectedChat._id);
            }
        } catch (error) {
            console.error("Error fetching messages:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);  // Set loading to false after the API call
            setChatLoading(false);  // Set loading to false after the API call
        }
    };

    const handleChangeChat = (chat) => {
        setSelectedChat(chat);
        manageMessages(chat);
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, [user]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;
        socket.emit("stop typing", selectedChat._id);
        try {
            if (isAdmin && selectedChat.userName === "BROADCAST") {
                const payload = { text: newMessage };
                const { data } = await axios.post(API_ROUTES.BROADCAST, payload, {
                    headers: { Authorization: token },
                });
                socket.emit("new message", data);
            } else {
                const payload = {
                    chatId: selectedChat._id,
                    receiver: selectedChat.participants[0]._id,
                    text: newMessage,
                };
                const { data } = await axios.post(API_ROUTES.SEND_MESSAGES, payload, {
                    headers: { Authorization: token },
                });
                socket.emit("new message", data);
            }

            setNewMessage("");
            manageMessages(selectedChat);
        } catch (error) {
            console.error("Error sending message:", error.response?.data || error.message);
        }
    };
    useEffect(() => {
        setLoading(true);
        getAllChat();
    }, []);

    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            setNewMessageData([...newMessageData, newMessageRecieved]);
        });
        return () => {
            socket.off("setup", user);
        };
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [newMessageData]);
    return (
        <>
            {isAdmin && (
                <div className="py-3 px-5">
                    <Header />
                </div>
            )}
        {loading ? (
            <PageLoading />
        ) : (

            <div className="flex min-h-[93vh] h-[100%] bg-gray-100 justify-center items-center">
                <div className="container">
                    <div className="flex flex-row justify-center gap-x-6">
                        {/* Sidebar */}
                        <div className={`w-full h-[80vh] overflow-auto lg:w-[30%] bg-white relative border-r ${selectedChat ? 'hidden lg:block' : ''}`}>
                            {openDrawer ? (
                                <div className="absolute right-0 top-0 w-full lg:w-[100%] h-full z-40 shadow-xl transition-all overflow-hidden bg-white">
                                    <div className="flex flex-col h-full">
                                        {/* Header + Search */}
                                        <div className="shrink-0">
                                            <div className="flex items-center p-4 space-x-3">
                                                <button onClick={() => setOpenDrawer(false)} className="text-black text-xl">
                                                    <Back />
                                                </button>
                                                <h2 className="text-lg font-semibold">New Chat</h2>
                                            </div>

                                            <div className="p-2">
                                                <div className="flex items-center bg-white border-2 text-black px-4 py-2 rounded-md">
                                                    <button className="text-black mr-3">
                                                        <Search />
                                                    </button>
                                                    <input
                                                        type="text"
                                                        placeholder="Search name or number"
                                                        className="bg-transparent outline-none w-full placeholder-gray-400 text-black"
                                                        value={searchQuery}
                                                        onChange={handleSearchChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Scrollable User List */}
                                        {isLoading ? (
                                            <PageLoading />
                                        ) : (
                                        <div className="overflow-y-auto px-4 pb-4 space-y-2 flex-1">
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map((user) => (
                                                    <div
                                                        key={user._id}
                                                        className="flex items-center space-x-3 bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition cursor-pointer"
                                                        onClick={() => handleUserClick(user._id)}
                                                    >
                                                        <img
                                                            src={user?.basicDetails?.profile_pic || "https://via.placeholder.com/40"}
                                                            alt={user?.name}
                                                            className="w-10 h-10 rounded-full border-2 object-cover"
                                                        />
                                                        <div>
                                                            <p className="font-semibold text-[17px]">
                                                                {user?.basicDetails?.firstname + ' ' + user?.basicDetails?.lastname}
                                                            </p>
                                                            <p className="text-sm text-gray-700">{user?.email}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">No users found.</p>
                                            )}
                                        </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 border-b flex justify-between items-center">
                                        <h1 className="text-xl font-semibold lato">Chats</h1>
                                        <button onClick={() => setOpenDrawer(true)}>
                                            <AddChat />
                                        </button>
                                    </div>

                                    <div className="overflow-y-auto h-[calc(80vh-4rem)]">
                                        {/*{isLoading ? (*/}
                                        {/*    <PageLoading />*/}
                                        {/*) : (*/}
                                        {
                                            messenger.map((chat) => (
                                                <div
                                                    key={chat._id}
                                                    onClick={() => handleChangeChat(chat)}
                                                    className={`flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer ${
                                                        selectedChat?._id === chat._id ? 'bg-blue-50' : ''
                                                    }`}
                                                >
                                                    <img
                                                        src={chat?.participants[0]?.basicDetails?.profile_pic || profile}
                                                        alt="avatar"
                                                        className="w-10 h-10 rounded-full mr-3"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium">
                                                            {chat?.participants[0]?.basicDetails?.firstname}{' '}
                                                            {chat?.participants[0]?.basicDetails?.lastname}
                                                        </h3>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Chat Panel */}
                        <div className={`flex-1 flex h-[80vh] overflow-auto flex-col ${selectedChat ? 'block' : 'hidden'}`}>
                            {selectedChat ? (
                                <>
                                    {/* Chat Header */}

                                    <div className="p-4 border-b bg-white flex items-center">
                                        <button
                                            onClick={() => setSelectedChat(null)}
                                            className="lg:hidden p-2 text-black hover:bg-gray-200 rounded-md"
                                        >
                                            <Back />
                                        </button>
                                        <img
                                            src={selectedChat?.participants[0]?.basicDetails?.profile_pic || profile}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full ml-3"
                                        />
                                        <h2 className="text-lg font-semibold lato ml-2">
                                            {selectedChat?.participants[0]?.basicDetails?.firstname} {selectedChat?.participants[0]?.basicDetails?.lastname}
                                        </h2>
                                    </div>

                                    {/* Chat Messages */}

                                    {/*{chatLoading ? (*/}
                                    {/*    <PageLoading />*/}
                                    {/*) : (*/}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                        {newMessageData.length > 0 &&
                                            newMessageData.map((msg) => (
                                                <div
                                                    key={msg._id}
                                                    className={`flex ${user?.id === msg?.sender?._id ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className="max-w-[70%] rounded-lg p-3 bg-white">
                                                        <p className="text-sm">{msg?.text}</p>
                                                        <p className="text-xs mt-1 opacity-70">{moment(msg.createdAt).format("hh:mm A")}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        <div ref={endOfMessagesRef}/>
                                    </div>
                                    {/*)}*/}

                                    {/* Input Area */}
                                    <div className="p-4 border-t bg-white">
                                        <div className="flex items-center space-x-2">
                                            {/*{istyping ? (*/}
                                            {/*    <div>*/}
                                            {/*        <Lottie*/}
                                            {/*            options={defaultOptions}*/}
                                            {/*            // height={50}*/}
                                            {/*            width={70}*/}
                                            {/*            style={{marginBottom: 15, marginLeft: 0}}*/}
                                            {/*        />*/}
                                            {/*    </div>*/}
                                            {/*) : (*/}
                                            {/*    <></>*/}
                                            {/*)}*/}
                                            <input
                                                type="text"
                                                value={newMessage}
                                                placeholder="Write a message..."
                                                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onChange={typingHandler}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleSendMessage();
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                className="bg-[#00C5FF] text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                            >
                                                <Send />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center bg-gray-50">
                                    <p className="text-gray-500">Select a chat to start messaging</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
)}
        </>
    );
}

export default Messaging;
