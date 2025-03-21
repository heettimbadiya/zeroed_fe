import React, { useState } from 'react';

function Messaging() {
    const [selectedChat, setSelectedChat] = useState(0);
    const [newMessage, setNewMessage] = useState('');
    const [messenger, setMessenger] = useState([
        {
            id: 0,
            name: "Kunj Kapadiya",
            message: "Please Replay",
            time: "4:40 PM",
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWaLmZv1-4kxBlI3FqOf25N0V2H7ok_FoZ2Y-q_P5058voU8as-N833jG90N6GpBMdtk&usqp=CAU',
            unread: true,
            active: true,
            messages: [
                {
                    id: 1,
                    sender: 'Kunj Kapadiya',
                    content: 'Hello sir,',
                    time: '4:30 PM',
                    isUser: false,
                },
                {
                    id: 2,
                    sender: 'You',
                    content: 'How Are You',
                    time: '4:31 PM',
                    isUser: true
                },
                {
                    id: 3,
                    sender: 'Kunj Kapadiya',
                    content: 'Sure',
                    time: '4:31 PM',
                    isUser: false
                },
            ]
        },
        {
            id: 1,
            name: "Pratik Kapasi",
            message: "Sponsored Your unique experience...",
            time: "Mar 18",
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWaLmZv1-4kxBlI3FqOf25N0V2H7ok_FoZ2Y-q_P5058voU8as-N833jG90N6GpBMdtk&usqp=CAU',
            sponsored: true,
            messages: [
                {
                    id: 1,
                    sender: 'Pratik Kapasi',
                    content: 'Your unique experience...',
                    time: 'Mar 18',
                    isUser: false
                }
            ]
        },
        {
            id: 2,
            name: "Gagandeep Singh",
            message: "Gagandeep: Okay",
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWaLmZv1-4kxBlI3FqOf25N0V2H7ok_FoZ2Y-q_P5058voU8as-N833jG90N6GpBMdtk&usqp=CAU',
            time: "Mar 10",
            messages: [
                {
                    id: 1,
                    sender: 'Gagandeep Singh',
                    content: 'Okay',
                    time: 'Mar 10',
                    isUser: false
                }
            ]
        },
    ]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: messenger[selectedChat].messages.length + 1,
                sender: 'You',
                content: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isUser: true
            };

            const updatedMessenger = messenger.map(chat => {
                if (chat.id === selectedChat) {
                    return {
                        ...chat,
                        messages: [...chat.messages, newMsg],
                        message: newMessage, // Update preview message
                        time: new Date().toLocaleTimeString() // Update preview time
                    };
                }
                return chat;
            });

            setMessenger(updatedMessenger);
            setNewMessage('');
        }
    };

    return (
        <div className="flex h-[90VH] bg-gray-100 justify-center items-center">
            <div className="container">
                <div className="flex lg:flex-row flex-col justify-center gap-x-6">
                    {/* Left Sidebar */}
                    <div className="w-full h-[80VH] overflow-auto lg:w-[30%] bg-white border-r">
                        <div className="p-4 border-b">
                            <h1 className="text-xl font-semibold">Chats</h1>
                        </div>

                        <div className="overflow-y-auto h-[calc(80vh-4rem)]">
                            {messenger.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedChat(item.id)}
                                    className={`flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer ${
                                        selectedChat === item.id ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <img
                                        src={item.image}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="text-sm font-medium">{item.name}</h3>
                                            <span className="text-xs text-gray-500">{item.time}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-600 truncate">
                                                {item.sponsored && (
                                                    <span className="text-blue-500 mr-1">Sponsored</span>
                                                )}
                                                {item.message}
                                            </p>
                                            {item.unread && (
                                                <span className="bg-green-500 w-2 h-2 rounded-full"></span>
                                            )}
                                        </div>
                                        {item.active && (
                                            <span className="text-xs text-green-500">Active now</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Chat Area */}
                    <div className="flex-1 flex h-[80VH] overflow-auto flex-col hidden lg:flex">
                        {selectedChat !== null ? (
                            <>
                                <div className="p-4 border-b bg-white flex items-center">
                                    <img
                                        src={messenger[selectedChat].image}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            {messenger[selectedChat].name}
                                        </h2>
                                        <span className="text-green-500 text-sm">
                                            {messenger[selectedChat].active ? '● Active now' : 'Offline'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                    {messenger[selectedChat].messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-lg p-3 ${
                                                    msg.isUser ? 'bg-blue-500 bg-white' : 'bg-white'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium">
                                                        {msg.sender}
                                                    </span>
                                                </div>
                                                <p className="text-sm">{msg.content}</p>
                                                <p className="text-xs mt-1 opacity-70">{msg.time}</p>
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
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
    );
}

export default Messaging;