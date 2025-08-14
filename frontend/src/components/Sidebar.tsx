import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  TrendingUp, 
  Users, 
  Tag, 
  Bell, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Stores', href: '/stores', icon: Store },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Sales & Finance', href: '/sales', icon: TrendingUp },
    { name: 'Staff', href: '/staff', icon: Users },
    { name: 'Promotions', href: '/promotions', icon: Tag },
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 overlay-prevention">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600">Cluster Admin</h1>
        <p className="text-gray-600 text-sm mt-1">Multi-Store Management</p>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-6 h-6 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Cluster Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
