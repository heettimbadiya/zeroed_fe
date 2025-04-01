import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
    { name: "Jan", users: 400 },
    { name: "Feb", users: 600 },
    { name: "Mar", users: 800 },
    { name: "Apr", users: 700 },
    { name: "May", users: 900 },
    { name: "Jun", users: 1000 },
];

function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md p-4">
                <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                <ul>
                    <li className="mb-2 p-2 bg-gray-200 rounded">Home</li>
                    <li className="mb-2 p-2 hover:bg-gray-200 rounded cursor-pointer">Users</li>
                    <li className="mb-2 p-2 hover:bg-gray-200 rounded cursor-pointer">Settings</li>
                </ul>
            </div>

            <div className="flex flex-col flex-1">
                {/* Top Navigation */}
                <div className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">User Management Dashboard</h1>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add User</button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-white shadow-md p-6 rounded">
                        <h2 className="text-xl font-bold mb-4">User Growth</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
