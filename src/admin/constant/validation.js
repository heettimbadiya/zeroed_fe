import * as yup from 'yup'

export const signInValidation = yup.object({
  userName: yup.string().required('User name is required!'),
  password: yup.string().required('Password is required!'),
})

