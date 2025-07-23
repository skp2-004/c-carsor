'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Menu, User, FileText, History, BarChart3, Users, Settings } from 'lucide-react';

interface MobileSidebarProps {
  userType: 'vehicle_owner' | 'service_provider';
  activeTab: string;
  onTabChange: (tab: string) => void;
  userName?: string;
}

export default function MobileSidebar({ userType, activeTab, onTabChange, userName }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const vehicleOwnerTabs = [
    { id: 'report', label: 'Report Issue', icon: FileText },
    { id: 'history', label: 'Issue History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const serviceProviderTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const tabs = userType === 'vehicle_owner' ? vehicleOwnerTabs : serviceProviderTabs;

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="mobile-nav fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="glass-effect border-white/20 hover:bg-white/20"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 sidebar-overlay md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`mobile-sidebar ${isOpen ? 'open' : ''} fixed top-0 left-0 h-full w-80 z-50 md:hidden`}>
        <div className="h-full glass-effect border-r border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{userName}</h2>
                <Badge variant="outline" className="text-xs">
                  {userType === 'vehicle_owner' ? 'Vehicle Owner' : 'Service Provider'}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="p-4 space-y-2 custom-scrollbar overflow-y-auto h-[calc(100%-120px)]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'hover:bg-white/20 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}