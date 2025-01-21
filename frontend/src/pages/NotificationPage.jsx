import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import LoadingSpinner from "../components/LoadingSpinner";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";


export const loader=async()=>{
	try {
		const {data}=await customFetch.get('/notifications')
       
		return data
	} catch (error) {
		toast.error(error?.response?.data?.msg);
		return error
	}
}

const NotificationPage = () => {
	const data=useLoaderData()
	const navigation=useNavigation()
	const isLoading=navigation.state==='loading'
	const navigate=useNavigate()
const{notifications}=data
	
	
const deleteNotifications=async()=>{
	try {
		await customFetch.delete('/notifications')
		toast.success('All notifications are deleted')
          navigate('/home/notifications')
	} catch (error) {
		toast.error(error?.response?.data?.msg);
		return error
	}
}

	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>

					{notifications.length>0 && 
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
						 <li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
							
						</ul>
					</div>
					}
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							<div>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;