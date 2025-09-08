"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { UsersTable } from "./users-table"
import { UsersFilters } from "./user-filters"
import { UsersBulkActions } from "./users-bulk-actions"
import { UsersStats } from "./users-stats"

export function UsersManagement() {
  const [selectedUsers, setSelectedUsers] = useState([])
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: "all",
    minSpent: "",
    maxSpent: "",
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage your system users and track their activities</p>
        </div>
      </div>

      <UsersStats />

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <UsersFilters filters={filters} onFiltersChange={setFilters} />

          {selectedUsers.length > 0 && (
            <UsersBulkActions selectedCount={selectedUsers.length} onClearSelection={() => setSelectedUsers([])} />
          )}

          <UsersTable selectedUsers={selectedUsers} onSelectionChange={setSelectedUsers} filters={filters} />
        </CardContent>
      </Card>
    </div>
  )
}
