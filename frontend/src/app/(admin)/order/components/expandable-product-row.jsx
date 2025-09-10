import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TableRow, TableCell } from "@/components/ui/table"
import { ShoppingBag } from "lucide-react"

export function ExpandableProductRow({ order, isExpanded }) {
  if (!isExpanded) return null

  return (
    <TableRow>
      <TableCell colSpan={8} className="bg-gray-50 p-0">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-blue-600">Product Details ({order.items.length} products)</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {order.items.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg border"
                    />
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">SKU: {item.sku}</div>
                        <div className="text-xs text-muted-foreground">Category: {item.category}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Qty: </span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price: </span>
                          <span className="font-medium">${item.price}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Weight: </span>
                          <span className="font-medium">{item.weight}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total: </span>
                          <span className="font-bold text-green-600">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      <Badge variant={item.status === "in_stock" ? "default" : "secondary"} className="text-xs">
                        {(item.status || "unknown").replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between items-center pt-3 border-t">
            <div className="text-sm text-muted-foreground">
              Total Weight: {order.items.reduce((sum, item) => sum + Number.parseFloat(item.weight), 0).toFixed(1)} lbs
            </div>
            <div className="text-lg font-bold text-green-600">Order Total: ${order.totalAmount}</div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}
