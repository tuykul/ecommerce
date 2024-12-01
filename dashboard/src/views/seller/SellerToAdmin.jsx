import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { send_message_seller_admin, messageClear, get_seller_message, updateAdminMessage } from '../../store/Reducers/chatReducer';
import { socket } from '../../utils/utils';
import adminImage from '../../assets/admin.jpg';
import sellerImage from '../../assets/seller.png';

const SellerToAdmin = () => {
    const scrollRef = useRef();
    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const { seller_admin_message, successMessage, activeAdmin } = useSelector(state => state.chat);
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(get_seller_message());
    }, []);

    const send = (e) => {
        e.preventDefault();
        dispatch(send_message_seller_admin({
            senderId: userInfo._id,
            receverId: '',
            message: text,
            senderName: userInfo.name
        }));
        setText('');
    };

    useEffect(() => {
        socket.on('receved_admin_message', msg => {
            dispatch(updateAdminMessage(msg));
        });
    }, []);

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_message_seller_to_admin', seller_admin_message[seller_admin_message.length - 1]);
            dispatch(messageClear());
        }
    }, [successMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [seller_admin_message]);

    return (
        <div className="px-2 lg:px-7 py-5">
            <div className="w-full bg-[#AFE1AF] px-4 py-4 rounded-md h-[calc(100vh-140px)]">
                <div className="flex w-full h-full relative">
                    <div className="w-full md:pl-4">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start items-center gap-3">
                                <div className="relative">
                                    <img 
                                        className="w-[42px] h-[42px] border-[#AFE1AF] border-2 max-w-[42px] p-[2px] rounded-full" 
                                        src={adminImage} 
                                        alt="Admin" 
                                    />
                                    {activeAdmin && (
                                        <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>
                                    )}
                                </div>
                                <h2 className="text-base text-[#283046] font-semibold">Admin Support</h2>
                            </div>
                        </div>
                        <div className="py-4">
                            <div className="bg-[#F9F6EE] h-[calc(100vh-290px)] rounded-md p-3 overflow-y-auto shadow-inner">
                                {seller_admin_message.map((m, i) => {
                                    if (userInfo._id !== m.senderId) {
                                        return (
                                            <div ref={scrollRef} key={i} className="w-full flex justify-start items-center">
                                                <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">
                                                    <div>
                                                        <img 
                                                            className="w-[38px] h-[38px] border-2 border-[#AFE1AF] rounded-full max-w-[38px] p-[3px]" 
                                                            src={adminImage} 
                                                            alt="Admin" 
                                                        />
                                                    </div>
                                                    <div className="flex justify-center items-start flex-col w-full bg-[#AFE1AF] shadow-md text-[#283046] py-2 px-3 rounded-lg">
                                                        <span>{m.message}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div ref={scrollRef} key={i} className="w-full flex justify-end items-center">
                                                <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">
                                                    <div className="flex justify-center items-start flex-col w-full bg-[#FFC300] shadow-md text-[#283046] py-2 px-3 rounded-lg">
                                                        <span>{m.message}</span>
                                                    </div>
                                                    <div>
                                                        <img 
                                                            className="w-[38px] h-[38px] border-2 border-[#AFE1AF] rounded-full max-w-[38px] p-[3px]" 
                                                            src={userInfo.image ? userInfo.image : sellerImage} 
                                                            alt="Seller" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                        <form onSubmit={send} className="flex gap-3">
                            <input
                                required
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full px-4 py-2 border border-[#AFE1AF] rounded-lg outline-none bg-[#F9F6EE] text-[#283046] placeholder-gray-400 focus:border-[#FFC300] transition-colors"
                                type="text"
                                placeholder="Ketik pesan Anda..."
                            />
                            <button className="bg-[#FFC300] hover:bg-[#e6b100] text-[#283046] font-medium px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                                Kirim
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerToAdmin;