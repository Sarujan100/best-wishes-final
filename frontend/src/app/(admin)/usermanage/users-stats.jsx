import { Card, CardContent } from "../../../components/ui/card"
import { Users, UserCheck, UserX, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Active Users",
    value: "2,234",
    change: "+8.2%",
    icon: UserCheck,
    color: "bg-green-500",
  },
  {
    title: "Inactive Users",
    value: "613",
    change: "-3.1%",
    icon: UserX,
    color: "bg-red-500",
  },
  {
    title: "Total Revenue",
    value: "$1,247,892",
    change: "+18.7%",
    icon: DollarSign,
    color: "bg-purple-500",
  },
]
export function UsersStats() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 font-medium">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
