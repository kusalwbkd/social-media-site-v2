import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { FormInput, Logo, SubmitBtn } from "../components";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction } from "../features/user/UserSlice";

const initialState = {
	username: '',
	password: ''
}
const SignIn = () => {
	const disptch = useDispatch()
	const { isLoading, user } = useSelector((store) => store.user);

	const [values, setValues] = useState(initialState);
	const handleClick = (e) => {
		e.preventDefault()
		const name = e.target.name
		const value = e.target.value
		setValues({ ...values, [name]: value })



	}

	const handleSubmit = (e) => {
		const { username, password } = values;
		e.preventDefault()
		if (!(username) || !(password)) {
			toast.error('Please Fill Out All Fields');
			return;
		} else {
			disptch(loginUserAction({ username, password }))
		}
	}

	const navigate = useNavigate()

	useEffect(() => {
		if (user?.username) {
			setTimeout(() => {
				navigate('/home')
			}, 3000);
		}

	}, [user, navigate])
	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10 '>
			<Logo />
			<form className='flex flex-col justify-center items-center mx-auto ' onSubmit={handleSubmit}>
				<div className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col   ' >

					<h1 className='text-4xl font-extrabold text-white'>Sign in to your account.</h1>
					<p>
						username: <span className=" text-bold">some</span>
					</p>

					<p>
						password: <span className=" text-bold">password</span>
					</p>

					<div className='flex gap-4 flex-wrap' >

						<FormInput icon={<FaUser />} name={'username'} placeholder={'username'} type={'text'} value={values.username} handleClick={handleClick} />

						<FormInput icon={<MdPassword />} name={'password'} placeholder={'password'} type={'password'} value={values.password} handleClick={handleClick} />
					</div>
					<SubmitBtn text={'Sign In'} disabled={isLoading} />

				</div>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4 '>
					<p className='text-white text-lg'>Don't have an account?</p>
					<Link to='/signup' className='btn rounded-full btn-primary text-white btn-outline w-full' >
						Register
					</Link>
				</div>
			</form>
		</div>
	);
};
export default SignIn;  