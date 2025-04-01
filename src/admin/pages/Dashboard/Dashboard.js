import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import {Users, Activity, ArrowUp, ArrowDown, BarChart2} from "lucide-react";

const data = [
    { name: "Jan", users: 400, premium: 120 },
    { name: "Feb", users: 600, premium: 180 },
    { name: "Mar", users: 800, premium: 240 },
    { name: "Apr", users: 700, premium: 210 },
    { name: "May", users: 900, premium: 270 },
    { name: "Jun", users: 1000, premium: 300 },
];

const barData = [
    { name: "Active Users", value: 300 },
    { name: "Inactive Users", value: 200 },
];

const pieData = [
    { name: "Admin", value: 10 },
    { name: "Editor", value: 20 },
    { name: "Viewer", value: 70 },
];

const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

const stats = [
    { title: "Total Users", value: "12,430", change: "+12.3%", icon: Users, trend: "up" },
    { title: "Active Sessions", value: "2,342", change: "+8.1%", icon: Activity, trend: "up" },
    { title: "Premium Users", value: "1,234", change: "-3.2%", icon: Users, trend: "down" },
    { title: "Avg. Engagement", value: "4.2m", change: "+2.4%", icon: BarChart2, trend: "up" },
];

function Dashboard() {
    return (
        <div className="bg-gray-50 p-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.change}
                                    </span>
                                    {stat.trend === 'up' ? (
                                        <ArrowUp className="w-4 h-4 text-green-600"/>
                                    ) : (
                                        <ArrowDown className="w-4 h-4 text-red-600"/>
                                    )}
                                </div>
                            </div>
                            <stat.icon className="w-12 h-12 text-gray-400 p-2 bg-gray-100 rounded-lg"/>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* User Growth Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2 xl:col-span-1">
                    <h3 className="font-semibold text-lg mb-4">User Growth Overview</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-50"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip
                                    contentStyle={{
                                        background: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    dot={{fill: '#6366f1', strokeWidth: 2}}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="premium"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    dot={{fill: '#22c55e', strokeWidth: 2}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Status Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">User Activity Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-50"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip
                                    contentStyle={{
                                        background: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#6366f1"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Roles Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">User Roles Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Legend
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    iconSize={10}
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Metric Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-sm">
                    <h4 className="text-sm font-medium mb-2">Highest Activity Day</h4>
                    <p className="text-2xl font-bold mb-2">Wednesday</p>
                    <p className="text-sm opacity-85">+34% above weekly average</p>
                </div>
                <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-sm">
                    <h4 className="text-sm font-medium mb-2">New Users This Month</h4>
                    <p className="text-2xl font-bold mb-2">1,234</p>
                    <p className="text-sm opacity-85">+18% from previous month</p>
                </div>
                <div className="bg-amber-600 text-white p-6 rounded-xl shadow-sm">
                    <h4 className="text-sm font-medium mb-2">Pending Actions</h4>
                    <p className="text-2xl font-bold mb-2">23</p>
                    <p className="text-sm opacity-85">5 awaiting approval</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;