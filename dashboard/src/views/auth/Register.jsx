import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AiOutlineGooglePlus, AiOutlineGithub } from 'react-icons/ai'
import { FiFacebook } from 'react-icons/fi'
import { CiTwitter } from 'react-icons/ci'
import { PropagateLoader } from 'react-spinners'
import { useDispatch, useSelector } from 'react-redux'
import { overrideStyle } from '../../utils/utils'
import { messageClear, seller_register } from '../../store/Reducers/authReducer'

const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth)
    const [state, setSatate] = useState({
        name: '',
        email: "",
        password: ''
    })
    const inputHandle = (e) => {
        setSatate({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const submit = (e) => {
        e.preventDefault()
        dispatch(seller_register(state))
    }
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            navigate('/')
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage])
    return (
        <div className='min-w-screen min-h-screen bg-[#F9F6EE] flex justify-center items-center p-4'>
            <div className='w-full max-w-[400px] text-[#283046]'>
                <div className='bg-white p-8 rounded-2xl shadow-xl border border-[#AFE1AF]/20'>
                    {/* Welcome Section */}
                    <div className='text-center mb-6'>
                        <h2 className='text-2xl font-bold mb-2'>Mulai Perjalanan Kuliner</h2>
                        <p className='text-[#283046]/60 text-sm'>Daftar dan mulai petualangan rasa nusantara Anda</p>
                    </div>

                    <form onSubmit={submit} className='space-y-4'>
                        <div className='space-y-1'>
                            <label htmlFor="name" className='text-sm font-medium block'>Nama Lengkap</label>
                            <input 
                                onChange={inputHandle} 
                                value={state.name} 
                                className='w-full px-4 py-3 rounded-lg border border-[#AFE1AF] focus:border-[#FFC300] outline-none transition-all duration-300 text-[#283046] bg-[#F9F6EE]' 
                                type="text" 
                                name='name' 
                                placeholder='Masukkan nama lengkap' 
                                required 
                            />
                        </div>

                        <div className='space-y-1'>
                            <label htmlFor="email" className='text-sm font-medium block'>Email</label>
                            <input 
                                onChange={inputHandle} 
                                value={state.email} 
                                className='w-full px-4 py-3 rounded-lg border border-[#AFE1AF] focus:border-[#FFC300] outline-none transition-all duration-300 text-[#283046] bg-[#F9F6EE]' 
                                type="email" 
                                name='email' 
                                placeholder='Masukkan email' 
                                required 
                            />
                        </div>

                        <div className='space-y-1'>
                            <label htmlFor="password" className='text-sm font-medium block'>Kata Sandi</label>
                            <input 
                                onChange={inputHandle} 
                                value={state.password} 
                                className='w-full px-4 py-3 rounded-lg border border-[#AFE1AF] focus:border-[#FFC300] outline-none transition-all duration-300 text-[#283046] bg-[#F9F6EE]' 
                                type="password" 
                                name='password' 
                                placeholder='Buat kata sandi' 
                                required 
                            />
                        </div>

                        <div className='flex items-center gap-2'>
                            <input 
                                type="checkbox" 
                                id="terms" 
                                className='w-4 h-4 text-[#FFC300] border-[#AFE1AF] rounded focus:ring-[#FFC300]' 
                                required 
                            />
                            <label htmlFor="terms" className='text-sm text-[#283046]/80'>
                                Saya setuju dengan {' '}
                                <a href="#" className='text-[#FFC300] hover:text-[#FF9900]'>Syarat & Ketentuan</a>
                            </label>
                        </div>

                        <button 
                            disabled={loader} 
                            className='w-full bg-gradient-to-r from-[#FFC300] to-[#FF9900] hover:from-[#FF9900] hover:to-[#FFC300] text-white font-medium rounded-lg px-4 py-3 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50'
                        >
                            {loader ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <PropagateLoader color='#fff' cssOverride={overrideStyle} />
                                    <span>Tunggu sebentar...</span>
                                </div>
                            ) : 'Daftar Sekarang'}
                        </button>

                        <p className='text-center text-sm'>
                            Sudah punya akun? {' '}
                            <Link to='/login' className='text-[#FFC300] hover:text-[#FF9900] font-medium'>
                                Masuk di sini
                            </Link>
                        </p>
                    </form>

                    {/* Social Register */}
                    <div className='mt-6'>
                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-[#AFE1AF]/20'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-2 bg-white text-[#283046]/60'>Atau daftar dengan</span>
                            </div>
                        </div>

                        <div className='mt-6 grid grid-cols-2 gap-3'>
                            {[
                                { icon: <AiOutlineGooglePlus className='text-xl' />, color: 'bg-red-500' },
                                { icon: <FiFacebook className='text-xl' />, color: 'bg-blue-500' },
                            ].map((social, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`${social.color} text-white h-10 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.05]`}
                                >
                                    {social.icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='text-center mt-6 text-sm text-[#283046]/60'>
                    <p>© 2024 Nusantara Culinary. All rights reserved.</p>
                    <p className='mt-1'>Jelajahi cita rasa nusantara dalam satu platform</p>
                </div>
            </div>
        </div>
    )
}

export default Register