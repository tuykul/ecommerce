import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getNavs } from '../navigation/index'
import { logout } from '../store/Reducers/authReducer'
import { BiLogInCircle } from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import logo from '../assets/logo (3).png'

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { role } = useSelector(state => state.auth)
  const { pathname } = useLocation()
  const [allNav, setAllNav] = useState([])

  useEffect(() => {
    const navs = getNavs(role)
    setAllNav(navs)
  }, [role])

  return (
    <div>
        <div 
            onClick={() => setShowSidebar(false)} 
            className={`fixed duration-200 ${!showSidebar ? 'invisible' : 'visible'} w-screen h-screen bg-[#22292f80] top-0 left-0 z-10`}
        />
        <div className={`w-[250px] fixed bg-[#F9F6EE] z-50 top-0 h-screen shadow-lg transition-all ${showSidebar ? 'left-0' : '-left-[260px] lg:left-0'}`}>
            {/* Logo Section */}
            <div className='h-[80px] flex justify-center items-center bg-[#F9F6EE]'>
                <Link to='/' className='flex items-center justify-center w-full px-3'>
                    <img 
                        src={logo} 
                        alt="Nusantara Culinary Logo" 
                        className='h-40 w-auto'
                    />
                </Link>
            </div>

        <div className='px-[16px] mt-4'>
          <ul>
            {
              allNav.map((n, i) => (
                <li key={i}>
                  <Link 
                    to={n.path} 
                    className={`${
                      pathname === n.path 
                        ? 'bg-[#FFC300] shadow-[#FFC300]/30 text-[#283046] font-semibold duration-500' 
                        : 'text-[#283046] font-normal duration-200 hover:bg-[#FFC300]/10'
                    } px-[12px] py-[9px] rounded-md flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1`}
                  >
                    <span className='text-lg'>{n.icon}</span>
                    <span>{n.title}</span>
                  </Link>
                </li>
              ))
            }
            <li>
              <button 
                onClick={() => dispatch(logout({ navigate, role }))} 
                className='w-full text-[#283046] font-normal duration-200 px-[12px] py-[9px] rounded-md flex justify-start items-center gap-[12px] hover:pl-4 transition-all mb-1 hover:bg-[#E57F84] hover:text-white'
              >
                <span className='text-lg'><BiLogInCircle /></span>
                <span>Keluar</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar