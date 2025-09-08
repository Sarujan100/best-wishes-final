"use client";
import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/navBar/page'
import Image from 'next/image';
import { RiDeleteBin6Line } from "react-icons/ri";
import Footer from '../components/footer/page'
import SurpriseGiftModal from '../modal/surpriseGift/page'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

function page() {
    const { user } = useSelector((state) => state.userState);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Form state
    const [recipientName, setRecipientName] = useState('');
    const [recipientPhone, setRecipientPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [costume, setCostume] = useState('none');
    const [suggestions, setSuggestions] = useState('');

    // Selected product state
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const shippingFee = 8;

    const price = useMemo(() => {
        if (!selectedProduct) return 0;
        const sp = selectedProduct.salePrice;
        const rp = selectedProduct.retailPrice;
        const p = selectedProduct.price;
        return typeof sp === 'number' && sp > 0 ? sp : (typeof rp === 'number' && rp > 0 ? rp : (typeof p === 'number' ? p : 0));
    }, [selectedProduct]);

    const total = useMemo(() => ((price * quantity) + (selectedProduct ? shippingFee : 0)), [price, quantity, selectedProduct]);

    // Fetch product if productId passed in query
    useEffect(() => {
        const productId = searchParams.get('productId') || searchParams.get('id');
        const qParam = Number(searchParams.get('qty'));
        if (qParam && qParam > 0) setQuantity(qParam);
        if (!productId) return;
        let ignore = false;
        (async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
                const data = response.data?.data || response.data;
                if (!ignore && data) {
                    setSelectedProduct(data);
                }
            } catch (error) {
                toast.error('Failed to load product for surprise gift');
            }
        })();
        return () => { ignore = true; };
    }, [searchParams]);

    const getProductImage = () => {
        if (!selectedProduct?.images || selectedProduct.images.length === 0) return '/placeholder.svg';
        const first = selectedProduct.images[0];
        if (typeof first === 'object' && first?.url) return first.url;
        return first;
    };

    const handleRemoveProduct = () => {
        setSelectedProduct(null);
        setQuantity(1);
    };

    const goToProduct = () => {
        if (selectedProduct?._id) router.push(`/productDetail/${selectedProduct._id}`);
    };

    const submitToServer = async () => {
        if (!user) {
            toast.error('Please login to continue');
            return;
        }
        if (!recipientName || !recipientPhone || !shippingAddress) {
            toast.error('Please fill required fields');
            return;
        }
        if (!selectedProduct) {
            toast.error('Please select a product to surprise');
            return;
        }
        const items = [
            {
                productId: selectedProduct._id,
                name: selectedProduct.name,
                price: price,
                quantity: quantity,
                image: getProductImage(),
            }
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
            toast.success('Successfully applied. Wait for the confirmation.');
            router.push('/user/profile');
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to save');
        } finally {
            setSubmitting(false);
        }
    }

    const saveApplyHandler = () => {
        if (!selectedProduct) {
            toast.error('Please select a product to surprise');
            return;
        }
        if (!recipientName || !recipientPhone || !shippingAddress) {
            toast.error('Please fill recipient name, phone, and shipping address');
            return;
        }
        setShowConfirm(true);
    };
    return (
        <>
            <div className='px-4 md:pl-[80px] md:pr-[80px] flex-col items-center'>
                <Navbar />
                <div className='flex w-full mt-[15px] flex-col md:flex-row'>
                    <div className='flex-col md:w-[65%] w-full items-center md:pr-[20px]'>
                        <div className='w-full border-1 border-[#822BE2] rounded-[5px] p-[10px] mb-[20px] flex items-center justify-center text-[18px] font-semibold text-[#822BE2]'>Surprise Gift Delivery</div>
                        {/* Selected product */}
                        {selectedProduct ? (
                            <div className='w-full flex justify-between items-center mb-[30px] md:mb-[50px] gap-4'>
                                <div className="relative w-[30%] md:w-[20%] cursor-pointer" onClick={goToProduct}>
                                    <Image
                                        src={getProductImage()}
                                        alt={selectedProduct?.name || 'image'}
                                        width={200}
                                        height={180}
                                        className="rounded-lg object-cover w-full h-auto"
                                    />
                                </div>
                                <div className='flex-1 flex-col pl-[10px]'>
                                    <p className='font-large line-clamp-2'>{selectedProduct?.name}</p>
                                    <p className='font-large font-semibold'>US ${price.toFixed(2)}</p>
                                </div>
                                <div className='flex flex-col items-end gap-3'>
                                    <div className='flex items-center gap-3'>
                                        <span>Qty</span>
                                        <div className='flex justify-center items-center gap-2'>
                                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className='bg-[#D9D9D9] w-[28px] h-[28px] rounded-[5px] flex justify-center items-center'>-</button>
                                            <span className='bg-white border-2 border-[#D9D9D9] w-[48px] h-[40px] rounded-[5px] flex justify-center items-center font-large'>{quantity}</span>
                                            <button onClick={() => setQuantity(q => q + 1)} className='bg-[#D9D9D9] w-[28px] h-[28px] rounded-[5px] flex justify-center items-center'>+</button>
                                        </div>
                                        <button onClick={handleRemoveProduct} className='border-2 border-red-500 rounded-full p-[6px]'>
                                            <RiDeleteBin6Line className='text-red-500' />
                                        </button>
                                    </div>
                                    <div className='text-right'>
                                        <span className='text-sm text-gray-700'>Subtotal:&nbsp;</span>
                                        <span className='font-semibold'>US ${(price * quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='w-full flex justify-center items-center text-gray-500 mb-[30px] md:mb-[50px]'>
                                No product selected. Go to a product and click Apply.
                            </div>
                        )}
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
            {/* Confirmation Modal */}
            {showConfirm && (
                <SurpriseGiftModal
                    onClose={() => setShowConfirm(false)}
                    onConfirm={submitToServer}
                    itemsCount={selectedProduct ? 1 : 0}
                    deliveryFee={selectedProduct ? shippingFee : 0}
                    discounts={0}
                    estimateTotal={total}
                    confirmLoading={submitting}
                />
            )}
       
            <Footer />
        </>


    )
}

export default page
