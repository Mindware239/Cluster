import React, { useState } from 'react';
import { Save, Settings as SettingsIcon, User, Store, Shield, Bell, Palette, Database, Globe } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    companyName: 'Multi-Store Cluster Admin',
    timezone: 'UTC-5',
    language: 'English',
    notifications: true,
    darkMode: false,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'stores', label: 'Store Settings', icon: Store },
    { id: 'users', label: 'User Management', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Database }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-lg text-gray-600 mt-2">Configure system preferences and settings</p>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-lg"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                    className="input-field w-full"
                  >
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC-6">Central Time (UTC-6)</option>
                    <option value="UTC-7">Mountain Time (UTC-7)</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                    className="input-field w-full"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Store Settings */}
          {activeTab === 'stores' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Store Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Store Sync</h4>
                  <p className="text-sm text-gray-600 mb-3">Configure automatic synchronization between stores</p>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Enable real-time sync</span>
                  </label>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Inventory Management</h4>
                  <p className="text-sm text-gray-600 mb-3">Set inventory thresholds and alerts</p>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Low stock alerts</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">User Management</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Role Permissions</h4>
                <p className="text-sm text-gray-600 mb-3">Configure user roles and access levels</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Cluster Admin - Full access</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Store Manager - Store-level access</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Cashier - Limited access</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input type="number" defaultValue="30" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                  <select className="input-field w-full">
                    <option>Strong (8+ chars, symbols)</option>
                    <option>Medium (6+ chars)</option>
                    <option>Basic (4+ chars)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium">Enable email notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm font-medium">Low stock alerts</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm font-medium">System maintenance notifications</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm font-medium">Marketing promotions</span>
                </label>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Appearance Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium">Dark mode</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
                  <div className="flex gap-2">
                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto Backup</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                    className="input-field w-full"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (days)</label>
                  <input type="number" defaultValue="90" className="input-field w-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
