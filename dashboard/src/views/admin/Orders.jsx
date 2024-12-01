import React, { useState, useEffect } from 'react'
import { MdKeyboardArrowDown, MdSearch } from 'react-icons/md'
import { FaEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Pagination from '../Pagination'
import { useSelector, useDispatch } from 'react-redux'
import { get_admin_orders } from '../../store/Reducers/OrderReducer'

const Orders = () => {
    const dispatch = useDispatch()
    const { totalOrder, myOrders } = useSelector(state => state.order)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] = useState('')

    useEffect(() => {
        dispatch(get_admin_orders({
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }))
    }, [parPage, currentPage, searchValue])

    // Status badge component
    const StatusBadge = ({ status, type }) => {
        let bgColor = ''
        let textColor = ''
        
        if (type === 'payment') {
            bgColor = status === 'paid' ? 'bg-[#AFE1AF]/20' : 'bg-[#E57F84]/20'
            textColor = status === 'paid' ? 'text-[#AFE1AF]' : 'text-[#E57F84]'
        } else {
            switch(status) {
                case 'pending':
                    bgColor = 'bg-[#FFC300]/20'
                    textColor = 'text-[#FFC300]'
                    break
                case 'processing':
                    bgColor = 'bg-[#AFE1AF]/20'
                    textColor = 'text-[#AFE1AF]'
                    break
                default:
                    bgColor = 'bg-[#E57F84]/20'
                    textColor = 'text-[#E57F84]'
            }
        }

        return (
            <span className={`px-3 py-1 rounded-full text-xs ${bgColor} ${textColor} font-medium`}>
                {status}
            </span>
        )
    }

    return (
        <div className='p-4 md:p-6 bg-[#F9F6EE]'>
            {/* Header Section */}
            <div className='bg-white p-4 rounded-lg shadow-sm border border-[#AFE1AF]/20 mb-6'>
                <h2 className='text-lg font-semibold text-[#283046] mb-4'>Daftar Pesanan</h2>
                <div className='flex flex-wrap gap-4 items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <select 
                            onChange={(e) => setParPage(parseInt(e.target.value))} 
                            className='px-4 py-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046] transition duration-300'
                        >
                            <option value="5">5 per halaman</option>
                            <option value="15">15 per halaman</option>
                            <option value="25">25 per halaman</option>
                        </select>
                        <div className='relative'>
                            <input 
                                className='pl-10 pr-4 py-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046] w-[250px] transition duration-300' 
                                type="text" 
                                placeholder='Cari pesanan...' 
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <MdSearch className='absolute left-3 top-2.5 text-xl text-[#283046]/60' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className='bg-white rounded-lg shadow-sm border border-[#AFE1AF]/20'>
                <div className='overflow-x-auto'>
                    <table className='w-full whitespace-nowrap'>
                        <thead className='bg-[#F9F6EE] text-[#283046]'>
                            <tr>
                                <th className='px-6 py-3 text-left'>ID Pesanan</th>
                                <th className='px-6 py-3 text-left'>Total Harga</th>
                                <th className='px-6 py-3 text-left'>Status Pembayaran</th>
                                <th className='px-6 py-3 text-left'>Status Pesanan</th>
                                <th className='px-6 py-3 text-left'>Detail</th>
                                <th className='px-6 py-3 text-center w-10'></th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-[#AFE1AF]/20'>
                            {myOrders.map((o, i) => (
                                <React.Fragment key={i}>
                                    <tr className='hover:bg-[#F9F6EE]/50 transition-colors'>
                                        <td className='px-6 py-4'>
                                            <span className='font-medium'>#{o._id}</span>
                                        </td>
                                        <td className='px-6 py-4'>
                                            Rp {o.price.toLocaleString('id-ID')}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <StatusBadge status={o.payment_status} type="payment" />
                                        </td>
                                        <td className='px-6 py-4'>
                                            <StatusBadge status={o.delivery_status} type="delivery" />
                                        </td>
                                        <td className='px-6 py-4'>
                                            <Link 
                                                to={`/admin/dashboard/order/details/${o._id}`}
                                                className='inline-flex items-center gap-2 text-[#FFC300] hover:text-[#E57F84] transition duration-300'
                                            >
                                                <FaEye />
                                                <span>Detail</span>
                                            </Link>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <button
                                                onClick={() => setShow(show === o._id ? '' : o._id)}
                                                className='p-1 hover:bg-[#F9F6EE] rounded-full transition duration-300'
                                            >
                                                <MdKeyboardArrowDown 
                                                    className={`text-xl transition-transform duration-300 ${
                                                        show === o._id ? 'transform rotate-180' : ''
                                                    }`} 
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Sub-orders */}
                                    {show === o._id && o.suborder.map((so, j) => (
                                        <tr key={`${i}-${j}`} className='bg-[#F9F6EE]/30'>
                                            <td className='px-6 py-3 pl-12'>
                                                <span className='text-sm'>#{so._id}</span>
                                            </td>
                                            <td className='px-6 py-3'>
                                                <span className='text-sm'>
                                                    Rp {so.price.toLocaleString('id-ID')}
                                                </span>
                                            </td>
                                            <td className='px-6 py-3'>
                                                <StatusBadge status={so.payment_status} type="payment" />
                                            </td>
                                            <td className='px-6 py-3'>
                                                <StatusBadge status={so.delivery_status} type="delivery" />
                                            </td>
                                            <td colSpan={2}></td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalOrder > parPage && (
                    <div className='p-4 border-t border-[#AFE1AF]/20'>
                        <div className='flex justify-end'>
                            <Pagination
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={totalOrder}
                                parPage={parPage}
                                showItem={4}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders