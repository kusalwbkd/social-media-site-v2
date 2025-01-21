import { FaEdit, FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import {  useRef, useState } from "react";
import {  Link, useLocation, useNavigate, useNavigation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { formatPostDate } from "../utils/date";
import { RxCross1 } from "react-icons/rx";
import { addCommentAction, deletePostAction, LikeUnlikePostAction } from "../features/post/PostSlice";

const Post = ({ post, }) => {


	

	const postOwner = post?.user;


	const navigation = useNavigation()
	const formattedDate = formatPostDate(post?.createdAt)
	const { user } = useSelector((store) => store.user);
	const { pathname } = useLocation()
	const [text, setText] = useState("");
   const dispatch=useDispatch()
   const isSubmitting = navigation.state === 'submitting'
		const navigate = useNavigate()
		//const {postSuccess}= useSelector((store) => store.social);

		const dialogRef = useRef(null);
        const postRef=useRef([])
	const handleDeletePost =  (id) => {

	dispatch(deletePostAction(id))
	};
	const handdleComment = (id) => {

       dispatch(addCommentAction({id,text}))
	
	}
	const handleLikePost =  (id,e) => {
		e.stopPropagation();
		
		dispatch(LikeUnlikePostAction(id))
		
	};

	const handleDeleteComment = async (postId, commentId) => {
		try {
			await customFetch.delete(`/posts/${postId}/comments/${commentId}`)
			toast.success('comment deleted')
			navigate('/home')
		} catch (error) {
			toast.error(error?.response?.data?.msg);
			return error
		}
	}

/*  useEffect(()=>{
	if(postSuccess){
		dispatch(getAllPostsAction())
		dispatch(resetPostSuccessFlag());
		postRef.current.focus()
		
	}
 },[postSuccess,dispatch]) */
 
	return (
		<div className='flex gap-2 items-start p-4 border-b border-gray-700' 
		
		>
			<div className='avatar'>
				<Link to={`/home/profile/${postOwner?.username}`} className='w-8 rounded-full overflow-hidden'>
					<img src={postOwner?.profileImg || "/avatar-placeholder.png"} />
				</Link>
			</div>

			<div className='flex flex-col flex-1'>
				<div className='flex gap-2 items-center'>
					<Link to={`/home/profile/${postOwner?.username}`} className='font-bold'>
						{postOwner?.fullName}
					</Link>
					<span className='text-gray-700 flex gap-1 text-sm'>
						<Link to={`/profile/${postOwner?.username}`}>@{postOwner?.username}</Link>
						<span>·</span>
						<span>{formattedDate}</span>
					</span>
					{postOwner?.username === user.username && (
						<span className='flex justify-end flex-1'>
							<FaTrash className='cursor-pointer hover:text-red-500' disabled={isSubmitting} onClick={() => handleDeletePost(post?._id)} />
						</span>
					)}
				</div>

				<div className='flex flex-col gap-3 overflow-hidden '>
					<span>{post?.text}</span>
					{post?.img && (
						<img
							src={post?.img}
							className='h-80 object-contain rounded-lg border border-gray-700'
							alt=''
						/>
					)}
				</div>

				<div className='flex justify-between mt-3'>
					<div className='flex gap-4 items-center w-2/3 justify-between'>
						<div
							className='flex gap-1 items-center cursor-pointer group'
							onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
						>
							<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
							<span className='text-sm text-slate-500 group-hover:text-sky-400'>
								{post?.comments?.length}
							</span>
						</div>

						<dialog id={`comments_modal${post?._id}`} className='modal border-none outline-none' ref={dialogRef}>
							<div className='modal-box rounded border border-gray-600'>
								<div className="flex justify-between items-center mb-4">
								<h3 className='font-bold text-lg'>Comments</h3>
								<RxCross1 className=" self-center cursor-pointer hover:text-red-500 h-6 w-6"
								onClick={()=>dialogRef.current.close()}
								/>
								</div>

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
													{(postOwner?.username === user.username || comment?.user?.username === user.username)

														&&

														<>
															<FaEdit className=' ml-4 cursor-pointer hover:text-green-500' />



															<FaTrash className=' ml-4 cursor-pointer hover:text-red-500' onClick={() => handleDeleteComment(post?._id, comment?._id)} />
														</>
													}


												</div>
												<div className='text-sm'>{comment?.text}</div>
											</div>
										</div>
									))}
								</div>


								<form
									className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
									onSubmit={(e) =>{

										e.preventDefault()
									handdleComment(post?._id);
									}}

								>
									<textarea
										className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
										placeholder='Add a comment...'
										name="text"
										value={text}
										onChange={(e) => setText(e.target.value)}

									/>
									{/* ////comment */}
								<button type="button"
								 className='btn btn-primary rounded-full btn-sm text-white px-4' 
								 disabled={isSubmitting}
								 
								 onClick={(e) => {
										e.preventDefault()
										handdleComment(post?._id)

									}}>
										{isSubmitting ? (
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

						{postOwner?.username === user.username && <Link to={`./edit-post/${post?._id}`} className='flex gap-1 items-center group cursor-pointer'>
							<CiEdit it className='w-6 h-6  text-slate-500 group-hover:text-green-500' />

						</Link>}
                            	{/* ////like */}
						<div className='flex gap-1 items-center group cursor-pointer' onClick={(e) => handleLikePost(post?._id,e)} ref={postRef}>
							{!post?.likes?.includes(user._id) && (
								<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
							)}
							{post?.likes?.includes(user._id) && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

							<span
								className={`text-sm group-hover:text-pink-500 ${post?.likes?.includes(user._id) ? "text-pink-500" : " text-slate-500"
									}`}
							>
								{post?.likes?.length}
							</span>
						</div>
					</div>

				</div>

			</div>

		</div>
	)
};
export default Post;


