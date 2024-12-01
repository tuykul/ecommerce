import React, { forwardRef, useEffect, useState } from 'react'
import { BsCurrencyDollar, BsWallet2 } from 'react-icons/bs'
import { FaMoneyBillWave } from 'react-icons/fa'
import { MdPending } from 'react-icons/md'
import toast from 'react-hot-toast'
import moment from 'moment'
import 'moment/locale/id'
import { FixedSizeList as List } from 'react-window'
import { useSelector, useDispatch } from 'react-redux'
import { get_seller_payemt_details, send_withdrowal_request, messageClear } from '../../store/Reducers/PaymentReducer'

moment.locale('id')

function handleOnWheel({ deltaY }) {
    console.log('handleOnWheel', deltaY)
}

const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} onWheel={handleOnWheel} {...props} />
))

const Payments = () => {
    const [amount, setAmount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.auth)
    const { 
        successMessage,
        errorMessage,
        loader,
        pendingWithdrows = [], // Berikan nilai default array kosong
        successWithdrows = [], // Berikan nilai default array kosong
        totalAmount = 0,
        withdrowAmount = 0,
        pendingAmount = 0,
        availableAmount = 0
    } = useSelector(state => state.payment)

    // Komponen Card untuk statistik
    const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
        <div className='bg-white p-6 rounded-lg shadow-sm border border-[#AFE1AF]/20'>
            <div className='flex justify-between items-center'>
                <div>
                    <p className='text-sm text-[#283046]/60'>{title}</p>
                    <h3 className='text-2xl font-bold text-[#283046] mt-1'>
                        Rp {value.toLocaleString('id-ID')}
                    </h3>
                </div>
                <div className={`w-12 h-12 rounded-full ${bgColor} flex justify-center items-center`}>
                    <Icon className={`text-xl ${color}`} />
                </div>
            </div>
        </div>
    )

    // Komponen untuk baris tabel
    const TableRow = ({ data, index, style }) => {
        if (!data) return null; // Tambahkan pengecekan
        
        return (
            <div style={style} className='flex text-sm hover:bg-[#F9F6EE]/50 transition-colors'>
                <div className='w-[25%] p-3 text-[#283046]'>{index + 1}</div>
                <div className='w-[25%] p-3 text-[#283046]'>
                    Rp {data.amount.toLocaleString('id-ID')}
                </div>
                <div className='w-[25%] p-3'>
                    <span className={`py-1 px-3 rounded-full text-xs ${
                        data.status === 'success' 
                            ? 'bg-[#AFE1AF]/20 text-[#AFE1AF]' 
                            : 'bg-[#FFC300]/20 text-[#FFC300]'
                    }`}>
                        {data.status}
                    </span>
                </div>
                <div className='w-[25%] p-3 text-[#283046]'>
                    {moment(data.createdAt).format('DD MMMM YYYY')}
                </div>
            </div>
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await dispatch(get_seller_payemt_details(userInfo._id));
            setIsLoading(false);
        };
        
        if (userInfo?._id) {
            fetchData();
        }
    }, [dispatch, userInfo]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [errorMessage, successMessage, dispatch])

    const sendRequest = (e) => {
        e.preventDefault()
        if (availableAmount - amount > 10000) {  // Ubah minimum balance ke Rupiah
            dispatch(send_withdrowal_request({ amount, sellerId: userInfo._id }))
            setAmount(0)
        } else {
            toast.error('Saldo tidak mencukupi')
        }
    }

    if (isLoading) {
        return (
            <div className="p-4 md:p-6 bg-[#F9F6EE] flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='p-4 md:p-6 bg-[#F9F6EE]'>
            {/* Statistik Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                <StatCard 
                    title="Total Penjualan"
                    value={totalAmount}
                    icon={BsCurrencyDollar}
                    color="text-[#FFC300]"
                    bgColor="bg-[#FFC300]/10"
                />
                <StatCard 
                    title="Saldo Tersedia"
                    value={availableAmount}
                    icon={BsWallet2}
                    color="text-[#AFE1AF]"
                    bgColor="bg-[#AFE1AF]/10"
                />
                <StatCard 
                    title="Total Penarikan"
                    value={withdrowAmount}
                    icon={FaMoneyBillWave}
                    color="text-[#E57F84]"
                    bgColor="bg-[#E57F84]/10"
                />
                <StatCard 
                    title="Penarikan Pending"
                    value={pendingAmount}
                    icon={MdPending}
                    color="text-[#FFC300]"
                    bgColor="bg-[#FFC300]/10"
                />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Form Penarikan */}
                <div className='bg-white rounded-lg shadow-sm border border-[#AFE1AF]/20 p-6'>
                    <h2 className='text-lg font-semibold text-[#283046] mb-4'>
                        Ajukan Penarikan Dana
                    </h2>
                    <form onSubmit={sendRequest} className='space-y-4'>
                        <div>
                            <label className='text-sm text-[#283046]/60 mb-1.5 block'>
                                Jumlah Penarikan
                            </label>
                            <div className='flex gap-3'>
                                <input 
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="0"
                                    className='flex-1 px-4 py-2.5 rounded-lg border border-[#AFE1AF] focus:border-[#FFC300] outline-none transition-all duration-300 text-[#283046] bg-[#F9F6EE]'
                                    placeholder='Masukkan jumlah penarikan'
                                    required
                                />
                                <button 
                                    disabled={loader}
                                    className='px-6 py-2.5 bg-gradient-to-r from-[#FFC300] to-[#FF9900] text-white rounded-lg transition-all duration-300 hover:opacity-90 disabled:opacity-50'
                                >
                                    {loader ? 'Memproses...' : 'Ajukan'}
                                </button>
                            </div>
                            <p className='text-xs text-[#283046]/60 mt-1.5'>
                                Minimal saldo yang harus tersisa: Rp 10.000
                            </p>
                        </div>
                    </form>

                    {/* Tabel Pending */}
                    <div className='mt-6'>
                        <h3 className='text-lg font-semibold text-[#283046] mb-4'>
                            Penarikan dalam Proses
                        </h3>
                        <div className='bg-[#F9F6EE] rounded-lg'>
                            <div className='flex text-xs font-medium text-[#283046] border-b border-[#AFE1AF]/20 bg-[#F9F6EE]'>
                                <div className='w-[25%] p-3'>No</div>
                                <div className='w-[25%] p-3'>Jumlah</div>
                                <div className='w-[25%] p-3'>Status</div>
                                <div className='w-[25%] p-3'>Tanggal</div>
                            </div>
                            {pendingWithdrows.length > 0 ? (
                                <List
                                    height={250}
                                    itemCount={pendingWithdrows.length}
                                    itemSize={45}
                                    outerElementType={outerElementType}
                                    width="100%"
                                >
                                    {({ index, style }) => (
                                        <TableRow 
                                            data={pendingWithdrows[index]} 
                                            index={index}
                                            style={style}
                                        />
                                    )}
                                </List>
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    Tidak ada penarikan dalam proses
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Riwayat Penarikan Sukses */}
                <div className='bg-white rounded-lg shadow-sm border border-[#AFE1AF]/20 p-6'>
                    <h2 className='text-lg font-semibold text-[#283046] mb-4'>
                        Riwayat Penarikan
                    </h2>
                    <div className='bg-[#F9F6EE] rounded-lg'>
                        <div className='flex text-xs font-medium text-[#283046] border-b border-[#AFE1AF]/20 bg-[#F9F6EE]'>
                            <div className='w-[25%] p-3'>No</div>
                            <div className='w-[25%] p-3'>Jumlah</div>
                            <div className='w-[25%] p-3'>Status</div>
                            <div className='w-[25%] p-3'>Tanggal</div>
                        </div>
                        {successWithdrows.length > 0 ? (
                            <List
                                height={320}
                                itemCount={successWithdrows.length}
                                itemSize={45}
                                outerElementType={outerElementType}
                                width="100%"
                            >
                                {({ index, style }) => (
                                    <TableRow 
                                        data={successWithdrows[index]} 
                                        index={index}
                                        style={style}
                                    />
                                )}
                            </List>
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                Tidak ada riwayat penarikan
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payments