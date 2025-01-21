import React, { useRef, useState } from 'react'
import { MdEdit } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { updateUserImages } from '../features/user/UserSlice';

const ChangeImageComponent = ({ user, isMyProfile }) => {
	const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverImg" && setCoverImg(reader.result);
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};
	const dispatch = useDispatch()
	const handleSubmit = (e) => {
		e.preventDefault()
		dispatch(updateUserImages({ coverImg, profileImg }))
	}

	return (
		<form encType="multipart/form-data" onSubmit={handleSubmit}>
			<div className='relative group/cover'>
				<img
					src={coverImg || user?.coverImg || "/cover.png"}
					className='h-52 w-full object-cover'
					alt='cover image'
				/>


				{isMyProfile && (
					<>
						<div
							className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
							onClick={() => coverImgRef.current.click()}
						>
							<MdEdit className='w-5 h-5 text-white' />
						</div>


						<input
							type='file'
							hidden
							name="coverImg"
							ref={coverImgRef}
							onChange={(e) => handleImgChange(e, "coverImg")}
						/>
						<input
							type='file'
							hidden
							ref={profileImgRef}
							name="profileImg"
							onChange={(e) => handleImgChange(e, "profileImg")}
						/>
					</>
				)}

				{/* USER AVATAR */}
				<div className='avatar absolute -bottom-16 left-4'>
					<div className='w-32 rounded-full relative group/avatar'>
						<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
						<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
							{isMyProfile && <MdEdit
								className='w-4 h-4 text-white'
								onClick={() => profileImgRef.current.click()}
							/>}


						</div>
					</div>
				</div>
			</div>
			<div className='flex justify-end px-4 mt-5'  >


				{(coverImg || profileImg) && (
					<button
						className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
						//onClick={(e)=>e.preventDefault()}
						type="submit"
					>
						Update
					</button>
				)}
			</div>
		</form>
	)
}

export default ChangeImageComponent