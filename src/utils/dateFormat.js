import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export const DateFormat = ({ field, form, ...props }) => {
  const { name } = field
  const { setFieldValue } = form

  return (
    <DatePicker
      selected={field.value ? new Date(field.value) : null}
      onChange={(date) =>
        setFieldValue(name, date ? date.toISOString().split('T')[0] : '')
      }
      dateFormat="yyyy-MM-dd"
      placeholderText="YYYY-MM-DD"
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      popperClassName="some-custom-class"
      popperPlacement="top-end"
      popperModifiers={[
        {
          name: "myModifier",
          fn(state) {
            // Do something with the state
            return state;
          },
        },
      ]}
      {...props}
    />
  )
}

export const ViewDateFormat = ({ date }) => {
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString)
    return dateObj.toISOString().split('T')[0] // Formats to YYYY-MM-DD
  }

  return <span>{formatDate(date)}</span>
}

export const ExperienceDateFormat = ({
  field,
  form,
  defaultValue,
  ...props
}) => {
  const { name } = field
  const { setFieldValue } = form

  // Set the initial value if available
  const initialValue = defaultValue ? new Date(defaultValue) : null

  return (
    <DatePicker
      selected={field.value ? new Date(field.value) : initialValue}
      onChange={(date) =>
        setFieldValue(name, date ? date.toISOString().split('T')[0] : '')
      }
      dateFormat="yyyy-MM-dd"
      placeholderText="YYYY-MM-DD"
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      {...props}
    />
  )
}
