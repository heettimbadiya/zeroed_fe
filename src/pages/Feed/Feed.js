import React, { useEffect, useState } from 'react';
import { True, Warning } from "../../common/Icons";
import axios from "axios";
import { API_ROUTES } from "../../utils/APIs";

function Feed(props) {
    const [profile, setProfile] = useState(null);
    const [feed, setFeed] = useState([]);
    const [sections, setSections] = useState([
        { name: 'Basic Profile', score: 0, maxScore: 10, completed: [], pending: [] },
        { name: 'Skills', score: 0, maxScore: 40, completed: [], pending: [] },
        { name: 'Work Experience', score: 0, maxScore: 30, completed: [], pending: [] },
        { name: 'Video', score: 0, maxScore: 30, completed: [], pending: [] },
    ]);

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;

    useEffect(() => {
        async function fetchData() {
            try {
                if (userData?.id) {
                    const response = await axios.get(`${API_ROUTES.GET_PROFILE}/${userData.id}`);
                    if (response.data.success) {
                        setProfile(response.data.data);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [userData?.id]);

    useEffect(() => {
        async function feeddata() {
            try {
                const response = await axios.get(API_ROUTES.FEEDS, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `${token}`,
                    },
                });
                if (response.data.length > 0) {
                    setFeed(response.data);
                }
            } catch (error) {
                alert('Something went wrong in update');
            }
        }
        feeddata();
    }, []);

    useEffect(() => {
        if (!profile) return;

        const updatedSections = sections.map(section => ({ ...section, score: 0, completed: [], pending: [] }));

        // Basic Profile
        if (profile.skills?.length > 0) {
            updatedSections[0].score += 2.5;
            updatedSections[0].completed.push('Skills');
        } else {
            updatedSections[0].pending.push('Skills');
        }

        if (profile.basicDetails?.video) {
            updatedSections[0].score += 2.5;
            updatedSections[0].completed.push('Primary Video');
        } else {
            updatedSections[0].pending.push('Primary Video');
        }

        if (profile.workExperience?.length > 0 && profile.workExperience[0]?.accomplishments_id?._id) {
            updatedSections[0].score += 2.5;
            updatedSections[0].completed.push('Accomplishments');
        } else {
            updatedSections[0].pending.push('Accomplishments');
        }

        if (profile.canadianEducation?.length > 0) {
            updatedSections[0].score += 2.5;
            updatedSections[0].completed.push('Education');
        } else {
            updatedSections[0].pending.push('Education');
        }

        // Skills
        if (profile.skills?.[0]?.subSkill?.[0]?.certificate) {
            updatedSections[1].score += 20;
            updatedSections[1].completed.push('Certificate');
        } else {
            updatedSections[1].pending.push('Certificate');
        }

        if (profile.skills?.[0]?.subSkill?.[0]?.link) {
            updatedSections[1].score += 20;
            updatedSections[1].completed.push('Assessments');
        } else {
            updatedSections[1].pending.push('Assessments');
        }

        // Work Experience
        if (profile.workExperience?.length > 0) {
            updatedSections[2].score += 30;
            updatedSections[2].completed.push('Experience');
        } else {
            updatedSections[2].pending.push('Experience');
        }

        // Video
        if (profile.basicDetails?.secondary_video) {
            updatedSections[3].score += 30;
            updatedSections[3].completed.push('Video Interview Instant');
        } else {
            updatedSections[3].pending.push('Video Interview Instant');
        }

        setSections(updatedSections);
    }, [profile]);

    const totalScore = sections.reduce((acc, section) => acc + section.score, 0);
    const scorePercentage = (totalScore / 110) * 100;

    const getScoreColor = () => {
        if (scorePercentage < 30) return 'text-red-500';
        if (scorePercentage < 60) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <>
            <div className="bg-grayLight md:px-10 px-2 py-4 flex justify-center items-center">
                <div className="container">
                    <div className="flex lg:flex-row flex-col justify-center gap-x-6">
                        {/* Feed List */}
                        <div className="lg:w-[40%] w-full lg:h-[calc(100vh-120px)] bg-white overflow-y-auto">
                            <div className="font-semibold text-[18px] mb-5 p-3">Feeds</div>
                            {feed.map((feedItem, index) => (
                                <div key={index}>
                                    <div className="flex p-3 cursor-pointer hover:bg-[#EBEBEB]">
                                        <div>
                                            <img
                                                src={feedItem.thumbnail}
                                                className="w-14 h-14 object-cover rounded-full"
                                                alt={`image_${index}`}
                                            />
                                        </div>
                                        <div className="text-[14px] ml-3 flex-1">{feedItem.description}</div>
                                    </div>
                                    <div className="border"></div>
                                </div>
                            ))}
                        </div>

                        {/* Profile Score Panel */}
                        <div className="lg:w-[36%] w-full lg:max-h-[calc(100vh-120px)] category2 h-auto overflow-y-auto bg-white lg:mt-0 mt-4">
                            <div className="shadow-lg p-6 max-w-2xl mx-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex-grow">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Completion</h2>
                                        <p className="text-gray-600">Keep improving your profile to unlock more opportunities</p>
                                    </div>

                                    <div className="relative w-32 h-32">
                                        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                                            <circle
                                                cx="18"
                                                cy="18"
                                                r="16"
                                                fill="none"
                                                className="stroke-current text-gray-200"
                                                strokeWidth="5"
                                            />
                                        </svg>
                                        <svg className="absolute top-0 left-0 w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                                            <circle
                                                cx="18"
                                                cy="18"
                                                r="16"
                                                fill="none"
                                                className={`stroke-current ${getScoreColor()}`}
                                                strokeWidth="5"
                                                strokeDasharray="100"
                                                strokeDashoffset={`${100 - scorePercentage}`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className={`text-1xl font-bold ${getScoreColor()}`}>
                                                    {scorePercentage.toFixed(0)}
                                                </div>
                                                <div className="text-xs text-gray-500">/ 100%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {sections.map((section, index) => (
                                    <div key={index} className="mb-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-lg font-semibold">{section.name}</h3>
                                            <span className="text-sm text-gray-600">
                                                {section.score}/{section.maxScore}
                                            </span>
                                        </div>
                                        <div className="grid md:grid-cols-1">
                                            <div>
                                                {section.completed.map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm text-green-700 bg-green-50 p-2 rounded mb-1">
                                                        <div>{item}</div>
                                                        <True className="mr-2 w-5 h-5" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                {section.pending.map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm text-yellow-700 bg-yellow-50 p-2 rounded mb-1">
                                                        <div>{item}</div>
                                                        <Warning className="mr-2 w-5 h-5" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Feed;
