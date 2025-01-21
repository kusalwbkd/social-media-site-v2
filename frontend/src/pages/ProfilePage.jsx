import { useEffect, useRef, useState } from "react";
import { Link, redirect, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import EditProfileModal from "./EditProfileModal";
import { FollowUnFollow, Post, Posts, PostSkeleton } from "../components";
import customFetch from "../utils/customFetch";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ChangeImageComponent from "../components/ChangeImageComponent";
import { formatMemberSinceDate } from "../utils/date";
import { getUsersAction } from "../features/user/UserSlice";
import { getLikedPosts, getUserPosts } from "../features/post/PostSlice";






const ProfilePage = () => {

	const { userProfile: user, user: owner, isLoading,suggestedUsers} = useSelector((store) => store.user)
	const { userPosts } = useSelector((store) => store.post)
	const dispatch = useDispatch()
	const { username } = useParams()
/* 	useEffect(() => {
		dispatch(getUsersAction(username))
		
	}, [username]) */


	useEffect(() => {
		dispatch(getUsersAction(username))
		
	}, [username,suggestedUsers,dispatch]);

 	useEffect(() => {
		if (user) {
			dispatch(getUserPosts({ username }));
			dispatch(getLikedPosts({ user }));
		}
	}, [user, dispatch]); 

	const isMyProfile = user?.username === owner?.username
	const [feedType, setFeedType] = useState("posts");
	const memberSinceDate = formatMemberSinceDate(user?.createdAt)


	return (
		<>
			<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
                {isLoading && <PostSkeleton />}
				{!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p>
									<span className='text-sm text-slate-500'>{userPosts?.length} posts</span>
								</div>
							</div>
							< ChangeImageComponent user={user} isMyProfile={isMyProfile} />

							<div className='flex justify-end px-4 mt-5'  >
							{isMyProfile && < EditProfileModal user={user} />}

								{!isMyProfile && !owner.following.includes(user?._id) &&
									<FollowUnFollow user={user} text={'Follow'} />

								}

								{!isMyProfile && owner.following.includes(user?._id) &&
									<FollowUnFollow user={user} text={'UnFollow'} />

								}

							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<FaLink className='w-3 h-3 text-slate-500' />
												<a
													href={`${user?.link}`}
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>
													{user?.link}
												</a>
											</>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>

											{memberSinceDate}
										</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.following?.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followers?.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>


							</div>

							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}
					<Posts feedType={feedType} />
				</div>

			</div>

		</>
	)
}

export default ProfilePage;