import React, { useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdDriveFileRenameOutline, MdOutlineMail, MdPassword } from "react-icons/md";
import { FormInput, Logo, SubmitBtn } from "../components";
import { toast } from "react-toastify";
import { registerUserAction } from '../features/user/UserSlice';
import { useDispatch, useSelector } from 'react-redux';

const initialState = {
	username: '',
	password: '',
	email: '',
	fullName: ''
}



const Signup = () => {
	const disptch = useDispatch()
	const { isLoading, isSignupSuccess } = useSelector((store) => store.user);

	const [values, setValues] = useState(initialState);
	const handleClick = (e) => {
		e.preventDefault()
		const name = e.target.name
		const value = e.target.value
		setValues({ ...values, [name]: value })



	}

	const handleSubmit = (e) => {
		const { username, password, email, fullName } = values;
		e.preventDefault()
		if (!(username) || !(password) || !(email) || !(fullName)) {
			toast.error('Please Fill Out All Fields');
			return;
		} else {
			disptch(registerUserAction({ username, password, email, fullName }))
		}
	}

	const navigate = useNavigate()

	useEffect(() => {
		if (isSignupSuccess) {
			setValues('')
			setTimeout(() => {
				navigate('/')
			}, 3000);
		}

	}, [isSignupSuccess, navigate])

	return (
		<div className='max-w-screen-xl mx-auto  grid grid-cols-1 h-screen px-10 '>
			<Logo />
			<form onSubmit={handleSubmit} className='mx-auto grid grid-cols-1 justify-center items-center'>
				<div className=' grid grid-cols-1 mx-auto md:mx-20 '>

					<h1 className='text-4xl font-extrabold text-white'>Sign in to your account.</h1>

					<div className=' mt-6 grid grid-cols-1 gap-4 mb-6'  >

						<FormInput icon={<FaUser />} name={'username'} value={values.username} placeholder={'username'} type={'text'} handleClick={handleClick} />

						<FormInput icon={<MdOutlineMail />} name={'email'} value={values.email} placeholder={'Email'} type={'email'} handleClick={handleClick} />
						<FormInput icon={<MdDriveFileRenameOutline />} name={'fullName'} value={values.fullName} placeholder={'Full Name'} type={'text'} handleClick={handleClick} />
						<FormInput icon={<MdPassword />} name={'password'} value={values.password} placeholder={'password'} type={'password'} handleClick={handleClick} />

					</div>
					<SubmitBtn text={'Sign Up'} disabled={isLoading} />

				</div>
				<div className=' grid grid-cols-1  md:mx-20'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/' className='btn rounded-full btn-primary text-white btn-outline' >
						Sign In
					</Link>
				</div>
			</form>
		</div>
	);
}

export default Signup