import React from 'react'

const FormInput = ({type,name,placeholder,icon,value,handleClick}) => {
  return (
    <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
{icon}
    <input
        type={type}
        className='grow '
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleClick}
    />
</label>
  )
}

export default FormInput