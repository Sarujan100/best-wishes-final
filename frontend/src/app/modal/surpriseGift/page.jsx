"use client";
import React, { useRef } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";

const SurpriseGift = ({ onClose, children }) => {
  const modalRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal} ref={modalRef}>
        {children}
        <div className='flex-col border-1 border-[#D9D9D9] p-[20px] rounded-[10px] space-y-[15px]'>
          <div className='flex justify-between items-center text-[16px]'>
            <p className='text-[18px] font-semibold '>Checkout</p>
            {/* <IoIosCloseCircleOutline  className='text-[30px]'/> */}
          </div>
          <div className='flex justify-between items-center text-[16px]'>
            <p className='text-[#5C5C5C]'>Total items</p>
            <p className='text-[#333333] font-semibold'>2</p>
          </div>
          <div className='flex justify-between items-center text-[16px]'>
            <p className='text-[#5C5C5C]'>Delivery Charge Fees</p>
            <p className='text-[#333333] font-semibold'>US 8$</p>
          </div>
          <div className='flex justify-between items-center text-[16px]'>
            <p className='text-[#5C5C5C]'>Discounts</p>
            <p className='text-green-500 font-semibold'>US 0$</p>
          </div>
          <div className='flex justify-between items-center text-[16px]'>
            <p className='text-[#5C5C5C]'>Estimte Total</p>
            <p className='text-[#333333] font-semibold'>US 56.05$</p>
          </div>
          <hr className='text-[#D9D9D9]' />
          <div className='flex justify-center items-center text-[14px]'>
            This payment must be pay for initially and if any case your payment will be fully refundable
            This request will be Informed with Mail & Notification or if need any clarification Our team will be contact you.
          </div>
          <div className='flex  items-center text-[14px] gap-[10px]'>
            <input type='checkbox' className='w-[20px] h-[20px] rounded-[3px]' />
            <p className='font-semibold'>I read & understood</p>
          </div>
          <div className='w-full flex gap-[8px]'>
            <button onClick={onClose} className='h-[50px] w-[30%] text-[18px] border-2 border-[#822BE2] text-[#822BE2] font-semibold rounded-[8px] hover:cursor-pointer bg-white hover:bg-purple-200 mt-[20px]'>Cancel</button>
            <button className='h-[50px] w-[70%] text-[18px] text-white font-semibold rounded-[8px] hover:cursor-pointer bg-[#822BE2] hover:bg-purple-600 mt-[20px]'>Confirm Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurpriseGift;

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    width: '40%',
    // textAlign: 'center',
    position: 'relative',
  }
};
