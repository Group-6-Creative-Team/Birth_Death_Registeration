import { useState } from 'react'; 
import { 
  Globe,
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  Bell,
  Settings,
  UserCircleIcon
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import logoo from '../assets/logoo.png'; // Adjust the import path based on your file structure

export default function DashboardLayout({ children }) {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isReportsOpen, setIsReportsOpen] = useState(true); // Keep Reports open by default
  const location = useLocation();
  const { user } = useUser();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b">
          <img src={logoo} alt="Logo" className="h-10 mr-2" /> {/* Adjust height as needed */}
          <span className="font-bold text-xl text-blue-700">B&D </span>
          <span className="pt-10 font-bold text-xl text-gray-900">Registration  </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive('/dashboard') ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          {/* Registration Section */}
          <div className="space-y-1">
            <button
              onClick={() => setIsRegistrationOpen(!isRegistrationOpen)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full ${
                ['/address', '/birth', '/death', '/payment-method', '/users'].includes(location.pathname)
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="h-5 w-5" />
              <span className="font-medium flex-1 text-left">Registration</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isRegistrationOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRegistrationOpen && (
              <div className="pl-11 space-y-1">
                <Link
                  to="/address"
                  className={`block px-3 py-2 rounded-lg ${
                    isActive('/address') ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  District
                </Link>
                <Link
                  to="/birth"
                  className={`block px-3 py-2 rounded-lg ${
                    isActive('/birth') ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Birth
                </Link>
                <Link
                  to="/death"
                  className={`block px-3 py-2 rounded-lg ${
                    isActive('/death') ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Death
                </Link>
                <Link
                  to="/payment-method"
                  className={`block px-3 py-2 rounded-lg ${
                    isActive('/payment-method') ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Payment Method
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/users"
                    className={`block px-3 py-2 rounded-lg ${
                      isActive('/users') ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Users
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Reports Section */}
          <div className="space-y-1">
            <button
              onClick={() => setIsReportsOpen(!isReportsOpen)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full ${
                ['/approved-birth-certificates', '/approved-death-certificates'].includes(location.pathname)
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="h-5 w-5" />
              <span className="font-medium flex-1 text-left">Reports</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isReportsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isReportsOpen && (
              <div className="pl-11 space-y-1">
                <Link
                  to="/approved-birth-certificates"
                  className={`block px-3 py-2 rounded-lg ${
                    isActive('/approved-birth-certificates') ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Approved Birth Certificates
                </Link>
                <Link
                  to="/approved-death-certificates"
                  className={`block px-3 py-2 rounded-lg ${
                    isActive('/approved-death-certificates') ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Approved Death Certificates
                </Link>
              </div>
            )}
          </div>

          {/* Logout Section */}
          <div className="mt-auto">
            <Link
              to="/logout" // Adjust the path as needed
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100`}
            >
              <span className="font-medium flex-1 text-left">Logout</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Other header content (if any) */}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Globe className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 pl-4 border-l">
              {/* User Icon */}
              <UserCircleIcon className="h-8 w-8 text-gray-600" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Hello,</span>
                <span className="font-medium text-purple-500">{user?.name || 'User'}</span>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
