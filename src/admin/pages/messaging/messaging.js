// import React, { useEffect, useState } from "react";
// import logo from "../../assets/logo.png";
// import { API_ROUTES } from "../../utils/APIs";
// import axios from "axios";
// import moment from "moment";
// import Header from "../../components/sidebar/Header";
//
// function AdminMessaging() {
//     const token = localStorage.getItem("token");
//     const [selectedChat, setSelectedChat] = useState(null);
//     const [newMessage, setNewMessage] = useState("");
//     const [chatMessages, setChatMessages] = useState([]);
//
//     // Static Data
//     const staticChat = {
//         id: 99, // Unique ID for static data
//         name: "Kaushal Sojitra",
//         message: "This is a global announcement!",
//         time: moment().format("hh:mm A"),
//         image: logo, // Placeholder image
//         sponsored: false,
//         messages: [
//             {
//                 id: 1,
//                 sender: "Kaushal Sojitra",
//                 content: "This is a global announcement!",
//                 time: moment().format("hh:mm A"),
//                 isUser: false,
//             },
//         ],
//     };
//
//     const [messenger, setMessenger] = useState([staticChat]); // Initializing with static data
//
//     useEffect(() => {
//         getAllChats();
//     }, []);
//
//     useEffect(() => {
//         if (selectedChat) {
//             fetchChatMessages(selectedChat.id);
//         }
//     }, [selectedChat]);
//
//     const getAllChats = async () => {
//         try {
//             const res = await axios.get(API_ROUTES.ALL_CHAT, {
//                 headers: { Authorization: token },
//             });
//
//             // Adding static chat to the response data
//             const updatedChats = [staticChat, ...res.data];
//
//             setMessenger(updatedChats);
//             if (updatedChats.length > 0) {
//                 setSelectedChat(updatedChats[0]);
//             }
//         } catch (error) {
//             console.error("Error fetching chats:", error);
//         }
//     };
//
//     const fetchChatMessages = async (chatId) => {
//         if (chatId === 99) {
//             setChatMessages(staticChat.messages);
//         } else {
//             try {
//                 const res = await axios.get(`${API_ROUTES.CHAT_MESSAGES}/${chatId}`, {
//                     headers: { Authorization: token },
//                 });
//                 setChatMessages(res.data);
//             } catch (error) {
//                 console.error("Error fetching messages:", error);
//             }
//         }
//     };
//
//     const handleSendMessage = async () => {
//         if (!newMessage.trim()) return;
//
//         const newMsg = {
//             id: chatMessages.length + 1,
//             sender: "You",
//             text: newMessage,
//             createdAt: new Date(),
//             isUser: true,
//         };
//
//         if (selectedChat.id === 99) {
//             setChatMessages([...chatMessages, newMsg]);
//             setNewMessage("");
//         } else {
//             const payload = { text: newMessage }; // ✅ Define payload properly
//             const config = {
//                 headers: {
//                     Authorization: token,
//                 },
//             };
//
//             try {
//                 await axios.post(API_ROUTES.BROADCAST, payload, config);
//                 setChatMessages([...chatMessages, newMsg]);
//                 setNewMessage("");
//             } catch (error) {
//                 console.error("Error sending message:", error);
//             }
//         }
//     };
//
//
//     return (
//         <>
//             <div className="py-3 px-5">
//                 <Header />
//             </div>
//             <div className="flex h-[93VH] bg-gray-100 justify-center items-center">
//                 <div className="container">
//                     <div className="flex lg:flex-row flex-col justify-center gap-x-6">
//                         {/* Left Sidebar */}
//                         <div className="w-full h-[80VH] overflow-auto lg:w-[30%] bg-white border-r">
//                             <div className="p-4 border-b">
//                                 <h1 className="text-xl font-semibold">Chats</h1>
//                             </div>
//                             <div className="overflow-y-auto h-[calc(80vh-4rem)]">
//                                 {messenger.length > 0 ? (
//                                     messenger.map((item) => (
//                                         <div
//                                             key={item.id}
//                                             onClick={() => setSelectedChat(item)}
//                                             className={`flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer ${selectedChat?.id === item.id ? "bg-blue-50" : ""}`}
//                                         >
//                                             <img
//                                                 src={item.image || logo}
//                                                 alt="avatar"
//                                                 className="w-10 h-10 rounded-full mr-3"
//                                             />
//                                             <div className="flex-1 min-w-0">
//                                                 <div className="flex justify-between items-center mb-1">
//                                                     <h3 className="text-sm font-medium">{item.name}</h3>
//                                                 </div>
//                                                 <p className="text-sm text-gray-600 truncate">
//                                                     {item.sponsored && <span className="text-blue-500 mr-1">Sponsored</span>}
//                                                     {item.message}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p className="p-4 text-gray-500">No chats available</p>
//                                 )}
//                             </div>
//                         </div>
//
//                         {/* Right Chat Area */}
//                         <div className="flex-1 flex h-[80VH] overflow-auto flex-col hidden lg:flex">
//                             {selectedChat ? (
//                                 <>
//                                     <div className="p-4 border-b bg-white flex items-center">
//                                         <img
//                                             src={selectedChat.image || logo}
//                                             alt="avatar"
//                                             className="w-10 h-10 rounded-full mr-3"
//                                         />
//                                         <div>
//                                             <h2 className="text-lg font-semibold">{selectedChat.name}</h2>
//                                         </div>
//                                     </div>
//
//                                     <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//                                         {chatMessages.length > 0 ? (
//                                             chatMessages.map((msg) => (
//                                                 <div
//                                                     key={msg.id}
//                                                     className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
//                                                 >
//                                                     <div
//                                                         className={`max-w-[70%] rounded-lg p-3 ${msg.isUser ? "bg-blue-500 text-white" : "bg-white"}`}
//                                                     >
//                                                         <span className="text-sm font-medium">{msg.content}</span>
//                                                         <p className="text-xs mt-1 opacity-70">
//                                                             {msg.time}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <p className="text-gray-500 text-center">No messages yet</p>
//                                         )}
//                                     </div>
//
//                                     <div className="p-4 border-t bg-white">
//                                         <div className="flex items-center space-x-2">
//                                             <input
//                                                 type="text"
//                                                 value={newMessage}
//                                                 onChange={(e) => setNewMessage(e.target.value)}
//                                                 onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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




import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { API_ROUTES } from "../../utils/APIs";
import axios from "axios";
import moment from "moment";
 import Header from "../../components/sidebar/Header";
 import profile from "../../assets/profilepic/profile.webp";

function AdminMessaging() {
    const token = localStorage.getItem("admin_token");
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [messenger, setMessenger] = useState([
        // {
        //     id: 0,
        //     name: "Zeroed",
        //     message: "Hello everyone...",
        //     time: "Mar 18",
        //     image: logo,
        //     sponsored: true,
        //     messages: [
        //         { id: 1, sender: "Zeroed", content: "Hello everyone", time: "Mar 18", isUser: false }
        //     ]
        // },
    ]);

    useEffect(() => {
        getAllChat();
    }, []);

    const getAllChat = async () => {
        try {
            const res = await axios.get(API_ROUTES.ALL_CHAT, { headers: { Authorization: token } });

            if (res.data.length > 0) {
                setMessenger((prev) => res.data); // Preserve static messages
                setSelectedChat(res.data[0]);
                console.log(res.data ,"fdbfdb");
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;

        try {
            console.log(`${API_ROUTES.BROADCAST}/${selectedChat._id}`, "sgthrthrthrtfg");
            const payload = { text: newMessage};
            const res = await axios.post(`${API_ROUTES.BROADCAST}`, payload, {
                headers: { Authorization: token },
            });
            console.log(res)

            if (res.data) {
                setMessenger((prev) =>
                    prev.map((chat) =>
                        chat.id === selectedChat.id
                            ? {
                                ...chat,
                                messages: [...chat.messages, { id: chat.messages.length + 1, sender: "You", content: newMessage, time: moment().format("hh:mm A"), isUser: true }],
                                message: newMessage,
                                time: moment().format("hh:mm A"),
                            }
                            : chat
                    )
                );
                setNewMessage("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
        console.log(messenger ,"dcdhdf");
    return (
        <>
            <div className="py-3 px-5">
                                <Header />
                          </div>
        <div className="flex h-[93VH] bg-gray-100 justify-center items-center">
            <div className="container">
                <div className="flex lg:flex-row flex-col justify-center gap-x-6">
                    {/* Left Sidebar */}
                    <div className="w-full h-[80VH] overflow-auto lg:w-[30%] bg-white border-r">
                        <div className="p-4 border-b">
                            <h1 className="text-xl font-semibold">Chats</h1>
                        </div>
                        <div className="overflow-y-auto h-[calc(80vh-4rem)]">
                            {(messenger.length > 0) && messenger?.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => handleSendMessage(item)}
                                    className={`flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer ${
                                        selectedChat?._id === item?._id ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <img
                                        src={item.participants[0].basicDetails.profile_pic || profile}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="text-sm font-medium">{item.participants[0].basicDetails.firstname + " " + item.participants[0].basicDetails.lastname}</h3>
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
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Chat Area */}
                    <div className="flex-1 flex h-[80VH] overflow-auto flex-col hidden lg:flex">
                        handleSendMessage
                    </div>
                </div>
            </div>
        </div></>
    );
}

export default AdminMessaging;

