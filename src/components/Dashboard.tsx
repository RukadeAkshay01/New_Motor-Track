import React from 'react';
import { 
  Building2, 
  Settings, 
  Wrench, 
  DollarSign, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useCompanies, useJobs, useInvoices, useWarranties } from '../hooks/useSupabase';

interface DashboardProps {
  onCreateCompany: () => void;
  onCreateJob: () => void;
  onCreateMotor: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateCompany, onCreateJob, onCreateMotor }) => {
  const { companies } = useCompanies();
  const { jobs } = useJobs();
  const { invoices } = useInvoices();
  const { warranties } = useWarranties();

  // Calculate real metrics from database
  const activeCompanies = companies.filter(c => c.status === 'active').length;
  const totalMotors = companies.reduce((sum, c) => sum + c.motor_count, 0);
  const jobsThisMonth = jobs.filter(j => {
    const jobDate = new Date(j.created_at);
    const now = new Date();
    return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
  }).length;
  const monthlyRevenue = invoices
    .filter(inv => {
      if (inv.status !== 'paid' || !inv.paid_date) return false;
      const paidDate = new Date(inv.paid_date);
      const now = new Date();
      return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const metrics = [
    {
      title: 'Active Companies',
      value: activeCompanies.toString(),
      change: '+12%',
      trend: 'up',
      icon: Building2,
      color: 'blue'
    },
    {
      title: 'Motors in Database',
      value: totalMotors.toString(),
      change: '+8%',
      trend: 'up',
      icon: Settings,
      color: 'purple'
    },
    {
      title: 'Jobs This Month',
      value: jobsThisMonth.toString(),
      change: '+18%',
      trend: 'up',
      icon: Wrench,
      color: 'green'
    },
    {
      title: 'Monthly Revenue',
      value: `$${monthlyRevenue.toLocaleString()}`,
      change: '+24%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald'
    }
  ];

  // Get recent jobs from database
  const recentActivity = jobs
    .slice(0, 5)
    .map(job => ({
      id: job.job_number,
      company: companies.find(c => c.id === job.company_id)?.name || 'Unknown Company',
      status: job.status,
      date: new Date(job.updated_at).toLocaleDateString(),
      description: job.description.substring(0, 50) + '...'
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-24 lg:pb-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Welcome back!</h1>
            <p className="text-blue-100 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <button 
              onClick={onCreateJob}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                  <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {metric.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Company Activity Overview</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View All Companies
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {companies.slice(0, 5).map((company) => {
                const companyJobs = jobs.filter(j => j.company_id === company.id);
                const activeJobs = companyJobs.filter(j => ['pending', 'in_progress'].includes(j.status));
                const completedJobs = companyJobs.filter(j => ['completed', 'delivered'].includes(j.status));
                const totalEstimatedValue = activeJobs.reduce((sum, job) => sum + (job.estimated_cost || 0), 0);
                const lastActivity = companyJobs.length > 0 
                  ? new Date(Math.max(...companyJobs.map(j => new Date(j.updated_at).getTime())))
                  : new Date(company.updated_at);
                
                return (
                  <div key={company.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{company.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
                          {company.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Active Jobs</p>
                          <p className="font-semibold text-blue-600">{activeJobs.length}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Total Motors</p>
                          <p className="font-semibold text-gray-900">{company.motor_count}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Completed</p>
                          <p className="font-semibold text-green-600">{completedJobs.length}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Est. Value</p>
                          <p className="font-semibold text-green-600">${totalEstimatedValue.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Contact: {company.contact_name}</p>
                        <p className="text-xs text-gray-500">
                          Last activity: {lastActivity.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {companies.length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No companies yet</p>
                  <button 
                    onClick={onCreateCompany}
                    className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Add your first company
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <button 
              onClick={onCreateJob}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Wrench className="h-5 w-5" />
              <span>Create Job</span>
            </button>
            <button 
              onClick={onCreateCompany}
              className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Building2 className="h-5 w-5" />
              <span>Add Company</span>
            </button>
            <button 
              onClick={onCreateMotor}
              className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Settings className="h-5 w-5" />
              <span>Add Motor</span>
            </button>
            
            {/* Alerts Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">Alerts & Reminders</h3>
              
              {(() => {
                const jobsDueThisWeek = jobs.filter(job => {
                  const dueDate = new Date(job.due_date || '');
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return dueDate >= today && dueDate <= weekFromNow && ['pending', 'in_progress'].includes(job.status);
                }).length;

                const overdueInvoices = invoices.filter(invoice => {
                  const dueDate = new Date(invoice.due_date);
                  const today = new Date();
                  return dueDate < today && invoice.status !== 'paid';
                }).length;

                const warrantiesExpiringSoon = warranties.filter(warranty => {
                  const endDate = new Date(warranty.warranty_end);
                  const today = new Date();
                  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                  return endDate >= today && endDate <= thirtyDaysFromNow && warranty.status === 'active';
                }).length;

                const hasAlerts = jobsDueThisWeek > 0 || overdueInvoices > 0 || warrantiesExpiringSoon > 0;

                if (!hasAlerts) {
                  return (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">All caught up!</p>
                        <p className="text-xs text-green-600">No urgent items require attention</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {jobsDueThisWeek > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-orange-800">{jobsDueThisWeek} jobs due this week</p>
                          <p className="text-xs text-orange-600">Review upcoming deadlines</p>
                        </div>
                      </div>
                    )}
                    
                    {overdueInvoices > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800">{overdueInvoices} invoices overdue</p>
                          <p className="text-xs text-red-600">Follow up on payments</p>
                        </div>
                      </div>
                    )}
                    
                    {warrantiesExpiringSoon > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-800">{warrantiesExpiringSoon} warranties expiring soon</p>
                          <p className="text-xs text-blue-600">Consider renewals</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;