import * as yup from 'yup'
import { isValidPhoneNumber } from 'react-phone-number-input'

export const signInValidation = yup.object({
  email: yup.string().required('Email is required!'),
  password: yup.string().required('Password is required!'),
})

export const signupValidation = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email!')
    .matches(/@[^.]*\./)
    .required('Email is required!'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
})

export const otpVerifyValidation = yup.object({
  otp: yup
    .string()
    .required('OTP is required')
    .length(4, 'OTP must be exactly 4 digits'),
})

export const forgotPasswordValidation = yup.object({
  email: yup.string().required('Email is required!'),
})

export const forgotPasswordOTPVerifyValidation = yup.object({
  email: yup.string().required('Email is required!'),
  otp: yup
    .string()
    .required('OTP is required')
    .length(4, 'OTP must be exactly 4 digits'),
})

export const resetPasswordValidation = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
})

export const jobFormValidation = yup.object({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  profile_pic: yup.mixed().nullable().required('Profile picture is required'),
  // profile_pic: yup
  //   .mixed()
  //   .nullable()
  //   .required('Profile picture is required')
  //   .test('fileType', 'Only JPEG, JPG, or PNG files are allowed', (value) => {
  //     if (!value) return false
  //     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  //     return allowedTypes.includes(value.type)
  //   }),
  dob: yup
    .date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other'], 'Select a valid gender')
    .required('Gender is required'),
  nationality: yup.string().required('Nationality is required'),
  current_state: yup.string().required('Current state is required'),
  current_city: yup.string().required('Current city is required'),
  contact_no: yup
    .string()
    .required('Contact number is required')
    .test('is-valid-phone', 'Contact number is not valid', (value) => {
      return value ? isValidPhoneNumber(value) : false
    }),
  contact_email_id: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  job_preferred_location: yup
    .string()
    .required('Preferred job location is required'),

  // level_of_education: yup.string().required('Level of education is required'),
  // field_of_study: yup.string().required('Field of study is required'),
  // year_of_graduation: yup
  //   .number()
  //   .required('Year of graduation is required')
  //   .min(1900, 'Year must be after 1900')
  //   .max(new Date().getFullYear(), 'Year cannot be in the future'),

  // university: yup.string().when('isCanadianEducation', {
  //   is: (isCanadianEducation) => isCanadianEducation,
  //   then: (schema) => schema.required('University is required!'),
  // }),
  // city: yup.string().when('isCanadianEducation', {
  //   is: (isCanadianEducation) => isCanadianEducation,
  //   then: (schema) => schema.required('City is required!'),
  // }),
  // level_of_education_canadian: yup.string().when('isCanadianEducation', {
  //   is: (isCanadianEducation) => isCanadianEducation,
  //   then: (schema) =>
  //     schema.required('Level of education canadian is required!'),
  // }),
  // field_of_study_canadian: yup.string().when('isCanadianEducation', {
  //   is: (isCanadianEducation) => isCanadianEducation,
  //   then: (schema) => schema.required('Field of study canadian is required!'),
  // }),
  // year_of_completion: yup.string().when('isCanadianEducation', {
  //   is: (isCanadianEducation) => isCanadianEducation,
  //   then: (schema) => schema.required('Year of completion is required'),
  // }),
  // gpa: yup.string().when('isCanadianEducation', {
  //   is: (isCanadianEducation) => isCanadianEducation,
  //   then: (schema) =>
  //     schema
  //       .required('GPA is required')
  //       .min(1, 'GPA must be at least 1')
  //       .max(10, 'GPA cannot be more than 10'),
  // }),

  core_skills: yup
    .array()
    .of(yup.string().required('Core skill is required'))
    .min(1, 'At least one core skill must be selected'),
  sub_skills: yup
    .array()
    .of(yup.string().required('Sub skill is required'))
    .min(1, 'At least one sub skill must be selected'),

  // career_industry: yup.string().required('Career industry is required'),
  career_role: yup.string().required('Career role is required'),
  // career_field: yup.string().required('Career field is required'),
  // noc_number: yup.string().required('NOC number is required'),
  video: yup.mixed().nullable().required('Video is required'),
    // college_name: yup.string().required('Field of study is required'),
    // global_gpa: yup.string().required('Field of study is required'),
    // credential_no: yup.string().required('Field of study is required'),
    // credential_institute_name: yup.string().required('Field of study is required'),
    // credential_assesed: yup.boolean().required('Field of study is required'),
  // video: yup
  //   .mixed()
  //   .nullable()
  //   .required('Video is required')
  //   .test('fileType', 'Only MP4, AVI, or MOV files are allowed', (value) => {
  //     if (!value) return false // Return false if no file is selected
  //     const allowedTypes = ['video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/webm']
  //     return allowedTypes.includes(value.type)
  //   }),

  // work_experience_year_0: yup.string().required('Year is required'),
  // work_experience_industry_0: yup.string().required('Industry is required'),
  // work_experience_sub_industry_0: yup.string().required('Sub-industry is required'),
  // work_experience_country_0: yup.string().required('Country is required'),
  // work_experience_city_0: yup.string().required('City is required'),
  // work_experience_job_title_0: yup.string().required('Job title is required'),
  // work_experience_company_name_0: yup.string().required('Company name is required'),
  // experience_start_date: yup.date().required('Start date is required').nullable(),
  // experience_end_date: yup.date()
  //   .nullable()
  //   .when('experience_start_date', (startDate, schema) => {
  //     return startDate ? schema.min(startDate, 'End date must be after start date') : schema;
  //   }),
  // accomplishments_0: yup.string().required("Accomplishment required!"),
})
