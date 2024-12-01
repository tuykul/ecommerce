import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Midtrans = ({ orderId, price }) => {
    const [snapToken, setSnapToken] = useState(null)

    useEffect(() => {
        const createMidtransTransaction = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/midtrans/create-transaction', {
                    orderId,
                    price
                })
                
                // Load Midtrans Snap.js script
                const script = document.createElement('script')
                script.src = 'https://app.midtrans.com/snap/snap.js'
                script.async = true
                script.onload = () => {
                    setSnapToken(response.data.snapToken)
                }
                document.body.appendChild(script)

            } catch (error) {
                console.error('Error creating Midtrans transaction:', error)
            }
        }

        createMidtransTransaction()
    }, [orderId, price])

    const handlePayment = () => {
        if (window.snap && snapToken) {
            window.snap.pay(snapToken, {
                onSuccess: function(result) {
                    console.log('Payment success:', result)
                    // Redirect or show success message
                    window.location.href = '/order/confirm'
                },
                onPending: function(result) {
                    console.log('Payment pending:', result)
                },
                onError: function(result) {
                    console.log('Payment error:', result)
                },
                onClose: function() {
                    console.log('Payment window closed')
                }
            })
        }
    }

    return (
        <div className='mt-4'>
            {snapToken ? (
                <button 
                    onClick={handlePayment} 
                    className='px-10 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-white'
                >
                    Pay with Midtrans
                </button>
            ) : (
                <div>Loading payment options...</div>
            )}
        </div>
    )
}

export default Midtrans