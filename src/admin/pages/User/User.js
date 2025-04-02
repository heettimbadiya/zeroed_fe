import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { UserContext } from "../../layout/sidebar/MainLayout";
import {useGetAllUser} from "../../api/user";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb";
import {CircleCancle, CloseFAQ, True} from "../../common/Icons";

function User() {
    const user = useContext(UserContext);
    const { users,isLoading} = useGetAllUser(user?.token)
    const [usersData, setUsersData] = useState(users || []);
    useEffect(() => {
            setUsersData(users)
    }, [users]);
    return (
        <div className="container p-6 bg-gray-100 ">
            <BreadCrumb primary={{title:"Dashboard",path:'/dashboard'}} secondary={{title:"User",path:'/dashboard/user'}}/>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Users</h2>
            <div className="overflow-x-auto w-full shadow-lg rounded-lg bg-white p-4">
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading users...</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
                        <thead>
                        <tr className="bg-blue-500">
                            <th className="border border-gray-300 px-4 py-3">ID</th>
                            <th className="border border-gray-300 px-4 py-3">Profile</th>
                            <th className="border border-gray-300 px-4 py-3">Name</th>
                            <th className="border border-gray-300 px-4 py-3">Email</th>
                            <th className="border border-gray-300 px-4 py-3">Date</th>
                            <th className="border border-gray-300 px-4 py-3">Verified</th>
                            <th className="border border-gray-300 px-4 py-3">Active</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usersData?.length > 0 ? (
                            usersData?.map((user, index) => (
                                <tr
                                    key={user._id}
                                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} text-center hover:bg-gray-200 transition duration-300`}
                                >
                                    <td className="border border-gray-300 px-4 py-1 text-gray-700">{index+1}</td>
                                    <td className="border border-gray-300 px-4 py-1 text-gray-700">
                                        <div className='flex justify-center'><img
                                            src={user.profile_pic || "https://via.placeholder.com/40"}
                                            alt="User Avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        /></div>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-1 text-gray-700">{`${user?.firstname} ${user?.lastname}`}</td>
                                    <td className="border border-gray-300 px-4 py-1 text-gray-700">{user?.user_id?.email || '-'}</td>
                                    <td className="border border-gray-300 px-4 py-1 text-gray-700">{moment(user?.createdAt).format("DD MMM YYYY")}</td>
                                    <td className="border border-gray-300 px-4 py-1 text-gray-700"><div className={'flex justify-center'}>{user?.isVerified ?
                                        <True/> : <CircleCancle />}</div>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-1 text-gray-700"><div className={'flex justify-center'}>{user?.isActive ? <True /> : <CircleCancle />}</div></td>
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
