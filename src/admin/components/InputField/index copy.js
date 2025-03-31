import { ErrorMessage, Field, useField } from 'formik'
import { DateFormat } from '../../utils/dateFormat'
import { useEffect, useRef, useState } from 'react'

export const TextField = ({
  label,
  type,
  name,
  placeholder,
  onChange,
  disabled,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <div htmlFor={name} className="text-sm text-gray-500 capitalize">
          {label}
        </div>
      )}
      <Field
        type={type}
        id={name}
        name={name}
        className="border border-gray-400 border-b-2 focus:border-b-4 focus:border-b-blue rounded mt-1 p-2 w-full"
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled ? true : false}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-500 ml-1 mt-1"
      />
    </div>
  )
}

export const TextFieldValue = ({
  label,
  type,
  name,
  placeholder,
  onChange,
  disabled,
  value,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <div htmlFor={name} className="text-sm text-gray-500 capitalize">
          {label}
        </div>
      )}
      <Field
        type={type}
        id={name}
        name={name}
        value={value && value}
        className="border border-gray-400 border-b-2 focus:border-b-4 focus:border-b-blue rounded mt-1 p-2 w-full"
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled ? true : false}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-500 ml-1 mt-1"
      />
    </div>
  )
}

export const DateField = ({ label, name, placeholder, disabled }) => {
  return (
    <div className="relative w-full mb-4">
      <div htmlFor={name} className="text-sm text-gray-500 capitalize">
        {label}
      </div>
      <Field
        type="date"
        format="yyyy-mm-dd"
        id={name}
        name={name}
        className="border border-gray-400 border-b-2 focus:border-b-4 focus:border-b-blue rounded mt-1 p-2 w-full"
        placeholder={placeholder}
        component={DateFormat}
        disabled={disabled ? true : false}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-500 ml-1 mt-1"
      />
    </div>
  )
}

export const RadioGroup = ({ name, options, label, disabled }) => {
  const [field, meta, helpers] = useField(name)

  return (
    <div className="mb-4">
      <div htmlFor={name} className="text-sm text-gray-500 capitalize">
        {label}
      </div>
      <div
        className="flex gap-x-2 items-center"
        role="group"
        aria-labelledby={`${name}-group`}
      >
        {options.map((option) => (
          <label className="" key={option.value}>
            <Field
              type="radio"
              name={name}
              value={option.value}
              checked={field.value === option.value}
              onChange={() => helpers.setValue(option.value)}
              disabled={disabled ? true : false}
            />
            <span className="mx-1">{option.label}</span>
          </label>
        ))}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-500 ml-1 mt-1"
      />
    </div>
  )
}

export const DropDown = ({ label, name, options, onChange, disabled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref to the dropdown

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOptions = options
    ? options.filter(
        (o) =>
          o &&
          typeof o.name === 'string' &&
          o.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelectChange = (value) => {
    setSearchTerm(value); // Set search term to the selected value
    onChange({ target: { name, value } }); // Call onChange with selected value
    setIsOpen(false); // Close dropdown
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-4 relative" ref={dropdownRef}>
      {label && (
        <label htmlFor={name} className="text-sm text-gray-500 capitalize">
          {label}
        </label>
      )}
      <div className="mt-1">
        <input
          type="text"
          placeholder={`Search ${label}`}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)} // Ensure dropdown opens on focus
          className="border border-gray-400 rounded px-2 py-2.5 w-full"
          disabled={disabled}
        />
        {isOpen && (
          <div className="absolute bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-auto z-10">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((o, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectChange(o.name)} // Use o.name for display
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                >
                  {o.name}
                </div>
              ))
            ) : (
              <div className="px-2 py-1 text-gray-500">No options found</div>
            )}
          </div>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-500 ml-1 mt-1"
      />
    </div>
  );
};

export const DropDownValue = ({ label, name, value, options, onChange, disabled }) => {

  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null) // Ref to the dropdown

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredOptions = options
    ? options.filter(
        (o) =>
          o &&
          typeof o.name === 'string' &&
          o.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const handleSelectChange = (value) => {
    setSearchTerm(value) // Set search term to the selected value
    onChange({ target: { name, value } }) // Call onChange with selected value
    setIsOpen(false) // Close dropdown
  }

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="mb-4 relative" ref={dropdownRef}>
      {label && (
        <label htmlFor={name} className="text-sm text-gray-500 capitalize">
          {label}
        </label>
      )}
      <div className="mt-1">
        <input
          type="text"
          placeholder={`Search ${label}`}
          value={searchTerm || value}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          className="border border-gray-400 rounded px-2 py-2.5 w-full"
          disabled={disabled}
        />
        {isOpen && (
          <div className="absolute bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-auto z-10">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((o, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectChange(o.name)} // Use o.name for display
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                >
                  {o.name}
                </div>
              ))
            ) : (
              <div className="px-2 py-1 text-gray-500">No options found</div>
            )}
          </div>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-500 ml-1 mt-1"
      />
    </div>
  )
}

// export const DropDownValue = ({
//   label,
//   name,
//   options,
//   onChange,
//   disabled,
//   value,
// }) => {
//   return (
//     <div className="mb-4">
//       {label && (
//         <div htmlFor={name} className="text-sm text-gray-500 capitalize">
//           {label}
//         </div>
//       )}
//       <Field
//         as="select"
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="border border-gray-400 border-b-2 focus:border-b-4 focus:border-b-blue rounded mt-1 px-2 py-2.5 w-full"
//         disabled={disabled ? true : false}
//       >
//         <option value="">Select {label}</option>
//         {options &&
//           options.map((o, i) => (
//             <option key={i} value={o.value}>
//               {o.name}
//             </option>
//           ))}
//       </Field>
//       <ErrorMessage
//         name={name}
//         component="div"
//         className="text-xs text-red-500 ml-1 mt-1"
//       />
//     </div>
//   )
// }

export const TextArea = ({
  label,
  name,
  placeholder,
  onChange,
  disabled,
  value,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <div htmlFor={name} className="text-sm text-gray-500 capitalize">
          {label}
        </div>
      )}
      <Field
        as="textarea"
        id={name}
        name={name}
        defaultValue={value}
        className="border border-gray-400 border-b-2 focus:border-b-4 focus:border-b-blue rounded mt-1 p-2 w-full"
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled ? true : false}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-500 ml-1"
      />
    </div>
  )
}

export const ToggleButton = ({ label, name, disabled }) => {
  return (
    <div>
      <label className="inline-flex items-center cursor-pointer">
        <Field
          type="checkbox"
          id={name}
          name={name}
          className="sr-only peer"
          disabled={disabled ? true : false}
        />
        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
        <span className="text-sm text-gray-500 capitalize ml-2">{label}</span>
      </label>
    </div>
  )
}

export const Checkbox = ({ label, name, disabled, onChange }) => {
  return (
    <div className="w-full whitespace-nowrap">
      <Field
        type="checkbox"
        id={name}
        name={name}
        disabled={disabled ? true : false}
        onChange={onChange}
        className="cursor-pointer w-4 h-4 text-red-900 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <span className="text-sm text-gray-500 capitalize ml-2">{label}</span>
    </div>
  )
}
