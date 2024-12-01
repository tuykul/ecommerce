import React, { useEffect, useState } from 'react'
import { PropagateLoader } from 'react-spinners'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { admin_login, messageClear } from '../../store/Reducers/authReducer'

const AdminLogin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth)
    const [state, setSatate] = useState({
        email: '',
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
        dispatch(admin_login(state))
    }
    const overrideStyle = {
        display: 'flex',
        margin: '0 auto',
        height: '24px',
        justifyContent: 'center',
        alignItems: "center"
    }
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            navigate('/')
        }
    }, [errorMessage, successMessage])
    return (
        <div className='min-w-screen min-h-screen bg-[#F9F6EE] flex justify-center items-center p-4'>
            <div className='w-full max-w-[400px] text-[#283046]'>
                <div className='bg-white p-8 rounded-2xl shadow-xl border border-[#AFE1AF]/20'>
                    {/* Logo & Title */}
                    <div className='text-center mb-6'>
                        <h1 className='text-2xl font-bold mb-2 flex items-center justify-center gap-2'>
                            <span className='text-[#FFC300]'>Admin</span>
                            <span>Nusantara Culinary</span>
                        </h1>
                        <p className='text-[#283046]/60 text-sm'>Selamat datang kembali, silakan masuk ke akun Anda</p>
                    </div>

                    <form onSubmit={submit} className='space-y-5'>
                        <div className='space-y-1'>
                            <label htmlFor="email" className='text-sm font-medium block'>Email</label>
                            <div className='relative'>
                                <input 
                                    onChange={inputHandle} 
                                    value={state.email} 
                                    className='w-full px-4 py-3 rounded-lg border border-[#AFE1AF] focus:border-[#FFC300] outline-none transition-all duration-300 text-[#283046] bg-[#F9F6EE]' 
                                    type="text" 
                                    name='email' 
                                    placeholder='Masukkan email Anda' 
                                    id='email' 
                                    required 
                                />
                            </div>
                        </div>

                        <div className='space-y-1'>
                            <label htmlFor="password" className='text-sm font-medium block'>Kata Sandi</label>
                            <div className='relative'>
                                <input 
                                    onChange={inputHandle} 
                                    value={state.password} 
                                    className='w-full px-4 py-3 rounded-lg border border-[#AFE1AF] focus:border-[#FFC300] outline-none transition-all duration-300 text-[#283046] bg-[#F9F6EE]' 
                                    type="password" 
                                    name='password' 
                                    placeholder='Masukkan kata sandi' 
                                    id='password' 
                                    required 
                                />
                            </div>
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
                            ) : 'Masuk'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className='text-center mt-6 text-sm text-[#283046]/60'>
                    © 2024 Nusantara Culinary. All rights reserved.
                </div>
            </div>
        </div>
    )
}
export default AdminLogin