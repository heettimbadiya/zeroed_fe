import React, { useState, useRef, useEffect } from "react";
import { IoChatbubbleEllipses, IoClose, IoSend } from "react-icons/io5";

const ChatPopup = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const toggleChat = () => {
        setOpen(!open);
    };

    const sendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { text: message, sender: "user" }]);
            setMessage("");
        }
    };

    // Scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* Floating Chat Button */}
            {!open && (
                <button
                    onClick={toggleChat}
                    className="bg-[#00C5FF] text-white p-4 rounded-full shadow-lg hover:bg-[#009ACD] transition-all duration-300 flex items-center justify-center"
                >
                    <IoChatbubbleEllipses size={28} className="text-white" />
                </button>
            )}

            {/* Chat Popup */}
            {open && (
                <div className="w-80 bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-[#00C5FF] text-white p-4">
                        <span className="font-semibold text-lg">Chat Support</span>
                        <button
                            onClick={toggleChat}
                            className="hover:bg-white/20 rounded-full p-1 transition"
                        >
                            <IoClose size={24} className="text-white" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-60 overflow-y-auto p-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    msg.sender === "user" ? "justify-end" : "justify-start"
                                } mb-2`}
                            >
                                <div
                                    className={`p-3 text-sm rounded-lg max-w-[75%] ${
                                        msg.sender === "user"
                                            ? "bg-[#00C5FF] text-white"
                                            : "bg-gray-300 text-black"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="flex items-center p-3 bg-white border-t">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-[#00C5FF]"
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-2 bg-[#00C5FF] text-white p-2 rounded-md hover:bg-[#009ACD] transition-all duration-300 flex items-center justify-center"
                        >
                            <IoSend size={22} className="text-white" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPopup;
