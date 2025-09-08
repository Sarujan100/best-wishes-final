"use client"
import PropTypes from "prop-types";
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { UserCheck, UserX, Trash2, Mail } from "lucide-react"

UsersBulkActions.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onClearSelection: PropTypes.func.isRequired,
};

export function UsersBulkActions({ selectedCount, onClearSelection }) {  return (
    <div className="flex items-center justify-between rounded-lg border bg-blue-50 p-4">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{selectedCount} selected</Badge>
        <Button variant="link" onClick={onClearSelection} className="h-auto p-0">
          Clear selection
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <UserCheck className="h-4 w-4" />
          Activate
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <UserX className="h-4 w-4" />
          Deactivate
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Mail className="h-4 w-4" />
          Send Email
        </Button>
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  )
}
