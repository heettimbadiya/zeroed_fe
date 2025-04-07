import {ErrorMessage, Field, useField} from 'formik'
import {DateFormat} from '../../utils/dateFormat'
import {useEffect, useRef, useState} from 'react'
import Label from './label'

export const TextField = ({
                              label,
                              type,
                              name,
                              placeholder,
                              onChange,
                              disabled,
                              icon,
                              value
                          }) => {
    return (
        <div className="mb-4">
            {label && <Label label={label}/>}
            <div className="relative">
                <Field
                    type={type}
                    id={name}
                    {...(value ? {value} : {})}
                    name={name}
                    className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full"
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                />
                {icon && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </span>
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
            {label && <Label label={label}/>}
            <Field
                type={type}
                id={name}
                name={name}
                value={value && value}
                className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full"
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

export const DateField = ({label, name, placeholder, disabled, icon}) => {
    return (
        <div className="relative w-full mb-4">
            {label && <Label label={label}/>}
            <div className="relative">
                <Field
                    type="date"
                    format="yyyy-mm-dd"
                    id={name}
                    name={name}
                    className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full"
                    placeholder={placeholder}
                    component={DateFormat}
                    disabled={disabled ? true : false}
                />
                {icon && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </span>
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

export const RadioGroup = ({name, options, label, disabled}) => {
    const [field, meta, helpers] = useField(name)

    return (
        <div className="mb-4">
            {label && <Label label={label}/>}
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

export const DropDownInput = ({
                                  label,
                                  name,
                                  options,
                                  onChange,
                                  disabled,
                                  value,
                                  allowCustom = false, // New prop to allow custom input
                              }) => {
    const [searchTerm, setSearchTerm] = useState(value || '')
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        setSearchTerm(value || '')
    }, [value])

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

    const handleSelectChange = (option) => {
        setSearchTerm(option.name)
        onChange({target: {name, value: option.value}})
        setIsOpen(false)
    }

    const handleCustomInput = () => {
        if (allowCustom) {
            // Add the custom value to the dropdown or select it
            onChange({target: {name, value: searchTerm}})
            setIsOpen(false)
        }
    }

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
            {label && <Label label={label}/>}
            <div>
                <input
                    type="text"
                    placeholder={`Search ${label}`}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setIsOpen(true)}
                    className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full"
                    disabled={disabled}
                />
                {isOpen && (
                    <div className="absolute bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-auto z-10">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((o, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleSelectChange(o)} // Pass the whole object
                                    className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                                >
                                    {o.name}
                                </div>
                            ))
                        ) : (
                            <div className="px-2 py-1 text-gray-500">No options found</div>
                        )}
                        {allowCustom && !filteredOptions.some(o => o.name.toLowerCase() === searchTerm.toLowerCase()) && (
                            <div
                                onClick={handleCustomInput}
                                className="px-2 py-1 hover:bg-gray-200 cursor-pointer text-blue-600"
                            >
                                Add "{searchTerm}" for {label}
                            </div>
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

export const DropDown = ({
                             label,
                             name,
                             options,
                             onChange,
                             disabled,
                             value,
                         }) => {
    const [searchTerm, setSearchTerm] = useState(value || '')
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        setSearchTerm(value || '')
    }, [value])
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
    const handleSelectChange = (option) => {
        setSearchTerm(option.name)
        onChange({target: {name, value: option.value}})
        setIsOpen(false)
    }

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
            {label && <Label label={label}/>}
            <div>
                <input
                    type="text"
                    placeholder={`Search ${label}`}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setIsOpen(true)}
                    className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full"
                    disabled={disabled}
                />
                {isOpen && (
                    <div className="absolute bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-auto z-10">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((o, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleSelectChange(o)} // Pass the whole object
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
            {label && <Label label={label}/>}
            <Field
                as="textarea"
                id={name}
                name={name}
                defaultValue={value}
                className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full"
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

export const ToggleButton = ({label, name, disabled, onChange}) => {
    return (
        <div>
            <label className="inline-flex items-center cursor-pointer">
                <Field
                    type="checkbox"
                    id={name}
                    name={name}
                    className="sr-only peer"
                    disabled={disabled ? true : false}
                    onChange={(e) => onChange(e)}
                />
                <div
                    className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f3902a] focus:border-[#f3902a]"></div>
                {label && <Label label={label} className="ml-2"/>}
            </label>
        </div>
    )
}

export const Checkbox = ({label, name, disabled, onChange, checked}) => {
    return (
        <div className="whitespace-nowrap flex items-center">
            <Field
                type="checkbox"
                id={name}
                name={name}
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                className="cursor-pointer w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 checked:bg-primary checked:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-primary-700"
            />
            {label && <Label label={label} className="ml-2"/>}
        </div>
    )
}

export const DropDownInput1 = ({ label, name, onChange, disabled, value = [],placeholder }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedChips, setSelectedChips] = useState(value);
    const inputRef = useRef(null);

    useEffect(() => {
        setSelectedChips(value);
    }, [value]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && searchTerm.trim()) {
            event.preventDefault();
            if (!selectedChips.includes(searchTerm.trim())) {
                const newChips = [...selectedChips, searchTerm.trim()];
                setSelectedChips(newChips);
                onChange({ target: { name, value: newChips } });
            }
            setSearchTerm("");
        }
    };

    const handleDeleteChip = (chip) => {
        const updatedChips = selectedChips.filter((c) => c !== chip);
        setSelectedChips(updatedChips);
        onChange({ target: { name, value: updatedChips } });
    };

    return (
        <div className="mb-4 relative">
            {label && <Label label={label}/>}

            <div className="border border-text-border border-b-4 focus-within:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full flex flex-wrap items-center gap-2">

                {selectedChips.map((chip, index) => (
                    <div key={index} className="flex items-center bg-[#00C5FF] text-white px-2 py-1 rounded-full text-sm">
                        {chip}
                        <button
                            onClick={() => handleDeleteChip(chip)}
                            className="ml-2 text-white hover:text-red-300 focus:outline-none"
                        >
                            ✕
                        </button>
                    </div>
                ))}

                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border-none outline-none flex-1 min-w-[150px] bg-transparent text-gray-800 placeholder-gray-500"
                    disabled={disabled}
                />
            </div>
        </div>
    );
};