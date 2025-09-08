"use client";

import React from 'react'
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import Loader from '../components/loader/page'

function Page() {
    const { user } = useSelector(state => state.userState);
    const dispatch = useDispatch();

   if (!user) {
    return (
       <div className='h-screen flex justify-center items-center text-red-500 text-[20px]'>
            your access has been denied! Only Admin can access this page.
        </div>
    )
}

if (user.role === 'admin') {
    return (
        <div className='h-screen flex justify-center items-center'>
            hi
        </div>
    )
}

}

export default Page
