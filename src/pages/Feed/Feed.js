import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { True, Warning } from '../../common/Icons';
import axios from 'axios';
import { API_ROUTES } from '../../utils/APIs';
import {PageLoading} from "../../common/Icons/Loading/pageLoading";

function Feed() {
    const [profile, setProfile] = useState(null);
    const [feed, setFeed] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingFeed, setLoadingFeed] = useState(true);

    const [sections, setSections] = useState([
        { name: 'Basic Profile', score: 0, maxScore: 10, completed: [], pending: [] },
        { name: 'Skills', score: 0, maxScore: 40, completed: [], pending: [] },
        { name: 'Work Experience', score: 0, maxScore: 30, completed: [], pending: [] },
        { name: 'Video', score: 0, maxScore: 30, completed: [], pending: [] },
    ]);

    const token = sessionStorage.getItem('token');
    const userData = useMemo(() => {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }, []);

    const fetchProfile = useCallback(async () => {
        if (!userData?.id) return;
        setLoadingProfile(true);
        try {
            const { data } = await axios.get(`${API_ROUTES.GET_PROFILE}/${userData.id}`);
            if (data.success) setProfile(data.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoadingProfile(false);
        }
    }, [userData?.id]);

    const fetchFeed = useCallback(async () => {
        setLoadingFeed(true);
        try {
            const { data } = await axios.get(API_ROUTES.FEEDS, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `${token}`,
                },
            });
            if (Array.isArray(data) && data.length > 0) setFeed(data);
        } catch (error) {
            console.log('Something went wrong in update');
        } finally {
            setLoadingFeed(false);
        }
    }, [token]);

    useEffect(() => {
        fetchProfile();
        fetchFeed();
    }, [fetchProfile, fetchFeed]);

    useEffect(() => {
        if (!profile) return;

        const updated = sections.map(section => ({
            ...section,
            score: 0,
            completed: [],
            pending: [],
        }));

        const addScore = (index, points, label, condition) => {
            if (condition) {
                updated[index].score += points;
                updated[index].completed.push(label);
            } else {
                updated[index].pending.push(label);
            }
        };

        addScore(0, 2.5, 'Skills', profile.skills?.length > 0);
        addScore(0, 2.5, 'Primary Video', profile.basicDetails?.video);
        addScore(0, 2.5, 'Accomplishments', profile.workExperience?.[0]?.accomplishments_id?._id);
        addScore(0, 2.5, 'Education', profile.canadianEducation?.length > 0);

        addScore(1, 20, 'Certificate', profile.skills?.[0]?.subSkill?.[0]?.certificate);
        addScore(1, 20, 'Assessments', profile.skills?.[0]?.subSkill?.[0]?.link);

        addScore(2, 30, 'Experience', ((profile.workExperience?.length > 0) && (profile.workExperience.at(0).work_experience_company_name !== 'null')));

        addScore(3, 30, 'Video Interview Instant', profile.basicDetails?.secondary_video);

        setSections(updated);
    }, [profile]);

    const totalScore = useMemo(() => sections.reduce((acc, s) => acc + s.score, 0), [sections]);
    const scorePercentage = useMemo(() => (totalScore / 110) * 100, [totalScore]);

    const getScoreColor = () => {
        if (scorePercentage < 30) return 'text-red-500';
        if (scorePercentage < 60) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className="bg-grayLight md:px-10 px-2 py-4 flex justify-center items-center">
            <div className="container">
                <div className="flex lg:flex-row flex-col justify-center gap-x-6">

                    {/* Feed List */}
                    <div className="lg:w-[40%] w-full lg:h-[calc(100vh-120px)] bg-white overflow-y-auto">
                        <div className="font-semibold text-[18px] mb-5 p-3">Feeds</div>
                        {loadingFeed ? (
                            <PageLoading />
                        ) : (
                            feed.map((item, i) => (
                                <div key={i}>
                                    <div className="flex p-3 cursor-pointer hover:bg-[#EBEBEB]">
                                        <img src={item.thumbnail} className="w-14 h-14 object-cover rounded-full" alt={`feed-${i}`} />
                                        <div className="text-[14px] ml-3 flex-1">{item.description}</div>
                                    </div>
                                    <div className="border"></div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Profile Score Panel */}
                    <div className="lg:w-[36%] w-full lg:max-h-[calc(100vh-120px)] category2 h-auto overflow-y-auto bg-white lg:mt-0 mt-4">
                        <div className="shadow-lg p-6 max-w-2xl mx-auto">
                            {loadingProfile ? (
                                <PageLoading />
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex-grow">
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Completion</h2>
                                            <p className="text-gray-600">Keep improving your profile to unlock more opportunities</p>
                                        </div>

                                        <div className="relative w-32 h-32">
                                            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200" strokeWidth="5" />
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
                                            <div>
                                                {section.completed.map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm text-green-700 bg-green-50 p-2 rounded mb-1">
                                                        <div>{item}</div>
                                                        <True className="mr-2 w-5 h-5" />
                                                    </div>
                                                ))}
                                                {section.pending.map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm text-yellow-700 bg-yellow-50 p-2 rounded mb-1">
                                                        <div>{item}</div>
                                                        <Warning className="mr-2 w-5 h-5" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feed;
