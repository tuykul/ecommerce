import React, { useState } from 'react'
import Headers from '../components/Headers'
import Footer from '../components/Footer'
import Stripe from '../components/Stripe' 
import { useLocation } from 'react-router-dom'

const Payment = () => {
    const { state: { price, items, orderId } } = useLocation()
    const [paymentMethod, setPaymentMethod] = useState('midtrans')
    
    return (
        <div>
            <Headers />
            <section className='bg-[#eeeeee]'>
                <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 mt-4'>
                    <div className='flex flex-wrap md:flex-col-reverse'>
                        <div className='w-7/12 md:w-full'>
                            <div className='pr-2 md:pr-0'>
                                <div className='flex flex-wrap'>
                                    <div 
                                        onClick={() => setPaymentMethod('stripe')} 
                                        className={`w-[20%] border-r cursor-pointer py-8 px-12 ${paymentMethod === 'stripe' ? 'bg-slate-100' : 'bg-white'}`}
                                    >
                                        <div className='flex flex-col gap-[3px] justify-center items-center'>
                                            <img src="http://localhost:3000/images/payment/stripe.png" alt="stripe" />
                                            <span className='text-slate-600'>Stripe</span>
                                        </div>
                                    </div>
                                </div>
                                {paymentMethod === 'stripe' && (
                                    <Stripe orderId={orderId} price={price} />
                                )}
                            </div>
                        </div>
                        <div className='w-5/12 md:w-full'>
                            <div className='pl-2 md:pl-0 md:mb-0'>
                                <div className='bg-white shadow p-5 text-slate-600 flex flex-col gap-3'>
                                    <h2>Order</h2>
                                    <div className='flex justify-between items-center'>
                                        <span>{items} items dan pajak</span>
                                        <span>Rp{price}</span>
                                    </div>
                                    <div className='flex justify-between items-center font-semibold'>
                                        <span>Total Harga</span>
                                        <span className='text-lg text-orange-500'>Rp{price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Payment