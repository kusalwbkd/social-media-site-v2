import React from 'react'

const SubmitBtn = ({text,disabled}) => {
  return (
    <button className='btn rounded-full btn-primary text-white' type="submit" disabled={disabled}>
      {text}
    </button>
  )
}

export default SubmitBtn