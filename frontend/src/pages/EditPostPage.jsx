import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { PostSkeleton } from "../components";
import { SinglePostAction, UpdatePostAction } from "../features/post/PostSlice";


const EditPostPage = () => {
	const { id } = useParams()
	const dispatch = useDispatch()
	const { singlePost, isLoading, postSuccess } = useSelector((store) => store.post)
	const [img, setImg] = useState(null);
	const navigate = useNavigate()
	const imgRef = useRef(null);
	const [photo, setPhoto] = useState(null)
	const [values, setValues] = useState({ text: '', img: null });


	useEffect(() => {
		if (id) {

			dispatch(SinglePostAction(id))
		}

	}, [id, dispatch])

	useEffect(() => {
		if (singlePost) {
			setValues({ text: singlePost?.text || '', img: singlePost?.img  });
			setPhoto(singlePost?.img || null);
		}
	}, [singlePost, id, dispatch]);



	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setPhoto(null)
			setImg(file)

		}
	};

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

			dispatch(UpdatePostAction({ id, img: values.img, text: values.text }))

		} else {
			toast.error('please post something')
		}
	}

	if (isLoading) {
		return <PostSkeleton />
	}
	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700 flex-1 flex-grow'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={singlePost?.user?.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' encType='multipart/form-data' onSubmit={handleSubmit} >
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					name="text"
					defaultValue={singlePost?.text}
					onChange={handleChange}
				/>
				{(img || photo) && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null)
								setPhoto(null)
								setValues((prev) => ({ ...prev, img: null }));
								imgRef.current.value = null;
							}}
						/>

						<img src={photo || URL.createObjectURL(img)} className='w-full mx-auto h-72 object-contain rounded' />
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
					<input type='file' hidden ref={imgRef} name="img" onChange={(e) => {
						handleImgChange(e)
						setPhoto(null)
						handleChange(e)

					}} />

					<button className='btn btn-primary rounded-full btn-sm text-white px-4' type="submit">
						submit
					</button>
				</div>

			</form>
		</div>
	);
};
export default EditPostPage;