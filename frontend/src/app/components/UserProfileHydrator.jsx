"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from '../actions/userActions';

export default function UserProfileHydrator() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  return null;
} 