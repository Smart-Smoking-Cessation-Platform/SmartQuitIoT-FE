import CoachDashboardCard from "@/pages/admin/components/dashboard/CoachDashboardCard";
import MemberDashboardCard from "@/pages/admin/components/dashboard/MemberDashboardCard";
import MembershipPackageDashboardCard from "@/pages/admin/components/dashboard/MembershipPackageDashboardCard";
import PaymentDashboardCard from "@/pages/admin/components/dashboard/PaymentDashboardCard";

const AdminPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of system statistics and recent activitys
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MemberDashboardCard />
        <CoachDashboardCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MembershipPackageDashboardCard />
        <PaymentDashboardCard />
      </div>

      {/* Recent Activity */}
      {/* <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>
            Recent system events and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registration</p>
                <p className="text-xs text-gray-500">
                  John Doe registered 5 minutes ago
                </p>
              </div>
              <span className="text-xs text-gray-400">5m ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Device connected</p>
                <p className="text-xs text-gray-500">
                  Smart Thermostat #001 came online
                </p>
              </div>
              <span className="text-xs text-gray-400">10m ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">System warning</p>
                <p className="text-xs text-gray-500">
                  High humidity detected in Storage Room
                </p>
              </div>
              <span className="text-xs text-gray-400">15m ago</span>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default AdminPage;
