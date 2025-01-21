
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import {  useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate, useNavigation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createPostAction} from "../features/post/PostSlice";


const initialState = {
	img: null,
	text: ''

}

const CreatePost = () => {


	const dispatch = useDispatch()
	const imgRef = useRef(null);
	const { user } = useSelector((store) => store.user);
	const { postSuccess } = useSelector((store) => store.post);
	const [values, setValues] = useState(initialState)
	const navigation = useNavigation()
	const navigate = useNavigate()
	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === 'img' && files.length > 0) {
			// Handle image input
			setValues((prev) => ({ ...prev, img: files[0] }));
		} else {
			// Handle text input
			setValues((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault()
		if (values.img || values.text) {
			setValues(initialState)
			dispatch(createPostAction({ img: values.img, text: values.text }))
		} else {
			toast.error('please post something')
		}
	}



	return (

		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={user?.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' encType='multipart/form-data' onSubmit={handleSubmit}  >
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					name="text"
					value={values.text}
					onChange={handleChange}
				/>
				{values.img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setValues((prev) => ({ ...prev, img: null }));
								imgRef.current.value = null;
							}}
						/>
						<img src={URL.createObjectURL(values.img)} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' hidden ref={imgRef} name="img" onChange={handleChange} />

					<button className='btn btn-primary rounded-full btn-sm text-white px-4' type="submit" disabled={navigation.state === 'submitting'}>
						submit
					</button>
				</div>

			</form>
		</div>
	);
};
export default CreatePost;