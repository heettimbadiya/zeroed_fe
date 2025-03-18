import React, { useEffect, useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import {
  DateField,
  DropDown,
  DropDownValue,
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
import fieldOfStudy from '../../common/data/fieldOfStudy.json'
import universityData from '../../common/data/universityData.json'
import currentCity from '../../common/data/currentCity.json'
import skillData from '../../common/data/skillData.json'
import industriesData from '../../common/data/industryData.json'
import nocData from '../../common/data/nocData.json'
import provinceData from '../../common/data/provinceData.json'
import VideoUploader from './video'
import axios from 'axios'
import { Country, State, City } from 'country-state-city'
import { jobFormValidation } from '../../constant/validation'
import { useNavigate } from 'react-router-dom'
import ROUTES_URL from '../../constant/routes'
import { API_ROUTES } from '../../utils/APIs'
import { Loader } from '../../common/Icons'

function Information({ data }) {
  let navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [stateOptions, setStateOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [experienceError, setExperienceError] = useState('')
  const [tooltipVisible, setTooltipVisible] = useState({})
  const [imgError, setImgError] = useState('')

  // Get countries for the country dropdown
  const countryData = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    name: country.name,
  }))

  useEffect(() => {
    if (data?.basicDetails) {
      const states = State.getStatesOfCountry(
        data?.basicDetails?.current_country,
      )
      setStateOptions(
        states.map((state) => ({
          value: state.isoCode,
          name: state.name,
        })),
      )

      if (data?.basicDetails?.current_state) {
        const cities = City.getCitiesOfState(
          data?.basicDetails?.current_country,
          data?.basicDetails?.current_state,
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
    } else {
      const states = State.getStatesOfCountry('CA')
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
    const state = e.target.value
    setFieldValue('current_state', state)
    setFieldValue('current_city', '') // Reset city when state changes

    if (state) {
      const cities = City.getCitiesOfState(values.current_country, state)
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

  const initialWorkExperience = {
    work_experience_year: '',
    work_experience_industry: '',
    work_experience_sub_industry: '',
    work_experience_country: '',
    work_experience_city: '',
    work_experience_job_title: '',
    work_experience_company_name: '',
    experience_start_date: null,
    experience_end_date: null,
    desc: '',
    email: '',
    accomplishments_id: {
      email: '',
      desc: '',
    },
  }
  const [workExperiences, setWorkExperiences] = useState([
    initialWorkExperience,
  ])

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
  const years = Array.from({ length: 30 }, (_, i) => ({
    value: currentYear - i,
    name: currentYear - i,
  }))

  const [subSkillsFirst, setSubSkillsFirst] = useState([])
  const [subSkillsSecond, setSubSkillsSecond] = useState([])
  const [subSkillsThird, setSubSkillsThird] = useState([])

  const handleCoreSkillsChange = (coreSkill, index) => {
    const selectedSubSkills = []
    const skillDataEntry = skillData.find(
      (skill) => skill.core_skills === coreSkill,
    )
    if (skillDataEntry) {
      selectedSubSkills.push(
        ...skillDataEntry.sub_skills.map((sub) => sub.sub_skill),
      )
    }

    if (index === 'first') {
      console.log('first')
      return setSubSkillsFirst(selectedSubSkills)
    }
    if (index === 'second') {
      console.log('second')

      return setSubSkillsSecond(selectedSubSkills)
    }
    if (index === 'third') {
      console.log('third')
      return setSubSkillsThird(selectedSubSkills)
    }
  }

  const [subIndustryOptions, setSubIndustryOptions] = useState([])
  useEffect(() => {
    if (data && data.workExperience) {
      data.workExperience.forEach((experience, index) => {
        const selected = industriesData.find(
          (industry) => industry.name === experience.work_experience_industry,
        )

        const newSubIndustryOptions = selected ? selected.subsector : []
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

    const newSubIndustryOptions = selected ? selected.subsector : []
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
        work_experience_year: '',
        work_experience_industry: '',
        work_experience_sub_industry: '',
        work_experience_country: '',
        work_experience_city: '',
        work_experience_job_title: '',
        work_experience_company_name: '',
        experience_start_date: '',
        experience_end_date: '',
        desc: '',
        email: '',
      },
    ])
  }

  const handleChangeExperience = (index, field, value) => {
    const updatedExperiences = [...workExperiences]

    if (field === 'email') {
      // Update nested email field
      updatedExperiences[index].accomplishments_id.email = value
    } else {
      updatedExperiences[index][field] = value
    }

    setWorkExperiences(updatedExperiences)
  }

  const handleSubmit = async (values) => {
    const formData = new FormData()
    // Append basic details
    formData.append('basicDetails[user_id]', user.id)
    formData.append('basicDetails[firstname]', values.firstname)
    formData.append('basicDetails[lastname]', values.lastname)
    if (values.profile_pic) {
      formData.append('basicDetails[profile_pic]', values.profile_pic)
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
      formData.append('basicDetails[video]', values.video)
    }
 if (values.secondary_video) {
      formData.append('basicDetails[secondary_video]', values.secondary_video)
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

    // Append skills
    formData.append('core_skills_one', values.core_skills_one)
    formData.append('sub_skills_one', values.sub_skills_one)

    formData.append('core_skills_second', values.core_skills_second)
    formData.append('sub_skills_second', values.sub_skills_second)

    formData.append('core_skills_third', values.core_skills_third)
    formData.append('sub_skills_third', values.sub_skills_third)

    // Append work experience
    workExperiences.forEach((experience, index) => {
      // Accomplishments fields
      formData.append(`workExperience[${index}][desc]`, experience.desc)
      formData.append(
        `workExperience[${index}][email]`,
        experience.accomplishments_id.email,
      )

      // Experience fields
      formData.append(
        `workExperience[${index}][work_experience_year]`,
        experience.work_experience_year,
      )
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
        `workExperience[${index}][work_experience_city]`,
        experience.work_experience_city,
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
        `workExperience[${index}][experience_start_date]`,
        experience.experience_start_date,
      )
      formData.append(
        `workExperience[${index}][experience_end_date]`,
        experience.experience_end_date,
      )
      formData.append(
        `workExperience[${index}][accomplishments]`,
        data ? experience.accomplishments_id._id : null,
      )
      formData.append(
        `workExperience[${index}][_id]`,
        data ? experience._id : null,
      )
    })

    // Append career goal
    formData.append('careerGoal[career_industry]', values.career_industry)
    formData.append('careerGoal[career_field]', values.career_field)
    formData.append('careerGoal[career_role]', values.career_role)
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
          alert('Something went wrong')
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
          alert('Something went wrong')
        }
      }
    }
  }

  const resetWorkExperiences = () => {
    setWorkExperiences([initialWorkExperience])
  }

  const handleMouseEnter = (index) => {
    setTooltipVisible((prev) => ({ ...prev, [index]: true }))
  }

  const handleMouseLeave = (index) => {
    setTooltipVisible((prev) => ({ ...prev, [index]: false }))
  }

  return (
    <div>
      <div className="bg-white w-full border border-gray-300 rounded-md px-4 py-8">
        <Formik
          initialValues={{
            isPrivate: false,

            firstname: data?.basicDetails?.firstname || '',
            lastname: data?.basicDetails?.lastname || '',
            profile_pic: data?.basicDetails?.profile_pic || null,
            dob: data?.basicDetails?.dob?.split('T')[0] || null,
            gender: data?.basicDetails?.gender || '',
            nationality: data?.basicDetails?.nationality || '',
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

            university: data?.canadianEducation?.university || '',
            city: data?.canadianEducation?.city || '',
            level_of_education_canadian:
              data?.canadianEducation?.level_of_education_canadian || '',
            field_of_study_canadian:
              data?.canadianEducation?.field_of_study_canadian || '',
            year_of_completion:
              data?.canadianEducation?.year_of_completion || '',
            gpa: data?.canadianEducation?.gpa || '',

            // core_skills: data?.skills?.core_skills[0].split(',') || [],
            core_skill_one: '',
            sub_skills_one: data?.skills?.sub_skills[0].split(',') || [],

            desc: data?.workExperience?.desc || '',
            email: data?.workExperience?.email || '',

            work_experience_year:
              data?.workExperience?.work_experience_year || '',
            work_experience_industry:
              data?.workExperience?.work_experience_industry || '',
            work_experience_sub_industry:
              data?.workExperience?.work_experience_sub_industry || '',
            work_experience_country:
              data?.workExperience?.work_experience_country || '',
            work_experience_city:
              data?.workExperience?.work_experience_city || '',
            work_experience_job_title:
              data?.workExperience?.work_experience_job_title || '',
            work_experience_company_name:
              data?.workExperience?.work_experience_company_name || '',
            experience_start_date:
              data?.workExperience?.experience_start_date || null,
            experience_end_date:
              data?.workExperience?.experience_end_date || null,

            video: data?.basicDetails?.video || '',
            secondary_video: data?.basicDetails?.secondary_video || '',

            career_industry: data?.careerGoal?.career_industry || '',
            career_field: data?.careerGoal?.career_field || '',
            career_role: data?.careerGoal?.career_role || '',
            noc: data?.careerGoal?.noc || '',
          }}
          validationSchema={jobFormValidation}
          onSubmit={handleSubmit}
        >
          {({ handleReset, isSubmitting, setFieldValue, values }) => {
            return (
              <Form>
                <div className="flex justify-end">
                  <ToggleButton name="isPrivate" label="Profile Private" />
                </div>
                {/* ------------------Personal Information--------------- */}
                <div>
                  <div className="text-2xl font-bold mb-5">
                    Personal Information
                  </div>
                  <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5">
                    <TextField
                      type="text"
                      label="firstname"
                      name="firstname"
                      placeholder="Enter first name"
                      onChange={(e) =>
                        setFieldValue('firstname', e.target.value)
                      }
                    />
                    <TextField
                      type="text"
                      label="lastname"
                      name="lastname"
                      placeholder="Enter last name"
                      onChange={(e) =>
                        setFieldValue('lastname', e.target.value)
                      }
                    />

                    <div className="mb-4">
                      <div className="text-sm text-gray-500 capitalize">
                        Profile
                      </div>
                      <Field name="profile_pic">
                        {({ field }) => (
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
                              className="border border-gray-400 border-b-2 focus:border-b-4 focus:border-b-blue rounded mt-1 px-2 py-2 w-full cursor-pointer"
                            >
                              <span className="px-2 py-1 border border-black rounded bg-grayLight">
                                Choose file
                              </span>{' '}
                              {data
                                ? values.profile_pic.name ||
                                  data?.basicDetails?.profile_pic?.split('/')[1]
                                : 'No file chosen'}
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

                    <DateField label="Date of Birth" name="dob" />

                    <RadioGroup
                      name="gender"
                      label="Gender"
                      options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'other', label: 'Other' },
                      ]}
                    />

                    <TextField
                      type="text"
                      label="nationality"
                      name="nationality"
                      placeholder="Enter nationality"
                      onChange={(e) =>
                        setFieldValue('nationality', e.target.value)
                      }
                    />

                    <DropDown
                      label="Country"
                      name="current_country"
                      options={countryData}
                      onChange={(e) => handleChangeCountry(e, setFieldValue)}
                    />

                    <DropDown
                      label="Current State"
                      name="current_state"
                      options={stateOptions}
                      onChange={(e) =>
                        handleChangeState(e, setFieldValue, values)
                      }
                    />

                    <DropDown
                      label="Current City"
                      name="current_city"
                      options={cityOptions}
                      onChange={(e) =>
                        setFieldValue('current_city', e.target.value)
                      }
                    />
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Contact No
                      </label>
                      <PhoneInput
                        name="contact_no"
                        value={values.contact_no}
                        onChange={(value) => setFieldValue('contact_no', value)}
                        className="rounded mt-1 w-full"
                      />
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

                    <DropDown
                      label="Job preferred location"
                      name="job_preferred_location"
                      options={provinceData}
                      onChange={(e) =>
                        setFieldValue('job_preferred_location', e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* ------------------International Education--------------- */}
                <div>
                  <div className="text-2xl font-bold my-5">
                    International Education
                  </div>
                  <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5">
                    <DropDown
                      label="Level of Education"
                      name="level_of_education"
                      options={levelOfEducation}
                      onChange={(e) =>
                        setFieldValue('level_of_education', e.target.value)
                      }
                    />
                    <DropDown
                      label="Field of Study"
                      name="field_of_study"
                      options={fieldOfStudy}
                      onChange={(e) =>
                        setFieldValue('field_of_study', e.target.value)
                      }
                    />
                    <DropDown
                      label="Year of Graduation"
                      name="year_of_graduation"
                      options={years}
                      onChange={(e) =>
                        setFieldValue('year_of_graduation', e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* ------------------Canadian Education--------------- */}
                <div>
                  <div className="text-2xl font-bold my-5">
                    Canadian Education
                  </div>
                  <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5">
                    <DropDown
                      label="College/University"
                      name="university"
                      options={universityData}
                      onChange={(e) =>
                        setFieldValue('university', e.target.value)
                      }
                    />
                    <DropDown
                      label="City"
                      name="city"
                      options={currentCity}
                      onChange={(e) => setFieldValue('city', e.target.value)}
                    />
                    <DropDown
                      label="Level of Education"
                      name="level_of_education_canadian"
                      options={levelOfEducation}
                      onChange={(e) =>
                        setFieldValue(
                          'level_of_education_canadian',
                          e.target.value,
                        )
                      }
                    />
                    <DropDown
                      label="Field of Study"
                      name="field_of_study_canadian"
                      options={fieldOfStudy}
                      onChange={(e) =>
                        setFieldValue('field_of_study_canadian', e.target.value)
                      }
                    />
                    <DropDown
                      label="Year of completion"
                      name="year_of_completion"
                      options={years}
                      onChange={(e) =>
                        setFieldValue('year_of_completion', e.target.value)
                      }
                    />
                    <TextField
                      type="text"
                      label="gpa"
                      name="gpa"
                      placeholder="10"
                      onChange={(e) => setFieldValue('gpa', e.target.value)}
                    />
                  </div>
                </div>

                {/* -------------Skills------------- */}
                <div className="text-2xl font-bold my-5">Skills</div>

                {/* Skill 1 */}
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-4 gap-x-5">
                  <DropDown
                    label="Core Skills"
                    name="core_skill_one"
                    options={skillData.map((skill) => ({
                      name: skill.core_skills,
                      id: skill.core_skills,
                    }))}
                    onChange={(e) => {
                      setFieldValue('core_skill_one', e.target.value)
                      handleCoreSkillsChange(e.target.value, 'first')
                    }}
                  />

                  <div>
                    <div
                      htmlFor="subSkill"
                      className="text-sm text-gray-500 capitalize"
                    >
                      Sub Skills
                    </div>
                    <Multiselect
                      className="border-gray-400 border-b-2 focus:border-b-4 focus:border-b-blue rounded mt-1 w-full"
                      options={subSkillsFirst?.map((subSkill) => ({
                        name: subSkill,
                        id: subSkill,
                      }))}
                      selectedValues={values.sub_skills_one.map((skill) => ({
                        name: skill,
                        id: skill,
                      }))}
                      onSelect={(selectedList) => {
                        const coreSkills = selectedList.map((item) => item.name)
                        setFieldValue('sub_skills_one', coreSkills)
                      }}
                      onRemove={(selectedList) => {
                        const coreSkills = selectedList.map((item) => item.name)
                        setFieldValue('sub_skills_one', coreSkills)
                      }}
                      displayValue="name"
                      name="sub_skills_one"
                    />
                    <ErrorMessage
                      name={'sub_skills_one'}
                      component="div"
                      className="text-xs text-red-500 ml-1 mt-1"
                    />
                  </div>
                </div>

                {/* Skill 2 */}
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-4 gap-x-5">
                  <DropDown
                    label="Core Skills"
                    name="core_skill_second"
                    options={skillData.map((skill) => ({
                      name: skill.core_skills,
                      id: skill.core_skills,
                    }))}
                    onChange={(e) => {
                      setFieldValue('core_skill_second', e.target.value)
                      handleCoreSkillsChange(e.target.value, 'second')
                    }}
                  />

                  <div>
                    <div
                      htmlFor="subSkill"
                      className="text-sm text-gray-500 capitalize"
                    >
                      Sub Skills
                    </div>
                    <Multiselect
                      className="border-gray-400 border-b-2 focus:border-b-4 focus:border-b-blue rounded mt-1 w-full"
                      options={subSkillsSecond?.map((subSkill) => ({
                        name: subSkill,
                        id: subSkill,
                      }))}
                      selectedValues={values?.sub_skills_second?.map(
                        (skill) => ({
                          name: skill,
                          id: skill,
                        }),
                      )}
                      onSelect={(selectedList) => {
                        const coreSkills = selectedList.map((item) => item.name)
                        setFieldValue('sub_skills_second', coreSkills)
                      }}
                      onRemove={(selectedList) => {
                        const coreSkills = selectedList.map((item) => item.name)
                        setFieldValue('sub_skills_second', coreSkills)
                      }}
                      displayValue="name"
                      name="sub_skills_second"
                    />
                    <ErrorMessage
                      name={'sub_skills_second'}
                      component="div"
                      className="text-xs text-red-500 ml-1 mt-1"
                    />
                  </div>
                </div>

                {/* Skill 3 */}
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-4 gap-x-5">
                  <DropDown
                    label="Core Skills"
                    name="core_skill_third"
                    options={skillData.map((skill) => ({
                      name: skill.core_skills,
                      id: skill.core_skills,
                    }))}
                    onChange={(e) => {
                      setFieldValue('core_skill_third', e.target.value)
                      handleCoreSkillsChange(e.target.value, 'third')
                    }}
                  />

                  <div>
                    <div
                      htmlFor="subSkill"
                      className="text-sm text-gray-500 capitalize"
                    >
                      Sub Skills
                    </div>
                    <Multiselect
                      className="border-gray-400 border-b-2 focus:border-b-4 focus:border-b-blue rounded mt-1 w-full"
                      options={subSkillsThird?.map((subSkill) => ({
                        name: subSkill,
                        id: subSkill,
                      }))}
                      selectedValues={values?.sub_skills_third?.map(
                        (skill) => ({
                          name: skill,
                          id: skill,
                        }),
                      )}
                      onSelect={(selectedList) => {
                        const coreSkills = selectedList.map((item) => item.name)
                        setFieldValue('sub_skills_third', coreSkills)
                      }}
                      onRemove={(selectedList) => {
                        const coreSkills = selectedList.map((item) => item.name)
                        setFieldValue('sub_skills_third', coreSkills)
                      }}
                      displayValue="name"
                      name="sub_skills_third"
                    />
                    <ErrorMessage
                      name={'sub_skills_third'}
                      component="div"
                      className="text-xs text-red-500 ml-1 mt-1"
                    />
                  </div>
                </div>

                {/* -------------Work Experience------------- */}
                <div>
                  <div className="text-2xl font-bold my-5">Work Experience</div>
                  {workExperiences.map((experience, index) => (
                    <div key={index}>
                      <div className="text-lg font-semibold capitalize">
                        {index + 1}.{' '}
                        {experience.work_experience_company_name ||
                          'New Experience'}
                      </div>
                      <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5">
                        <DropDownValue
                          label="Year"
                          name={`work_experience_year_${index}`}
                          options={years}
                          value={experience.work_experience_year}
                          onChange={(e) =>
                            handleChangeExperience(
                              index,
                              'work_experience_year',
                              e.target.value,
                            )
                          }
                        />
                        <DropDownValue
                          label="Industry"
                          name={`work_experience_industry_${index}`}
                          value={experience.work_experience_industry}
                          options={industriesData.map((industry) => ({
                            value: industry.name,
                            name: industry.name,
                          }))}
                          onChange={(e) => {
                            handleSubIndustryChange(e, index) // Update sub-industry options
                            handleChangeExperience(
                              index,
                              'work_experience_industry',
                              e.target.value,
                            )
                          }}
                        />
                        <DropDownValue
                          label="Sub Industry"
                          name={`work_experience_sub_industry_${index}`}
                          value={experience.work_experience_sub_industry}
                          options={subIndustryOptions[index] || []}
                          onChange={(e) =>
                            handleChangeExperience(
                              index,
                              'work_experience_sub_industry',
                              e.target.value,
                            )
                          }
                        />
                        <DropDownValue
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
                        <DropDownValue
                          label="City"
                          name={`work_experience_city_${index}`}
                          value={experience.work_experience_city}
                          options={currentCity}
                          onChange={(e) =>
                            handleChangeExperience(
                              index,
                              'work_experience_city',
                              e.target.value,
                            )
                          }
                        />
                        <TextFieldValue
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

                        {/* ---------Start Date------------- */}
                        <div>
                          <div
                            htmlFor={`experience_start_date_${index}`}
                            className="text-sm text-gray-500 capitalize"
                          >
                            Start Date
                          </div>
                          <Field
                            type="date"
                            label="Start Date"
                            name={`experience_start_date_${index}`}
                            value={
                              experience.experience_start_date?.split('T')[0]
                            }
                            onChange={(e) =>
                              handleChangeExperience(
                                index,
                                'experience_start_date',
                                e.target.value,
                              )
                            }
                            className="border border-gray-400 border-b-2 focus:border-b-4 focus:border-b-blue rounded mt-1 p-2 w-full"
                          />
                          <ErrorMessage
                            name={`experience_start_date_${index}`}
                            component="div"
                            className="text-xs text-red-500 ml-1 mt-1"
                          />
                        </div>

                        {/* ---------End Date------------- */}
                        <div>
                          <div
                            htmlFor={`experience_end_date_${index}`}
                            className="text-sm text-gray-500 capitalize"
                          >
                            End Date
                          </div>
                          <Field
                            type="date"
                            label="End Date"
                            name={`experience_end_date_${index}`}
                            value={
                              experience.experience_end_date?.split('T')[0]
                            }
                            onChange={(e) =>
                              handleChangeExperience(
                                index,
                                'experience_end_date',
                                e.target.value,
                              )
                            }
                            className="border border-gray-400 border-b-2 focus:border-b-4 focus:border-b-blue rounded mt-1 p-2 w-full"
                          />
                          <ErrorMessage
                            name={`experience_end_date_${index}`}
                            component="div"
                            className="text-xs text-red-500 ml-1 mt-1"
                          />
                        </div>

                        <TextArea
                          name={`desc_${index}`}
                          label="Accomplishments"
                          value={experience.accomplishments_id?.desc}
                          onChange={(e) =>
                            handleChangeExperience(
                              index,
                              'desc',
                              e.target.value,
                            )
                          }
                        />
                        <div className="flex items-center justify-between gap-x-2 relative">
                          <div className="w-full">
                            <TextFieldValue
                              type="text"
                              label="Email"
                              name={`email_${index}`}
                              value={
                                experience?.accomplishments_id?.email || ''
                              }
                              placeholder="Enter accomplishments email"
                              onChange={(e) => {
                                handleChangeExperience(
                                  index,
                                  'email',
                                  e.target.value,
                                )
                              }}
                            />
                          </div>

                          <div
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                          >
                            <div className="cursor-pointer mb-2 md:mb-0 bg-blue-700 bg-blue focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm h-5 w-5 text-center text-white">
                              !
                            </div>
                          </div>

                          {tooltipVisible[index] && (
                            <div className="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg right-6">
                              We send email verification to this email
                              <div className="tooltip-arrow" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-red-500 ml-1 -mt-4 mb-4">
                    {experienceError}
                  </div>
                  <div
                    className="bg-blue px-4 py-2 text-white rounded w-[160px]"
                    onClick={handleAddExperience}
                  >
                    + Add Experience
                  </div>
                </div>

                {/* Introduction video upload */}
                <div className="my-4 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5">
                  <div>
                    <div
                      htmlFor="video"
                      className="text-sm text-gray-500 capitalize"
                    >
                      Video
                    </div>
                    <VideoUploader
                      defaultVideo={data?.basicDetails?.video}
                      onVideoUpload={(url) => setFieldValue(`video`, url)}
                      defaultSecondaryVideo={data?.basicDetails?.secondary_video}
                      onSecondaryVideoUpload={(url) => setFieldValue(`secondary_video`, url)}
                    />
                    <ErrorMessage
                      name={'video'}
                      component="div"
                      className="text-xs text-red-500 ml-1 mt-1"
                    />
                  </div>
                </div>
                {/* -------------Career Goals------------- */}
                <div>
                  <div className="text-2xl font-bold my-5">Career Goals</div>
                  <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-5">
                    <DropDown
                      label="Industry"
                      name="career_industry"
                      options={industriesData.map((industry) => ({
                        value: industry.name,
                        name: industry.name,
                      }))}
                      onChange={(e) =>
                        setFieldValue('career_industry', e.target.value)
                      }
                    />
                    <DropDown
                      label="Field"
                      name="career_field"
                      options={fieldOfStudy}
                      onChange={(e) =>
                        setFieldValue('career_field', e.target.value)
                      }
                    />
                    <DropDown
                      label="Role"
                      name="career_role"
                      options={[
                        { name: '1' },
                        { name: '2' },
                        { name: '3' },
                        { name: '4' },
                      ]}
                      onChange={(e) =>
                        setFieldValue('career_role', e.target.value)
                      }
                    />
                    <DropDown
                      label="NOC"
                      name="noc"
                      options={nocData.map((noc) => ({
                        value: noc.classTitle,
                        name: noc.classTitle,
                      }))}
                      onChange={(e) => setFieldValue('noc', e.target.value)}
                    />
                  </div>
                </div>

                {/* --------------Submit button------------------- */}
                <div className="flex justify-end gap-x-5">
                  <button
                    type="reset"
                    onClick={() => {
                      handleReset()
                      resetWorkExperiences()
                    }}
                    className={`flex gap-x-2 justify-end items-center rounded w-auto py-2 px-10 mt-10 bg-gray-400`}
                  >
                    <span className="text-white text-base font-bold">
                      Reset
                    </span>
                  </button>
                  <button
                    disabled={isSubmitting || imgError === '' ? false : true}
                    type="submit"
                    className={`flex gap-x-2 justify-end items-center rounded w-auto py-2 px-10 mt-10 bg-blue`}
                  >
                    <span className="text-white text-base font-bold">
                      {isSubmitting ? <Loader /> : data ? 'Update' : 'Submit'}
                    </span>
                  </button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default Information
