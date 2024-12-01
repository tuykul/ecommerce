import React, { forwardRef, useEffect, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import toast from 'react-hot-toast'
import moment from 'moment'
import 'moment/locale/id'  // Import lokalisasi bahasa Indonesia
import { useSelector, useDispatch } from 'react-redux'
import { get_payment_request, confirm_payment_request, messageClear } from '../../store/Reducers/PaymentReducer'

moment.locale('id')  // Set lokalisasi ke bahasa Indonesia

function handleOnWheel({ deltaY }) {
  console.log('handleOnWheel', deltaY)
}

const outerElementType = forwardRef((props, ref) => (
  <div ref={ref} onWheel={handleOnWheel} {...props} />
))

const PaymentRequest = () => {
  const dispatch = useDispatch()
  const { successMessage, errorMessage, loader, pendingWithdrows } = useSelector(state => state.payment)

  useEffect(() => {
    dispatch(get_payment_request())
  }, [])

  const [paymentId, setPaymentId] = useState('')
  const confirm_request = (id) => {
    setPaymentId(id)
    dispatch(confirm_payment_request(id))
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
  }, [errorMessage, successMessage])

  const Row = ({ index, style }) => {
    return (
      <div style={style} className='flex text-sm'>
        <div className='w-[25%] p-2 whitespace-nowrap'>{index + 1}</div>
        <div className='w-[25%] p-2 whitespace-nowrap'>Rp {pendingWithdrows[index]?.amount.toLocaleString('id-ID')}</div>
        <div className='w-[25%] p-2 whitespace-nowrap'>
          <span className='py-[1px] px-[5px] bg-[#FFC300] text-[#283046] rounded-md text-xs'>{pendingWithdrows[index]?.status}</span>
        </div>
        <div className='w-[25%] p-2 whitespace-nowrap'>{moment(pendingWithdrows[index]?.createdAt).format('LL')}</div>
        <div className='w-[25%] p-2 whitespace-nowrap'>
          <button 
            disabled={loader} 
            onClick={() => confirm_request(pendingWithdrows[index]?._id)} 
            className='bg-[#AFE1AF] shadow-lg hover:bg-[#E57F84] px-3 py-[2px] cursor-pointer text-[#283046] rounded-sm text-sm transition duration-300'
          >
            {(loader && paymentId === pendingWithdrows[index]?._id) ? 'Memuat..' : 'Konfirmasi'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='px-2 lg:px-7 pt-5'>
      <div className='w-full p-4 bg-[#F9F6EE] rounded-md text-[#283046] shadow-md'>
        <h2 className='text-xl font-medium pb-5'>Permintaan Penarikan</h2>
        <div className='w-full'>
          <div className='w-full overflow-x-auto'>
            <div className='flex bg-[#AFE1AF] uppercase text-xs min-w-[340px] text-[#283046] font-semibold'>
              <div className='w-[25%] p-2'>No</div>
              <div className='w-[25%] p-2'>Jumlah</div>
              <div className='w-[25%] p-2'>Status</div>
              <div className='w-[25%] p-2'>Tanggal</div>
              <div className='w-[25%] p-2'>Aksi</div>
            </div>
            {
              <List
                style={{ minWidth: '340px', overflowX: 'hidden' }}
                className='List'
                height={350}
                itemCount={pendingWithdrows.length}
                itemSize={35}
                outerElementType={outerElementType}
              >
                {Row}
              </List>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentRequest