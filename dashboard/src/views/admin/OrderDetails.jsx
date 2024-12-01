import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { get_admin_order, admin_order_status_update, messageClear } from '../../store/Reducers/OrderReducer'

const OrderDetails = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch()

    const { order, errorMessage, successMessage } = useSelector(state => state.order)

    useEffect(() => {
        dispatch(get_admin_order(orderId))
    }, [orderId])

    const [status, setStatus] = useState('')
    useEffect(() => {
        setStatus(order?.delivery_status)
    }, [order])
    const status_update = (e) => {
        dispatch(admin_order_status_update({ orderId, info: { status: e.target.value } }))
        setStatus(e.target.value)
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage])

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#F9F6EE] rounded-md'>
                <div className='flex justify-between items-center p-4'>
                    <h2 className='text-xl text-[#283046]'>Detail Pesanan</h2>
                    <select onChange={status_update} value={status} name="" id="" className='px-4 py-2 focus:border-[#FFC300] outline-none bg-[#F9F6EE] border border-[#AFE1AF] rounded-md text-[#283046]'>
                        <option value="pending">Menunggu</option>
                        <option value="processing">Diproses</option>
                        <option value="warehouse">Di Gudang</option>
                        <option value="placed">Dikirim</option>
                        <option value="cancelled">Dibatalkan</option>
                    </select>
                </div>
                <div className='p-4'>
                    <div className='flex gap-2 text-lg text-[#283046]'>
                        <h2>#{order._id}</h2>
                        <span>{order.date}</span>
                    </div>
                    <div className='flex flex-wrap'>
                        <div className='w-full md:w-[32%]'>
                            <div className='pr-3 text-[#283046] text-lg'>
                                <div className='flex flex-col gap-1'>
                                    <h2 className='pb-2 font-semibold'>Dikirim ke: {order.shippingInfo?.name}</h2>
                                    <p><span className='text-sm'>{order.shippingInfo?.address}, {order.shippingInfo?.province}, {order.shippingInfo?.city}, {order.shippingInfo?.area}</span></p>
                                </div>
                                <div className='flex justify-start items-center gap-3'>
                                    <h2>Status Pembayaran: </h2>
                                    <span className='text-base'>{order.payment_status}</span>
                                </div>
                                <span>Harga: Rp {order.price}</span>
                                <div className='mt-4 flex flex-col gap-8'>
                                    <div className='text-[#283046]'>
                                        {
                                            order.products && order.products.map((p, i) => (
                                                <div key={i} className='flex gap-3 text-md'>
                                                    <img className='w-[45px] h-[45px]' src={p.images[0]} alt="" />
                                                    <div>
                                                        <h2>{p.name}</h2>
                                                        <p>
                                                            <span>Merek: </span>
                                                            <span>{p.brand} </span>
                                                            <span className='text-lg'>Jumlah: {p.quantity}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full md:w-[68%]'>
                            <div className='pl-3'>
                                <div className='mt-4 flex flex-col'>
                                    {
                                        order?.suborder?.map((o, i) => (
                                            <div key={i + 20} className='text-[#283046] mb-6'>
                                                <div className='flex justify-start items-center gap-3'>
                                                    <h2>Pesanan Penjual {i + 1}: </h2>
                                                    <span>{o.delivery_status}</span>
                                                </div>
                                                {
                                                    o.products?.map((p, i) => (
                                                        <div key={i} className='flex gap-3 text-md mt-2'>
                                                            <img className='w-[45px] h-[45px]' src={p.images[0]} alt="" />
                                                            <div>
                                                                <h2>{p.name}</h2>
                                                                <p>
                                                                    <span>Merek: </span>
                                                                    <span>{p.brand} </span>
                                                                    <span className='text-lg'>Jumlah: {p.quantity}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails