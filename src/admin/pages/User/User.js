import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { UserContext } from "../../layout/sidebar/MainLayout";
import {useGetAllUser} from "../../api/user";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb";

function User() {
    const user = useContext(UserContext);
    const { users,isLoading} = useGetAllUser(user.token)
    const [usersData, setUsers] = useState(users || []);

    return (
        <div className="container p-6 bg-gray-100 ">
            <BreadCrumb primary={{title:"Dashboard",path:'/dashboard'}} secondary={{title:"User",path:'/dashboard/user'}}/>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">User Table</h2>
            <div className="overflow-x-auto w-full shadow-lg rounded-lg bg-white p-4">
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading users...</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
                        <thead>
                        <tr className="bg-blue-500">
                            <th className="border border-gray-300 px-4 py-3">ID</th>
                            <th className="border border-gray-300 px-4 py-3">Email</th>
                            <th className="border border-gray-300 px-4 py-3">Role</th>
                            <th className="border border-gray-300 px-4 py-3">Verified</th>
                            <th className="border border-gray-300 px-4 py-3">Active</th>
                            <th className="border border-gray-300 px-4 py-3">Created At</th>
                            <th className="border border-gray-300 px-4 py-3">Updated At</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usersData.length > 0 ? (
                            usersData.map((user, index) => (
                                <tr
                                    key={user._id}
                                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} text-center hover:bg-gray-200 transition duration-300`}
                                >
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{user._id}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{user.email}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{user.role}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{user.isVerified ? "✅" : "❌"}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{user.isActive ? "✅" : "❌"}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{moment(user.createdAt).format("DD MMM YYYY")}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{moment(user.updatedAt).format("DD MMM YYYY")}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="border border-gray-300 px-4 py-3 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default User;
