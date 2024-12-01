import React, { useEffect, useState, useRef } from 'react'
import { IoMdClose } from 'react-icons/io'
import { FaList } from 'react-icons/fa'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { get_sellers } from '../../store/Reducers/chatReducer'
import { BsEmojiSmile } from 'react-icons/bs'
import adminImage from '../../assets/admin.jpg'
import sellerImage from '../../assets/seller.png'
import toast from 'react-hot-toast'
import { send_message_seller_admin, messageClear, get_admin_message, updateSellerMessage } from '../../store/Reducers/chatReducer'
import { socket } from '../../utils/utils'

const ChatSeller = () => {
    const scrollRef = useRef()
    const { sellerId } = useParams()
    const dispatch = useDispatch()
    const { sellers, activeSellers, seller_admin_message, currentSeller, successMessage } = useSelector(state => state.chat)
    const { userInfo } = useSelector(state => state.auth)
    const [show, setShow] = useState(false)
    const [recevedMessage, setRecevedMessage] = useState('')
    const [text, setText] = useState('')

    useEffect(() => {
        dispatch(get_sellers())
    }, [])

    const send = (e) => {
        e.preventDefault()
        dispatch(send_message_seller_admin({
            senderId: '',
            receverId: sellerId,
            message: text,
            senderName: 'Dukungan Nusantara Culinary'
        }))
        setText('')
    }

    useEffect(() => {
        if (sellerId) {
            dispatch(get_admin_message(sellerId))
        }
    }, [sellerId])

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_message_admin_to_seller', seller_admin_message[seller_admin_message.length - 1])
            dispatch(messageClear())
        }
    }, [successMessage])

    useEffect(() => {
        socket.on('receved_seller_message', msg => {
            setRecevedMessage(msg)
        })
    }, [])

    useEffect(() => {
        if (recevedMessage) {
            if (recevedMessage.senderId === sellerId && recevedMessage.receverId === '') {
                dispatch(updateSellerMessage(recevedMessage))
            } else {
                toast.success(recevedMessage.senderName + ' mengirim pesan')
            }
        }
    }, [recevedMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [seller_admin_message])

    return (
        <div className='px-2 lg:px-7 py-5'>
            <div className='w-full bg-[#F9F6EE] px-4 py-4 rounded-md h-[calc(100vh-140px)]'>
                <div className='flex w-full h-full relative'>
                    <div className={`w-[280px] h-full absolute z-10 ${show ? '-left-[16px]' : '-left-[336px]'} md:left-0 md:relative transition-all`}>
                        <div className='w-full h-[calc(100vh-177px)] bg-[#AFE1AF] md:bg-transparent overflow-y-auto'>
                            <div className='flex text-xl justify-between items-center p-4 md:p-0 md:px-3 md:pb-3 text-[#283046]'>
                                <h2>Penjual</h2>
                                <span onClick={() => setShow(!show)} className='block cursor-pointer md:hidden'><IoMdClose /></span>
                            </div>
                            {
                                sellers.map((s, i) => <Link key={i} to={`/admin/dashboard/chat-sellers/${s._id}`} className={`h-[60px] flex justify-start gap-2 items-center text-[#283046] px-2 rounded-sm py-2 cursor-pointer ${sellerId === s._id ? 'bg-[#FFC300]' : ''}`}>
                                    <div className='relative'>
                                        <img className='w-[38px] h-[38px] border-[#283046] border-2 max-w-[38px] p-[2px] rounded-full' src={s.image ? s.image : sellerImage} alt="" />
                                        {
                                            activeSellers.some(a => a.sellerId === s._id) && <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0'></div>
                                        }
                                    </div>
                                    <div className='flex justify-center items-start flex-col w-full'>
                                        <div className='flex justify-between items-center w-full'>
                                            <h2 className='text-base font-semibold'>{s.name}</h2>
                                        </div>
                                    </div>
                                </Link>)
                            }
                        </div>
                    </div>
                    <div className='w-full md:w-[calc(100%-200px)] md:pl-4'>
                        <div className='flex justify-between items-center'>
                            {
                                sellerId && <div className='flex justify-start items-center gap-3'>
                                    <div className='relative'>
                                        <img className='w-[42px] h-[42px] border-green-500 border-2 p-[2px] rounded-full' src={currentSeller.image ? currentSeller.image : sellerImage} alt="" />
                                        <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0'></div>
                                    </div>
                                    <span className='text-[#283046]'>{currentSeller?.name}</span>
                                </div>
                            }
                            <div onClick={() => setShow(!show)} className='w-[35px] flex md:hidden h-[35px] rounded-sm bg-[#FFC300] shadow-lg hover:shadow-[#FFC300]/50 justify-center cursor-pointer items-center text-[#283046]'>
                                <span><FaList /></span>
                            </div>
                        </div>
                        <div className='py-4'>
                            <div className='bg-[#AFE1AF] h-[calc(100vh-290px)] rounded-md p-3 overflow-y-auto'>
                                {
                                    sellerId ? seller_admin_message.map((m, i) => {
                                        if (m.senderId === sellerId) {
                                            return (
                                                <div ref={scrollRef} key={i} className='w-full flex justify-start items-center'>
                                                    <div className='flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]'>
                                                        <div>
                                                            <img className='w-[38px] h-[38px] border-2 border-[#283046] rounded-full max-w-[38px] p-[3px]' src={currentSeller?.image ? currentSeller?.image : sellerImage} alt="" />
                                                        </div>
                                                        <div className='flex justify-center items-start flex-col w-full bg-[#FFC300] shadow-lg shadow-[#FFC300]/50 text-[#283046] py-1 px-2 rounded-sm'>
                                                            <span>{m.message}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div ref={scrollRef} key={i} className='w-full flex justify-end items-center'>
                                                    <div className='flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]'>
                                                        <div className='flex justify-center items-start flex-col w-full bg-[#E57F84] shadow-lg shadow-[#E57F84]/50 text-[#283046] py-1 px-2 rounded-sm'>
                                                            <span>{m.message}</span>
                                                        </div>
                                                        <div>
                                                            <img className='w-[38px] h-[38px] border-2 border-[#283046] rounded-full max-w-[38px] p-[3px]' src={userInfo.image ? userInfo.image : adminImage} alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }) : <div className='w-full h-full flex justify-center items-center flex-col gap-2 text-[#283046]'>
                                        <span><BsEmojiSmile /></span>
                                        <span>Pilih penjual</span>
                                    </div>
                                }
                            </div>
                        </div>
                        <form onSubmit={send} className='flex gap-3'>
                            <input required value={text} onChange={(e) => setText(e.target.value)} readOnly={sellerId ? false : true} className='w-full flex justify-between px-2 border border-[#AFE1AF] items-center py-[5px] focus:border-[#FFC300] rounded-md outline-none bg-transparent text-[#283046]' type="text" placeholder='Masukkan pesan Anda' />
                            <button disabled={sellerId ? false : true} className='shadow-lg bg-[#FFC300] hover:shadow-[#FFC300]/50 text-semibold w-[75px] h-[35px] rounded-md text-[#283046] flex justify-center items-center'>Kirim</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatSeller