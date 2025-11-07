import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Activity, Users, Clock, BarChart3 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import DashboardTab from '@/components/admin/DashboardTab';
import SecurityLogsTab from '@/components/admin/SecurityLogsTab';
import UsersManagementTab from '@/components/admin/UsersManagementTab';
import RateLimitsTab from '@/components/admin/RateLimitsTab';

const AdminDashboard = () => {
  const { isAdmin, loading } = useIsAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Surveillance de la sécurité et gestion des utilisateurs
            </p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <Activity className="h-4 w-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="rate-limits" className="gap-2">
              <Clock className="h-4 w-4" />
              Rate Limits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>

          <TabsContent value="logs">
            <SecurityLogsTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersManagementTab />
          </TabsContent>

          <TabsContent value="rate-limits">
            <RateLimitsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
