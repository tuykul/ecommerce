import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Pagination from '../Pagination'
import { useDispatch, useSelector } from 'react-redux'
import { get_active_sellers } from '../../store/Reducers/sellerReducer'

const Sellers = () => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const { sellers, totalSellers } = useSelector(state => state.seller)

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_active_sellers(obj))
    }, [searchValue, currentPage, parPage])

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#F9F6EE] rounded-md'>
                <div className='flex justify-between items-center mb-6'>
                    <select onChange={(e) => setParPage(parseInt(e.target.value))} className='px-4 py-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046] transition duration-300'>
                        <option value="5">5 per halaman</option>
                        <option value="15">15 per halaman</option>
                        <option value="25">25 per halaman</option>
                    </select>
                    <input 
                        onChange={e => setSearchValue(e.target.value)} 
                        value={searchValue} 
                        className='px-4 py-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046] transition duration-300' 
                        type="text" 
                        placeholder='Cari penjual...' 
                    />
                </div>
                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-left text-[#283046]'>
                        <thead className='text-xs text-[#283046] uppercase border-b border-[#AFE1AF]'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>No</th>
                                <th scope='col' className='py-3 px-4'>Gambar</th>
                                <th scope='col' className='py-3 px-4'>Nama</th>
                                <th scope='col' className='py-3 px-4'>Nama Toko</th>
                                <th scope='col' className='py-3 px-4'>Status Pembayaran</th>
                                <th scope='col' className='py-3 px-4'>Email</th>
                                <th scope='col' className='py-3 px-4'>Provinsi</th>
                                <th scope='col' className='py-3 px-4'>Kabupaten</th>
                                <th scope='col' className='py-3 px-4'>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className='text-sm font-normal'>
                            {
                                sellers.map((d, i) => <tr key={i} className='border-b border-[#AFE1AF] hover:bg-[#AFE1AF]/10 transition duration-300'>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>{i + 1}</td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <img className='w-[45px] h-[45px] rounded-full object-cover' src={`${d.image}`} alt={d.name} />
                                    </td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.name}</span>
                                    </td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.shopInfo?.shopName}</span>
                                    </td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.status}</span>
                                    </td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.email}</span>
                                    </td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.shopInfo?.division}</span>
                                    </td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.shopInfo?.district}</span>
                                    </td>
                                    <td scope='row' className='py-2 px-4 font-medium whitespace-nowrap'>
                                        <div className='flex justify-start items-center gap-4'>
                                            <Link to={`/admin/dashboard/seller/details/${d._id}`} className='p-[6px] bg-[#FFC300] rounded-full hover:bg-[#E57F84] transition duration-300'>
                                                <FaEye className='text-[#283046]' />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
                {
                    totalSellers > parPage && (
                        <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                            <Pagination
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={totalSellers}
                                parPage={parPage}
                                showItem={4}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Sellers