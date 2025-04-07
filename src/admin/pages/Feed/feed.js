import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Pencil, Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import { API_ROUTES } from "../../utils/APIs";
import { useGetAllFeed } from "../../api/feed";
import { UserContext } from "../../layout/sidebar/MainLayout";

function Feed() {
    const [showPopover, setShowPopover] = useState(false);
    const user = useContext(UserContext);
    const { feeds,mutate, isFeedLoading } = useGetAllFeed(user?.token);
    const [usersData, setUsersData] = useState(feeds || []);

    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({ description: '', thumbnail: '', noc_number: '' });

    useEffect(() => {
        setUsersData(feeds);
    }, [feeds]);

    const openAddPopover = () => {
        setEditItem(null);
        setFormData({ description: '', thumbnail: '', noc_number: '' });
        setShowPopover(true);
    };

    const openEditPopover = (item) => {
        setEditItem(item);
        setFormData({
            description: item.description,
            thumbnail: item.thumbnail,
            noc_number: item.noc_number || '',
        });
        setShowPopover(true);
    };

    const handleInputChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    thumbnail: reader.result,
                    file,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const payload = new FormData();
        payload.append('description', formData.description);
        payload.append('noc_number', formData.noc_number);
        if (formData.file) {
            payload.append('thumbnail', formData.file);
        }

        try {
            if (editItem) {
                await axios.put(`${API_ROUTES.FEED}/${editItem._id}`, payload, {
                    headers: {
                        Authorization: `${user?.token}`,
                    },
                });
                mutate()
            } else {
                await axios.post(API_ROUTES.FEED, payload, {
                    headers: {
                        Authorization: `${user?.token}`,
                    },
                });
                mutate()
            }
            setShowPopover(false);
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_ROUTES.FEED}/${id}`, {
                headers: {
                    Authorization: `${user?.token}`,
                },
            });
            mutate()
        } catch (err) {
            console.error('Error deleting item:', err);
        }
    };

    return (
        <div className="container p-4 sm:p-6 bg-gray-100">
            <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 text-center">Feeds</h2>

            <div className="flex justify-end mb-5">
                <button className="bg-[#374151] text-white px-7 py-3 rounded flex items-center gap-2" onClick={openAddPopover}>
                    <Plus size={16} /> Add Feed
                </button>
            </div>

            <div className="shadow-lg rounded-lg bg-white p-2 md:p-4">
                {isFeedLoading ? (
                    <p className="text-center text-gray-500">Loading items...</p>
                ) : (
                    <div className="overflow-x-auto md:overflow-x-visible">
                        <table className="min-w-[700px] md:min-w-full border-collapse">
                            <thead>
                            <tr className="bg-[#374151] text-white">
                                <th className="border px-4 py-2 text-sm">ID</th>
                                <th className="border px-4 py-2 text-sm">Thumbnail</th>
                                <th className="border px-4 py-2 text-sm">Description</th>
                                <th className="border px-4 py-2 text-sm">NOC Number</th>
                                <th className="border px-4 py-2 text-sm">Date</th>
                                <th className="border px-4 py-2 text-sm">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {usersData?.length > 0 ? (
                                usersData.map((item, index) => (
                                    <tr key={item._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="border px-4 py-2 text-sm text-center">{index + 1}</td>
                                        <td className="border px-4 py-2 text-center">
                                            <img
                                                src={item.thumbnail || 'https://via.placeholder.com/40'}
                                                alt="Thumbnail"
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        </td>
                                        <td className="border px-4 py-2 text-sm text-center">{item.description}</td>
                                        <td className="border px-4 py-2 text-sm text-center">{item.noc_number || '-'}</td>
                                        <td className="border px-4 py-2 text-sm text-center">{moment(item.date).format('DD MMM YYYY')}</td>
                                        <td className="border px-4 py-2 text-center">
                                            <button onClick={() => openEditPopover(item)} className="text-blue-600 mr-3">
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="text-red-600">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="border px-4 py-3 text-center text-sm text-gray-500">
                                        No items found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Popover */}
            {showPopover && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
                        <h3 className="text-lg font-semibold mb-4">{editItem ? 'Edit Feed' : 'Add Feed'}</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2 text-sm"
                                placeholder="Enter description"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">NOC Number</label>
                            <input
                                name="noc_number"
                                value={formData.noc_number}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2 text-sm"
                                placeholder="Enter NOC number"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
                            {formData.thumbnail && (
                                <div className="mt-2">
                                    <img src={formData.thumbnail} alt="Preview" className="w-20 h-20 object-cover rounded" />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowPopover(false)}
                                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-[#374151] text-white rounded hover:bg-gray-800"
                            >
                                {editItem ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Feed;
