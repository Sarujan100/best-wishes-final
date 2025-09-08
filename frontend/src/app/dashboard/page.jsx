"use client";

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../slices/userSlice';
import { useRouter } from 'next/navigation';
import CustomModal from '../modal/samplemodal/page';

function Page() {
  const { user } = useSelector(state => state.userState);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const logoutHandler = () => {
    dispatch(userLogout());
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div>
      <h1>Hello, {user.firstName}</h1>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>

      <button onClick={logoutHandler}>Logout</button>
      <button onClick={openModal}>Open Modal</button>

      {showModal && (
        <CustomModal onClose={closeModal}>
          <h2>Modal Content</h2>
          <p>This content comes from a separate component!</p>
        </CustomModal>
      )}
    </div>
  );
}

export default Page;
