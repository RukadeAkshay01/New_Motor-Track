import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Settings, 
  Wrench, 
  Receipt, 
  Shield, 
  BarChart3,
  Menu,
  X,
  Database
} from 'lucide-react';

// Import all components
import Dashboard from './components/Dashboard';
import Companies from './components/Companies';
import Motors from './components/Motors';
import Jobs from './components/Jobs';
import Invoices from './components/Invoices';
import Warranties from './components/Warranties';
import Reports from './components/Reports';
import NotificationDropdown from './components/NotificationDropdown';
import ProfileDropdown from './components/ProfileDropdown';
import DatabaseStatus from './components/DatabaseStatus';
import CreateCompanyModal from './components/CreateCompanyModal';
import CreateJobModal from './components/CreateJobModal';
import CreateMotorModal from './components/CreateMotorModal';
import AuthScreen from './components/AuthScreen';

type ActiveView = 'dashboard' | 'companies' | 'motors' | 'jobs' | 'invoices' | 'warranties' | 'reports';

// Define types for form data to maintain state between steps
export interface CompanyFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  // Add other company fields as needed
}

export interface MotorFormData {
  company_id: string;
  motor_id: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  type: string;
  voltage: string;
  amperage: string;
  power: string;
  phase: string;
  frequency: string;
  rpm: string;
  condition: string;
  location: string;
  technical_notes: string;
}

export interface JobFormData {
  title: string;
  description: string;
  priority: string;
  // Add other job fields as needed
}

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDatabaseStatus, setShowDatabaseStatus] = useState(false);
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showCreateMotorModal, setShowCreateMotorModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  
  // State to hold form data between steps
  const [companyFormData, setCompanyFormData] = useState<CompanyFormData>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [motorFormData, setMotorFormData] = useState<MotorFormData>({
    model: '',
    serialNumber: '',
    power: '',
    voltage: ''
  });
  
  const [jobFormData, setJobFormData] = useState<JobFormData>({
    title: '',
    description: '',
    priority: ''
  });

  // Check for existing authentication on app load
  useEffect(() => {
    const savedAuth = localStorage.getItem('motortrack_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        if (authData.isAuthenticated && authData.username) {
          setIsAuthenticated(true);
          setCurrentUser(authData.username);
        }
      } catch (err) {
        // Invalid auth data, clear it
        localStorage.removeItem('motortrack_auth');
      }
    }
  }, []);

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('motortrack_auth');
    setIsAuthenticated(false);
    setCurrentUser('');
    setActiveView('dashboard');
  };

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' as ActiveView },
    { name: 'Companies', icon: Building2, key: 'companies' as ActiveView },
    { name: 'Motors', icon: Settings, key: 'motors' as ActiveView },
    { name: 'Jobs', icon: Wrench, key: 'jobs' as ActiveView },
    { name: 'Invoices', icon: Receipt, key: 'invoices' as ActiveView },
    { name: 'Warranties', icon: Shield, key: 'warranties' as ActiveView },
    { name: 'Reports', icon: BarChart3, key: 'reports' as ActiveView },
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard 
          onCreateCompany={() => setShowCreateCompanyModal(true)}
          onCreateJob={() => setShowCreateJobModal(true)}
          onCreateMotor={() => setShowCreateMotorModal(true)}
        />;
      case 'companies':
        return <Companies />;
      case 'motors':
        return <Motors />;
      case 'jobs':
        return <Jobs />;
      case 'invoices':
        return <Invoices />;
      case 'warranties':
        return <Warranties />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard 
          onCreateCompany={() => setShowCreateCompanyModal(true)}
          onCreateJob={() => setShowCreateJobModal(true)}
          onCreateMotor={() => setShowCreateMotorModal(true)}
        />;
    }
  };

  const getPageTitle = () => {
    const currentNav = navigation.find(nav => nav.key === activeView);
    return currentNav ? currentNav.name : 'Dashboard';
  };

  // Reset form data when modals are closed
  const handleCloseCompanyModal = () => {
    setCompanyFormData({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    setShowCreateCompanyModal(false);
  };

  const handleCloseMotorModal = () => {
    setMotorFormData({
      model: '',
      serialNumber: '',
      power: '',
      voltage: ''
    });
    setShowCreateMotorModal(false);
  };

  const handleCloseJobModal = () => {
    setJobFormData({
      title: '',
      description: '',
      priority: ''
    });
    setShowCreateJobModal(false);
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">MotorTrack</h1>
              <p className="text-xs text-gray-500">Pro Edition</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.key;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveView(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Database Status Button */}
        <div className="absolute bottom-4 left-3 right-3">
          <button
            onClick={() => setShowDatabaseStatus(true)}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Database className="mr-3 h-5 w-5 text-gray-400" />
            Database Status
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top header */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-5 w-5 text-gray-500" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              <ProfileDropdown 
                onViewProfile={() => console.log('View Profile')}
                onSystemSettings={() => console.log('System Settings')}
                onSecurity={() => console.log('Security')}
                onHelp={() => console.log('Help & Support')}
                onSignOut={handleLogout}
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {renderActiveView()}
        </main>
      </div>

      {/* Database Status Modal */}
      {showDatabaseStatus && (
        <DatabaseStatus onClose={() => setShowDatabaseStatus(false)} />
      )}

      {/* Global Modals */}
      {showCreateCompanyModal && (
        <CreateCompanyModal 
          onClose={handleCloseCompanyModal}
          onSuccess={() => {
            handleCloseCompanyModal();
            if (activeView !== 'companies') {
              setActiveView('companies');
            }
          }}
          formData={companyFormData}
          setFormData={setCompanyFormData}
        />
      )}

      {showCreateJobModal && (
        <CreateJobModal 
          onClose={handleCloseJobModal}
          onSuccess={() => {
            handleCloseJobModal();
            if (activeView !== 'jobs') {
              setActiveView('jobs');
            }
          }}
          formData={jobFormData}
          setFormData={setJobFormData}
        />
      )}

      {showCreateMotorModal && (
        <CreateMotorModal 
          onClose={handleCloseMotorModal}
          onSuccess={() => {
            handleCloseMotorModal();
            if (activeView !== 'motors') {
              setActiveView('motors');
            }
          }}
          formData={motorFormData}
          setFormData={setMotorFormData}
        />
      )}
    </div>
  );
}

export default App;