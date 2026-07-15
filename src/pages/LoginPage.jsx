import { GoogleLogin } from '@react-oauth/google'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AxiosCall } from '../services/AxiosCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, registerSchema } from '../schemas/userSchema'

const LoginPage = ({ registerUser }) => {
    const schema = registerUser ? registerSchema : loginSchema
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })
    const [passwordType, setPasswodType] = useState('password')
    const navigate = useNavigate()

    useEffect(() => {
        localStorage.clear()
    }, [])

    const handleRegisterLogin = async (data) => {
        console.log("here");
        const { fullName, email, phoneNumber, password } = data
        if (registerUser) {
            try {
                if (fullName && email && phoneNumber) {
                    const inputBody = {
                        email,
                        contactNo: phoneNumber,
                        name: fullName,
                        // referalCode: null
                    }
                    const result = await AxiosCall('POST', 'user/register', inputBody)
                    if (result?.status == 200) {

                        reset()
                        navigate('/login')
                    } else {
                        console.log(result?.response?.data?.message);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const dataBody = {
                    username: email,
                    password
                }
                const result = await AxiosCall('POST', 'user/login', dataBody)
                if (result?.status == 200 && result?.data?.data?.userDetails?.role === 'client') {
                    localStorage.setItem('civilacquireToken', result?.data?.data?.token)
                    navigate('/')
                } else {
                    if (result?.status == 200) {
                        console.log("Access denied");
                        return
                    }
                    if (result?.response?.data?.message) {
                        console.log(result?.response?.data?.message);
                    } else {
                        console.log(result?.message);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }



    const handleSuccess = (credentialResponse) => {
        // const decoded = jwtDecode(credentialResponse.credential);
        // console.log(decoded);
        // Handle successful login
    };

    const handleError = () => {
        console.log('Login Failed');
        // Handle login failure
    };
    return (
        <>
            <div className="flex  h-screen justify-center flex-col items-center">
                <div className="">
                    {/* <img src="" alt="" /> */}
                    <h2 className="mt-5 text-center text-xl/9 font-bold tracking-tight">{registerUser ? 'Sign Up' : 'Sign In'}</h2>
                </div>
                <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(handleRegisterLogin)}>
                        {registerUser && <div>
                            <label htmlFor="fullName" className="block text-xs/6 font-medium text-gray-500 uppercase">
                                Name
                            </label>
                            <div className="mt-2">
                                <input
                                    {...register('fullName')}
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-xl border border-gray-300 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#177896] focus:outline-[#177896] focus:border-[#177896] sm:text-sm/6 px-3 py-2"
                                />
                            </div>
                            <span className='text-red-500 text-xs text-center'>{errors.fullName?.message}</span>
                        </div>}
                        <div className='mt-2'>
                            <label htmlFor="email" className="block text-xs/6 font-medium text-gray-500 uppercase">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    {...register('email')}
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#177896] focus:outline-[#177896] focus:border-[#177896] sm:text-sm/6"
                                />
                            </div>
                        </div>
                        <span className='text-red-500 text-xs text-center'>{errors.email?.message}</span>
                        {registerUser && <div className='mt-2'>
                            <label htmlFor="username" className="block text-xs/6 font-medium text-gray-500 uppercase">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    {...register('username')}
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    autoComplete="tel"
                                    className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#177896] focus:outline-[#177896] focus:border-[#177896] sm:text-sm/6"
                                />
                            </div>
                            <span className='text-red-500 text-xs text-center'>{errors.username?.message}</span>
                        </div>}

                        <div className='mt-2'>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-xs/6 font-medium text-gray-500 uppercase">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a onClick={() => {
                                        console.log("jk");
                                        // setOpenTypeEmailModal(true)
                                    }} href="#" className="font-semibold text-[#177896] hover:text-indigo-400">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2 flex">
                                <input
                                    {...register('password')}
                                    id="password"
                                    name="password"
                                    type={passwordType}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-l-xl border border-gray-300 bg-white px-3 py-2 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#177896] focus:outline-[#177896] focus:border-[#177896] sm:text-sm/6"
                                />
                                <button onClick={() => passwordType == 'password' ? setPasswodType('text') : setPasswodType('password')}
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-r-xl hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-[#177896] focus:outline-[#177896] focus:border-[#177896]">
                                    {
                                        passwordType == 'password' ?
                                            <i className="fa-regular fa-eye-slash"></i>
                                            :
                                            <i className="fa-regular fa-eye"></i>
                                    }
                                </button>
                            </div>
                            <span className='text-red-500 text-xs text-center'>{errors.password?.message}</span>
                        </div>
                        <div className='mt-8'>
                            <button disabled={isSubmitting} type='submit' className="flex w-full justify-center items-center rounded-xl bg-[#09637E] px-3 py-2 text-sm/6 font-semibold text-white hover:bg-[#177896] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#177896]"
                            >{registerUser ? 'Sign Up' : 'Sign in'} {isSubmitting && 'Submitting...'}</button>
                        </div>
                    </form>
                    <p className="mt-10 text-center text-sm/6 text-gray-400">
                        {registerUser ? 'Already have an account?  ' : 'Don\'t have an account?  '}
                        <Link to={registerUser ? '/login' : '/register'} href="#" className="font-semibold text-[#177896] hover:text-indigo-400">
                            {registerUser ? 'Sign In' : 'Sign Up'}
                        </Link>
                    </p>
                </div>
                <div className='mb-3'>or</div>
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} width="210px" theme='outline ' shape='pill' />
            </div>
        </>
    )
}

export default LoginPage