import React from 'react'

import { useDispatch } from 'react-redux'
import { followUnfollowAction } from '../features/user/UserSlice'

const FollowUnFollow = ({user,text}) => {
  const dispatch = useDispatch()

    const followUnFollowUser=(id)=>{
	    dispatch(followUnfollowAction(id))
	}
  return (
    <button
    className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
    onClick={(e)=>{
        e.preventDefault(),
        followUnFollowUser(user?._id)
    }
        
    
    }
>
    {text}
</button>
  )
}

export default FollowUnFollow