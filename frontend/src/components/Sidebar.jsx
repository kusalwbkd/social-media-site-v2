
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { CiLogout } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { logoutUser } from "../features/user/UserSlice";

const Sidebar = () => {



	const { user } = useSelector((store) => store.user);

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const handleLogOut = async () => {
		try {
			const response = await customFetch.get('/auth/logout')
			navigate('/')
			dispatch(logoutUser())


		} catch (error) {
			toast.error(error?.response?.data?.msg);
			return error
		}

	}


	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52  '>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/home' className='flex justify-center md:justify-start'>
					<Logo />

				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/home'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
				{/* 	<li className='flex justify-center md:justify-start'>
						<Link
							to='/home/notifications'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li> */}

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`./profile/${user?.username}`}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<button

							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
							onClick={handleLogOut}
						>
							<CiLogout className='w-6 h-6' />
							<span className='text-lg hidden md:block'>LogOut</span>
						</button>
					</li>
				</ul>


			</div>
		</div>
	);
};
export default Sidebar;