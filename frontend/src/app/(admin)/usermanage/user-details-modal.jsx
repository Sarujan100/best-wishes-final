"use client"
import PropTypes from 'prop-types';
import { Modal } from "../../../components/ui/modal"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { User, Mail, Phone, MapPin, Calendar, Clock } from "lucide-react"

UserDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    status: PropTypes.string,
    avatar: PropTypes.string,
    accountCreated: PropTypes.string,
    lastLogin: PropTypes.string,
    orders: PropTypes.number,
    totalBuyingAmount: PropTypes.number,
  }),
};

export function UserDetailsModal({ isOpen, onClose, user }) {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      message=""
      type="info"
      confirmText="Close"
      showCancel={false}
      onConfirm={onClose}
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={user.avatar || "/placeholder.svg"} 
              alt={user.name} 
              className="h-20 w-20 rounded-full object-cover border-4 border-gray-200"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <Badge variant={user.status === "Active" ? "default" : "secondary"} className="mt-1">
              {user.status}
            </Badge>
          </div>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{user.address || 'Not provided'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Account Created</p>
                <p className="font-medium">{formatDate(user.accountCreated)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="font-medium">{formatDate(user.lastLogin)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="font-medium text-lg">{user.orders || 0}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="font-medium text-lg text-green-600">{formatCurrency(user.totalBuyingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
}
