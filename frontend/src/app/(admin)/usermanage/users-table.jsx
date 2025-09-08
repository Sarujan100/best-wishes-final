"use client"
import PropTypes from 'prop-types';
import { useState } from "react"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Checkbox } from "../../../components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import {
  MoreHorizontal,
  Edit,
  Eye,
  UserCheck,
  UserX,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Mock user data with all required fields
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe../../..example.com",
    status: "Active",
    logins: 142,
    orders: 23,
    lastLogin: "2024-01-15 14:30:22",
    accountCreated: "2023-03-15",
    totalBuyingAmount: 2847.5,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith../../..example.com",
    status: "Active",
    logins: 89,
    orders: 15,
    lastLogin: "2024-01-14 09:15:10",
    accountCreated: "2023-05-22",
    totalBuyingAmount: 1923.75,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.j../../..example.com",
    status: "Inactive",
    logins: 34,
    orders: 7,
    lastLogin: "2023-12-20 16:45:33",
    accountCreated: "2023-08-10",
    totalBuyingAmount: 567.25,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis../../..example.com",
    status: "Active",
    logins: 67,
    orders: 12,
    lastLogin: "2024-01-13 11:20:45",
    accountCreated: "2023-06-18",
    totalBuyingAmount: 1456.8,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "m.wilson../../..example.com",
    status: "Active",
    logins: 156,
    orders: 31,
    lastLogin: "2024-01-15 08:30:12",
    accountCreated: "2023-02-28",
    totalBuyingAmount: 3892.4,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "6",
    name: "Sarah Brown",
    email: "sarah.brown../../..example.com",
    status: "Inactive",
    logins: 23,
    orders: 4,
    lastLogin: "2023-11-15 13:25:18",
    accountCreated: "2023-09-05",
    totalBuyingAmount: 234.9,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "7",
    name: "David Miller",
    email: "david.miller../../..example.com",
    status: "Active",
    logins: 98,
    orders: 19,
    lastLogin: "2024-01-14 17:10:55",
    accountCreated: "2023-04-12",
    totalBuyingAmount: 2156.3,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "8",
    name: "Lisa Anderson",
    email: "lisa.anderson../../..example.com",
    status: "Active",
    logins: 76,
    orders: 14,
    lastLogin: "2024-01-12 12:45:20",
    accountCreated: "2023-07-03",
    totalBuyingAmount: 1789.65,
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

UsersTable.propTypes = {
  selectedUsers: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  filters: PropTypes.any,
};

export function UsersTable({ selectedUsers, onSelectionChange, filters }) {
  const [sortDirection, setSortDirection] = useState("asc")
    const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
const [sortField, setSortField] = useState("") 
  const handleSort = (field) =>{
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === mockUsers.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(mockUsers.map((user) => user.id))
    }
  }

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      onSelectionChange(selectedUsers.filter((id) => id !== userId))
    } else {
      onSelectionChange([...selectedUsers, userId])
    }
  }

  // Filter and sort users
  const filteredUsers = mockUsers.filter((user) => {
    if (
      filters.search &&
      !user.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !user.email.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }
    if (filters.status !== "all" && user.status.toLowerCase() !== filters.status) {
      return false
    }
    if (filters.minSpent && user.totalBuyingAmount < Number.parseFloat(filters.minSpent)) {
      return false
    }
    if (filters.maxSpent && user.totalBuyingAmount > Number.parseFloat(filters.maxSpent)) {
      return false
    }
    return true
  })

  // Sort users
 if (sortField) {
  filteredUsers.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
}

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox checked={selectedUsers.length === mockUsers.length} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Logins</TableHead>
              <TableHead className="text-center">Orders</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("accountCreated")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Account Created
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("totalBuyingAmount")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Total Buying Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleSelectUser(user.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                </TableCell>
                <TableCell className="text-center">{user.logins}</TableCell>
                <TableCell className="text-center">{user.orders}</TableCell>
                <TableCell className="text-gray-600">{user.lastLogin}</TableCell>
                <TableCell className="text-gray-600">{user.accountCreated}</TableCell>
                <TableCell className="font-semibold text-green-600">${user.totalBuyingAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Activity
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === "Active" ? (
                        <DropdownMenuItem>
                          <UserX className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
          {filteredUsers.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
