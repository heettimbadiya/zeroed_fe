import React, {useEffect, useState} from 'react'
import {ErrorMessage, Field, FieldArray, Form, Formik} from 'formik'
import {
    Checkbox, DateField, DropDown, DropDownInput, RadioGroup, TextArea, TextField, TextFieldValue, ToggleButton,
} from '../../component/InputField'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import Multiselect from 'multiselect-react-dropdown'
import levelOfEducation from '../../common/data/levelOfEducation.json'
import fieldOfStudyCanadian from '../../common/data/fieldOfStudyCanadian.json'
import fieldOfStudy from '../../common/data/fieldOfStudy.json'
import universityData from '../../common/data/universityData.json'
import currentCity from '../../common/data/currentCity.json'
import skillData from '../../common/data/skillData.json'
import industriesData from '../../common/data/industryData.json'
import nocNumber from '../../common/data/nocNumber.json'
import provinceData from '../../common/data/provinceData.json'
import VideoUploader from './video'
import axios from 'axios'
import {Country, State, City} from 'country-state-city'
import {jobFormValidation} from '../../constant/validation'
import {useNavigate} from 'react-router-dom'
import ROUTES_URL from '../../constant/routes'
import {API_ROUTES} from '../../utils/APIs'
import {
    Calender, CanadianEducation, CareerGoal, DeleteIcon, GlobalEducation, Loader, Skills, UserInfo, WorkExperience,
} from '../../common/Icons'
import {ExperienceDateFormat} from '../../utils/dateFormat'
import FormInfo from '../../common/Information/formInfo'
import Label from '../../component/InputField/label'
import CertificatePreview from './certificatePreivew'
import VideoSampleModal from "./videoSampleModal";
import Dialog from "../../component/Dialog";
import {logDOM} from "@testing-library/react";
import toast from "react-hot-toast";

// Function to extract the domain from an email address
const getDomainFromEmail = (email) => {
    if (!email || !email.includes('@')) {
        return '' // Return an empty string if invalid
    }

    const emailParts = email.split('@')
    if (emailParts.length < 2) {
        return '' // Return empty if '@' doesn't divide into two parts
    }

    // Return the domain part in lowercase
    const emailDomain = emailParts[1].toLowerCase()
    return emailDomain
}

// Function to extract the domain from a URL, without the protocol (http:// or https://)
const getDomainFromUrl = (url) => {
    if (!url) {
        return '' // Return empty if URL is not provided
    }

    // Strip the protocol (http:// or https://) if it exists
    const domain = url
        .replace(/^https?:\/\//, '')
        .split('/')[0]
        .toLowerCase()
    return domain // Return the domain part
}

function Information({data}) {
    const [visibleFields, setVisibleFields] = useState(data?.workExperience?.length ? 4 : 1);
    const [showInstruction, setShowInstruction] = useState(false);
    const [experienceLoading, setExperienceLoading] = useState(false);
    const [projectLoading, setProjectLoading] = useState(false);
    let navigate = useNavigate()
    const [wordCounts, setWordCounts] = useState({});
    const token = sessionStorage.getItem('token')

    const initialProjects = {
        project_title: "",
        project_description: "",
        project_url: "",
        reference_email: '',
        reference_name: '',
        reference: '',
        reference_check: false,
    }
    const initialInterNationalEducation = {
        credential_institute_name: '',
        credential_assesed: false,
        credential_no: '',
        global_gpa: '',
        college_name: '',
        year_of_graduation: '',
        field_of_study: '',
        level_of_education: '',
    }
    const initialInterNationalCEducation = {
        university: '', // credential_assesed: false,
        city: '',
        level_of_education_canadian: '',
        field_of_study_canadian: '',
        year_of_completion: '',
        gpa: '', // level_of_education: '',
    }

    const [internationalEducation, setInternationalEducation] = useState(() => data?.internationalEducation?.length ? data.internationalEducation.map(edu => ({
            ...initialInterNationalCEducation, // Default structure
            ...edu, // Overwrite with actual data
            internationalEducation: {
                ...initialInterNationalCEducation.internationalEducation, // Default structure
                ...edu.internationalEducation, // Overwrite with actual data
            }
        })) : [initialInterNationalEducation] // Default if no data
    );
    const [internationalCEducation, setInternationalCEducation] = useState(() => data?.canadianEducation?.length ? data.canadianEducation.map(edu => ({
            ...initialInterNationalCEducation, // Default structure
            ...edu, // Overwrite with actual data
            canadianEducation: {
                ...initialInterNationalCEducation.canadianEducation, // Default structure
                ...edu.canadianEducation, // Overwrite with actual data
            }
        })) : [initialInterNationalCEducation] // Default if no data
    );

    const [stateOptions, setStateOptions] = useState([])
    const [projects, setProjects] = useState([initialProjects])
    const [cityOptions, setCityOptions] = useState([])
    const [experienceError, setExperienceError] = useState('')
    const [imgError, setImgError] = useState('')
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
    const isAnyDescriptionTooLong = Object.values(wordCounts).some(count => count > 25);
    const [dropDown, setDropDown] = useState([])
    const [previewImage, setPreviewImage] = useState(null); // for preview
    // const [careerGoal,setCareerGoal] =useState([])
    // Get countries for the country dropdown

    const countryData = Country.getAllCountries().map((country) => ({
        value: country.name, name: country.name,
    }))
    const referenceOption = [{
        value: "HR", name: "HR"
    }, {
        value: "Reporting Manager", name: "Reporting Manager"
    }]
    const projectReferenceOption = [{
        value: "Assistant Professor", name: "Assistant Professor"
    }, {
        value: "Head of Department", name: "Head of Department"
    }]

    const addField = () => {
        if (visibleFields < 4) {
            setVisibleFields((prev) => prev + 1);
        }
    };

    const closeInstructionDialog = () => setShowInstruction(false);


    async function careerDropdown() {
        try {
            const response = await axios.get(API_ROUTES.CAREER_INDUSTRY, {
                headers: {
                    'Content-Type': 'multipart/form-data', Authorization: `${token}`,
                },
            },)
            if (response.data.length > 0) {
                setDropDown(response.data)
            }
        } catch (error) {
            console.log('Something went wrong in update')
        }
    }


    useEffect(() => {
        careerDropdown()
    }, []);


    const countryDataBasic = Country.getAllCountries().map((country) => ({
        value: country.isoCode, name: country.name,
    }))

    const defaultCurrentCountry = data?.basicDetails?.current_country || 'CA'

    useEffect(() => {
        if (data?.basicDetails) {
            const states = State.getStatesOfCountry(data.basicDetails.current_country)
            setStateOptions(states.map((state) => ({
                value: state.isoCode, // Use state ISO code as value
                name: state.name, // Use state name for display
            })),)

            // Check if current state is set
            if (data.basicDetails.current_state) {
                const cities = City.getCitiesOfState(data.basicDetails.current_country, data.basicDetails.current_state,)
                setCityOptions(cities.map((city) => ({
                    value: city.name, // You can also set city code if available
                    name: city.name,
                })),)
            } else {
                setCityOptions([])
            }
        } else {
            const states = State.getStatesOfCountry('CA') // Default to CA
            setStateOptions(states.map((state) => ({
                value: state.isoCode, name: state.name,
            })),)
        }
    }, [data])

    const handleChangeCountry = (e, setFieldValue) => {
        const current_country = e.target.value
        setFieldValue('current_country', current_country)
        setFieldValue('current_state', '')
        setFieldValue('current_city', '')

        if (current_country) {
            const states = State.getStatesOfCountry(current_country)
            setStateOptions(states.map((state) => ({
                value: state.isoCode, name: state.name,
            })),)

            // Clear city options
            setCityOptions([])
        } else {
            setStateOptions([])
            setCityOptions([])
        }
    }

    const handleChangeState = (e, setFieldValue, values) => {
        const current_state = e.target.value
        setFieldValue('current_state', current_state)
        setFieldValue('current_city', '')
        if (current_state) {
            const cities = City.getCitiesOfState(values?.current_country, current_state,)
            setCityOptions(cities.map((city) => ({
                value: city.name, name: city.name,
            })),)
        } else {
            setCityOptions([])
        }
    }

    const getCountryNameByValue = (value) => {
        const country = countryDataBasic.find((country) => country.value === value)
        return country ? country.name : ''
    }

    const getStateNameByValue = (value) => {
        const state = stateOptions.find((state) => state.value === value)
        return state ? state.name : ''
    }

    const initialWorkExperience = {
        isValidation: true,
        company: '',
        email: '',
        website: '',
        emailError: '',
        referenceEmailError: '',
        work_experience_industry: '',
        work_experience_sub_industry: '',
        work_experience_country: '',
        work_experience_job_title: '',
        work_experience_company_name: '',
        work_experience_company_website: '',
        experience_start_date: null,
        experience_end_date: null,
        isCurrentlyWorking: false,
        accomplishments_id: {
            accomplishment_1: '',
            accomplishment_2: '',
            accomplishment_3: '',
            accomplishment_4: '',
            _id: ''
        },
        accomplish: {
            accomplish1: 0, accomplish2: 0, accomplish3: 0, accomplish4: 0,
        },
        reference_email: '',
        reference_name: '',
        reference: '',
        reference_check: false,
    }
    const [workExperiences, setWorkExperiences] = useState([initialWorkExperience])
    const isGreaterThan17 = workExperiences.some(item => Object.values(item.accomplish || {}).some(value => value > 14));

    const handleDeleteExperience = (setFieldValue,workExperiences,index) => {
        if (!data) {
            setFieldValue("workExperience",(prev) => prev.filter((_, i) => i !== index))
        } else {
            const updatedExperiences = [...workExperiences]
            const userId = updatedExperiences[index]?.user_id
            if (userId) {
                try {
                    const response = axios.delete(API_ROUTES.DELETE_WORK_EXPERIENCE + userId, {
                        headers: {
                            'Content-Type': 'multipart/form-data', Authorization: `${token}`,
                        },
                    },)
                    if (response.data.status === 204) {
                        console.log('experience delete!')
                    }
                } catch (error) {
                    console.log('Something went wrong', error)
                }
            }
            setFieldValue("workExperience",updatedExperiences.filter((_, i) => i !== index))
        }
    }
    const handleDeleteProject = (index) => {
        if (!data) {
            setProjects((prev) => prev.filter((_, i) => i !== index))
        } else {
            const updatedProject = [...projects]
            const userId = updatedProject[index]?.user_id
            if (userId) {
                try {
                    const response = axios.delete(API_ROUTES.DELETE_PROJECT + userId, {
                        headers: {
                            'Content-Type': 'multipart/form-data', Authorization: `${token}`,
                        },
                    },)
                    if (response.data.status === 204) {
                        console.log('experience delete!')
                    }
                } catch (error) {
                    console.log('Something went wrong', error)
                }
            }
            setProjects(updatedProject.filter((_, i) => i !== index))
        }
    }

    const handleDeleteInternationalEducation = (setFieldValue,internationalEducation,index) => {
        if (!data) {
            setFieldValue("internationalEducation",(prev) => prev.filter((_, i) => i !== index))
        } else {
            const updatedProject = [...internationalEducation]
            const userId = updatedProject[index]?.user_id
            if (userId) {
                try {
                    const response = axios.delete(API_ROUTES.DELETE_INTERNATIONAL_EDUCATION + userId, {
                        headers: {
                            'Content-Type': 'multipart/form-data', Authorization: `${token}`,
                        },
                    },)
                    if (response.data.status === 204) {
                        console.log('International Education delete!')
                    }
                } catch (error) {
                    console.log('Something went wrong', error)
                }
            }
            setFieldValue("internationalEducation",updatedProject.filter((_, i) => i !== index))
        }
    }
    const handleDeleteInternationalCEducation = (setFieldValue,internationalCEducation,index) => {
        if (!data) {
            setFieldValue("internationalCEducation",(prev) => prev.filter((_, i) => i !== index))
        } else {
            const updatedProject = [...internationalCEducation]
            const userId = updatedProject[index]?.user_id
            if (userId) {
                try {
                    const response = axios.delete(API_ROUTES.DELETE_CANADIAN_EDUCATION + userId, {
                        headers: {
                            'Content-Type': 'multipart/form-data', Authorization: `${token}`,
                        },
                    },)
                    if (response.data.status === 204) {
                        console.log('International Education delete!')
                    }
                } catch (error) {
                    console.log('Something went wrong', error)
                }
            }
            setFieldValue("internationalCEducation",updatedProject.filter((_, i) => i !== index))
        }
    }

    useEffect(() => {
        if (data?.canadianEducation?.length) {
            setInternationalCEducation(data.canadianEducation.map(edu => ({
                ...initialInterNationalCEducation, ...edu, canadianEducation: {
                    ...initialInterNationalCEducation.canadianEducation, ...edu.canadianEducation,
                }
            })));
        } else {
            setInternationalCEducation([initialInterNationalCEducation]);
        }

        if (data?.internationalEducation?.length) {
            setInternationalEducation(data.internationalEducation.map(edu => ({
                ...initialInterNationalEducation, ...edu, internationalEducation: {
                    ...initialInterNationalEducation.internationalEducation, ...edu.internationalEducation,
                }
            })));
        } else {
            setInternationalEducation([initialInterNationalEducation]);
        }
    }, [data]);


    useEffect(() => {
        if (data) {
            const updatedExperiences = data?.workExperience?.length ? data.workExperience.map((experience) => ({
                ...initialWorkExperience, ...experience,
            })) : [initialWorkExperience]
            const projects = data?.projectDetails
            setProjects(projects)
            const p = updatedExperiences.map((data) => {
                const words1 = data.accomplishments_id?.[`accomplishment_1`].split(/\s+/).filter(Boolean);
                const words2 = data.accomplishments_id?.[`accomplishment_2`].split(/\s+/).filter(Boolean);
                const words3 = data.accomplishments_id?.[`accomplishment_3`].split(/\s+/).filter(Boolean);
                const words4 = data.accomplishments_id?.[`accomplishment_4`].split(/\s+/).filter(Boolean);
                const accomplish = {
                    accomplish1: words1.length,
                    accomplish2: words2.length,
                    accomplish3: words3.length,
                    accomplish4: words4.length,
                }
                return {
                    ...data, accomplish
                }
            })
            setInternationalEducation(data.internationalEducation || [])
            setWorkExperiences(p)
        }
    }, [data])

    const userDetails = sessionStorage.getItem('user')
    const user = JSON.parse(userDetails)

    const currentYear = new Date().getFullYear()
    const years = Array.from({length: 30}, (_, i) => ({
        value: String(currentYear - i), name: String(currentYear - i),
    }))

    const [subIndustryOptions, setSubIndustryOptions] = useState([])
    useEffect(() => {
        if (data && data.workExperience) {
            data.workExperience.forEach((experience, index) => {
                const selected = industriesData.find((industry) => industry.name === experience.work_experience_industry,)

                const newSubIndustryOptions = selected ? selected.subsector.map((sub) => ({
                    name: sub.name, value: sub.name,
                })) : []

                setSubIndustryOptions((prev) => {
                    const updatedOptions = [...prev]
                    updatedOptions[index] = newSubIndustryOptions // Use the current index
                    return updatedOptions
                })
            })
        }
    }, [data])


    const handleSubIndustryChange = (e, index) => {
        const selected = industriesData.find((industry) => industry.name === e.target.value,)

        const newSubIndustryOptions = selected ? selected.subsector.map((sub) => ({
            name: sub.name, value: sub.name,
        })) : []

        setSubIndustryOptions((prev) => {
            const updatedOptions = [...prev]
            updatedOptions[index] = newSubIndustryOptions // Set the sub-industry options for the specific index
            return updatedOptions
        })
    }
    const verifyEmail = (payload) => {
        setExperienceLoading(true)
        const payloads = {
            referenceEmail: payload?.reference_email,
            reference_name: payload?.reference_name,
            workExperienceId: payload?._id,
            candidateName: payload?.candidateName,
            companyName: payload?.work_experience_company_name,
            jobTitle: payload?.work_experience_job_title,
            accomplishment_1: payload?.accomplishments_id.accomplishment_1,
            accomplishment_2: payload?.accomplishments_id.accomplishment_2,
            accomplishment_3: payload?.accomplishments_id.accomplishment_3,
            accomplishment_4: payload?.accomplishments_id.accomplishment_4,
            startDate: payload?.experience_start_date,
            endDate: payload?.experience_end_date,
            userId: data.basicDetails?.user_id
        }
        try {
            const res = axios.post(`${process.env.REACT_APP_AUTH_URL}/work-experience/verify`, payloads)
            toast.success('Mail send successfully !')
            console.log(res)

        } catch (e) {
            console.log(e)
            toast.error('Something want wrong !')
        } finally {
            setExperienceLoading(false)
        }
    }
    const verifyProjectEmail = (payload) => {
        setProjectLoading(true)
        const payloads = {
            referenceEmail: payload?.reference_email,
            reference_name: payload?.reference_name,
            projectId: payload?._id,
            project_title: payload?.project_title,
            project_url: payload?.project_url,
            project_description: payload?.project_description,
            userId: data.basicDetails?.user_id
        }
        try {
            const res = axios.post(`${process.env.REACT_APP_AUTH_URL}/project/verify`, payloads)
            toast.success('Mail send successfully !')
            console.log(res)

        } catch (e) {
            console.log(e)
            toast.error('Something want wrong !')
        } finally {
            setProjectLoading(false)
        }
    }
    const handleAddExperience = (workExperiences,setFieldValue) => {
        setFieldValue("workExperience",[...workExperiences, {
            work_experience_industry: '',
            work_experience_sub_industry: '',
            work_experience_country: '',
            work_experience_job_title: '',
            work_experience_company_name: '',
            work_experience_company_website: '',
            experience_start_date: null,
            experience_end_date: null,
            isCurrentlyWorking: false,
            accomplishments_id: {
                accomplishment_1: '', accomplishment_2: '', accomplishment_3: '', accomplishment_4: '',
            },
            accomplish: {
                accomplish1: 0, accomplish2: 0, accomplish3: 0, accomplish4: 0,
            },
            reference_email: '',
            reference_name: '',
            reference: '',
            reference_check: false,
        },])
    }
    const handleAddInternationalEducation = (internationalEducation,setFieldValue) => {
        setFieldValue("internationalEducation",[...internationalEducation, initialInterNationalEducation])
    }
    const handleAddInternationalCEducation = (internationalCEducation,setFieldValue) => {
        setFieldValue("internationalCEducation",[...internationalCEducation, initialInterNationalCEducation])
    }
    const handleAddProject = () => {
        setProjects([...projects, initialProjects])
    }
    const handleChangeProject = (field, index, value) => {
        const updatedProject = [...projects]
        updatedProject[index][field] = value
        setProjects(updatedProject)

    }
    const handleChangeExperience = (workExperiences, setFieldValue, index, field, value) => {
        const updatedExperiences = [...workExperiences];

        // Ensure the index exists
        if (!updatedExperiences[index]) {
            updatedExperiences[index] = {};
        }

        // If it's an accomplishment field
        if (field.startsWith('accomplishments_id.')) {
            const accomplishmentField = field.split('.').pop();

            // Safely initialize the accomplishments_id object if missing
            if (!updatedExperiences[index].accomplishments_id) {
                updatedExperiences[index].accomplishments_id = {};
            }

            updatedExperiences[index].accomplishments_id[accomplishmentField] = value;
        } else {
            updatedExperiences[index][field] = value;
        }

        // Update the form
        setFieldValue('workExperiences', updatedExperiences);

        // Run validation for specific fields
        if (
            field === 'email' ||
            field === 'reference_email' ||
            field === 'work_experience_company_website'
        ) {
            validateEmailAndWebsite(index, updatedExperiences[index]);
        }
    };



    const handleSubmit = async (values) => {
        const formData = new FormData()
        // Append basic details
        formData.append('basicDetails[user_id]', user.id)
        formData.append('basicDetails[firstname]', values.firstname)
        formData.append(`isInternationalEducation`, values.isInternationalEducation,)
        formData.append('basicDetails[lastname]', values.lastname)
        if (values.profile_pic instanceof File) {
            formData.append('profile_pic', values.profile_pic);
        } else if (typeof values.profile_pic === "string") {
            formData.append('profile_pic_url', values.profile_pic);
        }

        formData.append('basicDetails[dob]', values.dob)
        formData.append('basicDetails[gender]', values.gender)
        formData.append('basicDetails[nationality]', values.nationality)
        formData.append('basicDetails[current_country]', values.current_country)
        formData.append('basicDetails[current_state]', values.current_state)
        formData.append('basicDetails[current_city]', values.current_city)
        formData.append('basicDetails[contact_no]', values.contact_no)
        formData.append('basicDetails[contact_email_id]', values.contact_email_id)
        formData.append('basicDetails[job_preferred_location]', values.job_preferred_location,)
        if (values.video) {
            formData.append('video', values.video)
        }
        if (values.secondary_video) {
            formData.append('secondary_video', values.secondary_video)
        }

        // Append international education
        values.internationalEducation.map((item, index) => {

            formData.append(`internationalEducation[${index}][level_of_education]`, item.level_of_education,)
            formData.append(`internationalEducation[${index}][field_of_study]`, item.field_of_study,)
            formData.append(`internationalEducation[${index}][year_of_graduation]`, item.year_of_graduation,)
            formData.append(`internationalEducation[${index}][college_name]`, item.college_name,)
            formData.append(`internationalEducation[${index}][global_gpa]`, item.global_gpa,)
            formData.append(`internationalEducation[${index}][credential_no]`, item.credential_no,)
            formData.append(`internationalEducation[${index}][credential_assesed]`, item.credential_assesed,)
            formData.append(`internationalEducation[${index}][credential_institute_name]`, item.credential_institute_name,)
            if (item?._id) {
                formData.append(`internationalEducation[${index}][_id]`, data ? item?._id : null,)
            }
        })

        values.internationalCEducation.map((item, index) => {
            // Append Canadian education
            formData.append(`canadianEducation[${index}][university]`, item.university)
            formData.append(`canadianEducation[${index}][city]`, item.city)
            formData.append(`canadianEducation[${index}][level_of_education_canadian]`, item.level_of_education_canadian,)
            formData.append(`canadianEducation[${index}][field_of_study_canadian]`, item.field_of_study_canadian,)
            formData.append(`canadianEducation[${index}][year_of_completion]`, item.year_of_completion,)
            formData.append(`canadianEducation[${index}][gpa]`, item.gpa)
            if (item?._id) {
                formData.append(`canadianEducation[${index}][_id]`, data ? item?._id : null,)
            }
        })


        formData.append('coreSkillsWithSubSkills', JSON.stringify(values.coreSkills),)

        values.coreSkills.forEach((coreSkill, coreIndex) => {
            if (!coreSkill.coreSkill) return

            formData.append(`coreSkills[${coreIndex}][coreSkill]`, coreSkill.coreSkill,)

            coreSkill.subSkills.forEach((subSkill, subIndex) => {
                if (!subSkill.subSkill) return

                formData.append(`coreSkills[${coreIndex}][subSkills][${subIndex}][subSkill]`, subSkill.subSkill,)

                if (subSkill.certificate) {
                    formData.append(`certificate_core_${coreIndex}_sub_${subIndex}`, subSkill.certificate,)
                }
                if (subSkill.link) {
                    formData.append(`link_core_${coreIndex}_sub_${subIndex}`, subSkill.link,)
                }
            })
        })

        // Append work experience
        projects.map((project, index) => {
            formData.append(`projectDetails[${index}][project_title]`, project.project_title,)
            formData.append(`projectDetails[${index}][project_description]`, project.project_description,)
            formData.append(`projectDetails[${index}][project_url]`, project.project_url,)
            formData.append(`projectDetails[${index}][reference_email]`, project.reference_email,)
            formData.append(`projectDetails[${index}][reference_name]`, project.reference_name,)
            formData.append(`projectDetails[${index}][reference]`, project.reference,)
            formData.append(`projectDetails[${index}][reference_check]`, project.reference_check,)
            if (project?._id) {
                formData.append(`projectDetails[${index}][_id]`, data ? project?._id : null,)
            }
        })
        if (values?.workExperience.length > 0 && values?.workExperience.at(0).work_experience_company_name) {

            values?.workExperience.forEach((experience, index) => {
                // ✅ Accomplishments fields with optional chaining and fallback
                const accomplishments = experience.accomplishments_id || {};

                accomplishments._id && formData.append(`workExperience[${index}][accomplishments_id]`, accomplishments._id || '');
                formData.append(`workExperience[${index}][accomplishment_1]`, accomplishments.accomplishment_1 || '');
                formData.append(`workExperience[${index}][accomplishment_2]`, accomplishments.accomplishment_2 || '');
                formData.append(`workExperience[${index}][accomplishment_3]`, accomplishments.accomplishment_3 || '');
                formData.append(`workExperience[${index}][accomplishment_4]`, accomplishments.accomplishment_4 || '');
                formData.append(`workExperience[${index}][email]`, experience.email || '');
                formData.append(`workExperience[${index}][work_experience_industry]`, experience.work_experience_industry || '');
                formData.append(`workExperience[${index}][work_experience_sub_industry]`, experience.work_experience_sub_industry || '');
                formData.append(`workExperience[${index}][work_experience_country]`, experience.work_experience_country || '');
                formData.append(`workExperience[${index}][work_experience_job_title]`, experience.work_experience_job_title || '');
                formData.append(`workExperience[${index}][work_experience_company_name]`, experience.work_experience_company_name || '');
                formData.append(`workExperience[${index}][work_experience_company_website]`, experience.work_experience_company_website || '');
                formData.append(`workExperience[${index}][experience_start_date]`, experience.experience_start_date || '');
                formData.append(`workExperience[${index}][experience_end_date]`, experience.experience_end_date || '');
                formData.append(`workExperience[${index}][isCurrentlyWorking]`, experience.isCurrentlyWorking || false);
                formData.append(`workExperience[${index}][reference_email]`, experience.reference_email || '');
                formData.append(`workExperience[${index}][reference_name]`, experience.reference_name || '');
                formData.append(`workExperience[${index}][reference]`, experience.reference || '');
                formData.append(`workExperience[${index}][reference_check]`, experience.reference_check || false);
                formData.append(`workExperience[${index}][accomplishments]`, data ? accomplishments._id || '' : '');

                if (experience?._id) {
                    formData.append(`workExperience[${index}][_id]`, data ? experience._id : '');
                }
            });

        }

        // Append career goal
        formData.append('careerGoal[career_role]', values.career_role)
        formData.append('careerGoal[career_industry]', values.career_industry);
        formData.append('careerGoal[career_field]', values.career_field);
        formData.append('careerGoal[noc_number]', values.noc_number)


        const experience = workExperiences[0]
        const isEmpty = Object.values(experience).every((value) => value === '' || value === null,)

        if (isEmpty) {
            setExperienceError('Work experience fields are required.')
        } else {
            setExperienceError('')
            if (data) {
                try {
                    const response = await axios.put(API_ROUTES.UPDATE_PROFILE + data.basicDetails?.user_id, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data', Authorization: `${token}`,
                        },
                    },)
                    if (response.data.status) {
                        navigate(`${ROUTES_URL.PROFILE}/${user.id}`)
                    }
                } catch (error) {
                    console.log('Something went wrong in update')
                }
            } else {
                try {
                    const response = await axios.post(API_ROUTES.CREATE_PROFILE, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data', Authorization: `${token}`,
                        },
                    },)
                    if (response.data.status === 201) {
                        navigate(`${ROUTES_URL.PROFILE}/${user.id}`)
                    }
                } catch (error) {
                    console.log('Something went wrong in insert')
                }
            }
        }
    }
    // const handleChangeInternationalEducation = (internationalEducation,setFieldValue,index, field, value) => {
    //     const updatedExperiences = [...internationalEducation]
    //     updatedExperiences[index][field] = value
    //     setFieldValue('internationalEducation',updatedExperiences)
    //     setInternationalEducation(updatedExperiences)
    // }
    const handleChangeInternationalEducation = (
        internationalEducation,
        setFieldValue,
        index,
        field,
        value
    ) => {
        const updated = internationalEducation.map((item, idx) =>
            idx === index ? { ...item, [field]: value } : item
        );
        setFieldValue('internationalEducation', updated);
    };

    const handleChangeInternationalCEducation = (internationalCEducation,setFieldValue,index, field, value) => {
        const updatedExperiences = [...internationalCEducation]
        updatedExperiences[index][field] = value
        setFieldValue('internationalCEducation',updatedExperiences)
        setInternationalCEducation(updatedExperiences)

    }

    const resetWorkExperiences = () => {
        setWorkExperiences([initialWorkExperience])
    }

    const [disabledButton, setDisabledButton] = useState(false)
    const validateEmailAndWebsite = (index, experience) => {
        const websiteDomain = getDomainFromUrl(experience.work_experience_company_website,)
        const emailDomain = getDomainFromEmail(experience.email)
        const referenceEmailDomain = getDomainFromEmail(experience.reference_email)


        if (websiteDomain && emailDomain && websiteDomain !== emailDomain) {
            const errorMessage = 'Email domain must match the company website domain.';
            setWorkExperiences((prevWorkExperiences) => {
                const updatedWorkExperiences = [...prevWorkExperiences];

                // ✅ Fix: Ensure index exists
                if (!updatedWorkExperiences[index]) {
                    updatedWorkExperiences[index] = {}; // Create empty object if missing
                }

                updatedWorkExperiences[index].emailError = errorMessage;
                return updatedWorkExperiences;
            });
            setDisabledButton(true);
        } else {
            setWorkExperiences((prevWorkExperiences) => {
                const updatedWorkExperiences = [...prevWorkExperiences];

                // ✅ Fix: Ensure index exists
                if (!updatedWorkExperiences[index]) {
                    updatedWorkExperiences[index] = {};
                }

                updatedWorkExperiences[index].emailError = '';
                return updatedWorkExperiences;
            });
            setDisabledButton(false);
        }

        if (websiteDomain && referenceEmailDomain && websiteDomain !== referenceEmailDomain) {
            // const errorMessage = 'Reference email domain must match the company website domain.'
            // setWorkExperiences((prevWorkExperiences) => {
            //     const updatedWorkExperiences = [...prevWorkExperiences]
            //     updatedWorkExperiences[index].referenceEmailError = errorMessage
            //     return updatedWorkExperiences
            // })
            // setDisabledButton(true)
        } else {
            setWorkExperiences((prevWorkExperiences) => {
                const updatedWorkExperiences = [...prevWorkExperiences]
                updatedWorkExperiences[index].referenceEmailError = ''
                return updatedWorkExperiences
            })
            setDisabledButton(false)
        }
    }
    console.log(data?.internationalEducation,"0000000000000000000")
    return (<Formik
        initialValues={{
            isPrivate: false,
            firstname: data?.basicDetails?.firstname || '',
            lastname: data?.basicDetails?.lastname || '',
            profile_pic: data?.basicDetails?.profile_pic || null,
            dob: data?.basicDetails?.dob?.split('T')[0] || null,
            gender: data?.basicDetails?.gender || '',
            nationality: data?.basicDetails?.nationality || 'canada',
            current_country: data?.basicDetails?.current_country || 'CA',
            current_state: data?.basicDetails?.current_state || '',
            current_city: data?.basicDetails?.current_city || '',
            contact_no: data?.basicDetails?.contact_no || '',
            contact_email_id: data?.basicDetails?.contact_email_id || '',
            job_preferred_location: data?.basicDetails?.job_preferred_location || '',

            internationalEducation: data?.internationalEducation || [{
                credential_institute_name: '',
                credential_assesed: false,
                credential_no: '',
                global_gpa: '',
                college_name: '',
                year_of_graduation: '',
                field_of_study: '',
                level_of_education: '',
            }],


            isInternationalEducation: data?.internationalEducation?.length > 0,

            isCanadianEducation: data?.canadianEducation[0]?.university ? true : false || false,

            internationalCEducation: data?.canadianEducation || [{
                university: '', // credential_assesed: false,
                city: '',
                level_of_education_canadian: '',
                field_of_study_canadian: '',
                year_of_completion: '',
                gpa: '', // level_of_education: '',
            }],


            // university: data?.canadianEducation?.university || '',
            // city: data?.canadianEducation?.city || '',
            // level_of_education_canadian: data?.canadianEducation?.level_of_education_canadian || '',
            // field_of_study_canadian: data?.canadianEducation?.field_of_study_canadian || '',
            // year_of_completion: data?.canadianEducation?.year_of_completion || '',
            // gpa: data?.canadianEducation?.gpa || '',
            // project_title: data?.canadianEducation?.project_title || '',
            // project_description: data?.canadianEducation?.project_description || '',
            // project_url: data?.canadianEducation?.project_url || '',

            coreSkills: [{
                _id: data?.skills[0]?._id || null,
                coreSkill: data?.skills[0]?.core_skill || '',
                subSkills: data?.skills[0]?.subSkill?.length > 0 ? data?.skills[0]?.subSkill.map((data) => {
                    const _id = data?._id || null
                    const subSkill = data.sub_skills || ''
                    const certificate = data.certificate || ''
                    const link = data.link || ''
                    return {_id, subSkill, certificate, link}
                }) : [],
            }],

            workExperience: data?.workExperience || [{
                isValidation: true,
                emailError: '',
                referenceEmailError: '',
                work_experience_industry: '',
                work_experience_sub_industry: '',
                work_experience_country: '',
                work_experience_job_title: '',
                work_experience_company_name: '',
                work_experience_company_website: '',
                experience_start_date: null,
                experience_end_date: null,
                isCurrentlyWorking: false,
                accomplishments_id: {
                    accomplishment_1: data?.workExperience?.accomplishment_1 || '',
                    accomplishment_2: data?.workExperience?.accomplishment_2 || '',
                    accomplishment_3: data?.workExperience?.accomplishment_3 || '',
                    accomplishment_4: data?.workExperience?.accomplishment_4 || '',
                },
                accomplish: {
                    accomplish1: 0, accomplish2: 0, accomplish3: 0, accomplish4: 0,
                },
                reference_email: '',
                reference_name: '',
                reference: '',
                reference_check: false,
            }],


            accomplishment_1: data?.workExperience?.accomplishment_1 || '',
            accomplishment_2: data?.workExperience?.accomplishment_2 || '',
            accomplishment_3: data?.workExperience?.accomplishment_3 || '',
            accomplishment_4: data?.workExperience?.accomplishment_4 || '',

            work_experience_industry: data?.workExperience?.work_experience_industry || '',
            work_experience_sub_industry: data?.workExperience?.work_experience_sub_industry || '',
            work_experience_country: data?.workExperience?.work_experience_country || '',
            work_experience_job_title: data?.workExperience?.work_experience_job_title || '',
            work_experience_company_name: data?.workExperience?.work_experience_company_name || '',
            work_experience_company_website: data?.workExperience?.work_experience_company_website || '',
            isCurrentlyWorking: data?.workExperience?.isCurrentlyWorking || false,
            email: data?.workExperience?.email || '',
            reference_check: data?.workExperience?.reference_check || false,
            reference: data?.workExperience?.reference || '',
            reference_email: data?.workExperience?.reference_email || '',

            video: data?.basicDetails?.video || '',
            secondary_video: data?.basicDetails?.secondary_video || '',

            career_role: data?.careerGoal?.career_role || '',
            career_industry: data?.careerGoal?.career_industry || '',
            career_field: data?.careerGoal?.career_field || '',
            // noc_number: data?.careerGoal?.noc_number || '',
        }}
        validationSchema={jobFormValidation}
        onSubmit={handleSubmit}
    >
        {({handleReset, isSubmitting, setFieldValue, values, errors}) => {
            return (<Form>
                {/* ------------------Personal Information--------------- */}
                <FormInfo title="Personal Information" icon={<UserInfo/>}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 py-4">
                        {/* Upload Photo Section */}
                        <div className="col-span-12 lg:col-span-3 flex justify-center items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                                    <input
                                        type="file"
                                        id="profile_pic"
                                        name="profile_pic"
                                        // value={values?.profile_pic}
                                        className="absolute opacity-0 w-full h-full cursor-pointer"
                                        accept="image/jpeg, image/png, image/jpg"
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            const maxSize = 2 * 1024 * 1024;
                                            if (file) {
                                                const validTypes = ["image/jpeg", "image/png", "image/jpg"];
                                                if (file.size > maxSize) {
                                                    setImgError("File size should be less than 2MB.");
                                                    return;
                                                }
                                                if (validTypes.includes(file.type)) {
                                                    setFieldValue("profile_pic", file);
                                                    setImgError(""); // Clear error
                                                } else {
                                                    setImgError("Invalid file type. Please select a JPEG, JPG, or PNG file.");
                                                }
                                            }
                                        }}
                                    />

                                    {(values.profile_pic || previewImage) ? (
                                        <img src={previewImage || values.profile_pic} alt="Preview"
                                             className="w-full h-full object-cover"/>) : (<label htmlFor="profile_pic"
                                                                                                 className="text-xs text-gray-400 text-center z-10">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-2xl">📷</span>
                                            <span>Upload photo</span>
                                        </div>
                                    </label>)}
                                </div>
                                {imgError && <div className="text-xs text-red-500 mt-1">{imgError}</div>}
                            </div>
                        </div>

                        {/* Form Grid Section */}
                        <div className="col-span-12 lg:col-span-9">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-0">
                                <TextField type="text" name="firstname" label="First Name" placeholder="First Name"
                                           onChange={(e) => setFieldValue("firstname", e.target.value)}/>


                                <TextField type="text" name="lastname" label="Last Name" placeholder="Last Name"
                                           onChange={(e) => setFieldValue("lastname", e.target.value)}/>

                                <DateField name="dob" label="Date Of Birth" placeholder="Date Of Birth"
                                           icon={<Calender/>}/>

                                <div>
                                    <Label label={'Contact No'}/>
                                    <PhoneInput
                                        name="contact_no"
                                        value={values.contact_no}
                                        onChange={(value) => setFieldValue("contact_no", value)}
                                        placeholder="Contact No"
                                        label="Contact No"
                                    />
                                    <ErrorMessage name="contact_no" component="div"
                                                  className="text-xs text-red-500 ml-1 mt-1"/>
                                </div>

                                <DropDown
                                    name="nationality"
                                    options={countryData}
                                    value={data?.basicDetails?.nationality || "Canada"}
                                    onChange={(e) => setFieldValue("nationality", e.target.value)}
                                    placeholder="Nationality"
                                    label="Nationality"
                                />

                                <div className="flex flex-row items-center gap-4">
                                    <p className="text-sm font-medium text-gray-600 mb-4">Gender :</p>
                                    <RadioGroup className='mb-0'
                                                name="gender"
                                                options={[{value: "male", label: "Male"}, {
                                                    value: "female",
                                                    label: "Female"
                                                }, {value: "other", label: "Other"},]}
                                    />
                                </div>

                                <DropDown
                                    name="current_country"
                                    options={countryDataBasic}
                                    value={getCountryNameByValue(defaultCurrentCountry)}
                                    onChange={(e) => handleChangeCountry(e, setFieldValue)}
                                    placeholder="Country"
                                    label="Country"
                                />

                                <DropDown
                                    name="current_state"
                                    options={stateOptions}
                                    value={getStateNameByValue(data?.basicDetails?.current_state || "")}
                                    onChange={(e) => handleChangeState(e, setFieldValue, values)}
                                    placeholder="Current State / Province"
                                    label="Current State / Province"
                                />

                                <DropDownInput
                                    name="current_city"
                                    options={cityOptions}
                                    value={data?.basicDetails?.current_city || ""}
                                    onChange={(e) => setFieldValue("current_city", e.target.value, values)}
                                    placeholder="Current City"
                                    label="Current City"
                                />

                                <TextField
                                    type="text"
                                    name="contact_email_id"
                                    placeholder="Contact Email Id"
                                    label="Contact Email"
                                    onChange={(e) => setFieldValue("contact_email_id", e.target.value)}
                                />

                                <DropDownInput
                                    name="job_preferred_location"
                                    options={provinceData}
                                    value={data?.basicDetails?.job_preferred_location}
                                    onChange={(e) => setFieldValue("job_preferred_location", e.target.value)}
                                    allowCustom={true}
                                    placeholder="Job Preferred location"
                                    label="Job Preferred location"
                                />
                            </div>
                        </div>

                    </div>
                </FormInfo>


                {/* ------------------International Education--------------- */}
                <FormInfo
                    title="Global Education"
                    icon={<GlobalEducation />}
                    renderRight={true}
                    renderRightContent={
                        <ToggleButton
                            label=""
                            name="isInternationalEducation"
                            onChange={(e) => setFieldValue('isInternationalEducation', e.target.checked)}
                        />
                    }
                >
                    {values.internationalEducation.length > 0 &&
                        values.internationalEducation.map((intEducation, index) => (
                            <div key={index} className="bg-white rounded-md shadow border mb-6">
                                <div className="flex flex-wrap justify-between items-center pt-4 w-full rounded-t-md">
                                    <div className="flex items-center">
                                        <div className="flex items-center bg-[#F3F3F3] px-10 py-2 rounded-r-full text-lg font-semibold text-[#1B2028] text-nowrap">
                                            {index + 1}.&nbsp;{intEducation.college_name || 'New Education'}
                                            <div
                                                onClick={() => handleDeleteInternationalEducation(setFieldValue,values.internationalEducation,index)}
                                                className="ml-2 cursor-pointer"
                                            >
                                                <DeleteIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid xl:grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 gap-x-5 gap-y-4 py-6 px-4">
                                    <DropDownInput
                                        label="Level of Education"
                                        name={`internationalEducation[${index}].level_of_education`}
                                        options={levelOfEducation}
                                        disabled={!values.isInternationalEducation}
                                        value={intEducation?.level_of_education || ''}
                                        onChange={(e) => handleChangeInternationalEducation(values.internationalEducation,setFieldValue,index, 'level_of_education', e.target.value)}
                                    />

                                    <DropDownInput
                                        label="Field of Study"
                                        name={`internationalEducation[${index}].field_of_study`}
                                        options={fieldOfStudy}
                                        disabled={!values.isInternationalEducation}
                                        value={intEducation?.field_of_study || ''}
                                        onChange={(e) => handleChangeInternationalEducation(values.internationalEducation,setFieldValue,index,'field_of_study', e.target.value)}
                                    />

                                    <DropDownInput
                                        label="Year of Graduation"
                                        name={`internationalEducation[${index}].year_of_graduation`}
                                        options={years}
                                        disabled={!values.isInternationalEducation}
                                        value={intEducation?.year_of_graduation || ''}
                                        onChange={(e) => handleChangeInternationalEducation(values.internationalEducation,setFieldValue,index,'year_of_graduation', e.target.value)}
                                    />

                                    <TextFieldValue
                                        type="text"
                                        label="College Name"
                                        name={`internationalEducation[${index}].college_name`}
                                        value={intEducation?.college_name || ''}
                                        placeholder="Enter college name"
                                        disabled={!values.isInternationalEducation}
                                        onChange={(e) => handleChangeInternationalEducation(values.internationalEducation,setFieldValue,index, 'college_name', e.target.value)}
                                    />

                                    <TextFieldValue
                                        type="text"
                                        label="GPA"
                                        name={`internationalEducation[${index}].global_gpa`}
                                        value={intEducation?.global_gpa || ''}
                                        placeholder="Divide % by 25 to get GPA"
                                        disabled={!values.isInternationalEducation}
                                        onChange={(e) => handleChangeInternationalEducation(values.internationalEducation,setFieldValue,index,'global_gpa', e.target.value)}
                                    />

                                    <TextFieldValue
                                        type="text"
                                        label="Credential No"
                                        name={`internationalEducation[${index}].credential_no`}
                                        value={intEducation?.credential_no || ''}
                                        placeholder="Enter Credential No"
                                        disabled={!values.isInternationalEducation}
                                        onChange={(e) => handleChangeInternationalEducation(values.internationalEducation,setFieldValue,index,'credential_no', e.target.value)}
                                    />

                                    <DropDownInput
                                        label="Credential Institute Name"
                                        name={`internationalEducation[${index}].credential_institute_name`}
                                        options={[
                                            { name: 'IQAS', value: 'IQAS' },
                                            { name: 'WES', value: 'WES' },
                                            { name: 'ICAS', value: 'ICAS' },
                                        ]}
                                        disabled={!values.isInternationalEducation}
                                        value={intEducation?.credential_institute_name || ''}
                                        onChange={(e) => handleChangeInternationalEducation(values.internationalEducation,setFieldValue,index,'credential_institute_name', e.target.value)}
                                    />

                                    <div className="flex items-center">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <Label label="Credential Assessed:" className="mr-2" />
                                            <Field
                                                type="checkbox"
                                                name={`internationalEducation[${index}].credential_assesed`}
                                                className="sr-only peer"
                                                disabled={!values.isInternationalEducation}
                                                onChange={(e) =>
                                                    handleChangeInternationalEducation(
                                                        values.internationalEducation,
                                                        setFieldValue,
                                                        index,
                                                        'credential_assesed',
                                                        e.target.checked
                                                    )
                                                }
                                                checked={!!intEducation.credential_assesed}
                                            />
                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A202C]" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {/* Add Education Button */}
                    <div className="pb-3">
                        <div
                            disabled={!values.isInternationalEducation}
                            className="ml-4 bg-black px-4 py-2 text-white rounded cursor-pointer text-nowrap inline-block"
                            onClick={() => handleAddInternationalEducation(values.internationalEducation,setFieldValue)}
                        >
                            + Add Education
                        </div>
                    </div>
                </FormInfo>

                {/* ------------------Canadian Education--------------- */}
                <FormInfo
                    title="Canadian Education"
                    icon={<CanadianEducation/>}
                    renderRight={true}
                    renderRightContent={<ToggleButton
                        label=""
                        name="isCanadianEducation"
                        onChange={(e) => {
                            setFieldValue('isCanadianEducation', e.target.checked)
                        }}
                    />}>
                    {values.internationalCEducation?.length > 0 && values.internationalCEducation?.map((intEducation, index) => (
                        <div key={index}>
                            {/*<div*/}
                            {/*    className="flex flex-wrap justify-between items-center gap-x-3 bg-primary-100 p-3 w-full">*/}
                            {/*    <div className="flex items-center gap-x-2">*/}
                            {/*        <div className="text-lg font-semibold capitalize text-primary text-nowrap">*/}
                            {/*            {index + 1}.{' '}*/}
                            {/*            {intEducation.college_name || 'New Education'}*/}
                            {/*        </div>*/}
                            {/*        {values.internationalCEducation.length > 1 && (<div*/}
                            {/*            onClick={() => handleDeleteInternationalCEducation(index)}*/}
                            {/*            className="cursor-pointer font-black"*/}
                            {/*        >*/}
                            {/*            <DeleteIcon/>*/}
                            {/*        </div>)}*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            <div
                                className="flex flex-wrap justify-between items-center pt-4 w-full rounded-t-md">
                                <div className="flex items-center">
                                    <div
                                        className="flex items-center bg-[#F3F3F3] px-10 py-2 rounded-r-full text-lg font-semibold text-[#1B2028] text-nowrap">
                                        {index + 1}.&nbsp;{intEducation.college_name || 'New Education'}
                                        {values.internationalCEducation.length > 1 && (<div
                                            onClick={() => handleDeleteInternationalCEducation(setFieldValue,values.internationalCEducation,index)}
                                            className="cursor-pointer font-black"
                                        >
                                            <DeleteIcon/>
                                        </div>)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid xl:grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                                <DropDownInput
                                    label="College/University"
                                    name={`internationalCEducation[${index}].university`}
                                    disabled={!values.isCanadianEducation}
                                    options={universityData?.map((data) => ({
                                        name: data.name, value: data.name,
                                    }))}
                                    value={intEducation?.university || ''}
                                    onChange={(e) => {
                                        handleChangeInternationalCEducation(values.internationalCEducation,setFieldValue,index, 'university', e.target.value)
                                    }}
                                />

                                <DropDownInput
                                    label="City"
                                    name={`internationalCEducation[${index}].city`}
                                    options={currentCity}
                                    disabled={!values.isCanadianEducation}
                                    value={intEducation?.city || ''}
                                    onChange={(e) => {
                                        handleChangeInternationalCEducation(values.internationalCEducation,setFieldValue,index, 'city', e.target.value)
                                    }}
                                />
                                <DropDownInput
                                    label="Level of Education"
                                    name={`internationalCEducation[${index}].level_of_education_canadian`}
                                    options={levelOfEducation}
                                    disabled={!values.isCanadianEducation}
                                    value={intEducation?.level_of_education_canadian || ''}
                                    onChange={(e) => {
                                        handleChangeInternationalCEducation(values.internationalCEducation,setFieldValue,index, 'level_of_education_canadian', e.target.value)
                                    }}/>
                                <DropDownInput
                                    label="Field of Study"
                                    name={`internationalCEducation[${index}].field_of_study_canadian`}
                                    disabled={!values.isCanadianEducation}
                                    options={fieldOfStudyCanadian}
                                    value={intEducation?.field_of_study_canadian || ''}
                                    onChange={(e) => {
                                        handleChangeInternationalCEducation(values.internationalCEducation,setFieldValue,index, 'field_of_study_canadian', e.target.value)
                                    }}/>
                                <DropDownInput
                                    label="Year of completion"
                                    name={`internationalCEducation[${index}].year_of_completion`}
                                    disabled={!values.isCanadianEducation}
                                    options={years}
                                    value={intEducation?.year_of_completion || ''}
                                    onChange={(e) => {
                                        handleChangeInternationalCEducation(values.internationalCEducation,setFieldValue,index, 'year_of_completion', e.target.value)
                                    }}/>
                                <TextField
                                    type="text"
                                    label="GPA"
                                    name={`internationalCEducation[${index}].gpa`}
                                    placeholder="10"
                                    disabled={!values.isCanadianEducation}
                                    value={intEducation?.gpa || ''}
                                    onChange={(e) => {
                                        handleChangeInternationalCEducation(values.internationalCEducation,setFieldValue,index, 'gpa', e.target.value)
                                    }}/>
                            </div>

                        </div>))}
                    <div className={'pb-3'}>
                        <div
                            disabled={!values.isInternationalEducation}
                            className="ml-4 bg-black px-4 py-2 text-white rounded cursor-pointer text-nowrap inline-block"
                            onClick={() => handleAddInternationalCEducation(values.internationalCEducation,setFieldValue)}
                        >
                            + Add Education
                        </div>
                    </div>
                </FormInfo>

                {/* -------------Skills------------- */}
                <FormInfo title="Skills" icon={<Skills/>}>
                    <div className="py-6 px-4">
                        <FieldArray name="coreSkills">
                            {({push, remove}) => (<div className="space-y-6">
                                {/* Render all core skills */}
                                {values.coreSkills.map((coreSkill, coreIndex) => (<div
                                    key={coreIndex}
                                    className={coreIndex > 0 ? "pt-5 border-t border-gray-200" : "mt-5"}
                                >
                                    <div className="flex justify-between items-start">
                                        {/* Core Skill Dropdown */}
                                        <div className="w-full lg:w-1/2 2xl:w-1/3">
                                            <DropDown
                                                label={coreIndex === 0 ? "Core Skills" : `Core Skill ${coreIndex + 1}`}
                                                name={`coreSkills[${coreIndex}].coreSkill`}
                                                value={coreSkill.coreSkill || ''}
                                                options={skillData?.map((skill) => ({
                                                    name: skill.core_skills, value: skill.core_skills,
                                                }))}
                                                onChange={(e) => {
                                                    setFieldValue(`coreSkills[${coreIndex}].coreSkill`, e.target.value);
                                                    setFieldValue(`coreSkills[${coreIndex}].subSkills`, []);
                                                }}
                                            />
                                        </div>
                                        {/* Remove button (only show for additional skills) */}
                                        {coreIndex > 0 && (<div
                                            type="button"
                                            onClick={() => remove(coreIndex)}
                                            className="text-red-500 hover:text-red-700 text-sm ml-2"
                                        >
                                            Remove
                                        </div>)}
                                    </div>
                                    {/* Subskills Section (only show if core skill is selected) */}
                                    {coreSkill.coreSkill && (<div className="mt-4">
                                        {skillData
                                            ?.filter((skill) => skill.core_skills === coreSkill.coreSkill)
                                            .map((filteredSkill) => (<div key={filteredSkill.core_skills}>
                                                {/* Subskills Multiselect */}
                                                <div className="w-full mt-3">
                                                    <Label label="Sub Skills"/>
                                                    <Multiselect
                                                        placeholder={"Select a sub skill"}
                                                        options={filteredSkill.sub_skills.map((sub) => ({
                                                            name: sub.sub_skill, id: sub.sub_skill,
                                                        }))}
                                                        selectedValues={coreSkill.subSkills?.map((skill) => ({
                                                            name: skill.subSkill, id: skill.subSkill,
                                                        }))}
                                                        onSelect={(selectedList) => {
                                                            const updatedSubSkills = selectedList.map((item) => ({
                                                                subSkill: item.name, certificate: null,
                                                            }));
                                                            setFieldValue(`coreSkills[${coreIndex}].subSkills`, updatedSubSkills);
                                                        }}
                                                        onRemove={(selectedList) => {
                                                            const updatedSubSkills = selectedList.map((item) => ({
                                                                subSkill: item.name,
                                                                certificate: null,
                                                            }));
                                                            setFieldValue(`coreSkills[${coreIndex}].subSkills`, updatedSubSkills);
                                                        }}
                                                        selectionLimit={3}
                                                        displayValue="name"
                                                    />
                                                    <ErrorMessage
                                                        name={`coreSkills[${coreIndex}].subSkills`}
                                                        component="div"
                                                        className="text-xs text-red-500 ml-1 mt-1"
                                                    />

                                                    {coreIndex === 0 && (
                                                        <span className="text-xs text-green-700">
                          * If your skill is not listed, please email team@zeroed.ca
                        </span>)}
                                                </div>
                                                {/* Certificate Uploads */}
                                                <div
                                                    className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 mt-4">
                                                    {coreSkill.subSkills?.map((subSkill, subIndex) => (
                                                        <div key={subIndex}
                                                             className="mt-3">
                                                            {filteredSkill.sub_skills
                                                                ?.filter((sub) => sub.sub_skill === subSkill.subSkill,)
                                                                .map((sub) => (<div
                                                                    key={sub.sub_skill}>
                                                                    {/* File input */}
                                                                    <div>
                                                                        <Label
                                                                            label={`Upload Certificate for ${sub.sub_skill}`}
                                                                        />
                                                                        <Field
                                                                            name={`coreSkills[${coreIndex}].subSkills[${subIndex}].certificate`}
                                                                        >
                                                                            {({field}) => (<div
                                                                                className="flex flex-col">
                                                                                <input
                                                                                    type="file"
                                                                                    id={`coreSkills[${coreIndex}].subSkills[${subIndex}].certificate`}
                                                                                    name={`coreSkills[${coreIndex}].subSkills[${subIndex}].certificate`}
                                                                                    className="hidden"
                                                                                    onChange={(event,) => {
                                                                                        const file = event.currentTarget.files[0]
                                                                                        if (file) {
                                                                                            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf',]
                                                                                            if (validTypes.includes(file.type,)) {
                                                                                                const updatedSubSkills = [...coreSkill.subSkills,]
                                                                                                updatedSubSkills[subIndex] = {
                                                                                                    ...updatedSubSkills[subIndex],
                                                                                                    certificate: file,
                                                                                                }
                                                                                                setFieldValue(`coreSkills[${coreIndex}].subSkills`, updatedSubSkills,)
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                <label
                                                                                    htmlFor={`coreSkills[${coreIndex}].subSkills[${subIndex}].certificate`}
                                                                                    className="flex flex-wrap items-center gap-1 border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-1 pr-10 w-full cursor-pointer whitespace-nowrap"
                                                                                >
                                                            <span
                                                                className="px-2 py-1 border border-primary rounded bg-primary-100">
                                                              Choose file
                                                            </span>
                                                                                    {subSkill.certificate ? (
                                                                                        <div
                                                                                            className="inline-block w-full whitespace-nowrap overflow-hidden text-ellipsis">
                                                                                            {subSkill.certificate instanceof File ? subSkill.certificate.name : subSkill.certificate
                                                                                                .split('/',)
                                                                                                .pop()}
                                                                                        </div>) : ('No file chosen')}
                                                                                </label>
                                                                                {/* Displaying error message */}
                                                                                {imgError && (
                                                                                    <div
                                                                                        className="text-xs text-red-500 ml-1 mt-1">
                                                                                        {imgError}
                                                                                    </div>)}
                                                                                {imgError === '' && (
                                                                                    <ErrorMessage
                                                                                        name={`coreSkills[${coreIndex}].subSkills[${subIndex}].certificate`}
                                                                                        component="div"
                                                                                        className="text-xs text-red-500 ml-1 mt-1"
                                                                                    />)}
                                                                            </div>)}
                                                                        </Field>
                                                                    </div>
                                                                    {/* Display uploaded certificate preview */}
                                                                    <CertificatePreview
                                                                        subSkill={subSkill}
                                                                    />
                                                                    <div
                                                                        className='mt-3'>
                                                                        <TextField
                                                                            type="text"
                                                                            label="assessment result link"
                                                                            name={`coreSkills[${coreIndex}].subSkills[${subIndex}].link`}
                                                                            placeholder="Enter assessment result link"
                                                                            onChange={(e) => setFieldValue(`coreSkills[${coreIndex}].subSkills[${subIndex}].link`, e.target.value)}
                                                                        />
                                                                    </div>
                                                                    {/* Display error message if validation fails */}
                                                                    <ErrorMessage
                                                                        name={`coreSkills[${coreIndex}].subSkills[${subIndex}].link`}
                                                                        component="div"
                                                                        style={{color: 'red'}}
                                                                    />
                                                                </div>))}
                                                        </div>),)}
                                                </div>
                                            </div>))}
                                    </div>)}
                                </div>))}
                                {/* ADD SKILL BUTTON (only show if less than 3 skills) */}
                                {values.coreSkills.length < 3 && (<div
                                    type="button"
                                    onClick={() => push({coreSkill: '', subSkills: []})}
                                    className="bg-black px-4 py-2 inline-block text-white rounded"
                                >
                                    + Add Another Skill
                                </div>)}
                            </div>)}
                        </FieldArray>
                    </div>
                </FormInfo>

                {/* -------------Work Experience------------- */}
                <FormInfo title="Work Experience" icon={<WorkExperience/>}>
                    {values?.workExperience.map((experience, index) => (<div key={index}>
                        <div
                            className="flex flex-wrap justify-between items-center pt-4 w-full rounded-t-md">
                            <div className="flex items-center">
                                <div
                                    className="flex items-center bg-[#F3F3F3] px-10 py-2 rounded-r-full text-lg font-semibold text-[#1B2028] text-nowrap">
                                    {index + 1}.{' '}
                                    {experience.work_experience_company_name || 'New Experience'}
                                    {values?.workExperience?.length > 1 && (<div
                                        onClick={() => handleDeleteExperience(setFieldValue,values?.workExperience,index)}
                                        className="cursor-pointer font-black ml-2"
                                    >
                                        <DeleteIcon/>
                                    </div>)}
                                </div>
                            </div>
                        </div>
                        <div
                            className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2  gap-x-5 py-6 px-4">
                            <DropDown
                                label="Industry"
                                name={`workExperience[${index}].work_experience_industry`}
                                value={experience.work_experience_industry}
                                options={industriesData.map((industry) => ({
                                    value: industry.name, name: industry.name,
                                }))}
                                onChange={(e) => {
                                    handleSubIndustryChange(e, index)
                                    handleChangeExperience(values.workExperience,setFieldValue,index, 'work_experience_industry', e.target.value,)
                                }}
                            />
                            <DropDown
                                label="Sub Industry"
                                name={`workExperience[${index}].work_experience_sub_industry`}
                                value={experience.work_experience_sub_industry}
                                options={subIndustryOptions[index] || []}
                                onChange={(e) => {
                                    handleChangeExperience(values.workExperience,setFieldValue,index, 'work_experience_sub_industry', e.target.value,)
                                }}
                            />
                            <DropDownInput
                                label="Country"
                                name={`workExperience[${index}].work_experience_country`}
                                value={experience.work_experience_country}
                                options={countryData}
                                onChange={(e) => handleChangeExperience(values.workExperience,setFieldValue,index, 'work_experience_country', e.target.value,)}
                            />
                            <TextFieldValue
                                required
                                type="text"
                                label="Role"
                                name={`workExperience[${index}].work_experience_job_title`}
                                value={experience.work_experience_job_title}
                                placeholder="Software Engineer"
                                onChange={(e) => handleChangeExperience(values.workExperience,setFieldValue,index, 'work_experience_job_title', e.target.value,)}
                            />

                            <TextFieldValue
                                type="text"
                                label="Company Name"
                                name={`workExperience[${index}].work_experience_company_name`}
                                value={experience.work_experience_company_name}
                                placeholder="Company name"
                                onChange={(e) => handleChangeExperience(values.workExperience,setFieldValue,index, 'work_experience_company_name', e.target.value,)}
                            />
                            <TextFieldValue
                                type="text"
                                label="Website link"
                                name={`workExperience[${index}].work_experience_company_website`}
                                value={experience.work_experience_company_website}
                                placeholder="www.website.com"
                                onChange={(e) => handleChangeExperience(values.workExperience,setFieldValue,index, 'work_experience_company_website', e.target.value,)}
                            />

                            {/* ---------Start Date------------- */}
                            <div className='mb-2'>
                                <Label label="Start Date"/>
                                <div className="relative">
                                    <Field
                                        name={`workExperience[${index}].experience_start_date`}
                                        className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full"
                                        component={ExperienceDateFormat}
                                        defaultValue={experience.experience_start_date == 'NaN/NaN/NaN' ? null : experience.experience_start_date} // This will be set
                                        // to 10/27/2024
                                        onChange={(e) => handleChangeExperience(values.workExperience,setFieldValue,index, 'experience_start_date', e,)}
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Calender/>
                        </span>
                                    <ErrorMessage
                                        name={`workExperience[${index}].experience_start_date`}
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                            </div>

                            {/* ---------End Date------------- */}
                            <div>
                                <Label label="End Date"/>
                                <div className="relative">
                                    <Field
                                        name={`workExperience[${index}].experience_end_date`}
                                        className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full"
                                        component={ExperienceDateFormat}
                                        defaultValue={experience.experience_end_date == 'NaN/NaN/NaN' ? null : experience.experience_end_date}
                                        disabled={experience.isCurrentlyWorking} // Disable if currently working
                                        onChange={(e) => handleChangeExperience(values.workExperience,setFieldValue,index, 'experience_end_date', e,)}
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Calender/>
                        </span>
                                    <ErrorMessage
                                        name={`workExperience[${index}].experience_end_date`}
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                            </div>

                            {[...Array(visibleFields)].map((_, i) => (<div style={{position: 'relative'}} key={i}>
                                <TextArea
                                    name={`accomplishment_${i + 1}_${index}`}
                                    label="Accomplishments"
                                    value={experience.accomplishments_id?.[`accomplishment_${i + 1}`] || ""}
                                    onChange={(e) => {
                                        const words = e.target.value.split(/\s+/).filter(Boolean);
                                        const wordCount = words.length;

                                        const updatedExperiences = [...workExperiences];

                                        // Ensure `accomplish` exists before updating it
                                        if (!updatedExperiences[index].accomplish) {
                                            updatedExperiences[index].accomplish = {};
                                        }

                                        updatedExperiences[index].accomplish[`accomplish${i + 1}`] = wordCount;

                                        handleChangeExperience(values.workExperience,setFieldValue,index, `accomplishments_id.accomplishment_${i + 1}`, e.target.value,);
                                    }}
                                />


                                <span style={{
                                    color: (experience?.accomplish?.[`accomplish${i + 1}`] || 0) > 14 ? 'red' : 'grey',
                                    position: 'absolute',
                                    right: 10,
                                    bottom: 25,
                                    fontSize: '14px'
                                }}>
            {experience?.accomplish?.[`accomplish${i + 1}`] || 0} / 14
        </span>
                            </div>))}

                            {visibleFields < 4 && (<div className={'flex items-center'}>
                                <div
                                    className="ml-4 bg-black px-4 py-2 text-white rounded text-center w-[100px] cursor-pointer text-nowrap mt-3"
                                    onClick={addField}
                                >
                                    + Add
                                </div>
                            </div>)}
                        </div>

                        <div>
                            {experience._id &&
                                <div className='flex justify-between items-center pb-4 px-4 lg:w-1/4'>

                                    <label className="inline-flex items-center cursor-pointer">
                                        <Label label={'Reference Check :'} className="mr-2"/>
                                        <Field
                                            type="checkbox"
                                            id={`reference_check_${index}`}
                                            name={`reference_check_${index}`}
                                            className="sr-only peer"
                                            checked={experience?.reference_check || false}
                                            onChange={(e) => {
                                                handleChangeExperience(index, 'reference_check', e.target.checked)
                                            }}
                                        />
                                        <div
                                            className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A202C]">
                                        </div>
                                    </label>
                                </div>}
                            {experience.reference_check && (<div
                                className='grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-3 px-4'>
                                <DropDownInput
                                    label="reference"
                                    name={`reference_${index}`}
                                    value={experience.reference}
                                    options={referenceOption}
                                    onChange={(e) => handleChangeExperience(index, 'reference', e.target.value,)}
                                />
                                <div className="w-full">
                                    <TextFieldValue
                                        type="text"
                                        label="Reference Name"
                                        name={`reference_name_${index}`}
                                        value={experience.reference_name || ''}
                                        placeholder="Enter reference name"
                                        onChange={(e) => handleChangeExperience(index, 'reference_name', e.target.value,)}
                                    />

                                </div>
                                <div className="w-full">
                                    <TextFieldValue
                                        type="text"
                                        label="Reference Email"
                                        name={`reference_email_${index}`}
                                        value={experience.reference_email || ''}
                                        placeholder="Enter reference email"
                                        onChange={(e) => handleChangeExperience(index, 'reference_email', e.target.value,)}
                                    />
                                    {experience.referenceEmailError && (
                                        <div className="text-red-500 text-sm -mt-3">
                                            {experience.referenceEmailError}
                                        </div>)}
                                </div>
                                {(data && !experience.referenceEmailError) && <div
                                    className={`text-center mt-8 px-4 py-2 rounded w-[160px] h-10 text-nowrap text-white 
      ${experience.is_experience_verified || experienceLoading ? 'bg-gray-400 opacity-80' : 'bg-black '}`}
                                    onClick={() => verifyEmail({
                                        ...experience, candidateName: `${values.firstname} ${values.lastname}`
                                    })}
                                    disabled={experience.is_experience_verified || experienceLoading}

                                >
                                    Send
                                </div>}
                            </div>)}
                        </div>

                    </div>))}

                    <div className="py-6">
                        <div
                            className="ml-4 bg-black px-4 py-2 text-white rounded text-nowrap mt-3 inline-block"
                            onClick={() => handleAddExperience(values?.workExperience,setFieldValue)}
                        >
                            + Add Experience
                        </div>
                    </div>
                    <div className="text-xs text-red-500 ml-4 mt-4 mb-4">
                        {experienceError}
                    </div>
                    {/* Introduction video upload */}
                </FormInfo>
                <FormInfo title="Projects" icon={<CareerGoal/>}>
                    {projects.map((item, index) => (<div key={index}>
                        {/*<div className="gap-x-3 bg-primary-100 p-3 w-full">*/}
                        {/*    <div className="flex items-center gap-x-2">*/}
                        {/*        <div className="text-lg font-semibold capitalize text-primary text-nowrap">*/}
                        {/*            {index + 1}.{' '}*/}
                        {/*            {item.project_title || 'New Project'}*/}
                        {/*        </div>*/}
                        {/*        {projects.length > 1 && (<div*/}
                        {/*            onClick={() => handleDeleteProject(index)}*/}
                        {/*            className="cursor-pointer font-black"*/}
                        {/*        >*/}
                        {/*            <DeleteIcon/>*/}
                        {/*        </div>)}*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div
                            className="flex flex-wrap justify-between items-center pt-4 w-full rounded-t-md">
                            <div className="flex items-center">
                                <div
                                    className="flex items-center bg-[#F3F3F3] px-10 py-2 rounded-r-full text-lg font-semibold text-[#1B2028] text-nowrap">
                                    {index + 1}.{' '}
                                    {item.project_title || 'New Project'}
                                    {projects.length > 1 && (<div
                                        onClick={() => handleDeleteProject(index)}
                                        className="cursor-pointer font-black ml-2"
                                    >
                                        <DeleteIcon/>
                                    </div>)}
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                            <TextField
                                type="text"
                                label="Title"
                                name={`project_title_${index}`}
                                value={item.project_title}
                                placeholder="Enter project title"
                                onChange={(e) => handleChangeProject('project_title', index, e.target.value)}
                            />
                            <TextField
                                type="text"
                                label="URL"
                                value={item.project_url}
                                name={`project_url_${index}`}
                                placeholder="Enter project url"
                                onChange={(e) => handleChangeProject('project_url', index, e.target.value)}
                            />
                            <div style={{position: 'relative'}}>
                                <TextArea
                                    name={`project_description_${index}`}
                                    label="Description"
                                    value={item.project_description}
                                    onChange={(e) => {
                                        const words = e.target.value.split(/\s+/).filter(Boolean);
                                        handleChangeProject('project_description', index, e.target.value);
                                        setWordCounts((prev) => ({...prev, [index]: words.length}));
                                    }}
                                />
                                <span style={{
                                    color: wordCounts[index] > 25 ? 'red' : 'grey',
                                    position: 'absolute',
                                    right: 10,
                                    bottom: 25,
                                    fontSize: '14px'
                                }}>
                                                {wordCounts[index] || 0} / 25
                                            </span>
                            </div>


                        </div>
                        <div>
                            {item._id && <div className='flex justify-between items-center pb-4 px-4 lg:w-1/4'>
                                <label className="inline-flex items-center cursor-pointer">
                                    <Label label={'Reference Check :'} className="mr-2"/>
                                    <Field
                                        type="checkbox"
                                        id={`reference_check_${index}`}
                                        name={`reference_check_${index}`}
                                        className="sr-only peer"
                                        checked={item?.reference_check || false}
                                        onChange={(e) => {
                                            handleChangeProject('reference_check', index, e.target.checked)
                                        }}
                                    />
                                    <div
                                        className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A202C]">
                                    </div>
                                </label>
                            </div>}
                            {item.reference_check && (<div
                                className='grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-3 px-4'>
                                <DropDownInput
                                    label="reference"
                                    name={`reference_${index}`}
                                    value={item.reference}
                                    options={projectReferenceOption}
                                    onChange={(e) => handleChangeProject('reference', index, e.target.value,)}
                                />
                                <div className="w-full">
                                    <TextFieldValue
                                        type="text"
                                        label="Reference Name"
                                        name={`reference_name_${index}`}
                                        value={item.reference_name || ''}
                                        placeholder="Enter reference name"
                                        onChange={(e) => handleChangeProject('reference_name', index, e.target.value,)}
                                    />

                                </div>
                                <div className="w-full">
                                    <TextFieldValue
                                        type="text"
                                        label="Reference Email"
                                        name={`reference_email_${index}`}
                                        value={item.reference_email || ''}
                                        placeholder="Enter reference email"
                                        onChange={(e) => handleChangeProject('reference_email', index, e.target.value,)}
                                    />
                                </div>
                                {(data && item.reference_email) && (<div
                                    className={`text-center mt-8 px-4 py-2 rounded w-[160px] h-10 text-nowrap text-white 
      ${item.is_project_verified || projectLoading ? 'bg-gray-400 opacity-80' : 'bg-black '}
    `}
                                    onClick={() => verifyProjectEmail({...item})}
                                    disabled={item.is_project_verified || projectLoading}
                                >
                                    Send
                                </div>)}

                            </div>)}
                        </div>
                    </div>))}
                    <div className='py-4'>
                        <div
                            className="ml-4 bg-black px-4 py-2 text-white rounded text-center inline-block"
                            onClick={handleAddProject}
                        >
                            + Add Project
                        </div>
                    </div>
                </FormInfo>
                <FormInfo title="Intro Video" icon={<WorkExperience/>}>
                    <div className="flex flex-col md:flex-row justify-end items-end pt-5 pe-5 gap-4">
                        <div
                            onClick={() => setIsSampleModalOpen(true)}
                            className="bg-white text-black px-5 py-2.5 text-sm font-medium rounded-md border border-gray-300 transition-all duration-200 ease-in-out"
                        >
                            Sample Video
                        </div>
                        <div
                            onClick={() => setShowInstruction(true)}
                            className="bg-white text-black px-5 py-2.5 text-sm font-medium rounded-md border border-gray-300 transition-all duration-200 ease-in-out"
                        >
                            Instructions
                        </div>
                    </div>
                    <div className="py-6 px-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex flex-col items-center sm:items-center text-center sm:text-left">
                            <div className="lg:w-1/9 sm:w-1/8">
                                <div className=" items-center gap-4">
                                    <Dialog isOpen={showInstruction} onClose={closeInstructionDialog}
                                            title="Instructions" hideCloseButton={true}>
                                        <p className="text-sm">
                                            <strong>Hi, here are a few things to keep in mind while recording
                                                your video:</strong>
                                        </p>
                                        <ul className="text-sm space-y-2">
                                            <li>📷 <strong>Use a good quality camera:</strong> A smartphone or
                                                webcam with at least HD (720p)
                                                resolution ensures sharp, professional-looking video.
                                            </li>
                                            <li>💡 <strong>Lighting is key:</strong> Natural light is great, but
                                                soft artificial lighting works
                                                too. Avoid backlighting to prevent shadows.
                                            </li>
                                            <li>🖼️ <strong>Keep your background clean:</strong> A neutral or
                                                professional setup looks best.
                                                Avoid clutter and distractions.
                                            </li>
                                            <li>📹 <strong>Use a stable setup:</strong> Place your camera on a
                                                steady surface or tripod for
                                                smooth, professional framing.
                                            </li>
                                            <li>👔 <strong>Dress appropriately:</strong> Wear attire that aligns
                                                with your industry, whether
                                                business casual or formal.
                                            </li>
                                            <li>🎯 <strong>Position yourself properly:</strong> Keep the camera
                                                at eye level, maintain good
                                                posture, and make direct eye contact.
                                            </li>
                                            <li>🎙️ <strong>Ensure clear audio:</strong> Record in a quiet space
                                                and use an external microphone
                                                if available to minimize background noise.
                                            </li>
                                            <li>📜 <strong>Practice makes perfect:</strong>
                                                <ul className="list-disc pl-5">
                                                    <li>Rehearse a few times before recording to feel
                                                        comfortable.
                                                    </li>
                                                    <li>Use notes instead of a full script to sound natural.
                                                    </li>
                                                    <li>Record a test clip and adjust lighting, audio, and
                                                        positioning as needed.
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>😊 <strong>Show confidence:</strong> Smile, maintain positive
                                                body language, and be engaging.
                                            </li>
                                            <li>⏳ <strong>Keep it concise:</strong> Aim for 1-2 minutes to
                                                deliver a strong, impactful message.
                                            </li>
                                        </ul>

                                        <p className="mt-4 text-sm"><strong>Let’s structure your video for a
                                            great first impression:</strong>
                                        </p>

                                        <div className="mt-2 space-y-4">
                                            <div>
                                                <h3 className="font-semibold">👋 Introduction (10-15
                                                    seconds)</h3>
                                                <p>🗣️ Start with a warm introduction and introduce yourself
                                                    confidently.</p>
                                                <p><strong>Example:</strong> "Hi, my name is [Your Name], and
                                                    I’m a [Your Profession/Industry]."
                                                </p>
                                                <p>🗣️ Mention key experience or education to highlight your
                                                    relevance.</p>
                                                <p><strong>Example:</strong> "I have [X years] of experience in
                                                    [Industry/Field]."</p>
                                                <p>"I recently graduated with a [Degree] from [University]."</p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">🚀 Key Highlights (30-45
                                                    seconds)</h3>
                                                <p>🗣️ Showcase key skills and accomplishments that make you
                                                    stand out.</p>
                                                <p><strong>Example:</strong></p>
                                                <ul className="list-disc pl-5">
                                                    <li>"I specialize in [Skill 1, Skill 2, Skill 3]."</li>
                                                    <li>"At [Company], I successfully [Achievement]."</li>
                                                    <li>"I recently completed [Course/Certification] and worked
                                                        on [Project]."
                                                    </li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">🎯 Closing & Call to Action (15-20
                                                    seconds)</h3>
                                                <p>🗣️ Wrap up with enthusiasm and invite engagement.</p>
                                                <p><strong>Example:</strong></p>
                                                <ul className="list-disc pl-5">
                                                    <li>"I’m excited about roles in [Industry/Field] and eager
                                                        to contribute my skills."
                                                    </li>
                                                    <li>"I’d love to connect and discuss how I can add value to
                                                        your team."
                                                    </li>
                                                    <li>"Thank you for your time, and I look forward to
                                                        connecting!"
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <p className="mt-4 text-sm"><strong>🎬 Final Tips:</strong></p>
                                        <ul className="text-sm list-disc pl-5 space-y-2">
                                            <li>✔️ Practice a few times before recording to build confidence.
                                            </li>
                                            <li>✔️ Keep your tone friendly, professional, and engaging.</li>
                                            <li>✔️ Most importantly, be yourself! Authenticity helps you stand
                                                out.
                                            </li>
                                        </ul>

                                        <div className="flex justify-end gap-2 mt-4">
                                            <div className="bg-primary text-white px-4 py-2 rounded"
                                                 onClick={closeInstructionDialog}>
                                                Ok
                                            </div>
                                        </div>
                                    </Dialog>
                                    <VideoSampleModal isOpen={isSampleModalOpen}
                                                      onClose={() => setIsSampleModalOpen(false)}/>
                                </div>
                            </div>

                        </div>
                        <VideoUploader
                            data={data}
                            defaultVideo={data?.basicDetails?.video}
                            onVideoUpload={(url) => setFieldValue(`video`, url)}
                            defaultSecondaryVideo={data?.basicDetails?.secondary_video}
                            onSecondaryVideoUpload={(url) => setFieldValue(`secondary_video`, url)}
                        />

                    </div>
                </FormInfo>

                {/* -------------Career Goals------------- */}
                <FormInfo title="Career Goals" icon={<CareerGoal/>}>

                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                        <TextField
                            type="text"
                            label="Role"
                            name="career_role"
                            placeholder="Enter career role"
                            onChange={(e) => setFieldValue('career_role', e.target.value)}
                        />

                        {/*{dropDown && (*/}
                        <DropDown
                            label="Industry"
                            name="career_industry"
                            value={values.career_industry}
                            options={[
                                { value: '', name: 'Select Industry' },
                                ...new Map(
                                    dropDown
                                        .filter(item => item.Industry === 'Minor Group')
                                        .map(item => [item['Class title'], {
                                            value: item['Class title'],
                                            name: item['Class title'],
                                        }])
                                ).values()
                            ]}
                            onChange={(e) => {
                                setFieldValue('career_industry', e.target.value);
                                // Reset career_field when industry changes
                                if (values.career_field) {
                                    setFieldValue('career_field', '');
                                }
                            }}
                        />

                        {/*// For the Career Field dropdown:*/}
                        <DropDown
                            label="Career Field"
                            name="career_field"
                            value={values.career_field}
                            options={[
                                { value: '', name: 'Select Career Field' },
                                ...dropDown
                                    .filter(item => item.Industry === 'Unit Group')
                                    .map(item => ({
                                        value: item['Class title'],
                                        name: item['Class title'],
                                        noc: String(item.NOC_CODE),
                                    }))
                            ]}
                            onChange={(e) => {
                                const selectedValue = e.target.value;
                                setFieldValue('career_field', selectedValue);
                            }}
                        />
                        {/*// )}*/}

                        {/*<ErrorMessage*/}
                        {/*    name="career_field"*/}
                        {/*    component="div"*/}
                        {/*    className="text-red-500 text-sm"*/}
                        {/*/>*/}



                        {/*{dropDown && (*/}
                        {/*    <DropDown*/}
                        {/*        label="NOC Number"*/}
                        {/*        name="noc_number"*/}
                        {/*        value={values?.noc_number || ''}*/}
                        {/*        disabled={true}*/}
                        {/*        options={*/}
                        {/*            dropDown*/}
                        {/*                .filter(item =>*/}
                        {/*                    item.Industry === values?.career_industry &&*/}
                        {/*                    item['Class title'] === values?.career_field*/}
                        {/*                )*/}
                        {/*                .map(item => ({*/}
                        {/*                    value: String(item.NOC_CODE),*/}
                        {/*                    name: String(item.NOC_CODE),*/}
                        {/*                }))*/}
                        {/*        }*/}
                        {/*        onChange={(e) => {*/}
                        {/*            const selectedNoc = e.target.value;*/}
                        {/*            setFieldValue('noc_number', selectedNoc);*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*)}*/}
                    </div>
                </FormInfo>

                {/* --------------Submit button------------------- */}
                <div className="flex justify-end gap-x-5 pb-6">
                    <button
                        type="reset"
                        onClick={() => {
                            handleReset()
                            resetWorkExperiences()
                        }}
                        className={`flex gap-x-2 lato justify-end items-center rounded w-auto py-2 px-10 mt-10 bg-white border border-black`}
                    >
                        <span className="text-black text-base font-bold">Reset</span>
                    </button>
                    <button
                        // disabled={disabledButton || isSubmitting || imgError === '' ? false : true}
                        // disabled={disabledButton || isSubmitting || isAnyDescriptionTooLong || isGreaterThan17}
                        type="submit"
                        className={`flex lato gap-x-2 justify-end items-center rounded w-auto py-2 px-10 mt-10 bg-black`}
                    >
                <span className="text-white text-base font-bold">
                  {isSubmitting ? <Loader/> : data ? 'Update' : 'Submit'}
                </span>

                    </button>
                </div>
            </Form>)
        }}
    </Formik>)
}

export default Information
