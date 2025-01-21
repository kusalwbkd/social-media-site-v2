import { Link } from "react-router-dom";

import FollowUnFollow from "./FollowUnFollow";



const RightPanel = ({suggestedUsers}) => {


	if(suggestedUsers?.length === 0) {
		return <div className=" md:w-64 w-0"></div>
	}

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					
					
					{suggestedUsers?.map((user) => (
							<Link
								to={`/home/profile/${user?.username}`}
								className='flex items-center justify-between gap-4'
								key={user?._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user?.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user?.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user?.username}</span>
									</div>
								</div>
								<div>
									<FollowUnFollow user={user}  text={'Follow'}/>									
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;