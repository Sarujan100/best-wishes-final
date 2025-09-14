"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FiMail, FiPhone, FiMapPin, FiShoppingBag, FiLogOut, FiEdit2, FiUser, FiEye, FiEyeOff, FiClock, FiGift } from "react-icons/fi";
import Navbar from "@/app/components/navbar/page";
import axios from "axios";
import { toast, Toaster } from 'sonner';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { updateUserProfile } from "../../slices/userSlice";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useRef } from "react";
import { userLogout } from '@/app/slices/userSlice';
import { clearCart } from '@/app/slices/cartSlice';
import { clearWishlist } from '@/app/slices/wishlistSlice';
import { fetchUserProfile } from '../../actions/userActions'; // import at the top

export default function ProfilePage() {
  const { user } = useSelector(state => state.userState);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Reminder state
  const [reminders, setReminders] = useState([]);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [editReminder, setEditReminder] = useState(null);
  const [editFields, setEditFields] = useState({ remindermsg: '', date: '', time: '', event: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const [profileImage, setProfileImage] = useState(""); // Only used for upload, not for display
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  // Add at the top, after other state declarations
  const [contributions, setContributions] = useState([]);
  const [contributionsLoading, setContributionsLoading] = useState(false);

  // Add modal state
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Orders summary state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  // Surprise gifts state
  const [surpriseGifts, setSurpriseGifts] = useState([]);
  const [surpriseLoading, setSurpriseLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setPhone(user.phone || '');
      setAddress(user.address || '');
      // No need to setProfileImage for display; always use user.profileImage
      setSelectedFile(null);
      setPreviewUrl("");
      setTimeout(() => setIsLoading(false), 800);
      fetchReminders();
    }
  }, [user, router]);

  // Fetch user contributions
  useEffect(() => {
    if (!user) return;
    const fetchContributions = async () => {
      setContributionsLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gift`, { withCredentials: true });
        setContributions(res.data || []);
      } catch (err) {
        setContributions([]);
      } finally {
        setContributionsLoading(false);
      }
    };
    fetchContributions();
  }, [user]);

  
  const logoutHandler = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, { withCredentials: true });
      dispatch(userLogout());
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
    dispatch(clearCart());
    dispatch(clearWishlist());
  };

  // Fetch user orders for summary
  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/history`, { withCredentials: true });
        setOrders(res.data?.orders || []);
      } catch (err) {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  // Fetch surprise gifts
  useEffect(() => {
    if (!user) return;
    const fetchSurprises = async () => {
      setSurpriseLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/surprise/my`, { withCredentials: true });
        setSurpriseGifts(res.data?.data || []);
      } catch (err) {
        setSurpriseGifts([]);
      } finally {
        setSurpriseLoading(false);
      }
    };
    fetchSurprises();
  }, [user]);

  const fetchReminders = async () => {
    setReminderLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reminder`, { withCredentials: true });
      setReminders(res.data.reminders || []);
    } catch (err) {
      toast.error('Failed to fetch reminders');
    } finally {
      setReminderLoading(false);
    }
  };

  const openEditModal = (reminder) => {
    setEditReminder(reminder);
    setEditFields({
      remindermsg: reminder.remindermsg,
      date: reminder.date ? reminder.date.slice(0, 10) : '',
      time: reminder.time || '',
      event: reminder.event || '',
    });
  };
  const closeEditModal = () => {
    setEditReminder(null);
    setEditFields({ remindermsg: '', date: '', time: '', event: '' });
    setIsAddMode(false);
  };
  const handleEditChange = (e) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };
  const handleEditSave = async () => {
    if (!editFields.remindermsg || !editFields.date || !editFields.time || !editFields.event) {
      toast.error('Please fill all fields');
      return;
    }
    setEditSaving(true);
    try {
      if (isAddMode) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reminder`, editFields, { withCredentials: true });
        toast.success('Reminder created!');
      } else {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/reminder/${editReminder._id}`, editFields, { withCredentials: true });
        toast.success('Reminder updated!');
      }
      closeEditModal();
      fetchReminders();
    } catch (err) {
      toast.error('Failed to update reminder');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;
    setDeleteLoadingId(reminderId);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/reminder/${reminderId}`, { withCredentials: true });
      toast.success('Reminder deleted!');
      fetchReminders();
    } catch (err) {
      toast.error('Failed to delete reminder');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadProfileImage = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    setUploading(true);
    try {
      console.log('Uploading profile image...', selectedFile.name);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload/single`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log('Upload response:', res.data);
      
      // Store the uploaded image URL
      const uploadedImageUrl = res.data.data.url;
      setProfileImage(uploadedImageUrl);
      
      console.log('Saving profile with new image URL:', uploadedImageUrl);
      
      // Immediately save the profile with the new image
      await handleSaveChanges(uploadedImageUrl);
      
      setSelectedFile(null);
      setPreviewUrl("");
      toast.success('Profile image uploaded and saved successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleEditPhotoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleCancelImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleSaveChanges = async (newProfileImage = null) => {
    setIsSaving(true);
    try {
      // Use the new profile image if provided, otherwise use the current profileImage state or user's existing image
      const imageToSave = newProfileImage || profileImage || user.profileImage || "";
      
      console.log('Saving profile changes:', { phone, address, profileImage: imageToSave });
      
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/updateprofile`,
        { phone, address, profileImage: imageToSave },
        { withCredentials: true }
      );
      
      console.log('Profile update response:', res.data);
      
      // Update the Redux state with the new user data
      if (res.data && res.data.user) {
        dispatch(updateUserProfile(res.data.user));
        console.log('Updated Redux state with new user data');
      }
      
      // Reset the profile image state after successful save
      setProfileImage("");
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error('Profile update error:', err);
      const msg = err.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const openAddModal = () => {
    setIsAddMode(true);
    setEditReminder({});
    setEditFields({ remindermsg: '', date: '', time: '', event: '' });
  };

  const openContributionModal = (contribution) => {
    setSelectedContribution(contribution);
    setShowModal(true);
  };
  const closeContributionModal = () => {
    setShowModal(false);
    setSelectedContribution(null);
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-blue-50">
        <main className="max-w-5xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Account</h1>
            <p className="text-base text-gray-500 mt-1">Manage your personal information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column - Profile Card */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-md border p-8 flex flex-col items-center sticky top-28" style={{ borderColor: 'rgba(217,217,217,0.5)' }}>
                <div className="relative mb-4">
                  <span className="block w-36 h-36 rounded-full bg-gradient-to-tr from-purple-200 to-blue-200 p-1 shadow-lg">
                    <img
                      src={previewUrl || user?.profileImage || '/placeholder.svg'}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                      onError={(e) => {
                        e.target.src = '/placeholder.svg';
                      }}
                    />
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleProfileImageChange}
                  />
                  <button
                    className="absolute bottom-2 right-2 bg-white p-2 rounded-full border border-gray-200 shadow hover:bg-gray-50 transition-colors"
                    title="Change photo"
                    onClick={handleEditPhotoClick}
                    disabled={uploading}
                  >
                    <FiEdit2 className="w-5 h-5 text-gray-600" />
                  </button>
                  {selectedFile && (
                    <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col items-center z-10">
                      <div className="mb-2 text-gray-700 font-medium">Preview</div>
                      <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border mb-2" />
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
                          onClick={handleUploadProfileImage}
                          disabled={uploading}
                        >
                          {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                        <button
                          className="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                          onClick={handleCancelImage}
                          disabled={uploading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <FiMail className="w-4 h-4 mr-2" />
                  <span>{user.email}</span>
                </div>
                {user.role && (
                  <span className="mt-2 inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 capitalize">
                    {user.role}
                  </span>
                )}
                <div className="w-full mt-8 pt-6 border-t border-gray-100 space-y-3">
                  <button
                    onClick={() => router.push("/orders")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                  >
                    <FiShoppingBag className="w-5 h-5" />
                    <span>View Orders</span>
                  </button>
                  <button
                    onClick={logoutHandler}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium shadow-sm hover:cursor-pointer"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Right Column - Information */}
            <section className="lg:col-span-2 space-y-10">
              {/* 1. Personal Information */}
              <div className="bg-white rounded-md border" style={{ borderColor: 'rgba(217,217,217,0.5)' }}>
                <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-purple-00 to-blue-100">
                    <FaUser className="w-5 h-5 text-purple-600" />
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Personal Information</h3>
                </div>
                <form className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="w-4 h-4 text-gray-400" />
                        </span>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Add phone number"
                          className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition text-gray-900 bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMapPin className="w-4 h-4 text-gray-400" />
                        </span>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Add address"
                          className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition text-gray-900 bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveChanges()}
                      disabled={isSaving}
                      className="px-8 py-3 bg-purple-600 text-white text-base font-semibold rounded-lg shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
{/* 2. Order Summary */}
<div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
  {/* Header */}
  <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-green-100 to-blue-100">
      <FiShoppingBag className="w-5 h-5 text-green-600" />
    </span>
    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Order Summary</h3>
  </div>

  {/* Content */}
  <div className="p-6">
    {ordersLoading ? (
      <div className="text-sm text-gray-500">Loading order summary...</div>
    ) : (
      <div className="flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Total Orders */}
          <div className="flex flex-col items-start rounded-xl border border-gray-100 bg-gray-50 p-4 hover:shadow-sm transition">
            <span className="text-xs text-gray-500">Total Orders</span>
            <span className="mt-1 text-2xl font-bold text-gray-900">{orders.length}</span>
          </div>

          {/* Last Order */}
          <div className="flex flex-col items-start rounded-xl border border-gray-100 bg-gray-50 p-4 hover:shadow-sm transition">
            <span className="text-xs text-gray-500">Last Order</span>
            <span className="mt-1 text-lg font-medium text-gray-900">
              {orders[0]?.orderedAt
                ? new Date(orders[0].orderedAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          {/* Status Breakdown */}
          <div className="flex flex-col items-start rounded-xl border border-gray-100 bg-gray-50 p-4 hover:shadow-sm transition">
            <span className="text-xs text-gray-500">Status Overview</span>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => {
                const count = orders.filter((o) => o.status === s).length;
                return (
                  <span
                    key={s}
                    className="flex items-center gap-1 text-gray-700"
                  >
                    <span className="font-medium">{s}:</span>
                    <span>{count}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-end">
          <button
            onClick={() => router.push("/user/history")}
            className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            View Order History
          </button>
        </div>
      </div>
    )}
  </div>
</div>


              {/* 3. Reminder History */}
              <div className="bg-white rounded-md border" style={{ borderColor: 'rgba(217,217,217,0.5)' }}>
                <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-100 to-purple-100">
                    <FiClock className="w-5 h-5 text-yellow-600" />
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Reminder History</h3>
                </div>
                <div className="p-8">
                  {reminderLoading ? (
                    <div>Loading reminders...</div>
                  ) : reminders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="bg-purple-50 rounded-full p-4 mb-4">
                        <FiClock className="w-10 h-10 text-purple-400" />
                      </div>
                      <div className="text-lg font-semibold text-gray-700 mb-1">No Reminders Yet</div>
                      <div className="text-gray-400 text-sm mb-4">You haven't set any reminders. Start by adding a new one!</div>
                      <button
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow"
                        onClick={openAddModal}
                      >
                        Set Reminder
                      </button>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      <div className="flex justify-end mb-4">
                        <button
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          onClick={openAddModal}
                        >
                          Add Reminder
                        </button>
                      </div>
                      {reminders.map(reminder => (
                        <li key={reminder._id} className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div>
                            <div className="font-semibold text-gray-800">{reminder.event}</div>
                            <div className="text-gray-600 text-sm">{reminder.remindermsg}</div>
                            <div className="text-gray-500 text-xs mt-1">{reminder.date ? reminder.date.slice(0,10) : ''} {reminder.time}</div>
                          </div>
                          <div className="flex gap-2 mt-2 md:mt-0">
                            <button
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                              onClick={() => openEditModal(reminder)}
                            >
                              Edit
                            </button>
                            <button
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
                              onClick={() => handleDeleteReminder(reminder._id)}
                              disabled={deleteLoadingId === reminder._id}
                            >
                              {deleteLoadingId === reminder._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* 4. Gift Contributions */}
              <div className="bg-white rounded-md border" style={{ borderColor: 'rgba(217,217,217,0.5)' }}>
                <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-purple-100 to-pink-100">
                    <FiGift className="w-5 h-5 text-purple-600" />
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Gift Contributions</h3>
                </div>
                <div className="p-8">
                  {contributionsLoading ? (
                    <div className="text-center text-gray-500">Loading contributions...</div>
                  ) : contributions.length === 0 ? (
                    <div className="text-center">
                      <p className="text-gray-500 mb-4">You have not participated in any collaborative gifts yet.</p>
                      <a
                        href="/dashboard/collaborative-purchases"
                        className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                      >
                        Visit
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {contributions.map((c) => {
                        const product = c.product || {};
                        const productImage = product.images && product.images.length > 0 ? (product.images[0].url || product.images[0]) : null;
                        return (
                          <div key={c._id} className="bg-white rounded-xl p-4 flex flex-col items-center shadow-sm border border-gray-100">
                            {productImage ? (
                              <img src={productImage} alt={product.name || c.productName} className="w-24 h-24 object-cover rounded-lg border mb-3" />
                            ) : (
                              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg border text-gray-400 mb-3">No Image</div>
                            )}
                            <h4 className="text-base font-semibold text-purple-800 mb-1 text-center">{product.name || c.productName}</h4>
                            <p className="text-gray-700 text-sm mb-1">Price: <span className="font-medium">Rs. {c.productPrice || product.salePrice || product.retailPrice}</span></p>
                            <p className="text-gray-500 text-xs mb-2">Deadline: {new Date(c.deadline).toLocaleDateString()}</p>
                            <button
                              onClick={() => openContributionModal(c)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors w-full"
                            >
                              View
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Surprise Gifts */}
              <div className="rounded-xl border bg-white" style={{ borderColor: 'rgba(217,217,217,0.5)' }}>
                <div className="flex items-center justify-between px-6 py-5 border-b bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-purple-100 shadow-sm">
                      <FiGift className="w-5 h-5 text-purple-600" />
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">Surprise Gift Orders</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Track the status of your surprise deliveries</p>
                    </div>
                  </div>
                  {/* {!surpriseLoading && surpriseGifts.length > 0 && (
                    <button
                      onClick={() => window.location.assign('/user/history')}
                      className="px-3 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View all
                    </button>
                  )} */}
                </div>
                <div className="p-6 sm:p-8">
                  {surpriseLoading ? (
                    <div className="flex items-center gap-3 text-gray-500 text-sm"><span className="w-4 h-4 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin"/> Loading...</div>
                  ) : surpriseGifts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-10 rounded-lg border border-dashed border-gray-200 bg-gray-50">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                        <FiGift className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="text-gray-700 font-medium mb-1">No surprise gift orders yet</div>
                      <div className="text-gray-500 text-sm mb-4">Start by choosing a product to surprise someone</div>
                      <button onClick={() => window.location.assign('/allProducts')} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">Explore products</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {surpriseGifts.slice(0,4).map((g) => (
                        <div
                          key={g._id}
                          className="w-full rounded-xl border border-[#5C5C5C]-300 bg-white p-4 sm:p-5  hover:shadow-md transition-shadow"
                        >
                          {/* Header row */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-[11px] uppercase tracking-wide text-gray-500">Recipient</div>
                              <div className="font-semibold text-gray-900 truncate">{g.recipientName}</div>
                              <div className="text-xs text-gray-500">{new Date(g.createdAt).toLocaleDateString()}</div>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                g.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                                g.status === 'Cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                                g.status === 'OutForDelivery' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              }`}
                            >
                              {g.status}
                            </span>
                          </div>
                          {/* Meta */}
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                            {g.costume && g.costume !== 'none' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 border border-gray-200">
                                <span className="font-medium">Costume:</span>
                                <span className="capitalize">{g.costume}</span>
                              </span>
                            )}
                            {g.suggestions && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 border border-gray-200 truncate max-w-full">
                                <span className="font-medium">Note:</span>
                                <span className="truncate">{g.suggestions}</span>
                              </span>
                            )}
                          </div>
                          {/* Items */}
                          <div className="mt-4 divide-y divide-gray-100">
                            {g.items?.map((it, idx) => {
                              const image = typeof it.image === 'string' ? it.image : (it.product?.images && it.product.images[0] && (it.product.images[0].url || it.product.images[0])) || '/placeholder.svg';
                              const pid = it.product?._id || it.product;
                              const name = it.name || it.product?.name || 'Item';
                              const price = typeof it.price === 'number' ? it.price : (it.product?.salePrice || it.product?.retailPrice || 0);
                              return (
                                <div key={idx} className="py-3 flex items-center gap-3">
                                  <a href={pid ? `/productDetail/${pid}` : '#'} className="w-16 h-16 rounded-lg overflow-hidden border bg-gray-50 flex-shrink-0">
                                    <img src={image || '/placeholder.svg'} alt={name} className="w-full h-full object-cover" />
                                  </a>
                                  <div className="flex-1 min-w-0">
                                    <a href={pid ? `/productDetail/${pid}` : '#'} className="text-sm font-medium text-gray-900 hover:underline truncate block">{name}</a>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">Qty: {it.quantity || 1}</span>
                                      <span className="text-gray-300">•</span>
                                      <span>US ${Number(price).toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/* Footer */}
                          <div className="mt-4 pt-3 flex items-center justify-between border-t border-gray-100">
                            <div className="text-sm text-gray-600">Total</div>
                            <div className="text-base font-semibold text-gray-900">US ${Number(g.total || 0).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 6. Change Password */}
              <div className="bg-white rounded-md border" style={{ borderColor: 'rgba(217,217,217,0.5)' }}>
                <div className="flex items-center gap-3 px-8 py-5 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-pink-100 to-yellow-100">
                    <RiLockPasswordFill  className="w-5 h-5 text-pink-600" />
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Change Password</h3>
                </div>
                <div className="p-8">
                  <PasswordChangeForm />
                </div>
              </div>
            </section>
          </div>
        </main>
        <Toaster position="top-center" richColors closeButton />
      </div>

      {/* Edit/Add Reminder Modal */}
      {(editReminder !== null || isAddMode) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={closeEditModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
              aria-label="Close"
            >
              <IoCloseCircleOutline size={24} />
            </button>
            <h3 className="text-lg font-semibold mb-4">{isAddMode ? 'Add Reminder' : 'Edit Reminder'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Event</label>
                <input
                  name="event"
                  value={editFields.event}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., Birthday"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Message</label>
                <input
                  name="remindermsg"
                  value={editFields.remindermsg}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Reminder message"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editFields.date}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={editFields.time}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={closeEditModal} className="px-4 py-2 rounded border">Cancel</button>
                <button
                  onClick={handleEditSave}
                  disabled={editSaving}
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                >
                  {editSaving ? 'Saving...' : (isAddMode ? 'Create' : 'Save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contribution Details Modal */}
      {showModal && selectedContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 relative">
            <button
              onClick={closeContributionModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-purple-700 mb-4 text-center">🎁 Gift Contribution Details</h2>
            <div className="flex flex-col items-center mb-4">
              {selectedContribution.product && selectedContribution.product.images && selectedContribution.product.images.length > 0 ? (
                <img src={selectedContribution.product.images[0].url || selectedContribution.product.images[0]} alt={selectedContribution.product.name || selectedContribution.productName} className="w-28 h-28 object-cover rounded-lg border mb-2" />
              ) : (
                <div className="w-28 h-28 bg-gray-100 flex items-center justify-center rounded-lg border text-gray-400 mb-2">No Image</div>
              )}
              <h3 className="text-lg font-semibold text-purple-800 mb-1 text-center">{selectedContribution.product?.name || selectedContribution.productName}</h3>
              <p className="text-gray-700 text-sm mb-1">Price: <span className="font-medium">Rs. {selectedContribution.productPrice || selectedContribution.product?.salePrice || selectedContribution.product?.retailPrice}</span></p>
              <p className="text-gray-500 text-xs mb-2">Deadline: {new Date(selectedContribution.deadline).toLocaleDateString()}</p>
            </div>
            <div className="mb-3">
              <h4 className="font-semibold text-gray-800 mb-1">Participants</h4>
              <ul className="list-disc pl-6 text-sm">
                {selectedContribution.participants.map((p, idx) => (
                  <li key={idx} className="mb-1">
                    {p.email} {p.hasPaid ? <span className="text-green-600">(Paid)</span> : p.declined ? <span className="text-red-500">(Declined)</span> : <span className="text-yellow-600">(Pending)</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-3">
              <h4 className="font-semibold text-gray-800 mb-1">Status</h4>
              <p className="capitalize text-sm">{selectedContribution.status}</p>
            </div>
            <div className="flex mt-4 justify-center">
              {selectedContribution.product?._id && (
                <a
                  href={`/productDetail/${selectedContribution.product._id}`}
                  target="_self"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-4 py-2 border border-purple-600 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors"
                >
                  View Product
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Password Change Form Component
function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength meter
  function getStrength(password) {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }
  const strength = getStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/changepassword`,
        { oldPassword: currentPassword, password: newPassword },
        { withCredentials: true }
      );
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update password.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition text-gray-900 bg-gray-50 pr-12"
            placeholder="Enter current password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500"
            tabIndex={-1}
            onClick={() => setShowCurrent(v => !v)}
            aria-label={showCurrent ? "Hide password" : "Show password"}
          >
            {showCurrent ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition text-gray-900 bg-gray-50 pr-12"
            placeholder="Enter new password"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500"
            tabIndex={-1}
            onClick={() => setShowNew(v => !v)}
            aria-label={showNew ? "Hide password" : "Show password"}
          >
            {showNew ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {/* Password strength meter */}
        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              strength === 0 ? "w-0" :
              strength === 1 ? "w-1/4 bg-red-400" :
              strength === 2 ? "w-2/4 bg-yellow-400" :
              strength === 3 ? "w-3/4 bg-blue-400" :
              "w-full bg-green-500"
            }`}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {strength === 0 && "Too weak"}
          {strength === 1 && "Weak"}
          {strength === 2 && "Medium"}
          {strength === 3 && "Strong"}
          {strength === 4 && "Very strong"}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition text-gray-900 bg-gray-50 pr-12"
            placeholder="Confirm new password"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500"
            tabIndex={-1}
            onClick={() => setShowConfirm(v => !v)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-[#822BE2] text-white text-base font-semibold rounded-lg shadow hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>
    </form>
  );
}
