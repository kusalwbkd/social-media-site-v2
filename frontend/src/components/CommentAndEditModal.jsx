import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { useNavigation } from 'react-router-dom'

const CommentAndEditModal = ({modal_name,post,state,setState,fn,type}) => {
    const navigation=useNavigation()
    const isSubmittimg=navigation.state==='submitting'
	
  return (
    <dialog id={`${modal_name}${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>{type}</h3>


									{type==='COMMENTS' && (
                                            <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
											{post?.comments?.length === 0 && (
												<p className='text-sm text-slate-500'>
													No comments yet 🤔 Be the first one 😉
												</p>
											)}
											{post?.comments?.map((comment) => (
												<div key={comment._id} className='flex gap-2 items-start'>
													<div className='avatar'>
														<div className='w-8 rounded-full'>
															<img
																src={comment?.user?.profileImg || "/avatar-placeholder.png"}
															/>
														</div>
													</div>
													<div className='flex flex-col'>
														<div className='flex items-center gap-1'>
															<span className='font-bold'>{comment?.user?.fullName}</span>
															<span className='text-gray-700 text-sm'>
																@{comment?.user?.username}
															</span>

															{}
															<FaTrash className=' ml-4 cursor-pointer hover:text-red-500'/>
														</div>
														<div className='text-sm'>{comment?.text}</div>
													</div>
												</div>
											))}
										</div>
									)}
									
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
									
										
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
										    name="text"
											value={state}
											onChange={(e) => setState(e.target.value)}
											
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4' onClick={(e)=>{
                                          e.preventDefault()
                                         fn(post?._id)
										}}>
											{isSubmittimg ? (
												<span className='loading loading-spinner loading-md'></span>
											) : (
												"Post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
  )
}

export default CommentAndEditModal