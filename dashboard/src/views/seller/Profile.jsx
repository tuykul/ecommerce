import React, { useEffect, useState } from 'react'
import { BsImages } from 'react-icons/bs'
import { FaEdit } from 'react-icons/fa'
import { PropagateLoader } from 'react-spinners'
import { FadeLoader } from 'react-spinners'
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import { overrideStyle } from '../../utils/utils'
import { profile_image_upload, messageClear, profile_info_add } from '../../store/Reducers/authReducer'
import { create_stripe_connect_account } from '../../store/Reducers/sellerReducer'
const Profile = () => {
    const [state, setState] = useState({
        division: '',
        district: '',
        shopName: '',
        sub_district: ''
    })
    const dispatch = useDispatch()
    const { userInfo, loader, successMessage } = useSelector(state => state.auth)

    const add_image = (e) => {
        if (e.target.files.length > 0) {
            const formData = new FormData()
            formData.append('image', e.target.files[0])
            dispatch(profile_image_upload(formData))
        }
    }
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            messageClear()
        }
    }, [successMessage])


    const add = (e) => {
        e.preventDefault()
        dispatch(profile_info_add(state))
    }

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    return (
        <div className="min-h-screen bg-[#F9F6EE] p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-[#AFE1AF]">
                    <h2 className="text-2xl font-semibold text-[#283046] mb-6">Profil Vendor</h2>
                    
                    {/* Image Upload */}
                    <div className="flex justify-center mb-8">
                        {userInfo?.image ? (
                            <label htmlFor="img" className="relative cursor-pointer">
                                <img src={userInfo.image} alt="Profile" className="w-64 h-64 rounded-lg object-cover" />
                                {loader && (
                                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                        <PropagateLoader color="#FFC300" />
                                    </div>
                                )}
                            </label>
                        ) : (
                            <label htmlFor="img" className="w-64 h-64 border-2 border-dashed border-[#AFE1AF] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#FFC300] transition-colors">
                                <BsImages className="w-12 h-12 text-[#283046] mb-2" />
                                <span className="text-[#283046]">Pilih Foto</span>
                            </label>
                        )}
                        <input type="file" id="img" className="hidden" />
                    </div>

                    {/* User Info */}
                    <div className="bg-[#F9F6EE] p-6 rounded-lg mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-[#283046]">Informasi Dasar</h3>
                            <button className="p-2 bg-[#FFC300] rounded-full hover:shadow-lg transition-shadow">
                                <FaEdit className="text-white" />
                            </button>
                        </div>
                        <div className="space-y-3 text-[#283046]">
                            <div className="flex justify-between">
                                <span className="font-medium">Nama:</span>
                                <span>{userInfo?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Email:</span>
                                <span>{userInfo?.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Status:</span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    {userInfo?.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shop Form */}
                    {!userInfo?.shopInfo ? (
                        <form className="space-y-4">
                            <div>
                                <label className="block text-[#283046] mb-2">Nama Warung</label>
                                <input 
                                    type="text"
                                    className="w-full p-3 border border-[#AFE1AF] rounded-lg bg-white focus:border-[#FFC300] outline-none text-[#283046]"
                                    placeholder="Masukkan nama warung"
                                    value={state.shopName}
                                    onChange={inputHandle}
                                    name="shopName"
                                />
                            </div>
                            <div>
                                <label className="block text-[#283046] mb-2">Provinsi</label>
                                <input 
                                    type="text"
                                    className="w-full p-3 border border-[#AFE1AF] rounded-lg bg-white focus:border-[#FFC300] outline-none text-[#283046]"
                                    placeholder="Masukkan provinsi"
                                    value={state.division}
                                    onChange={inputHandle}
                                    name="division"
                                />
                            </div>
                            <button 
                                className="w-full py-3 bg-[#FFC300] text-white rounded-lg hover:shadow-lg transition-shadow"
                                disabled={loader}
                            >
                                {loader ? <PropagateLoader color="#fff" size={10} /> : 'Simpan Profil'}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-[#F9F6EE] p-6 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-[#283046]">Informasi Warung</h3>
                                <button className="p-2 bg-[#FFC300] rounded-full hover:shadow-lg transition-shadow">
                                    <FaEdit className="text-white" />
                                </button>
                            </div>
                            <div className="space-y-3 text-[#283046]">
                                <div className="flex justify-between">
                                    <span className="font-medium">Nama Warung:</span>
                                    <span>{userInfo.shopInfo?.shopName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Provinsi:</span>
                                    <span>{userInfo.shopInfo?.division}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Password Change Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-[#AFE1AF] h-fit">
                    <h2 className="text-2xl font-semibold text-[#283046] mb-6">Ubah Password</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-[#283046] mb-2">Email</label>
                            <input 
                                type="email"
                                className="w-full p-3 border border-[#AFE1AF] rounded-lg bg-white focus:border-[#FFC300] outline-none text-[#283046]"
                                placeholder="Masukkan email"
                            />
                        </div>
                        <div>
                            <label className="block text-[#283046] mb-2">Password Lama</label>
                            <input 
                                type="password"
                                className="w-full p-3 border border-[#AFE1AF] rounded-lg bg-white focus:border-[#FFC300] outline-none text-[#283046]"
                                placeholder="Masukkan password lama"
                            />
                        </div>
                        <div>
                            <label className="block text-[#283046] mb-2">Password Baru</label>
                            <input 
                                type="password"
                                className="w-full p-3 border border-[#AFE1AF] rounded-lg bg-white focus:border-[#FFC300] outline-none text-[#283046]"
                                placeholder="Masukkan password baru"
                            />
                        </div>
                        <button className="w-full py-3 bg-[#FFC300] text-white rounded-lg hover:shadow-lg transition-shadow">
                            Ubah Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile