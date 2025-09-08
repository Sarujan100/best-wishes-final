import { Button } from "../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function UsersTablePagination() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-4 sm:flex-row">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{" "}
        <span className="font-medium">100</span> results
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium">Rows per page</p>
          <Select defaultValue="10">
            <SelectTrigger className="h-8 w-16">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            1
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            2
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            3
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
