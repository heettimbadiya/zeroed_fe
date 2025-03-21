import React, {useEffect, useState} from 'react'

import {PageLoading} from '../../common/Icons/Loading/pageLoading'
import {Country, State} from 'country-state-city'
import {ViewDateFormat} from '../../utils/dateFormat'
import {Navigation} from "swiper/modules";
import {
    ArrowDown,
    DotIcon, Down,
    EmailIcon,
    LocationIcon,
    PhoneIcon,
    SuccessIcon, Up,
    UserIcon, Verify,
} from '../../common/Icons'
import logo from '../../assets/logo.png'
import ProfileInfo, {Information} from '../../common/Information/profileInfo'
import {Link, useNavigate, useParams} from 'react-router-dom'
import default_user from '../../assets/user.png'
import ROUTES_URL from '../../constant/routes'
import CertificatePreview from './certificatePreview'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
function ProfileDetails({data}) {
    const [countryOptions, setCountryOptions] = useState([])
    const [stateOptions, setStateOptions] = useState([])
    const [open, setOpen] = useState(false)
    const [skill, setSkill] = useState([] || data.skills)

    useEffect(() => {
        const countryData = Country.getAllCountries().map((country) => ({
            value: country.isoCode,
            name: country.name,
        }))
        setCountryOptions(countryData)
        const stateData = State.getStatesOfCountry(
            data?.basicDetails?.current_country,
        ).map((state) => ({
            value: state.isoCode,
            name: state.name,
        }))
        setStateOptions(stateData)
    }, [data?.basicDetails?.current_country])

    const current_country = countryOptions.find(
        (country) => country.value === data?.basicDetails?.current_country,
    )
    const state = stateOptions.find(
        (state) => state.value === data?.basicDetails?.current_state,
    )

    let navigate = useNavigate()

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev)
    }

    const profile = `${process.env.REACT_APP_FILE_URL}/${data?.basicDetails?.profile_pic}`
    const {id} = useParams()
    const localStorageData = localStorage.getItem('user')
    const convertToStringify = JSON.parse(localStorageData)
    const [isValidUser, setValidUser] = useState(false)

    useEffect(() => {
        if (id === convertToStringify?.id) {
            setValidUser(true)
        } else {
            setValidUser(false)
        }
    }, [convertToStringify?.id, id])
    useEffect(() => {
        const mergedData = Object.values(data.skills.reduce((acc, item) => {
            if (!acc[item.core_skill]) {
                acc[item.core_skill] = {...item, subSkill: [...item.subSkill]};
            } else {
                acc[item.core_skill].subSkill.push(...item.subSkill);
            }
            return acc;
        }, {}));
        setSkill(mergedData)
    }, [data.skills]);
    return (
        <div className="">
            {data ? (
                <div>
                    {/*<div className="bg-white md:px-10 px-2 flex justify-between items-center py-5">*/}
                    {/*    <div className="flex justify-between items-center">*/}
                    {/*        <div>*/}
                    {/*            <img*/}
                    {/*                src={logo}*/}
                    {/*                alt="zeroed"*/}
                    {/*                className="h-[1.875rem] w-[6.25rem]"*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    {isValidUser && (*/}
                    {/*        <div className="relative cursor-pointer">*/}
                    {/*            <div onClick={toggleMenu}>*/}
                    {/*                <div*/}
                    {/*                    className="flex justify-center items-center gap-x-4 border border-text-border py-1 px-2 rounded-lg">*/}
                    {/*                    <img*/}
                    {/*                        src={profile ? profile : default_user}*/}
                    {/*                        alt="profile"*/}
                    {/*                        className="bg-gray-400 rounded-full border h-6 w-6 flex items-center justify-center cursor-pointer"*/}
                    {/*                    />*/}
                    {/*                    <ArrowDown/>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            {isMenuOpen && (*/}
                    {/*                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md z-10">*/}
                    {/*                    <div className="p-2">*/}
                    {/*                        {profile !== null && (*/}
                    {/*                            <button*/}
                    {/*                                onClick={() => {*/}
                    {/*                                    toggleMenu()*/}
                    {/*                                    navigate(`${ROUTES_URL.HOME}`)*/}
                    {/*                                }}*/}
                    {/*                            >*/}
                    {/*                                <div className="flex justify-between items-center gap-x-3">*/}
                    {/*                                    <div className="w-5">*/}
                    {/*                                        <UserIcon/>*/}
                    {/*                                    </div>*/}
                    {/*                                    <span className="text-sm whitespace-nowrap">*/}
                    {/*          Edit Profile*/}
                    {/*        </span>*/}
                    {/*                                </div>*/}
                    {/*                            </button>*/}
                    {/*                        )}*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            )}*/}
                    {/*        </div>*/}
                    {/*    )}*/}
                    {/*</div>*/}
                    {/* #287996 */}
                    <div className="bg-grayLight md:px-10 px-2 py-4">
                        <div className="flex lg:flex-row flex-col gap-x-6">
                            <div className="lg:w-[70%] w-full lg:h-[calc(100vh-106px)] overflow-y-auto">
                                <div className="bg-primary h-auto p-2 w-full bg-cover bg-no-repeat rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-white xl:text-2xl text-base capitalize font-bold">
                                                {data?.basicDetails?.firstname +
                                                    ' ' +
                                                    data?.basicDetails?.lastname}
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 pb-2">
                                                <div
                                                    className="flex items-center justify-center gap-x-1 text-sm text-white">
                                                    <EmailIcon/> {data?.basicDetails?.contact_email_id}
                                                </div>
                                                <div
                                                    className="flex items-center justify-center gap-x-1 text-sm text-white">
                                                    <PhoneIcon/> {data?.basicDetails?.contact_no}
                                                </div>
                                                <div
                                                    className="flex items-start justify-center gap-x-1 text-sm text-white">
                                                    <span
                                                        className='mt-[2px]'><LocationIcon/></span> {data?.basicDetails?.current_city},{" "}
                                                    {state?.name}, {current_country?.name}
                                                </div>
                                                <div
                                                    className="text-white underline text-sm cursor-pointer"
                                                    onClick={() => setOpen(true)}
                                                >
                                                    Contact Info
                                                </div>
                                                {open && (
                                                    <div
                                                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-4 z-auto">
                                                        <div
                                                            className="bg-white rounded-lg shadow-lg w-full max-w-md p-5 relative">
                                                            {/* Header */}
                                                            <div
                                                                className="flex justify-between items-center border-b pb-3">
                                                                <h2 className="text-lg font-semibold">
                                                                    {data?.basicDetails?.firstname} {data?.basicDetails?.lastname || "User Name"}
                                                                </h2>
                                                                <button
                                                                    onClick={() => setOpen(false)}
                                                                    className="text-gray-500 hover:text-gray-800 text-xl"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>

                                                            {/* Contact Details */}
                                                            <div className="mt-4">
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-gray-500">🔗</span>
                                                                        <a
                                                                            href={data?.basicDetails?.slug || "#"}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 hover:underline"
                                                                        >
                                                                            {data?.basicDetails?.slug || "No Profile URL"}
                                                                        </a>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                    <span className="text-gray-500">📞</span>
                                                                        <p className="text-gray-700">{data?.basicDetails?.contact_no || "Not Available"}</p>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-gray-500">📍</span>
                                                                        <p className="text-gray-700">
                                                                            {data?.basicDetails?.current_city}, {state?.name}, {current_country?.name || "No Address Provided"}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-gray-500">✉</span>
                                                                        <p className="text-gray-700">{data?.basicDetails?.contact_email_id || "No Email Available"}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <img
                                                src={`${process.env.REACT_APP_FILE_URL}/${data?.basicDetails?.profile_pic}`}
                                                alt="user-avatar-image"
                                                className="border-[2px] border-solid border-grayLight rounded-md min-h-[5rem] min-w-[5rem] max-h-[5rem] max-w-[5rem]"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className=" overflow-y-auto">
                                    {/* Basic Details */}
                                    {/* <ProfileInfo
                    title="Basic Information"
                    icon={true}
                    onClick={() => setIsOpen(!open)}
                    open={open}
                  >
                    <Information
                      name="Full Name"
                      value={
                        data?.basicDetails?.firstname +
                        ' ' +
                        data?.basicDetails?.lastname
                      }
                    />
                    <Information
                      name="Date Of Birth"
                      value={<ViewDateFormat date={data?.basicDetails?.dob} />}
                    />
                    <Information
                      name="Gender"
                      value={data?.basicDetails?.gender}
                    />
                    <Information
                      name="Nationality"
                      value={data?.basicDetails?.nationality}
                    />
                    <Information name="State" value={state?.name} />
                    <Information
                      name="City"
                      value={data?.basicDetails?.current_city}
                    />
                    <Information
                      name="Job Preferred location"
                      value={data?.basicDetails?.job_preferred_location}
                    />
                  </ProfileInfo> */}

                                    {/* Skills */}
                                    <ProfileInfo title="Skills" open={true}>
                                        {skill?.map((data, i) => {
                                            return (
                                                <div key={i} className="mt-2">
                                                    <div>
                                                        <div className="flex flex-col flex-wrap gap-1">
                                                            <div>
                                                                {data?.core_skill && (
                                                                    <span
                                                                        className="2xl:text-base md:text-sm text-xs flex flex-wrap capitalize">
                                    {data.core_skill.trim()}
                                  </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-primary-100 py-2 px-4 mt-1 rounded">
                                                        <div className="flex gap-1 flex-wrap">
                                                            {data?.subSkill?.map((subSkill, i) => {
                                                                return (
                                                                    <div key={i} className="flex items-center">
                                                                        <CertificatePreview subSkill={subSkill}/>
                                                                        {i < data?.subSkill?.length - 1 && (
                                                                            <div className="xl:mx-5 mx-2">
                                                                                <div
                                                                                    className="h-5 w-[1px] bg-primary"></div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </ProfileInfo>

                                    {/* Work Experience */}
                                    <ProfileInfo title="Work Experience" open={true}>
                                        <div>
                                            <div>
                                                {data?.workExperience.map((ex, i) => {
                                                    const country = countryOptions.find(
                                                        (country) =>
                                                            country.value === ex?.work_experience_country,
                                                    )
                                                    const startDate = new Date(ex.experience_start_date)
                                                    const endDate = new Date(ex.experience_start_date)
                                                    const options = {year: 'numeric', month: 'short'} // 'short' gives the 3-letter month abbreviation
                                                    const formattedStartDate = startDate.toLocaleDateString(
                                                        'en-US',
                                                        options,
                                                    )
                                                    const formattedEndDate = endDate.toLocaleDateString(
                                                        'en-US',
                                                        options,
                                                    )
                                                    return (
                                                        <div key={i} className="w-full flex gap-x-1">
                                                            <div className="flex flex-col justify-center items-center">
                                                                <div className="rounded-full w-4 h-4 bg-black"></div>
                                                                <div className="h-full w-[2px] bg-[#D7D9DE]"></div>
                                                            </div>
                                                            <div className="pb-4 pt-2 w-full mt-2">
                                                                <div
                                                                    className="flex flex-wrap gap-x-4 justify-between items-center">
                                                                    <div className="xl:text-base text-xs capitalize">
                                                                        {ex?.work_experience_job_title}
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center gap-x-2">
                                                                            <div
                                                                                className="xl:text-base text-xs capitalize">
                                                                                {formattedStartDate}
                                                                            </div>
                                                                            <div>-</div>
                                                                            <div
                                                                                className="xl:text-base text-xs capitalize">
                                                                                {ex?.isCurrentlyWorking
                                                                                    ? 'Currently working here'
                                                                                    : formattedEndDate}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="flex flex-wrap gap-x-4 justify-between items-center">
                                                                    <div className="flex items-center gap-x-2">
                                                                        <div
                                                                            className="xl:text-base text-xs capitalize ">
                                                                            {ex.work_experience_company_name}
                                                                        </div>
                                                                        {ex?.isVerify ? (
                                                                            <div className="flex items-center gap-x-1">
                                                                                <div
                                                                                    className="p-1 bg-green-700 rounded-full h-5 w-5 flex justify-center items-center">
                                                                                    <SuccessIcon/>
                                                                                </div>
                                                                                <div className="text-xs">
                                                                                    Verify by {ex.verificationName} (
                                                                                    {ex.verificationDesignation})
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            ''
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-x-1">
                                                                        <div className="flex items-center">
                                                                            <LocationIcon color={'black'}/>{' '}
                                                                        </div>
                                                                        <div
                                                                            className="xl:text-base text-xs capitalize ">
                                                                            {ex?.work_experience_country}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div
                                                                    className="flex flex-wrap gap-x-4 justify-between items-center">
                                                                    <div className="xl:text-base text-xs capitalize">
                                                                        {ex?.work_experience_industry}
                                                                    </div>
                                                                    <div className="xl:text-base text-xs capitalize">
                                                                        {ex?.work_experience_sub_industry}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="flex flex-wrap gap-x-4 justify-between items-center">
                                                                    <a
                                                                        href={ex?.work_experience_company_website || '#'}
                                                                        className="xl:text-base text-xs hover:underline"
                                                                        target="_blank"
                                                                        // rel="noopener noreferrer"
                                                                        // onClick={(e) => {
                                                                        //   if (!ex?.work_experience_company_website) {
                                                                        //     e.preventDefault();
                                                                        //   }
                                                                        //   e.stopPropagation();
                                                                        // }}
                                                                    >
                                                                        {ex?.work_experience_company_website}
                                                                    </a>
                                                                </div>

                                                                <div>
                                                                    {ex.accomplishments_id?.accomplishment_1 && (
                                                                        <div
                                                                            className="xl:text-base text-xs flex items-center capitalize">
                                                                            <DotIcon/>
                                                                            {ex.accomplishments_id?.accomplishment_1}
                                                                            <div className={'ml-1'}>
                                                                            <Verify />
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {ex.accomplishments_id?.accomplishment_2 && (
                                                                        <div
                                                                            className="xl:text-base text-xs flex items-center capitalize">
                                                                            <DotIcon/>
                                                                            {ex.accomplishments_id?.accomplishment_2}
                                                                            <div className={'ml-1'}>
                                                                                <Verify/>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {ex.accomplishments_id?.accomplishment_3 && (
                                                                        <div
                                                                            className="xl:text-base text-xs flex items-center capitalize">
                                                                            <DotIcon/>
                                                                            {ex.accomplishments_id?.accomplishment_3}
                                                                            <div className={'ml-1'}>
                                                                                <Verify/>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {ex.accomplishments_id?.accomplishment_4 && (
                                                                        <div
                                                                            className="xl:text-base text-xs flex items-center capitalize">
                                                                            <DotIcon/>
                                                                            {ex.accomplishments_id?.accomplishment_4}
                                                                            <div className={'ml-1'}>
                                                                                <Verify/>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {ex.verificationFeedback && (
                                                                    <div className="mt-1">
                                                                        <div
                                                                            className="xl:text-base text-sm capitalize">
                                                                            Feedback
                                                                        </div>
                                                                        <div
                                                                            className="xl:text-base text-sm capitalize">
                                                                            {ex.verificationFeedback}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </ProfileInfo>

                                    <ProfileInfo title="Projects" open={true}>
                                        <div >

                                            {data.projectDetails.map((project,i) => (
                                                <div key={i} className="w-full flex gap-x-1">
                                            <div className="flex flex-col justify-center items-center">
                                                <div className="rounded-full w-4 h-4 bg-black"></div>
                                                <div className="h-full w-[2px] bg-[#D7D9DE]"></div>
                                            </div>
                                                 <div className="pb-4 pt-2 w-full mt-2">
                                                    <div>
                                                        <div>{project.project_title}</div>
                                                        <div>{project.project_description}</div>
                                                        <div><a target={'_blank'} className={'underline text-sky-500'} href={project.project_url}>{project.project_url}</a></div>
                                                    </div>
                                                 </div>
                                                </div>
                                            ))}
                                        </div>

                                    </ProfileInfo>
                                    {/* Global Education */}
                                    <div>
                                        <ProfileInfo title="Global Education" open={true}>
                                            <div className="flex justify-between items-center">
                                            <div className="xl:text-base text-xs  capitalize">
                                                    {data?.internationalEducation?.level_of_education}
                                                </div>
                                                <div className="xl:text-base text-xs capitalize mt-[2px]">
                                                    {data?.internationalEducation?.year_of_graduation}
                                                </div>
                                            </div>
                                            <div className="xl:text-base text-xs capitalize">
                                                {data?.internationalEducation?.field_of_study}
                                            </div>
                                        </ProfileInfo>
                                    </div>
                                    {data?.canadianEducation?.isCanadianEducation && (
                                        <div>
                                            {/* Canadian Education */}
                                            <ProfileInfo title="Canadian Education" open={true}>
                                                <div className="flex flex-wrap justify-between items-center gap-x-4">
                                                    <div className="xl:text-base text-xs capitalize">
                                                        {data?.canadianEducation?.field_of_study_canadian}
                                                    </div>

                                                    <div className="xl:text-base text-xs capitalize">
                                                        {
                                                            data?.canadianEducation
                                                                ?.level_of_education_canadian
                                                        }
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap justify-between items-center gap-x-4">
                                                    <div className="xl:text-base text-xs capitalize">
                                                        {data?.canadianEducation?.university}
                                                    </div>
                                                    <div className="xl:text-base text-xs capitalize">
                                                        {data?.canadianEducation?.city}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap justify-between items-center gap-x-4">
                                                    <div className="xl:text-base text-xs capitalize">
                                                        {data?.canadianEducation?.year_of_completion}
                                                    </div>
                                                    <div className="flex gap-x-3 xl:text-base text-xs capitalize">
                                                        <span className="">GPA</span>
                                                        <span>{data?.canadianEducation?.gpa}</span>
                                                    </div>
                                                </div>
                                            </ProfileInfo>
                                        </div>
                                    )}

                                    {/* Career Goals */}
                                    {/* <ProfileInfo title="Career Goals" open={true}>
                    <Information
                      name="Industry"
                      value={data?.careerGoal?.career_industry}
                    />
                    <Information
                      name="Field"
                      value={data?.careerGoal?.career_field}
                    />
                    <Information
                      name="NOC"
                      value={data?.careerGoal?.noc_number}
                    />
                  </ProfileInfo> */}
                                </div>
                            </div>

                            {/* Video */}
                            <div
                                className="flex lg:w-[25%] w-full lg:max-h-[calc(100vh-106px)] category2 h-auto bg-grayLight lg:mt-0 mt-4">
                                {/*    <div className="relative w-full h-full">*/}
                                {/*        <video*/}
                                {/*            controls*/}
                                {/*            className="w-full lg:max-h-[calc(100vh-106px)] rounded-lg flex items-start"*/}
                                {/*                style={{height:"90vh"}}*/}
                                {/*        >*/}
                                {/*            <source*/}
                                {/*                src={`${process.env.REACT_APP_FILE_URL}/${data?.basicDetails?.video}`}*/}
                                {/*                type="video/mp4"*/}
                                {/*                className={'h-[500px]'}*/}
                                {/*            />*/}
                                {/*            Your browser does not support the video tag.*/}
                                {/*        </video>*/}
                                {/*        {data?.basicDetails?.secondary_video && (*/}
                                {/*            <>*/}
                                {/*                <div className="text-2xl font-bold my-5">Secondary Video</div>*/}
                                {/*                <video*/}
                                {/*                    controls*/}
                                {/*                    className="w-full lg:max-h-[calc(100vh-106px)] h-auto rounded-lg flex items-start"*/}
                                {/*                    style={{height:"90vh"}}*/}
                                {/*                >*/}
                                {/*                    <source*/}
                                {/*                        src={`${process.env.REACT_APP_FILE_URL}/${data?.basicDetails?.secondary_video}`}*/}
                                {/*                        type="video/mp4"*/}
                                {/*                    />*/}
                                {/*                    Your browser does not support the video tag.*/}
                                {/*                </video>*/}
                                {/*            </>*/}
                                {/*        )*/}
                                {/*        }*/}
                                {/*    </div>*/}
                                <Swiper
                                    direction={'vertical'}
                                    navigation={{
                                        nextEl: `.category2-next`,
                                        prevEl: `.category2-prev`,
                                    }}
                                    modules={[Navigation]}
                                    // pagination={{
                                    //     clickable: true,
                                    // }}
                                    spaceBetween={10}
                                    // style={{paddingBlock:20}}
                                    // modules={[Pagination]}
                                    className="mySwiper"
                                >
                                    <div className='my-3'>
                                        <SwiperSlide>
                                            <div className="text-2xl font-bold my-5">Primary Video</div>
                                            <video
                                                controls
                                                className="w-full lg:max-h-[calc(100vh-106px)] rounded-lg flex items-start"
                                                style={{height: "80vh"}}
                                            >
                                                <source
                                                    src={`${process.env.REACT_APP_FILE_URL}/${data?.basicDetails?.video}`}
                                                    type="video/mp4"
                                                    className={'h-[500px]'}
                                                />
                                                Your browser does not support the video tag.
                                            </video>
                                        </SwiperSlide>
                                        {data?.basicDetails?.secondary_video && (
                                            <>
                                                <SwiperSlide>
                                                    <div className="text-2xl font-bold my-5">Secondary Video</div>
                                                    <video
                                                        controls
                                                        className="w-full lg:max-h-[calc(100vh-106px)] h-auto rounded-lg flex items-start"
                                                        style={{height: "80vh"}}
                                                    >
                                                        <source
                                                            src={`${process.env.REACT_APP_FILE_URL}/${data?.basicDetails?.secondary_video}`}
                                                            type="video/mp4"
                                                        />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </SwiperSlide>
                                            </>
                                        )
                                        }
                                    </div>

                                </Swiper>
                                <button
                                    className="category2-prev border border-black md:block hidden"
                                    style={{
                                        padding: "10px",
                                    }}
                                >
                                    <Up />
                                </button>
                                <button
                                    className="category2-next border border-black md:block hidden"
                                    style={{
                                        padding: "10px",
                                    }}
                                >
                                    <Down/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <PageLoading/>
            )}
        </div>
    )
}

export default ProfileDetails
