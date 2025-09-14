import { TabsList, TabsTrigger } from "@/components/ui/tabs"

export function OrderTabs({ orders }) {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="accepted" className="text-xs sm:text-sm">
        🔵 Accepted ({orders.filter((d) => d.status === "accepted").length})
      </TabsTrigger>
      <TabsTrigger value="packed" className="text-xs sm:text-sm">
        🟣 Packed ({orders.filter((d) => d.status === "packed_ready").length})
      </TabsTrigger>
      <TabsTrigger value="delivery" className="text-xs sm:text-sm">
        🚚 Delivery ({orders.filter((d) => d.status === "out_for_delivery" || d.status === "delivered").length})
      </TabsTrigger>
      <TabsTrigger value="all" className="text-xs sm:text-sm">
        📋 All ({orders.length})
      </TabsTrigger>
    </TabsList>
  )
}
