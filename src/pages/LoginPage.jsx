import { GoogleLogin } from '@react-oauth/google'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const LoginPage = ({ register }) => {
    const {registerIn , handleRegisterIn} = useForm()
    const [passwordType, setPasswodType] = useState('password')
    const [registerUser, setRegisterUser] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
    })
    const [loginCredentials, setLoginCredentials] = useState({
        password: '',
        loginEmail: ''
    })
    const [openTypeEmailModal, setOpenTypeEmailModal] = useState("")
    const [emailForForgetPassword, setEmailForForgetPassword] = useState('')
    const [errorText, setErrorText] = useState('')
    const [otpModal, setOtpModal] = useState(false)
    const [isLoadingOfOtpSubmit, setIsLoadingOfOtpSubmit] = useState(false)
    const [isLoadingLogin, setIsLoadingLogin] = useState(false)
    const [emailNotification, setEmailNotification] = useState(false)
    const [newPasswordType, setNewPasswordType] = useState("password");
    const [reTypePasswordType, setReTypePasswordType] = useState("password");
    const [passwordErrorText, setPasswordErrorText] = useState("");
    const [passwordTextForValidation, setPasswordTextForValidation] = useState("");
    const [emailValidationErrorText, setEmailValidationErrorText] = useState("");
    const [passwordChange, setPasswordChange] = useState({
        newPassword: "",
        confirmPassword: ""
    })
    const [otp, setOtp] = useState(Array(6).fill(''));
    const inputRefForOtp = useRef([])
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        localStorage.clear()
    }, [])

    useEffect(() => {
        setRegisterUser({
            fullName: '',
            email: '',
            phoneNumber: '',
        })
        setLoginCredentials({
            loginEmail: '',
            password: ''
        })
        setEmailValidationErrorText('')
    }, [location?.pathname])

    const validateEmail = (mail) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(mail);
    }

    const handleRegisterInput = (e) => {
        const { name, value } = e.target
        setRegisterUser({ ...registerUser, [name]: value })
    }

    const handleRegisterLogin = async (e) => {
        setIsLoadingLogin(true)
        e.preventDefault()
        const { fullName, email, phoneNumber } = registerUser
        const { loginEmail, password } = loginCredentials
        if (register) {
            try {
                if (!email) {
                    setEmailValidationErrorText('Email is required')
                    return
                }
                if (!validateEmail(email)) {
                    setEmailValidationErrorText('Enter a valid email address')
                    return
                }
                if (fullName && email && phoneNumber) {
                    const inputBody = {
                        email,
                        contactNo: phoneNumber,
                        name: fullName,
                        // referalCode: null
                    }
                    const result = await AxiosCall('POST', 'user/client', inputBody)
                    if (result?.status == 200) {
                        setEmailNotification(true)
                        setRegisterUser({
                            fullName: '',
                            email: '',
                            phoneNumber: '',
                        })
                        navigate('/login')
                    } else {
                        FireToast(result?.response?.data?.message, "error")
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoadingLogin(false)
            }
        } else {
            if (!loginEmail) {
                setEmailValidationErrorText('Email is required')
                return
            }
            if (!validateEmail(loginEmail)) {
                setEmailValidationErrorText('Enter a valid email address')
                return
            }
            if (!password) {
                setPasswordTextForValidation("Password is required")
                return
            }
            if (password.length < 4) {
                // password should be 8 or more character
                setPasswordTextForValidation("Password must contain atleast 4 characters")
                return
            }
            try {
                const dataBody = {
                    username: loginEmail,
                    password
                }
                navigate('/') 
                return
                const result = await AxiosCall('POST', 'user/login', dataBody)
                if (result?.status == 200 && result?.data?.data?.userDetails?.role === 'client') {
                    FireToast(result?.data?.message, "success")
                    localStorage.setItem('civilacquireToken', result?.data?.data?.token)
                    navigate('/')
                } else {
                    if (result?.status == 200) {
                        FireToast("Access denied", "error")
                        return
                    }
                    if (result?.response?.data?.message) {
                        FireToast(result?.response?.data?.message, "error")
                    } else {
                        FireToast(result?.message, "error")
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoadingLogin(false)
            }
        }
    }

    const handleSubmitOfForgetPassword = async () => {
        setIsLoadingOfOtpSubmit(false)
        try {
            if (!emailForForgetPassword) {
                setErrorText("Email is required")
                return
            }
            if (!validateEmail(emailForForgetPassword)) {
                setErrorText("Enter valid email address")
                return
            }
            const dataBody = {
                email: emailForForgetPassword,
                baseUrl: FrontEndUrl,
                type: 'mobile'
            }
            const result = await AxiosCall('POST', 'user/forgotPassword', dataBody)
            if (result.status == 200) {
                setOtpModal(true)
                setOpenTypeEmailModal(false)
                setEmailForForgetPassword('')
            } else {
                FireToast(result?.response?.data?.message, "error")
                if (result?.status === 409) {
                    setOtpModal(true)
                    setOpenTypeEmailModal(false)
                    setEmailForForgetPassword('')
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingOfOtpSubmit(false)
        }
    }

    const hanldeCloseOfOtpModal = () => {
        setOtpModal(false);
        setOtp(Array(6).fill(''))
        setPasswordChange({
            newPassword: "",
            confirmPassword: ""
        })
    }

    const handleSubmitOfOtp = async () => {
        const finalOtp = otp.join("")
        const { newPassword, confirmPassword } = passwordChange
        try {
            setIsLoadingOfOtpSubmit(true)
            if (newPassword !== confirmPassword) {
                FireToast("Password mismatch found", "error")
            }
            const dataBody = {
                token: finalOtp,
                password: passwordChange?.confirmPassword
            }
            const result = await AxiosCall('PUT', `user/resetPassword`, dataBody);
            if (result.status == 200) {
                FireToast(result?.data?.message, "success")
                setOtpModal(false)
                setOtp(Array(6).fill(''))
            }
            else {
                FireToast("Password Reset Failed", "error")
                setOtpModal(false)
                setOtp(Array(6).fill(''))
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingOfOtpSubmit(false)
        }
    }

    const handleSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        console.log(decoded);
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
                    <img src="" alt="" />
                    <h2 className="mt-5 text-center text-xl/9 font-bold tracking-tight">{register ? 'Sign Up' : 'Sign In'}</h2>
                </div>
                <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleRegisterLogin}>
                        {register && <div>
                            <label htmlFor="fullName" className="block text-sm/6 font-medium text-gray-500">
                                Name
                            </label>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => handleRegisterInput(e)}
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border border-gray-300 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-none focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 px-3 py-2.5"
                                />
                            </div>
                        </div>}
                        <div className='mt-2'>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-500">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    value={register ? registerUser?.email : loginCredentials?.loginEmail}
                                    onChange={(e) => {
                                        if (register) {
                                            handleRegisterInput(e)
                                        } else {
                                            setLoginCredentials({ ...loginCredentials, loginEmail: e.target.value })
                                        }
                                    }
                                    }
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-none focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                />
                            </div>
                        </div>
                        {emailValidationErrorText && <span className='text-red-500 text-xs text-center'>{emailValidationErrorText}</span>}
                        {register && <div className='mt-2'>
                            <label htmlFor="phoneNumber" className="block text-sm/6 font-medium text-gray-500">
                                Phone Number
                            </label>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => handleRegisterInput(e)}
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    required
                                    autoComplete="tel"
                                    className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-none focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                />
                            </div>
                        </div>}

                        {!register && <div className='mt-2'>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-500">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a onClick={() => {
                                        setEmailForForgetPassword(registerUser?.email)
                                        setOpenTypeEmailModal(true)
                                    }} href="#" className="font-semibold text-indigo-500 hover:text-indigo-400">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2 flex">
                                <input
                                    onChange={(e) => {
                                        if (e.target.value !== '') {
                                            setPasswordTextForValidation('')
                                            setLoginCredentials({ ...loginCredentials, password: e.target.value })
                                        }
                                    }}
                                    id="password"
                                    name="password"
                                    type={passwordType}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-l-md border border-gray-300 bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 sm:text-sm/6"
                                />
                                <button onClick={() => passwordType == 'password' ? setPasswodType('text') : setPasswodType('password')}
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none">
                                    {
                                        passwordType == 'password' ?
                                            <i className="fa-regular fa-eye-slash"></i>
                                            :
                                            <i className="fa-regular fa-eye"></i>
                                    }
                                </button>
                            </div>
                            {passwordTextForValidation && <span className='text-red-500 text-xs text-center'>{passwordTextForValidation}</span>}
                        </div>}
                        <div className='mt-4'>
                            <button type='submit' className="flex w-full justify-center items-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >{register ? 'Sign Up' : 'Sign in'} {isLoadingLogin && <Spinner />}</button>
                        </div>
                    </form>
                    <p className="mt-10 text-center text-sm/6 text-gray-400">
                        {register ? 'Already have an account?  ' : 'Don\'t have an account?  '}
                        <Link to={register ? '/login' : '/register'} href="#" className="font-semibold text-indigo-500 hover:text-indigo-400">
                            {register ? 'Sign In' : 'Sign Up'}
                        </Link>
                    </p>
                </div>
                <div className='mb-3'>or</div>
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} width="210px" theme='outline ' shape='pill' />
            </div>
            {openTypeEmailModal &&
                <div
                    id="static-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    data-modal-backdrop="static"
                    className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm"
                >
                    <div className="relative w-full max-w-md mx-4">
                        <div className=" bg-white rounded-2xl shadow-lg overflow-hidden animate-scaleIn">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b rounded-t border-gray-200 ">
                                <h3 className="text-xl font-bold text-gray-900 ">
                                    <p>Forgot password</p>
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setOpenTypeEmailModal(false)}
                                    className="text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full p-2 transition"
                                // text-sm w-8 h-8 inline-flex justify-center items-center
                                >
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className='p-6'>
                                <p>Enter the email</p>
                                <div className='mb-3'>
                                    <input value={emailForForgetPassword}
                                        autoComplete='current-password'
                                        autoFocus
                                        required
                                        type="email"
                                        onChange={(e) => {
                                            if (e.target.value !== '')
                                                setErrorText('')
                                            setEmailForForgetPassword(e.target.value)
                                        }} className={`block w-full rounded border mt-4 border-gray-300 bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:ring-1  focus:outline-none  sm:text-sm/6 ${errorText ? 'focus:ring-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}`} placeholder='Email'
                                    // autoComplete="current-password"  
                                    />
                                    <div className="text-red-600 text-xs">
                                        {errorText}
                                    </div>
                                </div>
                                <div className='flex mb-3'>
                                    <input
                                        autoComplete='current-password'
                                        required
                                        onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value.trim() })}
                                        type={newPasswordType}
                                        placeholder='New Password'
                                        className='block w-full rounded-l-md border border-gray-300 bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 sm:text-sm/6' />
                                    <button onClick={() => newPasswordType == 'password' ? setNewPasswordType('text') : setNewPasswordType('password')}
                                        type="button"
                                        className="py-1.5 px-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none">
                                        {
                                            newPasswordType == 'password' ?
                                                <i className="fa-regular fa-eye-slash"></i>
                                                :
                                                <i className="fa-regular fa-eye"></i>
                                        }
                                    </button>
                                </div>

                                <div className='flex'>
                                    <input required onChange={(e) => {
                                        if (e.target.value.trim() == passwordChange.newPassword) {
                                            setPasswordErrorText("")
                                            setPasswordChange({ ...passwordChange, confirmPassword: e.target.value.trim() })
                                        } else {
                                            setPasswordErrorText("Password Mismatch")
                                        }
                                    }} type={reTypePasswordType} placeholder='Confirm Password' className={`block w-full rounded-l-md border border-gray-300 bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:ring-1 focus:outline-none sm:text-sm/6 ${passwordErrorText ? 'focus:border-red-500 focus:ring-red-500' : 'focus:border-indigo-500 focus:ring-indigo-500'}`} />
                                    <button onClick={() => reTypePasswordType == 'password' ? setReTypePasswordType('text') : setReTypePasswordType('password')}
                                        type="button"
                                        className="py-1.5 px-3 text-sm font-medium text-gray-700 bg-gray-100 border  border-gray-300 rounded-r-md hover:bg-gray-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none " >
                                        {
                                            reTypePasswordType == 'password' ?
                                                <i className="fa-regular fa-eye-slash"></i>
                                                :
                                                <i className="fa-regular fa-eye"></i>
                                        }
                                    </button>
                                </div>
                                <p className='text-xs text-red-500 ps-2 pt-1' >{passwordErrorText}</p>
                            </div>
                            <div className="flex justify-end  gap-3 p-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleSubmitOfForgetPassword}
                                    className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-600 transition"
                                >
                                    OK
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOpenTypeEmailModal(false)}
                                    className="px-5 py-2 text-sm font-medium text-white bg-gray-400 rounded-lg hover:bg-gray-700 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {otpModal &&
                <div
                    id="static-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    data-modal-backdrop="static"
                    className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm"
                >
                    <div className="relative w-full max-w-md mx-4 my-4">
                        <div className=" bg-white rounded-lg p-5 px-7 shadow-lg overflow-hidden animate-scaleIn">
                            {/* Header */}
                            <div className="flex items-center justify-center p-6 border-gray-200 ">
                                <div>
                                    <h3 className='text-center font-semibold text-xl'>Enter OTP</h3>
                                    <p className='text-center text-sm'>Your code was sent to you via Email</p>
                                    <div className="p-6 text-center">
                                        <div className='flex'>
                                            {
                                                otp?.map((_, index) => (
                                                    <input type="text" inputMode='numeric' pattern='[0-9]'
                                                        maxLength={1} className='passwordBox' value={otp[index]}
                                                        key={index} ref={ele => inputRefForOtp.current[index] = ele}
                                                        onChange={(e) => {
                                                            if (/^\d?$/.test(e.target.value)) {
                                                                const newArray = [...otp]
                                                                newArray[index] = e.target.value
                                                                setOtp(newArray)
                                                                if (e.target.value && index < otp.length - 1) {
                                                                    inputRefForOtp.current[index + 1]?.focus()
                                                                }
                                                            }
                                                        }} onKeyDown={(e) => {
                                                            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                                                const newArray = [...otp];
                                                                newArray[index - 1] = "";
                                                                setOtp(newArray);
                                                                inputRefForOtp.current[index - 1]?.focus();
                                                            }
                                                        }} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="flex justify-center gap-3 border-gray-200">
                                        <button
                                            type="button"
                                            onClick={hanldeCloseOfOtpModal}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSubmitOfOtp}
                                            className="px-4 py-2 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-600 transition"
                                        >
                                            Submit {isLoadingOfOtpSubmit && <Spinner />}
                                        </button>
                                    </div>
                                    <p className='text-center text-sm  my-4'>Didn't receive otp? <a className='underline text-indigo-500' href=''>Request again</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

            {emailNotification &&
                <div
                    id="static-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    data-modal-backdrop="static"
                    className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm"
                >
                    <div className="relative w-full max-w-md mx-4">
                        <div className=" bg-white rounded-2xl shadow-lg overflow-hidden animate-scaleIn">
                            <div className="p-8 text-center ">
                                <i class="fa-solid fa-circle-check fa-2xl text-green-600 "></i>
                                <h3 className="text-lg font-semibold text-gray-900 mt-5">Registration Successful</h3>
                                <p className="mt-3 text-gray-600">
                                    The password has been sent to your email address!
                                </p>
                            </div>
                            <div className="flex justify-center gap-3 p-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setEmailNotification(false)}
                                    className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default LoginPage