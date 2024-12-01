import React, { useState } from 'react'
import { FaList, FaBell, FaUserCircle } from 'react-icons/fa'
import { BiSearchAlt } from 'react-icons/bi'
import { MdRestaurantMenu, MdOutlineHelp } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import sellerImage from '../assets/seller.png'
import adminImage from '../assets/admin.jpg'

const Header = ({ showSidebar, setShowSidebar }) => {
    const { userInfo } = useSelector(state => state.auth)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showNotification, setShowNotification] = useState(false)

    return (
        <div className='fixed top-0 left-0 w-full py-5 px-2 lg:px-7 z-40'>
            <div className='ml-0 lg:ml-[260px] rounded-md h-[65px] flex justify-between items-center bg-[#F9F6EE] text-[#283046] px-5 transition-all shadow-md'>
                {/* Menu Toggle & Logo */}
                <div className='flex items-center gap-4'>
                    <div 
                        onClick={() => setShowSidebar(!showSidebar)} 
                        className='w-[35px] flex lg:hidden h-[35px] rounded-full bg-[#FFC300] shadow-lg hover:bg-[#E57F84] justify-center items-center cursor-pointer transition duration-300'
                    >
                        <span><FaList /></span>
                    </div>
                    <div className='hidden md:flex items-center gap-2'>
                        <MdRestaurantMenu className='text-2xl text-[#FFC300]' />
                        <span className='font-semibold text-lg'>Nusantara Culinary</span>
                    </div>
                </div>
                {/* Search Bar */}
                <div className='hidden md:block flex-grow max-w-xl mx-4'>
                    <div className='relative'>
                        <input 
                            className='w-full px-4 py-2 pl-10 outline-none border bg-white border-[#AFE1AF] rounded-full text-[#283046] focus:border-[#FFC300] transition duration-300' 
                            type="text" 
                            name='search' 
                            placeholder='Cari menu, warung, atau kategori...' 
                        />
                        <BiSearchAlt className='absolute left-3 top-2.5 text-xl text-[#AFE1AF]' />
                    </div>
                </div>

                {/* Right Section */}
                <div className='flex items-center gap-4'>
                    {/* Notification */}
                    <div className='relative'>
                        <div 
                            onClick={() => setShowNotification(!showNotification)}
                            className='w-[35px] h-[35px] rounded-full bg-[#F9F6EE] border border-[#AFE1AF] hover:border-[#FFC300] flex items-center justify-center cursor-pointer transition duration-300'
                        >
                            <FaBell className='text-[#283046]' />
                            <span className='absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E57F84] text-white text-xs flex items-center justify-center'>3</span>
                        </div>
                        
                        {/* Notification Dropdown */}
                        {showNotification && (
                            <div className='absolute right-0 top-12 w-72 bg-white rounded-md shadow-lg border border-[#AFE1AF] p-2'>
                                <h3 className='text-sm font-semibold px-2 py-1 border-b border-[#AFE1AF]'>Notifikasi</h3>
                                <div className='max-h-[280px] overflow-y-auto'>
                                    <div className='p-2 hover:bg-[#F9F6EE] rounded-md cursor-pointer'>
                                        <p className='text-sm'>Pesanan baru masuk dari Warung Bu Siti</p>
                                        <span className='text-xs text-gray-500'>2 menit yang lalu</span>
                                    </div>
                                    <div className='p-2 hover:bg-[#F9F6EE] rounded-md cursor-pointer'>
                                        <p className='text-sm'>Stok Nasi Goreng Spesial hampir habis</p>
                                        <span className='text-xs text-gray-500'>5 menit yang lalu</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
                    <div className='relative'>
                        <div 
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className='flex items-center gap-3 cursor-pointer'
                        >
                            <div className='text-right hidden sm:block'>
                                <h2 className='text-sm font-bold'>{userInfo.name}</h2>
                                <span className='text-xs text-[#283046]/80'>{userInfo.role === 'admin' ? 'Administrator' : 'Penjual'}</span>
                            </div>
                            <div className='relative'>
                                <img 
                                    className='w-[45px] h-[45px] rounded-full object-cover border-2 border-[#FFC300] p-0.5' 
                                    src={userInfo.role === 'admin' ? (userInfo.image || adminImage) : (userInfo.image || sellerImage)} 
                                    alt="profile" 
                                />
                                <span className='absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white'></span>
                            </div>
                        </div>

                        {/* User Menu Dropdown */}
                        {showUserMenu && (
                            <div className='absolute right-0 top-14 w-56 bg-white rounded-md shadow-lg border border-[#AFE1AF] p-2'>
                                <div className='p-2 hover:bg-[#F9F6EE] rounded-md cursor-pointer transition duration-300'>
                                    <Link to="/profile" className='flex items-center gap-2'>
                                        <FaUserCircle className='text-[#FFC300]' />
                                        <span>Profil Saya</span>
                                    </Link>
                                </div>
                                <div className='p-2 hover:bg-[#F9F6EE] rounded-md cursor-pointer transition duration-300'>
                                    <Link to="/help" className='flex items-center gap-2'>
                                        <MdOutlineHelp className='text-[#FFC300]' />
                                        <span>Bantuan</span>
                                    </Link>
                                </div>
                                <div className='border-t border-[#AFE1AF] mt-2 pt-2'>
                                    <div className='p-2 hover:bg-[#E57F84] hover:text-white rounded-md cursor-pointer transition duration-300'>
                                        <span>Keluar</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
