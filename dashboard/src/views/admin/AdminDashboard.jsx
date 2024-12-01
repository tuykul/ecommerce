import React, { useEffect } from 'react'
import { BsCurrencyDollar, BsBarChart } from 'react-icons/bs'
import { RiProductHuntLine } from 'react-icons/ri'
import { FaUsers, FaUtensils } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import Chart from 'react-apexcharts'
import moment from 'moment'
import 'moment/locale/id'
import { useSelector, useDispatch } from 'react-redux'
import seller from '../../assets/seller.png'
import { get_admin_dashboard_index_data } from '../../store/Reducers/dashboardIndexReducer'

moment.locale('id')

const AdminDashboard = () => {
    const { userInfo } = useSelector(state => state.auth)
    const { totalSale, totalOrder, totalProduct, totalSeller, recentOrders, recentMessage } = useSelector(state => state.dashboardIndex)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(get_admin_dashboard_index_data())
    }, [])

    // Komponen Card Statistik
    const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
        <div className='bg-white p-5 rounded-lg shadow-sm border border-[#AFE1AF]/20'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='text-lg text-[#283046]/60'>{title}</h3>
                    <h2 className='text-3xl font-bold text-[#283046] mt-2'>
                        {title === 'Total Penjualan' ? `Rp ${value.toLocaleString('id-ID')}` : value}
                    </h2>
                </div>
                <div className={`w-14 h-14 rounded-full ${bgColor} flex justify-center items-center`}>
                    <Icon className={`text-2xl ${color}`} />
                </div>
            </div>
        </div>
    )

    // Konfigurasi chart yang diperbarui
    const state = {
        series: [
            {
                name: "Pesanan",
                data: [34, 65, 34, 65, 34, 34, 34, 56, 23, 67, 23, 45]
            },
            {
                name: "Pendapatan",
                data: [34, 32, 45, 32, 34, 34, 43, 56, 65, 67, 45, 78]
            },
            {
                name: "Penjual",
                data: [78, 32, 34, 54, 65, 34, 54, 21, 54, 43, 45, 43]
            }
        ],
        options: {
            chart: {
                background: 'transparent',
                foreColor: '#283046',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            colors: ['#FFC300', '#AFE1AF', '#E57F84'],
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
            },
            legend: {
                position: 'top'
            },
            grid: {
                borderColor: '#AFE1AF',
                strokeDashArray: 5
            }
        }
    }

    return (
        <div className='p-4 md:p-6 bg-[#F9F6EE]'>
            {/* Statistik Utama */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <StatCard 
                    title="Total Penjualan"
                    value={totalSale}
                    icon={BsCurrencyDollar}
                    color="text-[#FFC300]"
                    bgColor="bg-[#FFC300]/10"
                />
                <StatCard 
                    title="Total Menu"
                    value={totalProduct}
                    icon={FaUtensils}
                    color="text-[#AFE1AF]"
                    bgColor="bg-[#AFE1AF]/10"
                />
                <StatCard 
                    title="Total Penjual"
                    value={totalSeller}
                    icon={FaUsers}
                    color="text-[#E57F84]"
                    bgColor="bg-[#E57F84]/10"
                />
                <StatCard 
                    title="Total Pesanan"
                    value={totalOrder}
                    icon={AiOutlineShoppingCart}
                    color="text-[#FFC300]"
                    bgColor="bg-[#FFC300]/10"
                />
            </div>

            {/* Grafik dan Pesan */}
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6'>
                <div className='lg:col-span-3 bg-white p-4 rounded-lg shadow-sm border border-[#AFE1AF]/20'>
                    <h2 className='text-lg font-semibold text-[#283046] mb-4'>Statistik Penjualan</h2>
                    <Chart 
                        options={state.options} 
                        series={state.series} 
                        type='line' 
                        height={350} 
                    />
                </div>

                {/* Pesan Terbaru */}
                <div className='lg:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-[#AFE1AF]/20'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-lg font-semibold text-[#283046]'>Pesan Penjual</h2>
                        <Link className='text-[#FFC300] hover:underline text-sm'>Lihat Semua</Link>
                    </div>
                    <div className='space-y-4'>
                        {recentMessage.map((m, i) => (
                            <div key={i} className='flex gap-3 p-3 bg-[#F9F6EE] rounded-lg'>
                                <img 
                                    className='w-10 h-10 rounded-full border-2 border-[#FFC300]' 
                                    src={m.senderId === userInfo._id ? userInfo.image : seller} 
                                    alt="" 
                                />
                                <div className='flex-1'>
                                    <div className='flex justify-between'>
                                        <h3 className='font-medium text-[#283046]'>{m.senderName}</h3>
                                        <span className='text-xs text-[#283046]/60'>
                                            {moment(m.createdAt).fromNow()}
                                        </span>
                                    </div>
                                    <p className='text-sm text-[#283046]/80 mt-1'>{m.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pesanan Terbaru */}
            <div className='mt-6 bg-white p-4 rounded-lg shadow-sm border border-[#AFE1AF]/20'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-semibold text-[#283046]'>Pesanan Terbaru</h2>
                    <Link className='text-[#FFC300] hover:underline text-sm'>
                        Lihat Semua
                    </Link>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full whitespace-nowrap'>
                        <thead className='bg-[#F9F6EE] text-[#283046]'>
                            <tr>
                                <th className='px-6 py-3 text-left'>ID Pesanan</th>
                                <th className='px-6 py-3 text-left'>Total Harga</th>
                                <th className='px-6 py-3 text-left'>Status Pembayaran</th>
                                <th className='px-6 py-3 text-left'>Status Pesanan</th>
                                <th className='px-6 py-3 text-left'>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-[#AFE1AF]/20'>
                            {recentOrders.map((d, i) => (
                                <tr key={i} className='hover:bg-[#F9F6EE]/50 transition-colors'>
                                    <td className='px-6 py-4'>#{d._id}</td>
                                    <td className='px-6 py-4'>Rp {d.price.toLocaleString('id-ID')}</td>
                                    <td className='px-6 py-4'>
                                        <span className={`px-3 py-1 rounded-full text-xs ${
                                            d.payment_status === 'paid' 
                                                ? 'bg-[#AFE1AF]/20 text-[#AFE1AF]' 
                                                : 'bg-[#E57F84]/20 text-[#E57F84]'
                                        }`}>
                                            {d.payment_status === 'paid' ? 'Dibayar' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span className='px-3 py-1 rounded-full text-xs bg-[#FFC300]/20 text-[#FFC300]'>
                                            {d.delivery_status}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <Link 
                                            to={`/admin/dashboard/order/details/${d._id}`}
                                            className='text-[#FFC300] hover:underline'
                                        >
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard