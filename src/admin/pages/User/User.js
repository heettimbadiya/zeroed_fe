import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { UserContext } from "../../layout/sidebar/MainLayout";
import { useGetAllUser } from "../../api/user";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb";
import { CircleCancle, CloseFAQ, True } from "../../common/Icons";

function User() {
    const user = useContext(UserContext);
    const { users, isLoading } = useGetAllUser(user?.token);
    const [usersData, setUsersData] = useState(users || []);

    useEffect(() => {
        setUsersData(users);
    }, [users]);

    return (
        <div className="container p-4 sm:p-6 bg-gray-100">
            <BreadCrumb
                primary={{ title: "Dashboard", path: '/dashboard' }}
                secondary={{ title: "User", path: '/dashboard/user' }}
            />
            <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 text-center">
                Users
            </h2>
            <div className="shadow-lg rounded-lg bg-white p-2 md:p-4">
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading users...</p>
                ) : (
                    <div className="overflow-x-auto md:overflow-x-visible">
                        <table className="min-w-[700px] md:min-w-full border-collapse">
                            <thead>
                            <tr className="bg-[#374151] text-white">
                                <th className="border border-gray-300 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                                    ID
                                </th>
                                <th className="border border-gray-300 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                                    Profile
                                </th>
                                <th className="border border-gray-300 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                                    Name
                                </th>
                                <th className="border border-gray-300 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                                    Email
                                </th>
                                <th className="border border-gray-300 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                                    Date
                                </th>
                                <th className="border border-gray-300 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                                    Verified
                                </th>
                                <th className="border border-gray-300 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                                    Active
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {usersData?.length > 0 ? (
                                usersData?.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className={`${
                                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        } hover:bg-gray-100 transition duration-200`}
                                    >
                                        <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                                            {index + 1}
                                        </td>
                                        <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">
                                            <div className="flex justify-center">
                                                <img
                                                    src={user.profile_pic || "https://via.placeholder.com/40"}
                                                    alt="User Avatar"
                                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                                            {`${user?.firstname} ${user?.lastname}`}
                                        </td>
                                        <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                                            {user?.user_id?.email || '-'}
                                        </td>
                                        <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-700">
                                            {moment(user?.createdAt).format("DD MMM YYYY")}
                                        </td>
                                        <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">
                                            <div className="flex justify-center">
                                                {user?.isVerified ? <True /> : <CircleCancle />}
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2">
                                            <div className="flex justify-center">
                                                {user?.isActive ? <True /> : <CircleCancle />}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default User;