"use client";
import React, { useState } from 'react'
import Navbar from '../components/navBar/page'
import Image from 'next/image';
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineEdit } from "react-icons/ai";
import { FaCcVisa, FaCcPaypal } from "react-icons/fa";
import { SiMastercard } from "react-icons/si";
import Footer from '../components/footer/page'
import SurpriseGift from '../modal/surpriseGift/page'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';

function page() {
    const { user } = useSelector((state) => state.userState);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const closeModal = () => setShowModal(false);

    // Form state
    const [recipientName, setRecipientName] = useState('');
    const [recipientPhone, setRecipientPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [costume, setCostume] = useState('none');
    const [suggestions, setSuggestions] = useState('');
    const [quantity1, setQuantity1] = useState(1);
    const [quantity2, setQuantity2] = useState(1);

    const price1 = 25.0;
    const price2 = 25.25;
    const shippingFee = 8;
    const total = (price1 * quantity1) + (price2 * quantity2) + shippingFee;

    const saveApplyHandler = async () => {
        if (!user) {
            toast.error('Please login to continue');
            return;
        }
        if (!recipientName || !recipientPhone || !shippingAddress) {
            toast.error('Please fill required fields');
            return;
        }
        const items = [
            { productId: 'placeholder-product-1', name: 'Gift Mug', price: price1, quantity: quantity1, image: '/mug.jpg' },
            { productId: 'placeholder-product-2', name: 'Gift Mug 2', price: price2, quantity: quantity2, image: '/mug.jpg' },
        ];
        try {
            setSubmitting(true);
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/surprise`, {
                recipientName,
                recipientPhone,
                shippingAddress,
                costume,
                suggestions,
                items,
                total,
            }, { withCredentials: true });
            toast.success('Surprise gift request submitted');
            setShowModal(true);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to save');
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <>
            <div className='px-4 md:pl-[80px] md:pr-[80px] flex-col items-center'>
                <Navbar />
                <div className='flex w-full mt-[15px] flex-col md:flex-row'>
                    <div className='flex-col md:w-[65%] w-full items-center md:pr-[20px]'>
                        <div className='w-full border-1 border-[#822BE2] rounded-[5px] p-[10px] mb-[20px] flex items-center justify-center text-[18px] font-semibold text-[#822BE2]'>Surprise Gift Delivery</div>
                        {/* left side */}
                        <div className='w-full  flex justify-center mb-[30px] md:mb-[50px]'>
                            <div className="relative w-[35%] md:w-[15%] ">
                                <Image
                                    src="/mug.jpg"
                                    alt="image"
                                    width={130}
                                    height={120}
                                    className="rounded-lg object-cover"
                                />
                            </div>
                            <div className='w-[65%] md:w-[40%]  flex-col pl-[20px]'>
                                <p className='font-large'>Product name</p>
                                <p className='font-large font-semibold'>Product Price</p>
                                <div>stars</div>
                            </div>
                            <div className='hidden md:block bg-[#D9D9D9] mr-[20px] w-[3px] rounded-full'></div>
                            <div className='w-[45%] flex-col hidden md:block'>
                                <div className=' flex items-center space-x-[15px]'>
                                    <p>Quantity</p>
                                    <div className='flex justify-center items-center space-x-[10px]'>
                                        <button onClick={() => setQuantity1(q => Math.max(1, q - 1))} className='bg-[#D9D9D9] w-[25px] h-[25px] rounded-[5px] flex justify-center items-center'>-</button>
                                        <span className='bg-white border-2 border-[#D9D9D9] w-[45px] h-[45px] rounded-[5px] flex justify-center items-center font-large'>{quantity1}</span>
                                        <button onClick={() => setQuantity1(q => q + 1)} className='bg-[#D9D9D9] w-[25px] h-[25px] rounded-[5px] flex justify-center items-center'>+</button>
                                    </div>
                                    <button className='border-2 border-red-500 rounded-full p-[5px] ml-[50px]'><RiDeleteBin6Line className='text-red-500' /></button>
                                </div>
                                <div className='flex space-x-[40px] pt-[20px]'>
                                    <span>Price</span> <span className='font-large font-semibold'>US {(price1 * quantity1).toFixed(2)}$</span>
                                </div>
                            </div>
                        </div>
                        {/* ------------- */}
                        <div className='w-full  flex justify-center'>
                            <div className="relative w-[35%] md:w-[15%] ">
                                <Image
                                    src="/mug.jpg"
                                    alt="image"
                                    width={130}
                                    height={120}
                                    className="rounded-lg object-cover"
                                />
                            </div>
                            <div className='w-[65%] md:w-[40%]  flex-col pl-[20px]'>
                                <p className='font-large'>Product name</p>
                                <p className='font-large font-semibold'>Product Price</p>
                                <div>stars</div>
                            </div>
                            <div className='hidden md:block bg-[#D9D9D9] mr-[20px] w-[3px] rounded-full'></div>
                            <div className='w-[45%] flex-col hidden md:block'>
                                <div className=' flex items-center space-x-[15px]'>
                                    <p>Quantity</p>
                                    <div className='flex justify-center items-center space-x-[10px]'>
                                        <button onClick={() => setQuantity2(q => Math.max(1, q - 1))} className='bg-[#D9D9D9] w-[25px] h-[25px] rounded-[5px] flex justify-center items-center'>-</button>
                                        <span className='bg-white border-2 border-[#D9D9D9] w-[45px] h-[45px] rounded-[5px] flex justify-center items-center font-large'>{quantity2}</span>
                                        <button onClick={() => setQuantity2(q => q + 1)} className='bg-[#D9D9D9] w-[25px] h-[25px] rounded-[5px] flex justify-center items-center'>+</button>
                                    </div>
                                    <button className='border-2 border-red-500 rounded-full p-[5px] ml-[50px]'><RiDeleteBin6Line className='text-red-500' /></button>
                                </div>
                                <div className='flex space-x-[40px] pt-[20px]'>
                                    <span>Price</span> <span className='font-large font-semibold'>US {(price2 * quantity2).toFixed(2)}$</span>
                                </div>
                            </div>
                        </div>
                        {/* ------------- */}
                    </div>


                    <div className="flex-col md:w-[35%] w-full mt-6 md:mt-0">
                        <div className='flex-col border-1 border-[#818181] rounded-[10px] p-[20px]'>
                            <p className='text-[18px] font-semibold text-[#333333] mb-[20px]'>Personal Information</p>
                            <div className='flex-col '>
                                <p className='text-[16px] text-[#5C5C5C]'>Person Name</p>
                                <div className='w-full justify-center flex items-center border border-[#D9D9D9] mt-[10px] p-[10px] rounded-[5px]'>
                                    <input
                                        type='text'
                                        placeholder='Recipient name'
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        className='bg-transparent outline-none w-full placeholder:text-gray-600'
                                    />
                                </div>
                            </div>
                            <div className='flex-col'>
                                <p className='text-[16px] text-[#5C5C5C] mt-[10px]'>Person Mobile Number</p>
                                <div className='w-full justify-center flex items-center border border-[#D9D9D9] mt-[10px] p-[10px] rounded-[5px]'>
                                    <input
                                        type='number'
                                        placeholder='077-*******'
                                        value={recipientPhone}
                                        onChange={(e) => setRecipientPhone(e.target.value)}
                                        className='bg-transparent outline-none w-full placeholder:text-gray-600'
                                    />
                                </div>
                            </div>
                            <div className='flex-col'>
                                <p className='text-[16px] text-[#5C5C5C] mt-[10px]'>Person Shipping Address</p>
                                <div className='w-full justify-center flex items-center border border-[#D9D9D9] mt-[10px] p-[10px] rounded-[5px]'>
                                    <input
                                        type='text'
                                        placeholder='Shipping address'
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        className='bg-transparent outline-none w-full placeholder:text-gray-600'
                                    />
                                </div>
                            </div>
                            <div className='flex-col'>
                                <p className='text-[16px] text-[#5C5C5C] mt-[10px]'>Select Custume If you want</p>
                                <div className='w-full justify-center flex items-center border border-[#D9D9D9] mt-[10px] p-[10px] rounded-[5px]'>
                                    <select name="costume" className='w-full' value={costume} onChange={(e) => setCostume(e.target.value)}>
                                        <option value="none" className='flex justify-center items-center w-full'>No costume</option>
                                        <option value="mickey" className='flex justify-center items-center w-full'>Mickey Mouse</option>
                                        <option value="tomjerry" className='flex justify-center items-center w-full'>Tom and Jerry</option>
                                        <option value="joker" className='flex justify-center items-center w-full'>Joker</option>
                                    </select>
                                </div>
                            </div>

                            <div className='flex-col '>
                                <p className='text-[16px] text-[#5C5C5C] mt-[10px]'>Suggestions</p>
                                <div className='w-full justify-center flex items-center border border-[#D9D9D9] mt-[10px] p-[10px] rounded-[5px]'>
                                    <textarea
                                        type='text'
                                        placeholder='Any suggestions...'
                                        value={suggestions}
                                        onChange={(e) => setSuggestions(e.target.value)}
                                        className='bg-transparent outline-none w-full placeholder:text-gray-600'
                                    />
                                </div>
                            </div>
                            <div className='text-right text-sm text-gray-600 mt-2'>Total: US ${total.toFixed(2)}</div>
                            <button disabled={submitting} className={`h-[50px] w-full text-[18px] text-white font-semibold rounded-[8px] hover:cursor-pointer bg-[#822BE2] hover:bg-purple-600 mt-[10px] ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`} onClick={saveApplyHandler}>
                                {submitting ? 'Saving...' : 'Save & Apply'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            {showModal && (
                <SurpriseGift onClose={closeModal}>
                    
                </SurpriseGift>
            )}
            
            <Footer />
        </>


    )
}

export default page
