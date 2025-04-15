import React from 'react';
import LinkPreview from "../../component/LinkPreview/linkPreview";
import {Edit} from "../../common/Icons";
import {useNavigate} from "react-router-dom";

const ProfileDetails = ({data}) => {
    const navigate = useNavigate();
    const experience = data?.workExperience || [];
    const projects = data?.projectDetails || [];

    return (
        <div className="bg-[#F3F2F1] min-h-screen">
            <div className="max-w-7xl mx-auto p-6 flex flex-col sm:flex-col md:flex-row gap-6">

                {/* Main Content */}
                <div className="order-1 lg:order-1 flex-[2] space-y-6">

                    <div className="relative flex flex-col md:flex-row items-center gap-6 py-6 border-b bg-white rounded-lg px-6">
                        <div
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => navigate('/home')}
                        >
                            <Edit />
                        </div>

                        <div className="flex">
                            <div>
                                <img
                                    src={data?.basicDetails?.profile_pic}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1 w-full text-center md:text-left">
                            <h1 className="text-2xl font-semibold text-gray-800">
                                {data?.basicDetails?.firstname} {data?.basicDetails?.lastname}
                            </h1>

                            <div className="mt-2 text-gray-600">
                                <p className="text-sm">
                                    <span className="font-medium">Email:</span> {data?.basicDetails?.contact_email_id}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Phone:</span> {data?.basicDetails?.contact_no}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl text-center flex flex-col items-center space-y-4 h-fit w-full">
                        <div className="text-left pr-4 text-gray-500 font-extrabold border-b px-6 py-5 w-full">Details</div>
                        <div className="w-full text-left space-y-3 text-sm pt-2 p-6">
                            <div>
                                <p className="text-gray-500 font-medium">Location</p>
                                <p className="text-blue-600">
                                    {data?.basicDetails?.current_city}, {data?.basicDetails?.current_state}, {data?.basicDetails?.current_country}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">DOB</p>
                                <p className="text-blue-600">{new Date(data?.basicDetails?.dob)?.toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Gender</p>
                                <p className="text-blue-600">{data?.basicDetails?.gender}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Nationality</p>
                                <p className="text-blue-600">{data?.basicDetails?.nationality}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Preferred Job Location</p>
                                <p className="text-blue-600">{data?.basicDetails?.job_preferred_location}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg">
                        <div className="text-left pr-4 text-gray-500 font-extrabold border-b px-6 py-5">Summary</div>
                        <div className="p-6 text-gray-800 text-sm whitespace-pre-line">
                            {data?.careerGoal?.career_field || 'No summary available?.'}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg">
                        <div className="text-left pr-4 text-gray-500 font-extrabold border-b px-6 py-5">Work Experience</div>
                        <div className="p-6">
                            {experience?.length > 0 ? (
                                experience?.map((exp, index) => (
                                    <div key={index} className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800">{exp?.work_experience_company_name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {exp?.work_experience_job_title} ({exp?.experience_start_date} - {exp?.experience_end_date})
                                        </p>
                                        <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                                            {exp?.accomplishments_id?.accomplishment_1 || 'No accomplishments listed?.'}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No experience available?.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg">
                        <div className="text-left pr-4 text-gray-500 font-extrabold border-b px-6 py-5">Education</div>
                        <div className="p-6 space-y-4 text-sm text-gray-700">
                            <h4 className="font-semibold text-gray-800">International Education</h4>
                            {(data?.internationalEducation[0]?.field_of_study && data?.internationalEducation[0]?.college_name) && <>
                                {data?.internationalEducation?.map((edu, i) => (
                                    <div key={i}>
                                        <p>{edu?.field_of_study} ({edu?.year_of_graduation})</p>
                                        <p className="text-gray-500">{edu?.college_name} | GPA: {edu?.global_gpa}</p>
                                    </div>
                                ))}
                            </>}

                            {(data?.canadianEducation[0]?.field_of_study_canadian && data?.canadianEducation[0]?.university) && <>
                                <h4 className="font-semibold text-gray-800 mt-4">Canadian Education</h4>
                                {data?.canadianEducation?.map((edu, i) => (
                                    <div key={i}>
                                        <p>{edu?.field_of_study_canadian} ({edu?.year_of_completion})</p>
                                        <p className="text-gray-500">{edu?.university}, {edu?.city} | GPA: {edu?.gpa}</p>
                                    </div>
                                ))}
                            </>}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg">
                        <div className="text-left pr-4 text-gray-500 font-extrabold border-b px-6 py-5">Skills</div>
                        <div className="p-6 space-y-4">
                            {data?.skills?.length > 0 ? (
                                data?.skills?.map((skill, idx) => (
                                    <div key={idx}>
                                        <h4 className="text-md font-semibold text-gray-800">{skill?.core_skill}</h4>
                                        <div>
                                            {skill?.subSkill?.map((sub, i) => (
                                                <div className="space-y-3 border my-2">
                                                    <div key={i} className="p-2 flex items-center space-x-4">
                                                        <div>
                                                            <img src={sub?.certificate} alt="Certificate"
                                                                 className="h-12 w-auto rounded"
                                                                 style={{objectFit: "contain"}}/>
                                                        </div>
                                                        <div className="text-sm text-gray-700">{sub?.sub_skills}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No skills available?.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg">
                        <div className="text-left pr-4 text-gray-500 font-extrabold border-b px-6 py-5">Accomplishments</div>
                        {experience?.map((exp, idx) => (
                            <div key={idx} className="p-6 text-sm text-gray-700 space-y-2">
                                <p>{exp?.accomplishments_id?.accomplishment_1}</p>
                                <p>{exp?.accomplishments_id?.accomplishment_2}</p>
                                <p>{exp?.accomplishments_id?.accomplishment_3}</p>
                                <p>{exp?.accomplishments_id?.accomplishment_4}</p>
                            </div>
                        ))}
                    </div>

                    {projects?.length > 0 && <div className="bg-white rounded-lg">
                        <div className="text-left pr-4 text-gray-500 font-extrabold border-b px-6 py-5">Projects</div>
                        <div className="p-6 space-y-4">
                            {projects?.map((proj, idx) => (
                                <div key={idx}>
                                    <h4 className="text-md font-semibold text-gray-800">{proj?.project_title}</h4>
                                    <p className="text-sm text-gray-600">{proj?.project_description}</p>
                                    <LinkPreview url={proj?.project_url}/>
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>

                {/* Video Section */}
                <div className="order-2 lg:order-2 flex-[1] lg:sticky lg:top-6 rounded-2xl text-center flex flex-col items-center space-y-4 h-fit ">
                    <div className="p-6 space-y-4 bg-white rounded-lg ">
                        <video controls className="w-full rounded-md">
                            <source src={data?.basicDetails?.video} type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                        {data?.basicDetails?.secondary_video &&
                            <video controls className="w-full rounded-md">
                                <source src={data?.basicDetails?.secondary_video} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileDetails;

