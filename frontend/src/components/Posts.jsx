

import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import PostSkeleton from "./PostSkeleton ";



const Posts = ({ feedType }) => {



	const { posts, userPosts, isLoading, likedPosts, feedPosts, postSuccess } = useSelector((store) => store.post)

	
	const dispatch = useDispatch()

	/* useEffect(() => {

		if (postSuccess) {
		
			dispatch(resetPostSuccessFlag({ type: 'RESET_POST_SUCCESS_FLAG' }));
			window.location.reload()

		}
	}, [postSuccess, dispatch]) */


	if (isLoading) {
		return <PostSkeleton />

	}
	return (
		<>


			{!isLoading && feedType === 'posts' && <>
				{userPosts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
				<div>
					{userPosts?.map((post) => (
						<Post key={post._id} post={post} person={post.user} />
					))}

				</div>
			</>
			}


			{!isLoading && feedType === 'likes' && <>
				{likedPosts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
				<div>
					{likedPosts?.map((post) => (

						<Post key={post._id} post={post} person={post.user} />
					))}

				</div>
			</>
			}

			{!isLoading && feedType === 'forYou' && <>
				{posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
				<div>
					{posts?.map((post) => (
						<Post key={post._id} post={post} person={post.user} />

					))}

				</div>
			</>
			}


			{!isLoading && feedType === 'following' && <>
				{feedPosts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
				<div>
					{feedPosts?.map((post) => (
						<Post key={post._id} post={post} person={post.user} />

					))}

				</div>
			</>
			}



		</>
	)


};
export default Posts;