"use client";
import React from 'react'
import Navbar from '../../components/navBar/page'
import Image from 'next/image';
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineEdit } from "react-icons/ai";
import { FaCcVisa, FaCcPaypal } from "react-icons/fa";
import { SiMastercard } from "react-icons/si";
import { FiShoppingCart } from "react-icons/fi";
import Footer from '../../components/footer/page'
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../../slices/cartSlice';
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from 'react-icons/ai';
import { toast, Toaster } from 'sonner';

export default function CheckoutPage() {
    const cart = useSelector((state) => state.cartState.items);
    const {user} = useSelector((state) => state.userState);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
        toast.success('Removed from cart');
    };

    const handleIncrease = (id) => {
        dispatch(increaseQuantity(id));
    };

    const handleDecrease = (id) => {
        dispatch(decreaseQuantity(id));
    };

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Helper function to get product image
    const getProductImage = (product) => {
      if (product?.images && product.images.length > 0) {
        if (typeof product.images[0] === 'object' && product.images[0].url) {
          return product.images[0].url;
        }
        return product.images[0];
      }
      return '/placeholder.svg';
    };

    const handleCheckout = () => {
        if (!user) {
            toast.error('Please login to continue');
            return;
        }
        router.push('/payment/cart');
    };

    return (
        <>
            <div className='pl-[80px] pr-[80px] flex-col items-center'>
                <Navbar />
                <div className='font-extra-large font-semibold mt-[15px]'>Cart ({cart.length})</div>

                <div className='flex w-full mt-[15px]'>
                    {cart.length === 0 ? (
                        <div className="flex flex-1 min-h-[60vh] items-center justify-center">
                            <div className="flex flex-col items-center justify-center py-20">
                                <FiShoppingCart className="text-[80px] text-gray-300 mb-4" />
                                <div className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty!</div>
                                <div className="text-md text-gray-400 mb-6">Looks like you haven't added anything yet.</div>
                                <a href="/allProducts">
                                    <button className="px-6 py-3 rounded-full bg-[#822BE2] text-white font-bold text-lg shadow-md hover:bg-purple-200 hover:text-[#822BE2] hover:border-2 hover:border-[#822BE2] transition-all duration-200">Go to Shopping</button>
                                </a>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className='flex-col w-[65%] items-center'>
                                {cart.map((item) => (
                                    <div key={item.productId} className='w-full flex justify-center mb-[30px]'>
                                        <div className="relative w-[15%] ">
                                            <Image
                                                src={getProductImage(item.product)}
                                                alt={item.product.name}
                                                width={130}
                                                height={120}
                                                className="rounded-lg object-cover"
                                                onError={(e) => {
                                                  e.target.src = '/placeholder.svg';
                                                }}
                                            />
                                        </div>
                                        <div className='w-[40%] flex-col pl-[20px]'>
                                            <p className='font-large'>{item.product.name}</p>
                                            <p className='font-large font-semibold'>US ${item.product.price}</p>
                                            <div className="flex text-yellow-400 text-xs sm:text-sm mt-1">
                                                <div className="flex text-yellow-400 text-xs sm:text-sm mt-1">
                                                    {Array.from({ length: 5 }, (_, i) => {
                                                        const fullStars = Math.floor(item.product.rating || 0);
                                                        const hasHalfStar = (item.product.rating || 0) - fullStars >= 0.5;
                                                        if (i < fullStars) {
                                                            return <AiFillStar key={i} />;
                                                        } else if (i === fullStars && hasHalfStar) {
                                                            return <AiTwotoneStar key={i} />;
                                                        } else {
                                                            return <AiOutlineStar key={i} />;
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='bg-[#D9D9D9] mr-[20px] w-[3px] rounded-full'></div>
                                        <div className='w-[45%] flex-col'>
                                            <div className='flex items-center space-x-[15px]'>
                                                <p>Quantity</p>
                                                <button
                                                    className='w-8 h-8 flex justify-center rounded-[5px] bg-gray-300 text-white text-xl font-bold hover:bg-purple-200 hover:text-[#822BE2] hover:border-2 hover:border-[#822BE2] '
                                                    onClick={() => handleDecrease(item.productId)}
                                                >
                                                    -
                                                </button>
                                                <span className='bg-white border-2 border-[#D9D9D9] w-[45px] h-[45px] rounded-[5px] flex justify-center items-center font-large'>{item.quantity}</span>
                                                <button
                                                    className='w-8 h-8 flex justify-center rounded-[5px] bg-gray-300 text-white text-xl font-bold hover:bg-purple-200 hover:text-[#822BE2] hover:border-2 hover:border-[#822BE2]'
                                                    onClick={() => handleIncrease(item.productId)}
                                                >
                                                    +
                                                </button>
                                                <button className='border-2 border-red-500 rounded-full p-[5px] ml-[50px]' onClick={() => handleRemove(item.productId)}><RiDeleteBin6Line className='text-red-500' /></button>
                                            </div>
                                            <div className='flex space-x-[40px] pt-[20px]'>
                                                <span>Price</span> <span className='font-large font-semibold'>US ${(item.product.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {cart.length > 0 && (
                                <div className="flex flex-col w-[35%]">
                                    <div className='w-full p-5  border-2 border-[#D9D9D9] rounded-[10px]'>
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Check Out</h2>
                                        {/* <div className="flex justify-between px-5 py-[2px]">
                                            <p className="text-[16px] text-[#5C5C5C]">Total Items</p>
                                            <p className="text-[16px] font-semibold text-[#333333]">{cart.length}</p>
                                        </div> */}
                                        <div className="flex justify-between px-5 py-[2px]">
                                            <p className="text-[16px] text-[#5C5C5C]">Shipping Fees</p>
                                            <p className="text-[16px] font-semibold text-[#333333]">US $10</p>
                                        </div>
                                        <div className="flex justify-between px-5 py-[2px]">
                                            <p className="text-[16px] text-[#5C5C5C]">Subtotal</p>
                                            <p className="text-[16px] font-semibold text-[#333333]">US ${total.toFixed(2)}</p>
                                        </div>
                                        <div className='px-5 mt-5'>
                                            <button onClick={handleCheckout} className="h-[50px] w-full rounded-[5px] bg-[#822BE2] hover:bg-purple-200 hover:border-2 hover:border-[#822BE2] hover:text-[#822BE2] hover:cursor-pointer text-white font-bold">
                                                Checkout US ${total.toFixed(2)}
                                            </button>
                                        </div>
                                    </div>

                                    <div className='w-full p-5 flex-col border-2 border-[#D9D9D9] rounded-[10px] mt-[20px] mb-[50px]'>
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Payer Information</h2>
                                        <div className='flex justify-between w-full '>
                                            <div className='flex-col w-50% '>
                                                <p className='font-medium text-[#5C5C5C] px-5 py-[2px]'>payer name</p>
                                                <p className='font-semibold text-[#822BE2] px-5 py-[2px] '>{user.firstName}</p>
                                            </div>
                                            <div className='flex-col w-50%  '>
                                                <p className='font-medium text-[#5C5C5C] px-5 py-[2px]'>payer name</p>
                                                <p className='font-semibold text-[#822BE2]  px-5 py-[2px]'>{user.lastName}</p>
                                            </div>
                                        </div>
                                        <div className='flex-col w-full  p-5'>
                                            <p className='font-medium text-[#5C5C5C] py-[2px]'>Shipping Address</p>
                                            <div className='w-full justify-center flex items-center border border-[#818181] mt-[10px] p-[10px] rounded-[5px]'>
                                                <input
                                                    type='text'
                                                    placeholder='shipping address'
                                                    defaultValue={user.address}
                                                    className='bg-transparent outline-none w-full placeholder:text-gray-600'
                                                />
                                                <button>
                                                    <AiOutlineEdit className='text-[25px]' />
                                                </button>
                                            </div>
                                        </div>

                                        <div className='flex w-full  pl-5 pr-5 items-center justify-center'>
                                            <button className='w-full flex justify-center items-center bg-[#822BE2] font-semibold h-[50px] rounded-[5px] text-white  hover:bg-purple-200 hover:border-2 hover:border-[#822BE2] hover:text-[#822BE2] hover:cursor-pointer'>Save Changes</button>
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4">Payment Information</h2>
                                        <p className='px-5 py-[2px]'>Shipping fee will be add based on your buying product and product will be delivered with in 7 daysReturnable with <a href='#'>Terms & Conditions</a></p>
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4">Payment Option</h2>
                                        <div className='flex gap-[10px] items-center px-5 py-[2px]'>
                                            <FaCcVisa className='text-[50px] text-[#5C5C5C]' />
                                            <FaCcPaypal className='text-[50px] text-[#5C5C5C]' />
                                            <SiMastercard className='text-[50px] text-[#5C5C5C]' />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
            <Footer />
            <Toaster position="top-center" richColors closeButton />
        </>
    )
}
