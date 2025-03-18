import React, {useEffect, useState} from 'react'
import {ErrorMessage, Field, FieldArray, Form, Formik} from 'formik'
import {
    Checkbox,
    DateField,
    DropDown,
    DropDownInput,
    RadioGroup,
    TextArea,
    TextField,
    TextFieldValue,
    ToggleButton,
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
    Calender,
    CanadianEducation,
    CareerGoal,
    DeleteIcon,
    GlobalEducation,
    Loader,
    Skills,
    UserInfo,
    WorkExperience,
} from '../../common/Icons'
import {ExperienceDateFormat} from '../../utils/dateFormat'
import FormInfo from '../../common/Information/formInfo'
import Label from '../../component/InputField/label'

const getDomainFromUrl = (url) => {
    try {
        // Remove protocol (http:// or https://) and "www."
        const domain = new URL(url).hostname.replace(/^www\./, '').toLowerCase()
        return domain
    } catch (error) {
        return '' // Return empty string if URL is invalid
    }
}

const getDomainFromEmail = (email) => {
    if (!email || !email.includes('@')) {
        return '' // Return an empty string if invalid
    }

    const emailParts = email.split('@')
    if (emailParts.length < 2) {
        return '' // Return empty if '@' doesn't divide into two parts
    }

    const emailDomain = emailParts[1].toLowerCase()
    return emailDomain // Return the domain
}

function Information({data}) {
    let navigate = useNavigate()
    const token = localStorage.getItem('token')

    const [stateOptions, setStateOptions] = useState([])
    const [cityOptions, setCityOptions] = useState([])
    const [experienceError, setExperienceError] = useState('')
    const [imgError, setImgError] = useState('')
    const [imgErrorSkill, setImgErrorSkill] = useState('')
    const [imgErrorSkillSecond, setImgErrorSkillSecond] = useState('')
    const [imgErrorSkillThird, setImgErrorSkillThird] = useState('')

    const [imagePreviewCore, setImagePreviewCore] = useState(null)
    const [imagePreviewSecond, setImagePreviewSecond] = useState(null)
    const [imagePreviewThird, setImagePreviewThird] = useState(null)

    // Get countries for the country dropdown
    const countryData = Country.getAllCountries().map((country) => ({
        value: country.name,
        name: country.name,
    }))

    const countryDataBasic = Country.getAllCountries().map((country) => ({
        value: country.isoCode,
        name: country.name,
    }))

    const defaultCurrentCountry = data?.basicDetails?.current_country || 'CA'

    useEffect(() => {
        if (data?.basicDetails) {
            const states = State.getStatesOfCountry(data.basicDetails.current_country)
            setStateOptions(
                states.map((state) => ({
                    value: state.isoCode, // Use state ISO code as value
                    name: state.name, // Use state name for display
                })),
            )

            // Check if current state is set
            if (data.basicDetails.current_state) {
                const cities = City.getCitiesOfState(
                    data.basicDetails.current_country,
                    data.basicDetails.current_state,
                )
                setCityOptions(
                    cities.map((city) => ({
                        value: city.name, // You can also set city code if available
                        name: city.name,
                    })),
                )
            } else {
                setCityOptions([])
            }
        } else {
            const states = State.getStatesOfCountry('CA') // Default to CA
            setStateOptions(
                states.map((state) => ({
                    value: state.isoCode,
                    name: state.name,
                })),
            )
        }
    }, [data])

    const handleChangeCountry = (e, setFieldValue) => {
        const current_country = e.target.value
        setFieldValue('current_country', current_country)
        setFieldValue('current_state', '')
        setFieldValue('current_city', '')

        if (current_country) {
            const states = State.getStatesOfCountry(current_country)
            setStateOptions(
                states.map((state) => ({
                    value: state.isoCode,
                    name: state.name,
                })),
            )

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
            const cities = City.getCitiesOfState(
                values?.current_country,
                current_state,
            )
            setCityOptions(
                cities.map((city) => ({
                    value: city.name,
                    name: city.name,
                })),
            )
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
        emailError: '',
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
        },
        email: '',
    }
    const [workExperiences, setWorkExperiences] = useState([
        initialWorkExperience,
    ])

    const [deletedExperienceIds, setDeletedExperienceIds] = useState([])

    const handleDeleteExperience = (index) => {
        if (!data) {
            setWorkExperiences((prev) => prev.filter((_, i) => i !== index))
        } else {
            const updatedExperiences = [...workExperiences]
            const userId = updatedExperiences[index]?.user_id
            if (userId) {
                setDeletedExperienceIds((prev) => [...prev, userId])
                try {
                    const response = axios.delete(
                        API_ROUTES.DELETE_WORK_EXPERIENCE + userId,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `${token}`,
                            },
                        },
                    )
                    if (response.data.status === 204) {
                        console.log('experience delete!')
                    }
                } catch (error) {
                    console.log('Something went wrong', error)
                }
            }
            setWorkExperiences(updatedExperiences.filter((_, i) => i !== index))
        }
    }

    useEffect(() => {
        if (data) {
            const updatedExperiences = data?.workExperience?.length
                ? data.workExperience.map((experience) => ({
                    ...initialWorkExperience, // Spread initial values
                    ...experience, // Override with fetched values
                }))
                : [initialWorkExperience] // If no data, reset to default

            setWorkExperiences(updatedExperiences)
        }
    }, [data])

    const userDetails = localStorage.getItem('user')
    const user = JSON.parse(userDetails)

    const currentYear = new Date().getFullYear()
    const years = Array.from({length: 30}, (_, i) => ({
        value: String(currentYear - i),
        name: String(currentYear - i),
    }))

    const [subSkills, setSubSkills] = useState([])
    const [subSkillsSecond, setSubSkillsSecond] = useState([])
    const [subSkillsThird, setSubSkillsThird] = useState([])

    const handleCoreSkillsChange = (coreSkills) => {
        const skillDataEntry = skillData.find(
            (skill) => skill.core_skills === coreSkills,
        )

        if (skillDataEntry && Array.isArray(skillDataEntry.sub_skills)) {
            const selectedSubSkills = skillDataEntry.sub_skills.map(
                (sub) => sub.sub_skill,
            )

            const validSubSkills = selectedSubSkills.filter(
                (subSkill) => typeof subSkill === 'string',
            )
            setSubSkills(validSubSkills)
        } else {
            setSubSkills([])
        }
    }

    const handleCoreSkillsChangeSecond = (coreSkills) => {
        const skillDataEntry = skillData.find(
            (skill) => skill.core_skills === coreSkills,
        )

        if (skillDataEntry && Array.isArray(skillDataEntry.sub_skills)) {
            const selectedSubSkills = skillDataEntry.sub_skills.map(
                (sub) => sub.sub_skill,
            )

            const validSubSkills = selectedSubSkills.filter(
                (subSkill) => typeof subSkill === 'string',
            )
            setSubSkillsSecond(validSubSkills)
        } else {
            setSubSkillsSecond([])
        }
    }

    const handleCoreSkillsChangeThird = (coreSkills) => {
        const skillDataEntry = skillData.find(
            (skill) => skill.core_skills === coreSkills,
        )

        if (skillDataEntry && Array.isArray(skillDataEntry.sub_skills)) {
            const selectedSubSkills = skillDataEntry.sub_skills.map(
                (sub) => sub.sub_skill,
            )

            const validSubSkills = selectedSubSkills.filter(
                (subSkill) => typeof subSkill === 'string',
            )
            setSubSkillsThird(validSubSkills)
        } else {
            setSubSkillsThird([])
        }
    }

    const [subIndustryOptions, setSubIndustryOptions] = useState([])
    useEffect(() => {
        if (data && data.workExperience) {
            data.workExperience.forEach((experience, index) => {
                const selected = industriesData.find(
                    (industry) => industry.name === experience.work_experience_industry,
                )

                const newSubIndustryOptions = selected
                    ? selected.subsector.map((sub) => ({
                        name: sub.name,
                        value: sub.name,
                    }))
                    : []

                setSubIndustryOptions((prev) => {
                    const updatedOptions = [...prev]
                    updatedOptions[index] = newSubIndustryOptions // Use the current index
                    return updatedOptions
                })
            })
        }
    }, [data])

    const handleSubIndustryChange = (e, index) => {
        const selected = industriesData.find(
            (industry) => industry.name === e.target.value,
        )

        const newSubIndustryOptions = selected
            ? selected.subsector.map((sub) => ({
                name: sub.name,
                value: sub.name,
            }))
            : []

        setSubIndustryOptions((prev) => {
            const updatedOptions = [...prev]
            updatedOptions[index] = newSubIndustryOptions // Set the sub-industry options for the specific index
            return updatedOptions
        })
    }

    const handleAddExperience = () => {
        setWorkExperiences([
            ...workExperiences,
            {
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
                },
                email: '',
            },
        ])
    }

    const handleChangeExperience = (index, field, value) => {
        const updatedExperiences = [...workExperiences]

        if (field.startsWith('accomplishments_id.')) {
            const accomplishmentField = field.split('.').pop()
            updatedExperiences[index].accomplishments_id[accomplishmentField] = value
        } else {
            updatedExperiences[index][field] = value
        }

        setWorkExperiences(updatedExperiences)

        // Trigger email and website validation if either of these fields change
        if (field === 'email' || field === 'work_experience_company_website') {
            validateEmailAndWebsite(index, updatedExperiences[index])
        }
    }

    const handleCheckboxChange = (e, index, setFieldValue) => {
        const isChecked = e.target.checked

        // Update the isCurrentlyWorking field in the state
        setFieldValue(`isCurrentlyWorking_${index}`, isChecked)

        // Update the workExperiences state
        setWorkExperiences((prevWorkExperiences) => {
            const updatedExperiences = [...prevWorkExperiences]
            const updatedExperience = {
                ...updatedExperiences[index],
                isCurrentlyWorking: isChecked,
                experience_end_date: isChecked
                    ? null
                    : updatedExperiences[index].experience_end_date, // Set to null if checked, else retain existing value
            }

            updatedExperiences[index] = updatedExperience
            return updatedExperiences
        })
    }

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.currentTarget.files[0]);
    };

    const handleSubmit = async (values) => {
        const formData = new FormData()
        // Append basic details
        formData.append('basicDetails[user_id]', user.id)
        formData.append('basicDetails[firstname]', values.firstname)
        formData.append('basicDetails[lastname]', values.lastname)
        if (values.profile_pic) {
            // formData.append('basicDetails[profile_pic]', values.profile_pic)
            formData.append('profile_pic', values.profile_pic)
        }
        formData.append('basicDetails[dob]', values.dob)
        formData.append('basicDetails[gender]', values.gender)
        formData.append('basicDetails[nationality]', values.nationality)
        formData.append('basicDetails[current_country]', values.current_country)
        formData.append('basicDetails[current_state]', values.current_state)
        formData.append('basicDetails[current_city]', values.current_city)
        formData.append('basicDetails[contact_no]', values.contact_no)
        formData.append('basicDetails[contact_email_id]', values.contact_email_id)
        formData.append(
            'basicDetails[job_preferred_location]',
            values.job_preferred_location,
        )
        if (values.video) {
            formData.append('video', values.video)
        }
        if (values.secondary_video) {
            formData.append('secondary_video', values.secondary_video)
        }

        // Append international education
        formData.append(
            'internationalEducation[level_of_education]',
            values.level_of_education,
        )
        formData.append(
            'internationalEducation[field_of_study]',
            values.field_of_study,
        )
        formData.append(
            'internationalEducation[year_of_graduation]',
            values.year_of_graduation,
        )

        // Append Canadian education
        formData.append(
            'canadianEducation[isCanadianEducation]',
            values.isCanadianEducation,
        )
        formData.append('canadianEducation[university]', values.university)
        formData.append('canadianEducation[city]', values.city)
        formData.append(
            'canadianEducation[level_of_education_canadian]',
            values.level_of_education_canadian,
        )
        formData.append(
            'canadianEducation[field_of_study_canadian]',
            values.field_of_study_canadian,
        )
        formData.append(
            'canadianEducation[year_of_completion]',
            values.year_of_completion,
        )
        formData.append('canadianEducation[gpa]', values.gpa)
        formData.append('coreSkillsWithSubSkills', JSON.stringify(values.coreSkills));

        values.coreSkills.forEach((coreSkill, coreIndex) => {
            if (!coreSkill.coreSkill) return;

            formData.append(`coreSkills[${coreIndex}][coreSkill]`, coreSkill.coreSkill);

            coreSkill.subSkills.forEach((subSkill, subIndex) => {
                if (!subSkill.subSkill) return;

                formData.append(
                    `coreSkills[${coreIndex}][subSkills][${subIndex}][subSkill]`,
                    subSkill.subSkill
                );

                if (subSkill.certificate) {
                    formData.append(
                        `certificate_core_${coreIndex}_sub_${subIndex}`,
                        subSkill.certificate
                    );
                }
            });
        });

        // Append work experience
        workExperiences.forEach((experience, index) => {
            // Accomplishments fields
            formData.append(
                `workExperience[${index}][accomplishment_1]`,
                experience.accomplishments_id.accomplishment_1,
            )
            formData.append(
                `workExperience[${index}][accomplishment_2]`,
                experience.accomplishments_id.accomplishment_2,
            )
            formData.append(
                `workExperience[${index}][accomplishment_3]`,
                experience.accomplishments_id.accomplishment_3,
            )
            formData.append(
                `workExperience[${index}][accomplishment_4]`,
                experience.accomplishments_id.accomplishment_4,
            )

            // Experience fields
            formData.append(`workExperience[${index}][email]`, experience.email)
            formData.append(
                `workExperience[${index}][work_experience_industry]`,
                experience.work_experience_industry,
            )
            formData.append(
                `workExperience[${index}][work_experience_sub_industry]`,
                experience.work_experience_sub_industry,
            )
            formData.append(
                `workExperience[${index}][work_experience_country]`,
                experience.work_experience_country,
            )
            formData.append(
                `workExperience[${index}][work_experience_job_title]`,
                experience.work_experience_job_title,
            )
            formData.append(
                `workExperience[${index}][work_experience_company_name]`,
                experience.work_experience_company_name,
            )
            formData.append(
                `workExperience[${index}][work_experience_company_website]`,
                experience.work_experience_company_website,
            )
            formData.append(
                `workExperience[${index}][experience_start_date]`,
                experience.experience_start_date,
            )
            formData.append(
                `workExperience[${index}][experience_end_date]`,
                experience.experience_end_date,
            )
            formData.append(
                `workExperience[${index}][isCurrentlyWorking]`,
                experience.isCurrentlyWorking,
            )
            formData.append(
                `workExperience[${index}][accomplishments]`,
                data ? experience?.accomplishments_id?._id : null,
            )
            formData.append(
                `workExperience[${index}][_id]`,
                data ? experience?._id : null,
            )
        })

        // Append career goal
        formData.append('careerGoal[career_industry]', values.career_industry)
        formData.append('careerGoal[career_field]', values.career_field)
        formData.append('careerGoal[noc_number]', values.noc_number)
        formData.append('careerGoal[noc]', values.noc)

        const experience = workExperiences[0]
        const isEmpty = Object.values(experience).every(
            (value) => value === '' || value === null,
        )

        if (isEmpty) {
            setExperienceError('Work experience fields are required.')
        } else {
            setExperienceError('')
            if (data) {
                try {
                    const response = await axios.put(
                        API_ROUTES.UPDATE_PROFILE + data.basicDetails?.user_id,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `${token}`,
                            },
                        },
                    )
                    if (response.data.status === 200) {
                        navigate(`${ROUTES_URL.PROFILE}/${user.id}`)
                    }
                } catch (error) {
                    alert('Something went wrong in update')
                }
            } else {
                console.log("come in insert=====")
                try {
                    const response = await axios.post(
                        API_ROUTES.CREATE_PROFILE,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `${token}`,
                            },
                        },
                    )
                    if (response.data.status === 201) {
                        navigate(`${ROUTES_URL.PROFILE}/${user.id}`)
                    }
                } catch (error) {
                    alert('Something went wrong in insert')
                }
            }
        }
    }

    const resetWorkExperiences = () => {
        setWorkExperiences([initialWorkExperience])
    }

    const [disabledButton, setDisabledButton] = useState(false)
    const validateEmailAndWebsite = (index, experience) => {
        const websiteDomain = getDomainFromUrl(
            experience.work_experience_company_website,
        )
        const emailDomain = getDomainFromEmail(experience.email)

        if (websiteDomain && emailDomain && websiteDomain !== emailDomain) {
            const errorMessage = 'Email domain must match the company website domain.'
            setWorkExperiences((prevWorkExperiences) => {
                const updatedWorkExperiences = [...prevWorkExperiences]
                updatedWorkExperiences[index].emailError = errorMessage
                return updatedWorkExperiences
            })
            setDisabledButton(true)
        } else {
            setWorkExperiences((prevWorkExperiences) => {
                const updatedWorkExperiences = [...prevWorkExperiences]
                updatedWorkExperiences[index].emailError = '' // Clear error message
                return updatedWorkExperiences
            })
            setDisabledButton(false)
        }
    }

    return (
        <Formik
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
                job_preferred_location:
                    data?.basicDetails?.job_preferred_location || '',

                level_of_education:
                    data?.internationalEducation?.level_of_education || '',
                field_of_study: data?.internationalEducation?.field_of_study || '',
                year_of_graduation:
                    data?.internationalEducation?.year_of_graduation || '',

                isCanadianEducation:
                    data?.canadianEducation?.isCanadianEducation || false,
                university: data?.canadianEducation?.university || '',
                city: data?.canadianEducation?.city || '',
                level_of_education_canadian:
                    data?.canadianEducation?.level_of_education_canadian || '',
                field_of_study_canadian:
                    data?.canadianEducation?.field_of_study_canadian || '',
                year_of_completion: data?.canadianEducation?.year_of_completion || '',
                gpa: data?.canadianEducation?.gpa || '',

                coreSkills: [
                    {
                        coreSkill: data?.skills[0]?.core_skill || "",
                        subSkills:
                            data?.skills[0]?.subSkill?.length > 0
                                ? data?.skills[0]?.subSkill?.map((data) => {
                                    // Declare variables inside the map
                                    const subSkill = data.sub_skills || "";   // Default empty string if sub_skills is missing
                                    const certificate = data.certificate || "";  // Default empty string if certificate is missing

                                    return {subSkill, certificate};  // Return the object with subSkill and certificate
                                })
                                : [{subSkill: '', certificate: ''}],
                    },
                    {
                        coreSkill: data?.skills[1]?.core_skill || "",
                        subSkills:
                            data?.skills[1]?.subSkill?.length > 0
                                ? data?.skills[1]?.subSkill?.map((data) => {
                                    // Declare variables inside the map
                                    const subSkill = data.sub_skills || "";   // Default empty string if sub_skills is missing
                                    const certificate = data.certificate || "";  // Default empty string if certificate is missing

                                    return {subSkill, certificate};  // Return the object with subSkill and certificate
                                })
                                : [{subSkill: '', certificate: ''}],
                    },
                    {
                        coreSkill: data?.skills[2]?.core_skill || "",
                        subSkills:
                            data?.skills[2]?.subSkill?.length > 0
                                ? data?.skills[2]?.subSkill?.map((data) => {
                                    // Declare variables inside the map
                                    const subSkill = data.sub_skills || "";   // Default empty string if sub_skills is missing
                                    const certificate = data.certificate || "";  // Default empty string if certificate is missing

                                    return {subSkill, certificate};  // Return the object with subSkill and certificate
                                })
                                : [{subSkill: '', certificate: ''}],
                    },
                ],

                accomplishment_1: data?.workExperience?.accomplishment_1 || '',
                accomplishment_2: data?.workExperience?.accomplishment_2 || '',
                accomplishment_3: data?.workExperience?.accomplishment_3 || '',
                accomplishment_4: data?.workExperience?.accomplishment_4 || '',

                work_experience_industry:
                    data?.workExperience?.work_experience_industry || '',
                work_experience_sub_industry:
                    data?.workExperience?.work_experience_sub_industry || '',
                work_experience_country:
                    data?.workExperience?.work_experience_country || '',
                work_experience_job_title:
                    data?.workExperience?.work_experience_job_title || '',
                work_experience_company_name:
                    data?.workExperience?.work_experience_company_name || '',
                work_experience_company_website:
                    data?.workExperience?.work_experience_company_website || '',
                // experience_start_date:
                //   data?.workExperience?.experience_start_date || null,
                // experience_end_date: data?.workExperience?.experience_end_date || null,
                isCurrentlyWorking: data?.workExperience?.isCurrentlyWorking || false,
                email: data?.workExperience?.email || '',

                video: data?.basicDetails?.video || '',
                secondary_video: data?.basicDetails?.secondary_video || '',

                career_industry: data?.careerGoal?.career_industry || '',
                career_field: data?.careerGoal?.career_field || '',
                noc_number: data?.careerGoal?.noc_number || '',
                noc: data?.careerGoal?.noc || '',
            }}
            validationSchema={jobFormValidation}
            onSubmit={handleSubmit}
        >
            {({handleReset, isSubmitting, setFieldValue, values, errors}) => {
                return (
                    <Form>
                        {/* ------------------Personal Information--------------- */}
                        <FormInfo title="Personal Information" icon={<UserInfo/>}>
                            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                                <TextField
                                    type="text"
                                    label="firstname"
                                    name="firstname"
                                    placeholder="Enter first name"
                                    onChange={(e) => setFieldValue('firstname', e.target.value)}
                                />
                                <TextField
                                    type="text"
                                    label="lastname"
                                    name="lastname"
                                    placeholder="Enter last name"
                                    onChange={(e) => setFieldValue('lastname', e.target.value)}
                                />

                                <div className="mb-4">
                                    <Label label="Profile"/>
                                    <Field name="profile_pic">
                                        {({field}) => (
                                            <div className="flex flex-col">
                                                <input
                                                    type="file"
                                                    id="profile_pic"
                                                    className="hidden"
                                                    onChange={(event) => {
                                                        const file = event.currentTarget.files[0]
                                                        if (file) {
                                                            const validTypes = [
                                                                'image/jpeg',
                                                                'image/png',
                                                                'image/jpg',
                                                            ]
                                                            if (validTypes.includes(file.type)) {
                                                                setFieldValue('profile_pic', file)
                                                                setImgError('') // Clear error
                                                            } else {
                                                                setImgError(
                                                                    'Invalid file type. Please select a jpeg, JPG or PNG file.',
                                                                )
                                                            }
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="profile_pic"
                                                    className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full cursor-pointer"
                                                >
                          <span className="px-2 py-1 border border-primary rounded bg-primary-100">
                            Choose file
                          </span>{' '}
                                                    {data
                                                        ? values?.profile_pic?.name ||
                                                        data?.basicDetails?.profile_pic?.split('\\')[2]
                                                        : values?.profile_pic?.name || 'No file chosen'}
                                                </label>
                                                {/* Displaying error message */}
                                                {imgError && (
                                                    <div className="text-xs text-red-500 ml-1 mt-1">
                                                        {imgError}
                                                    </div>
                                                )}
                                                {imgError === '' && (
                                                    <ErrorMessage
                                                        name="profile_pic"
                                                        component="div"
                                                        className="text-xs text-red-500 ml-1 mt-1"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                </div>

                                <DateField
                                    label="Date of Birth"
                                    name="dob"
                                    icon={<Calender/>}
                                />

                                <RadioGroup
                                    name="gender"
                                    label="Gender"
                                    options={[
                                        {value: 'male', label: 'Male'},
                                        {value: 'female', label: 'Female'},
                                        {value: 'other', label: 'Other'},
                                    ]}
                                />

                                <DropDown
                                    label="Nationality"
                                    name="nationality"
                                    options={countryData}
                                    value={data?.basicDetails?.nationality || 'Canada'}
                                    onChange={(e) => setFieldValue('nationality', e.target.value)}
                                />

                                <DropDown
                                    label="Country"
                                    name="current_country"
                                    options={countryDataBasic}
                                    value={getCountryNameByValue(defaultCurrentCountry)} // Show name
                                    onChange={(e) => handleChangeCountry(e, setFieldValue)}
                                />

                                <DropDown
                                    label="Current State"
                                    name="current_state"
                                    options={stateOptions}
                                    value={getStateNameByValue(
                                        data?.basicDetails?.current_state || '',
                                    )}
                                    onChange={(e) => handleChangeState(e, setFieldValue, values)}
                                />

                                <DropDownInput
                                    label="Current City"
                                    name="current_city"
                                    options={cityOptions}
                                    value={data?.basicDetails?.current_city || ''} // Assuming city names are used
                                    onChange={(e) =>
                                        setFieldValue('current_city', e.target.value, values)
                                    }
                                />

                                <div className="mb-4">
                                    <Label label="Contact No"/>
                                    <div className="mt-1">
                                        <PhoneInput
                                            name="contact_no"
                                            value={values.contact_no}
                                            onChange={(value) => setFieldValue('contact_no', value)}
                                            placeholder="+1 250-555-0199"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name={'contact_no'}
                                        component="div"
                                        className="text-xs text-red-500 ml-1 mt-1"
                                    />
                                </div>

                                <TextField
                                    type="text"
                                    label="Contact email Id"
                                    name="contact_email_id"
                                    placeholder="Enter contact email Id"
                                    onChange={(e) =>
                                        setFieldValue('contact_email_id', e.target.value)
                                    }
                                />

                                <DropDownInput
                                    label="Job preferred location"
                                    name="job_preferred_location"
                                    options={provinceData}
                                    value={data?.basicDetails?.job_preferred_location}
                                    onChange={(e) =>
                                        setFieldValue('job_preferred_location', e.target.value)
                                    }
                                    allowCustom={true}
                                />

                                {/* <DropDownInput
                  label="Job preferred location"
                  name="job_preferred_location"
                  options={provinceData}
                  value={data?.basicDetails?.job_preferred_location}
                  onChange={(e) =>
                    setFieldValue('job_preferred_location', e.target.value)
                  }
                /> */}
                            </div>
                        </FormInfo>

                        {/* ------------------International Education--------------- */}
                        <FormInfo title="Global Education" icon={<GlobalEducation/>}>
                            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                                <DropDownInput
                                    label="Level of Education"
                                    name="level_of_education"
                                    options={levelOfEducation}
                                    value={data?.internationalEducation?.level_of_education || ''}
                                    onChange={(e) =>
                                        setFieldValue('level_of_education', e.target.value)
                                    }
                                />
                                <DropDownInput
                                    label="Field of Study"
                                    name="field_of_study"
                                    options={fieldOfStudy}
                                    value={data?.internationalEducation?.field_of_study || ''}
                                    onChange={(e) =>
                                        setFieldValue('field_of_study', e.target.value)
                                    }
                                />
                                <DropDownInput
                                    label="Year of Graduation"
                                    name="year_of_graduation"
                                    options={years}
                                    value={data?.internationalEducation?.year_of_graduation || ''}
                                    onChange={(e) =>
                                        setFieldValue('year_of_graduation', e.target.value)
                                    }
                                />
                            </div>
                        </FormInfo>

                        {/* ------------------Canadian Education--------------- */}
                        <FormInfo
                            title="Canadian Education"
                            icon={<CanadianEducation/>}
                            renderRight={true}
                            renderRightContent={
                                <ToggleButton
                                    label=""
                                    name="isCanadianEducation"
                                    onChange={(e) =>
                                        setFieldValue('isCanadianEducation', e.target.checked)
                                    }
                                />
                            }
                        >
                            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                                <DropDownInput
                                    label="College/University"
                                    name="university"
                                    disabled={!values.isCanadianEducation}
                                    options={universityData?.map((data) => ({
                                        name: data.name,
                                        value: data.name,
                                    }))}
                                    value={data?.canadianEducation?.university || ''}
                                    onChange={(e) => setFieldValue('university', e.target.value)}
                                />
                                <DropDownInput
                                    label="City"
                                    name="city"
                                    options={currentCity}
                                    disabled={!values.isCanadianEducation}
                                    value={data?.canadianEducation?.city || ''}
                                    onChange={(e) => setFieldValue('city', e.target.value)}
                                />
                                <DropDownInput
                                    label="Level of Education"
                                    name="level_of_education_canadian"
                                    options={levelOfEducation}
                                    disabled={!values.isCanadianEducation}
                                    value={
                                        data?.canadianEducation?.level_of_education_canadian || ''
                                    }
                                    onChange={(e) =>
                                        setFieldValue('level_of_education_canadian', e.target.value)
                                    }
                                />
                                <DropDownInput
                                    label="Field of Study"
                                    name="field_of_study_canadian"
                                    disabled={!values.isCanadianEducation}
                                    options={fieldOfStudyCanadian}
                                    value={data?.canadianEducation?.field_of_study_canadian || ''}
                                    onChange={(e) =>
                                        setFieldValue('field_of_study_canadian', e.target.value)
                                    }
                                />
                                <DropDownInput
                                    label="Year of completion"
                                    name="year_of_completion"
                                    disabled={!values.isCanadianEducation}
                                    options={years}
                                    value={data?.canadianEducation?.year_of_completion || ''}
                                    onChange={(e) =>
                                        setFieldValue('year_of_completion', e.target.value)
                                    }
                                />
                                <TextField
                                    type="text"
                                    label="GPA"
                                    name="gpa"
                                    placeholder="10"
                                    disabled={!values.isCanadianEducation}
                                    onChange={(e) => setFieldValue('gpa', e.target.value)}
                                />
                            </div>
                        </FormInfo>

                        {/* -------------Skills------------- */}
                        <FormInfo title="Skills" icon={<Skills/>}>
                            <div className="py-6 px-4">
                                <FieldArray name="coreSkills">
                                    {({push, remove}) => (
                                        <div>
                                            {values.coreSkills.map((coreSkill, coreIndex) => (
                                                <div key={coreIndex} className="mt-5">
                                                    {/* Core Skill Dropdown */}
                                                    <DropDown
                                                        label="Core Skills"
                                                        name={`coreSkills[${coreIndex}].coreSkill`}
                                                        value={coreSkill.coreSkill || ''}
                                                        options={skillData?.map((skill) => ({
                                                            name: skill.core_skills,
                                                            value: skill.core_skills,
                                                        }))}
                                                        onChange={(e) => {
                                                            const selectedSkill = e.target.value;
                                                            setFieldValue(`coreSkills[${coreIndex}].coreSkill`, selectedSkill);
                                                            setFieldValue(`coreSkills[${coreIndex}].subSkills`, []); // Reset subSkills when core skill changes
                                                            handleCoreSkillsChange(selectedSkill); // Handle selection change
                                                        }}
                                                    />

                                                    {/* Display Subskills for the selected Core Skill */}
                                                    {coreSkill.coreSkill && (
                                                        <div>
                                                            {/* Find the selected core skill object from skillData */}
                                                            {skillData
                                                                ?.filter((skill) => skill.core_skills === coreSkill.coreSkill)
                                                                .map((filteredSkill) => (
                                                                    <div key={filteredSkill.core_skills}>
                                                                        {/* Render each subskill for the selected core skill */}
                                                                        <div className="w-full">
                                                                            <Label label="Sub Skills"/>
                                                                            {/* Multiselect for Subskills */}
                                                                            <Multiselect
                                                                                options={filteredSkill.sub_skills.map((sub) => ({
                                                                                    name: sub.sub_skill,
                                                                                    id: sub.sub_skill,
                                                                                }))}
                                                                                selectedValues={coreSkill.subSkills?.map((skill) => ({
                                                                                    name: skill.subSkill,
                                                                                    id: skill.subSkill,
                                                                                }))}
                                                                                onSelect={(selectedList) => {
                                                                                    // Store selected subskills as array of objects
                                                                                    const updatedSubSkills = selectedList.map(item => ({
                                                                                        subSkill: item.name,
                                                                                        certificate: null, // Initialize the certificate to null (no file uploaded yet)
                                                                                    }));
                                                                                    setFieldValue(
                                                                                        `coreSkills[${coreIndex}].subSkills`,
                                                                                        updatedSubSkills
                                                                                    );
                                                                                }}
                                                                                onRemove={(selectedList) => {
                                                                                    // Create a new array that includes only the subskills that are not in the selectedList
                                                                                    const updatedSubSkills = coreSkill.subSkills.filter((subSkill) => {
                                                                                        // If the subSkill's name is in selectedList, remove it, otherwise keep it
                                                                                        return !selectedList.some(item => item.name === subSkill.subSkill);
                                                                                    });
                                                                                    // Update Formik's state with the modified subSkills array
                                                                                    setFieldValue(
                                                                                        `coreSkills[${coreIndex}].subSkills`,
                                                                                        updatedSubSkills
                                                                                    );
                                                                                }}

                                                                                displayValue="name"
                                                                                name={`coreSkills[${coreIndex}].subSkills`}
                                                                            />
                                                                            <span className="text-xs text-green-700">
                                        * If your skill is not listed, please email skill and subskill @ team@zeroed.ca
                                      </span>
                                                                            <ErrorMessage
                                                                                name={`coreSkills[${coreIndex}].subSkills`}
                                                                                component="div"
                                                                                className="text-xs text-red-500 ml-1 mt-1"
                                                                            />
                                                                        </div>

                                                                        {/* File Upload for Subskill Certificate */}
                                                                        {coreSkill.subSkills?.map((subSkill, subIndex) => (
                                                                            <div key={subIndex} className="mt-3">
                                                                                {/* Display a file upload input only for selected subskills */}
                                                                                {filteredSkill.sub_skills
                                                                                    ?.filter((sub) => sub.sub_skill === subSkill.subSkill) // Check if this subskill is selected
                                                                                    .map((sub) => (
                                                                                        <div key={sub.sub_skill}>
                                                                                            <div className="mb-2">
                                                                                                <Label
                                                                                                    label={`Upload Certificate for ${sub.sub_skill}`}/>
                                                                                            </div>
                                                                                            <input
                                                                                                type="file"
                                                                                                id={`coreSkills[${coreIndex}].subSkills[${subIndex}].certificate`}
                                                                                                name={`coreSkills[${coreIndex}].subSkills[${subIndex}].certificate`}
                                                                                                onChange={(event) => {
                                                                                                    const file = event.currentTarget.files[0]; // Get the selected file
                                                                                                    if (file) {
                                                                                                        const updatedSubSkills = [...coreSkill.subSkills];

                                                                                                        updatedSubSkills[subIndex] = {
                                                                                                            ...updatedSubSkills[subIndex],
                                                                                                            certificate: file, // Update only the specific subskill's certificate
                                                                                                        };
                                                                                                        setFieldValue(`coreSkills[${coreIndex}].subSkills`, updatedSubSkills);
                                                                                                    }
                                                                                                }}
                                                                                            />

                                                                                            {/* If a certificate is uploaded, display file name or image preview */}
                                                                                            {subSkill.certificate && (
                                                                                                <div>
                                                                                                    <p>Uploaded
                                                                                                        Certificate: {subSkill.certificate}</p>

                                                                                                    {/* Check if the certificate is an image and is still a File object (i.e., before upload) */}
                                                                                                    {/* {console.log("image :", subSkill.certificate instanceof File , "index:", i ,subSkill?.certificate?.type?.startsWith("image/"))} */}
                                                                                                    {subSkill.certificate.startsWith('uploads/') ? (
                                                                                                        // Show image from the uploaded URL after processing
                                                                                                        <img
                                                                                                            src={`${process.env.REACT_APP_FILE_URL}/${subSkill.certificate}`} // Using the processed URL
                                                                                                            alt="Certificate Preview"
                                                                                                            style={{
                                                                                                                width: 100,
                                                                                                                height: 100
                                                                                                            }}
                                                                                                        />             import React, {useEffect, useState} from 'react'
                                                                                                        import {ErrorMessage, Field, FieldArray, Form, Formik} from 'formik'
                                                                                                        import {
                                                                                                        Checkbox,
                                                                                                        DateField,
                                                                                                        DropDown,
                                                                                                        DropDownInput,
                                                                                                        RadioGroup,
                                                                                                        TextArea,
                                                                                                        TextField,
                                                                                                        TextFieldValue,
                                                                                                        ToggleButton,
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
                                                                                                        Calender,
                                                                                                        CanadianEducation,
                                                                                                        CareerGoal,
                                                                                                        DeleteIcon,
                                                                                                        GlobalEducation,
                                                                                                        Loader,
                                                                                                        Skills,
                                                                                                        UserInfo,
                                                                                                        WorkExperience,
                                                                                                    } from '../../common/Icons'
                                                                                                        import {ExperienceDateFormat} from '../../utils/dateFormat'
                                                                                                        import FormInfo from '../../common/Information/formInfo'
                                                                                                        import Label from '../../component/InputField/label'

                                                                                                        const getDomainFromUrl = (url) => {
                                                                                                        try {
                                                                                                        // Remove protocol (http:// or https://) and "www."
                                                                                                        const domain = new URL(url).hostname.replace(/^www\./, '').toLowerCase()
                                                                                                        return domain
                                                                                                    } catch (error) {
                                                                                                        return '' // Return empty string if URL is invalid
                                                                                                    }
                                                                                                    }

                                                                                                        const getDomainFromEmail = (email) => {
                                                                                                        if (!email || !email.includes('@')) {
                                                                                                        return '' // Return an empty string if invalid
                                                                                                    }

                                                                                                        const emailParts = email.split('@')
                                                                                                        if (emailParts.length < 2) {
                                                                                                        return '' // Return empty if '@' doesn't divide into two parts
                                                                                                    }

                                                                                                        const emailDomain = emailParts[1].toLowerCase()
                                                                                                        return emailDomain // Return the domain
                                                                                                    }

                                                                                                        function Information({data}) {
                                                                                                        let navigate = useNavigate()
                                                                                                        const token = localStorage.getItem('token')

                                                                                                        const [stateOptions, setStateOptions] = useState([])
                                                                                                        const [cityOptions, setCityOptions] = useState([])
                                                                                                        const [experienceError, setExperienceError] = useState('')
                                                                                                        const [imgError, setImgError] = useState('')
                                                                                                        const [imgErrorSkill, setImgErrorSkill] = useState('')
                                                                                                        const [imgErrorSkillSecond, setImgErrorSkillSecond] = useState('')
                                                                                                        const [imgErrorSkillThird, setImgErrorSkillThird] = useState('')

                                                                                                        const [imagePreviewCore, setImagePreviewCore] = useState(null)
                                                                                                        const [imagePreviewSecond, setImagePreviewSecond] = useState(null)
                                                                                                        const [imagePreviewThird, setImagePreviewThird] = useState(null)

                                                                                                        // Get countries for the country dropdown
                                                                                                        const countryData = Country.getAllCountries().map((country) => ({
                                                                                                        value: country.name,
                                                                                                        name: country.name,
                                                                                                    }))

                                                                                                        const countryDataBasic = Country.getAllCountries().map((country) => ({
                                                                                                        value: country.isoCode,
                                                                                                        name: country.name,
                                                                                                    }))

                                                                                                        const defaultCurrentCountry = data?.basicDetails?.current_country || 'CA'

                                                                                                        useEffect(() => {
                                                                                                        if (data?.basicDetails) {
                                                                                                        const states = State.getStatesOfCountry(data.basicDetails.current_country)
                                                                                                        setStateOptions(
                                                                                                        states.map((state) => ({
                                                                                                        value: state.isoCode, // Use state ISO code as value
                                                                                                        name: state.name, // Use state name for display
                                                                                                    })),
                                                                                                        )

                                                                                                        // Check if current state is set
                                                                                                        if (data.basicDetails.current_state) {
                                                                                                        const cities = City.getCitiesOfState(
                                                                                                        data.basicDetails.current_country,
                                                                                                        data.basicDetails.current_state,
                                                                                                        )
                                                                                                        setCityOptions(
                                                                                                        cities.map((city) => ({
                                                                                                        value: city.name, // You can also set city code if available
                                                                                                        name: city.name,
                                                                                                    })),
                                                                                                        )
                                                                                                    } else {
                                                                                                        setCityOptions([])
                                                                                                    }
                                                                                                    } else {
                                                                                                        const states = State.getStatesOfCountry('CA') // Default to CA
                                                                                                        setStateOptions(
                                                                                                        states.map((state) => ({
                                                                                                        value: state.isoCode,
                                                                                                        name: state.name,
                                                                                                    })),
                                                                                                        )
                                                                                                    }
                                                                                                    }, [data])

                                                                                                        const handleChangeCountry = (e, setFieldValue) => {
                                                                                                        const current_country = e.target.value
                                                                                                        setFieldValue('current_country', current_country)
                                                                                                        setFieldValue('current_state', '')
                                                                                                        setFieldValue('current_city', '')

                                                                                                        if (current_country) {
                                                                                                        const states = State.getStatesOfCountry(current_country)
                                                                                                        setStateOptions(
                                                                                                        states.map((state) => ({
                                                                                                        value: state.isoCode,
                                                                                                        name: state.name,
                                                                                                    })),
                                                                                                        )

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
                                                                                                        const cities = City.getCitiesOfState(
                                                                                                        values?.current_country,
                                                                                                        current_state,
                                                                                                        )
                                                                                                        setCityOptions(
                                                                                                        cities.map((city) => ({
                                                                                                        value: city.name,
                                                                                                        name: city.name,
                                                                                                    })),
                                                                                                        )
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
                                                                                                        emailError: '',
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
                                                                                                    },
                                                                                                        email: '',
                                                                                                    }
                                                                                                        const [workExperiences, setWorkExperiences] = useState([
                                                                                                        initialWorkExperience,
                                                                                                        ])

                                                                                                        const [deletedExperienceIds, setDeletedExperienceIds] = useState([])

                                                                                                        const handleDeleteExperience = (index) => {
                                                                                                        if (!data) {
                                                                                                        setWorkExperiences((prev) => prev.filter((_, i) => i !== index))
                                                                                                    } else {
                                                                                                        const updatedExperiences = [...workExperiences]
                                                                                                        const userId = updatedExperiences[index]?.user_id
                                                                                                        if (userId) {
                                                                                                        setDeletedExperienceIds((prev) => [...prev, userId])
                                                                                                        try {
                                                                                                        const response = axios.delete(
                                                                                                        API_ROUTES.DELETE_WORK_EXPERIENCE + userId,
                                                                                                    {
                                                                                                        headers: {
                                                                                                        'Content-Type': 'multipart/form-data',
                                                                                                        Authorization: `${token}`,
                                                                                                    },
                                                                                                    },
                                                                                                        )
                                                                                                        if (response.data.status === 204) {
                                                                                                        console.log('experience delete!')
                                                                                                    }
                                                                                                    } catch (error) {
                                                                                                        console.log('Something went wrong', error)
                                                                                                    }
                                                                                                    }
                                                                                                        setWorkExperiences(updatedExperiences.filter((_, i) => i !== index))
                                                                                                    }
                                                                                                    }

                                                                                                        useEffect(() => {
                                                                                                        if (data) {
                                                                                                        const updatedExperiences = data?.workExperience?.length
                                                                                                        ? data.workExperience.map((experience) => ({
                                                                                                        ...initialWorkExperience, // Spread initial values
                                                                                                        ...experience, // Override with fetched values
                                                                                                    }))
                                                                                                        : [initialWorkExperience] // If no data, reset to default

                                                                                                        setWorkExperiences(updatedExperiences)
                                                                                                    }
                                                                                                    }, [data])

                                                                                                        const userDetails = localStorage.getItem('user')
                                                                                                        const user = JSON.parse(userDetails)

                                                                                                        const currentYear = new Date().getFullYear()
                                                                                                        const years = Array.from({length: 30}, (_, i) => ({
                                                                                                        value: String(currentYear - i),
                                                                                                        name: String(currentYear - i),
                                                                                                    }))

                                                                                                        const [subIndustryOptions, setSubIndustryOptions] = useState([])
                                                                                                        useEffect(() => {
                                                                                                        if (data && data.workExperience) {
                                                                                                        data.workExperience.forEach((experience, index) => {
                                                                                                        const selected = industriesData.find(
                                                                                                        (industry) => industry.name === experience.work_experience_industry,
                                                                                                        )

                                                                                                        const newSubIndustryOptions = selected
                                                                                                        ? selected.subsector.map((sub) => ({
                                                                                                        name: sub.name,
                                                                                                        value: sub.name,
                                                                                                    }))
                                                                                                        : []

                                                                                                        setSubIndustryOptions((prev) => {
                                                                                                        const updatedOptions = [...prev]
                                                                                                        updatedOptions[index] = newSubIndustryOptions // Use the current index
                                                                                                        return updatedOptions
                                                                                                    })
                                                                                                    })
                                                                                                    }
                                                                                                    }, [data])

                                                                                                        const handleSubIndustryChange = (e, index) => {
                                                                                                        const selected = industriesData.find(
                                                                                                        (industry) => industry.name === e.target.value,
                                                                                                        )

                                                                                                        const newSubIndustryOptions = selected
                                                                                                        ? selected.subsector.map((sub) => ({
                                                                                                        name: sub.name,
                                                                                                        value: sub.name,
                                                                                                    }))
                                                                                                        : []

                                                                                                        setSubIndustryOptions((prev) => {
                                                                                                        const updatedOptions = [...prev]
                                                                                                        updatedOptions[index] = newSubIndustryOptions // Set the sub-industry options for the specific index
                                                                                                        return updatedOptions
                                                                                                    })
                                                                                                    }

                                                                                                        const handleAddExperience = () => {
                                                                                                        setWorkExperiences([
                                                                                                        ...workExperiences,
                                                                                                    {
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
                                                                                                    },
                                                                                                        email: '',
                                                                                                    },
                                                                                                        ])
                                                                                                    }

                                                                                                        const handleChangeExperience = (index, field, value) => {
                                                                                                        const updatedExperiences = [...workExperiences]

                                                                                                        if (field.startsWith('accomplishments_id.')) {
                                                                                                        const accomplishmentField = field.split('.').pop()
                                                                                                        updatedExperiences[index].accomplishments_id[accomplishmentField] = value
                                                                                                    } else {
                                                                                                        updatedExperiences[index][field] = value
                                                                                                    }

                                                                                                        setWorkExperiences(updatedExperiences)

                                                                                                        // Trigger email and website validation if either of these fields change
                                                                                                        if (field === 'email' || field === 'work_experience_company_website') {
                                                                                                        validateEmailAndWebsite(index, updatedExperiences[index])
                                                                                                    }
                                                                                                    }

                                                                                                        const handleSubmit = async (values) => {
                                                                                                        const formData = new FormData()
                                                                                                        // Append basic details
                                                                                                        formData.append('basicDetails[user_id]', user.id)
                                                                                                        formData.append('basicDetails[firstname]', values.firstname)
                                                                                                        formData.append('basicDetails[lastname]', values.lastname)
                                                                                                        if (values.profile_pic) {
                                                                                                        // formData.append('basicDetails[profile_pic]', values.profile_pic)
                                                                                                        formData.append('profile_pic', values.profile_pic)
                                                                                                    }
                                                                                                        formData.append('basicDetails[dob]', values.dob)
                                                                                                        formData.append('basicDetails[gender]', values.gender)
                                                                                                        formData.append('basicDetails[nationality]', values.nationality)
                                                                                                        formData.append('basicDetails[current_country]', values.current_country)
                                                                                                        formData.append('basicDetails[current_state]', values.current_state)
                                                                                                        formData.append('basicDetails[current_city]', values.current_city)
                                                                                                        formData.append('basicDetails[contact_no]', values.contact_no)
                                                                                                        formData.append('basicDetails[contact_email_id]', values.contact_email_id)
                                                                                                        formData.append(
                                                                                                        'basicDetails[job_preferred_location]',
                                                                                                        values.job_preferred_location,
                                                                                                        )
                                                                                                        if (values.video) {
                                                                                                        formData.append('video', values.video)
                                                                                                    }
                                                                                                        if (values.secondary_video) {
                                                                                                        formData.append('secondary_video', values.secondary_video)
                                                                                                    }

                                                                                                        // Append international education
                                                                                                        formData.append(
                                                                                                        'internationalEducation[level_of_education]',
                                                                                                        values.level_of_education,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        'internationalEducation[field_of_study]',
                                                                                                        values.field_of_study,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        'internationalEducation[year_of_graduation]',
                                                                                                        values.year_of_graduation,
                                                                                                        )

                                                                                                        // Append Canadian education
                                                                                                        formData.append(
                                                                                                        'canadianEducation[isCanadianEducation]',
                                                                                                        values.isCanadianEducation,
                                                                                                        )
                                                                                                        formData.append('canadianEducation[university]', values.university)
                                                                                                        formData.append('canadianEducation[city]', values.city)
                                                                                                        formData.append(
                                                                                                        'canadianEducation[level_of_education_canadian]',
                                                                                                        values.level_of_education_canadian,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        'canadianEducation[field_of_study_canadian]',
                                                                                                        values.field_of_study_canadian,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        'canadianEducation[year_of_completion]',
                                                                                                        values.year_of_completion,
                                                                                                        )
                                                                                                        formData.append('canadianEducation[gpa]', values.gpa)
                                                                                                        formData.append('coreSkillsWithSubSkills', JSON.stringify(values.coreSkills));

                                                                                                        values.coreSkills.forEach((coreSkill, coreIndex) => {
                                                                                                        if (!coreSkill.coreSkill) return;

                                                                                                        formData.append(`coreSkills[${coreIndex}][coreSkill]`, coreSkill.coreSkill);

                                                                                                        coreSkill.subSkills.forEach((subSkill, subIndex) => {
                                                                                                        if (!subSkill.subSkill) return;

                                                                                                        formData.append(
                                                                                                        `coreSkills[${coreIndex}][subSkills][${subIndex}][subSkill]`,
                                                                                                        subSkill.subSkill
                                                                                                        );

                                                                                                        if (subSkill.certificate) {
                                                                                                        formData.append(
                                                                                                        `certificate_core_${coreIndex}_sub_${subIndex}`,
                                                                                                        subSkill.certificate
                                                                                                        );
                                                                                                    }
                                                                                                    });
                                                                                                    });

                                                                                                        // Append work experience
                                                                                                        workExperiences.forEach((experience, index) => {
                                                                                                        // Accomplishments fields
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][accomplishment_1]`,
                                                                                                        experience.accomplishments_id.accomplishment_1,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][accomplishment_2]`,
                                                                                                        experience.accomplishments_id.accomplishment_2,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][accomplishment_3]`,
                                                                                                        experience.accomplishments_id.accomplishment_3,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][accomplishment_4]`,
                                                                                                        experience.accomplishments_id.accomplishment_4,
                                                                                                        )

                                                                                                        // Experience fields
                                                                                                        formData.append(`workExperience[${index}][email]`, experience.email)
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][work_experience_industry]`,
                                                                                                        experience.work_experience_industry,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][work_experience_sub_industry]`,
                                                                                                        experience.work_experience_sub_industry,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][work_experience_country]`,
                                                                                                        experience.work_experience_country,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][work_experience_job_title]`,
                                                                                                        experience.work_experience_job_title,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][work_experience_company_name]`,
                                                                                                        experience.work_experience_company_name,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][work_experience_company_website]`,
                                                                                                        experience.work_experience_company_website,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][experience_start_date]`,
                                                                                                        experience.experience_start_date,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][experience_end_date]`,
                                                                                                        experience.experience_end_date,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][isCurrentlyWorking]`,
                                                                                                        experience.isCurrentlyWorking,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][accomplishments]`,
                                                                                                        data ? experience?.accomplishments_id?._id : null,
                                                                                                        )
                                                                                                        formData.append(
                                                                                                        `workExperience[${index}][_id]`,
                                                                                                        data ? experience?._id : null,
                                                                                                        )
                                                                                                    })

                                                                                                        // Append career goal
                                                                                                        formData.append('careerGoal[career_industry]', values.career_industry)
                                                                                                        formData.append('careerGoal[career_field]', values.career_field)
                                                                                                        formData.append('careerGoal[noc_number]', values.noc_number)
                                                                                                        formData.append('careerGoal[noc]', values.noc)

                                                                                                        const experience = workExperiences[0]
                                                                                                        const isEmpty = Object.values(experience).every(
                                                                                                        (value) => value === '' || value === null,
                                                                                                        )

                                                                                                        if (isEmpty) {
                                                                                                        setExperienceError('Work experience fields are required.')
                                                                                                    } else {
                                                                                                        setExperienceError('')
                                                                                                        if (data) {
                                                                                                        try {
                                                                                                        const response = await axios.put(
                                                                                                        API_ROUTES.UPDATE_PROFILE + data.basicDetails?.user_id,
                                                                                                        formData,
                                                                                                    {
                                                                                                        headers: {
                                                                                                        'Content-Type': 'multipart/form-data',
                                                                                                        Authorization: `${token}`,
                                                                                                    },
                                                                                                    },
                                                                                                        )
                                                                                                        if (response.data.status === 200) {
                                                                                                        navigate(`${ROUTES_URL.PROFILE}/${user.id}`)
                                                                                                    }
                                                                                                    } catch (error) {
                                                                                                        alert('Something went wrong in update')
                                                                                                    }
                                                                                                    } else {
                                                                                                        try {
                                                                                                        const response = await axios.post(
                                                                                                        API_ROUTES.CREATE_PROFILE,
                                                                                                        formData,
                                                                                                    {
                                                                                                        headers: {
                                                                                                        'Content-Type': 'multipart/form-data',
                                                                                                        Authorization: `${token}`,
                                                                                                    },
                                                                                                    },
                                                                                                        )
                                                                                                        if (response.data.status === 201) {
                                                                                                        navigate(`${ROUTES_URL.PROFILE}/${user.id}`)
                                                                                                    }
                                                                                                    } catch (error) {
                                                                                                        alert('Something went wrong in insert')
                                                                                                    }
                                                                                                    }
                                                                                                    }
                                                                                                    }

                                                                                                        const resetWorkExperiences = () => {
                                                                                                        setWorkExperiences([initialWorkExperience])
                                                                                                    }

                                                                                                        const [disabledButton, setDisabledButton] = useState(false)
                                                                                                        const validateEmailAndWebsite = (index, experience) => {
                                                                                                        const websiteDomain = getDomainFromUrl(
                                                                                                        experience.work_experience_company_website,
                                                                                                        )
                                                                                                        const emailDomain = getDomainFromEmail(experience.email)

                                                                                                        if (websiteDomain && emailDomain && websiteDomain !== emailDomain) {
                                                                                                        const errorMessage = 'Email domain must match the company website domain.'
                                                                                                        setWorkExperiences((prevWorkExperiences) => {
                                                                                                        const updatedWorkExperiences = [...prevWorkExperiences]
                                                                                                        updatedWorkExperiences[index].emailError = errorMessage
                                                                                                        return updatedWorkExperiences
                                                                                                    })
                                                                                                        setDisabledButton(true)
                                                                                                    } else {
                                                                                                        setWorkExperiences((prevWorkExperiences) => {
                                                                                                        const updatedWorkExperiences = [...prevWorkExperiences]
                                                                                                        updatedWorkExperiences[index].emailError = '' // Clear error message
                                                                                                        return updatedWorkExperiences
                                                                                                    })
                                                                                                        setDisabledButton(false)
                                                                                                    }
                                                                                                    }

                                                                                                        return (
                                                                                                        <Formik
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
                                                                                                        job_preferred_location:
                                                                                                        data?.basicDetails?.job_preferred_location || '',

                                                                                                        level_of_education:
                                                                                                        data?.internationalEducation?.level_of_education || '',
                                                                                                        field_of_study: data?.internationalEducation?.field_of_study || '',
                                                                                                        year_of_graduation:
                                                                                                        data?.internationalEducation?.year_of_graduation || '',

                                                                                                        isCanadianEducation:
                                                                                                        data?.canadianEducation?.isCanadianEducation || false,
                                                                                                        university: data?.canadianEducation?.university || '',
                                                                                                        city: data?.canadianEducation?.city || '',
                                                                                                        level_of_education_canadian:
                                                                                                        data?.canadianEducation?.level_of_education_canadian || '',
                                                                                                        field_of_study_canadian:
                                                                                                        data?.canadianEducation?.field_of_study_canadian || '',
                                                                                                        year_of_completion: data?.canadianEducation?.year_of_completion || '',
                                                                                                        gpa: data?.canadianEducation?.gpa || '',

                                                                                                        coreSkills: [
                                                                                                    {
                                                                                                        coreSkill: data?.skills[0]?.core_skill || "",
                                                                                                        subSkills:
                                                                                                        data?.skills[0]?.subSkill?.length > 0
                                                                                                        ? data?.skills[0]?.subSkill?.map((data) => {
                                                                                                        // Declare variables inside the map
                                                                                                        const subSkill = data.sub_skills || "";   // Default empty string if sub_skills is missing
                                                                                                        const certificate = data.certificate || "";  // Default empty string if certificate is missing

                                                                                                        return {subSkill, certificate};  // Return the object with subSkill and certificate
                                                                                                    })
                                                                                                        : [{subSkill: '', certificate: ''}],
                                                                                                    },
                                                                                                    {
                                                                                                        coreSkill: data?.skills[1]?.core_skill || "",
                                                                                                        subSkills:
                                                                                                        data?.skills[1]?.subSkill?.length > 0
                                                                                                        ? data?.skills[1]?.subSkill?.map((data) => {
                                                                                                        // Declare variables inside the map
                                                                                                        const subSkill = data.sub_skills || "";   // Default empty string if sub_skills is missing
                                                                                                        const certificate = data.certificate || "";  // Default empty string if certificate is missing

                                                                                                        return {subSkill, certificate};  // Return the object with subSkill and certificate
                                                                                                    })
                                                                                                        : [{subSkill: '', certificate: ''}],
                                                                                                    },
                                                                                                    {
                                                                                                        coreSkill: data?.skills[2]?.core_skill || "",
                                                                                                        subSkills:
                                                                                                        data?.skills[2]?.subSkill?.length > 0
                                                                                                        ? data?.skills[2]?.subSkill?.map((data) => {
                                                                                                        // Declare variables inside the map
                                                                                                        const subSkill = data.sub_skills || "";   // Default empty string if sub_skills is missing
                                                                                                        const certificate = data.certificate || "";  // Default empty string if certificate is missing

                                                                                                        return {subSkill, certificate};  // Return the object with subSkill and certificate
                                                                                                    })
                                                                                                        : [{subSkill: '', certificate: ''}],
                                                                                                    },
                                                                                                        ],

                                                                                                        accomplishment_1: data?.workExperience?.accomplishment_1 || '',
                                                                                                        accomplishment_2: data?.workExperience?.accomplishment_2 || '',
                                                                                                        accomplishment_3: data?.workExperience?.accomplishment_3 || '',
                                                                                                        accomplishment_4: data?.workExperience?.accomplishment_4 || '',

                                                                                                        work_experience_industry:
                                                                                                        data?.workExperience?.work_experience_industry || '',
                                                                                                        work_experience_sub_industry:
                                                                                                        data?.workExperience?.work_experience_sub_industry || '',
                                                                                                        work_experience_country:
                                                                                                        data?.workExperience?.work_experience_country || '',
                                                                                                        work_experience_job_title:
                                                                                                        data?.workExperience?.work_experience_job_title || '',
                                                                                                        work_experience_company_name:
                                                                                                        data?.workExperience?.work_experience_company_name || '',
                                                                                                        work_experience_company_website:
                                                                                                        data?.workExperience?.work_experience_company_website || '',
                                                                                                        // experience_start_date:
                                                                                                        //   data?.workExperience?.experience_start_date || null,
                                                                                                        // experience_end_date: data?.workExperience?.experience_end_date || null,
                                                                                                        isCurrentlyWorking: data?.workExperience?.isCurrentlyWorking || false,
                                                                                                        email: data?.workExperience?.email || '',

                                                                                                        video: data?.basicDetails?.video || '',
                                                                                                        secondary_video: data?.basicDetails?.secondary_video || '',

                                                                                                        career_industry: data?.careerGoal?.career_industry || '',
                                                                                                        career_field: data?.careerGoal?.career_field || '',
                                                                                                        noc_number: data?.careerGoal?.noc_number || '',
                                                                                                        noc: data?.careerGoal?.noc || '',
                                                                                                    }}
                                                                                                    validationSchema={jobFormValidation}
                                                                                                    onSubmit={handleSubmit}
                                                                                                >
                                                                                                    {({
                                                                                                          handleReset,
                                                                                                          isSubmitting,
                                                                                                          setFieldValue,
                                                                                                          values,
                                                                                                          errors
                                                                                                      }) => {
                                                                                                        console.log("values.coreSkills :", values.coreSkills[0])
                                                                                                        return (
                                                                                                            <Form>
                                                                                                                {/* ------------------Personal Information--------------- */}
                                                                                                                <FormInfo
                                                                                                                    title="Personal Information"
                                                                                                                    icon={
                                                                                                                        <UserInfo/>}>
                                                                                                                    <div
                                                                                                                        className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                                                                                                                        <TextField
                                                                                                                            type="text"
                                                                                                                            label="firstname"
                                                                                                                            name="firstname"
                                                                                                                            placeholder="Enter first name"
                                                                                                                            onChange={(e) => setFieldValue('firstname', e.target.value)}
                                                                                                                        />
                                                                                                                        <TextField
                                                                                                                            type="text"
                                                                                                                            label="lastname"
                                                                                                                            name="lastname"
                                                                                                                            placeholder="Enter last name"
                                                                                                                            onChange={(e) => setFieldValue('lastname', e.target.value)}
                                                                                                                        />

                                                                                                                        <div
                                                                                                                            className="mb-4">
                                                                                                                            <Label
                                                                                                                                label="Profile"/>
                                                                                                                            <Field
                                                                                                                                name="profile_pic">
                                                                                                                                {({field}) => (
                                                                                                                                    <div
                                                                                                                                        className="flex flex-col">
                                                                                                                                        <input
                                                                                                                                            type="file"
                                                                                                                                            id="profile_pic"
                                                                                                                                            className="hidden"
                                                                                                                                            onChange={(event) => {
                                                                                                                                                const file = event.currentTarget.files[0]
                                                                                                                                                if (file) {
                                                                                                                                                    const validTypes = [
                                                                                                                                                        'image/jpeg',
                                                                                                                                                        'image/png',
                                                                                                                                                        'image/jpg',
                                                                                                                                                    ]
                                                                                                                                                    if (validTypes.includes(file.type)) {
                                                                                                                                                        setFieldValue('profile_pic', file)
                                                                                                                                                        setImgError('') // Clear error
                                                                                                                                                    } else {
                                                                                                                                                        setImgError(
                                                                                                                                                            'Invalid file type. Please select a jpeg, JPG or PNG file.',
                                                                                                                                                        )
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }}
                                                                                                                                        />
                                                                                                                                        <label
                                                                                                                                            htmlFor="profile_pic"
                                                                                                                                            className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full cursor-pointer"
                                                                                                                                        >
                          <span className="px-2 py-1 border border-primary rounded bg-primary-100">
                            Choose file
                          </span>{' '}
                                                                                                                                            {data
                                                                                                                                                ? values?.profile_pic?.name ||
                                                                                                                                                data?.basicDetails?.profile_pic?.split('\\')[2]
                                                                                                                                                : values?.profile_pic?.name || 'No file chosen'}
                                                                                                                                        </label>
                                                                                                                                        {/* Displaying error message */}
                                                                                                                                        {imgError && (
                                                                                                                                            <div
                                                                                                                                                className="text-xs text-red-500 ml-1 mt-1">
                                                                                                                                                {imgError}
                                                                                                                                            </div>
                                                                                                                                        )}
                                                                                                                                        {imgError === '' && (
                                                                                                                                            <ErrorMessage
                                                                                                                                                name="profile_pic"
                                                                                                                                                component="div"
                                                                                                                                                className="text-xs text-red-500 ml-1 mt-1"
                                                                                                                                            />
                                                                                                                                        )}
                                                                                                                                    </div>
                                                                                                                                )}
                                                                                                                            </Field>
                                                                                                                        </div>

                                                                                                                        <DateField
                                                                                                                            label="Date of Birth"
                                                                                                                            name="dob"
                                                                                                                            icon={
                                                                                                                                <Calender/>}
                                                                                                                        />

                                                                                                                        <RadioGroup
                                                                                                                            name="gender"
                                                                                                                            label="Gender"
                                                                                                                            options={[
                                                                                                                                {
                                                                                                                                    value: 'male',
                                                                                                                                    label: 'Male'
                                                                                                                                },
                                                                                                                                {
                                                                                                                                    value: 'female',
                                                                                                                                    label: 'Female'
                                                                                                                                },
                                                                                                                                {
                                                                                                                                    value: 'other',
                                                                                                                                    label: 'Other'
                                                                                                                                },
                                                                                                                            ]}
                                                                                                                        />

                                                                                                                        <DropDown
                                                                                                                            label="Nationality"
                                                                                                                            name="nationality"
                                                                                                                            options={countryData}
                                                                                                                            value={data?.basicDetails?.nationality || 'Canada'}
                                                                                                                            onChange={(e) => setFieldValue('nationality', e.target.value)}
                                                                                                                        />

                                                                                                                        <DropDown
                                                                                                                            label="Country"
                                                                                                                            name="current_country"
                                                                                                                            options={countryDataBasic}
                                                                                                                            value={getCountryNameByValue(defaultCurrentCountry)} // Show name
                                                                                                                            onChange={(e) => handleChangeCountry(e, setFieldValue)}
                                                                                                                        />

                                                                                                                        <DropDown
                                                                                                                            label="Current State"
                                                                                                                            name="current_state"
                                                                                                                            options={stateOptions}
                                                                                                                            value={getStateNameByValue(
                                                                                                                                data?.basicDetails?.current_state || '',
                                                                                                                            )}
                                                                                                                            onChange={(e) => handleChangeState(e, setFieldValue, values)}
                                                                                                                        />

                                                                                                                        <DropDownInput
                                                                                                                            label="Current City"
                                                                                                                            name="current_city"
                                                                                                                            options={cityOptions}
                                                                                                                            value={data?.basicDetails?.current_city || ''} // Assuming city names are used
                                                                                                                            onChange={(e) =>
                                                                                                                                setFieldValue('current_city', e.target.value, values)
                                                                                                                            }
                                                                                                                        />

                                                                                                                        <div
                                                                                                                            className="mb-4">
                                                                                                                            <Label
                                                                                                                                label="Contact No"/>
                                                                                                                            <div
                                                                                                                                className="mt-1">
                                                                                                                                <PhoneInput
                                                                                                                                    name="contact_no"
                                                                                                                                    value={values.contact_no}
                                                                                                                                    onChange={(value) => setFieldValue('contact_no', value)}
                                                                                                                                    placeholder="+1 250-555-0199"
                                                                                                                                />
                                                                                                                            </div>
                                                                                                                            <ErrorMessage
                                                                                                                                name={'contact_no'}
                                                                                                                                component="div"
                                                                                                                                className="text-xs text-red-500 ml-1 mt-1"
                                                                                                                            />
                                                                                                                        </div>

                                                                                                                        <TextField
                                                                                                                            type="text"
                                                                                                                            label="Contact email Id"
                                                                                                                            name="contact_email_id"
                                                                                                                            placeholder="Enter contact email Id"
                                                                                                                            onChange={(e) =>
                                                                                                                                setFieldValue('contact_email_id', e.target.value)
                                                                                                                            }
                                                                                                                        />

                                                                                                                        <DropDownInput
                                                                                                                            label="Job preferred location"
                                                                                                                            name="job_preferred_location"
                                                                                                                            options={provinceData}
                                                                                                                            value={data?.basicDetails?.job_preferred_location}
                                                                                                                            onChange={(e) =>
                                                                                                                                setFieldValue('job_preferred_location', e.target.value)
                                                                                                                            }
                                                                                                                            allowCustom={true}
                                                                                                                        />

                                                                                                                        {/* <DropDownInput
                  label="Job preferred location"
                  name="job_preferred_location"
                  options={provinceData}
                  value={data?.basicDetails?.job_preferred_location}
                  onChange={(e) =>
                    setFieldValue('job_preferred_location', e.target.value)
                  }
                /> */}
                                                                                                                    </div>
                                                                                                                </FormInfo>

                                                                                                                {/* ------------------International Education--------------- */}
                                                                                                                <FormInfo
                                                                                                                    title="Global Education"
                                                                                                                    icon={
                                                                                                                        <GlobalEducation/>}>
                                                                                                                    <div
                                                                                                                        className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                                                                                                                        <DropDownInput
                                                                                                                            label="Level of Education"
                                                                                                                            name="level_of_education"
                                                                                                                            options={levelOfEducation}
                                                                                                                            value={data?.internationalEducation?.level_of_education || ''}
                                                                                                                            onChange={(e) =>
                                                                                                                                setFieldValue('level_of_education', e.target.value)
                                                                                                                            }
                                                                                                                        />
                                                                                                                        <DropDownInput
                                                                                                                            label="Field of Study"
                                                                                                                            name="field_of_study"
                                                                                                                            options={fieldOfStudy}
                                                                                                                            value={data?.internationalEducation?.field_of_study || ''}
                                                                                                                            onChange={(e) =>
                                                                                                                                setFieldValue('field_of_study', e.target.value)
                                                                                                                            }
                                                                                                                        />
                                                                                                                        <DropDownInput
                                                                                                                            label="Year of Graduation"
                                                                                                                            name="year_of_graduation"
                                                                                                                            options={years}
                                                                                                                            value={data?.internationalEducation?.year_of_graduation || ''}
                                                                                                                            onChange={(e) =>
                                                                                                                                setFieldValue('year_of_graduation', e.target.value)
                                                                                                                            }
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                </FormInfo>

                                                                                                                {/* ------------------Canadian Education--------------- */}
                                                                                                                <FormInfo
                                                                                                                    title="Canadian Education"
                                                                                                                    icon={
                                                                                                                        <CanadianEducation/>}
                                                                                                                    renderRight={true}
                                                                                                                    renderRightContent={
                                                                                                                        <ToggleButton
                                                                                                                            label=""
                                                                                                                            name="isCanadianEducation"
                                                                                                                            onChange={(e) =>
                                                                                                                                setFieldValue('isCanadianEducation', e.target.checked)
                                                                                                                            }
                                                                                                                        />
                                                                                                                    }
                                                                                                                >
                                                                                                                    <div
                                                                                                                        className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                                                                                                                        <DropDownInput
                                                                                                                            label="College/University"
                                                                                                                            name="university"
                                                                                                                            disabled={!values.isCanadianEducation}
                                                                                                                            options={universityData?.map((data) => ({
                                                                                                                                name: data.name,
                                                                                                                                value: data.name,
                                                                                                                            }))}
                                                                                                                            value={data?.canadianEducation?.university || ''}
                                                                                                                            onChange={(e) => setFieldValue('university', e.target.value)}
                                                                                                                        />
                                                                                                                        <DropDownInput
                                                                                                                            label="City"
                                                                                                                            name="city"
                                                                                                                            options={currentCity}
                                                                                                                            disabled={!values.isCanadianEducation}
                                                                                                                            value={data?.canadianEducation?.city || ''}
                                                                                                                            onChange={(e) => setFieldValue('city', e.target.value)}
                                                                                                                        />
                                                                                                                        <DropDownInput
                                                                                                                            label="Level of Education"
                                                                                                                            name="level_of_education_canadian"
                                                                                                                            options={levelOfEducation}
                                                                                                                            disabled={!values.isCanadianEducation}
                                                                                                                            value={
                                                                                                                                data?.canadianEducation?.level_of_education_canadian || ''
                                                                                                                            }
                                                                                                                            onChange={(e) =>
                                                                                                                                setFieldValue('level_of_education_canadian', e.target.value)
                                                                                                                            }
                                                                                                                        />
                                                                                                                        <DropDownInput
                                                                                                                            label="Field of Study"
                                                                                                                            name="field_of_study_canadian"
                                                                                                                            disabled={!values.isCanadianEducation}
                                                                                                                            options={fieldOfStudyCanadian}
                                                                                                                            value={data?.canadianEducation?.field_of_study_canadian || ''}
                                                                                                                            onChange={(e) =>
                                                                                                                                setFieldValue('field_of_study_canadian', e.target.value)
                                                                                                                            }
                                                                                                                        />
                                                                                                                        <DropDownInput
                                                                                                                            label="Year of completion"
                                                                                                                            name="year_of_completion"
                                                                                                                            disabled={!values.isCanadianEducation}
                                                                                                                            options={years}
                                                                                                                            value={data?.canadianEducation?.year_of_completion || ''}
                                                                                                                            onChange={(e) =>
                                                                                                                                setFieldValue('year_of_completion', e.target.value)
                                                                                                                            }
                                                                                                                        />
                                                                                                                        <TextField
                                                                                                                            type="text"
                                                                                                                            label="GPA"
                                                                                                                            name="gpa"
                                                                                                                            placeholder="10"
                                                                                                                            disabled={!values.isCanadianEducation}
                                                                                                                            onChange={(e) => setFieldValue('gpa', e.target.value)}
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                </FormInfo>

                                                                                                                {/* -------------Skills------------- */}
                                                                                                                <FormInfo
                                                                                                                    title="Skills"
                                                                                                                    icon={
                                                                                                                        <Skills/>}>
                                                                                                                    <div
                                                                                                                        className="py-6 px-4">
                                                                                                                        <FieldArray
                                                                                                                            name="coreSkills">
                                                                                                                            {({
                                                                                                                                  push,
                                                                                                                                  remove
                                                                                                                              }) => (
                                                                                                                                <div>
                                                                                                                                    {values.coreSkills.map((coreSkill, coreIndex) => (
                                                                                                                                        <div
                                                                                                                                            key={coreIndex}
                                                                                                                                            className="mt-5">
                                                                                                                                            {/* Core Skill Dropdown */}
                                                                                                                                            <DropDown
                                                                                                                                                label="Core Skills"
                                                                                                                                                name={`coreSkills[${coreIndex}].coreSkill`}
                                                                                                                                                value={coreSkill.coreSkill || ''}
                                                                                                                                                options={skillData?.map((skill) => ({
                                                                                                                                                    name: skill.core_skills,
                                                                                                                                                    value: skill.core_skills,
                                                                                                                                                }))}
                                                                                                                                                onChange={(e) => {
                                                                                                                                                    const selectedSkill = e.target.value;
                                                                                                                                                    setFieldValue(`coreSkills[${coreIndex}].coreSkill`, selectedSkill);
                                                                                                                                                    setFieldValue(`coreSkills[${coreIndex}].subSkills`, []);
                                                                                                                                                }}
                                                                                                                                            />

                                                                                                                                            {/* Display Subskills for the selected Core Skill */}
                                                                                                                                            {coreSkill.coreSkill && (
                                                                                                                                                <div>
                                                                                                                                                    {/* Find the selected core skill object from skillData */}
                                                                                                                                                    {skillData
                                                                                                                                                        ?.filter((skill) => skill.core_skills === coreSkill.coreSkill)
                                                                                                                                                        .map((filteredSkill) => (
                                                                                                                                                            <div
                                                                                                                                                                key={filteredSkill.core_skills}>
                                                                                                                                                                {/* Render each subskill for the selected core skill */}
                                                                                                                                                                <div
                                                                                                                                                                    className="w-full">
                                                                                                                                                                    <Label
                                                                                                                                                                        label="Sub Skills"/>
                                                                                                                                                                    {/* Multiselect for Subskills */}
                                                                                                                                                                    <Multiselect
                                                                                                                                                                        options={filteredSkill.sub_skills.map((sub) => ({
                                                                                                                                                                            name: sub.sub_skill,
                                                                                                                                                                            id: sub.sub_skill,
                                                                                                                                                                        }))}
                                                                                                                                                                        selectedValues={coreSkill.subSkills?.map((skill) => ({
                                                                                                                                                                            name: skill.subSkill,
                                                                                                                                                                            id: skill.subSkill,
                                                                                                                                                                        }))}
                                                                                                                                                                        onSelect={(selectedList) => {
                                                                                                                                                                            // Store selected subskills as array of objects, preserving existing certificates
                                                                                                                                                                            const updatedSubSkills = selectedList.map(item => {
                                                                                                                                                                                const existingSubSkill = coreSkill.subSkills.find(sub => sub.subSkill === item.name);
                                                                                                                                                                                return {
                                                                                                                                                                                    subSkill: item.name,
                                                                                                                                                                                    certificate: existingSubSkill ? existingSubSkill.certificate : null, // Keep the existing certificate, if any
                                                                                                                                                                                };
                                                                                                                                                                            });

                                                                                                                                                                            setFieldValue(
                                                                                                                                                                                `coreSkills[${coreIndex}].subSkills`,
                                                                                                                                                                                updatedSubSkills
                                                                                                                                                                            );
                                                                                                                                                                        }}

                                                                                                                                                                        onRemove={(selectedList) => {
                                                                                                                                                                            // Create a new array that includes only the subskills that are not in the selectedList
                                                                                                                                                                            const updatedSubSkills = coreSkill.subSkills.filter((subSkill) => {
                                                                                                                                                                                // If the subSkill's name is in selectedList, remove it, otherwise keep it
                                                                                                                                                                                return selectedList.some(item => item.name === subSkill.subSkill);
                                                                                                                                                                            });
                                                                                                                                                                            // Update Formik's state with the modified subSkills array
                                                                                                                                                                            setFieldValue(
                                                                                                                                                                                `coreSkills[${coreIndex}].subSkills`,
                                                                                                                                                                                updatedSubSkills
                                                                                                                                                                            );
                                                                                                                                                                        }}

                                                                                                                                                                        displayValue="name"
                                                                                                                                                                        name={`coreSkills[${coreIndex}].subSkills`}
                                                                                                                                                                    />
                                                                                                                                                                    <span
                                                                                                                                                                        className="text-xs text-green-700">
                                        * If your skill is not listed, please email skill and subskill @ team@zeroed.ca
                                      </span>
                                                                                                                                                                    <ErrorMessage
                                                                                                                                                                        name={`coreSkills[${coreIndex}].subSkills`}
                                                                                                                                                                        component="div"
                                                                                                                                                                        className="text-xs text-red-500 ml-1 mt-1"
                                                                                                                                                                    />
                                                                                                                                                                </div>

                                                                                                                                                                {/* File Upload for Subskill Certificate */}
                                                                                                                                                                {coreSkill.subSkills?.map((subSkill, subIndex) => (
                                                                                                                                                                    <div
                                                                                                                                                                        key={subIndex}
                                                                                                                                                                        className="mt-3">
                                                                                                                                                                        {/* Display a file upload input only for selected subskills */}
                                                                                                                                                                        {filteredSkill.sub_skills
                                                                                                                                                                            ?.filter((sub) => sub.sub_skill === subSkill.subSkill) // Check if this subskill is selected
                                                                                                                                                                            .map((sub) => (
                                                                                                                                                                                <div
                                                                                                                                                                                    key={sub.sub_skill}>
                                                                                                                                                                                    <div
                                                                                                                                                                                        className="mb-2">
                                                                                                                                                                                        <Label
                                                                                                                                                                                            label={`Upload Certificate for ${sub.sub_skill}`}/>
                                                                                                                                                                                    </div>

                                                                                                                                                                                    {/* File input */}
                                                                                                                                                                                    <input
                                                                                                                                                                                        type="file"
                                                                                                                                                                                        id={`coreSkills[${coreIndex}].subSkills[${subIndex}].certificate`}
                                                                                                                                                                                        name={`coreSkills[${coreIndex}].subSkills[${subIndex}].certificate`}
                                                                                                                                                                                        onChange={(event) => {
                                                                                                                                                                                            const file = event.currentTarget.files[0];
                                                                                                                                                                                            if (file) {
                                                                                                                                                                                                const updatedSubSkills = [...coreSkill.subSkills];
                                                                                                                                                                                                updatedSubSkills[subIndex] = {
                                                                                                                                                                                                    ...updatedSubSkills[subIndex],
                                                                                                                                                                                                    certificate: file,
                                                                                                                                                                                                };
                                                                                                                                                                                                setFieldValue(`coreSkills[${coreIndex}].subSkills`, updatedSubSkills);
                                                                                                                                                                                            }
                                                                                                                                                                                        }}
                                                                                                                                                                                    />

                                                                                                                                                                                    {/* Check if certificate exists, and display either the image or the upload option */}
                                                                                                                                                                                    {subSkill.certificate && (
                                                                                                                                                                                        <div>
                                                                                                                                                                                            <p>Uploaded
                                                                                                                                                                                                Certificate:</p>

                                                                                                                                                                                            {
                                                                                                                                                                                                subSkill.certificate instanceof File ?
                                                                                                                                                                                                    <img
                                                                                                                                                                                                        src={URL.createObjectURL(subSkill.certificate)} // Show image preview from the selected file
                                                                                                                                                                                                        alt="Certificate Preview"
                                                                                                                                                                                                        style={{
                                                                                                                                                                                                            width: 100,
                                                                                                                                                                                                            height: 100
                                                                                                                                                                                                        }}
                                                                                                                                                                                                    /> :
                                                                                                                                                                                                    <img
                                                                                                                                                                                                        src={`${process.env.REACT_APP_FILE_URL}/${subSkill.certificate.replace(/\\/g, '/')}`} // Normalize path
                                                                                                                                                                                                        alt="Certificate Preview"
                                                                                                                                                                                                        style={{
                                                                                                                                                                                                            width: 100,
                                                                                                                                                                                                            height: 100
                                                                                                                                                                                                        }}
                                                                                                                                                                                                    />
                                                                                                                                                                                            }
                                                                                                                                                                                        </div>
                                                                                                                                                                                    )}
                                                                                                                                                                                    {/* Display error message if validation fails */}
                                                                                                                                                                                    <ErrorMessage
                                                                                                                                                                                        name={`coreSkills[${coreIndex}].subSkills[${subIndex}].certificate`}
                                                                                                                                                                                        component="div"
                                                                                                                                                                                        style={{color: 'red'}}
                                                                                                                                                                                    />
                                                                                                                                                                                </div>
                                                                                                                                                                            ))}
                                                                                                                                                                    </div>
                                                                                                                                                                ))}


                                                                                                                                                            </div>
                                                                                                                                                        ))}
                                                                                                                                                </div>
                                                                                                                                            )}
                                                                                                                                        </div>
                                                                                                                                    ))}
                                                                                                                                </div>
                                                                                                                            )}
                                                                                                                        </FieldArray>
                                                                                                                    </div>
                                                                                                                </FormInfo>

                                                                                                                {/* -------------Work Experience------------- */}
                                                                                                                <FormInfo
                                                                                                                    title="Work Experience"
                                                                                                                    icon={
                                                                                                                        <WorkExperience/>}>
                                                                                                                    {workExperiences.map((experience, index) => (
                                                                                                                        <div
                                                                                                                            key={index}>
                                                                                                                            <div
                                                                                                                                className="flex flex-wrap justify-between items-center gap-x-3 bg-primary-100 p-3 w-full">
                                                                                                                                <div
                                                                                                                                    className="flex items-center gap-x-2">
                                                                                                                                    <div
                                                                                                                                        className="text-lg font-semibold capitalize text-primary text-nowrap">
                                                                                                                                        {index + 1}.{' '}
                                                                                                                                        {experience.work_experience_company_name ||
                                                                                                                                            'New Experience'}
                                                                                                                                    </div>
                                                                                                                                    {workExperiences.length > 1 && (
                                                                                                                                        <div
                                                                                                                                            onClick={() => handleDeleteExperience(index)}
                                                                                                                                            className="cursor-pointer font-black"
                                                                                                                                        >
                                                                                                                                            <DeleteIcon/>
                                                                                                                                        </div>
                                                                                                                                    )}
                                                                                                                                </div>

                                                                                                                                <Checkbox
                                                                                                                                    label="Currently working here?"
                                                                                                                                    name={`isCurrentlyWorking_${index}`}
                                                                                                                                    checked={experience.isCurrentlyWorking}
                                                                                                                                    onChange={(e) => {
                                                                                                                                        const isChecked = e.target.checked

                                                                                                                                        // Update the isCurrentlyWorking field in the state
                                                                                                                                        setFieldValue(`isCurrentlyWorking_${index}`, isChecked)

                                                                                                                                        // Update the workExperiences state
                                                                                                                                        setWorkExperiences((prevWorkExperiences) => {
                                                                                                                                            const updatedExperiences = [...prevWorkExperiences]
                                                                                                                                            const updatedExperience = {
                                                                                                                                                ...updatedExperiences[index],
                                                                                                                                                isCurrentlyWorking: isChecked,
                                                                                                                                                experience_end_date: isChecked
                                                                                                                                                    ? null
                                                                                                                                                    : updatedExperiences[index].experience_end_date,
                                                                                                                                            }

                                                                                                                                            updatedExperiences[index] = updatedExperience
                                                                                                                                            return updatedExperiences
                                                                                                                                        })
                                                                                                                                    }}
                                                                                                                                />
                                                                                                                            </div>

                                                                                                                            <div
                                                                                                                                className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                                                                                                                                <DropDown
                                                                                                                                    label="Industry"
                                                                                                                                    name={`work_experience_industry_${index}`}
                                                                                                                                    value={experience.work_experience_industry}
                                                                                                                                    options={industriesData.map((industry) => ({
                                                                                                                                        value: industry.name,
                                                                                                                                        name: industry.name,
                                                                                                                                    }))}
                                                                                                                                    onChange={(e) => {
                                                                                                                                        handleSubIndustryChange(e, index)
                                                                                                                                        handleChangeExperience(
                                                                                                                                            index,
                                                                                                                                            'work_experience_industry',
                                                                                                                                            e.target.value,
                                                                                                                                        )
                                                                                                                                    }}
                                                                                                                                />
                                                                                                                                <DropDown
                                                                                                                                    label="Sub Industry"
                                                                                                                                    name={`work_experience_sub_industry_${index}`}
                                                                                                                                    value={experience.work_experience_sub_industry}
                                                                                                                                    options={subIndustryOptions[index] || []}
                                                                                                                                    onChange={(e) => {
                                                                                                                                        handleChangeExperience(
                                                                                                                                            index,
                                                                                                                                            'work_experience_sub_industry',
                                                                                                                                            e.target.value,
                                                                                                                                        )
                                                                                                                                    }}
                                                                                                                                />
                                                                                                                                <DropDownInput
                                                                                                                                    label="Country"
                                                                                                                                    name={`work_experience_country_${index}`}
                                                                                                                                    value={experience.work_experience_country}
                                                                                                                                    options={countryData}
                                                                                                                                    onChange={(e) =>
                                                                                                                                        handleChangeExperience(
                                                                                                                                            index,
                                                                                                                                            'work_experience_country',
                                                                                                                                            e.target.value,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                />
                                                                                                                                <TextFieldValue
                                                                                                                                    required
                                                                                                                                    type="text"
                                                                                                                                    label="Job Title"
                                                                                                                                    name={`work_experience_job_title_${index}`}
                                                                                                                                    value={experience.work_experience_job_title}
                                                                                                                                    placeholder="Software Engineer"
                                                                                                                                    onChange={(e) =>
                                                                                                                                        handleChangeExperience(
                                                                                                                                            index,
                                                                                                                                            'work_experience_job_title',
                                                                                                                                            e.target.value,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                />

                                                                                                                                <TextFieldValue
                                                                                                                                    type="text"
                                                                                                                                    label="Company Name"
                                                                                                                                    name={`work_experience_company_name_${index}`}
                                                                                                                                    value={experience.work_experience_company_name}
                                                                                                                                    placeholder="Company name"
                                                                                                                                    onChange={(e) =>
                                                                                                                                        handleChangeExperience(
                                                                                                                                            index,
                                                                                                                                            'work_experience_company_name',
                                                                                                                                            e.target.value,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                />
                                                                                                                                <TextFieldValue
                                                                                                                                    type="text"
                                                                                                                                    label="Company Website link"
                                                                                                                                    name={`work_experience_company_website_${index}`}
                                                                                                                                    value={experience.work_experience_company_website}
                                                                                                                                    placeholder="Company website link"
                                                                                                                                    onChange={(e) =>
                                                                                                                                        handleChangeExperience(
                                                                                                                                            index,
                                                                                                                                            'work_experience_company_website',
                                                                                                                                            e.target.value,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                />

                                                                                                                                {/* Email Id For verification */}
                                                                                                                                <div
                                                                                                                                    className="flex flex-col items-center justify-between gap-x-2 relative">
                                                                                                                                    <div
                                                                                                                                        className="w-full">
                                                                                                                                        <TextFieldValue
                                                                                                                                            type="text"
                                                                                                                                            label="Email"
                                                                                                                                            name={`email_${index}`}
                                                                                                                                            value={experience.email || ''}
                                                                                                                                            placeholder="Enter email"
                                                                                                                                            onChange={(e) =>
                                                                                                                                                handleChangeExperience(
                                                                                                                                                    index,
                                                                                                                                                    'email',
                                                                                                                                                    e.target.value,
                                                                                                                                                )
                                                                                                                                            }
                                                                                                                                        />
                                                                                                                                    </div>

                                                                                                                                    {experience.emailError && (
                                                                                                                                        <div
                                                                                                                                            className="text-red-500 text-sm -mt-3">
                                                                                                                                            {experience.emailError}
                                                                                                                                        </div>
                                                                                                                                    )}
                                                                                                                                </div>
                                                                                                                                {/* ---------Start Date------------- */}
                                                                                                                                <div>
                                                                                                                                    <Label
                                                                                                                                        label="Start Date"/>
                                                                                                                                    <div
                                                                                                                                        className="relative">
                                                                                                                                        <Field
                                                                                                                                            name={`experience_start_date_${index}`}
                                                                                                                                            className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full"
                                                                                                                                            component={ExperienceDateFormat}
                                                                                                                                            defaultValue={experience.experience_start_date} // This will be set to 10/27/2024
                                                                                                                                            onChange={(e) => handleChangeExperience(index, 'experience_start_date', e)}
                                                                                                                                        />
                                                                                                                                        <span
                                                                                                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Calender/>
                        </span>
                                                                                                                                    </div>
                                                                                                                                    <ErrorMessage
                                                                                                                                        name={`experience_start_date_${index}`}
                                                                                                                                        component="div"
                                                                                                                                        className="text-xs text-red-500 ml-1 mt-1"
                                                                                                                                    />
                                                                                                                                </div>

                                                                                                                                {/* ---------End Date------------- */}
                                                                                                                                <div>
                                                                                                                                    <Label
                                                                                                                                        label="End Date"/>
                                                                                                                                    <div
                                                                                                                                        className="relative">
                                                                                                                                        <Field
                                                                                                                                            name={`experience_end_date_${index}`}
                                                                                                                                            className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full"
                                                                                                                                            component={ExperienceDateFormat}
                                                                                                                                            defaultValue={experience.experience_end_date === "NaN/NaN/NaN" ? "" : experience.experience_end_date}
                                                                                                                                            disabled={experience.isCurrentlyWorking} // Disable if currently working
                                                                                                                                            onChange={(e) =>
                                                                                                                                                handleChangeExperience(index, 'experience_end_date', e)
                                                                                                                                            }
                                                                                                                                        />
                                                                                                                                        <span
                                                                                                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Calender/>
                        </span>
                                                                                                                                    </div>
                                                                                                                                    <ErrorMessage
                                                                                                                                        name={`experience_end_date_${index}`}
                                                                                                                                        component="div"
                                                                                                                                        className="text-xs text-red-500 ml-1 mt-1"
                                                                                                                                    />
                                                                                                                                </div>

                                                                                                                                {/* Accomplishments */}
                                                                                                                                <TextArea
                                                                                                                                    name={`accomplishment_1_${index}`}
                                                                                                                                    label="Accomplishments"
                                                                                                                                    value={experience.accomplishments_id?.accomplishment_1}
                                                                                                                                    onChange={(e) =>
                                                                                                                                        handleChangeExperience(
                                                                                                                                            index,
                                                                                                                                            'accomplishments_id.accomplishment_1',
                                                                                                                                            e.target.value,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                />
                                                                                                                                <TextArea
                                                                                                                                    name={`accomplishment_2_${index}`}
                                                                                                                                    label="Accomplishments"
                                                                                                                                    value={experience.accomplishments_id?.accomplishment_2}
                                                                                                                                    onChange={(e) =>
                                                                                                                                        handleChangeExperience(
                                                                                                                                            index,
                                                                                                                                            'accomplishments_id.accomplishment_2',
                                                                                                                                            e.target.value,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                />
                                                                                                                                <TextArea
                                                                                                                                    name={`accomplishment_3_${index}`}
                                                                                                                                    label="Accomplishments"
                                                                                                                                    value={experience.accomplishments_id?.accomplishment_3}
                                                                                                                                    onChange={(e) =>
                                                                                                                                        handleChangeExperience(
                                                                                                                                            index,
                                                                                                                                            'accomplishments_id.accomplishment_3',
                                                                                                                                            e.target.value,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                />
                                                                                                                                <TextArea
                                                                                                                                    name={`accomplishment_4_${index}`}
                                                                                                                                    label="Accomplishments"
                                                                                                                                    value={experience.accomplishments_id?.accomplishment_4}
                                                                                                                                    onChange={(e) =>
                                                                                                                                        handleChangeExperience(
                                                                                                                                            index,
                                                                                                                                            'accomplishments_id.accomplishment_4',
                                                                                                                                            e.target.value,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    ))}
                                                                                                                    <div
                                                                                                                        className="text-xs text-red-500 ml-1 -mt-4 mb-4">
                                                                                                                        {experienceError}
                                                                                                                    </div>
                                                                                                                    {/* Introduction video upload */}
                                                                                                                    <div
                                                                                                                        className="py-6 px-4">
                                                                                                                        <div
                                                                                                                            className="flex sm:flex-row flex-col-reverse justify-between items-center">
                                                                                                                            <div
                                                                                                                                className="lg:w-1/5 sm:w-1/2">
                                                                                                                                <Label
                                                                                                                                    label="Video"/>
                                                                                                                                <VideoUploader
                                                                                                                                    defaultVideo={data?.basicDetails?.video}
                                                                                                                                    onVideoUpload={(url) => setFieldValue(`video`, url)}
                                                                                                                                />
                                                                                                                                <ErrorMessage
                                                                                                                                    name={'video'}
                                                                                                                                    component="div"
                                                                                                                                    className="text-xs text-red-500 ml-1 mt-1"
                                                                                                                                />
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                className="bg-primary px-4 py-2 text-white rounded w-[160px] cursor-pointer text-nowrap"
                                                                                                                                onClick={handleAddExperience}
                                                                                                                            >
                                                                                                                                +
                                                                                                                                Add
                                                                                                                                Experience
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </FormInfo>

                                                                                                                {/* -------------Career Goals------------- */}
                                                                                                                <FormInfo
                                                                                                                    title="Career Goals"
                                                                                                                    icon={
                                                                                                                        <CareerGoal/>}>
                                                                                                                    <div
                                                                                                                        className="grid lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                                                                                                                        {/* <DropDownInput
                  label="Role"
                  name="career_industry"
                  value={data?.careerGoal?.career_industry || ''}
                  options={industriesData.map((industry) => ({
                    value: industry.name,
                    name: industry.name,
                  }))}
                  onChange={(e) =>
                    setFieldValue('career_industry', e.target.value)
                  }
                /> */}
                                                                                                                        <TextField
                                                                                                                            type="text"
                                                                                                                            label="Role"
                                                                                                                            name="career_industry"
                                                                                                                            placeholder="Enter career role"
                                                                                                                            onChange={(e) =>
                                                                                                                                setFieldValue('career_industry', e.target.value)
                                                                                                                            }
                                                                                                                        />
                                                                                                                        {/* <DropDownInput
                  label="Industry"
                  name="career_field"
                  options={fieldOfStudy}
                  value={data?.careerGoal?.career_field || ''}
                  onChange={(e) =>
                    setFieldValue('career_field', e.target.value)
                  }
                /> */}

                                                                                                                        <TextField
                                                                                                                            type="text"
                                                                                                                            label="industry"
                                                                                                                            name="career_field"
                                                                                                                            placeholder="Enter career industry"
                                                                                                                            onChange={(e) =>
                                                                                                                                setFieldValue('career_field', e.target.value)
                                                                                                                            }
                                                                                                                        />

                                                                                                                        <DropDownInput
                                                                                                                            label="NOC Number"
                                                                                                                            name="noc_number"
                                                                                                                            value={data?.careerGoal?.noc_number || ''}
                                                                                                                            options={nocNumber}
                                                                                                                            onChange={(e) => setFieldValue('noc_number', e.target.value)}
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                </FormInfo>

                                                                                                                {/* --------------Submit button------------------- */}
                                                                                                                <div
                                                                                                                    className="flex justify-end gap-x-5 pb-6">
                                                                                                                    <button
                                                                                                                        type="reset"
                                                                                                                        onClick={() => {
                                                                                                                            handleReset()
                                                                                                                            resetWorkExperiences()
                                                                                                                        }}
                                                                                                                        className={`flex gap-x-2 justify-end items-center rounded w-auto py-2 px-10 mt-10 bg-gray-400`}
                                                                                                                    >
                                                                                                                        <span
                                                                                                                            className="text-white text-base font-bold">Reset</span>
                                                                                                                    </button>
                                                                                                                    <button
                                                                                                                        // disabled={disabledButton || isSubmitting || imgError === '' ? false : true}
                                                                                                                        disabled={disabledButton || isSubmitting || imgError !== ''}
                                                                                                                        type="submit"
                                                                                                                        className={`flex gap-x-2 justify-end items-center rounded w-auto py-2 px-10 mt-10 bg-primary`}
                                                                                                                    >
                <span className="text-white text-base font-bold">
                  {isSubmitting ? <Loader/> : data ? 'Update' : 'Submit'}
                </span>
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            </Form>
                                                                                                        )
                                                                                                    }}
                                                                                                </Formik>
                                                                                            )
                                                                                            }

                                                                                                export default Information

                                                                                                ) : (
                                                                                                // Show image from the uploaded URL after processing
                                                                                                <img
                                                                                                src={URL.createObjectURL(subSkill.certificate)} // Show image preview from local object URL
                                                                                             alt="Certificate Preview"
                                                                                             style={{
                                                                                                 width: 100,
                                                                                                 height: 100
                                                                                             }}
                                                                                        />
                                                                                    )}
                                                                            </div>
                                                                        )}
                                                                        {/* Display error message if validation fails */}
                                                                        <ErrorMessage
                                                                            name={`coreSkills[${coreIndex}].subSkills[${subIndex}].certificate`}
                                                                            component="div"
                                                                            style={{color: 'red'}}
                                                                        />
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    ))}

                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>
                            ))}
                        </div>
                        )}
                    </FieldArray>
            </div>
            </FormInfo>

            {/* -------------Work Experience------------- */
            }
                <FormInfo title="Work Experience" icon={<WorkExperience/>}>
                    {workExperiences.map((experience, index) => (
                        <div key={index}>
                            <div
                                className="flex flex-wrap justify-between items-center gap-x-3 bg-primary-100 p-3 w-full">
                                <div className="flex items-center gap-x-2">
                                    <div className="text-lg font-semibold capitalize text-primary text-nowrap">
                                        {index + 1}.{' '}
                                        {experience.work_experience_company_name ||
                                            'New Experience'}
                                    </div>
                                    {workExperiences.length > 1 && (
                                        <div
                                            onClick={() => handleDeleteExperience(index)}
                                            className="cursor-pointer font-black"
                                        >
                                            <DeleteIcon/>
                                        </div>
                                    )}
                                </div>

                                <Checkbox
                                    label="Currently working here?"
                                    name={`isCurrentlyWorking_${index}`}
                                    checked={experience.isCurrentlyWorking}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked

                                        // Update the isCurrentlyWorking field in the state
                                        setFieldValue(`isCurrentlyWorking_${index}`, isChecked)

                                        // Update the workExperiences state
                                        setWorkExperiences((prevWorkExperiences) => {
                                            const updatedExperiences = [...prevWorkExperiences]
                                            const updatedExperience = {
                                                ...updatedExperiences[index],
                                                isCurrentlyWorking: isChecked,
                                                experience_end_date: isChecked
                                                    ? null
                                                    : updatedExperiences[index].experience_end_date,
                                            }

                                            updatedExperiences[index] = updatedExperience
                                            return updatedExperiences
                                        })
                                    }}
                                />
                            </div>

                            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                                <DropDown
                                    label="Industry"
                                    name={`work_experience_industry_${index}`}
                                    value={experience.work_experience_industry}
                                    options={industriesData.map((industry) => ({
                                        value: industry.name,
                                        name: industry.name,
                                    }))}
                                    onChange={(e) => {
                                        handleSubIndustryChange(e, index)
                                        handleChangeExperience(
                                            index,
                                            'work_experience_industry',
                                            e.target.value,
                                        )
                                    }}
                                />
                                <DropDown
                                    label="Sub Industry"
                                    name={`work_experience_sub_industry_${index}`}
                                    value={experience.work_experience_sub_industry}
                                    options={subIndustryOptions[index] || []}
                                    onChange={(e) => {
                                        handleChangeExperience(
                                            index,
                                            'work_experience_sub_industry',
                                            e.target.value,
                                        )
                                    }}
                                />
                                <DropDownInput
                                    label="Country"
                                    name={`work_experience_country_${index}`}
                                    value={experience.work_experience_country}
                                    options={countryData}
                                    onChange={(e) =>
                                        handleChangeExperience(
                                            index,
                                            'work_experience_country',
                                            e.target.value,
                                        )
                                    }
                                />
                                <TextFieldValue
                                    required
                                    type="text"
                                    label="Job Title"
                                    name={`work_experience_job_title_${index}`}
                                    value={experience.work_experience_job_title}
                                    placeholder="Software Engineer"
                                    onChange={(e) =>
                                        handleChangeExperience(
                                            index,
                                            'work_experience_job_title',
                                            e.target.value,
                                        )
                                    }
                                />

                                <TextFieldValue
                                    type="text"
                                    label="Company Name"
                                    name={`work_experience_company_name_${index}`}
                                    value={experience.work_experience_company_name}
                                    placeholder="Company name"
                                    onChange={(e) =>
                                        handleChangeExperience(
                                            index,
                                            'work_experience_company_name',
                                            e.target.value,
                                        )
                                    }
                                />
                                <TextFieldValue
                                    type="text"
                                    label="Company Website link"
                                    name={`work_experience_company_website_${index}`}
                                    value={experience.work_experience_company_website}
                                    placeholder="Company website link"
                                    onChange={(e) =>
                                        handleChangeExperience(
                                            index,
                                            'work_experience_company_website',
                                            e.target.value,
                                        )
                                    }
                                />

                                {/* Email Id For verification */}
                                <div className="flex flex-col items-center justify-between gap-x-2 relative">
                                    <div className="w-full">
                                        <TextFieldValue
                                            type="text"
                                            label="Email"
                                            name={`email_${index}`}
                                            value={experience.email || ''}
                                            placeholder="Enter email"
                                            onChange={(e) =>
                                                handleChangeExperience(
                                                    index,
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    {experience.emailError && (
                                        <div className="text-red-500 text-sm -mt-3">
                                            {experience.emailError}
                                        </div>
                                    )}
                                </div>
                                {/* ---------Start Date------------- */}
                                <div>
                                    <Label label="Start Date"/>
                                    <div className="relative">
                                        <Field
                                            name={`experience_start_date_${index}`}
                                            className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full"
                                            component={ExperienceDateFormat}
                                            defaultValue={experience.experience_start_date} // This will be set to 10/27/2024
                                            onChange={(e) => handleChangeExperience(index, 'experience_start_date', e)}
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Calender/>
                        </span>
                                    </div>
                                    <ErrorMessage
                                        name={`experience_start_date_${index}`}
                                        component="div"
                                        className="text-xs text-red-500 ml-1 mt-1"
                                    />
                                </div>

                                {/* ---------End Date------------- */}
                                <div>
                                    <Label label="End Date"/>
                                    <div className="relative">
                                        <Field
                                            name={`experience_end_date_${index}`}
                                            className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full"
                                            component={ExperienceDateFormat}
                                            defaultValue={experience.experience_end_date === "NaN/NaN/NaN" ? "" : experience.experience_end_date}
                                            disabled={experience.isCurrentlyWorking} // Disable if currently working
                                            onChange={(e) =>
                                                handleChangeExperience(index, 'experience_end_date', e)
                                            }
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Calender/>
                        </span>
                                    </div>
                                    <ErrorMessage
                                        name={`experience_end_date_${index}`}
                                        component="div"
                                        className="text-xs text-red-500 ml-1 mt-1"
                                    />
                                </div>

                                {/* Accomplishments */}
                                <TextArea
                                    name={`accomplishment_1_${index}`}
                                    label="Accomplishments"
                                    value={experience.accomplishments_id?.accomplishment_1}
                                    onChange={(e) =>
                                        handleChangeExperience(
                                            index,
                                            'accomplishments_id.accomplishment_1',
                                            e.target.value,
                                        )
                                    }
                                />
                                <TextArea
                                    name={`accomplishment_2_${index}`}
                                    label="Accomplishments"
                                    value={experience.accomplishments_id?.accomplishment_2}
                                    onChange={(e) =>
                                        handleChangeExperience(
                                            index,
                                            'accomplishments_id.accomplishment_2',
                                            e.target.value,
                                        )
                                    }
                                />
                                <TextArea
                                    name={`accomplishment_3_${index}`}
                                    label="Accomplishments"
                                    value={experience.accomplishments_id?.accomplishment_3}
                                    onChange={(e) =>
                                        handleChangeExperience(
                                            index,
                                            'accomplishments_id.accomplishment_3',
                                            e.target.value,
                                        )
                                    }
                                />
                                <TextArea
                                    name={`accomplishment_4_${index}`}
                                    label="Accomplishments"
                                    value={experience.accomplishments_id?.accomplishment_4}
                                    onChange={(e) =>
                                        handleChangeExperience(
                                            index,
                                            'accomplishments_id.accomplishment_4',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                    <div className="text-xs text-red-500 ml-1 -mt-4 mb-4">
                        {experienceError}
                    </div>
                    {/* Introduction video upload */}
                    <div className="py-6 px-4">
                        <div className="flex sm:flex-row flex-col-reverse justify-between items-center">
                            <div className="lg:w-1/5 sm:w-1/2">
                                <Label label="Video"/>
                                <VideoUploader
                                    defaultVideo={data?.basicDetails?.video}
                                    onVideoUpload={(url) => setFieldValue(`video`, url)}
                                />
                                <ErrorMessage
                                    name={'video'}
                                    component="div"
                                    className="text-xs text-red-500 ml-1 mt-1"
                                />
                            </div>
                            <div
                                className="bg-primary px-4 py-2 text-white rounded w-[160px] cursor-pointer text-nowrap"
                                onClick={handleAddExperience}
                            >
                                + Add Experience
                            </div>
                        </div>
                    </div>
                </FormInfo>

            {/* -------------Career Goals------------- */
            }
                <FormInfo title="Career Goals" icon={<CareerGoal/>}>
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-x-5 py-6 px-4">
                        {/* <DropDownInput
                  label="Role"
                  name="career_industry"
                  value={data?.careerGoal?.career_industry || ''}
                  options={industriesData.map((industry) => ({
                    value: industry.name,
                    name: industry.name,
                  }))}
                  onChange={(e) =>
                    setFieldValue('career_industry', e.target.value)
                  }
                /> */}
                        <TextField
                            type="text"
                            label="Role"
                            name="career_industry"
                            placeholder="Enter career role"
                            onChange={(e) =>
                                setFieldValue('career_industry', e.target.value)
                            }
                        />
                        {/* <DropDownInput
                  label="Industry"
                  name="career_field"
                  options={fieldOfStudy}
                  value={data?.careerGoal?.career_field || ''}
                  onChange={(e) =>
                    setFieldValue('career_field', e.target.value)
                  }
                /> */}

                        <TextField
                            type="text"
                            label="industry"
                            name="career_field"
                            placeholder="Enter career industry"
                            onChange={(e) =>
                                setFieldValue('career_field', e.target.value)
                            }
                        />

                        <DropDownInput
                            label="NOC Number"
                            name="noc_number"
                            value={data?.careerGoal?.noc_number || ''}
                            options={nocNumber}
                            onChange={(e) => setFieldValue('noc_number', e.target.value)}
                        />
                    </div>
                </FormInfo>

            {/* --------------Submit button------------------- */
            }
                <div className="flex justify-end gap-x-5 pb-6">
                    <button
                        type="reset"
                        onClick={() => {
                            handleReset()
                            resetWorkExperiences()
                        }}
                        className={`flex gap-x-2 justify-end items-center rounded w-auto py-2 px-10 mt-10 bg-gray-400`}
                    >
                        <span className="text-white text-base font-bold">Reset</span>
                    </button>
                    <button
                        // disabled={disabledButton || isSubmitting || imgError === '' ? false : true}
                        disabled={disabledButton || isSubmitting || imgError !== ''}
                        type="submit"
                        className={`flex gap-x-2 justify-end items-center rounded w-auto py-2 px-10 mt-10 bg-primary`}
                    >
                <span className="text-white text-base font-bold">
                  {isSubmitting ? <Loader/> : data ? 'Update' : 'Submit'}
                </span>
                    </button>
                </div>
            </Form>
            )
            }}
        </Formik>
    )
}

export default Information
