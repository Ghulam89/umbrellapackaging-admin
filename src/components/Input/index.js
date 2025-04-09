import React from 'react'

const Input = ({
    label,
    placeholder,
    name,
    type,
    className,
    defaultValue,
    onChange,
    Icon,
    required

}) => {
    return (
        <div className=' relative'>
            <label for="first_name" className=' block mb-2 text-sm font-medium  text-gray-900'>{label}</label>
            <input  required={required} onChange={onChange} defaultValue={defaultValue} placeholder={placeholder} name={name} id={name} type={type} className={`  outline-none bg-lightGray  p-2.5 text-black placeholder:text-black rounded-md  ${className}`} />
            <div className=' absolute right-3 top-4'>
                <i>{Icon}</i>
            </div>
        </div>
    )
}

export default Input