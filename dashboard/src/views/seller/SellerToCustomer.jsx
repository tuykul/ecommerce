import React, { useEffect, useRef, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { FaList } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { get_customers, messageClear, get_customer_message, send_message, updateMessage } from '../../store/Reducers/chatReducer'
import { socket } from '../../utils/utils'
import { BsEmojiSmile, BsSend } from 'react-icons/bs'

const SellerToCustomer = () => {

    const scrollRef = useRef()
    const { userInfo } = useSelector(state => state.auth)
    const { customers, currentCustomer, messages, successMessage, activeCustomer } = useSelector(state => state.chat)
    const [receverMessage, setReceverMessage] = useState('')
    const dispatch = useDispatch()
    const [text, setText] = useState('')
    const { customerId } = useParams()

    const [show, setShow] = useState(false)

    useEffect(() => {
        dispatch(get_customers(userInfo._id))
    }, [])
    useEffect(() => {
        if (customerId) {
            dispatch(get_customer_message(customerId))
        }
    }, [customerId])

    const send = (e) => {
        e.preventDefault()
        dispatch(send_message({
            senderId: userInfo._id,
            receverId: customerId,
            text,
            name: userInfo?.shopInfo?.shopName
        }))
        setText('')
    }

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_seller_message', messages[messages.length - 1])
            dispatch(messageClear())
        }
    }, [successMessage])


    useEffect(() => {
        socket.on('customer_message', msg => {
            setReceverMessage(msg)
        })
        // socket.on('activeSeller', (sellers) => {
        //     setActiveSeller(sellers)
        // })
    }, [])

    useEffect(() => {

        if (receverMessage) {
            if (customerId === receverMessage.senderId && userInfo._id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage))
            }
            else {
                toast.success(receverMessage.senderName + " " + "send a message")
                dispatch(messageClear())
            }
        }
    }, [receverMessage])
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])
    return (
        <div className="p-4 min-h-screen bg-[#F9F6EE]">
            <div className="w-full bg-white rounded-lg shadow-lg h-[calc(100vh-140px)] border border-[#AFE1AF]">
                <div className="flex w-full h-full relative">
                    {/* Sidebar Customers */}
                    <div className={`w-[280px] h-full absolute z-10 ${show ? '-left-[16px]' : '-left-[336px]'} md:left-0 md:relative transition-all`}>
                        <div className="w-full h-[calc(100vh-177px)] bg-white border-r border-[#AFE1AF] md:bg-transparent overflow-y-auto">
                            <div className="flex justify-between items-center p-4 border-b border-[#AFE1AF]">
                                <h2 className="text-xl font-semibold text-[#283046]">Pelanggan</h2>
                                <span onClick={() => setShow(!show)} className="block cursor-pointer md:hidden">
                                    <IoMdClose className="text-[#283046]" />
                                </span>
                            </div>
                            
                            {/* Customer List */}
                            <div className="space-y-2 p-3">
                                {customers.map((c, i) => (
                                    <Link 
                                        key={i} 
                                        to={`/seller/dashboard/chat-customer/${c.fdId}`}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F9F6EE] transition-colors"
                                    >
                                        <div className="relative">
                                            <img 
                                                className="w-12 h-12 rounded-full object-cover border-2 border-[#AFE1AF]" 
                                                src="http://localhost:3001/images/admin.jpg" 
                                                alt={c.name} 
                                            />
                                            {activeCustomer.some(a => a.customerId === c.fdId) && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-[#283046]">{c.name}</h3>
                                            <p className="text-sm text-gray-500">Klik untuk chat</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="w-full md:w-[calc(100%-280px)] flex flex-col">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-[#AFE1AF] flex justify-between items-center">
                            {customerId && (
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img 
                                            className="w-12 h-12 rounded-full object-cover border-2 border-[#AFE1AF]" 
                                            src="http://localhost:3001/images/admin.jpg" 
                                            alt="" 
                                        />
                                        {activeCustomer.some(a => a.customerId === currentCustomer._id) && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-[#283046]">{currentCustomer.name}</h3>
                                        <p className="text-sm text-green-500">Online</p>
                                    </div>
                                </div>
                            )}
                            <button 
                                onClick={() => setShow(!show)}
                                className="md:hidden p-2 rounded-lg bg-[#FFC300] text-white hover:shadow-lg transition-shadow"
                            >
                                <FaList />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-[#F9F6EE]">
                            {customerId ? (
                                <div className="space-y-4">
                                    {messages.map((m, i) => (
                                        <div 
                                            ref={scrollRef}
                                            key={i} 
                                            className={`flex ${m.senderId === customerId ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`flex items-start gap-2 max-w-[80%] ${m.senderId === customerId ? 'flex-row' : 'flex-row-reverse'}`}>
                                                <img 
                                                    className="w-8 h-8 rounded-full object-cover border-2 border-[#AFE1AF]" 
                                                    src="http://localhost:3001/images/admin.jpg" 
                                                    alt="" 
                                                />
                                                <div className={`p-3 rounded-lg ${m.senderId === customerId ? 'bg-white' : 'bg-[#FFC300] text-white'}`}>
                                                    <p>{m.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                    <BsEmojiSmile className="text-4xl mb-2" />
                                    <p>Pilih pelanggan untuk memulai chat</p>
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-[#AFE1AF]">
                            <form onSubmit={send} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ketik pesan..."
                                    className="flex-1 px-4 py-2 rounded-lg border border-[#AFE1AF] focus:border-[#FFC300] outline-none bg-[#F9F6EE]"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    readOnly={!customerId}
                                />
                                <button
                                    type="submit"
                                    disabled={!customerId}
                                    className="px-4 py-2 bg-[#FFC300] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <BsSend />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerToCustomer;