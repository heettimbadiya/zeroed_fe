
import React, {useEffect, useState} from "react";
import logo from "../../assets/logo.png";
import {API_ROUTES} from "../../utils/APIs";
import axios from "axios";
import moment from "moment";
import Header from "../../components/sidebar/Header";
import profile from "../../assets/profilepic/profile.webp";

function AdminMessaging() {
    const token = sessionStorage.getItem("admin_token");
    const user = JSON.parse(sessionStorage.getItem('admin_user'));
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [newMessageData, setNewMessageData] = useState([]);
    const staticChat = [{
        _id: user._id, userName: "BROADCAST", email: "", participants: [{
            basicDetails: {
                firstname: 'BROADCAST', lastname: '', profile_pic: logo
            }
        }]
    },]
    const [messenger, setMessenger] = useState(staticChat || []);

    useEffect(() => {
        getAllChat();
    }, []);

    const getAllChat = async () => {
        try {
            const res = await axios.get(API_ROUTES.ALL_CHAT, {headers: {Authorization: token}});

            if (res.data.length > 0) {
                // const updatedChats = [staticChat, ...res.data]
                setMessenger([...staticChat, ...res.data]); // Preserve static messages
                setSelectedChat(res.data[0]);
                console.log(res.data, "fdbfdb");
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };
    const manageBroadcast = async (id) => {
        if (id.userName === "BROADCAST") {
            try {
                const res = await axios.get(API_ROUTES.BROADCAST, {headers: {Authorization: token}})
                setNewMessageData(res.data);
            }
            catch (error) {
                console.error("Error fetching chats:", error);
            }
        }else {
            try {
                const res = await axios.get(`${API_ROUTES.CHAT_MESSAGES}/${id._id}`, {
                    headers: {Authorization: token},
                })
                setNewMessageData(res.data)
            }
            catch (error) {
                console.error("Error fetching chats:", error);
            }
        }
    }
    const handelChangeMessage = async (id) => {
        setSelectedChat(id)

        manageBroadcast(id)
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;
        try {
            console.log(`${API_ROUTES.BROADCAST}/${selectedChat._id}`, "sgthrthrthrtfg");
            const payload = {text: newMessage};
            const res = await axios.post(`${API_ROUTES.BROADCAST}`, payload, {
                headers: {Authorization: token},
            });
            console.log(res)

            if (res.data) {
                manageBroadcast(selectedChat)
                setNewMessage('')
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    console.log(messenger, "dcdhdf");
    return (<>
        <div className="py-3 px-5">
            <Header/>
        </div>
        <div className="flex min-h-[90VH] h-[100%] bg-gray-100 justify-center items-center" >
            <div className="container">
                <div className="flex flex-row justify-center gap-x-6">
                    {/* Left Sidebar */}
                    <div className={`w-full h-[80vh] overflow-auto lg:w-[30%] bg-white border-r ${selectedChat ? 'hidden lg:block' : ''}`}>
                        <div className="p-4 border-b">
                            <h1 className="text-xl font-semibold">Chats</h1>
                        </div>
                        <div className="overflow-y-auto h-[calc(80vh-4rem)]">
                            {(messenger.length > 0) && messenger?.map((item) => (<div
                                key={item._id}
                                onClick={() => handelChangeMessage(item)}
                                className={`flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer ${selectedChat?._id === item?._id ? 'bg-blue-50' : ''}`}
                            >
                                <img
                                    src={item?.participants[0]?.basicDetails?.profile_pic || profile}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-sm font-medium">{item?.participants[0]?.basicDetails?.firstname + " " + item?.participants[0]?.basicDetails?.lastname}</h3>
                                        {/*<span className="text-xs text-gray-500">{item.time}</span>*/}
                                    </div>
                                    {/*<div className="flex justify-between items-center">*/}
                                    {/*    <p className="text-sm text-gray-600 truncate">*/}
                                    {/*        {item.sponsored && (*/}
                                    {/*            <span className="text-blue-500 mr-1">Sponsored</span>*/}
                                    {/*        )}*/}
                                    {/*        {item.message}*/}
                                    {/*    </p>*/}
                                    {/*    {item.unread && (*/}
                                    {/*        <span className="bg-green-500 w-2 h-2 rounded-full"></span>*/}
                                    {/*    )}*/}
                                    {/*</div>*/}
                                    {/*{item.active && (*/}
                                    {/*    <span className="text-xs text-green-500">Active now</span>*/}
                                    {/*)}*/}
                                </div>
                            </div>))}
                        </div>
                    </div>

                    {/* Right Chat Area */}
                    <div className={`flex-1 flex h-[80vh] overflow-auto flex-col ${selectedChat ? 'block' : 'hidden'}`}>
                        {selectedChat?._id !== null ? (<>
                            <div className="p-4 border-b bg-white flex items-center">
                                <button
                                    onClick={() => setSelectedChat(null)}
                                    className="lg:hidden p-2 text-gray-600 hover:bg-gray-200 rounded-md"
                                >
                                    ← Back
                                </button>
                                <img
                                    src={selectedChat?.participants[0]?.basicDetails?.profile_pic}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full ml-3"
                                />
                                <h2 className="text-lg font-semibold ml-2">
                                    {`${selectedChat?.participants[0]?.basicDetails?.firstname} ${selectedChat?.participants[0]?.basicDetails?.lastname}`}
                                </h2>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {newMessageData.length > 0 &&
                                    newMessageData.map((msg) => (
                                        <div
                                            key={msg._id}
                                            className={`flex ${
                                                user?.id === msg?.sender?._id
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                            }`}
                                        >
                                            <div className="max-w-[70%] rounded-lg p-3 bg-white">
                                                <p className="text-sm">{msg?.text}</p>
                                                <p className="text-xs mt-1 opacity-70">{moment(msg.createdAt).format("hh:mm A")}</p>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div className="p-4 border-t bg-white">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        // onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Write a message..."
                                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-[#00C5FF] text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>) : (<div className="flex-1 flex items-center justify-center bg-gray-50">
                            <p className="text-gray-500">Select a chat to start messaging</p>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default AdminMessaging;



// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client"; // ✅ Socket.IO import
// import logo from "../../assets/logo.png";
// import { API_ROUTES } from "../../utils/APIs";
// import axios from "axios";
// import moment from "moment";
// import Header from "../../components/sidebar/Header";
// import profile from "../../assets/profilepic/profile.webp";
//
// function AdminMessaging() {
//     const token = localStorage.getItem("admin_token");
//     const user = JSON.parse(localStorage.getItem('admin_user'));
//     const [selectedChat, setSelectedChat] = useState(null);
//     const [newMessage, setNewMessage] = useState("");
//     const [newMessageData, setNewMessageData] = useState([]);
//     const [socket, setSocket] = useState(null); // ✅ Socket state
//
//     const staticChat = [{
//         _id: user._id, userName: "BROADCAST", email: "", participants: [{
//             basicDetails: {
//                 firstname: 'BROADCAST', lastname: '', profile_pic: logo
//             }
//         }]
//     }];
//     const [messenger, setMessenger] = useState(staticChat || []);
//
//     // ✅ Initialize socket and connect
//     useEffect(() => {
//         const newSocket = io("http://localhost:5000", {
//             query: { userId: user._id },
//             transports: ['websocket']
//         });
//         setSocket(newSocket);
//
//         getAllChat();
//
//         return () => {
//             newSocket.disconnect(); // Cleanup on unmount
//         };
//     }, []);
//
//     // ✅ Listen for real-time messages
//     useEffect(() => {
//         if (!socket) return;
//
//         socket.on("messageReceived", (msg) => {
//             if (selectedChat && msg.chatId === selectedChat._id) {
//                 setNewMessageData(prev => [...prev, msg]);
//             }
//         });
//
//         return () => {
//             socket.off("messageReceived");
//         };
//     }, [socket, selectedChat]);
//
//     const getAllChat = async () => {
//         try {
//             const res = await axios.get(API_ROUTES.ALL_CHAT, { headers: { Authorization: token } });
//
//             if (res.data.length > 0) {
//                 setMessenger([...staticChat, ...res.data]);
//                 setSelectedChat(res.data[0]);
//             }
//         } catch (error) {
//             console.error("Error fetching chats:", error);
//         }
//     };
//
//     const manageBroadcast = async (id) => {
//         if (id.userName === "BROADCAST") {
//             try {
//                 const res = await axios.get(API_ROUTES.BROADCAST, { headers: { Authorization: token } });
//                 setNewMessageData(res.data);
//             } catch (error) {
//                 console.error("Error fetching chats:", error);
//             }
//         } else {
//             try {
//                 const res = await axios.get(`${API_ROUTES.CHAT_MESSAGES}/${id._id}`, {
//                     headers: { Authorization: token },
//                 });
//                 setNewMessageData(res.data);
//             } catch (error) {
//                 console.error("Error fetching chats:", error);
//             }
//         }
//     };
//
//     const handelChangeMessage = async (id) => {
//         setSelectedChat(id);
//         manageBroadcast(id);
//     };
//
//     const handleSendMessage = async () => {
//         if (!newMessage.trim() || !selectedChat) return;
//
//         try {
//             const payload = { text: newMessage };
//             const res = await axios.post(`${API_ROUTES.BROADCAST}`, payload, {
//                 headers: { Authorization: token },
//             });
//
//             if (res.data) {
//                 manageBroadcast(selectedChat);
//                 setNewMessage('');
//
//                 // ✅ Emit to Socket.IO
//                 socket?.emit("newMessage", {
//                     chatId: selectedChat._id,
//                     message: res.data,
//                 });
//             }
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };
//
//     return (
//         <>
//             <div className="py-3 px-5">
//                 <Header />
//             </div>
//             <div className="flex min-h-[90VH] h-[100%] bg-gray-100 justify-center items-center">
//                 <div className="container">
//                     <div className="flex flex-row justify-center gap-x-6">
//                         {/* Chat Sidebar */}
//                         <div className={`w-full h-[80vh] overflow-auto lg:w-[30%] bg-white border-r ${selectedChat ? 'hidden lg:block' : ''}`}>
//                             <div className="p-4 border-b">
//                                 <h1 className="text-xl font-semibold">Chats</h1>
//                             </div>
//                             <div className="overflow-y-auto h-[calc(80vh-4rem)]">
//                                 {(messenger.length > 0) && messenger?.map((item) => (
//                                     <div
//                                         key={item._id}
//                                         onClick={() => handelChangeMessage(item)}
//                                         className={`flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer ${selectedChat?._id === item?._id ? 'bg-blue-50' : ''}`}
//                                     >
//                                         <img
//                                             src={item?.participants[0]?.basicDetails?.profile_pic || profile}
//                                             alt="avatar"
//                                             className="w-10 h-10 rounded-full mr-3"
//                                         />
//                                         <div className="flex-1 min-w-0">
//                                             <h3 className="text-sm font-medium">
//                                                 {item?.participants[0]?.basicDetails?.firstname + " " + item?.participants[0]?.basicDetails?.lastname}
//                                             </h3>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//
//                         {/* Chat Window */}
//                         <div className={`flex-1 flex h-[80vh] overflow-auto flex-col ${selectedChat ? 'block' : 'hidden'}`}>
//                             {selectedChat?._id !== null ? (
//                                 <>
//                                     <div className="p-4 border-b bg-white flex items-center">
//                                         <button
//                                             onClick={() => setSelectedChat(null)}
//                                             className="lg:hidden p-2 text-gray-600 hover:bg-gray-200 rounded-md"
//                                         >
//                                             ← Back
//                                         </button>
//                                         <img
//                                             src={selectedChat?.participants[0]?.basicDetails?.profile_pic}
//                                             alt="avatar"
//                                             className="w-10 h-10 rounded-full ml-3"
//                                         />
//                                         <h2 className="text-lg font-semibold ml-2">
//                                             {`${selectedChat?.participants[0]?.basicDetails?.firstname} ${selectedChat?.participants[0]?.basicDetails?.lastname}`}
//                                         </h2>
//                                     </div>
//
//                                     <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//                                         {newMessageData.length > 0 &&
//                                             newMessageData.map((msg) => (
//                                                 <div
//                                                     key={msg._id}
//                                                     className={`flex ${user?.id === msg?.sender?._id ? 'justify-end' : 'justify-start'}`}
//                                                 >
//                                                     <div className="max-w-[70%] rounded-lg p-3 bg-white">
//                                                         <p className="text-sm">{msg?.text}</p>
//                                                         <p className="text-xs mt-1 opacity-70">{moment(msg.createdAt).format("hh:mm A")}</p>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                     </div>
//
//                                     <div className="p-4 border-t bg-white">
//                                         <div className="flex items-center space-x-2">
//                                             <input
//                                                 type="text"
//                                                 value={newMessage}
//                                                 onChange={(e) => setNewMessage(e.target.value)}
//                                                 placeholder="Write a message..."
//                                                 className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             />
//                                             <button
//                                                 onClick={handleSendMessage}
//                                                 className="bg-[#00C5FF] text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//                                             >
//                                                 Send
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <div className="flex-1 flex items-center justify-center bg-gray-50">
//                                     <p className="text-gray-500">Select a chat to start messaging</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
//
// export default AdminMessaging;
//
