'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Globe, Mail, Shield, Database, Bell, Palette } from 'lucide-react';
import Link from 'next/link';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  enableAnalytics: boolean;
  enableNewsletter: boolean;
  maintenanceMode: boolean;
  allowRegistration: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Torch Group',
    siteDescription: 'Professional services and solutions',
    siteUrl: 'https://torchgroup.com',
    contactEmail: 'contact@torchgroup.com',
    enableAnalytics: true,
    enableNewsletter: true,
    maintenanceMode: false,
    allowRegistration: false,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/site-config');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/site-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof SiteSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsCards = [
    {
      title: 'Site Configuration',
      description: 'Basic site information and metadata',
      icon: Globe,
      href: '/dashboard/settings/site',
      color: 'blue',
    },
    {
      title: 'Email Templates',
      description: 'Customize email notifications and templates',
      icon: Mail,
      href: '/dashboard/settings/email-templates',
      color: 'green',
    },
    {
      title: 'User Management',
      description: 'Manage users, roles and permissions',
      icon: Shield,
      href: '/dashboard/settings/users',
      color: 'purple',
    },
    {
      title: 'Homepage Sections',
      description: 'Configure homepage layout and content',
      icon: Palette,
      href: '/dashboard/settings/homepage-sections',
      color: 'yellow',
    },
    {
      title: 'About Torch',
      description: 'Manage about page content and information',
      icon: Database,
      href: '/dashboard/settings/about-torch',
      color: 'red',
    },
    {
      title: 'Notifications',
      description: 'Configure system notifications and alerts',
      icon: Bell,
      href: '/dashboard/settings/notifications',
      color: 'indigo',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      green: 'bg-green-500/10 text-green-400 border-green-500/20',
      purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      red: 'bg-red-500/10 text-red-400 border-red-500/20',
      indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your site configuration and preferences.</p>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-500/10 rounded-lg">
            <Settings className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Quick Settings</h2>
            <p className="text-gray-400">Common configuration options</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site URL
            </label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => handleInputChange('siteUrl', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site Description
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleInputChange('siteDescription', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Analytics Tracking</h3>
              <p className="text-sm text-gray-400">Enable website analytics</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableAnalytics}
                onChange={(e) => handleInputChange('enableAnalytics', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Newsletter Signup</h3>
              <p className="text-sm text-gray-400">Allow newsletter subscriptions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNewsletter}
                onChange={(e) => handleInputChange('enableNewsletter', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
            <div>
              <h3 className="text-white font-medium">Maintenance Mode</h3>
              <p className="text-sm text-gray-400">Put site in maintenance mode</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
            <div>
              <h3 className="text-white font-medium">User Registration</h3>
              <p className="text-sm text-gray-400">Allow new user registration</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={saveSettings}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          
          {saved && (
            <span className="text-green-400 text-sm font-medium">
              Settings saved successfully!
            </span>
          )}
        </div>
      </div>

      {/* Settings Categories */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Configuration Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 hover:bg-gray-800/70 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Version</h3>
            <p className="text-white font-semibold">1.0.0</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Environment</h3>
            <p className="text-white font-semibold">Production</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Database</h3>
            <p className="text-green-400 font-semibold">Connected</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Last Backup</h3>
            <p className="text-white font-semibold">2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
} 